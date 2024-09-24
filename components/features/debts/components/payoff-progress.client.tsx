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
      <Card className="col-span-2">
        <CardHeader>
          <CardDescription>Outstanding Balance</CardDescription>
          <CardTitle className="font-bold">
            PHP 0.00{" "}
            <span className="text-xs text-muted-foreground font-sans font-normal">
              out of PHP 0.00
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center text-muted-foreground">
            No data to show
          </p>
        </CardContent>
      </Card>
    )

  const percentUnpaid = unpaid / total
  const percentPaid = paid / total

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardDescription>Outstanding Balance</CardDescription>
        <CardTitle className="font-bold">
          PHP {unpaid.toLocaleString()}{" "}
          <span className="text-xs text-muted-foreground font-sans font-normal">
            out of PHP {total.toLocaleString()}{" "}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center">
          <div
            className="bg-red-500 h-2 rounded-l"
            style={{ width: `${percentUnpaid * 100}%` }}
          ></div>
          <Separator className="bg-white h-3" orientation="vertical" />
          <div
            className="bg-green-500 h-2 rounded-r"
            style={{ width: `${percentPaid * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="size-2 shrink-0 rounded-[2px] bg-red-500 mr-3"></div>
            <span className="text-xs">Unpaid</span>
          </div>
          <div className="flex items-center">
            <div className="size-2 shrink-0 rounded-[2px] bg-green-500 mr-3"></div>
            <span className="text-xs">Paid</span>
          </div>
        </div>

        {nextDue ? (
          <div className="bg-muted/30 border p-4 rounded flex items-center justify-between">
            <p className="text-sm">
              Next payment of{" "}
              <span className="font-semibold">
                PHP {nextDue.payment_amount.toLocaleString()}
              </span>{" "}
              due on {format(nextDue.payment_date, "MMM dd, yyyy")}
            </p>
            <Link
              href={`/debts/${nextDue.debtId}`}
              className="text-blue-500 text-sm hover:underline flex items-center"
            >
              Learn More <ExternalLinkIcon className="size-4 ml-3" />
            </Link>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
