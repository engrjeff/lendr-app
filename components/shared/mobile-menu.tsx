"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, ListTodo, Menu, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { NavLink } from "./nav-link"

function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1 shrink-0 lg:hidden"
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col"
        onClick={() => setOpen(false)}
      >
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            Lendr
          </Link>
          <NavLink className="max-w-full" href="/dashboard">
            <Home className="size-5" />
            Dashboard
          </NavLink>
          <NavLink className="max-w-full" href="/debts">
            <ListTodo className="size-5" />
            Debts
          </NavLink>
          <NavLink className="max-w-full" href="/transactions">
            <TrendingUp className="size-5" />
            Transactions
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
