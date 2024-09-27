import { getDebtPayoffProgress } from "@/queries/debt"

import { PayoffProgressClient } from "./payoff-progress.client"

export async function PayoffProgress() {
  const data = await getDebtPayoffProgress()

  return (
    <PayoffProgressClient
      lastPayment={data.lastPayment}
      nextDue={data.nextDue}
      unpaid={data.unpaid}
      paid={data.paid}
    />
  )
}
