import React from "react"
import { DataTable } from "../DataTable"
import { columns, type LeadRow } from "./columns"

const data: LeadRow[] = [
  { id: "L1", company: "Tech Corp", contact: "Mark Ruffalo", value: 12000, status: "Won", phone: "+1 234 567 890" },
  { id: "L2", company: "Globex Inc", contact: "Hank Hill", value: 5000, status: "Qualified", phone: "+1 987 654 321" },
  { id: "L3", company: "Soylent Corp", contact: "Leela Turanga", value: 25000, status: "New", phone: "+1 555 0199" },
  { id: "L4", company: "Initech", contact: "Peter Gibbons", value: 1500, status: "Lost", phone: "+1 555 0123" },
  { id: "L5", company: "Umbrella Co", contact: "Albert Wesker", value: 100000, status: "Contacted", phone: "+1 555 6666" },
]

const statusOptions = [
  { label: "New", value: "New" },
  { label: "Contacted", value: "Contacted" },
  { label: "Qualified", value: "Qualified" },
  { label: "Lost", value: "Lost" },
  { label: "Won", value: "Won" },
]

interface LeadsTableProps {
  onRowClick?: (row: LeadRow) => void
  data?: LeadRow[]
}

export function LeadsTable({ onRowClick, data: customData }: LeadsTableProps) {
  return (
    <div className="w-full">
      <DataTable 
        columns={columns} 
        data={customData || data} 
        searchKey="company" 
        onRowClick={onRowClick}
        facetedFilters={[
          {
            columnKey: "status",
            title: "Status",
            options: statusOptions,
          },
        ]}
      />
    </div>
  )
}
