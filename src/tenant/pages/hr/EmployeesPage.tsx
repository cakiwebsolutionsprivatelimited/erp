import React, { useMemo, useState } from 'react';
import { CheckCircle2, Eye, LogOut, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar, formatINR } from '@/tenant/components/TenantUI';
import { EmployeeForm } from '@/tenant/hr/HrForms';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { calculateNetSalary } from '@/tenant/hr/hrDemoService';
import type { Employee, LifecycleTaskStatus } from '@/tenant/hr/types';

const taskStatuses: LifecycleTaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Blocked'];
const selectClass = 'flex h-9 w-full min-w-32 rounded-sm border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

const EmployeesPage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const canManageEmployees = ['Business Owner', 'HR Admin'].includes(access.activeRole);
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const visibleEmployeeIds = access.scopedEmployeeIds;
  const visibleEmployees = useMemo(() => hr.employees.filter((employee) => visibleEmployeeIds.has(employee.id)), [hr.employees, visibleEmployeeIds]);
  const selectedEmployee = selected ? visibleEmployees.find((employee) => employee.id === selected.id) || null : null;
  const filtered = useMemo(() => visibleEmployees.filter((employee) => `${employee.employeeNumber} ${employee.name} ${employee.department} ${employee.designation} ${employee.branchName || ''} ${employee.shiftGroupName || ''}`.toLowerCase().includes(query.toLowerCase())), [visibleEmployees, query]);

  return (
    <div>
      <PageHeader title="Employees" description="Employee master, job allocation, onboarding, probation, offboarding, salary, bank, and document records." action={canManageEmployees ? <Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Add employee</Button> : undefined} />
      <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search employees, branches, departments, or roles" /></div>
      <DataTable headers={['Employee ID', 'Name', 'Department', 'Designation', 'Branch', 'Shift', 'Probation', 'Status', '']}>
        {filtered.map((employee) => (
          <tr key={employee.id}>
            <td className="px-4 py-3 font-medium text-indigo-700">{employee.employeeNumber}</td>
            <td className="px-4 py-3 font-medium text-slate-950">{employee.name}</td>
            <td className="px-4 py-3 text-slate-600">{employee.department}</td>
            <td className="px-4 py-3 text-slate-600">{employee.designation}</td>
            <td className="px-4 py-3 text-slate-600">{employee.branchName || 'Unassigned'}</td>
            <td className="px-4 py-3 text-slate-600">{employee.shiftGroupName || 'Unassigned'}</td>
            <td className="px-4 py-3 text-slate-600">{employee.probationEndDate || 'Not applicable'}</td>
            <td className="px-4 py-3"><HrStatusBadge status={employee.status} /></td>
            <td className="px-4 py-3"><Button size="icon" variant="ghost" title="View employee" onClick={() => setSelected(employee)}><Eye className="h-4 w-4" /></Button></td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add employee</DialogTitle>
            <DialogDescription>Create a complete HR employee record with lifecycle defaults.</DialogDescription>
          </DialogHeader>
          <EmployeeForm branches={hr.branches} shiftGroups={hr.shiftGroups} onSubmit={(draft) => { hr.addEmployee(draft); setFormOpen(false); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedEmployee)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-6xl">
          {selectedEmployee && (
            <EmployeeDetail
              employee={selectedEmployee}
              attendance={hr.attendance.filter((entry) => entry.employeeId === selectedEmployee.id)}
              leaves={hr.leaveRequests.filter((leave) => leave.employeeId === selectedEmployee.id)}
              slips={hr.salarySlips.filter((slip) => slip.employeeId === selectedEmployee.id)}
              documents={hr.documents.filter((document) => document.employeeId === selectedEmployee.id)}
              onboarding={hr.onboardingTasks.filter((task) => task.employeeId === selectedEmployee.id)}
              offboarding={hr.offboardingItems.filter((item) => item.employeeId === selectedEmployee.id)}
              events={hr.lifecycleEvents.filter((event) => event.employeeId === selectedEmployee.id)}
              revisions={hr.salaryRevisions.filter((revision) => revision.employeeId === selectedEmployee.id)}
              performanceGoals={hr.performanceGoals.filter((goal) => goal.employeeId === selectedEmployee.id)}
              performanceReviews={hr.performanceReviews.filter((review) => review.employeeId === selectedEmployee.id)}
              performanceFeedback={hr.performanceFeedback.filter((feedback) => feedback.employeeId === selectedEmployee.id)}
              assets={hr.assets.filter((asset) => asset.assignedToId === selectedEmployee.id)}
              onUpdateOnboarding={hr.updateOnboardingTaskStatus}
              onConfirmProbation={hr.confirmProbation}
              onStartOffboarding={hr.startOffboarding}
              onUpdateOffboarding={hr.updateOffboardingItemStatus}
              canManageEmployees={canManageEmployees}
              canViewSalary={access.canViewSalary}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

type HrData = ReturnType<typeof useHrData>;

const EmployeeDetail: React.FC<{
  employee: Employee;
  attendance: HrData['attendance'];
  leaves: HrData['leaveRequests'];
  slips: HrData['salarySlips'];
  documents: HrData['documents'];
  onboarding: HrData['onboardingTasks'];
  offboarding: HrData['offboardingItems'];
  events: HrData['lifecycleEvents'];
  revisions: HrData['salaryRevisions'];
  performanceGoals: HrData['performanceGoals'];
  performanceReviews: HrData['performanceReviews'];
  performanceFeedback: HrData['performanceFeedback'];
  assets: HrData['assets'];
  onUpdateOnboarding: HrData['updateOnboardingTaskStatus'];
  onConfirmProbation: HrData['confirmProbation'];
  onStartOffboarding: HrData['startOffboarding'];
  onUpdateOffboarding: HrData['updateOffboardingItemStatus'];
  canManageEmployees: boolean;
  canViewSalary: boolean;
}> = ({ employee, attendance, leaves, slips, documents, onboarding, offboarding, events, revisions, performanceGoals, performanceReviews, performanceFeedback, assets, onUpdateOnboarding, onConfirmProbation, onStartOffboarding, onUpdateOffboarding, canManageEmployees, canViewSalary }) => (
  <>
    <DialogHeader>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2"><DialogTitle>{employee.name}</DialogTitle><HrStatusBadge status={employee.status} /></div>
          <DialogDescription>{employee.employeeNumber} | {employee.designation} | {employee.department}</DialogDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {canManageEmployees && employee.status === 'Probation' && <Button size="sm" variant="outline" onClick={() => onConfirmProbation(employee.id)}><CheckCircle2 className="h-4 w-4" />Confirm probation</Button>}
          {canManageEmployees && !['Notice Period', 'Inactive'].includes(employee.status) && <Button size="sm" variant="outline" onClick={() => onStartOffboarding(employee.id, '2026-07-31')}><LogOut className="h-4 w-4" />Start offboarding</Button>}
        </div>
      </div>
    </DialogHeader>
    <Tabs defaultValue="overview">
      <TabsList className="w-full justify-start overflow-x-auto">
        {['overview', 'personal', 'employment', 'onboarding', 'lifecycle', 'attendance', 'leave', 'payroll', 'performance', 'documents', 'assets', 'notes'].map((tab) => <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>)}
      </TabsList>
      <TabsContent value="overview" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Detail label="Email" value={employee.email} />
        <Detail label="Phone" value={employee.phone} />
        <Detail label="Manager" value={employee.manager} />
        <Detail label="Branch" value={employee.branchName || 'Unassigned'} />
        <Detail label="Shift group" value={employee.shiftGroupName || 'Unassigned'} />
        <Detail label="Joining date" value={employee.joiningDate} />
        <Detail label="Employment type" value={employee.employmentType} />
        <Detail label="Probation end" value={employee.probationEndDate || 'Not applicable'} />
        <Detail label="Net salary" value={canViewSalary ? formatINR(calculateNetSalary(employee)) : 'Restricted'} />
        <Detail label="Address" value={employee.address} className="sm:col-span-2 lg:col-span-3" />
      </TabsContent>
      <TabsContent value="personal" className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Emergency contacts">{employee.emergencyContacts?.length ? employee.emergencyContacts.map((contact) => <InfoRow key={`${contact.name}-${contact.phone}`} label={`${contact.name || 'Contact'} (${contact.relationship || 'Relation'})`} value={contact.phone || 'Phone not recorded'} />) : <EmptyState label="No emergency contacts recorded." />}</Panel>
        <Panel title="Government IDs">{employee.governmentIds?.length ? employee.governmentIds.map((item) => <InfoRow key={item.type} label={item.type} value={`${item.valueLast4 ? `****${item.valueLast4}` : 'Not recorded'} - ${item.verified ? 'Verified' : 'Pending'}`} />) : <EmptyState label="No identity records recorded." />}</Panel>
        <Panel title="Skills">{employee.skills?.length ? <div className="flex flex-wrap gap-2">{employee.skills.map((skill) => <span key={skill.name} className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700">{skill.name} - {skill.level}</span>)}</div> : <EmptyState label="No skills recorded." />}</Panel>
        <Panel title="Education and experience">{employee.education?.map((item) => <InfoRow key={`${item.degree}-${item.year}`} label={item.degree} value={`${item.institution}, ${item.year}`} />)}{employee.experience?.map((item) => <InfoRow key={`${item.company}-${item.role}`} label={item.company} value={`${item.role}, ${item.years} year(s)`} />)}{!employee.education?.length && !employee.experience?.length && <EmptyState label="No education or experience recorded." />}</Panel>
      </TabsContent>
      <TabsContent value="employment" className="mt-4">
        <DataTable headers={['Date', 'Event', 'Role', 'Department', 'Manager']}>{employee.employmentHistory?.length ? employee.employmentHistory.map((entry) => <tr key={`${entry.date}-${entry.event}`}><td className="px-4 py-3">{entry.date}</td><td className="px-4 py-3 font-medium text-slate-950">{entry.event}</td><td className="px-4 py-3 text-slate-600">{entry.role}</td><td className="px-4 py-3 text-slate-600">{entry.department}</td><td className="px-4 py-3 text-slate-600">{entry.manager}</td></tr>) : <EmptyTableRow columns={5} label="No employment history recorded." />}</DataTable>
      </TabsContent>
      <TabsContent value="onboarding" className="mt-4">
        <DataTable headers={['Task', 'Owner', 'Category', 'Due date', 'Status']}>{onboarding.length ? onboarding.map((task) => <tr key={task.id}><td className="px-4 py-3 font-medium text-slate-950">{task.title}</td><td className="px-4 py-3 text-slate-600">{task.owner}</td><td className="px-4 py-3 text-slate-600">{task.category}</td><td className="px-4 py-3 text-slate-600">{task.dueDate}</td><td className="px-4 py-3"><TaskStatusSelect value={task.status} disabled={!canManageEmployees} onChange={(status) => onUpdateOnboarding(task.id, status)} /></td></tr>) : <EmptyTableRow columns={5} label="No onboarding tasks for this employee." />}</DataTable>
      </TabsContent>
      <TabsContent value="lifecycle" className="mt-4 space-y-4">
        <DataTable headers={['Date', 'Type', 'Title', 'Actor', 'Details']}>{events.length ? events.map((event) => <tr key={event.id}><td className="px-4 py-3">{event.date}</td><td className="px-4 py-3 text-slate-600">{event.type}</td><td className="px-4 py-3 font-medium text-slate-950">{event.title}</td><td className="px-4 py-3 text-slate-600">{event.actor}</td><td className="px-4 py-3 text-slate-600">{event.details}</td></tr>) : <EmptyTableRow columns={5} label="No lifecycle events recorded." />}</DataTable>
        <DataTable headers={['Revision date', 'Previous net', 'Revised net', 'Reason', 'Status']}>{revisions.length ? revisions.map((revision) => <tr key={revision.id}><td className="px-4 py-3">{revision.effectiveDate}</td><td className="px-4 py-3">{canViewSalary ? formatINR(revision.previousNet) : 'Restricted'}</td><td className="px-4 py-3 font-medium text-slate-950">{canViewSalary ? formatINR(revision.revisedNet) : 'Restricted'}</td><td className="px-4 py-3 text-slate-600">{revision.reason}</td><td className="px-4 py-3"><HrStatusBadge status={revision.status} /></td></tr>) : <EmptyTableRow columns={5} label="No salary revisions recorded." />}</DataTable>
        <DataTable headers={['Offboarding item', 'Owner', 'Due date', 'Status']}>{offboarding.length ? offboarding.map((item) => <tr key={item.id}><td className="px-4 py-3 font-medium text-slate-950">{item.title}</td><td className="px-4 py-3 text-slate-600">{item.owner}</td><td className="px-4 py-3 text-slate-600">{item.dueDate}</td><td className="px-4 py-3"><TaskStatusSelect value={item.status} disabled={!canManageEmployees} onChange={(status) => onUpdateOffboarding(item.id, status)} /></td></tr>) : <EmptyTableRow columns={4} label="No offboarding checklist for this employee." />}</DataTable>
      </TabsContent>
      <TabsContent value="attendance" className="mt-4">
        <DataTable headers={['Date', 'Check-in', 'Check-out', 'Hours', 'Status']}>{attendance.slice(-10).reverse().map((entry) => <tr key={entry.id}><td className="px-4 py-3">{entry.date}</td><td className="px-4 py-3">{entry.checkIn || '-'}</td><td className="px-4 py-3">{entry.checkOut || '-'}</td><td className="px-4 py-3">{entry.workHours}</td><td className="px-4 py-3"><HrStatusBadge status={entry.status} /></td></tr>)}</DataTable>
      </TabsContent>
      <TabsContent value="leave" className="mt-4 space-y-2">{leaves.length ? leaves.map((leave) => <div key={leave.id} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 p-3 text-sm"><span>{leave.leaveType} | {leave.fromDate} to {leave.toDate}</span><HrStatusBadge status={leave.status} /></div>) : <EmptyState label="No leave requests recorded." />}</TabsContent>
      <TabsContent value="payroll" className="mt-4 space-y-2">{slips.length ? slips.map((slip) => <div key={slip.id} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 p-3 text-sm"><span>{slip.month} | {slip.slipNumber}</span><span className="font-semibold">{canViewSalary ? formatINR(slip.netSalary) : 'Restricted'}</span></div>) : <EmptyState label="No salary slips generated." />}</TabsContent>
      <TabsContent value="performance" className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Goals">{performanceGoals.length ? performanceGoals.map((goal) => <InfoRow key={goal.id} label={goal.title} value={`${goal.current}/${goal.target} ${goal.metric} | ${goal.status}`} />) : <EmptyState label="No goals recorded." />}</Panel>
        <Panel title="Reviews">{performanceReviews.length ? performanceReviews.map((review) => <InfoRow key={review.id} label={review.cycleName} value={`${review.reviewer} | ${review.status} | rating ${review.finalRating || review.managerRating || '-'}`} />) : <EmptyState label="No performance reviews recorded." />}</Panel>
        <Panel title="Feedback">{performanceFeedback.length ? performanceFeedback.map((feedback) => <InfoRow key={feedback.id} label={`${feedback.type} from ${feedback.from}`} value={feedback.note} />) : <EmptyState label="No performance feedback recorded." />}</Panel>
      </TabsContent>
      <TabsContent value="documents" className="mt-4 space-y-2">{documents.length ? documents.map((document) => <div key={document.id} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 p-3 text-sm"><span>{document.documentType} | {document.fileName}</span><HrStatusBadge status={document.status} /></div>) : <EmptyState label="No documents uploaded." />}</TabsContent>
      <TabsContent value="assets" className="mt-4 space-y-2">{assets.length ? assets.map((asset) => <div key={asset.id} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 p-3 text-sm"><span>{asset.assetTag} | {asset.name}</span><HrStatusBadge status={asset.returnStatus} /></div>) : <EmptyState label="No assigned assets recorded." />}</TabsContent>
      <TabsContent value="notes" className="mt-4 rounded-md border border-slate-200 p-4 text-sm text-slate-600">{employee.notes || 'No notes recorded.'}</TabsContent>
    </Tabs>
  </>
);

const TaskStatusSelect: React.FC<{ value: LifecycleTaskStatus; disabled?: boolean; onChange: (status: LifecycleTaskStatus) => void }> = ({ value, disabled = false, onChange }) => (
  <select className={selectClass} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as LifecycleTaskStatus)}>
    {taskStatuses.map((status) => <option key={status}>{status}</option>)}
  </select>
);

const Detail: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => <div className={`rounded-sm border border-slate-200 bg-slate-50 p-3 ${className || ''}`}><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-800">{value}</p></div>;
const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-3 font-semibold text-slate-950">{title}</h2><div className="space-y-2">{children}</div></section>;
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><span className="font-medium text-slate-800">{label}</span><span className="text-right text-slate-600">{value}</span></div>;
const EmptyState: React.FC<{ label: string }> = ({ label }) => <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{label}</div>;
const EmptyTableRow: React.FC<{ columns: number; label: string }> = ({ columns, label }) => <tr><td colSpan={columns} className="px-4 py-8 text-center text-sm text-slate-500">{label}</td></tr>;

export default EmployeesPage;
