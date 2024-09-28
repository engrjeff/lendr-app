import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
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
  openGraph: {
    title: "Lendr App",
    images: [
      {
        url: "https://res.cloudinary.com/abide-in-the-vine/image/upload/v1727278931/lendr-banner_rjtv5d.png",
        alt: "Lendr App",
        width: 1200,
        height: 630,
      },
    ],
  },
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
        <Analytics />
      </body>
    </html>
  )
}
