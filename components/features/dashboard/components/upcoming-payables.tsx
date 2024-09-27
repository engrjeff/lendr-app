"use client"

import { InstallmentPlanItem } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { MoreHorizontalIcon } from "lucide-react"

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

type Item = InstallmentPlanItem & {
  debt: { nickname: string; category: string }
}

export function UpcomingPayables() {
  const result = useQuery<Array<Item>>({
    queryKey: ["debts-for-month"],
    queryFn: async () => {
      const response = await fetch(`/api/debts/debts-for-month`)

      if (!response.ok) return []

      return await response.json()
    },
  })

  if (result.isLoading) return <Skeleton className="h-[250px] w-full" />

  if (!result?.data?.length)
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
          <div className="h-full rounded-md bg-gray-100 p-3 dark:bg-muted/30">
            <div className="mb-1 flex items-center gap-2">
              <CardDescription className="mb-2 shrink-0">
                September 2024
              </CardDescription>
              <div className="mb-1.5 h-px flex-1 bg-border" />
            </div>

            <div className="py-4 text-center">
              <p className="text-lg font-semibold">Great!</p>
              <p className="text-muted-foreground">
                You have no upcoming payables. 🎉
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )

  return (
    <Card>
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
      <CardContent className="px-3 pb-3">
        <div className="rounded-md bg-gray-100 p-3 dark:bg-muted/30">
          <div className="mb-1 flex items-center gap-2">
            <CardDescription className="mb-2 shrink-0">
              {format(new Date(), "MMMM yyyy")}
            </CardDescription>
            <div className="mb-1.5 h-px flex-1 bg-border" />
          </div>

          <ul className="space-y-3">
            {result.data?.map((item) => (
              <li key={`upcoming-payable-${item.id}`}>
                <div className="flex items-start text-sm">
                  <span className="mr-3 mt-px block w-4 text-center font-semibold">
                    {new Date(item.payment_date).getDate()}
                  </span>
                  <span
                    className="mr-2.5 mt-1 block h-4 w-1 rounded"
                    style={{
                      backgroundColor: chartConfig[item.debt.category].color,
                    }}
                  />
                  <div className="mt-px flex flex-col">
                    <span className="font-semibold">{item.debt.nickname}</span>
                    <span className="text-xs text-muted-foreground">
                      Php {item.payment_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
