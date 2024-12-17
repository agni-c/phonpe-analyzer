"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { categorizeTransaction, getCategoryColor, type Category } from "@/utils/categorization"

interface Transaction {
  Date: string
  Amount: string
  Description: string
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "Date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "Description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "category",
    accessorFn: (row) => categorizeTransaction(row.Description),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ getValue }) => {
      const category = getValue() as Category
      return (
        <div className="flex items-center">
          <div
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: getCategoryColor(category) }}
          />
          {category}
        </div>
      )
    },
  },
  {
    accessorKey: "Amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Amount"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]

interface TransactionDataTableProps {
  transactions: Transaction[];
}

export default function TransactionDataTable({ transactions }: TransactionDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // Calculate summary statistics for filtered data
  const filteredRows = table.getFilteredRowModel().rows
  const totalAmount = filteredRows.reduce(
    (sum, row) => sum + parseFloat(row.getValue("Amount")),
    0
  )
  const averageAmount = totalAmount / filteredRows.length
  const maxAmount = Math.max(
    ...filteredRows.map((row) => parseFloat(row.getValue("Amount")))
  )
  const minAmount = Math.min(
    ...filteredRows.map((row) => parseFloat(row.getValue("Amount")))
  )

  // Add category-wise summary in the grid
  const categoryTotals = filteredRows.reduce((acc: Record<string, number>, row) => {
    const category = categorizeTransaction(row.getValue("Description"))
    acc[category] = (acc[category] || 0) + parseFloat(row.getValue("Amount"))
    return acc
  }, {})

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter descriptions..."
          value={(table.getColumn("Description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div>
            Showing {filteredRows.length} of {transactions.length} transactions
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Total Amount</div>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalAmount)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Average Amount</div>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(averageAmount)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Highest Transaction</div>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(maxAmount)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Lowest Transaction</div>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(minAmount)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {Object.entries(categoryTotals).map(([category, amount]) => (
          <div key={category} className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getCategoryColor(category as Category) }}
              />
              <div className="text-sm font-medium">{category}</div>
            </div>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(amount)}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Page Summary</TableCell>
              <TableCell>
                {table.getRowModel().rows.length} transaction(s)
              </TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(
                  table
                    .getRowModel()
                    .rows.reduce(
                      (sum, row) => sum + parseFloat(row.getValue("Amount")),
                      0
                    )
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
} 