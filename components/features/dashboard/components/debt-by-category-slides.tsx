"use client"

import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { DebtByCategorySliderClient } from "./debt-by-category-slider.client"

export function DebtByCategorySlider() {
  const result = useQuery({
    queryKey: ["balance-by-category-slider"],
    queryFn: async () => {
      const response = await fetch(`/api/debts/balance-by-category`)

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
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li>
            <Skeleton className="h-[360px]" />
          </li>
          <li className="hidden md:block">
            <Skeleton className="h-[360px]" />
          </li>
          <li className="hidden lg:block">
            <Skeleton className="h-[360px]" />
          </li>
          <li className="hidden xl:block">
            <Skeleton className="h-[360px]" />
          </li>
        </ul>
      </Card>
    )

  if (!result.data) return null

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
