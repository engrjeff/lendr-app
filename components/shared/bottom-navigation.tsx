"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  MoreHorizontalIcon,
  PiggyBankIcon,
  WalletIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-x-0 bottom-0 grid h-14 grid-cols-4 items-center justify-evenly border-t bg-background lg:hidden">
      <Link
        href="/dashboard"
        className={cn(
          "flex flex-1 flex-col items-center justify-center p-3 align-bottom",
          { "text-primary": pathname.startsWith("/dashboard") }
        )}
      >
        <HomeIcon className="size-5" />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/debts"
        className={cn(
          "flex flex-1 flex-col items-center justify-center p-3 align-bottom",
          { "text-primary": pathname.startsWith("/debts") }
        )}
      >
        <WalletIcon className="size-5" />
        <span className="text-xs">Debts</span>
      </Link>
      <Link
        href="/funds"
        className={cn(
          "flex flex-1 flex-col items-center justify-center p-3 align-bottom",
          { "text-primary": pathname.startsWith("/funds") }
        )}
      >
        <PiggyBankIcon className="size-5" />
        <span className="text-xs">Funds</span>
      </Link>
      <button
        type="button"
        disabled
        className={cn(
          "flex flex-1 flex-col items-center justify-center p-3 align-bottom disabled:opacity-80 text-muted-foreground"
        )}
      >
        <MoreHorizontalIcon className="size-5" />
        <span className="text-xs">More</span>
      </button>
    </div>
  )
}
