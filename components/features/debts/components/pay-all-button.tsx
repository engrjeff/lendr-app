import { useState } from "react"
import { useParams } from "next/navigation"
import { payAllInstallmentAction } from "@/actions/debt"
import { payAllInstallmentSchema, PayAllInstallmentSchema } from "@/schema/debt"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CheckIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

export function PayAllButton({ totalBalance }: { totalBalance: number }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="ml-4 h-10">
          <CheckIcon className="mr-3 size-4 text-green-500" /> Mark all as Paid
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            Pay a Total of{" "}
            <span className="font-mono">
              Php {totalBalance.toLocaleString()}
            </span>
          </DialogTitle>
        </DialogHeader>
        <InstallmentPayForm
          afterSubmit={() => {
            setOpen(false)
            window.location.reload()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function InstallmentPayForm({ afterSubmit }: { afterSubmit: () => void }) {
  const params = useParams<{ id: string }>()

  const form = useForm<PayAllInstallmentSchema>({
    mode: "onChange",
    resolver: zodResolver(payAllInstallmentSchema),
    defaultValues: {
      debtId: params.id, // debt id
      actual_payment_date: format(new Date(), "yyyy-MM-dd"),
      note: "",
    },
  })

  const action = useServerAction(payAllInstallmentAction)

  async function onSubmit(values: PayAllInstallmentSchema) {
    const [result, err] = await action.execute(values)

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
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add a note" {...field} />
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
