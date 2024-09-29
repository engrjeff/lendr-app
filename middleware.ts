import { NextResponse } from "next/server"
import authConfig from "@/auth.config"
import { API_AUTH_PREFIX, AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/routes"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth

  const { nextUrl } = req

  if (nextUrl.pathname === "/") return NextResponse.next()

  if (nextUrl.pathname.startsWith("/verify")) return NextResponse.next()

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX)
  const isAuthPageRoute = AUTH_ROUTES.includes(nextUrl.pathname)

  if (isApiAuthRoute) return

  if (isAuthPageRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }

    return
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", nextUrl))
  }

  return
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
