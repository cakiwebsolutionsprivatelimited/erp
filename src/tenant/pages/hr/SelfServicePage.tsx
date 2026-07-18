import React, { useMemo, useState } from 'react';
import { CalendarCheck, CalendarDays, Check, Clock3, Download, FilePenLine, FileText, ShieldCheck, UserCheck, UserCircle, WalletCards, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, EmptyState, PageHeader, StatCard, formatINR } from '@/tenant/components/TenantUI';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { HR_DEMO_TODAY } from '@/tenant/hr/hrDemoService';
import type { AttendanceCorrectionDraft, AttendanceEntry, Employee, LeaveDraft, SalarySlip } from '@/tenant/hr/types';

const selectClass = 'flex h-10 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

const SelfServicePage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(hr.employees.find((employee) => employee.id === 'HE-4')?.id || hr.employees[0]?.id || '');
  const staffProfile = hr.employees.find((employee) => employee.id === 'HE-7') || hr.employees[0];
  const managerProfile = hr.employees.find((employee) => employee.id === 'HE-4') || hr.employees.find((employee) => hr.employees.some((report) => report.manager === employee.name)) || staffProfile;
  const profileOptions = access.activeRole === 'Staff' ? (staffProfile ? [staffProfile] : []) : access.activeRole === 'Manager' ? (managerProfile ? [managerProfile] : []) : hr.employees;
  const selectedEmployee = profileOptions.find((employee) => employee.id === selectedEmployeeId) || profileOptions[0] || hr.employees[0];
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [correctionEntry, setCorrectionEntry] = useState<AttendanceEntry | null>(null);
  const [notice, setNotice] = useState('');

  const employeeContext = useMemo(() => {
    if (!selectedEmployee) {
      return {
        balances: [],
        ownAttendance: [],
        ownCorrections: [],
        ownDocuments: [],
        ownGoals: [],
        ownReviews: [],
        ownFeedback: [],
        ownAssets: [],
        ownLeave: [],
        ownSlips: [],
        profileReports: [],
        pendingTeamCorrections: [],
        pendingTeamLeave: [],
        teamAttendanceToday: [],
      };
    }
    const profileReports = hr.employees.filter((employee) => employee.manager === selectedEmployee.name);
    const teamIds = new Set(profileReports.map((employee) => employee.id));
    return {
      balances: hr.leaveBalances.filter((balance) => balance.employeeId === selectedEmployee.id),
      ownAttendance: hr.attendance.filter((entry) => entry.employeeId === selectedEmployee.id).sort((a, b) => b.date.localeCompare(a.date)),
      ownCorrections: hr.attendanceCorrections.filter((correction) => correction.employeeId === selectedEmployee.id),
      ownDocuments: hr.documents.filter((document) => document.employeeId === selectedEmployee.id),
      ownGoals: hr.performanceGoals.filter((goal) => goal.employeeId === selectedEmployee.id),
      ownReviews: hr.performanceReviews.filter((review) => review.employeeId === selectedEmployee.id),
      ownFeedback: hr.performanceFeedback.filter((feedback) => feedback.employeeId === selectedEmployee.id),
      ownAssets: hr.assets.filter((asset) => asset.assignedToId === selectedEmployee.id),
      ownLeave: hr.leaveRequests.filter((leave) => leave.employeeId === selectedEmployee.id).sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)),
      ownSlips: hr.salarySlips.filter((slip) => slip.employeeId === selectedEmployee.id).sort((a, b) => b.month.localeCompare(a.month)),
      profileReports,
      pendingTeamCorrections: hr.attendanceCorrections.filter((correction) => teamIds.has(correction.employeeId) && correction.status === 'Pending'),
      pendingTeamLeave: hr.leaveRequests.filter((leave) => teamIds.has(leave.employeeId) && leave.status === 'Pending'),
      teamAttendanceToday: hr.attendance.filter((entry) => teamIds.has(entry.employeeId) && entry.date === HR_DEMO_TODAY),
    };
  }, [hr, selectedEmployee]);

  if (!selectedEmployee) {
    return <EmptyState title="No employee profiles" description="Add an employee before opening self-service." />;
  }

  const latestAttendance = employeeContext.ownAttendance[0];
  const latestSlip = employeeContext.ownSlips[0];
  const availableLeave = employeeContext.balances.reduce((sum, balance) => sum + balance.available, 0);
  const pendingOwnLeave = employeeContext.ownLeave.filter((leave) => leave.status === 'Pending').length;
  const monthlyHours = employeeContext.ownAttendance.filter((entry) => entry.date.startsWith('2026-06')).reduce((sum, entry) => sum + entry.workHours, 0);
  const managerQueueCount = employeeContext.pendingTeamLeave.length + employeeContext.pendingTeamCorrections.length;

  const downloadPayslip = (slip: SalarySlip) => {
    const contents = [
      `Payslip ${slip.slipNumber}`,
      `Employee: ${slip.employeeName}`,
      `Month: ${slip.month}`,
      `Basic: ${formatINR(slip.basic)}`,
      `Allowances: ${formatINR(slip.allowances)}`,
      `Deductions: ${formatINR(slip.deductions + slip.pf + slip.esi)}`,
      `Net salary: ${formatINR(slip.netSalary)}`,
      `Payment status: ${slip.paymentStatus}`,
    ].join('\n');
    const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slip.slipNumber}.txt`;
    anchor.click();
    window.URL.revokeObjectURL(url);
    setNotice(`${slip.slipNumber} downloaded.`);
  };

  const openCorrectionDialog = (entry?: AttendanceEntry) => {
    setCorrectionEntry(entry || latestAttendance || null);
    setCorrectionDialogOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Self Service"
        description="Employee requests, documents, payslips, and manager approvals linked to the HR workbenches."
        action={(
          <label className="flex min-w-72 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <UserCircle className="h-4 w-4 text-slate-500" />
            <select className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none" value={selectedEmployee.id} onChange={(event) => setSelectedEmployeeId(event.target.value)} aria-label="Self-service profile">
              {profileOptions.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
            </select>
          </label>
        )}
      />

      {notice && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>{notice}</span>
          <Button size="sm" variant="ghost" onClick={() => setNotice('')}>Dismiss</Button>
        </div>
      )}

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leave available" value={String(availableLeave)} hint={`${pendingOwnLeave} pending request(s)`} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="June hours" value={monthlyHours.toFixed(1)} hint={selectedEmployee.shiftGroupName || 'Shift not assigned'} icon={<Clock3 className="h-4 w-4" />} />
        <StatCard label="Payslips" value={String(employeeContext.ownSlips.length)} hint={latestSlip ? latestSlip.month : 'No payroll yet'} icon={<WalletCards className="h-4 w-4" />} />
        <StatCard label="Manager queue" value={String(managerQueueCount)} hint={`${employeeContext.profileReports.length} direct report(s)`} icon={<ShieldCheck className="h-4 w-4" />} />
      </section>

      <section className="mb-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title={selectedEmployee.name} icon={<UserCheck className="h-4 w-4" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileLine label="Employee no." value={selectedEmployee.employeeNumber} />
            <ProfileLine label="Designation" value={selectedEmployee.designation} />
            <ProfileLine label="Department" value={selectedEmployee.department} />
            <ProfileLine label="Manager" value={selectedEmployee.manager} />
            <ProfileLine label="Branch" value={selectedEmployee.branchName || 'Not assigned'} />
            <ProfileLine label="Status" value={<HrStatusBadge status={selectedEmployee.status} />} />
          </div>
        </Panel>
        <Panel title="Quick Actions" icon={<CalendarCheck className="h-4 w-4" />}>
          <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
            <Button onClick={() => setLeaveDialogOpen(true)}><CalendarDays className="h-4 w-4" />Apply leave</Button>
            <Button variant="outline" onClick={() => openCorrectionDialog()}><FilePenLine className="h-4 w-4" />Request correction</Button>
            <Button variant="outline" disabled={!latestSlip} onClick={() => latestSlip && downloadPayslip(latestSlip)}><Download className="h-4 w-4" />Download payslip</Button>
          </div>
        </Panel>
      </section>

      <Tabs defaultValue="desk">
        <TabsList className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="desk">My Desk</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="manager">Manager Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="desk" className="mt-4 grid gap-4 xl:grid-cols-3">
          <Panel title="Leave Balances">
            <div className="space-y-2">
              {employeeContext.balances.map((balance) => (
                <div key={balance.id} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-800">{balance.leaveType}</span>
                    <span className="text-slate-600">{balance.available} available</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-500">
                    <span>Used {balance.used}</span>
                    <span>Pending {balance.pending}</span>
                    <span>Carry {balance.carryForward}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Today">
            {latestAttendance ? (
              <div className="space-y-3 text-sm">
                <ProfileLine label="Date" value={formatDate(latestAttendance.date)} />
                <ProfileLine label="Punch" value={`${latestAttendance.checkIn || '-'} - ${latestAttendance.checkOut || '-'}`} />
                <ProfileLine label="Work hours" value={`${latestAttendance.workHours} hrs`} />
                <ProfileLine label="Status" value={<HrStatusBadge status={latestAttendance.status} />} />
              </div>
            ) : (
              <p className="text-sm text-slate-500">No attendance entries yet.</p>
            )}
          </Panel>
          <Panel title="Documents" icon={<FileText className="h-4 w-4" />}>
            <div className="space-y-2">
              {employeeContext.ownDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="min-w-0 truncate font-medium text-slate-800">{document.documentType}</span>
                  <HrStatusBadge status={document.status} />
                </div>
              ))}
              {!employeeContext.ownDocuments.length && <p className="text-sm text-slate-500">No employee documents uploaded.</p>}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setLeaveDialogOpen(true)}><CalendarDays className="h-4 w-4" />Apply leave</Button>
          </div>
          <DataTable headers={['Leave type', 'Dates', 'Days', 'Reason', 'Applied', 'Status', 'Action']}>
            {employeeContext.ownLeave.map((leave) => (
              <tr key={leave.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{leave.leaveType}</td>
                <td className="px-4 py-3 text-slate-600">{leave.fromDate} to {leave.toDate}</td>
                <td className="px-4 py-3 text-slate-600">{leave.days}</td>
                <td className="max-w-80 px-4 py-3 text-slate-600">{leave.reason}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(leave.appliedDate)}</td>
                <td className="px-4 py-3"><HrStatusBadge status={leave.status} /></td>
                <td className="px-4 py-3">{leave.status === 'Pending' && <Button size="sm" variant="outline" onClick={() => { hr.updateLeaveStatus(leave.id, 'Cancelled'); setNotice('Leave request cancelled.'); }}>Cancel</Button>}</td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4 space-y-4">
          <DataTable headers={['Date', 'Check-in', 'Check-out', 'Hours', 'Location', 'Status', 'Action']}>
            {employeeContext.ownAttendance.slice(0, 12).map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{formatDate(entry.date)}</td>
                <td className="px-4 py-3 text-slate-600">{entry.checkIn || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{entry.checkOut || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{entry.workHours}</td>
                <td className="px-4 py-3 text-slate-600">{entry.location || 'Not recorded'}</td>
                <td className="px-4 py-3"><HrStatusBadge status={entry.status} /></td>
                <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => openCorrectionDialog(entry)}><FilePenLine className="h-4 w-4" />Correct</Button></td>
              </tr>
            ))}
          </DataTable>
          <DataTable headers={['Date', 'Old punch', 'New punch', 'Reason', 'Approver', 'Status']}>
            {employeeContext.ownCorrections.map((correction) => (
              <tr key={correction.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{formatDate(correction.date)}</td>
                <td className="px-4 py-3 text-slate-600">{correction.oldCheckIn || '-'} - {correction.oldCheckOut || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{correction.newCheckIn} - {correction.newCheckOut}</td>
                <td className="max-w-80 px-4 py-3 text-slate-600">{correction.reason}</td>
                <td className="px-4 py-3 text-slate-600">{correction.approver}</td>
                <td className="px-4 py-3"><HrStatusBadge status={correction.status} /></td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>

        <TabsContent value="payslips" className="mt-4">
          <DataTable headers={['Slip number', 'Month', 'Gross', 'Deductions', 'Net salary', 'Generated', 'Status', 'Action']}>
            {employeeContext.ownSlips.map((slip) => (
              <tr key={slip.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{slip.slipNumber}</td>
                <td className="px-4 py-3 text-slate-600">{slip.month}</td>
                <td className="px-4 py-3 text-slate-600">{formatINR(slip.basic + slip.allowances)}</td>
                <td className="px-4 py-3 text-slate-600">{formatINR(slip.deductions + slip.pf + slip.esi)}</td>
                <td className="px-4 py-3 font-semibold text-slate-950">{formatINR(slip.netSalary)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(slip.generatedDate)}</td>
                <td className="px-4 py-3"><HrStatusBadge status={slip.paymentStatus} /></td>
                <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => downloadPayslip(slip)}><Download className="h-4 w-4" />Download</Button></td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>

        <TabsContent value="performance" className="mt-4 grid gap-4 xl:grid-cols-2">
          <Panel title="Goals" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="space-y-2">
              {employeeContext.ownGoals.map((goal) => (
                <div key={goal.id} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-3"><span className="font-medium text-slate-800">{goal.title}</span><HrStatusBadge status={goal.status} /></div>
                  <div className="mt-1 text-slate-600">{goal.current}/{goal.target} {goal.metric} | due {goal.dueDate}</div>
                </div>
              ))}
              {!employeeContext.ownGoals.length && <p className="text-sm text-slate-500">No performance goals recorded.</p>}
            </div>
          </Panel>
          <Panel title="Reviews">
            <div className="space-y-2">
              {employeeContext.ownReviews.map((review) => (
                <div key={review.id} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-3"><span className="font-medium text-slate-800">{review.cycleName}</span><HrStatusBadge status={review.status} /></div>
                  <div className="mt-1 text-slate-600">Reviewer {review.reviewer} | rating {review.finalRating || review.managerRating || '-'}</div>
                </div>
              ))}
              {!employeeContext.ownReviews.length && <p className="text-sm text-slate-500">No review cycle opened yet.</p>}
            </div>
          </Panel>
          <Panel title="Feedback">
            <div className="space-y-2">
              {employeeContext.ownFeedback.map((feedback) => (
                <div key={feedback.id} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="font-medium text-slate-800">{feedback.type} from {feedback.from}</div>
                  <div className="mt-1 text-slate-600">{feedback.note}</div>
                </div>
              ))}
              {!employeeContext.ownFeedback.length && <p className="text-sm text-slate-500">No feedback recorded.</p>}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="assets" className="mt-4">
          <DataTable headers={['Asset tag', 'Asset', 'Category', 'Assigned date', 'Expected return', 'Return status', 'Condition']}>
            {employeeContext.ownAssets.map((asset) => (
              <tr key={asset.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{asset.assetTag}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{asset.name}</td>
                <td className="px-4 py-3 text-slate-600">{asset.category}</td>
                <td className="px-4 py-3 text-slate-600">{asset.assignedDate || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{asset.expectedReturnDate || '-'}</td>
                <td className="px-4 py-3"><HrStatusBadge status={asset.returnStatus} /></td>
                <td className="px-4 py-3 text-slate-600">{asset.condition}</td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>

        <TabsContent value="manager" className="mt-4 space-y-4">
          {employeeContext.profileReports.length ? (
            <>
              <section className="grid gap-4 xl:grid-cols-3">
                <Panel title="Direct Reports">
                  <div className="space-y-2">
                    {employeeContext.profileReports.map((employee) => (
                      <div key={employee.id} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                        <div className="font-medium text-slate-900">{employee.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{employee.designation} | {employee.shiftGroupName || 'No shift'}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Today Coverage">
                  <div className="space-y-2">
                    {employeeContext.teamAttendanceToday.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                        <span className="min-w-0 truncate font-medium text-slate-800">{entry.employeeName}</span>
                        <HrStatusBadge status={entry.status} />
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Queue Summary">
                  <ProfileLine label="Leave approvals" value={String(employeeContext.pendingTeamLeave.length)} />
                  <ProfileLine label="Attendance corrections" value={String(employeeContext.pendingTeamCorrections.length)} />
                  <ProfileLine label="Direct reports" value={String(employeeContext.profileReports.length)} />
                </Panel>
              </section>
              <DataTable headers={['Employee', 'Leave type', 'Dates', 'Days', 'Reason', 'Status', 'Actions']}>
                {employeeContext.pendingTeamLeave.map((leave) => (
                  <tr key={leave.id}>
                    <td className="px-4 py-3 font-medium text-slate-950">{leave.employeeName}</td>
                    <td className="px-4 py-3 text-slate-600">{leave.leaveType}</td>
                    <td className="px-4 py-3 text-slate-600">{leave.fromDate} to {leave.toDate}</td>
                    <td className="px-4 py-3 text-slate-600">{leave.days}</td>
                    <td className="max-w-80 px-4 py-3 text-slate-600">{leave.reason}</td>
                    <td className="px-4 py-3"><HrStatusBadge status={leave.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="icon" variant="outline" disabled={!access.canApproveLeave} title="Approve leave" onClick={() => { hr.updateLeaveStatus(leave.id, 'Approved'); setNotice(`${leave.employeeName} leave approved.`); }}><Check className="h-4 w-4 text-emerald-600" /></Button>
                        <Button size="icon" variant="outline" disabled={!access.canApproveLeave} title="Reject leave" onClick={() => { hr.updateLeaveStatus(leave.id, 'Rejected'); setNotice(`${leave.employeeName} leave rejected.`); }}><X className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
              <DataTable headers={['Employee', 'Date', 'Old punch', 'New punch', 'Reason', 'Status', 'Actions']}>
                {employeeContext.pendingTeamCorrections.map((correction) => (
                  <tr key={correction.id}>
                    <td className="px-4 py-3 font-medium text-slate-950">{correction.employeeName}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(correction.date)}</td>
                    <td className="px-4 py-3 text-slate-600">{correction.oldCheckIn || '-'} - {correction.oldCheckOut || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{correction.newCheckIn} - {correction.newCheckOut}</td>
                    <td className="max-w-80 px-4 py-3 text-slate-600">{correction.reason}</td>
                    <td className="px-4 py-3"><HrStatusBadge status={correction.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="icon" variant="outline" disabled={!access.canEditAttendance} title="Approve correction" onClick={() => { hr.updateAttendanceCorrectionStatus(correction.id, 'Approved'); setNotice(`${correction.employeeName} correction approved.`); }}><Check className="h-4 w-4 text-emerald-600" /></Button>
                        <Button size="icon" variant="outline" disabled={!access.canEditAttendance} title="Reject correction" onClick={() => { hr.updateAttendanceCorrectionStatus(correction.id, 'Rejected'); setNotice(`${correction.employeeName} correction rejected.`); }}><X className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            </>
          ) : (
            <EmptyState title="No manager queue" description={`${selectedEmployee.name} has no direct reports in the demo org chart.`} />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply leave</DialogTitle>
            <DialogDescription>{selectedEmployee.name} | {selectedEmployee.manager}</DialogDescription>
          </DialogHeader>
          <SelfServiceLeaveForm employee={selectedEmployee} onSubmit={(draft) => { hr.applyLeave(draft); setLeaveDialogOpen(false); setNotice('Leave request submitted.'); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={correctionDialogOpen} onOpenChange={setCorrectionDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request attendance correction</DialogTitle>
            <DialogDescription>{selectedEmployee.name} | {selectedEmployee.shiftGroupName || 'Shift not assigned'}</DialogDescription>
          </DialogHeader>
          <SelfServiceCorrectionForm employee={selectedEmployee} entries={employeeContext.ownAttendance} initialEntry={correctionEntry} onSubmit={(draft) => { hr.createAttendanceCorrection(draft); setCorrectionDialogOpen(false); setCorrectionEntry(null); setNotice('Attendance correction submitted.'); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SelfServiceLeaveForm: React.FC<{ employee: Employee; onSubmit: (draft: LeaveDraft) => void }> = ({ employee, onSubmit }) => {
  const [draft, setDraft] = useState<LeaveDraft>({ employeeId: employee.id, leaveType: 'Casual Leave', fromDate: '2026-06-23', toDate: '2026-06-23', reason: '' });
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...draft, employeeId: employee.id }); }}>
      <Field label="Employee"><Input value={employee.name} readOnly /></Field>
      <Field label="Leave type"><select className={selectClass} value={draft.leaveType} onChange={(event) => setDraft({ ...draft, leaveType: event.target.value })}>{['Casual Leave', 'Sick Leave', 'Earned Leave', 'Comp Off', 'Unpaid Leave'].map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="From date"><Input type="date" value={draft.fromDate} onChange={(event) => setDraft({ ...draft, fromDate: event.target.value })} /></Field>
      <Field label="To date"><Input type="date" min={draft.fromDate} value={draft.toDate} onChange={(event) => setDraft({ ...draft, toDate: event.target.value })} /></Field>
      <Field label="Reason" className="sm:col-span-2"><Textarea required value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Submit request</Button></div>
    </form>
  );
};

const SelfServiceCorrectionForm: React.FC<{ employee: Employee; entries: AttendanceEntry[]; initialEntry: AttendanceEntry | null; onSubmit: (draft: AttendanceCorrectionDraft) => void }> = ({ employee, entries, initialEntry, onSubmit }) => {
  const startingEntry = initialEntry || entries[0];
  const [draft, setDraft] = useState<AttendanceCorrectionDraft>({
    employeeId: employee.id,
    date: startingEntry?.date || HR_DEMO_TODAY,
    newCheckIn: startingEntry?.checkIn || '09:30',
    newCheckOut: startingEntry?.checkOut || '18:00',
    reason: '',
    approver: employee.manager || 'HR Admin',
  });

  const currentEntry = entries.find((entry) => entry.date === draft.date);
  const changeDate = (date: string) => {
    const entry = entries.find((item) => item.date === date);
    setDraft({ ...draft, date, newCheckIn: entry?.checkIn || draft.newCheckIn || '09:30', newCheckOut: entry?.checkOut || draft.newCheckOut || '18:00' });
  };

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...draft, employeeId: employee.id }); }}>
      <div className="rounded-sm border border-slate-200 bg-slate-50 p-3 text-sm sm:col-span-2">
        <span className="font-medium text-slate-950">{employee.name}</span>
        <span className="text-slate-500"> | current punch {currentEntry?.checkIn || '-'} - {currentEntry?.checkOut || '-'}</span>
      </div>
      <Field label="Date">
        {entries.length ? (
          <select className={selectClass} value={draft.date} onChange={(event) => changeDate(event.target.value)}>
            {entries.slice(0, 18).map((entry) => <option key={entry.id} value={entry.date}>{formatDate(entry.date)}</option>)}
          </select>
        ) : (
          <Input type="date" value={draft.date} onChange={(event) => changeDate(event.target.value)} />
        )}
      </Field>
      <Field label="Approver"><Input value={draft.approver} onChange={(event) => setDraft({ ...draft, approver: event.target.value })} /></Field>
      <Field label="New check-in"><Input type="time" value={draft.newCheckIn} onChange={(event) => setDraft({ ...draft, newCheckIn: event.target.value })} /></Field>
      <Field label="New check-out"><Input type="time" value={draft.newCheckOut} onChange={(event) => setDraft({ ...draft, newCheckOut: event.target.value })} /></Field>
      <Field label="Reason" className="sm:col-span-2"><Textarea required value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Submit correction</Button></div>
    </form>
  );
};

const Panel: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center gap-2">
      {icon && <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700">{icon}</span>}
      <h2 className="font-semibold text-slate-950">{title}</h2>
    </div>
    {children}
  </section>
);

const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>;

const ProfileLine: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="min-w-0 rounded-sm bg-slate-50 px-3 py-2">
    <p className="text-xs text-slate-500">{label}</p>
    <div className="mt-1 truncate text-sm font-medium text-slate-900">{value}</div>
  </div>
);

const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default SelfServicePage;
