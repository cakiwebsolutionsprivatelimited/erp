import React from "react"
import { DataTable } from "../DataTable"
import { columns, type UserRow } from "./columns"

const data: UserRow[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastLogin: "2024-03-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Manager", status: "Active", lastLogin: "2024-03-14" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive", lastLogin: "2024-03-10" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "User", status: "Pending", lastLogin: "2024-03-12" },
  { id: "5", name: "Charlie Wilson", email: "charlie@example.com", role: "Manager", status: "Active", lastLogin: "2024-03-15" },
]

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "User", value: "User" },
]

export function UsersTable() {
  return (
    <div className="w-full">
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="name" 
        facetedFilters={[
          {
            columnKey: "role",
            title: "Role",
            options: roleOptions,
          },
        ]}
      />
    </div>
  )
}
