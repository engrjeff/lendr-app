"use client"

import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DebtList } from "@/components/features/debts/components/debt-list"

export function RecentlyAddedDebts() {
  const debts = useQuery({
    queryKey: ["recent-debts"],
    queryFn: async () => {
      const response = await fetch(`/api/debts/recently-added`)

      if (!response.ok) return []

      return await response.json()
    },
  })

  if (debts.isLoading)
    return (
      <Card className="border-none">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg">Recently Added Debts</CardTitle>
          <CardDescription>Recently added unpaid balances</CardDescription>
        </CardHeader>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <li>
            <Skeleton className="h-[260px]" />
          </li>
          <li>
            <Skeleton className="h-[260px]" />
          </li>
        </ul>
      </Card>
    )

  if (!debts.data) return null

  return (
    <Card className="border-none">
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-lg">Recently Added Debts</CardTitle>
        <CardDescription>Recently added unpaid balances</CardDescription>
      </CardHeader>
      <DebtList
        debts={debts.data}
        className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2"
      />
    </Card>
  )
}
