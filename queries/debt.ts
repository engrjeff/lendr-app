import prisma from "@/prisma/client"
import { withEntityId } from "@/schema/utils"
import { DebtStatus, InstallmentPlanItemStatus } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
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
        installment_plans: true,
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

    const nextDue = await prisma.installmentPlanItem.findFirst({
      where: {
        debt: {
          user_id: user?.id,
        },
        status: InstallmentPlanItemStatus.UPCOMING,
      },
      include: {
        debt: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        payment_date: "desc",
      },
    })

    const payoffData = {
      paid: paid._sum.payment_amount ?? 0,
      unpaid: unpaid._sum.payment_amount ?? 0,
      nextDue,
    }

    return payoffData
  } catch (error) {
    if (typeof error === "string") throw error

    throw "Get Debt Payoff Progress: Server Error"
  }
}
