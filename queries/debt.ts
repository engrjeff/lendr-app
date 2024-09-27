import prisma from "@/prisma/client"
import { withEntityId } from "@/schema/utils"
import { DebtStatus, InstallmentPlanItemStatus } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { endOfMonth, format, startOfMonth } from "date-fns"
import * as z from "zod"

import { getUser } from "./user"

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

export const getDebtsGroupedByCategory = async () => {
  try {
    const user = await getUser()

    // const result = await prisma.debt.groupBy({
    //   by: "category",
    //   _sum: {
    //     balance: true,
    //   },
    //   where: {
    //     user_id: user?.id,
    //     status: DebtStatus.IN_PROGRESS,
    //   },
    //   orderBy: {
    //     _sum: {
    //       balance: "desc",
    //     },
    //   },
    // })

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

      if (balanceByCategory.has(item.category)) {
        const bal = balanceByCategory.get(item.category)?.remainingBalance ?? 0

        balanceByCategory.set(item.category, {
          remainingBalance: bal + balanceSum,
        })
      } else {
        balanceByCategory.set(item.category, { remainingBalance: balanceSum })
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

    const debt = await prisma.debt.findUnique({
      where: { id: input.id, user_id: user?.id },
      include: {
        installment_plans: {
          where: {
            status: input.status ?? InstallmentPlanItemStatus.UPCOMING,
          },
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

export const getDebtPayoffProgress = async () => {
  try {
    const user = await getUser()

    const paid = await prisma.installmentPlanItem.aggregate({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: InstallmentPlanItemStatus.PAID,
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

    const lastPayment = await prisma.installmentPlanItem.findFirst({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: InstallmentPlanItemStatus.PAID,
      },
      include: {
        debt: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        payment_date: "asc",
      },
    })

    // const [nextDue, lastPayment] = await Promise.all([
    //   nextDueQuery,
    //   lastPaymentQuery,
    // ])

    const payoffData = {
      paid: paid._sum.payment_amount ?? 0,
      unpaid: unpaid._sum.payment_amount ?? 0,
      lastPayment,
      // nextDue,
    }

    return payoffData
  } catch (error) {
    if (typeof error === "string") throw error

    throw "Get Debt Payoff Progress: Server Error"
  }
}

export const getBalancesByCategory = async () => {
  try {
    const user = await getUser()

    const remainingBalances = await prisma.debt.findMany({
      where: {
        user_id: user?.id,
      },
      select: {
        id: true,
        category: true,
        installment_plans: true,
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

export async function getDebtsForMonth() {
  try {
    const user = await getUser()

    const startDayOfMonth = startOfMonth(new Date())
    const endDayOfMonth = endOfMonth(new Date())

    const debtsForMonth = await prisma.installmentPlanItem.findMany({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: InstallmentPlanItemStatus.UPCOMING,
        payment_date: {
          gte: format(startDayOfMonth, "yyyy-MM-dd"),
          lte: format(endDayOfMonth, "yyyy-MM-dd"),
        },
      },
      include: {
        debt: {
          select: { nickname: true },
        },
      },
      take: 5,
    })

    return debtsForMonth
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw error.message
    }
    throw "Get Debts for Month: Server Error"
  }
}
