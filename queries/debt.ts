import prisma from "@/prisma/client"
import { withEntityId } from "@/schema/utils"
import { getMonthFilter } from "@/server/utils"
import { DebtStatus, InstallmentPlanItemStatus } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { format } from "date-fns"
import * as z from "zod"

import { getUser } from "./user"

interface WidgetParams {
  month?: string
}

const getDebtsInputSchema = z.object({
  sort: z.string().optional(),
  order: z.string().optional(),
  search: z.string().optional(),
  status: z.nativeEnum(DebtStatus).optional(),
  limit: z.number().optional(),
})

type GetDebtsInput = z.infer<typeof getDebtsInputSchema>

export const getDebts = async (input: GetDebtsInput) => {
  try {
    const parsedInput = getDebtsInputSchema.safeParse(input)

    if (!parsedInput.success) return []

    const user = await getUser()

    const sort = input.sort ?? "createdAt"
    const order = input.order ?? "desc"

    const result = await prisma.debt.findMany({
      where: {
        user_id: user?.id,
        status: input.status ?? undefined,
        nickname: {
          contains: input.search,
          mode: "insensitive",
        },
      },

      take: input.limit,

      include: {
        installment_plans: {
          orderBy: {
            payment_date: "asc",
          },
        },
      },

      orderBy: {
        [sort]: order,
      },
    })

    return result
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw error.message
    }
    throw "Get Debts: Server Error"
  }
}

export type DebtItem = Awaited<ReturnType<typeof getDebts>>[number]

export const getDebtsGroupedByCategory = async ({ month }: WidgetParams) => {
  try {
    const user = await getUser()

    const { startDate, endDate } = getMonthFilter(month)

    const remainingBalances = await prisma.debt.findMany({
      where: {
        user_id: user?.id,
        status: DebtStatus.IN_PROGRESS,
      },
      select: {
        id: true,
        category: true,
        installment_plans: {
          where: {
            status: {
              not: InstallmentPlanItemStatus.PAID,
            },
            payment_date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      orderBy: {
        balance: "desc",
      },
    })

    const balanceByCategory = new Map<string, { remainingBalance: number }>()

    remainingBalances.forEach((item) => {
      const balanceSum = item.installment_plans.reduce(
        (total, ip) => total + ip.payment_amount,
        0
      )

      if (balanceSum > 0) {
        if (balanceByCategory.has(item.category)) {
          const bal =
            balanceByCategory.get(item.category)?.remainingBalance ?? 0

          balanceByCategory.set(item.category, {
            remainingBalance: bal + balanceSum,
          })
        } else {
          balanceByCategory.set(item.category, { remainingBalance: balanceSum })
        }
      }
    })

    const data = Object.entries(Object.fromEntries(balanceByCategory)).map(
      ([category, balance]) => {
        return {
          category,
          balance: balance.remainingBalance as number,
        }
      }
    )

    return data
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw error.message
    }
    throw "Get Debts Grouped by Category: Server Error"
  }
}

const getDebtByIdSchema = withEntityId.merge(
  z.object({
    status: z.nativeEnum(InstallmentPlanItemStatus).optional(),
  })
)

type GetDebtByIdInput = z.infer<typeof getDebtByIdSchema>

export const getDebtById = async (input: GetDebtByIdInput) => {
  try {
    const user = await getUser()

    const parsedInput = getDebtByIdSchema.safeParse(input)

    if (!parsedInput.success) return null

    if (input.status === InstallmentPlanItemStatus.PAST_DUE) {
      const debt = await prisma.debt.findUnique({
        where: { id: input.id, user_id: user?.id },
        include: {
          installment_plans: {
            where: {
              status: InstallmentPlanItemStatus.UPCOMING,
              payment_date: {
                lt: format(new Date(), "yyyy-MM-dd"),
              },
            },
            orderBy: {
              payment_date: "asc",
            },
          },
        },
      })

      return debt
    }

    const debt = await prisma.debt.findUnique({
      where: { id: input.id, user_id: user?.id },
      include: {
        installment_plans: {
          // where: {
          //   status: input.status ?? InstallmentPlanItemStatus.UPCOMING,
          //   // NOT: {
          //   //   payment_date: {
          //   //     lt: format(new Date(), "yyyy-MM-dd"),
          //   //   },
          //   // },
          // },
          orderBy: {
            payment_date: "asc",
          },
        },
      },
    })

    return debt
  } catch (error) {
    if (typeof error === "string") throw error

    throw "Get Debt: Server Error"
  }
}

export const getDebtPayoffProgress = async ({ month }: WidgetParams) => {
  try {
    const user = await getUser()

    const { startDate, endDate } = getMonthFilter(month)

    const paid = await prisma.installmentPlanItem.aggregate({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: InstallmentPlanItemStatus.PAID,
        payment_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        payment_amount: true,
      },
    })

    const unpaid = await prisma.installmentPlanItem.aggregate({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: {
          not: InstallmentPlanItemStatus.PAID,
        },
        payment_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        payment_amount: true,
      },
    })

    // const nextDueQuery = prisma.installmentPlanItem.findFirst({
    //   where: {
    //     debt: {
    //       user_id: user?.id,
    //     },
    //     status: InstallmentPlanItemStatus.UPCOMING,
    //   },
    //   include: {
    //     debt: {
    //       select: {
    //         nickname: true,
    //       },
    //     },
    //   },
    //   orderBy: {
    //     payment_date: "asc",
    //   },
    // })

    const lastPayments = await prisma.installmentPlanItem.findMany({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: InstallmentPlanItemStatus.PAID,
        payment_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        debt: {
          select: {
            nickname: true,
            category: true,
          },
        },
      },
      orderBy: {
        actual_payment_date: "desc",
      },
    })

    // const [nextDue, lastPayment] = await Promise.all([
    //   nextDueQuery,
    //   lastPaymentQuery,
    // ])

    const payoffData = {
      paid: paid._sum.payment_amount ?? 0,
      unpaid: unpaid._sum.payment_amount ?? 0,
      lastPayments,
      // nextDue,
    }

    return payoffData
  } catch (error) {
    if (typeof error === "string") throw error

    throw "Get Debt Payoff Progress: Server Error"
  }
}

