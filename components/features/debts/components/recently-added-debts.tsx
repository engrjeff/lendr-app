import { getDebts } from "@/queries/debt"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

import { DebtList } from "./debt-list"

export async function RecentlyAddedDebts() {
  const recentDebts = await getDebts({
    sort: "createdAt",
    order: "asc",
    limit: 2,
  })

  return (
    <Card className="border-none lg:col-span-3">
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-lg">Recently Added Debts</CardTitle>
      </CardHeader>
      <DebtList debts={recentDebts} />
    </Card>
  )
}
