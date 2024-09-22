import { Suspense } from "react"
import { Metadata } from "next"
import { getDebtsAction, getDebtsGroupedByCategory } from "@/actions/debt"

import { DebtByCategoryChart } from "@/components/features/debts/components/debt-by-category-chart"
import { DebtList } from "@/components/features/debts/components/debt-list"
import { DebtSortSelect } from "@/components/features/debts/components/debt-sort-select"
import { DebtsEmptyView } from "@/components/features/debts/components/debts-empty-view"
import { NewDebtForm } from "@/components/features/debts/components/new-debt-form"
import { SearchField } from "@/components/shared/search-field"

export const metadata: Metadata = {
  title: "Debts",
}

interface PageProps {
  searchParams: Record<string, string>
}

async function DebtsPage({ searchParams }: PageProps) {
  const [debts] = await getDebtsAction({
    sort: searchParams.sort,
    order: searchParams.order,
    search: searchParams.search,
  })

  const [debtsGroupedByCategory] = await getDebtsGroupedByCategory()

  if (!debts?.length && !searchParams.search) return <DebtsEmptyView />

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

      <div className="grid grid-cols-3 items-start gap-6">
        <div className="col-span-2 space-y-4">
          <Suspense>
            <div className="flex items-center gap-4">
              <SearchField placeholder="Search debt" className="flex-1" />
              <DebtSortSelect />
            </div>
          </Suspense>
          {!debts?.length && searchParams.search ? (
            <div className="py-4">
              <p className="text-xl font-semibold">
                No debt found for {`"${searchParams.search}"`}.
              </p>
            </div>
          ) : (
            <DebtList debts={debts ?? []} />
          )}
        </div>
        <DebtByCategoryChart
          key={debts?.length.toString()}
          debtsByCategory={debtsGroupedByCategory}
        />
      </div>
    </div>
  )
}

export default DebtsPage
