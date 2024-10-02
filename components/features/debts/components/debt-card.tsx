import Link from "next/link"
import { type DebtItem } from "@/queries/debt"
import { DebtStatus, InstallmentPlanItemStatus } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { DebtCategoryIcon } from "./debt-category-icon"
import { DebtMenuActions } from "./debt-menu-actions"

export function DebtCard({ debt }: { debt: DebtItem }) {
  const paidPlans = debt.installment_plans.filter(
    (d) => d.status === InstallmentPlanItemStatus.PAID
  ).length

  const progress = (paidPlans / debt.duration) * 100

  const progressPercent = progress.toFixed(0) + "%"

  const remainingBalance = (debt.balance * (100 - progress)) / 100

  const upcomingDueDate = debt.installment_plans
    .filter((d) => d.status === InstallmentPlanItemStatus.UPCOMING)
    .at(0)?.payment_date

  return (
    <Card className="relative flex h-full flex-col hover:ring-2 hover:ring-primary">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start gap-3">
          <DebtCategoryIcon debtCategory={debt.category} />
          <div>
            <CardTitle className="line-clamp-1 flex items-center text-sm font-semibold group-hover:underline">
              {debt.nickname}{" "}
            </CardTitle>
            <CardDescription className="text-xs">
              {debt.category}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <div className="grid h-full grid-cols-2 justify-between gap-2 rounded bg-gray-100 p-3 pb-1 text-sm dark:bg-muted/30">
          <div className="col-span-2">
            <Badge variant={debt.status} className="text-nowrap">
              {debt.status.replaceAll("_", " ")}
            </Badge>
          </div>
          {debt.status === DebtStatus.IN_PROGRESS ? (
            <>
              <p className="text-muted-foreground">Remaining Balance</p>
              <p className="font-medium">
                Php {remainingBalance.toLocaleString()}{" "}
                <span className="text-[10px] text-muted-foreground">
                  of {debt.balance.toLocaleString()}
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">Paid off Balance</p>
              <p className="font-medium">
                Php {debt.balance.toLocaleString()}{" "}
              </p>
            </>
          )}
          <p className="text-muted-foreground">
            {debt.frequency}{" "}
            {debt.frequency === "One Time Payment" ? "" : "Payment"}
          </p>
          <p className="font-medium">
            Php {debt.minimum_payment.toLocaleString()}
          </p>
          {debt.status === DebtStatus.IN_PROGRESS && upcomingDueDate ? (
            <>
              <p className="text-muted-foreground">Next Payment on</p>
              <p className="font-medium">{formatDate(upcomingDueDate)}</p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">Fully paid on</p>
              <p className="font-medium">
                {formatDate(debt.actual_paid_off_date!)}
              </p>
            </>
          )}

          {debt.status === DebtStatus.IN_PROGRESS ? (
            <div className="col-span-2 flex items-center gap-4">
              <span className="shrink-0 font-semibold">Progress</span>
              <Progress
                aria-label={`payment progress for ${debt.nickname}`}
                value={progress}
                max={100}
                className="h-2"
              />
              <span>{progressPercent}</span>
            </div>
          ) : null}
        </div>
      </CardContent>

      <Link href={`/debts/${debt.id}`} className="absolute inset-0">
        <span className="sr-only">View details</span>
      </Link>

      <div className="absolute right-1 top-1">
        <DebtMenuActions debt={debt} />
      </div>
    </Card>
  )
}
