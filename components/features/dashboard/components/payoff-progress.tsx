import { getDebtPayoffProgress } from "@/queries/debt"

import { PayoffProgressClient } from "./payoff-progress.client"

export async function PayoffProgress() {
  const data = await getDebtPayoffProgress()

  return (
    <PayoffProgressClient
      unpaid={data.unpaid}
      paid={data.paid}
      lastPayment={data.lastPayment}
    />
  )
}
