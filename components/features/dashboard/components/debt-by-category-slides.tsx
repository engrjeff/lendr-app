"use client"

import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { DebtByCategorySliderClient } from "./debt-by-category-slider.client"

export function DebtByCategorySlider({ month }: { month?: string }) {
  const result = useQuery({
    queryKey: ["balance-by-category-slider", month],
    queryFn: async () => {
      const response = await fetch(
        `/api/debts/balance-by-category?month=${month}`
      )

      if (!response.ok) return []

      return await response.json()
    },
  })

  if (result.isLoading)
    return (
      <Card className="border-none">
        <CardHeader className="hidden p-0 pb-6">
          <CardTitle className="text-lg">
            Paidoff Progress by Category
          </CardTitle>
          <CardDescription>
            Overview of your paidoff progress by category
          </CardDescription>
        </CardHeader>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <li>
            <Skeleton className="h-[360px]" />
          </li>
          <li className="hidden md:block">
            <Skeleton className="h-[360px]" />
          </li>
          <li className="hidden lg:block">
            <Skeleton className="h-[360px]" />
          </li>
        </ul>
      </Card>
    )

  if (!result.data?.length)
    return (
      <Card className="flex h-[352px] flex-col">
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-semibold">
            Paidoff Progress by Category
          </CardTitle>
          <CardDescription>
            Overview of your paidoff progress by category
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex flex-1 flex-col items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            No data to show
          </p>
        </CardContent>
      </Card>
    )

  return (
    <Card className="border-none">
      <CardHeader className="hidden p-0 pb-6">
        <CardTitle className="text-lg">Paidoff Progress by Category</CardTitle>
        <CardDescription>
          Overview of your paidoff progress by category
        </CardDescription>
      </CardHeader>
      <DebtByCategorySliderClient data={result.data} />
    </Card>
  )
}
