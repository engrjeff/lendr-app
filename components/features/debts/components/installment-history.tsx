import {
  DebtStatus,
  InstallmentPlanItem,
  InstallmentPlanItemStatus,
} from "@prisma/client"
import { CircleCheckIcon, CircleIcon, NotepadTextIcon } from "lucide-react"

import { cn, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import { InstallmentPlanRowActions } from "./installment-plan-row-actions"

export function InstallmentHistory({
  installmentPlans,
  debtStatus,
}: {
  installmentPlans: InstallmentPlanItem[]
  debtStatus: DebtStatus
}) {
  const nextUpcoming = installmentPlans.find(
    (i) => i.status === InstallmentPlanItemStatus.UPCOMING
  )?.id

  return (
    <div className="rounded-lg border p-2 dark:bg-muted/20">
      <div className="flex items-center justify-between px-2 pb-2">
        <h2 className="font-semibold">Payment History</h2>

        <Badge variant={debtStatus} className="capitalize">
          {debtStatus.toLowerCase().replaceAll("_", " ")}
        </Badge>
      </div>
      <ul>
        {installmentPlans.map((item) => (
          <li
            key={`installment-plan-${item.id}`}
            className={cn(
              "relative after:absolute after:left-[25px] after:top-[26px] after:-z-10 after:-bottom-[13px] after:w-[2px] after:bg-muted last:after:hidden",
              item.status === InstallmentPlanItemStatus.PAID
                ? "after:bg-green-500/30"
                : ""
            )}
          >
            <div className="relative flex cursor-pointer items-start gap-4 rounded-md px-4 py-3 text-sm transition-colors hover:bg-muted/30">
              <StatusUi
                status={item.status}
                isNext={nextUpcoming === item.id}
              />
              <div>
                <p className="text-sm font-semibold">
                  {formatDate(item.payment_date)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ₱ {item.payment_amount.toLocaleString()}
                </p>
                {item.actual_payment_date ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Paid on {formatDate(item.actual_payment_date)}
                  </p>
                ) : null}
                {item.note ? (
                  <p className="mt-2 flex items-center text-xs text-muted-foreground">
                    <NotepadTextIcon className="mr-1 size-3" /> {item.note}
                  </p>
                ) : null}
              </div>

              <div className="ml-auto">
                <InstallmentPlanRowActions installmentPlanItem={item} />
              </div>
            </div>
          </li>
        ))}

        <li className="relative after:absolute after:left-[25px] after:top-6 after:-z-10 after:h-full after:w-[2px] after:bg-muted last:after:hidden">
          <div className="relative flex cursor-pointer items-start gap-4 rounded-md px-4 py-3 text-sm">
            <div className="ml-1 mt-0.5">
              <span>🎉</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Fully Paid!</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}

function StatusUi({
  status,
  isNext,
}: {
  status: InstallmentPlanItemStatus
  isNext?: boolean
}) {
  if (isNext) {
    return <CircleIcon className="ml-0.5 size-4 text-green-500" />
  }

  if (status === InstallmentPlanItemStatus.UPCOMING) {
    return <CircleIcon className="ml-0.5 size-4 text-muted-foreground" />
  }

  if (status === InstallmentPlanItemStatus.PAID) {
    return <CircleCheckIcon className="ml-0.5 size-4 text-green-500" />
  }
}
