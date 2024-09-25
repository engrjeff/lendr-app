import { useState } from "react"
import {
  payInstallmentItemAction,
  saveInstallmentNoteAction,
} from "@/actions/debt"
import { payInstallmentSchema, PayInstallmentSchema } from "@/schema/debt"
import { zodResolver } from "@hookform/resolvers/zod"
import { InstallmentPlanItem, InstallmentPlanItemStatus } from "@prisma/client"
import { format } from "date-fns"
import { MoreHorizontal, NotepadTextIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

type Action = "pay-now" | "change-status" | "add-note"

export function InstallmentPlanRowActions({
  installmentPlanItem,
}: {
  installmentPlanItem: InstallmentPlanItem
}) {
  const [action, setAction] = useState<Action>()

  return (
    <>
      <div className="flex items-center gap-4">
        {installmentPlanItem.status ===
        InstallmentPlanItemStatus.PAID ? null : (
          <Button
            size="sm"
            variant="link"
            onClick={() => setAction("pay-now")}
            className="text-green-500 disabled:cursor-not-allowed disabled:text-muted-foreground"
          >
            Mark as Paid
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">More actions</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={() => setAction("change-status")}>
              <PencilIcon className="mr-3 size-4" /> Update Status
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => setAction("add-note")}>
              <NotepadTextIcon className="mr-3 size-4" />{" "}
              {installmentPlanItem.note ? "Update Note" : "Add Note"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={action === "pay-now"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <DialogPortal>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                Pay for Date {installmentPlanItem.payment_date}
              </DialogTitle>
            </DialogHeader>
            <InstallmentPayForm
              installmentPlanItem={installmentPlanItem}
              afterSubmit={() => setAction(undefined)}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <Dialog
        open={action === "add-note"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <DialogPortal>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {installmentPlanItem.note ? "Update" : "Add"} Note for Date{" "}
                {installmentPlanItem.payment_date}
              </DialogTitle>
            </DialogHeader>
            <InstallmentNoteForm
              installmentId={installmentPlanItem.id}
              initialValue={installmentPlanItem.note}
              afterSubmit={() => setAction(undefined)}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}

export function InstallmentPlanItemAction({
  installmentPlanItem,
}: {
  installmentPlanItem: InstallmentPlanItem
}) {
  const [action, setAction] = useState<Action>()

  return (
    <>
      {installmentPlanItem.status === InstallmentPlanItemStatus.PAID ? null : (
        <Button
          size="sm"
          className="bg-green-600"
          onClick={() => setAction("pay-now")}
        >
          Mark as Paid
        </Button>
      )}

      <Dialog
        open={action === "pay-now"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <DialogPortal>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                Pay for Date {installmentPlanItem.payment_date}
              </DialogTitle>
            </DialogHeader>
            <InstallmentPayForm
              installmentPlanItem={installmentPlanItem}
              afterSubmit={() => setAction(undefined)}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <Dialog
        open={action === "add-note"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <DialogPortal>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {installmentPlanItem.note ? "Update" : "Add"} Note for Date{" "}
                {installmentPlanItem.payment_date}
              </DialogTitle>
            </DialogHeader>
            <InstallmentNoteForm
              installmentId={installmentPlanItem.id}
              initialValue={installmentPlanItem.note}
              afterSubmit={() => setAction(undefined)}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}

function InstallmentPayForm({
  installmentPlanItem,
  afterSubmit,
}: {
  installmentPlanItem: InstallmentPlanItem
  afterSubmit: () => void
}) {
  const form = useForm<PayInstallmentSchema>({
    mode: "onChange",
    resolver: zodResolver(payInstallmentSchema),
    defaultValues: {
      payment_amount: installmentPlanItem.payment_amount,
      payment_date: format(installmentPlanItem.payment_date, "yyyy-MM-dd"),
      actual_payment_date: format(
        installmentPlanItem.payment_date,
        "yyyy-MM-dd"
      ),
      note: installmentPlanItem.note ?? "",
    },
  })

  const action = useServerAction(payInstallmentItemAction)

  async function onSubmit(values: PayInstallmentSchema) {
    const [result, err] = await action.execute({
      id: installmentPlanItem.id,
      ...values,
    })

    if (err) {
      toast.error(err.message)
      return
    }

    toast.success(`Success!`)

    afterSubmit()
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <fieldset
          disabled={action.isPending}
          className="mt-2 space-y-4 disabled:opacity-80"
        >
          <FormField
            control={form.control}
            name="payment_amount"
            render={() => (
              <FormItem>
                <FormLabel>Payment Amount *</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="0.00"
                    currency="PHP"
                    disabled
                    {...form.register("payment_amount", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Payment Date"
                      type="date"
                      min={format(new Date(), "yyyy-MM-dd")}
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actual_payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Payment Date *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Actual payment date"
                      type="date"
                      max={format(new Date(), "yyyy-MM-dd")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your note" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
            <SubmitButton loading={action.isPending}>Pay Now</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}

function InstallmentNoteForm({
  initialValue,
  installmentId,
  afterSubmit,
}: {
  initialValue: string | null
  installmentId: string
  afterSubmit: () => void
}) {
  const form = useForm<{ note?: string }>({
    defaultValues: {
      note: initialValue ?? "",
    },
  })

  const action = useServerAction(saveInstallmentNoteAction)

  async function onSubmit(values: { note?: string }) {
    const [result, err] = await action.execute({
      id: installmentId,
      note: values.note,
    })

    if (err) {
      toast.error(err.message)
      return
    }

    toast.success(`Note saved!`)

    afterSubmit()
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <fieldset
          disabled={action.isPending}
          className="mt-2 space-y-4 disabled:opacity-80"
        >
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your note" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
            <SubmitButton
              disabled={!form.watch("note")}
              loading={action.isPending}
            >
              Save Note
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
