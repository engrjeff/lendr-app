import { Debt } from "@prisma/client"

import { DebtCard } from "./debt-card"

export function DebtList({ debts }: { debts: Debt[] }) {
  return (
    <ul className="space-y-4">
      {debts.map((debt) => (
        <li key={`debt-${debt.id}`}>
          <DebtCard debt={debt} />
        </li>
      ))}
    </ul>
  )
}
