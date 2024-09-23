"use server"

import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import prisma from "@/prisma/client"
import {
  createDebtSchema,
  payAllInstallmentSchema,
  payInstallmentSchema,
} from "@/schema/debt"
import { withEntityId } from "@/schema/utils"
import { Debt, DebtStatus, InstallmentPlanItemStatus } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns"
import * as z from "zod"
import { inferServerActionReturnData } from "zsa"

import { authedProcedure } from "./procedures/auth"

const action = authedProcedure.createServerAction()

export const getDebtsAction = action
  .input(
    z.object({
      sort: z.string().default("balance"),
      order: z.string().default("desc"),
      search: z.string().optional(),
      status: z.nativeEnum(DebtStatus).optional(),
    })
  )
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.debt.findMany({
        where: {
          user_id: ctx.user.id,
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
          [input.sort]: input.order,
        },
      })

      return result
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error.message
      }
      throw "Get Debts: Server Error"
    }
  })

export type DebtItem = inferServerActionReturnData<
  typeof getDebtsAction
>[number]

export const getDebtsGroupedByCategory = action.handler(async ({ ctx }) => {
  try {
    const result = await prisma.debt.groupBy({
      by: "category",
      _sum: {
        balance: true,
      },
      where: {
        user_id: ctx.user.id,
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
})

export const createDebtAction = action
  .input(createDebtSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const { is_mine, lendee_email, lendee_name, ...fields } = input

      const result = await prisma.debt.create({
        data: {
          user_id: ctx.user.id,
          tracking_start_date: input.next_payment_due_date,
          ...(is_mine ? fields : input),
        },
      })

      // create installment plans
      const installmentPlans = generateInstallmentPlans(result)

      await prisma.installmentPlanItem.createMany({
        data: installmentPlans,
      })

      revalidatePath(`/debts`)

      return result
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw `${input.nickname} already exists.`
        }
      }
      console.log(error)

      throw "Create Debt: Server Error"
    }
  })

export const deleteDebtAction = action
  .input(withEntityId)
  .handler(async ({ ctx, input }) => {
    try {
      const debt = await prisma.debt.findUnique({
        where: { id: input.id },
      })

      if (!debt) throw `Cannot find debt with ID ${input.id}`

      const result = await prisma.debt.delete({
        where: {
          id: input.id,
        },
      })

      revalidatePath(`/debts`)

      return result
    } catch (error) {
      console.log(error)
      if (typeof error === "string") throw error

      throw "Delete Debt: Server Error"
    }
  })

const getDebtByIdActionArgs = withEntityId.merge(
  z.object({
    status: z
      .nativeEnum(InstallmentPlanItemStatus)
      .optional()
      .default("UPCOMING"),
  })
)

export const getDebtByIdAction = action
  .input(getDebtByIdActionArgs)
  .handler(async ({ ctx, input }) => {
    try {
      const debt = await prisma.debt.findUnique({
        where: { id: input.id },
        include: {
          installment_plans: {
            where: {
              status: input.status,
            },
            orderBy: {
              payment_date: "desc",
            },
          },
        },
      })

      if (!debt) notFound()

      return debt
    } catch (error) {
      if (typeof error === "string") throw error

      throw "Get Debt: Server Error"
    }
  })

export const payInstallmentItemAction = action
  .input(withEntityId.merge(payInstallmentSchema))
  .handler(async ({ ctx, input }) => {
    try {
      const found = await prisma.installmentPlanItem.findUnique({
        where: { id: input.id },
      })

      if (!found) throw `Cannot find installment plan item with ID ${input.id}`

      const result = await prisma.installmentPlanItem.update({
        where: { id: input.id },
        data: {
          actual_payment_date: input.actual_payment_date,
          note: input.note,
          status: InstallmentPlanItemStatus.PAID,
        },
        select: {
          debtId: true,
        },
      })

      // update the debt status if all installment plan items are already PAID
      const unpaidCount = await prisma.installmentPlanItem.count({
        where: {
          debtId: result.debtId,
          status: {
            not: InstallmentPlanItemStatus.PAID,
          },
        },
      })

      if (unpaidCount === 0) {
        await prisma.debt.update({
          where: { id: result.debtId },
          data: { status: DebtStatus.PAID },
        })
      }

      revalidatePath(`/debts/${result.debtId}`)

      return result
    } catch (error) {
      if (typeof error === "string") throw error

      throw "Pay Installment: Server Error"
    }
  })

export const payAllInstallmentAction = action
  .input(payAllInstallmentSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const found = await prisma.debt.findUnique({
        where: { id: input.debtId },
      })

      if (!found) throw `Cannot find debt with ID ${input.debtId}`

      const result = await prisma.installmentPlanItem.updateMany({
        where: {
          debtId: input.debtId,
          status: {
            not: InstallmentPlanItemStatus.PAID,
          },
        },
        data: {
          actual_payment_date: input.actual_payment_date,
          note: input.note,
          status: InstallmentPlanItemStatus.PAID,
        },
      })

      // mark the debt record as PAID
      await prisma.debt.update({
        where: { id: input.debtId },
        data: { status: DebtStatus.PAID },
      })

      revalidatePath(`/debts/${input.debtId}`)

      return result
    } catch (error) {
      if (typeof error === "string") throw error

      throw "Pay All Installment: Server Error"
    }
  })

export const saveInstallmentNoteAction = action
  .input(withEntityId.merge(z.object({ note: z.string().optional() })))
  .handler(async ({ ctx, input }) => {
    try {
      const found = await prisma.installmentPlanItem.findUnique({
        where: { id: input.id },
      })

      if (!found) throw `Cannot find installment plan item with ID ${input.id}`

      const result = await prisma.installmentPlanItem.update({
        where: { id: input.id },
        data: {
          note: input.note,
        },
        select: {
          debtId: true,
        },
      })

      revalidatePath(`/debts/${result.debtId}`)

      return result
    } catch (error) {
      if (typeof error === "string") throw error

      throw "Save Installment Note: Server Error"
    }
  })

const formatDate = (dateStr: string) => format(dateStr, "MMM dd, yyyy")

function getNextPayDate(
  currentPayDate: string,
  duration: number,
  frequency: string
) {
  if (frequency === "One Time Payment") return formatDate(currentPayDate)

  if (frequency === "Daily")
    return formatDate(addDays(currentPayDate, duration).toDateString())

  if (frequency === "Weekly")
    return formatDate(addWeeks(currentPayDate, duration).toDateString())

  if (frequency === "Monthly")
    return formatDate(addMonths(currentPayDate, duration).toDateString())

  if (frequency === "Quarterly")
    return formatDate(
      addMonths(currentPayDate, Math.ceil(duration * 3)).toDateString()
    )

  if (frequency === "Annually")
    return formatDate(addYears(currentPayDate, duration).toDateString())

  return formatDate(currentPayDate)
}

function generateInstallmentPlans(debt: Debt) {
  // calculate upcoming transactions
  const { duration, frequency, tracking_start_date, balance, minimum_payment } =
    debt

  const installmentPlans = Array.from(Array(duration).keys()).map((n) => {
    const paymentDate = getNextPayDate(tracking_start_date, n + 1, frequency)

    const paymentAmount =
      n + 1 === duration ? balance - n * minimum_payment : minimum_payment

    return {
      payment_date: paymentDate,
      payment_amount: paymentAmount,
      debtId: debt.id,
    }
  })

  return installmentPlans
}
