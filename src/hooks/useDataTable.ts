import { useState, useCallback } from "react"
import {
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"

interface UseDataTableProps {
  initialPageSize?: number
}

export function useDataTable({ initialPageSize = 10 }: UseDataTableProps = {}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  const onPaginationChange = useCallback(
    (updaterOrValue: PaginationState | ((prev: PaginationState) => PaginationState)) => {
      setPagination((prev) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue
        return next
      })
    },
    []
  )

  const onSortingChange = useCallback(
    (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
      setSorting((prev) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue
        return next
      })
    },
    []
  )

  const onColumnFiltersChange = useCallback(
    (updaterOrValue: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => {
      setColumnFilters((prev) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue
        return next
      })
      // Reset to first page when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    },
    []
  )

  return {
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange,
    onColumnFiltersChange,
    onPaginationChange,
  }
}
