import type { Metadata } from "next"
import { Inter } from "next/font/google"
import NextTopLoader from "nextjs-toploader"

import { cn } from "@/lib/utils"
import AppProviders from "@/components/providers/app-providers"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Lendr",
    template: "%s | Lendr",
  },
  description:
    "Lendr App - Your hassle-free debt tracker. Consolidate all your balances in one place.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full scroll-smooth">
      <body className={cn(inter.className, "antialiased h-full")}>
        <NextTopLoader color="#6D28D9" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