export const getBalancesByCategory = async ({ month }: WidgetParams) => {
  try {
    const user = await getUser()

    const { startDate, endDate } = getMonthFilter(month)

    const remainingBalances = await prisma.debt.findMany({
      where: {
        user_id: user?.id,
      },
      select: {
        id: true,
        category: true,
        installment_plans: {
          where: {
            payment_date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      orderBy: {
        balance: "desc",
      },
    })

    const balanceByCategory = new Map<
      string,
      { balance: number; paid: number; total: number }
    >()

    remainingBalances.forEach((item) => {
      const totalSum = item.installment_plans.reduce(
        (total, ip) => total + ip.payment_amount,
        0
      )

      const balanceSum = item.installment_plans
        .filter((i) => i.status === InstallmentPlanItemStatus.UPCOMING)
        .reduce((total, ip) => total + ip.payment_amount, 0)

      const paidSum = item.installment_plans
        .filter((i) => i.status === InstallmentPlanItemStatus.PAID)
        .reduce((total, ip) => total + ip.payment_amount, 0)

      if (balanceByCategory.has(item.category)) {
        const current = balanceByCategory.get(item.category)

        const bal = current?.balance ?? 0
        const paid = current?.paid ?? 0
        const total = current?.total ?? 0

        balanceByCategory.set(item.category, {
          balance: bal + balanceSum,
          paid: paid + paidSum,
          total: total + totalSum,
        })
      } else {
        balanceByCategory.set(item.category, {
          balance: balanceSum,
          paid: paidSum,
          total: totalSum,
        })
      }
    })

    const data = Object.entries(Object.fromEntries(balanceByCategory))
      .map(([category, value]) => {
        return {
          category,
          balance: value.balance as number,
          paid: value.paid as number,
          total: value.total as number,
        }
      })
      .filter((i) => i.balance !== 0)

    return data
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw error.message
    }
    throw "Get Balances by Category: Server Error"
  }
}

export async function getDebtsForMonth({ month }: WidgetParams) {
  try {
    const user = await getUser()

    const { startDate, endDate } = getMonthFilter(month)

    const debtsForMonth = await prisma.installmentPlanItem.findMany({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: InstallmentPlanItemStatus.UPCOMING,
        payment_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        debt: {
          select: { nickname: true, category: true },
        },
      },
      // take: 3,
      orderBy: {
        payment_date: "asc",
      },
    })

    return debtsForMonth
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw error.message
    }
    throw "Get Debts for Month: Server Error"
  }
}

export async function getPastDueDebts() {
  try {
    const user = await getUser()

    const now = new Date()

    const pastDueDebts = await prisma.installmentPlanItem.findMany({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: InstallmentPlanItemStatus.UPCOMING,
        payment_date: {
          lt: format(now, "yyyy-MM-dd"),
        },
      },
      include: {
        debt: {
          select: { nickname: true, category: true },
        },
      },
      take: 3,
      orderBy: {
        payment_date: "asc",
      },
    })

    return pastDueDebts
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw error.message
    }
    throw "Get Past Due Debts: Server Error"
  }
}
