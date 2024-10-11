import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateStr: string) => format(dateStr, "MMM dd, yyyy")

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

export function getMonthYearDisplay(month?: string) {
  if (month === "All") return "All Time"

  const monthNow = new Date().getMonth()

  const currentMonth = month ? MONTHS.indexOf(month) : monthNow

  const year = new Date().getFullYear()

  return format(new Date(year, currentMonth), "MMMM yyyy")
}
