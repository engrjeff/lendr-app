"use client"

import Link from "next/link"
import { InstallmentPlanItem } from "@prisma/client"
import { format } from "date-fns"
import { ExternalLinkIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PayoffProgressClientProps {
  paid: number
  unpaid: number
  nextDue: InstallmentPlanItem | null
}

export function PayoffProgressClient({
  paid,
  unpaid,
  nextDue,
}: PayoffProgressClientProps) {
  const total = paid + unpaid

  if (!total)
    return (
      <Card>
        <CardHeader>
          <CardDescription>Outstanding Balance</CardDescription>
          <CardTitle className="font-bold">
            PHP 0.00{" "}
            <span className="font-sans text-xs font-normal text-muted-foreground">
              out of PHP 0.00
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            No data to show
          </p>
        </CardContent>
      </Card>
    )

  const percentUnpaid = unpaid / total
  const percentPaid = paid / total

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardDescription>Outstanding Balance</CardDescription>
        <CardTitle className="font-bold">
          PHP {unpaid.toLocaleString()}{" "}
          <span className="font-sans text-xs font-normal text-muted-foreground">
            out of PHP {total.toLocaleString()}{" "}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center">
          <div
            className="h-2 rounded-l bg-red-500"
            style={{ width: `${percentUnpaid * 100}%` }}
          ></div>
          <Separator className="h-3 bg-white" orientation="vertical" />
          <div
            className="h-2 rounded-r bg-green-500"
            style={{ width: `${percentPaid * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="mr-3 size-2 shrink-0 rounded-[2px] bg-red-500"></div>
            <span className="text-xs">Unpaid</span>
          </div>
          <div className="flex items-center">
            <div className="mr-3 size-2 shrink-0 rounded-[2px] bg-green-500"></div>
            <span className="text-xs">Paid</span>
          </div>
        </div>

        {nextDue ? (
          <div className="flex flex-col justify-between gap-3 rounded border bg-muted/30 p-4 md:flex-row md:items-center">
            <p className="text-sm">
              Next payment of{" "}
              <span className="font-semibold text-blue-500">
                PHP {nextDue.payment_amount.toLocaleString()}
              </span>{" "}
              due on {format(nextDue.payment_date, "MMM dd, yyyy")}
            </p>
            <Link
              href={`/debts/${nextDue.debtId}`}
              className="flex items-center text-sm text-blue-500 hover:underline"
            >
              Learn More <ExternalLinkIcon className="ml-3 size-4" />
            </Link>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
