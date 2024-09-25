import { InstallmentPlanItem } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
          <Card className="bg-muted dark:bg-muted/30">
            <CardHeader className="p-3 space-y-1 items-start">
              <Badge variant={plan.status} className="mb-3">
                {plan.status.replace("_", " ")}
              </Badge>
              <CardDescription className="text-sm">Due Date</CardDescription>
              <CardTitle className="text-base">{plan.payment_date}</CardTitle>
              <CardDescription className="text-sm">Amount</CardDescription>
              <CardTitle className="text-base">
                <span className="text-xs text-muted-foreground">PHP</span>{" "}
                {plan.payment_amount.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <InstallmentPlanItemAction installmentPlanItem={plan} />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
