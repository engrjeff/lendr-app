import * as z from "zod"

export const createDebtSchema = z
  .object({
    nickname: z
      .string({ required_error: "Nickname is required." })
      .min(1, { message: "Nickname is required." }),
    balance: z
      .number({ message: "Must be a number." })
      .int({ message: "Must be a number." })
      .positive({ message: "Must be greater than 0." }),
    duration: z
      .number({ message: "Must be a number." })
      .int({ message: "Must be a number." })
      .positive({ message: "Must be greater than 0." }),
    category: z
      .string({ required_error: "Category is required." })
      .min(1, { message: "Category is required." }),
    frequency: z
      .string({ required_error: "Frequency is required." })
      .min(1, { message: "Frequency is required." }),
    minimum_payment: z
      .number({ message: "Must be a number." })
      .int({ message: "Must be a number." })
      .gte(0, { message: "Must be greater than 0." }),
    next_payment_due_date: z
      .string({ required_error: "Payment due date is required." })
      .min(1, { message: "Payment due date is required." }),

    is_mine: z.boolean().optional().default(true),

    lendee_name: z
      .string({ required_error: "Lendee name is required." })
      .optional(),
    lendee_email: z.union([
      z.literal(""),
      z
        .string({ required_error: "Lendee email is required." })
        .email({ message: "Invalid email." }),
    ]),

    should_notify: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    const invalid = data.balance < data.minimum_payment

    if (invalid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Should be less than or equal to Balance",
        fatal: true,
        path: ["minimum_payment"],
      })
    }
  })

export type CreateDebtSchema = z.infer<typeof createDebtSchema>

export const payInstallmentSchema = z.object({
  payment_date: z.string(),
  payment_amount: z.number(),
  actual_payment_date: z.string().optional(),
  note: z.string().optional(),
})

export type PayInstallmentSchema = z.infer<typeof payInstallmentSchema>

export const payAllInstallmentSchema = z.object({
  debtId: z.string(),
  actual_payment_date: z.string().optional(),
  note: z.string().optional(),
})

export type PayAllInstallmentSchema = z.infer<typeof payAllInstallmentSchema>
