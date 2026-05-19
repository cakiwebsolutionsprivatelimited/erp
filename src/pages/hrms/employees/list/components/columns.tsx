import type { ColumnDef } from '@tanstack/react-table';
import type { Employee } from '../types/employee.types';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowUpDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const getColumns = (
  onView: (employee: Employee) => void,
  onEdit: (employee: Employee) => void,
  onDelete: (id: string) => void
): ColumnDef<Employee>[] => [
  // 1. Checkbox Column
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="cursor-pointer translate-y-[2px] h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="cursor-pointer translate-y-[2px] h-4 w-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  
  // 2. Photo / Avatar Column
  {
    id: 'photo',
    header: 'Photo',
    cell: ({ row }) => {
      const emp = row.original;
      const initials = emp.firstName[0] + (emp.lastName ? emp.lastName[0] : '');
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden border bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          {emp.photoUrl ? (
            <img src={emp.photoUrl} alt={emp.fullName} className="w-full h-full object-cover" />
          ) : (
            <span>{initials.toUpperCase()}</span>
          )}
        </div>
      );
    }
  },

  // 3. Employee ID
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-8 hover:bg-muted font-bold text-xs p-0 gap-1"
      >
        ID
        <ArrowUpDown className="h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono font-bold text-foreground text-xs">{row.getValue('id')}</span>
  },

  // 4. Full Name
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button 
        variant="ghost" 
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-8 hover:bg-muted font-bold text-xs p-0 gap-1"
      >
        Name
        <ArrowUpDown className="h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-bold text-foreground text-xs whitespace-nowrap">{row.getValue('fullName')}</span>
  },

  // 5. Department
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => <span className="font-semibold text-muted-foreground text-xs">{row.getValue('department')}</span>
  },

  // 6. Designation
  {
    accessorKey: 'designation',
    header: 'Designation',
    cell: ({ row }) => <span className="font-semibold text-primary text-xs whitespace-nowrap">{row.getValue('designation')}</span>
  },

  // 7. Email
  {
    accessorKey: 'email',
    header: 'Email Address',
    cell: ({ row }) => <span className="font-semibold text-muted-foreground text-xs truncate max-w-[150px] block">{row.getValue('email')}</span>
  },

  // 8. Mobile
  {
    accessorKey: 'mobile',
    header: 'Mobile',
    cell: ({ row }) => <span className="font-semibold text-muted-foreground text-xs whitespace-nowrap">{row.getValue('mobile')}</span>
  },

  // 9. Joining Date
  {
    accessorKey: 'joiningDate',
    header: 'Joining Date',
    cell: ({ row }) => <span className="font-semibold text-muted-foreground text-xs whitespace-nowrap">{row.getValue('joiningDate')}</span>
  },

  // 10. Employment Type
  {
    accessorKey: 'employmentType',
    header: 'Type',
    cell: ({ row }) => <span className="font-semibold text-muted-foreground text-xs whitespace-nowrap">{row.getValue('employmentType')}</span>
  },

  // 11. Shift Timing
  {
    accessorKey: 'shiftTiming',
    header: 'Shift',
    cell: ({ row }) => <span className="font-semibold text-muted-foreground text-xs whitespace-nowrap">{row.getValue('shiftTiming')}</span>
  },

  // 12. Reporting Manager
  {
    accessorKey: 'reportingManager',
    header: 'Manager',
    cell: ({ row }) => <span className="font-semibold text-muted-foreground text-xs whitespace-nowrap">{row.getValue('reportingManager')}</span>
  },

  // 13. Work Location
  {
    accessorKey: 'workLocation',
    header: 'Location',
    cell: ({ row }) => <span className="font-semibold text-muted-foreground text-xs whitespace-nowrap">{row.getValue('workLocation')}</span>
  },

  // 14. Status Badge
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <EmployeeStatusBadge status={row.getValue('status')} />
  },

  // 15. Profile Completeness Progress
  {
    accessorKey: 'profileCompleteness',
    header: 'Completeness',
    cell: ({ row }) => {
      const value = row.getValue('profileCompleteness') as number;
      let colorClass = 'bg-primary';
      if (value < 60) colorClass = 'bg-rose-500';
      else if (value < 85) colorClass = 'bg-amber-500';
      else colorClass = 'bg-emerald-500';

      return (
        <div className="w-[100px] flex items-center gap-2">
          <Progress value={value} className="h-1.5 flex-1" indicatorClassName={colorClass} />
          <span className="text-[10px] font-bold text-foreground shrink-0">{value}%</span>
        </div>
      );
    }
  },

  // 16. Actions Column
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const emp = row.original;
      return (
        <div className="flex items-center gap-1.5 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(emp)}
            className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-2.5"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(emp)}
            className="h-8 text-xs font-bold text-primary hover:bg-primary/5 hover:text-primary rounded-lg px-2.5"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={emp.status === 'Terminated'}
            onClick={() => onDelete(emp.id)}
            className="h-8 text-xs font-bold text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg px-2.5"
          >
            Archive
          </Button>
        </div>
      );
    }
  }
];
