import { type DebtItem } from "@/queries/debt"

import { cn } from "@/lib/utils"

import { DebtCard } from "./debt-card"

export function DebtList({
  debts,
  className,
}: {
  debts: DebtItem[]
  className?: string
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {debts.map((debt) => (
        <li key={`debt-${debt.id}`}>
          <DebtCard debt={debt} />
        </li>
      ))}
    </ul>
  )
}
