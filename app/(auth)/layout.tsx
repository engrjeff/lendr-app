import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { AuthFooter } from "./components/AuthFooter"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-6">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
        >
          <ChevronLeft className="mr-3 size-4" /> Home
        </Link>
      </div>
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <AuthFooter />
    </div>
  )
}
