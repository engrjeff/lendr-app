import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { NewDebtForm } from "./new-debt-form"

export function DebtsEmptyView({ forDashboard }: { forDashboard?: boolean }) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        {forDashboard ? (
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Quick insights on your balances.
            </p>
          </div>
        ) : (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Debts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 border border-dashed">
        <p className="text-xl font-semibold">No debt records yet.</p>
        <p className="text-sm text-muted-foreground">
          You can start tracking as soon as you add one.
        </p>
        <NewDebtForm />
      </div>
    </div>
  )
}
