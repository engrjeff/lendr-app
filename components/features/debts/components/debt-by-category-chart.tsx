"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
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

export const description = "A donut chart with text"

// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 190, fill: "var(--color-other)" },
// ]

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
  debtsByCategory: Array<{
    _sum: { balance: number | null }
    category: string
  }> | null
}

export function DebtByCategoryChart({ debtsByCategory }: Props) {
  const totalBalance = React.useMemo(() => {
    return debtsByCategory?.reduce((acc, curr) => {
      const bal = curr._sum.balance ?? 0

      return acc + bal
    }, 0)
  }, [debtsByCategory])

  const chartData = debtsByCategory?.map((debt) => ({
    category: debt.category,
    balance: debt._sum.balance ?? 0,
    fill: chartConfig[debt.category as keyof ChartConfig]?.color,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Balance by Category</CardTitle>
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="hidden items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing remaining balance to pay.
        </div>
      </CardFooter>
    </Card>
  )
}
