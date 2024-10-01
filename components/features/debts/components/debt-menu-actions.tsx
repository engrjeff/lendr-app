"use client"

import { useState } from "react"
import Link from "next/link"
import { DebtItem } from "@/queries/debt"
import { DebtStatus } from "@prisma/client"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DebtDeleteDialog } from "./debt-delete-dialog"
import { EditDebtForm } from "./edit-debt-form"

type DebtAction = "view" | "edit" | "delete"

export function DebtMenuActions({ debt }: { debt: DebtItem }) {
  const [action, setAction] = useState<DebtAction>()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/debts/${debt.id}`}>View Details</Link>
          </DropdownMenuItem>
          {debt.status !== DebtStatus.PAID ? (
            <DropdownMenuItem onClick={() => setAction("edit")}>
              Edit
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            onClick={() => setAction("delete")}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DebtDeleteDialog
        debt={debt}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />

      <EditDebtForm
        debt={debt}
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />
    </>
  )
}
