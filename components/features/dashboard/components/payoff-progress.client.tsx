"use client"

import Link from "next/link"
import { InstallmentPlanItem, InstallmentPlanItemStatus } from "@prisma/client"
import { ChevronRightIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { chartConfig } from "./chart-config"

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

  lastPayments: Array<
    InstallmentPlanItem & {
      debt: {
        nickname: string
        category: string
      }
    }
  > | null
}

function getDateDisplay(dateString: string) {
  const mo = (new Date(dateString).getMonth() + 1).toString().padStart(2, "0")

  const dd = new Date(dateString).getDate().toString().padStart(2, "0")

  return `${mo}/${dd}`
}

export function PayoffProgressClient({
  paid,
  unpaid,
  lastPayments,
}: PayoffProgressClientProps) {
  const total = paid + unpaid

  if (!total)
    return (
      <Card className="flex flex-col">
        <CardHeader className="p-3">
          <CardDescription>Outstanding Balance</CardDescription>
          <CardTitle className="font-bold">
            PHP 0.00{" "}
            <span className="font-sans text-xs font-normal text-muted-foreground">
              out of PHP 0.00
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center">
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

        {lastPayments?.length ? (
          <div className="relative">
            <div className="rounded-md bg-gray-100 p-2 dark:bg-muted/30">
              <div className="mb-1 flex items-center gap-2">
                <CardDescription className="mb-2 shrink-0">
                  Latest Payments
                </CardDescription>
                <div className="mb-1.5 h-px flex-1 bg-border" />
              </div>

              <ul>
                {lastPayments.map((payment) => (
                  <li key={payment.id}>
                    <Link
                      href={`/debts/${payment.debtId}?status=${InstallmentPlanItemStatus.PAID}`}
                    >
                      <div className="flex items-start rounded-md p-1 text-sm hover:bg-gray-200 dark:hover:bg-muted">
                        <span className="mr-3 mt-px block text-center font-semibold">
                          {getDateDisplay(payment.actual_payment_date!)}
                        </span>
                        <span
                          className="mr-2.5 mt-1 block h-4 w-1 rounded"
                          style={{
                            backgroundColor:
                              chartConfig[payment.debt.category].color,
                          }}
                        />
                        <div className="mt-px flex flex-col">
                          <span className="font-semibold group-hover:text-blue-500">
                            {payment.debt.nickname}
                          </span>
                          <p className="space-x-2 text-xs text-muted-foreground">
                            <span>
                              Php {payment.payment_amount.toLocaleString()}
                            </span>
                            <span>&middot;</span>
                            <span>
                              Due: {getDateDisplay(payment.payment_date!)}
                            </span>
                          </p>
                        </div>
                        <ChevronRightIcon className="ml-auto size-4 self-center text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
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
