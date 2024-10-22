"use client"

import Link from "next/link"
import { InstallmentPlanItem } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { MoreHorizontalIcon } from "lucide-react"

import { getMonthYearDisplay } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { chartConfig } from "./chart-config"

function getDateDisplay(dateString: string) {
  const mo = (new Date(dateString).getMonth() + 1).toString().padStart(2, "0")

  const dd = new Date(dateString).getDate().toString().padStart(2, "0")

  return `${mo}/${dd}`
}

type Item = InstallmentPlanItem & {
  debt: { nickname: string; category: string }
}

export function UpcomingPayables({ month }: { month?: string }) {
  const result = useQuery<Array<Item>>({
    queryKey: ["debts-for-month", month],
    queryFn: async () => {
      const response = await fetch(`/api/debts/debts-for-month?month=${month}`)

      if (!response.ok) return []

      return await response.json()
    },
  })

  if (result.isLoading) return <Skeleton className="h-[250px] w-full" />

  const monthYear = getMonthYearDisplay(month)

  return (
    <Card className="flex flex-col">
      <CardHeader className="relative p-3">
        <CardTitle className="text-sm font-semibold">
          Upcoming Payables
        </CardTitle>

        <Button
          size="icon"
          variant="ghost"
          aria-label="more details"
          className="absolute right-3 top-0 size-8"
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-3">
        <div className="h-full rounded-md bg-gray-100 p-2 dark:bg-muted/30">
          <div className="mb-1 flex items-center gap-2">
            <CardDescription className="mb-2 shrink-0">
              {monthYear}
            </CardDescription>
            <div className="mb-1.5 h-px flex-1 bg-border" />
          </div>
          {result.data?.length === 0 ? (
            <div className="py-4 text-center">
              <p>🎉</p>
              <p className="text-lg font-semibold">Great!</p>
              <p className="text-muted-foreground">
                You have no upcoming payables.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {result.data?.map((item) => (
                <li key={`upcoming-payable-${item.id}`}>
                  <Link prefetch={true} href={`/debts/${item.debtId}`}>
                    <div className="flex items-start rounded-md p-1 text-sm hover:bg-gray-200 dark:hover:bg-muted">
                      <span className="mr-3 mt-px block w-10 text-center font-semibold">
                        {getDateDisplay(item.payment_date)}
                      </span>
                      <span
                        className="mr-2.5 mt-1 block h-4 w-1 rounded"
                        style={{
                          backgroundColor:
                            chartConfig[item.debt.category].color,
                        }}
                      />
                      <div className="mt-px flex flex-col">
                        <span className="font-semibold">
                          {item.debt.nickname}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Php {item.payment_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
