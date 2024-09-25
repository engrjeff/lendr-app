"use client"

import Link from "next/link"
import { Session } from "next-auth"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignoutDialog } from "@/app/(auth)/components/SignoutDialog"

import { Avatar, AvatarFallback } from "../ui/avatar"
import { ThemeToggler } from "./theme-toggler"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s.charAt(0))
    .join("")
}

function UserMenu({ user }: { user?: Session["user"] }) {
  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="size-auto rounded">
          <Avatar className="size-8 rounded">
            <AvatarFallback className="rounded bg-primary text-white">
              {getInitials(user.name!)}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <p>{user.name}</p>
          <p className="text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Account</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/debts">Track Debt</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
          <span>Theme</span>
          <ThemeToggler />
        </div>
        <DropdownMenuSeparator />
        <SignoutDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
