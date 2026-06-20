import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { AttendanceStatus, EmployeeStatus, LeaveStatus, PayrollStatus } from '@/tenant/hr/types';

type HrStatus = AttendanceStatus | EmployeeStatus | LeaveStatus | PayrollStatus | 'Verified' | 'Expired' | 'Pending' | 'Approved' | 'Recovered';

const tones: Record<string, string> = {
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Present: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Verified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Recovered: 'border-slate-200 bg-slate-100 text-slate-700',
  Probation: 'border-blue-200 bg-blue-50 text-blue-700',
  Processed: 'border-blue-200 bg-blue-50 text-blue-700',
  Late: 'border-amber-200 bg-amber-50 text-amber-700',
  'Half Day': 'border-amber-200 bg-amber-50 text-amber-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  'Notice Period': 'border-orange-200 bg-orange-50 text-orange-700',
  Leave: 'border-violet-200 bg-violet-50 text-violet-700',
  Holiday: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  Absent: 'border-red-200 bg-red-50 text-red-700',
  Rejected: 'border-red-200 bg-red-50 text-red-700',
  Expired: 'border-red-200 bg-red-50 text-red-700',
  Inactive: 'border-slate-200 bg-slate-100 text-slate-600',
  Cancelled: 'border-slate-200 bg-slate-100 text-slate-600',
};

export const HrStatusBadge: React.FC<{ status: HrStatus }> = ({ status }) => <Badge className={`border text-[11px] hover:bg-inherit ${tones[status] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>{status}</Badge>;
