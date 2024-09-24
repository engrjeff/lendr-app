import { getDebtPayoffProgress } from "@/queries/debt"

import { PayoffProgressClient } from "./payoff-progress.client"

export async function PayoffProgress() {
  const data = await getDebtPayoffProgress()

  return (
    <PayoffProgressClient
      nextDue={data.nextDue}
      unpaid={data.unpaid}
      paid={data.paid}
    />
  )
}
