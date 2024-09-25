import { Metadata } from "next"

import { DebtByCategoryChart } from "@/components/features/debts/components/debt-by-category-chart"
import { PayoffProgress } from "@/components/features/debts/components/payoff-progress"

export const metadata: Metadata = {
  title: "Dashboard",
}

function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Quick insights on your balances.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <PayoffProgress />
        <DebtByCategoryChart />
      </div>
    </div>
  )
}

export default DashboardPage
