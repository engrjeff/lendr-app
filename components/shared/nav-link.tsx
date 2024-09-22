"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export const NavLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, ...props }, ref) => {
  const pathname = usePathname()

  const isActive = pathname.startsWith(props.href.toString())

  return (
    <Link
      {...props}
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-3 py-1.5 transition-all text-[13px]",
        isActive
          ? "text-primary-foreground bg-primary data-[submenu=true]:bg-background data-[submenu=true]:text-primary"
          : "text-muted-foreground hover:text-primary",
        className
      )}
    />
  )
})

NavLink.displayName = "NavLink"
