import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { EmployeeStatus } from '../types/employee.types';

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status }) => {
  const styles: Record<EmployeeStatus, { bg: string; text: string; label: string }> = {
    Active: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400 font-extrabold',
      label: 'Active'
    },
    Inactive: {
      bg: 'bg-muted text-muted-foreground border-muted-foreground/10',
      text: 'text-muted-foreground font-bold',
      label: 'Inactive'
    },
    'On Leave': {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400 font-extrabold',
      label: 'On Leave'
    },
    Probation: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/20',
      text: 'text-indigo-600 dark:text-indigo-400 font-extrabold',
      label: 'Probation'
    },
    Terminated: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400 font-extrabold',
      label: 'Terminated'
    },
    Resigned: {
      bg: 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-500/20',
      text: 'text-orange-600 dark:text-orange-400 font-extrabold',
      label: 'Resigned'
    }
  };

  const config = styles[status] || styles.Inactive;

  return (
    <Badge 
      variant="outline" 
      className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-wide uppercase transition-colors shrink-0 ${config.bg} ${config.text}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 inline-block animate-pulse" />
      {config.label}
    </Badge>
  );
};

export default EmployeeStatusBadge;
