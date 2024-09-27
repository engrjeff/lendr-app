import { type ChartConfig } from "@/components/ui/chart"

import { categories } from "../../debts/components/debt-categories"

export const chartConfig = categories.reduce((config, item) => {
  return {
    ...config,
    [item.name]: {
      label: item.name,
      color: item.chartColor,
    },
  }
}, {} as ChartConfig) satisfies ChartConfig
