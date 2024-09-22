import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 border border-dashed">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        Debt record not found.
      </p>

      <Link href="/debts" className={cn(buttonVariants({ size: "sm" }))}>
        <ArrowLeftIcon className="mr-3 size-4" /> Back to Debts
      </Link>
    </div>
  )
}

export default NotFoundPage
