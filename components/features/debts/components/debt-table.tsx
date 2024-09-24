"use client"

import Link from "next/link"
import { DebtItem } from "@/queries/debt"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table/data-table"
import { useDataTable } from "@/components/ui/data-table/useDataTable"
import { Progress } from "@/components/ui/progress"

import { DebtCategoryIcon } from "./debt-category-icon"
import { DebtMenuActions } from "./debt-menu-actions"

const columns: ColumnDef<DebtItem>[] = [
  {
    accessorKey: "category",
    header: () => <div className="px-4 py-3">Category</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-nowrap text-left">
        <DebtCategoryIcon noBg debtCategory={row.original.category} />{" "}
        {row.original.category}
      </div>
    ),
  },
  {
    accessorKey: "nickname",
    header: () => <div className="px-4 py-3">Name</div>,
    cell: ({ row }) => (
      <div className="text-nowrap">
        <Link href={`/debts/${row.original.id}`} className="hover:underline">
          {row.getValue("nickname")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="px-4 py-3">Status</div>,
    cell: ({ row }) => {
      if (row.original.status === "PAID") {
        return <Badge variant="PAID">PAID</Badge>
      }

      const progress =
        (row.original._count.installment_plans / row.original.duration) * 100
      const progressPercent = progress.toFixed(0) + "%"

      return (
        <div className="flex items-center gap-4">
          <Progress value={progress} max={100} className="h-2" />
          <span className="text-xs text-muted-foreground">
            {progressPercent}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "balance",
    header: () => <div className="px-4 py-3">Balance (Php)</div>,
    cell: ({ row }) => (
      <div className="text-nowrap font-mono">
        {row.original.balance.toLocaleString()}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="px-4 py-3">Actions</div>,
    cell: ({ row }) => {
      return <DebtMenuActions debt={row.original} />
    },
  },
]

export function DebtTable({ debts }: { debts: DebtItem[] }) {
  const table = useDataTable({ data: debts ?? [], columns })

  return (
    <>
      <DataTable table={table} columnLength={columns.length} noHover />
    </>
  )
}
