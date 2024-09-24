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
})

type GetDebtsInput = z.infer<typeof getDebtsInputSchema>

export const getDebts = async (input: GetDebtsInput) => {
  try {
    const parsedInput = getDebtsInputSchema.safeParse(input)

    if (!parsedInput.success) return []

    const user = await getUser()

    const sort = input.sort ?? "balance"
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

      include: {
        _count: {
          select: {
            installment_plans: {
              where: {
                status: InstallmentPlanItemStatus.PAID,
              },
            },
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

    const result = await prisma.debt.groupBy({
      by: "category",
      _sum: {
        balance: true,
      },
      where: {
        user_id: user?.id,
        status: DebtStatus.IN_PROGRESS,
      },
      orderBy: {
        _sum: {
          balance: "desc",
        },
      },
    })

    return result
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
            payment_date: "desc",
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
