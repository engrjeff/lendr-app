"use client"

import { useCallback } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { LayoutGridIcon, ListIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function DebtViewButton() {
  const paramKey = "view"

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentView = searchParams.get(paramKey)

  const createQueryString = useCallback(
    (viewValue?: string | null) => {
      const params = new URLSearchParams(
        searchParams ? searchParams : undefined
      )

      if (viewValue) {
        params.set(paramKey, viewValue)
      } else {
        params.delete(paramKey)
      }

      return params.toString()
    },
    [searchParams]
  )

  return (
    <Link
      title="Change View"
      href={`${pathname}?${createQueryString(currentView === "list" ? "" : "list")}`}
      aria-label="change view"
      className={cn(
        buttonVariants({ size: "icon", variant: "outline" }),
        "shrink-0"
      )}
    >
      {currentView !== "list" ? (
        <ListIcon className="size-4" />
      ) : (
        <LayoutGridIcon className="size-4" />
      )}
    </Link>
  )
}
