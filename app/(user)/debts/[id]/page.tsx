import Link from "next/link"
import { notFound } from "next/navigation"
import { getDebtById } from "@/queries/debt"
import { InstallmentPlanItemStatus } from "@prisma/client"
import { isBefore } from "date-fns"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { buttonVariants } from "@/components/ui/button"
import { DebtCategoryIcon } from "@/components/features/debts/components/debt-category-icon"
import { DebtInstallmentPlans } from "@/components/features/debts/components/debt-installment-plans"

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
    searchParams.status === InstallmentPlanItemStatus.UPCOMING
      ? debt.installment_plans.filter(
          (item) => !isBefore(item.payment_date, new Date())
        )
      : debt.installment_plans

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
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
          <div className="hidden items-center gap-3">
            <DebtCategoryIcon debtCategory={debt.category} />
            <h1 className="text-xl font-bold">{debt?.nickname}</h1>
          </div>
        </div>

        <Link href="#" className={cn(buttonVariants({ size: "sm" }), "hidden")}>
          View Transactions
        </Link>
      </div>

      <DebtInstallmentPlans
        key={searchParams.status}
        installmentPlans={installmentPlans}
      />
    </div>
  )
}

export default DebtDetailPage
