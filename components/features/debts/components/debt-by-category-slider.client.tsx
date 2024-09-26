"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

import { categories } from "./debt-categories"

interface Props {
  data: {
    total: number
    category: string
    paid: number | null
    balance: number
  }[]
}

const chartConfig = categories.reduce((config, item) => {
  return {
    ...config,
    [item.name]: {
      label: item.name,
      color: item.chartColor,
    },
  }
}, {} as ChartConfig) satisfies ChartConfig

export function DebtByCategorySliderClient({ data }: Props) {
  const chartData = data?.map((item) => ({
    category: item.category,
    balance: item.balance,
    fill: chartConfig[item.category as keyof ChartConfig]?.color,
    percentPaid: item.paid ? item.paid / item.total : 0,
    paid: item.paid ?? 0,
    total: item.total,
  }))

  return (
    <Carousel
      className="relative w-full lg:col-span-3"
      opts={{ align: "start" }}
    >
      <CarouselContent>
        {chartData.map((item, index) => (
          <CarouselItem
            key={index}
            className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0 pt-3">
                <CardTitle className="text-base">{item.category}</CardTitle>
                <CardDescription>
                  Total: Php {item.total?.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-1">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[200px] md:max-h-[220px]"
                >
                  <RadialBarChart
                    data={[item]}
                    startAngle={0}
                    endAngle={360 * item.percentPaid}
                    innerRadius={80}
                    outerRadius={110}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[86, 74]}
                    />
                    <RadialBar dataKey="paid" background cornerRadius={10} />
                    <PolarRadiusAxis
                      tick={false}
                      tickLine={false}
                      axisLine={false}
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
                                  className="fill-foreground text-xl font-bold"
                                >
                                  {(item.percentPaid * 100).toFixed(1)}%
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Paid
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  Balance
                </div>
                <div className="flex items-center gap-2 font-medium leading-none">
                  Php {item.balance?.toLocaleString()}
                </div>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant="ghost"
        className="left-2 bg-gray-100 dark:bg-muted/30"
      />
      <CarouselNext
        variant="ghost"
        className="right-2 bg-gray-100 dark:bg-muted/30"
      />
    </Carousel>
  )
}
