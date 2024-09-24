import Link from "next/link"
import { notFound } from "next/navigation"
import { getDebtById } from "@/queries/debt"
import { InstallmentPlanItemStatus } from "@prisma/client"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DebtCategoryIcon } from "@/components/features/debts/components/debt-category-icon"
import { DebtInstallmentPlans } from "@/components/features/debts/components/debt-installment-plans"
import { BackButton } from "@/components/shared/back-button"

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

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <BackButton />
          <div className="flex items-center gap-3">
            <DebtCategoryIcon debtCategory={debt.category} />
            <h1 className="text-xl font-bold">{debt?.nickname}</h1>
          </div>
        </div>

        <Link href="#" className={cn(buttonVariants({ size: "sm" }))}>
          View Transactions
        </Link>
      </div>

      <DebtInstallmentPlans
        key={searchParams.status}
        installmentPlans={debt.installment_plans}
      />
    </div>
  )
}

export default DebtDetailPage
