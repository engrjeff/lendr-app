"use server"

import { redirect } from "next/navigation"
import { signIn, signOut } from "@/auth"
import { sendResetPasswordEmail, sendVerificationEmail } from "@/emails/mail"
import prisma from "@/prisma/client"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendResetPasswordInstructionSchema,
} from "@/schema/auth"
import {
  generateResetPasswordToken,
  generateVerificationToken,
} from "@/server/tokens"
import bcrypt from "bcryptjs"
import { createServerAction, ZSAError } from "zsa"

export const signOutAction = createServerAction().handler(async () => {
  await signOut({
    redirectTo: "/signin",
  })
})

export const login = createServerAction()
  .input(loginSchema, { type: "formData" })
  .handler(async ({ input }) => {
    await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  })

export const registerUser = createServerAction()
  .input(registerSchema, { type: "formData" })
  .handler(async ({ input }) => {
    try {
      const { name, email, password } = input

      const existingUser = await prisma.user.findUnique({ where: { email } })

      if (existingUser)
        throw new ZSAError(
          "PRECONDITION_FAILED",
          "User with the given email already exists."
        )

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      })

      // send verification email
      const verificationToken = await generateVerificationToken(newUser.email)

      await sendVerificationEmail(
        name,
        verificationToken.email,
        verificationToken.token
      )

      return {
        status: "success",
        message:
          "Confirmation email sent! Please view your inbox then verify your registration first.",
      }

      // // automatically log in the new user
      // try {
      //   await signIn("credentials", {
      //     email: input.email,
      //     password: input.password,
      //     redirectTo: DEFAULT_LOGIN_REDIRECT,
      //   })
      // } catch (error) {
      //   if (error instanceof AuthError) {
      //     switch (error.type) {
      //       case "AccessDenied":
      //         throw new Error("Invalid credentials.")
      //     }
      //   }

      //   throw error
      // }
    } catch (error) {
      throw error
    }
  })

export const sendPasswordResetInstructionAction = createServerAction()
  .input(sendResetPasswordInstructionSchema, { type: "formData" })
  .handler(async ({ input }) => {
    try {
      const foundUser = await prisma.user.findUnique({
        where: { email: input.email },
      })

      if (!foundUser) throw "There's no user found with the provided email."

      // send email here
      const resetPasswordToken = await generateResetPasswordToken(input.email)

      await sendResetPasswordEmail(input.email, resetPasswordToken.token)

      return {
        status: "success",
        message: "Check your email for password reset instructions.",
      }
    } catch (error) {
      if (typeof error === "string") throw error

      throw error
    }
  })

export const resetPasswordAction = createServerAction()
  .input(resetPasswordSchema, { type: "formData" })
  .handler(async ({ input }) => {
    try {
      const foundUser = await prisma.user.findUnique({
        where: { email: input.email },
      })

      if (!foundUser) throw "There's no user found with the provided email."

      const hashedPassword = await bcrypt.hash(input.newPassword, 10)

      await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          hashedPassword,
        },
      })

      redirect("/signin")
    } catch (error) {
      if (typeof error === "string") throw error

      throw error
    }
  })
