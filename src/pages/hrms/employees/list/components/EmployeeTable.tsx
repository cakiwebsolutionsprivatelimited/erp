import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import type { Employee } from '../types/employee.types';
import { getColumns } from './columns';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Settings2, Eye, Edit3, Archive, Layers, Smartphone, Mail, Briefcase 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import { Progress } from '@/components/ui/progress';

interface EmployeeTableProps {
  data: Employee[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  data,
  selectedIds,
  setSelectedIds,
  onView,
  onEdit,
  onDelete,
  isLoading
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Establish selection state mapping to TanStack format
  const rowSelection = useMemo(() => {
    const selection: Record<string, boolean> = {};
    selectedIds.forEach(id => {
      const idx = data.findIndex(e => e.id === id);
      if (idx !== -1) selection[idx] = true;
    });
    return selection;
  }, [selectedIds, data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRowSelectionChange = (updaterOrValue: any) => {
    const newSelection = typeof updaterOrValue === 'function' 
      ? updaterOrValue(rowSelection) 
      : updaterOrValue;
    
    const nextIds: string[] = [];
    Object.keys(newSelection).forEach(key => {
      if (newSelection[key]) {
        const emp = data[parseInt(key)];
        if (emp) nextIds.push(emp.id);
      }
    });
    setSelectedIds(nextIds);
  };

  const columns = useMemo(() => getColumns(onView, onEdit, onDelete), [onView, onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility
    },
    onSortingChange: setSorting,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl bg-muted/5 gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs font-bold text-muted-foreground">Indexing corporate personnel directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Visibility Toggles / Options Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Displaying {table.getFilteredRowModel().rows.length} folders
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-xl text-xs font-bold border-muted gap-1.5 ml-auto cursor-pointer"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Column View Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-[180px]">
            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const headerText = typeof column.columnDef.header === 'string' 
                  ? column.columnDef.header 
                  : column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-xs cursor-pointer font-semibold"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {headerText}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Responsive Layout */}
      {/* A. Desktop Wide Table */}
      <div className="hidden md:block border rounded-3xl overflow-hidden bg-card shadow-2xs">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-muted/20 font-bold uppercase tracking-wider text-muted-foreground">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-4 align-middle whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16 text-muted-foreground">
                    <span className="text-xs font-semibold">No candidates match active filter parameters.</span>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr 
                    key={row.id} 
                    className="border-b hover:bg-muted/10 transition-colors duration-200 even:bg-muted/5 font-semibold text-foreground"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* B. Mobile Cards Layout */}
      <div className="block md:hidden space-y-4">
        {table.getRowModel().rows.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-3xl bg-muted/10">
            <span className="text-xs text-muted-foreground">No candidate records found.</span>
          </div>
        ) : (
          table.getRowModel().rows.map((row) => {
            const emp = row.original;
            const initials = emp.firstName[0] + (emp.lastName ? emp.lastName[0] : '');

            return (
              <div 
                key={row.id}
                className="border p-5 rounded-3xl bg-card space-y-4 relative overflow-hidden shadow-2xs"
              >
                <div className="absolute top-4 right-4">
                  <EmployeeStatusBadge status={emp.status} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {emp.photoUrl ? (
                      <img src={emp.photoUrl} alt={emp.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{initials.toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{emp.fullName}</h4>
                    <p className="text-[10px] text-primary font-bold mt-0.5">{emp.designation} • {emp.department}</p>
                    <span className="text-[9px] font-mono text-muted-foreground mt-0.5 block">{emp.id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground border-t pt-3 font-semibold">
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3.5 w-3.5 text-primary shrink-0" />
                    {emp.mobile}
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    {emp.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
                    Joined: {emp.joiningDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                    Type: {emp.employmentType}
                  </div>
                </div>

                {/* Completeness Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Completeness</span>
                    <span>{emp.profileCompleteness}%</span>
                  </div>
                  <Progress value={emp.profileCompleteness} className="h-1" indicatorClassName={emp.profileCompleteness < 60 ? 'bg-rose-500' : 'bg-emerald-500'} />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(emp)}
                    className="h-8 text-[10px] font-bold hover:bg-muted text-muted-foreground rounded-lg px-3"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(emp)}
                    className="h-8 text-[10px] font-bold hover:bg-primary/5 text-primary rounded-lg px-3"
                  >
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={emp.status === 'Terminated'}
                    onClick={() => onDelete(emp.id)}
                    className="h-8 text-[10px] font-bold text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg px-3"
                  >
                    <Archive className="mr-1.5 h-3.5 w-3.5" />
                    Archive
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination control footer */}
      {table.getRowModel().rows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Show entries:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border rounded-xl px-2 py-1 bg-background font-bold text-foreground text-xs"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-2">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
