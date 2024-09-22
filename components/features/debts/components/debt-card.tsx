import Link from "next/link"
import { Debt } from "@prisma/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { DebtCategoryIcon } from "./debt-category-icon"
import { DebtMenuActions } from "./debt-menu-actions"

export function DebtCard({ debt }: { debt: Debt }) {
  return (
    <Card>
      <CardHeader className="relative p-3">
        <div className="flex items-start gap-3">
          <DebtCategoryIcon debtCategory={debt.category} />
          <div>
            <Link href={`/debts/${debt.id}`} className="hover:underline">
              <CardTitle className="text-sm font-semibold">
                {debt.nickname}
              </CardTitle>
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
      </CardContent>
    </Card>
  )
}
