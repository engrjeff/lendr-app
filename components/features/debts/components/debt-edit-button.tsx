"use client"

import { useState } from "react"
import { DebtItem } from "@/queries/debt"
import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { EditDebtForm } from "./edit-debt-form"

export function DebtEditButton({ debt }: { debt: DebtItem }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <PencilIcon className="mr-2 size-4" /> Update
      </Button>
      <EditDebtForm open={open} onOpenChange={setOpen} debt={debt} />
    </>
  )
}
