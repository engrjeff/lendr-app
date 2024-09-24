import { Suspense } from "react"
import { Metadata } from "next"
import { getDebts, getDebtsGroupedByCategory } from "@/queries/debt"
import { DebtStatus } from "@prisma/client"

import { Separator } from "@/components/ui/separator"
import { DebtByCategoryChart } from "@/components/features/debts/components/debt-by-category-chart"
import { DebtList } from "@/components/features/debts/components/debt-list"
import { DebtSortSelect } from "@/components/features/debts/components/debt-sort-select"
import { DebtsEmptyView } from "@/components/features/debts/components/debts-empty-view"
import { NewDebtForm } from "@/components/features/debts/components/new-debt-form"
import { NoUpcomingView } from "@/components/features/debts/components/no-upcoming-view"
import { StatusFilter } from "@/components/features/debts/components/status-filter"
import { SearchField } from "@/components/shared/search-field"

export const metadata: Metadata = {
  title: "Debts",
}

interface PageProps {
  searchParams: {
    sort?: string
    order?: string
    search?: string
    status?: DebtStatus
  }
}

const statusFilterOptions = [
  { value: "", label: "All" },
  { value: DebtStatus.IN_PROGRESS, label: "In Progress" },
  { value: DebtStatus.PAID, label: "Paid" },
  { value: DebtStatus.CANCELLED, label: "Cancelled" },
]

async function DebtsPage({ searchParams }: PageProps) {
  const debts = await getDebts({
    sort: searchParams.sort,
    order: searchParams.order,
    search: searchParams.search,
    status: searchParams.status,
  })

  const debtsGroupedByCategory = await getDebtsGroupedByCategory()

  if (!debts?.length && !searchParams.search && !searchParams.status)
    return <DebtsEmptyView />

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Debts</h1>
          <p className="text-sm text-muted-foreground">
            List of your balances.
          </p>
        </div>
        <NewDebtForm />
      </div>

      <div className="space-y-6">
        <Suspense>
          <div className="flex items-center gap-4">
            <StatusFilter defaultValue="" options={statusFilterOptions} />
            <div className="ml-auto flex items-center gap-4">
              <DebtSortSelect />
              <Separator orientation="vertical" className="h-8 py-1" />
              <SearchField placeholder="Search debt" className="flex-1" />
            </div>
          </div>
        </Suspense>
        {!debts?.length ? (
          <EmptyViews searchParams={searchParams} />
        ) : (
          <div className="grid grid-cols-3 items-start gap-6">
            <div className="col-span-2">
              <DebtList debts={debts ?? []} />
            </div>
            <DebtByCategoryChart
              key={debts?.length.toString()}
              debtsByCategory={debtsGroupedByCategory}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyViews({ searchParams }: PageProps) {
  if (!searchParams.search && !searchParams.status) return null

  if (searchParams.status === DebtStatus.IN_PROGRESS) {
    return <NoUpcomingView />
  }

  if (searchParams.status === DebtStatus.PAID) {
    return (
      <div className="space-y-3">
        <p className="text-lg font-semibold">
          Looks like you have not paid anything yet. 🙈
        </p>
        <p className="text-muted-foreground">
          Make sure to pay your debts as soon as possible.
        </p>
      </div>
    )
  }

  if (searchParams.status === DebtStatus.CANCELLED) {
    return (
      <div className="space-y-3">
        <p className="text-lg font-semibold">
          Nice! Looks like you are tracking well!
        </p>
        <p className="text-muted-foreground">No cancelled debts so far.</p>
      </div>
    )
  }

  return (
    <div className="py-4">
      <p className="text-lg">No debt record found.</p>
    </div>
  )
}

export default DebtsPage
