"use client"

import { Suspense } from "react"
import { DebtItem } from "@/queries/debt"
import { InstallmentPlanItem, InstallmentPlanItemStatus } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { isBefore } from "date-fns"

import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table/data-table"
import { useDataTable } from "@/components/ui/data-table/useDataTable"

import { DebtEditButton } from "./debt-edit-button"
import { InstallmentList } from "./installment-list"
import { InstallmentPlanRowActions } from "./installment-plan-row-actions"
import { PayAllButton } from "./pay-all-button"
import { StatusFilter } from "./status-filter"

const columns: ColumnDef<InstallmentPlanItem>[] = [
  {
    id: "select",
    header: ({ table, column, header }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        disabled={row.original.status === InstallmentPlanItemStatus.PAID}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "payment_date",
    header: () => <div className="text-nowrap px-4 py-3">Due Date</div>,
    cell: ({ row }) => (
      <div className="text-nowrap">{formatDate(row.original.payment_date)}</div>
    ),
  },
  {
    accessorKey: "actual_payment_date",
    header: () => <div className="text-nowrap px-4 py-3">Payment Date</div>,
    cell: ({ row }) => (
      <div className="text-nowrap">
        {row.original.actual_payment_date
          ? formatDate(row.original.actual_payment_date)
          : "--"}
      </div>
    ),
  },
  {
    accessorKey: "payment_amount",
    header: () => <div className="text-nowrap px-4 py-3">Payment Amount</div>,
    cell: ({ row }) => (
      <div className="text-nowrap text-left font-mono">
        Php {row.original.payment_amount.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="px-4 py-3">Status</div>,
    cell: ({ row }) => {
      if (
        row.original.status !== InstallmentPlanItemStatus.PAID &&
        isBefore(row.original.payment_date, new Date())
      ) {
        return <Badge variant="PAST_DUE">Past Due</Badge>
      }

      return (
        <Badge variant={row.original.status}>{row.getValue("status")}</Badge>
      )
    },
  },

  {
    accessorKey: "note",
    header: () => <div className="px-4 py-3">Note</div>,
    cell: ({ row }) =>
      row.getValue("note") ? (
        <div className="text-nowrap">{row.getValue("note")}</div>
      ) : (
        <div className="">{"--"}</div>
      ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="px-4 py-3 text-center">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <InstallmentPlanRowActions installmentPlanItem={row.original} />
        </div>
      )
    },
  },
]

const statusFilterOptions = [
  {
    value: InstallmentPlanItemStatus.UPCOMING,
    label: "Upcoming",
  },
  {
    value: InstallmentPlanItemStatus.PAID,
    label: "Paid",
  },
  {
    value: InstallmentPlanItemStatus.PAST_DUE,
    label: "Past Due",
  },
]

export function DebtInstallmentPlans({
  installmentPlans,
  debt,
}: {
  debt: DebtItem
  installmentPlans: InstallmentPlanItem[]
}) {
  const table = useDataTable({ data: installmentPlans ?? [], columns })

  const totalBalance = installmentPlans.reduce(
    (total, item) => total + item.payment_amount,
    0
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Suspense>
          <StatusFilter
            defaultValue={InstallmentPlanItemStatus.UPCOMING}
            options={statusFilterOptions}
          />
        </Suspense>
        {table.getIsAllRowsSelected() && installmentPlans.length !== 1 ? (
          <PayAllButton totalBalance={totalBalance} />
        ) : null}

        <div className="ml-auto">
          <DebtEditButton debt={debt} />
        </div>
      </div>
      <div className="hidden md:block">
        <DataTable table={table} columnLength={columns.length} noHover />
      </div>

      <div className="block md:hidden">
        <InstallmentList installmentPlans={installmentPlans} />
      </div>
    </div>
  )
}
