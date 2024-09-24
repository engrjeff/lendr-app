import { cn } from "@/lib/utils"

import { categories } from "./debt-categories"

export function DebtCategoryIcon({
  debtCategory,
  noBg,
}: {
  debtCategory: string
  noBg?: boolean
}) {
  const category = categories.find((cat) => cat.name === debtCategory)

  return (
    <div
      className={cn(
        category?.textColor,
        category?.bgColor,
        "size-9 rounded-full flex items-center justify-center bg-opacity-70 dark:bg-opacity-10",
        noBg ? "bg-transparent dark:bg-transparent" : ""
      )}
    >
      {category?.icon}
    </div>
  )
}
