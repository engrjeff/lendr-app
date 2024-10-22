import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        INVENTORY:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        NON_INVENTORY:
          "border-transparent bg-sky-500 text-primary-foreground hover:bg-sky-500/80",
        SERVICE:
          "border-transparent bg-green-600 text-primary-foreground hover:bg-green-600/80",
        INVENTORY_ASSEMBLY:
          "border-transparent bg-purple-600 text-primary-foreground hover:bg-purple-600/80",
        UPCOMING: "border-transparent bg-amber-500/20 text-amber-500",
        IN_PROGRESS: "border-transparent bg-amber-500/20 text-amber-500",
        CANCELLED: "border-transparent bg-red-500/20 text-red-500",
        PAID: "border-transparent bg-green-500/20 text-green-500",
        PAST_DUE: "border-transparent bg-amber-500/20 text-amber-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
