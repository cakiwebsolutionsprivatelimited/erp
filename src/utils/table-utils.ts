import { Row } from "@tanstack/react-table"

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

/**
 * Formats a date string
 */
export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

/**
 * Placeholder for exporting table data to CSV
 */
export const exportToCSV = <TData>(data: TData[], filename: string) => {
  console.log(`Exporting ${data.length} rows to ${filename}.csv...`)
  // Implementation for CSV export would go here
  // Usually involves converting JSON to CSV string and triggering a download
}

/**
 * Helper to get selected row data
 */
export const getSelectedRowsData = <TData>(rows: Row<TData>[]) => {
  return rows.map((row) => row.original)
}
