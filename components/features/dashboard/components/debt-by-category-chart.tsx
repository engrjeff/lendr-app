import { getDebtsGroupedByCategory } from "@/queries/debt"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { DebtByCategoryChartClient } from "./debt-by-category-chart.client"

export async function DebtByCategoryChart() {
  const debtsByCategory = await getDebtsGroupedByCategory()

  if (!debtsByCategory.length)
    return (
      <Card className="flex min-h-[250px] flex-col">
        <CardHeader className="p-3">
          <CardTitle className="text-lg">Balance by Category</CardTitle>
          <CardDescription>Showing remaining balance to pay.</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <p className="text-center text-sm text-muted-foreground">
            No data to show
          </p>
        </CardContent>
      </Card>
    )

  return <DebtByCategoryChartClient debtsByCategory={debtsByCategory} />
}
