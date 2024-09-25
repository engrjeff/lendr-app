"use client"

import { startTransition, useCallback, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowDownAZIcon, ArrowUpZAIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DebtSortSelect() {
  const sortParamKey = "sort"
  const orderParamKey = "order"

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentSort = searchParams.get(sortParamKey)
  const currentOrder = searchParams.get(orderParamKey)

  const ORDERS = ["desc", "asc"]

  const [orderIndex, setOrderIndex] = useState(() =>
    currentOrder ? ORDERS.indexOf(currentOrder) : 1
  )

  const order = ORDERS[orderIndex % 2]

  const createQueryString = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(
        searchParams ? searchParams : undefined
      )

      if (order !== null) {
        params.set(sortParamKey, sort)
        params.set(orderParamKey, order)
      } else {
        params.delete(sortParamKey)
        params.delete(orderParamKey)
      }

      return params.toString()
    },
    [searchParams, order]
  )

  function handleSortEvent(value: string) {
    if (!value) return

    const queryString = createQueryString(value)

    startTransition(() => {
      router.push(`${pathname}?${queryString}`)
    })
  }

  return (
    <div className="ml-auto flex items-center gap-3">
      <Select defaultValue={currentSort ?? ""} onValueChange={handleSortEvent}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort</SelectLabel>
            <SelectItem value="balance">Balance</SelectItem>
            <SelectItem value="createdAt">Date Added</SelectItem>
            <SelectItem value="nickname">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Link
        title="Sort Order"
        href={`${pathname}?${createQueryString(currentSort ?? "balance")}`}
        aria-label="sort order"
        onClick={() => setOrderIndex((c) => c + 1)}
        className={cn(
          buttonVariants({ size: "icon", variant: "outline" }),
          "shrink-0 hidden"
        )}
      >
        {currentOrder === "asc" ? (
          <ArrowDownAZIcon className="size-4" />
        ) : (
          <ArrowUpZAIcon className="size-4" />
        )}
      </Link>
    </div>
  )
}
