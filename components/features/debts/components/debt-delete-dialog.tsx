"use client"

import { ComponentProps } from "react"
import { deleteDebtAction } from "@/actions/debt"
import { Debt } from "@prisma/client"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SubmitButton } from "@/components/ui/submit-button"

interface DebtDeleteDialogProps extends ComponentProps<typeof AlertDialog> {
  debt: Debt
}

export function DebtDeleteDialog({ debt, ...props }: DebtDeleteDialogProps) {
  const deleteAction = useServerAction(deleteDebtAction)

  async function handleDelete() {
    try {
      const [data, err] = await deleteAction.execute({
        id: debt.id,
      })

      if (err) {
        toast.error(err.message)
        return
      }

      toast.success(`Debt deleted!`)

      if (props.onOpenChange) {
        props.onOpenChange(false)
      }
    } catch (error) {}
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{debt.nickname}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitButton
            onClick={handleDelete}
            loading={deleteAction.isPending}
            type="button"
            variant="destructive"
          >
            Delete
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
