import { getDebts } from "@/queries/debt"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { DebtList } from "./debt-list"

export async function RecentlyAddedDebts() {
  const recentDebts = await getDebts({
    limit: 2,
    status: "IN_PROGRESS",
  })

  if (!recentDebts) return null

  return (
    <Card className="border-none lg:col-span-3">
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-lg">Recently Added Debts</CardTitle>
        <CardDescription>Recently added unpaid balances</CardDescription>
      </CardHeader>
      <DebtList debts={recentDebts} />
    </Card>
  )
}
