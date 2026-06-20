import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { PaymentStatus, ProjectStatus, ServicePriority, TaskStatus, TicketStatus, VisitStatus } from '@/tenant/services/types';

type Status = ProjectStatus | TaskStatus | TicketStatus | VisitStatus | PaymentStatus | ServicePriority | 'Open' | 'Cancelled';

const tones: Record<string, string> = {
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Closed: 'border-slate-200 bg-slate-100 text-slate-700',
  Paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'At Risk': 'border-red-200 bg-red-50 text-red-700',
  Urgent: 'border-red-200 bg-red-50 text-red-700',
  Blocked: 'border-red-200 bg-red-50 text-red-700',
  Cancelled: 'border-slate-200 bg-slate-100 text-slate-600',
  High: 'border-orange-200 bg-orange-50 text-orange-700',
  'In Progress': 'border-blue-200 bg-blue-50 text-blue-700',
  Assigned: 'border-blue-200 bg-blue-50 text-blue-700',
  'On the Way': 'border-cyan-200 bg-cyan-50 text-cyan-700',
  Review: 'border-violet-200 bg-violet-50 text-violet-700',
  Scheduled: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  'Waiting Customer': 'border-amber-200 bg-amber-50 text-amber-700',
  'On Hold': 'border-amber-200 bg-amber-50 text-amber-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  'Partially Paid': 'border-amber-200 bg-amber-50 text-amber-700',
};

export const ServiceStatusBadge: React.FC<{ status: Status }> = ({ status }) => (
  <Badge className={`border text-[11px] hover:bg-inherit ${tones[status] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>
    {status}
  </Badge>
);
