"use server"

import { revalidatePath } from "next/cache"
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

import { authedProcedure } from "./procedures/auth"

const action = authedProcedure.createServerAction()

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

export const editDebtAction = action
  .input(z.object({ id: z.string(), data: createDebtSchema }))
  .handler(async ({ ctx, input }) => {
    try {
      const debt = await prisma.debt.findUnique({
        where: { id: input.id },
        include: {
          installment_plans: {
            where: {
              status: InstallmentPlanItemStatus.PAID,
            },
          },
        },
      })

      if (!debt) throw `Cannot find debt with ID ${input.id}`

      const hasPaidInstallment = debt.installment_plans.length > 0

      const { is_mine, lendee_email, lendee_name, ...fields } = input.data

      const result = await prisma.debt.update({
        where: {
          id: input.id,
        },
        data: {
          user_id: ctx.user.id,
          tracking_start_date: input.data.next_payment_due_date,
          ...(is_mine ? fields : input.data),
        },
      })

      if (!hasPaidInstallment) {
        // delete all current installment plans for this debt
        await prisma.installmentPlanItem.deleteMany({
          where: {
            debtId: input.id,
          },
        })

        // create new installment plans
        const installmentPlans = generateInstallmentPlans(result)

        await prisma.installmentPlanItem.createMany({
          data: installmentPlans,
        })
      }

      revalidatePath(`/debts`)

      return result
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw `${input.data.nickname} already exists.`
        }
      }
      console.log(error)

      throw "Edit Debt: Server Error"
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

export const payInstallmentItemAction = action
  .input(withEntityId.merge(payInstallmentSchema))
  .handler(async ({ ctx, input }) => {
    try {
      const found = await prisma.installmentPlanItem.findUnique({
        where: { id: input.id },
      })

      if (!found) throw `Cannot find installment plan item with ID ${input.id}`

      const actualPaymentDate = input.actual_payment_date ?? input.payment_date

      const result = await prisma.installmentPlanItem.update({
        where: { id: input.id },
        data: {
          actual_payment_date: actualPaymentDate,
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
          data: {
            status: DebtStatus.PAID,
            actual_paid_off_date: actualPaymentDate,
          },
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
        data: {
          status: DebtStatus.PAID,
          actual_paid_off_date: input.actual_payment_date,
        },
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

const formatDate = (dateStr: string) => format(dateStr, "yyyy-MM-dd")

function getNextPayDate(
  currentPayDate: string,
  duration: number,
  frequency: string
) {
  if (frequency === "One Time Payment") return formatDate(currentPayDate)

  if (frequency === "Daily")
    return formatDate(addDays(currentPayDate, duration - 1).toDateString())

  if (frequency === "Weekly")
    return formatDate(addWeeks(currentPayDate, duration - 1).toDateString())

  if (frequency === "Monthly")
    return formatDate(addMonths(currentPayDate, duration - 1).toDateString())

  if (frequency === "Quarterly")
    return formatDate(
      addMonths(currentPayDate, Math.ceil(duration * 3)).toDateString()
    )

  if (frequency === "Annually")
    return formatDate(addYears(currentPayDate, duration - 1).toDateString())

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
