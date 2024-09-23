import type { Metadata } from "next"
import { Inter } from "next/font/google"
import NextTopLoader from "nextjs-toploader"

import AppProviders from "@/components/providers/app-providers"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Lendr",
    template: "%s | Lendr",
  },
  description: "Lendr App - Your hassle-free debt tracker",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader color="#6D28D9" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
