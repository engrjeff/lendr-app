import { DebtItem } from "@/actions/debt"

import { DebtCard } from "./debt-card"

export function DebtList({ debts }: { debts: DebtItem[] }) {
  return (
    <ul className="grid gap-6">
      {debts.map((debt) => (
        <li key={`debt-${debt.id}`}>
          <DebtCard debt={debt} />
        </li>
      ))}
    </ul>
  )
}
