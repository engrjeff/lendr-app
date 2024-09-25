"use client"

import { useEffect, useRef, useState } from "react"
import { createDebtAction } from "@/actions/debt"
import { createDebtSchema, CreateDebtSchema } from "@/schema/debt"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns"
import { InfoIcon, PlusCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

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
  SheetTrigger,
} from "@/components/ui/sheet"
import { SubmitButton } from "@/components/ui/submit-button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { categories } from "./debt-categories"

export function NewDebtForm() {
  const [open, onOpenChange] = useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusCircleIcon className="mr-2 size-4" />
          Add Debt
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[95%] overflow-y-auto sm:max-w-[450px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Add Debt Entry</SheetTitle>
          <SheetDescription>Fill in the form below.</SheetDescription>
        </SheetHeader>
        <DebtForm afterSubmit={() => onOpenChange(false)} />
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

function DebtForm({ afterSubmit }: { afterSubmit: () => void }) {
  const form = useForm<CreateDebtSchema>({
    resolver: zodResolver(createDebtSchema),
    mode: "onChange",
    defaultValues: {
      category: "",
      frequency: "Monthly",
      is_mine: true,
      nickname: "",
      next_payment_due_date: "",
      lendee_name: "",
      lendee_email: "",
      duration: 1,
    },
  })

  const formRef = useRef<HTMLFormElement | null>(null)

  const action = useServerAction(createDebtAction)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, minPayment, frequency])

  const isPending = action.isPending

  const isUserDebt = form.watch("is_mine")

  async function onSubmit(values: CreateDebtSchema) {
    const [result, err] = await action.execute(values)

    if (err) {
      toast.error(err.message)
      form.setFocus("nickname")
      return
    }

    toast.success(`${result.nickname} saved!`)

    formRef.current?.reset()

    afterSubmit()
  }

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
                <FormLabel>Nickname *</FormLabel>
                <FormControl>
                  <Input placeholder="Nickname" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive name for this debt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="balance"
            render={() => (
              <FormItem>
                <FormLabel>Balance *</FormLabel>
                <FormControl>
                  <NumberInput
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
            name="minimum_payment"
            render={() => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Installment Payment * </FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button" aria-label="What is this?">
                        <InfoIcon className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-60">
                        <p>
                          The lowest amount you are required to pay without
                          incurring a penalty.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <NumberInput
                    disabled={!form.watch("balance")}
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
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Frequency *</FormLabel>
                <FormControl>
                  <NativeSelect
                    {...field}
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
                    type="date"
                    className="w-1/2"
                    min={format(new Date(), "yyyy-MM-dd")}
                    {...field}
                  />
                </FormControl>
                {form.watch("next_payment_due_date") ? (
                  <FormDescription>
                    Expected paid off date:{" "}
                    {getPaidOffDate(nextPaymentDate, duration, frequency)}
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

          <div className="pt-6">
            <SubmitButton loading={isPending} type="submit">
              Save Debt
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}

const formatDate = (dateStr: string) => format(dateStr, "MMM dd, yyyy")

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
