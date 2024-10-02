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
    <div className="flex h-10 items-center gap-1 rounded border px-1">
      <Link
        title="Change View to Grid"
        href={`${pathname}?${createQueryString("")}`}
        aria-label="change view to grid"
        className={cn(
          buttonVariants({
            size: "icon",
            variant: !currentView ? "secondary" : "ghost",
          }),
          "shrink-0 size-8"
        )}
      >
        <LayoutGridIcon className="size-4" />
      </Link>
      <Link
        title="Change View to List"
        href={`${pathname}?${createQueryString("list")}`}
        aria-label="change view to list"
        className={cn(
          buttonVariants({
            size: "icon",
            variant: currentView === "list" ? "secondary" : "ghost",
          }),
          "shrink-0 size-8"
        )}
      >
        <ListIcon className="size-4" />
      </Link>
    </div>
  )
}
