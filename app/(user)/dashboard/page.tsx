import { Suspense } from "react"
import { Metadata } from "next"
import { auth } from "@/auth"

import { DebtByCategoryChart } from "@/components/features/dashboard/components/debt-by-category-chart"
import { DebtByCategorySlider } from "@/components/features/dashboard/components/debt-by-category-slides"
import { PastDueDebts } from "@/components/features/dashboard/components/past-due-debts"
import { PayoffProgress } from "@/components/features/dashboard/components/payoff-progress"
import { UpcomingPayables } from "@/components/features/dashboard/components/upcoming-payables"
import { DebtsEmptyView } from "@/components/features/debts/components/debts-empty-view"
import { MonthFilter } from "@/components/shared/month-filter"

export const metadata: Metadata = {
  title: "Dashboard",
}

async function DashboardPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
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
        <div className="ml-auto">
          <Suspense>
            <MonthFilter />
          </Suspense>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <PayoffProgress month={searchParams.month} />
        <UpcomingPayables month={searchParams.month} />
        <PastDueDebts />

        <DebtByCategoryChart month={searchParams.month} />
        <div className="lg:col-span-2">
          <DebtByCategorySlider month={searchParams.month} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
