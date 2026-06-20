import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ExpenseStatus, InvoiceStatus, PaymentStatus } from '@/tenant/finance/types';
import { cn } from '@/utils';

type FinanceStatus = InvoiceStatus | PaymentStatus | ExpenseStatus | 'Clear' | 'Outstanding';

interface FinanceStatusBadgeProps {
  status: FinanceStatus;
}

const statusStyles: Record<FinanceStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700',
  Sent: 'bg-blue-50 text-blue-700',
  'Partially Paid': 'bg-amber-50 text-amber-700',
  Paid: 'bg-emerald-50 text-emerald-700',
  Overdue: 'bg-red-50 text-red-700',
  Cancelled: 'bg-slate-200 text-slate-600',
  Received: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-red-50 text-red-700',
  Rejected: 'bg-red-50 text-red-700',
  Clear: 'bg-emerald-50 text-emerald-700',
  Outstanding: 'bg-amber-50 text-amber-700',
};

export const FinanceStatusBadge: React.FC<FinanceStatusBadgeProps> = ({ status }) => (
  <Badge className={cn('border-transparent hover:bg-inherit', statusStyles[status])}>{status}</Badge>
);
