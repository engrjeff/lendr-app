import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function GlobalNotFoundPage() {
  return (
    <div className="flex h-screen flex-1 flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="mb-4 text-lg text-muted-foreground">Page not found.</p>

      <Link href="/dashboard" className={cn(buttonVariants({ size: "sm" }))}>
        Go to Dashboard
      </Link>
    </div>
  )
}

export default GlobalNotFoundPage
