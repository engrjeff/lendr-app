"use server"

import { redirect } from "next/navigation"
import { signIn, signOut } from "@/auth"
import prisma from "@/prisma/client"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { loginSchema, registerSchema } from "@/schema/auth"
import bcrypt from "bcrypt"
import { AuthError } from "next-auth"
import { createServerAction } from "zsa"

export const signOutAction = createServerAction().handler(async () => {
  await signOut({
    redirectTo: "/signin",
  })
})

export const login = createServerAction()
  .input(loginSchema, { type: "formData" })
  .handler(async ({ input }) => {
    try {
      await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      })
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "AccessDenied":
            throw new Error("Invalid credentials.")
        }
      }

      throw error
    }
  })

export const registerUser = createServerAction()
  .input(registerSchema, { type: "formData" })
  .handler(async ({ input }) => {
    try {
      const { name, email, password } = input

      const existingUser = await prisma.user.findUnique({ where: { email } })

      if (existingUser)
        throw new Error("User with the given email already exists.")

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      })

      redirect("/signin")
    } catch (error) {
      throw error
    }
  })
