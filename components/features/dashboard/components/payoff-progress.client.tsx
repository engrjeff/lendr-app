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
  // nextDue:
  //   | (InstallmentPlanItem & {
  //       debt: {
  //         nickname: string
  //       }
  //     })
  //   | null

  lastPayment:
    | (InstallmentPlanItem & {
        debt: {
          nickname: string
        }
      })
    | null
}

export function PayoffProgressClient({
  paid,
  unpaid,
  lastPayment,
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
    <Card className="flex flex-col">
      <CardHeader className="p-3">
        <CardDescription>Outstanding Balance</CardDescription>
        <CardTitle className="font-bold">
          PHP {unpaid.toLocaleString()}{" "}
          <span className="font-sans text-xs font-normal text-muted-foreground">
            out of PHP {total.toLocaleString()}{" "}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-3">
        <div className="flex items-center">
          <div
            className="h-2 rounded-l bg-red-500"
            style={{ width: `${percentUnpaid * 100}%` }}
          ></div>
          {paid > 0 && unpaid > 0 ? (
            <Separator className="h-3 bg-white" orientation="vertical" />
          ) : null}
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

        <div>
          {lastPayment ? (
            <div className="flex flex-col justify-between gap-3 rounded border bg-muted/30 p-4">
              <p className="text-sm">
                Last payment of{" "}
                <span className="font-semibold text-green-500">
                  PHP {lastPayment.payment_amount.toLocaleString()}
                </span>{" "}
                for{" "}
                <span className="font-bold">{lastPayment.debt.nickname}</span>{" "}
                on {format(lastPayment.actual_payment_date!, "MMM dd, yyyy")}
              </p>
              <Link
                href={`/debts/${lastPayment.debtId}`}
                className="inline-flex w-max items-center text-sm text-green-500 hover:underline"
              >
                Learn More <ExternalLinkIcon className="ml-3 size-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

//  <div className="mt-auto flex flex-col gap-4 xl:flex-row">
//    {lastPayment ? (
//      <div className="flex flex-col justify-between gap-3 rounded border bg-muted/30 p-4">
//        <p className="text-sm">
//          Last payment of{" "}
//          <span className="font-semibold text-green-500">
//            PHP {lastPayment.payment_amount.toLocaleString()}
//          </span>{" "}
//          for <span className="font-bold">{lastPayment.debt.nickname}</span> on{" "}
//          {format(lastPayment.actual_payment_date!, "MMM dd, yyyy")}
//        </p>
//        <Link
//          href={`/debts/${lastPayment.debtId}`}
//          className="inline-flex w-max items-center text-sm text-green-500 hover:underline"
//        >
//          Learn More <ExternalLinkIcon className="ml-3 size-4" />
//        </Link>
//      </div>
//    ) : null}

//    {nextDue ? (
//      <div className="flex flex-col justify-between gap-3 rounded border bg-muted/30 p-4">
//        <p className="text-sm">
//          Next payment for{" "}
//          <span className="font-bold">{nextDue.debt.nickname}</span> of{" "}
//          <span className="font-semibold text-blue-500">
//            PHP {nextDue.payment_amount.toLocaleString()}
//          </span>{" "}
//          due on {format(nextDue.payment_date, "MMM dd, yyyy")}
//        </p>
//        <Link
//          href={`/debts/${nextDue.debtId}`}
//          className="inline-flex w-max items-center text-sm text-blue-500 hover:underline"
//        >
//          Learn More <ExternalLinkIcon className="ml-3 size-4" />
//        </Link>
//      </div>
//    ) : null}
//  </div>
