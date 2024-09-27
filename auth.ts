import authConfig from "@/auth.config"
import prisma from "@/prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import type { Adapter } from "next-auth/adapters"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email! },

        include: {
          _count: {
            select: {
              debts: true,
            },
          },
        },
      })

      if (dbUser) {
        token.id = dbUser.id
        token.role = dbUser.role
        token.hasRecords = dbUser._count.debts > 0
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
        session.user.hasRecords = token.hasRecords
      }
      return session
    },
  },
  ...authConfig,
})
