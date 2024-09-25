import { type DebtItem } from "@/queries/debt"

import { DebtCard } from "./debt-card"

export function DebtList({ debts }: { debts: DebtItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-6 xl:grid-cols-3">
      {debts.map((debt) => (
        <li key={`debt-${debt.id}`}>
          <DebtCard debt={debt} />
        </li>
      ))}
    </ul>
  )
}
