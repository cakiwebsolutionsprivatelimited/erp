import { Table } from "@tanstack/react-table"
import { Search, X, Download, Trash2, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./DataTableFacetedFilter"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey: string
  bulkActions?: boolean
  facetedFilters?: {
    columnKey: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  bulkActions = true,
  facetedFilters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <div className="flex items-center justify-between p-4 gap-4 flex-wrap">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Filter by ${searchKey}...`}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-10 pl-9 w-full lg:w-[300px]"
          />
        </div>
        {facetedFilters.map((filter) => (
          table.getColumn(filter.columnKey) && (
            <DataTableFacetedFilter
              key={filter.columnKey}
              column={table.getColumn(filter.columnKey)}
              title={filter.title}
              options={filter.options}
            />
          )
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {bulkActions && selectedRows.length > 0 && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
            <span className="text-sm font-medium mr-2">{selectedRows.length} selected</span>
            <Button variant="destructive" size="sm" className="h-9">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                <DropdownMenuItem>Change Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-[1px] h-6 bg-border mx-2" />
          </div>
        )}

        <Button variant="outline" size="sm" className="h-9 ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
