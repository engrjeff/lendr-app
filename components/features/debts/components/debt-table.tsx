"use client"

import Link from "next/link"
import { DebtItem } from "@/queries/debt"
import { InstallmentPlanItemStatus } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table/data-table"
import { SortLink } from "@/components/ui/data-table/sort-link"
import { useDataTable } from "@/components/ui/data-table/useDataTable"
import { Progress } from "@/components/ui/progress"

import { DebtCategoryIcon } from "./debt-category-icon"
import { DebtMenuActions } from "./debt-menu-actions"

const columns: ColumnDef<DebtItem>[] = [
  {
    accessorKey: "category",
    header: () => <SortLink title="Category" sortValue="category" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-nowrap text-left">
        <DebtCategoryIcon noBg debtCategory={row.original.category} />{" "}
        {row.original.category}
      </div>
    ),
  },
  {
    accessorKey: "nickname",
    header: () => (
      <SortLink title="Name" sortValue="nickname" className="px-0" />
    ),
    cell: ({ row }) => (
      <div className="text-nowrap">
        <Link
          href={`/debts/${row.original.id}`}
          className="font-medium text-blue-500 underline underline-offset-4 hover:no-underline"
        >
          {row.getValue("nickname")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <SortLink title="Status" sortValue="status" className="px-0" />
    ),
    cell: ({ row }) => {
      if (row.original.status === "PAID") {
        return <Badge variant="PAID">PAID</Badge>
      }

      const paidPlans = row.original.installment_plans.filter(
        (d) => d.status === InstallmentPlanItemStatus.PAID
      ).length

      const progress = (paidPlans / row.original.duration) * 100

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
    header: () => (
      <SortLink
        title="Balance"
        sortValue="balance"
        className="justify-end px-0"
      />
    ),
    cell: ({ row }) => (
      <div className="text-nowrap text-right font-mono">
        Php {row.original.balance.toLocaleString()}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="px-4 py-3 text-center">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <DebtMenuActions debt={row.original} />
        </div>
      )
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
