import bcrypt from "bcryptjs"
import { endOfMonth, format, startOfMonth } from "date-fns"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export function appendCurrency(input: any) {
  if (!input) return ["₱", "0.00"].join(" ")

  return ["₱", Number(input).toFixed(2)].join(" ")
}

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

export function getMonthFilter(month?: string) {
  if (month === "All") return { startDate: undefined, endDate: undefined }

  const monthIndex =
    month && MONTHS.includes(month)
      ? MONTHS.indexOf(month)
      : new Date().getMonth()

  const year = new Date().getFullYear()

  const now = new Date(year, monthIndex)

  const startDate = startOfMonth(now)
  const endDate = endOfMonth(now)

  return {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  }
}

export function getMonthYearDisplay(month?: string) {
  if (month === "All") return "All Time"

  const monthNow = new Date().getMonth()

  const currentMonth = month ? MONTHS.indexOf(month) : monthNow

  const year = new Date().getFullYear()

  return format(new Date(year, currentMonth), "MMMM yyyy")
}
