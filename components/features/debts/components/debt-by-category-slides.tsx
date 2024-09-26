import { getBalancesByCategory } from "@/queries/debt"

import { DebtByCategorySliderClient } from "./debt-by-category-slider.client"

export async function DebtByCategorySlider() {
  const data = await getBalancesByCategory()

  return <DebtByCategorySliderClient data={data} />
}
