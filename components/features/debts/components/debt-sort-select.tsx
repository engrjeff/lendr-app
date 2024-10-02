"use client"

import { ChangeEvent, startTransition, useCallback, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowDownAZIcon, ArrowUpZAIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/native-select"

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

  function handleSortEvent(e: ChangeEvent<HTMLSelectElement>) {
    if (!e.currentTarget.value) return

    const queryString = createQueryString(e.currentTarget.value)

    startTransition(() => {
      router.push(`${pathname}?${queryString}`)
    })
  }

  return (
    <div className="relative ml-auto flex items-center gap-3">
      <label
        htmlFor="debt-sort"
        className="absolute left-1.5 top-1 pl-1 text-[10px] font-medium text-muted-foreground"
      >
        Sort
      </label>
      <NativeSelect
        name="debt-sort"
        id="debt-sort"
        className="w-[140px] py-3 pb-1 pl-1.5"
        defaultValue={currentSort ?? ""}
        onChange={handleSortEvent}
      >
        <option value="balance">Balance</option>
        <option value="createdAt">Date Added</option>
        <option value="nickname">Name</option>
        <option value="category">Category</option>
      </NativeSelect>
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
