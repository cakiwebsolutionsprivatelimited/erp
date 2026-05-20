import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Building2, User, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "../DataTableColumnHeader"

export type LeadRow = {
  id: string
  company: string
  contact: string
  value: number
  status: "New" | "Contacted" | "Qualified" | "Lost" | "Won"
  phone: string
}

export const columns: ColumnDef<LeadRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building2 size={16} className="text-muted-foreground" />
        <span className="font-medium">{row.getValue("company")}</span>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User size={16} className="text-muted-foreground" />
        <span>{row.getValue("contact")}</span>
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("value"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="font-bold text-emerald-600 dark:text-emerald-400">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "Won"
              ? "success"
              : status === "Lost"
              ? "destructive"
              : status === "Qualified"
              ? "default"
              : "warning"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone size={14} />
        <span>{row.getValue("phone")}</span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Lead Actions</DropdownMenuLabel>
            <DropdownMenuItem>Convert to Client</DropdownMenuItem>
            <DropdownMenuItem>Log Activity</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit lead</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Archive lead</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
