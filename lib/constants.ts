import { Home, ListTodo, TrendingUp, type LucideIcon } from "lucide-react"

export type SimpleMenuItem = {
  label: string
  href: string
  Icon: LucideIcon
}

export type AppMenuItem = SimpleMenuItem

export const APP_MENU: AppMenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    Icon: Home,
  },
  {
    label: "Debts",
    href: "/debts",
    Icon: ListTodo,
  },
  {
    label: "Transactions",
    href: "/transactions",
    Icon: TrendingUp,
  },
]
