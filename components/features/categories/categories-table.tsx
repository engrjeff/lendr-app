"use client"

import { Suspense } from "react"
import { Category } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { STATUS_OPTIONS } from "@/lib/options"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DropdownFilterLinks } from "@/components/ui/data-table/dropdown-filter-links"
import { FilterResetLink } from "@/components/ui/data-table/filter-reset-link"
import { SortLink } from "@/components/ui/data-table/sort-link"
import { useDataTable } from "@/components/ui/data-table/useDataTable"
import { SearchField } from "@/components/shared/search-field"

import { CategoryRowActions } from "./category-row-actions"

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => <span>#</span>,
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortLink sortValue="name" title="Name" />
    },
    cell: ({ row }) => (
      <div className="text-nowrap">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortLink sortValue="status" title="Status" />
    },
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "ACTIVE" ? "default" : "destructive"}
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <CategoryRowActions category={row.original} />
    },
  },
]

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const table = useDataTable({ data: categories ?? [], columns })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-2">
        <Suspense>
          <SearchField placeholder="Search categories" />
          <DropdownFilterLinks
            paramKey="status"
            title="Status"
            options={STATUS_OPTIONS}
          />
          <FilterResetLink />
        </Suspense>
      </div>
      <DataTable table={table} columnLength={columns.length} />
    </div>
  )
}
