import Link from "next/link"
import { notFound } from "next/navigation"
import { getDebtByIdAction } from "@/actions/debt"
import { ArrowLeftIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DebtCategoryIcon } from "@/components/features/debts/components/debt-category-icon"
import { DebtInstallmentPlans } from "@/components/features/debts/components/debt-installment-plans"

interface PageProps {
  params: { id: string }
}

async function DebtDetailPage({ params }: PageProps) {
  const [debt] = await getDebtByIdAction({ id: params.id })

  if (!debt) notFound()

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <Link
            href="/debts"
            className="flex w-max items-center text-sm hover:underline"
          >
            <ArrowLeftIcon className="mr-3 size-4" /> Back to Debts
          </Link>

          <div className="flex items-center gap-3">
            <DebtCategoryIcon debtCategory={debt.category} />
            <h1 className="text-xl font-bold">{debt?.nickname}</h1>
          </div>
        </div>

        <Link href="#" className={cn(buttonVariants({ size: "sm" }))}>
          View Transactions
        </Link>
      </div>

      <DebtInstallmentPlans installmentPlans={debt.installment_plans} />
    </div>
  )
}

export default DebtDetailPage