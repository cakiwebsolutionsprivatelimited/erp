import React, { useMemo, useState } from 'react';
import { Check, PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { LeaveForm } from '@/tenant/hr/HrForms';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';

const LeavePage: React.FC = () => {
  const hr = useHrData();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const filtered = useMemo(() => hr.leaveRequests.filter((leave) => `${leave.employeeName} ${leave.leaveType} ${leave.reason}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All' || leave.status === status)), [hr.leaveRequests, query, status]);
  return <div><PageHeader title="Leave" description="Apply, review, approve, reject, and track employee leave requests." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Apply leave</Button>} /><div className="mb-4 flex flex-col gap-3 sm:flex-row"><div className="w-full max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search employees, types, or reasons" /></div><select className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{['Pending', 'Approved', 'Rejected', 'Cancelled'].map((item) => <option key={item}>{item}</option>)}</select></div><DataTable headers={['Employee', 'Leave type', 'From date', 'To date', 'Days', 'Reason', 'Applied', 'Status', 'Actions']}>{filtered.map((leave) => <tr key={leave.id}><td className="px-4 py-3 font-medium text-slate-950">{leave.employeeName}</td><td className="px-4 py-3 text-slate-600">{leave.leaveType}</td><td className="px-4 py-3 text-slate-600">{leave.fromDate}</td><td className="px-4 py-3 text-slate-600">{leave.toDate}</td><td className="px-4 py-3 text-slate-600">{leave.days}</td><td className="max-w-64 px-4 py-3 text-slate-600">{leave.reason}</td><td className="px-4 py-3 text-slate-600">{leave.appliedDate}</td><td className="px-4 py-3"><HrStatusBadge status={leave.status} /></td><td className="px-4 py-3">{leave.status === 'Pending' && <div className="flex gap-1"><Button size="icon" variant="outline" title="Approve leave" onClick={() => hr.updateLeaveStatus(leave.id, 'Approved')}><Check className="h-4 w-4 text-emerald-600" /></Button><Button size="icon" variant="outline" title="Reject leave" onClick={() => hr.updateLeaveStatus(leave.id, 'Rejected')}><X className="h-4 w-4 text-red-600" /></Button></div>}</td></tr>)}</DataTable><Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Apply leave</DialogTitle><DialogDescription>Submit an employee leave request for review.</DialogDescription></DialogHeader><LeaveForm employees={hr.employees} onSubmit={(draft) => { hr.applyLeave(draft); setFormOpen(false); }} /></DialogContent></Dialog></div>;
};
export default LeavePage;
