import React, { useMemo, useState } from 'react';
import { AlertTriangle, Check, Clock3, FilePenLine, PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { AttendanceForm } from '@/tenant/hr/HrForms';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { HR_DEMO_TODAY, HR_TEAM } from '@/tenant/hr/hrDemoService';
import type { AttendanceCorrectionDraft, AttendanceEntry } from '@/tenant/hr/types';

const monthDays = Array.from({ length: 18 }, (_, index) => index + 1);
const selectClass = 'flex h-10 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

const AttendancePage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<AttendanceEntry | null>(null);
  const visibleEmployeeIds = access.scopedEmployeeIds;
  const visibleEmployees = useMemo(() => hr.employees.filter((employee) => visibleEmployeeIds.has(employee.id)), [hr.employees, visibleEmployeeIds]);
  const todayEntries = useMemo(() => hr.attendance.filter((entry) => visibleEmployeeIds.has(entry.employeeId) && entry.date === HR_DEMO_TODAY && entry.employeeName.toLowerCase().includes(query.toLowerCase())), [hr.attendance, query, visibleEmployeeIds]);
  const visibleExceptions = hr.attendanceExceptions.filter((item) => visibleEmployeeIds.has(item.employeeId));
  const visibleCorrections = hr.attendanceCorrections.filter((item) => visibleEmployeeIds.has(item.employeeId));
  const openExceptions = visibleExceptions.filter((item) => item.status === 'Open');
  const pendingCorrections = visibleCorrections.filter((item) => item.status === 'Pending');
  const todayLate = todayEntries.filter((entry) => entry.status === 'Late').length;
  const overtimeExceptions = hr.attendanceExceptions.filter((item) => item.type === 'Overtime').length;

  return (
    <div>
      <PageHeader title="Attendance" description="Daily attendance, exception filters, manual corrections, shift-aware monthly matrix, and audit trail." action={access.canEditAttendance ? <Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Mark attendance</Button> : undefined} />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open exceptions" value={String(openExceptions.length)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Pending corrections" value={String(pendingCorrections.length)} icon={<FilePenLine className="h-4 w-4" />} />
        <StatCard label="Late today" value={String(todayLate)} icon={<Clock3 className="h-4 w-4" />} />
        <StatCard label="Overtime flags" value={String(overtimeExceptions)} />
      </section>
      <Tabs defaultValue="exceptions">
        <TabsList className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="daily">Daily Board</TabsTrigger>
          <TabsTrigger value="corrections">Corrections</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Matrix</TabsTrigger>
          <TabsTrigger value="employee">Employee Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="exceptions" className="mt-4">
          <DataTable headers={['Employee', 'Date', 'Exception', 'Shift', 'Details', 'Status']}>
            {visibleExceptions.map((item) => <tr key={item.id}><td className="px-4 py-3 font-medium text-slate-950">{item.employeeName}</td><td className="px-4 py-3 text-slate-600">{item.date}</td><td className="px-4 py-3 text-slate-600">{item.type}</td><td className="px-4 py-3 text-slate-600">{item.shiftGroupName}</td><td className="px-4 py-3 text-slate-600">{item.detail}</td><td className="px-4 py-3"><HrStatusBadge status={item.status} /></td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="daily" className="mt-4">
          <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search employees" /></div>
          <DataTable headers={['Employee', 'Shift', 'Date', 'Check-in', 'Check-out', 'Status', 'Hours', 'Location', 'Action']}>
            {todayEntries.map((entry) => {
              const employee = hr.employees.find((item) => item.id === entry.employeeId);
              return <tr key={entry.id}><td className="px-4 py-3 font-medium text-slate-950">{entry.employeeName}</td><td className="px-4 py-3 text-slate-600">{employee?.shiftGroupName || 'Unassigned'}</td><td className="px-4 py-3 text-slate-600">{entry.date}</td><td className="px-4 py-3 text-slate-600">{entry.checkIn || '-'}</td><td className="px-4 py-3 text-slate-600">{entry.checkOut || '-'}</td><td className="px-4 py-3"><HrStatusBadge status={entry.status} /></td><td className="px-4 py-3 text-slate-600">{entry.workHours || 0} hrs</td><td className="px-4 py-3 text-slate-600">{entry.location || 'Not recorded'}</td><td className="px-4 py-3">{access.canEditAttendance ? <Button size="sm" variant="outline" onClick={() => setCorrectionTarget(entry)}><FilePenLine className="h-4 w-4" />Correct</Button> : <span className="text-xs text-slate-500">View only</span>}</td></tr>;
            })}
          </DataTable>
        </TabsContent>
        <TabsContent value="corrections" className="mt-4">
          <DataTable headers={['Employee', 'Date', 'Old punch', 'New punch', 'Reason', 'Approver', 'Status', 'Actions']}>
            {visibleCorrections.map((item) => <tr key={item.id}><td className="px-4 py-3 font-medium text-slate-950">{item.employeeName}</td><td className="px-4 py-3 text-slate-600">{item.date}</td><td className="px-4 py-3 text-slate-600">{item.oldCheckIn || '-'} - {item.oldCheckOut || '-'}</td><td className="px-4 py-3 text-slate-600">{item.newCheckIn} - {item.newCheckOut}</td><td className="max-w-80 px-4 py-3 text-slate-600">{item.reason}</td><td className="px-4 py-3 text-slate-600">{item.approver}</td><td className="px-4 py-3"><HrStatusBadge status={item.status} /></td><td className="px-4 py-3">{access.canEditAttendance && item.status === 'Pending' ? <div className="flex gap-1"><Button size="icon" variant="outline" title="Approve correction" onClick={() => hr.updateAttendanceCorrectionStatus(item.id, 'Approved')}><Check className="h-4 w-4 text-emerald-600" /></Button><Button size="icon" variant="outline" title="Reject correction" onClick={() => hr.updateAttendanceCorrectionStatus(item.id, 'Rejected')}><X className="h-4 w-4 text-red-600" /></Button></div> : <span className="text-xs text-slate-500">{item.status === 'Pending' ? 'Awaiting HR review' : 'Reviewed'}</span>}</td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <DataTable headers={['Employee', 'Shift', ...monthDays.map(String)]}>
            {visibleEmployees.map((employee) => <tr key={employee.id}><td className="sticky left-0 bg-white px-4 py-3 font-medium text-slate-950">{employee.name}</td><td className="px-4 py-3 text-slate-600">{employee.shiftGroupName || 'Unassigned'}</td>{monthDays.map((day) => { const date = `2026-06-${String(day).padStart(2, '0')}`; const entry = hr.attendance.find((item) => item.employeeId === employee.id && item.date === date); const code = entry?.status === 'Present' ? 'P' : entry?.status === 'Absent' ? 'A' : entry?.status === 'Late' ? 'L' : entry?.status === 'Half Day' ? 'H' : entry?.status === 'Leave' ? 'LV' : entry?.status === 'Holiday' ? 'HD' : '-'; return <td key={day} className={`px-2 py-3 text-center text-xs font-semibold ${code === 'A' ? 'text-red-600' : code === 'P' ? 'text-emerald-700' : code === 'HD' ? 'text-cyan-700' : 'text-amber-700'}`}>{code}</td>; })}</tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="employee" className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleEmployees.map((employee) => {
            const entries = hr.attendance.filter((entry) => entry.employeeId === employee.id && entry.date.startsWith('2026-06'));
            const present = entries.filter((entry) => ['Present', 'Late', 'Half Day'].includes(entry.status)).length;
            const exceptions = hr.attendanceExceptions.filter((item) => item.employeeId === employee.id).length;
            const hours = entries.reduce((sum, entry) => sum + entry.workHours, 0);
            return <article key={employee.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-slate-950">{employee.name}</h2><p className="mt-1 text-xs text-slate-500">{employee.department} | {employee.shiftGroupName || 'Unassigned'}</p></div><Clock3 className="h-4 w-4 text-indigo-600" /></div><div className="mt-4 grid grid-cols-3 gap-3"><Metric label="Present" value={String(present)} /><Metric label="Hours" value={hours.toFixed(1)} /><Metric label="Flags" value={String(exceptions)} /></div></article>;
          })}
        </TabsContent>
      </Tabs>
      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Mark attendance</DialogTitle><DialogDescription>Create or update an employee attendance entry.</DialogDescription></DialogHeader><AttendanceForm employees={visibleEmployees} onSubmit={(draft) => { hr.markAttendance(draft); setFormOpen(false); }} /></DialogContent></Dialog>
      <Dialog open={Boolean(correctionTarget)} onOpenChange={(open) => !open && setCorrectionTarget(null)}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Request correction</DialogTitle><DialogDescription>Submit old/new punch values with reason and approver.</DialogDescription></DialogHeader>{correctionTarget && <CorrectionForm entry={correctionTarget} onSubmit={(draft) => { hr.createAttendanceCorrection(draft); setCorrectionTarget(null); }} />}</DialogContent></Dialog>
    </div>
  );
};

const CorrectionForm: React.FC<{ entry: AttendanceEntry; onSubmit: (draft: AttendanceCorrectionDraft) => void }> = ({ entry, onSubmit }) => {
  const [draft, setDraft] = useState<AttendanceCorrectionDraft>({ employeeId: entry.employeeId, date: entry.date, newCheckIn: entry.checkIn || '09:30', newCheckOut: entry.checkOut || '18:00', reason: '', approver: 'Priya Mishra' });
  return <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}><div className="rounded-sm border border-slate-200 bg-slate-50 p-3 text-sm sm:col-span-2"><span className="font-medium text-slate-950">{entry.employeeName}</span><span className="text-slate-500"> | current punch {entry.checkIn || '-'} - {entry.checkOut || '-'}</span></div><Field label="Date"><Input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></Field><Field label="Approver"><select className={selectClass} value={draft.approver} onChange={(event) => setDraft({ ...draft, approver: event.target.value })}>{HR_TEAM.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="New check-in"><Input type="time" value={draft.newCheckIn} onChange={(event) => setDraft({ ...draft, newCheckIn: event.target.value })} /></Field><Field label="New check-out"><Input type="time" value={draft.newCheckOut} onChange={(event) => setDraft({ ...draft, newCheckOut: event.target.value })} /></Field><Field label="Reason" className="sm:col-span-2"><Textarea required value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} /></Field><div className="flex justify-end sm:col-span-2"><Button type="submit">Submit correction</Button></div></form>;
};

const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>;
const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="rounded-sm bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-slate-950">{value}</p></div>;

export default AttendancePage;
