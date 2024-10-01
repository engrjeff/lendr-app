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

import { chartConfig } from "./chart-config"

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
    <Card className="flex max-w-md flex-col">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-semibold">
          Balance by Category
        </CardTitle>
        <CardDescription>Showing remaining balance to pay.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-3">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] md:max-h-[220px]"
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
              innerRadius={60}
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
                          className="fill-foreground text-lg font-semibold"
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

        <div className="flex flex-wrap items-center justify-center gap-4">
          {chartData.map((data) => (
            <div key={data.category} className="flex items-center">
              <div
                className="mr-2 size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: data.fill }}
              ></div>
              <span className="text-xs">{data.category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
