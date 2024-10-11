"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getMonthYearDisplay } from "@/server/utils"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button, buttonVariants } from "../ui/button"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
  "All",
]

export function MonthFilter() {
  const [open, setOpen] = useState(false)

  const searchParams = useSearchParams()

  const monthParam = searchParams.get("month") ?? undefined

  const monthNow = new Date().getMonth()

  const currentMonth = monthParam ? MONTHS.indexOf(monthParam) : monthNow

  const monthYear = getMonthYearDisplay(monthParam)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="mr-2 size-4" /> {monthYear}
          <ChevronDownIcon className="ml-2 size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="p-2"
        onClick={() => setOpen(false)}
      >
        <div className="grid grid-cols-4 gap-2">
          {MONTHS.map((month, index) => (
            <Link
              key={`month-filter-${month}`}
              href={`/dashboard?month=${month}`}
              className={cn(
                buttonVariants({
                  variant: currentMonth === index ? "default" : "ghost",
                  size: "icon",
                }),
                "size-12"
              )}
            >
              {month}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
