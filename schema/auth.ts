import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email." })
    .min(1, { message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required." })
      .min(1, { message: "Name is required." }),
    email: z
      .string({ required_error: "Email is required." })
      .email({ message: "Enter a valid email." })
      .min(1, { message: "Email is required." }),
    password: z
      .string({ required_error: "Password is required." })
      .min(6, { message: "Must be a minimum of 8 characters." }),
    confirmPassword: z
      .string({ required_error: "Please fill in this field." })
      .min(8, { message: "Must be a minimum of 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type LoginFormInput = z.infer<typeof loginSchema>

export type RegisterFormInput = z.infer<typeof registerSchema>
