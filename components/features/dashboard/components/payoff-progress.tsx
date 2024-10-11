import { getDebtPayoffProgress } from "@/queries/debt"

import { PayoffProgressClient } from "./payoff-progress.client"

export async function PayoffProgress({ month }: { month?: string }) {
  const data = await getDebtPayoffProgress({ month })

  return (
    <PayoffProgressClient
      unpaid={data.unpaid}
      paid={data.paid}
      lastPayment={data.lastPayment}
    />
  )
}
