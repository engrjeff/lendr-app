"use client"

import { useEffect, useRef } from "react"
import { editDebtAction } from "@/actions/debt"
import { DebtItem } from "@/queries/debt"
import { createDebtSchema, CreateDebtSchema } from "@/schema/debt"
import { zodResolver } from "@hookform/resolvers/zod"
import { InstallmentPlanItemStatus } from "@prisma/client"
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns"
import { InfoIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { NumberInput } from "@/components/ui/number-input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SubmitButton } from "@/components/ui/submit-button"

import { categories } from "./debt-categories"

interface Props {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  debt: DebtItem
}

export function EditDebtForm({ open, onOpenChange, debt }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[95%] overflow-y-auto sm:max-w-[450px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Edit {debt.nickname}</SheetTitle>
          <SheetDescription>Save your changes once done.</SheetDescription>
        </SheetHeader>
        <DebtForm debt={debt} afterSubmit={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}

const durationMap = {
  "One Time Payment": "",
  Daily: "day(s)",
  Weekly: "week(s)",
  Monthly: "month(s)",
  Quarterly: "quarter(s)",
  Annually: "year(s)",
}

function DebtForm({
  afterSubmit,
  debt,
}: {
  afterSubmit: () => void
  debt: DebtItem
}) {
  const form = useForm<CreateDebtSchema>({
    resolver: zodResolver(createDebtSchema),
    mode: "onChange",
    defaultValues: {
      category: debt.category ?? "",
      frequency: debt.frequency ?? "",
      is_mine: Boolean(debt.is_mine),
      nickname: debt.nickname,
      balance: debt.balance,
      minimum_payment: debt.minimum_payment,
      next_payment_due_date: debt.next_payment_due_date,
      lendee_name: debt.lendee_name ?? "",
      lendee_email: debt.lendee_email ?? "",
      should_notify: Boolean(debt.should_notify),
      duration: debt.duration,
    },
  })

  const formRef = useRef<HTMLFormElement | null>(null)

  const action = useServerAction(editDebtAction)

  const balance = form.watch("balance")
  const minPayment = form.watch("minimum_payment")

  const duration = form.watch("duration")
  const nextPaymentDate = form.watch("next_payment_due_date")
  const frequency = form.watch("frequency")

  useEffect(() => {
    if (minPayment && balance) {
      form.setValue("duration", Math.ceil(balance / minPayment))
    } else {
      form.setValue("duration", 1)
    }

    if (frequency === "One Time Payment") {
      form.setValue("minimum_payment", balance)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, minPayment, frequency])

  const isPending = action.isPending

  const isUserDebt = form.watch("is_mine")

  async function onSubmit(values: CreateDebtSchema) {
    const [result, err] = await action.execute({
      id: debt.id,
      data: values,
    })

    if (err) {
      toast.error(err.message)
      form.setFocus("nickname")
      return
    }

    toast.success(`${result.nickname} saved!`)

    formRef.current?.reset()

    afterSubmit()
  }

  const hasPaidInstallment = debt.installment_plans.some(
    (item) => item.status === InstallmentPlanItemStatus.PAID
  )

  return (
    <Form {...form}>
      <form
        ref={formRef}
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <fieldset
          disabled={isPending}
          className="mt-6 space-y-4 disabled:opacity-80"
        >
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <FormControl>
                  <NativeSelect {...field}>
                    <option value="">Choose a category</option>
                    {categories.map((category) => (
                      <option
                        key={`category-${category.name}`}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Debt name" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive name for this debt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasPaidInstallment ? (
            <div className="rounded border-l-2 border-blue-500 bg-blue-500/30 px-3 py-3">
              <InfoIcon className="size-4 mb-1" />
              <p className="text-xs">
                The following fields can no longer be edited since a payment for
                one or more installment plans for this debt has already been
                paid.
              </p>
            </div>
          ) : null}
          <FormField
            control={form.control}
            name="balance"
            render={() => (
              <FormItem>
                <FormLabel>Balance *</FormLabel>
                <FormControl>
                  <NumberInput
                    disabled={hasPaidInstallment}
                    placeholder="0.00"
                    currency="PHP"
                    min={0}
                    {...form.register("balance", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <FormDescription>
                  The current balance for this debt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Frequency *</FormLabel>
                <FormControl>
                  <NativeSelect
                    {...field}
                    disabled={hasPaidInstallment}
                    onChange={(e) => {
                      const value = e.currentTarget.value

                      if (value === "One Time Payment") {
                        form.setValue("duration", 1)
                      }

                      field.onChange(e)
                    }}
                  >
                    <option value="">Choose frequency</option>
                    {[
                      "One Time Payment",
                      "Daily",
                      "Weekly",
                      "Monthly",
                      "Quarterly",
                      "Annually",
                    ].map((item) => (
                      <option key={`item-${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimum_payment"
            render={() => (
              <FormItem>
                <FormLabel>Installment Payment * </FormLabel>
                <FormControl>
                  <NumberInput
                    disabled={
                      !form.watch("balance") ||
                      form.watch("frequency") === "One Time Payment" ||
                      hasPaidInstallment
                    }
                    placeholder="0.00"
                    currency="PHP"
                    min={0}
                    {...form.register("minimum_payment", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={() => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <NumberInput
                      disabled
                      className="w-20 rounded-r-none border-r-0 text-center"
                      placeholder="1"
                      min={1}
                      {...form.register("duration", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="inline-flex h-10 items-center rounded-r border bg-muted/60 px-1.5 text-xs text-muted-foreground empty:hidden">
                      {
                        durationMap[
                          form.watch("frequency") as keyof typeof durationMap
                        ]
                      }
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="next_payment_due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Payment Due Date *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Next Payment Due Date"
                    disabled={hasPaidInstallment}
                    type="date"
                    className="w-1/2"
                    min={format(new Date(), "yyyy-MM-dd")}
                    {...field}
                  />
                </FormControl>
                {form.watch("next_payment_due_date") ? (
                  <FormDescription>
                    Expected paid off date:{" "}
                    {getPaidOffDate(nextPaymentDate, duration - 1, frequency)}
                  </FormDescription>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <div>
            <h2 className="text-sm font-semibold">Lendee/Borrower Details</h2>
            <p className="text-xs text-muted-foreground">
              Information about this debt&apos;s lendee
            </p>
          </div>
          <FormField
            control={form.control}
            name="is_mine"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>This debt is mine.</FormLabel>
                  <FormDescription>
                    Check this if this debt is personally yours.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {isUserDebt ? null : (
            <>
              <FormField
                control={form.control}
                name="lendee_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lendee Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Lendee name" {...field} />
                    </FormControl>
                    <FormDescription>Who owes you?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lendee_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lendee Email *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lendee email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The borrower&apos;s email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="should_notify"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Notify before due date.</FormLabel>
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-6">
            <Button variant="ghost" type="button" onClick={afterSubmit}>
              Cancel
            </Button>
            <SubmitButton
              disabled={!form.formState.isDirty}
              loading={isPending}
              type="submit"
            >
              Save Changes
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}

function getPaidOffDate(
  nextPayDateStr: string,
  duration: number,
  frequency: string
) {
  if (!nextPayDateStr) return ""

  if (frequency === "One Time Payment") return formatDate(nextPayDateStr)

  if (frequency === "Daily")
    return formatDate(addDays(nextPayDateStr, duration).toDateString())

  if (frequency === "Weekly")
    return formatDate(addWeeks(nextPayDateStr, duration).toDateString())

  if (frequency === "Monthly")
    return formatDate(addMonths(nextPayDateStr, duration).toDateString())

  if (frequency === "Quarterly")
    return formatDate(
      addMonths(nextPayDateStr, Math.ceil(duration * 3)).toDateString()
    )

  if (frequency === "Annually")
    return formatDate(addYears(nextPayDateStr, duration).toDateString())
}
