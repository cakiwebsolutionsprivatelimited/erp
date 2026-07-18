import React, { useState } from 'react';
import { Banknote, Building2, CalendarDays, CheckCircle2, ClipboardList, Clock3, Download, FileCheck2, FileClock, FilePlus2, FileText, LockKeyhole, LogOut, PlusCircle, RotateCcw, Save, ShieldCheck, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar, StatCard, formatINR } from '@/tenant/components/TenantUI';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { HR_DEMO_TODAY, getShiftCoverage } from '@/tenant/hr/hrDemoService';
import { BranchForm, DesignationForm, HolidayForm, LeavePolicyForm, ShiftGroupForm } from '@/tenant/hr/HrSetupForms';
import type { DocumentRequestStatus, DocumentTemplate, Employee, EmployeeDocument, EmployeeDocumentDraft, LifecycleTaskStatus, PayrollCalendar } from '@/tenant/hr/types';

const selectClass = 'flex h-10 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';
const compactSelectClass = 'flex h-9 w-full min-w-32 rounded-sm border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';
const taskStatuses: LifecycleTaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Blocked'];
const documentStatuses: EmployeeDocument['status'][] = ['Pending', 'Verified', 'Expired'];
const documentRequestStatuses: DocumentRequestStatus[] = ['Requested', 'Submitted', 'Verified', 'Rejected'];
type SetupDialog = 'branch' | 'designation' | 'policy' | 'holiday' | 'shift' | null;

