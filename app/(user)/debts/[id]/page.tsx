import { notFound } from "next/navigation"
import { getDebtById } from "@/queries/debt"
import { InstallmentPlanItemStatus } from "@prisma/client"
import { isFuture } from "date-fns"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DebtCategoryIcon } from "@/components/features/debts/components/debt-category-icon"
import { DebtEditButton } from "@/components/features/debts/components/debt-edit-button"
import { InstallmentHistory } from "@/components/features/debts/components/installment-history"

interface PageProps {
  params: { id: string }
  searchParams: {
    status: InstallmentPlanItemStatus
  }
}

async function DebtDetailPage({ params, searchParams }: PageProps) {
  const debt = await getDebtById({
    id: params.id,
    status: searchParams.status,
  })

  if (!debt) notFound()

  const installmentPlans =
    searchParams.status &&
    searchParams.status === InstallmentPlanItemStatus.UPCOMING
      ? debt.installment_plans.filter((item) => !isFuture(item.payment_date))
      : debt.installment_plans

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/debts">Debts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{debt.nickname}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <DebtCategoryIcon debtCategory={debt.category} />
          <div>
            <h1 className="text-xl font-bold">{debt?.nickname}</h1>
            <p className="text-sm text-muted-foreground">
              Balance details for {debt.nickname}
            </p>
          </div>
          <div className="ml-auto">
            <DebtEditButton debt={debt} />
          </div>
        </div>
      </div>

      <InstallmentHistory
        debtStatus={debt.status}
        installmentPlans={debt.installment_plans}
      />
      {/* <DebtInstallmentPlans
        key={searchParams.status}
        installmentPlans={installmentPlans}
        debt={debt}
      /> */}
    </div>
  )
}

export default DebtDetailPage
