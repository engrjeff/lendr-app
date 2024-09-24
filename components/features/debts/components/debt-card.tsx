import Link from "next/link"
import { type DebtItem } from "@/queries/debt"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

import { DebtCategoryIcon } from "./debt-category-icon"
import { DebtMenuActions } from "./debt-menu-actions"

export function DebtCard({ debt }: { debt: DebtItem }) {
  const progress = (debt._count.installment_plans / debt.duration) * 100
  const progressPercent = progress.toFixed(1) + "%"

  return (
    <Card>
      <CardHeader className="relative p-3">
        <div className="flex items-start gap-3">
          <DebtCategoryIcon debtCategory={debt.category} />
          <div>
            <Link
              href={`/debts/${debt.id}`}
              className="group flex items-center"
            >
              <CardTitle className="flex items-center text-sm font-semibold group-hover:underline">
                {debt.nickname}{" "}
              </CardTitle>

              <Badge variant={debt.status} className="ml-3">
                {debt.status.replaceAll("_", " ")}
              </Badge>
            </Link>
            <CardDescription className="text-xs">
              {debt.category}
            </CardDescription>
          </div>
        </div>
        <DebtMenuActions debt={debt} />
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-2 justify-between gap-3 bg-muted p-4 text-sm dark:bg-white/5">
        <p className="text-muted-foreground">Remaining Balance</p>
        <p className="font-medium">Php {debt.balance.toLocaleString()}</p>
        <p className="text-muted-foreground">Next Payment on</p>
        <p className="font-medium">
          {new Date(debt.next_payment_due_date).toDateString()}
        </p>
        <p className="text-muted-foreground">{debt.frequency} Payment</p>
        <p className="font-medium">
          Php {debt.minimum_payment.toLocaleString()}
        </p>

        <div className="col-span-2 flex items-center gap-4">
          <span className="shrink-0 font-semibold">Progress</span>
          <Progress value={progress} max={100} className="h-2" />
          <span>{progressPercent}</span>
        </div>
      </CardContent>
    </Card>
  )
}