export const DepartmentsPage: React.FC = () => {
  const hr = useHrData();
  return (
    <div>
      <PageHeader title="Departments" description="Department ownership, location, headcount, designations, and annual operating budget." />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Departments" value={String(hr.departments.length)} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Designations" value={String(hr.designations.length)} />
        <StatCard label="Active employees" value={String(hr.employees.filter((employee) => employee.status !== 'Inactive').length)} />
        <StatCard label="Annual budget" value={formatINR(hr.departments.reduce((sum, department) => sum + department.budget, 0))} />
      </section>
      <DataTable headers={['Department', 'Head', 'Location', 'Employees', 'Designations', 'Annual budget']}>
        {hr.departments.map((department) => (
          <tr key={department.id}>
            <td className="px-4 py-3"><div className="flex items-center gap-2 font-medium text-slate-950"><Building2 className="h-4 w-4 text-indigo-600" />{department.name}</div></td>
            <td className="px-4 py-3 text-slate-600">{department.head}</td>
            <td className="px-4 py-3 text-slate-600">{department.location}</td>
            <td className="px-4 py-3 text-slate-600">{hr.employees.filter((employee) => employee.department === department.name).length}</td>
            <td className="px-4 py-3 text-slate-600">{hr.designations.filter((designation) => designation.department === department.name).length}</td>
            <td className="px-4 py-3 font-medium text-slate-950">{formatINR(department.budget)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export const HrDocumentsPage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const canManageDocuments = ['Business Owner', 'HR Admin'].includes(access.activeRole);
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState<'upload' | 'generate' | null>(null);
  const visibleEmployeeIds = access.scopedEmployeeIds;
  const visibleEmployees = hr.employees.filter((employee) => visibleEmployeeIds.has(employee.id));
  const visibleDocuments = hr.documents.filter((document) => visibleEmployeeIds.has(document.employeeId));
  const filteredDocuments = visibleDocuments.filter((document) => `${document.employeeName} ${document.documentType} ${document.fileName}`.toLowerCase().includes(query.toLowerCase()));
  const visibleRequests = hr.documentRequests.filter((request) => visibleEmployeeIds.has(request.employeeId));
  const expiryQueue = visibleDocuments.filter((document) => document.status === 'Expired' || (document.expiryDate && document.expiryDate >= HR_DEMO_TODAY && document.expiryDate <= '2026-08-31'));
  const downloadDocument = (employeeDocument: EmployeeDocument) => {
    const contents = [`${employeeDocument.documentType}`, `Employee: ${employeeDocument.employeeName}`, `File: ${employeeDocument.fileName}`, `Status: ${employeeDocument.status}`, `Expiry: ${employeeDocument.expiryDate || 'Not applicable'}`].join('\n');
    const url = window.URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }));
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `${employeeDocument.fileName.replace(/\.[^.]+$/, '')}-summary.txt`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div>
      <PageHeader
        title="Employee Documents"
        description="Employee files, generated letters, upload requests, templates, expiry alerts, and verification workflow."
        action={canManageDocuments ? <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setDialog('upload')}><Upload className="h-4 w-4" />Upload</Button><Button onClick={() => setDialog('generate')}><FilePlus2 className="h-4 w-4" />Generate</Button></div> : undefined}
      />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Documents" value={String(visibleDocuments.length)} icon={<FileCheck2 className="h-4 w-4" />} />
        <StatCard label="Verified" value={String(visibleDocuments.filter((document) => document.status === 'Verified').length)} />
        <StatCard label="Pending review" value={String(visibleDocuments.filter((document) => document.status === 'Pending').length)} />
        <StatCard label="Expiry queue" value={String(expiryQueue.length)} icon={<FileClock className="h-4 w-4" />} />
      </section>
      <Tabs defaultValue="files">
        <TabsList className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Review</TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="mt-4">
          <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search employee, document, or file" /></div>
          <DataTable headers={['Employee', 'Document type', 'File name', 'Expiry date', 'Status', 'Actions']}>
            {filteredDocuments.map((document) => (
              <tr key={document.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{document.employeeName}</td>
                <td className="px-4 py-3 text-slate-600">{document.documentType}</td>
                <td className="px-4 py-3 font-medium text-indigo-700">{document.fileName}</td>
                <td className="px-4 py-3 text-slate-600">{document.expiryDate || 'Not applicable'}</td>
                <td className="px-4 py-3"><HrStatusBadge status={document.status} /></td>
                <td className="px-4 py-3"><DocumentActions document={document} canManage={canManageDocuments} onDownload={downloadDocument} onStatus={hr.updateEmployeeDocumentStatus} /></td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="requests" className="mt-4">
          <DataTable headers={['Employee', 'Document', 'Requested by', 'Due date', 'Notes', 'Status']}>
            {visibleRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{request.employeeName}</td>
                <td className="px-4 py-3 text-slate-600">{request.documentType}</td>
                <td className="px-4 py-3 text-slate-600">{request.requestedBy}</td>
                <td className="px-4 py-3 text-slate-600">{request.dueDate}</td>
                <td className="max-w-80 px-4 py-3 text-slate-600">{request.notes}</td>
                <td className="px-4 py-3">{canManageDocuments ? <DocumentRequestStatusSelect value={request.status} onChange={(status) => hr.updateDocumentRequestStatus(request.id, status)} /> : <HrStatusBadge status={request.status} />}</td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="templates" className="mt-4 grid gap-4 lg:grid-cols-2">
          {hr.documentTemplates.map((template) => (
            <article key={template.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div><h2 className="font-semibold text-slate-950">{template.name}</h2><p className="mt-1 text-sm text-slate-600">{template.description}</p></div>
                <HrStatusBadge status={template.status} />
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <MiniDetail label="Category" value={template.category} />
                <MiniDetail label="Owner" value={template.owner} />
                <MiniDetail label="Updated" value={template.lastUpdated} />
              </div>
              {canManageDocuments && <Button className="mt-4" size="sm" variant="outline" onClick={() => setDialog('generate')}><FileText className="h-4 w-4" />Use template</Button>}
            </article>
          ))}
        </TabsContent>
        <TabsContent value="expiry" className="mt-4">
          <DataTable headers={['Employee', 'Document', 'File', 'Expiry', 'Status', 'Action']}>
            {expiryQueue.map((document) => (
              <tr key={document.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{document.employeeName}</td>
                <td className="px-4 py-3 text-slate-600">{document.documentType}</td>
                <td className="px-4 py-3 font-medium text-indigo-700">{document.fileName}</td>
                <td className="px-4 py-3 text-slate-600">{document.expiryDate || '-'}</td>
                <td className="px-4 py-3"><HrStatusBadge status={document.status} /></td>
                <td className="px-4 py-3">{canManageDocuments && document.status !== 'Expired' ? <Button size="sm" variant="outline" onClick={() => hr.updateEmployeeDocumentStatus(document.id, 'Expired')}>Mark expired</Button> : <span className="text-xs text-slate-500">Review</span>}</td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
      </Tabs>
      <Dialog open={Boolean(dialog)} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialog === 'generate' ? 'Generate document' : 'Upload document'}</DialogTitle>
            <DialogDescription>{dialog === 'generate' ? 'Create a static generated employee document from a template.' : 'Add a static uploaded employee file for verification.'}</DialogDescription>
          </DialogHeader>
          {dialog === 'upload' && <DocumentUploadForm employees={visibleEmployees} onSubmit={(draft) => { hr.createEmployeeDocument(draft); setDialog(null); }} />}
          {dialog === 'generate' && <DocumentGenerateForm employees={visibleEmployees} templates={hr.documentTemplates} onSubmit={(templateId, employeeId) => { hr.generateEmployeeDocument(templateId, employeeId); setDialog(null); }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DocumentActions: React.FC<{ document: EmployeeDocument; canManage: boolean; onDownload: (document: EmployeeDocument) => void; onStatus: (id: string, status: EmployeeDocument['status']) => void }> = ({ document, canManage, onDownload, onStatus }) => (
  <div className="flex min-w-60 flex-wrap items-center gap-2">
    <Button size="sm" variant="outline" onClick={() => onDownload(document)}><Download className="h-4 w-4" />Download</Button>
    {canManage ? (
      <select className={compactSelectClass} value={document.status} onChange={(event) => onStatus(document.id, event.target.value as EmployeeDocument['status'])}>
        {documentStatuses.map((status) => <option key={status}>{status}</option>)}
      </select>
    ) : <HrStatusBadge status={document.status} />}
  </div>
);

const DocumentRequestStatusSelect: React.FC<{ value: DocumentRequestStatus; onChange: (status: DocumentRequestStatus) => void }> = ({ value, onChange }) => (
  <select className={compactSelectClass} value={value} onChange={(event) => onChange(event.target.value as DocumentRequestStatus)}>
    {documentRequestStatuses.map((status) => <option key={status}>{status}</option>)}
  </select>
);

const DocumentUploadForm: React.FC<{ employees: Employee[]; onSubmit: (draft: EmployeeDocumentDraft) => void }> = ({ employees, onSubmit }) => {
  const [draft, setDraft] = useState<EmployeeDocumentDraft>({
    employeeId: employees[0]?.id || '',
    documentType: 'Address Proof',
    fileName: '',
    expiryDate: '',
  });
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...draft, expiryDate: draft.expiryDate || undefined });
      }}
    >
      <Field label="Employee">
        <select className={selectClass} value={draft.employeeId} onChange={(event) => setDraft({ ...draft, employeeId: event.target.value })}>
          {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
        </select>
      </Field>
      <Field label="Document type">
        <select className={selectClass} value={draft.documentType} onChange={(event) => setDraft({ ...draft, documentType: event.target.value })}>
          {['Address Proof', 'Bank Proof', 'PAN Card', 'Employment Contract', 'Certification', 'No Dues Declaration', 'Safety Certification Renewal'].map((type) => <option key={type}>{type}</option>)}
        </select>
      </Field>
      <Field label="File">
        <Input type="file" onChange={(event) => setDraft({ ...draft, fileName: event.target.files?.[0]?.name || draft.fileName })} />
      </Field>
      <Field label="Expiry date">
        <Input type="date" value={draft.expiryDate || ''} onChange={(event) => setDraft({ ...draft, expiryDate: event.target.value })} />
      </Field>
      <div className="rounded-sm border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 sm:col-span-2">
        <p className="font-medium text-slate-950">{draft.fileName || 'No file selected'}</p>
        <p className="mt-1">The selected file name will be added to the employee document register.</p>
      </div>
      <Button className="sm:col-span-2" type="submit" disabled={!draft.employeeId || !draft.fileName}><Upload className="h-4 w-4" />Add document</Button>
    </form>
  );
};

const DocumentGenerateForm: React.FC<{ employees: Employee[]; templates: DocumentTemplate[]; onSubmit: (templateId: string, employeeId: string) => void }> = ({ employees, templates, onSubmit }) => {
  const activeTemplates = templates.filter((template) => template.status === 'Active');
  const [templateId, setTemplateId] = useState(activeTemplates[0]?.id || templates[0]?.id || '');
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(templateId, employeeId);
      }}
    >
      <Field label="Template">
        <select className={selectClass} value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
          {templates.map((template) => <option key={template.id} value={template.id}>{template.name} - {template.status}</option>)}
        </select>
      </Field>
      <Field label="Employee">
        <select className={selectClass} value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
          {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
        </select>
      </Field>
      <Button type="submit" className="w-full" disabled={!templateId || !employeeId}><FilePlus2 className="h-4 w-4" />Generate document</Button>
    </form>
  );
};

const MiniDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 truncate font-medium text-slate-800">{value}</p>
  </div>
);

export const OnboardingPage: React.FC = () => {
  const hr = useHrData();
  const activeOnboarding = hr.onboardingTasks.filter((task) => task.status !== 'Completed');
  const probationEmployees = hr.employees.filter((employee) => employee.status === 'Probation');
  const pendingOffboarding = hr.offboardingItems.filter((item) => item.status !== 'Completed');
  return (
    <div>
      <PageHeader title="Onboarding & Lifecycle" description="New joiner tasks, probation confirmations, offboarding clearances, and lifecycle audit points." />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open onboarding" value={String(activeOnboarding.length)} icon={<ClipboardList className="h-4 w-4" />} />
        <StatCard label="Probation queue" value={String(probationEmployees.length)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Offboarding items" value={String(pendingOffboarding.length)} icon={<LogOut className="h-4 w-4" />} />
        <StatCard label="Lifecycle events" value={String(hr.lifecycleEvents.length)} />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Onboarding task board" icon={<ClipboardList className="h-4 w-4" />}>
          <DataTable headers={['Employee', 'Task', 'Owner', 'Due date', 'Status']}>
            {hr.onboardingTasks.map((task) => (
              <tr key={task.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{task.employeeName}</td>
                <td className="px-4 py-3 text-slate-600">{task.title}</td>
                <td className="px-4 py-3 text-slate-600">{task.owner}</td>
                <td className="px-4 py-3 text-slate-600">{task.dueDate}</td>
                <td className="px-4 py-3"><LifecycleStatusSelect value={task.status} onChange={(status) => hr.updateOnboardingTaskStatus(task.id, status)} /></td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <div className="grid min-w-0 gap-5">
          <Panel title="Probation confirmations" icon={<CheckCircle2 className="h-4 w-4" />}>
            <div className="space-y-3">
              {probationEmployees.length ? probationEmployees.map((employee) => (
                <article key={employee.id} className="rounded-sm border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div><h2 className="font-medium text-slate-950">{employee.name}</h2><p className="mt-1 text-xs text-slate-500">{employee.designation} | {employee.branchName || 'Unassigned'} | due {employee.probationEndDate || 'not set'}</p></div>
                    <HrStatusBadge status={employee.status} />
                  </div>
                  <Button className="mt-3 w-full" size="sm" variant="outline" onClick={() => hr.confirmProbation(employee.id)}><CheckCircle2 className="h-4 w-4" />Confirm probation</Button>
                </article>
              )) : <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No employees currently in probation.</div>}
            </div>
          </Panel>
          <Panel title="Offboarding clearance" icon={<LogOut className="h-4 w-4" />}>
            <DataTable headers={['Employee', 'Item', 'Due', 'Status']}>
              {hr.offboardingItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{item.employeeName}</td>
                  <td className="px-4 py-3 text-slate-600">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{item.dueDate}</td>
                  <td className="px-4 py-3"><LifecycleStatusSelect value={item.status} onChange={(status) => hr.updateOffboardingItemStatus(item.id, status)} /></td>
                </tr>
              ))}
            </DataTable>
          </Panel>
        </div>
      </section>
    </div>
  );
};

export const ShiftRosterPage: React.FC = () => {
  const hr = useHrData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const coverage = getShiftCoverage(hr);
  return (
    <div>
      <PageHeader title="Shifts & Roster" description="Shift groups, branch coverage, grace minutes, overtime eligibility, and employee roster preview." action={<Button onClick={() => setDialogOpen(true)}><PlusCircle className="h-4 w-4" />Add shift</Button>} />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Shift groups" value={String(hr.shiftGroups.length)} icon={<Clock3 className="h-4 w-4" />} />
        <StatCard label="Overtime eligible" value={String(hr.shiftGroups.filter((shift) => shift.overtimeEligible).length)} />
        <StatCard label="Active branches" value={String(hr.branches.filter((branch) => branch.status === 'Active').length)} />
        <StatCard label="Rostered employees" value={String(coverage.reduce((sum, item) => sum + item.assigned, 0))} />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0">
          <DataTable headers={['Shift group', 'Branch', 'Time', 'Grace', 'Working days', 'Overtime', 'Status']}>
            {hr.shiftGroups.map((shift) => (
              <tr key={shift.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{shift.name}</td>
                <td className="px-4 py-3 text-slate-600">{shift.branchName}</td>
                <td className="px-4 py-3 text-slate-600">{shift.startTime} - {shift.endTime}</td>
                <td className="px-4 py-3 text-slate-600">{shift.graceMinutes} min</td>
                <td className="px-4 py-3 text-slate-600">{shift.workingDays.join(', ')}</td>
                <td className="px-4 py-3 text-slate-600">{shift.overtimeEligible ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3"><HrStatusBadge status={shift.status} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div className="grid gap-3">
          {coverage.map(({ shift }, shiftIndex) => {
            const assigned = hr.employees.filter((employee, employeeIndex) => employee.shiftGroupId ? employee.shiftGroupId === shift.id : employeeIndex % hr.shiftGroups.length === shiftIndex);
            return (
              <article key={shift.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-slate-950">{shift.name}</h2><p className="mt-1 text-xs text-slate-500">{shift.branchName}</p></div><HrStatusBadge status={shift.status} /></div>
                <div className="mt-3 flex flex-wrap gap-1">{assigned.map((employee) => <span key={employee.id} className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{employee.name}</span>)}</div>
              </article>
            );
          })}
        </div>
      </section>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Add shift group</DialogTitle><DialogDescription>Create a shift with branch assignment, grace period, and overtime rules.</DialogDescription></DialogHeader><ShiftGroupForm branches={hr.branches} onSubmit={(draft) => { hr.createShiftGroup(draft); setDialogOpen(false); }} /></DialogContent></Dialog>
    </div>
  );
};

export const HrReportsPage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const visibleEmployees = hr.employees.filter((employee) => access.isEmployeeInScope(employee.id));
  const visibleEmployeeIds = access.scopedEmployeeIds;
  const visibleAttendance = hr.attendance.filter((entry) => visibleEmployeeIds.has(entry.employeeId));
  const visibleLeaveRequests = hr.leaveRequests.filter((leave) => visibleEmployeeIds.has(leave.employeeId));
  const headcount = hr.departments.map((department) => ({ name: department.name, count: visibleEmployees.filter((employee) => employee.department === department.name).length }));
  const branchHeadcount = hr.branches.map((branch) => ({ branch, count: visibleEmployees.filter((employee) => employee.branchId === branch.id).length }));
  const payrollCost = visibleEmployees.reduce((sum, employee) => sum + calculateEmployeeNet(employee), 0);
  const totalHours = visibleAttendance.reduce((sum, entry) => sum + entry.workHours, 0);
  const approvedLeave = visibleLeaveRequests.filter((leave) => leave.status === 'Approved').reduce((sum, leave) => sum + leave.days, 0);
  const exportReport = () => {
    if (!access.canExport) return;
    const rows = [
      ['Report', 'Metric', 'Value'],
      ['Attendance', 'June recorded hours', totalHours.toFixed(1)],
      ['Leave', 'Approved leave days', String(approvedLeave)],
      ['Branches', 'Active branches', String(hr.branches.filter((branch) => branch.status === 'Active').length)],
      ...(access.canViewSalary ? [['Payroll', 'Current monthly net', String(payrollCost)]] : []),
      ...headcount.map((department) => ['Headcount', department.name, String(department.count)]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hr-report-summary.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div>
      <PageHeader title="HR Reports" description="Attendance, leave, salary, branch, and policy reports for owner and HR review." action={<Button variant="outline" disabled={!access.canExport} onClick={exportReport}><Download className="h-4 w-4" />Export CSV</Button>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Attendance hours" value={totalHours.toFixed(1)} hint="June recorded hours" />
        <StatCard label="Approved leave days" value={String(approvedLeave)} />
        <StatCard label="Salary register" value={access.canViewSalary ? formatINR(payrollCost) : 'Restricted'} hint={access.canViewSalary ? 'Current monthly net' : access.activeRole} />
        <StatCard label="Active branches" value={String(hr.branches.filter((branch) => branch.status === 'Active').length)} />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ReportPanel title="Attendance summary">{visibleEmployees.map((employee) => { const entries = visibleAttendance.filter((entry) => entry.employeeId === employee.id); const present = entries.filter((entry) => ['Present', 'Late', 'Half Day'].includes(entry.status)).length; return <ReportBar key={employee.id} label={employee.name} value={`${present}/${entries.length}`} percent={(present / Math.max(entries.length, 1)) * 100} tone="bg-emerald-600" />; })}</ReportPanel>
        <ReportPanel title="Branch headcount">{branchHeadcount.map(({ branch, count }) => <ReportBar key={branch.id} label={branch.name} value={`${count} employees`} percent={(count / Math.max(visibleEmployees.length, 1)) * 100} tone="bg-cyan-600" />)}</ReportPanel>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ReportPanel title="Leave policy usage">{hr.leavePolicies.map((policy) => { const count = visibleLeaveRequests.filter((leave) => leave.leaveType === policy.name).reduce((sum, leave) => sum + leave.days, 0); return <ReportBar key={policy.id} label={policy.name} value={`${count} days`} percent={(count / Math.max(...visibleLeaveRequests.map((leave) => leave.days), 1)) * 100} tone="bg-violet-600" />; })}</ReportPanel>
        {access.canViewSalary ? <ReportPanel title="Salary register">{headcount.map((department) => { const total = visibleEmployees.filter((employee) => employee.department === department.name).reduce((sum, employee) => sum + calculateEmployeeNet(employee), 0); return <ReportBar key={department.name} label={department.name} value={formatINR(total)} percent={(total / Math.max(payrollCost, 1)) * 100} tone="bg-indigo-600" />; })}</ReportPanel> : <RestrictedReportPanel title="Salary register" role={access.activeRole} />}
      </section>
    </div>
  );
};

export const HrSettingsPage: React.FC = () => {
  const hr = useHrData();
  const [dialog, setDialog] = useState<SetupDialog>(null);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(hr.companyProfile);
  const [calendar, setCalendar] = useState<PayrollCalendar>(hr.payrollCalendar);
  const saveSettings = () => {
    hr.updateCompanyProfile(profile);
    hr.updatePayrollCalendar(calendar);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  return (
    <div>
      <PageHeader title="HR Settings" description="Company HR setup, branches, roles, permissions, policies, holidays, shifts, payroll calendar, and audit rules." action={<Button onClick={saveSettings}><Save className="h-4 w-4" />Save setup</Button>} />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Branches" value={String(hr.branches.length)} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Leave policies" value={String(hr.leavePolicies.length)} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Shift groups" value={String(hr.shiftGroups.length)} icon={<Clock3 className="h-4 w-4" />} />
        <StatCard label="Roles" value={String(hr.rolePermissions.length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Audit events" value={String(hr.auditLogs.length)} />
      </section>
      <Tabs defaultValue="company">
        <TabsList className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="policies">Leave Policies</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Calendar</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="company" className="mt-4"><CompanyPanel profile={profile} setProfile={setProfile} branches={hr.branches} /></TabsContent>
        <TabsContent value="branches" className="mt-4"><BranchPanel hr={hr} onAdd={() => setDialog('branch')} /></TabsContent>
        <TabsContent value="designations" className="mt-4"><DesignationPanel hr={hr} onAdd={() => setDialog('designation')} /></TabsContent>
        <TabsContent value="policies" className="mt-4"><LeavePolicyPanel hr={hr} onAdd={() => setDialog('policy')} /></TabsContent>
        <TabsContent value="holidays" className="mt-4"><HolidayPanel hr={hr} onAdd={() => setDialog('holiday')} /></TabsContent>
        <TabsContent value="permissions" className="mt-4"><PermissionsPanel hr={hr} /></TabsContent>
        <TabsContent value="payroll" className="mt-4"><PayrollPanel calendar={calendar} setCalendar={setCalendar} /></TabsContent>
        <TabsContent value="audit" className="mt-4"><AuditPanel hr={hr} /></TabsContent>
      </Tabs>
      <div className="mt-5 flex flex-wrap items-center gap-3"><Button variant="outline" onClick={hr.resetHrData}><RotateCcw className="h-4 w-4" />Reset demo data</Button>{saved && <span className="text-sm font-medium text-emerald-700">Setup saved</span>}</div>
      <Dialog open={Boolean(dialog)} onOpenChange={(open) => !open && setDialog(null)}><DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>{dialogTitle(dialog)}</DialogTitle><DialogDescription>Add a new HR setup record to the tenant demo workspace.</DialogDescription></DialogHeader>{dialog === 'branch' && <BranchForm onSubmit={(draft) => { hr.createBranch(draft); setDialog(null); }} />}{dialog === 'designation' && <DesignationForm onSubmit={(draft) => { hr.createDesignation(draft); setDialog(null); }} />}{dialog === 'policy' && <LeavePolicyForm onSubmit={(draft) => { hr.createLeavePolicy(draft); setDialog(null); }} />}{dialog === 'holiday' && <HolidayForm branches={hr.branches} onSubmit={(draft) => { hr.createHoliday(draft); setDialog(null); }} />}{dialog === 'shift' && <ShiftGroupForm branches={hr.branches} onSubmit={(draft) => { hr.createShiftGroup(draft); setDialog(null); }} />}</DialogContent></Dialog>
    </div>
  );
};

const CompanyPanel: React.FC<{ profile: ReturnType<typeof useHrData>['companyProfile']; setProfile: (profile: ReturnType<typeof useHrData>['companyProfile']) => void; branches: ReturnType<typeof useHrData>['branches'] }> = ({ profile, setProfile, branches }) => (
  <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
    <Field label="Legal name"><Input value={profile.legalName} onChange={(event) => setProfile({ ...profile, legalName: event.target.value })} /></Field>
    <Field label="Brand name"><Input value={profile.brandName} onChange={(event) => setProfile({ ...profile, brandName: event.target.value })} /></Field>
    <Field label="HR email"><Input type="email" value={profile.hrEmail} onChange={(event) => setProfile({ ...profile, hrEmail: event.target.value })} /></Field>
    <Field label="HR phone"><Input value={profile.hrPhone} onChange={(event) => setProfile({ ...profile, hrPhone: event.target.value })} /></Field>
    <Field label="Fiscal year"><Input value={profile.fiscalYearLabel} onChange={(event) => setProfile({ ...profile, fiscalYearLabel: event.target.value })} /></Field>
    <Field label="Payroll calendar"><Input value={profile.payrollCalendarName} onChange={(event) => setProfile({ ...profile, payrollCalendarName: event.target.value })} /></Field>
    <Field label="Default branch"><select className={selectClass} value={profile.defaultBranchId} onChange={(event) => setProfile({ ...profile, defaultBranchId: event.target.value })}>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></Field>
  </section>
);

const BranchPanel: React.FC<{ hr: ReturnType<typeof useHrData>; onAdd: () => void }> = ({ hr, onAdd }) => (
  <Panel title="Branches and sites" action={<Button size="sm" onClick={onAdd}><PlusCircle className="h-4 w-4" />Add branch</Button>}>
    <DataTable headers={['Branch', 'Code', 'City', 'Admin', 'Working days', 'Holiday calendar', 'Status']}>{hr.branches.map((branch) => <tr key={branch.id}><td className="px-4 py-3 font-medium text-slate-950">{branch.name}</td><td className="px-4 py-3 text-indigo-700">{branch.code}</td><td className="px-4 py-3 text-slate-600">{branch.city}</td><td className="px-4 py-3 text-slate-600">{branch.admin}</td><td className="px-4 py-3 text-slate-600">{branch.workingDays.join(', ')}</td><td className="px-4 py-3 text-slate-600">{branch.holidayCalendar}</td><td className="px-4 py-3"><HrStatusBadge status={branch.status} /></td></tr>)}</DataTable>
  </Panel>
);

const DesignationPanel: React.FC<{ hr: ReturnType<typeof useHrData>; onAdd: () => void }> = ({ hr, onAdd }) => (
  <Panel title="Departments and designations" action={<Button size="sm" onClick={onAdd}><PlusCircle className="h-4 w-4" />Add designation</Button>}>
    <DataTable headers={['Designation', 'Department', 'Level', 'Employment type', 'Status']}>{hr.designations.map((designation) => <tr key={designation.id}><td className="px-4 py-3 font-medium text-slate-950">{designation.title}</td><td className="px-4 py-3 text-slate-600">{designation.department}</td><td className="px-4 py-3 text-slate-600">{designation.level}</td><td className="px-4 py-3 text-slate-600">{designation.employmentType}</td><td className="px-4 py-3"><HrStatusBadge status={designation.status} /></td></tr>)}</DataTable>
  </Panel>
);

const LeavePolicyPanel: React.FC<{ hr: ReturnType<typeof useHrData>; onAdd: () => void }> = ({ hr, onAdd }) => (
  <Panel title="Leave policy setup" action={<Button size="sm" onClick={onAdd}><PlusCircle className="h-4 w-4" />Add policy</Button>}>
    <DataTable headers={['Code', 'Policy', 'Paid', 'Annual allowance', 'Carry forward', 'Encashment', 'Approval chain', 'Status']}>{hr.leavePolicies.map((policy) => <tr key={policy.id}><td className="px-4 py-3 font-medium text-indigo-700">{policy.code}</td><td className="px-4 py-3 font-medium text-slate-950">{policy.name}</td><td className="px-4 py-3 text-slate-600">{policy.paid ? 'Yes' : 'No'}</td><td className="px-4 py-3 text-slate-600">{policy.annualAllowance}</td><td className="px-4 py-3 text-slate-600">{policy.carryForward ? `${policy.maxCarryForward} days` : 'No'}</td><td className="px-4 py-3 text-slate-600">{policy.encashment ? 'Yes' : 'No'}</td><td className="px-4 py-3 text-slate-600">{policy.approvalChain}</td><td className="px-4 py-3"><HrStatusBadge status={policy.status} /></td></tr>)}</DataTable>
  </Panel>
);

const HolidayPanel: React.FC<{ hr: ReturnType<typeof useHrData>; onAdd: () => void }> = ({ hr, onAdd }) => (
  <Panel title="Holiday calendars" action={<Button size="sm" onClick={onAdd}><PlusCircle className="h-4 w-4" />Add holiday</Button>}>
    <DataTable headers={['Holiday', 'Date', 'Branch', 'Type', 'Status']}>{hr.holidays.map((holiday) => <tr key={holiday.id}><td className="px-4 py-3 font-medium text-slate-950">{holiday.name}</td><td className="px-4 py-3 text-slate-600">{holiday.date}</td><td className="px-4 py-3 text-slate-600">{holiday.branchName}</td><td className="px-4 py-3 text-slate-600">{holiday.type}</td><td className="px-4 py-3"><HrStatusBadge status={holiday.status} /></td></tr>)}</DataTable>
  </Panel>
);

const PermissionsPanel: React.FC<{ hr: ReturnType<typeof useHrData> }> = ({ hr }) => (
  <PermissionsPanelInner hr={hr} />
);

const PermissionsPanelInner: React.FC<{ hr: ReturnType<typeof useHrData> }> = ({ hr }) => {
  const access = useHrAccess();
  return (
    <Panel title="Role and permission matrix" icon={<ShieldCheck className="h-4 w-4" />}>
      <div className="mb-4 flex flex-col gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Active role: {access.activeRole}</p>
          <p className="mt-1 text-xs text-slate-500">{access.permission?.scope || 'No permission scope selected'}</p>
        </div>
        <select className={selectClass} value={access.activeRole} onChange={(event) => access.setActiveRole(event.target.value as typeof access.activeRole)} aria-label="Active HR role">
          {access.roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>
      <DataTable headers={['Role', 'Scope', 'Menu access', 'Salary', 'Leave approval', 'Edit attendance', 'Payroll', 'Export']}>{hr.rolePermissions.map((role) => <tr key={role.id} className={role.role === access.activeRole ? 'bg-indigo-50/60' : undefined}><td className="px-4 py-3 font-medium text-slate-950">{role.role}</td><td className="px-4 py-3 text-slate-600">{role.scope}</td><td className="max-w-72 px-4 py-3 text-slate-600">{role.menuAccess.join(', ')}</td>{(['canViewSalary', 'canApproveLeave', 'canEditAttendance', 'canRunPayroll', 'canExport'] as const).map((key) => <td key={key} className="px-4 py-3 text-center"><Checkbox checked={role[key]} onCheckedChange={() => hr.toggleRolePermission(role.id, key)} /></td>)}</tr>)}</DataTable>
    </Panel>
  );
};

const PayrollPanel: React.FC<{ calendar: PayrollCalendar; setCalendar: (calendar: PayrollCalendar) => void }> = ({ calendar, setCalendar }) => (
  <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
    <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
      <Field label="Fiscal year start"><Input type="date" value={calendar.fiscalYearStart} onChange={(event) => setCalendar({ ...calendar, fiscalYearStart: event.target.value })} /></Field>
      <Field label="Fiscal year end"><Input type="date" value={calendar.fiscalYearEnd} onChange={(event) => setCalendar({ ...calendar, fiscalYearEnd: event.target.value })} /></Field>
      <Field label="Salary day"><Input type="number" min="1" max="31" value={calendar.salaryDay} onChange={(event) => setCalendar({ ...calendar, salaryDay: Number(event.target.value) })} /></Field>
      <Field label="Payroll cutoff day"><Input type="number" min="1" max="31" value={calendar.payrollCutoffDay} onChange={(event) => setCalendar({ ...calendar, payrollCutoffDay: Number(event.target.value) })} /></Field>
      <Field label="Default salary basis"><select className={selectClass} value={calendar.defaultSalaryBasis} onChange={(event) => setCalendar({ ...calendar, defaultSalaryBasis: event.target.value as PayrollCalendar['defaultSalaryBasis'] })}>{['Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'].map((basis) => <option key={basis}>{basis}</option>)}</select></Field>
      <Label className="flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"><Switch checked={calendar.approvalRequired} onCheckedChange={(approvalRequired) => setCalendar({ ...calendar, approvalRequired })} />Payroll approval required</Label>
    </div>
    <aside className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2"><Banknote className="h-4 w-4 text-indigo-600" /><h2 className="font-semibold text-slate-950">Payment modes</h2></div>
      <div className="mt-4 space-y-2">{calendar.paymentModes.map((mode) => <div key={mode} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{mode}</div>)}</div>
    </aside>
  </section>
);

const AuditPanel: React.FC<{ hr: ReturnType<typeof useHrData> }> = ({ hr }) => (
  <Panel title="Audit logs" icon={<ShieldCheck className="h-4 w-4" />}>
    <DataTable headers={['Time', 'Actor', 'Action', 'Module', 'Target', 'Details']}>{hr.auditLogs.map((log) => <tr key={log.id}><td className="px-4 py-3 text-slate-600">{new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td><td className="px-4 py-3 font-medium text-slate-950">{log.actor}</td><td className="px-4 py-3 text-slate-600">{log.action}</td><td className="px-4 py-3 text-slate-600">{log.module}</td><td className="px-4 py-3 text-slate-600">{log.target}</td><td className="max-w-80 px-4 py-3 text-slate-600">{log.details}</td></tr>)}</DataTable>
  </Panel>
);

const ReportPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold text-slate-950">{title}</h2><div className="mt-4 space-y-3">{children}</div></div>;
const RestrictedReportPanel: React.FC<{ title: string; role: string }> = ({ title, role }) => <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-sm"><div className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-amber-700" /><h2 className="font-semibold">{title}</h2></div><p className="mt-3 text-sm text-amber-800">{role} cannot view salary amounts.</p></div>;
const ReportBar: React.FC<{ label: string; value: string; percent: number; tone: string }> = ({ label, value, percent, tone }) => <div><div className="flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{label}</span><span className="shrink-0 text-slate-500">{value}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.max(3, Math.min(100, percent))}%` }} /></div></div>;
const Panel: React.FC<{ title: string; action?: React.ReactNode; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, action, icon, children }) => <section className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2">{icon}<h2 className="truncate font-semibold text-slate-950">{title}</h2></div>{action}</div>{children}</section>;
const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>;
const LifecycleStatusSelect: React.FC<{ value: LifecycleTaskStatus; onChange: (status: LifecycleTaskStatus) => void }> = ({ value, onChange }) => <select className={compactSelectClass} value={value} onChange={(event) => onChange(event.target.value as LifecycleTaskStatus)}>{taskStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const calculateEmployeeNet = (employee: ReturnType<typeof useHrData>['employees'][number]) => employee.salary.basic + employee.salary.allowances - employee.salary.deductions - employee.salary.pf - employee.salary.esi;
const dialogTitle = (dialog: SetupDialog) => dialog === 'branch' ? 'Add branch' : dialog === 'designation' ? 'Add designation' : dialog === 'policy' ? 'Add leave policy' : dialog === 'holiday' ? 'Add holiday' : dialog === 'shift' ? 'Add shift group' : 'Add setup record';
