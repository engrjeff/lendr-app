import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ThemeToggler } from "@/components/shared/theme-toggler"

import { AuthFooter } from "./components/AuthFooter"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
        >
          <ChevronLeft className="mr-3 size-4" /> Home
        </Link>

        <ThemeToggler />
      </div>
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <AuthFooter />
    </div>
  )
}
