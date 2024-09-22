import { cn } from "@/lib/utils"

import { categories } from "./debt-categories"

export function DebtCategoryIcon({ debtCategory }: { debtCategory: string }) {
  const category = categories.find((cat) => cat.name === debtCategory)

  return (
    <div
      className={cn(
        category?.textColor,
        category?.bgColor,
        "size-9 rounded-full flex items-center justify-center bg-opacity-70 dark:bg-opacity-10"
      )}
    >
      {category?.icon}
    </div>
  )
}
