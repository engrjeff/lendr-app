import { AccessDenied, Verification } from "@auth/core/errors"
import bcrypt from "bcryptjs"
import { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { sendVerificationEmail } from "./emails/mail"
import prisma from "./prisma/client"
import { loginSchema } from "./schema/auth"
import {
  generateVerificationToken,
  getVerificationTokenByEmail,
} from "./server/tokens"

export default {
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const validation = loginSchema.safeParse(credentials)

        if (!validation.success) return null

        const { email, password } = validation.data

        const foundUser = await prisma.user.findUnique({
          where: { email },

          include: {
            _count: {
              select: {
                debts: true,
              },
            },
          },
        })

        if (!foundUser) throw new AccessDenied("Invalid credentials.")

        const passwordsMatch = await bcrypt.compare(
          password,
          foundUser.hashedPassword!
        )

        if (!passwordsMatch) throw new AccessDenied("Invalid credentials.")

        if (!foundUser.emailVerified) {
          const existingVerificationToken = await getVerificationTokenByEmail(
            foundUser.email
          )

          if (!existingVerificationToken) {
            const newToken = await generateVerificationToken(foundUser.email)

            await sendVerificationEmail(
              foundUser.name!,
              newToken.email,
              newToken.token
            )

            throw new Verification(
              "A confirmation link was sent to your email. Please verify your email first."
            )
          }

          if (existingVerificationToken) {
            if (new Date() > existingVerificationToken.expires) {
              const newToken = await generateVerificationToken(foundUser.email)

              await sendVerificationEmail(
                foundUser.name!,
                newToken.email,
                newToken.token
              )

              throw new Verification(
                "A confirmation link was sent to your email. Please verify your email first."
              )
            }
          }

          throw new AccessDenied("Please verify your email first.")
        }

        const { name, email: userEmail, id, image, role, _count } = foundUser

        return {
          name,
          email: userEmail,
          id,
          image,
          role,
          hasRecords: _count.debts > 0,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
