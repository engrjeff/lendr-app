"use client"

import { InstallmentPlanItem } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table/data-table"
import { useDataTable } from "@/components/ui/data-table/useDataTable"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"

import { InstallmentPlanRowActions } from "./installment-plan-row-actions"
import { PayAllButton } from "./pay-all-button"

export const columns: ColumnDef<InstallmentPlanItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
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
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "index",
    header: ({ table }) => <span>#</span>,
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "payment_date",
    header: () => <div className="px-4 py-3">Payment Date</div>,
    cell: ({ row }) => (
      <div className="text-nowrap">{row.getValue("payment_date")}</div>
    ),
  },
  {
    accessorKey: "payment_amount",
    header: () => <div className="px-4 py-3">Payment Amount (Php)</div>,
    cell: ({ row }) => (
      <div className="text-nowrap text-left font-mono">
        {row.original.payment_amount.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="px-4 py-3">Status</div>,
    cell: ({ row }) => (
      <Badge variant={row.original.status}>{row.getValue("status")}</Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="px-4 py-3">Actions</div>,
    cell: ({ row }) => {
      return <InstallmentPlanRowActions installmentPlanItem={row.original} />
    },
  },
  {
    accessorKey: "note",
    header: () => <div className="px-4 py-3">Note</div>,
    cell: ({ row }) => (
      <div className="text-nowrap">{row.getValue("note")}</div>
    ),
  },
]

export function DebtInstallmentPlans({
  installmentPlans,
}: {
  installmentPlans: InstallmentPlanItem[]
}) {
  const table = useDataTable({ data: installmentPlans ?? [], columns })

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Label htmlFor="status-filter">Status</Label>
        <NativeSelect
          id="status-filter"
          defaultValue="all"
          className="ml-3 w-32"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="paid">Paid</option>
          <option value="past-due">Past Due</option>
        </NativeSelect>

        {table.getIsAllRowsSelected() ? <PayAllButton /> : null}
      </div>
      <DataTable table={table} columnLength={columns.length} noHover />
    </div>
  )
}
