"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { categories } from "./debt-categories"

const chartConfig = categories.reduce((config, item) => {
  return {
    ...config,
    [item.name]: {
      label: item.name,
      color: item.chartColor,
    },
  }
}, {} as ChartConfig) satisfies ChartConfig

interface Props {
  debtsByCategory: Array<{ category: string; balance: number }>
}

export function DebtByCategoryChartClient({ debtsByCategory }: Props) {
  const totalBalance = React.useMemo(() => {
    return debtsByCategory?.reduce((acc, curr) => {
      const bal = curr.balance ?? 0

      return acc + bal
    }, 0)
  }, [debtsByCategory])

  const chartData = debtsByCategory?.map((debt) => ({
    category: debt.category,
    balance: debt.balance ?? 0,
    fill: chartConfig[debt.category as keyof ChartConfig]?.color,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Balance by Category</CardTitle>
        <CardDescription>Showing remaining balance to pay.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="balance"
              nameKey="category"
              innerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-semibold"
                        >
                          {totalBalance?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Balance in Peso
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
