import { InstallmentPlanItem, InstallmentPlanItemStatus } from "@prisma/client"
import { format } from "date-fns"

import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"

import { InstallmentPlanItemAction } from "./installment-plan-row-actions"

export function InstallmentList({
  installmentPlans,
}: {
  installmentPlans: InstallmentPlanItem[]
}) {
  if (installmentPlans.length === 0) {
    return (
      <Card className="border-none">
        <CardContent className="p-3">
          <p className="text-center text-muted-foreground">Nothing to show</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <ul className="space-y-4">
      {installmentPlans.map((plan) => (
        <li key={plan.id}>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 p-3">
              <CardDescription>
                {formatDate(plan.payment_date)} Due
              </CardDescription>
              <Badge variant={plan.status}>
                {plan.status.replace("_", " ")}
              </Badge>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="space-y-2 rounded bg-muted p-3 dark:bg-muted/30">
                {plan.status === InstallmentPlanItemStatus.PAID &&
                plan.actual_payment_date ? (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Actual Payment Date
                    </p>
                    <p className="text-sm">
                      {format(plan.actual_payment_date, "MMM dd, yyyy")}
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-sm">
                    <span className="text-xs text-muted-foreground">PHP</span>{" "}
                    {plan.payment_amount.toLocaleString()}
                  </p>
                </div>
                {plan.note ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Note</p>
                    <p className="text-sm">{plan.note}</p>
                  </div>
                ) : null}
                <div className="pt-4 empty:hidden">
                  <InstallmentPlanItemAction installmentPlanItem={plan} />
                </div>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
