import React, { useMemo, useState } from 'react';
import { CalendarDays, Check, PlusCircle, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { LeaveForm } from '@/tenant/hr/HrForms';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import type { LeaveStatus } from '@/tenant/hr/types';

const statuses: Array<LeaveStatus | 'All'> = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

const LeavePage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<LeaveStatus | 'All'>('All');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const visibleEmployeeIds = access.scopedEmployeeIds;
  const visibleEmployees = useMemo(() => hr.employees.filter((employee) => visibleEmployeeIds.has(employee.id)), [hr.employees, visibleEmployeeIds]);
  const visibleRequests = hr.leaveRequests.filter((leave) => visibleEmployeeIds.has(leave.employeeId));
  const visibleBalances = hr.leaveBalances.filter((balance) => visibleEmployeeIds.has(balance.employeeId));
  const filtered = useMemo(() => visibleRequests.filter((leave) => `${leave.employeeName} ${leave.leaveType} ${leave.reason}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All' || leave.status === status)), [visibleRequests, query, status]);
  const pending = visibleRequests.filter((leave) => leave.status === 'Pending');
  const approvedDays = visibleRequests.filter((leave) => leave.status === 'Approved').reduce((sum, leave) => sum + leave.days, 0);
  const availableDays = visibleBalances.reduce((sum, balance) => sum + balance.available, 0);
  const selectedPendingIds = selectedIds.filter((id) => visibleRequests.find((leave) => leave.id === id)?.status === 'Pending');
  const toggleSelected = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const bulkUpdate = (nextStatus: LeaveStatus) => {
    hr.bulkUpdateLeaveStatus(selectedPendingIds, nextStatus);
    setSelectedIds([]);
  };

  return (
    <div>
      <PageHeader title="Leave" description="Leave requests, balance cards, approval history, holiday/weekend context, and bulk HR decisions." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Apply leave</Button>} />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending requests" value={String(pending.length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Approved days" value={String(approvedDays)} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Available balance" value={String(availableDays)} />
        <StatCard label="Policies active" value={String(hr.leavePolicies.filter((policy) => policy.status === 'Active').length)} />
      </section>
      <Tabs defaultValue="requests">
        <TabsList className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="history">Approval History</TabsTrigger>
          <TabsTrigger value="calendar">Holiday Context</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="mt-4">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row"><div className="w-full max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search employees, types, or reasons" /></div><select className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value as LeaveStatus | 'All')}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={!access.canApproveLeave || !selectedPendingIds.length} onClick={() => bulkUpdate('Approved')}><Check className="h-4 w-4" />Approve selected</Button><Button size="sm" variant="outline" disabled={!access.canApproveLeave || !selectedPendingIds.length} onClick={() => bulkUpdate('Rejected')}><X className="h-4 w-4" />Reject selected</Button></div>
          </div>
          <DataTable headers={['', 'Employee', 'Leave type', 'Dates', 'Days', 'Calendar impact', 'Reason', 'Status', 'Actions']}>
            {filtered.map((leave) => {
              const impact = getCalendarImpact(leave.fromDate, leave.toDate, hr.holidays.map((holiday) => holiday.date));
              return <tr key={leave.id}><td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${leave.employeeName}`} disabled={!access.canApproveLeave || leave.status !== 'Pending'} checked={selectedIds.includes(leave.id)} onChange={() => toggleSelected(leave.id)} /></td><td className="px-4 py-3 font-medium text-slate-950">{leave.employeeName}</td><td className="px-4 py-3 text-slate-600">{leave.leaveType}</td><td className="px-4 py-3 text-slate-600">{leave.fromDate} to {leave.toDate}</td><td className="px-4 py-3 text-slate-600">{leave.days}</td><td className="px-4 py-3 text-slate-600">{impact}</td><td className="max-w-64 px-4 py-3 text-slate-600">{leave.reason}</td><td className="px-4 py-3"><HrStatusBadge status={leave.status} /></td><td className="px-4 py-3">{access.canApproveLeave && leave.status === 'Pending' ? <div className="flex gap-1"><Button size="icon" variant="outline" title="Approve leave" onClick={() => hr.updateLeaveStatus(leave.id, 'Approved')}><Check className="h-4 w-4 text-emerald-600" /></Button><Button size="icon" variant="outline" title="Reject leave" onClick={() => hr.updateLeaveStatus(leave.id, 'Rejected')}><X className="h-4 w-4 text-red-600" /></Button></div> : <span className="text-xs text-slate-500">{leave.status === 'Pending' ? 'Awaiting approver' : 'Closed'}</span>}</td></tr>;
            })}
          </DataTable>
        </TabsContent>
        <TabsContent value="balances" className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleEmployees.map((employee) => {
            const balances = visibleBalances.filter((balance) => balance.employeeId === employee.id);
            return <article key={employee.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3"><h2 className="font-semibold text-slate-950">{employee.name}</h2><p className="mt-1 text-xs text-slate-500">{employee.department} | {employee.manager}</p></div><div className="space-y-2">{balances.map((balance) => <div key={balance.id} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2"><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-slate-800">{balance.leaveType}</span><span className="text-slate-600">{balance.available} available</span></div><div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-500"><span>Used {balance.used}</span><span>Pending {balance.pending}</span><span>Carry {balance.carryForward}</span></div></div>)}</div></article>;
          })}
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <DataTable headers={['Time', 'Leave ID', 'Actor', 'Action', 'Comment']}>
            {hr.leaveApprovalHistory.map((entry) => <tr key={entry.id}><td className="px-4 py-3 text-slate-600">{new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td><td className="px-4 py-3 font-medium text-indigo-700">{entry.leaveId}</td><td className="px-4 py-3 text-slate-600">{entry.actor}</td><td className="px-4 py-3"><HrStatusBadge status={entry.action === 'Applied' ? 'Pending' : entry.action === 'Delegated' ? 'In Progress' : entry.action} /></td><td className="px-4 py-3 text-slate-600">{entry.comment}</td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="calendar" className="mt-4 grid gap-4 xl:grid-cols-2">
          <Panel title="Holiday and weekend exclusions">{hr.holidays.map((holiday) => <div key={holiday.id} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><span className="font-medium text-slate-800">{holiday.name}</span><span className="text-slate-600">{holiday.date} | {holiday.branchName}</span></div>)}</Panel>
          <Panel title="Delegation reminders">{pending.map((leave) => <div key={leave.id} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><div className="font-medium text-slate-800">{leave.employeeName} | {leave.leaveType}</div><div className="mt-1 text-slate-600">Approver: {hr.employees.find((employee) => employee.id === leave.employeeId)?.manager || 'Manager'} | delegate to HR if approver is absent.</div></div>)}</Panel>
        </TabsContent>
      </Tabs>
      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Apply leave</DialogTitle><DialogDescription>Submit an employee leave request for review.</DialogDescription></DialogHeader><LeaveForm employees={visibleEmployees} onSubmit={(draft) => { hr.applyLeave(draft); setFormOpen(false); }} /></DialogContent></Dialog>
    </div>
  );
};

const getCalendarImpact = (fromDate: string, toDate: string, holidays: string[]) => {
  const from = new Date(`${fromDate}T00:00:00`);
  const to = new Date(`${toDate}T00:00:00`);
  let weekends = 0;
  let holidayCount = 0;
  for (let date = new Date(from); date <= to; date.setDate(date.getDate() + 1)) {
    const iso = date.toISOString().slice(0, 10);
    if ([0, 6].includes(date.getDay())) weekends += 1;
    if (holidays.includes(iso)) holidayCount += 1;
  }
  return `${weekends} weekend, ${holidayCount} holiday`;
};

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <section className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-3 font-semibold text-slate-950">{title}</h2><div className="space-y-2">{children}</div></section>;

export default LeavePage;
