import { Metadata } from "next"
import { auth } from "@/auth"

import { DebtByCategoryChart } from "@/components/features/dashboard/components/debt-by-category-chart"
import { DebtByCategorySlider } from "@/components/features/dashboard/components/debt-by-category-slides"
import { PastDueDebts } from "@/components/features/dashboard/components/past-due-debts"
import { PayoffProgress } from "@/components/features/dashboard/components/payoff-progress"
import { RecentlyAddedDebts } from "@/components/features/dashboard/components/recently-added-debts"
import { UpcomingPayables } from "@/components/features/dashboard/components/upcoming-payables"
import { DebtsEmptyView } from "@/components/features/debts/components/debts-empty-view"

export const metadata: Metadata = {
  title: "Dashboard",
}

async function DashboardPage() {
  const session = await auth()

  if (!session?.user.hasRecords) return <DebtsEmptyView forDashboard />

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <PayoffProgress />
        <UpcomingPayables />
        <PastDueDebts />

        <DebtByCategoryChart />
        <div className="lg:col-span-2">
          <DebtByCategorySlider />
        </div>
      </div>

      <RecentlyAddedDebts />
    </div>
  )
}

export default DashboardPage
