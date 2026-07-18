import React, { useState } from 'react';
import { Banknote, Download, Eye, FileCheck2, FilePlus2, LockKeyhole, PlusCircle, ReceiptText, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, StatCard, formatINR } from '@/tenant/components/TenantUI';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { calculateNetSalary } from '@/tenant/hr/hrDemoService';
import type { AdvanceSalary, PayrollAdjustmentStatus, PayrollRunStatus, SalaryComponentDraft, SalaryComponentType, SalaryRelease, SalarySlip } from '@/tenant/hr/types';

const selectClass = 'mt-1.5 h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';
const compactSelectClass = 'flex h-9 w-full min-w-32 rounded-sm border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';
const runStatuses: PayrollRunStatus[] = ['Draft', 'Reviewed', 'Approved', 'Released', 'Locked'];
const paymentModes: SalaryRelease['mode'][] = ['Bank Transfer', 'Cash', 'Net Banking', 'UPI'];
const componentTypes: SalaryComponentType[] = ['Earning', 'Deduction', 'Statutory'];
const advanceStatuses: AdvanceSalary['status'][] = ['Pending', 'Approved', 'Recovered'];
const adjustmentStatuses: PayrollAdjustmentStatus[] = ['Pending Approval', 'Approved', 'Processed', 'Rejected'];

const PayrollPage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const visibleEmployeeIds = access.scopedEmployeeIds;
  const visibleEmployees = hr.employees.filter((employee) => visibleEmployeeIds.has(employee.id));
  const visibleSalarySlips = hr.salarySlips.filter((slip) => visibleEmployeeIds.has(slip.employeeId));
  const visibleReleases = hr.salaryReleases.filter((release) => visibleEmployeeIds.has(release.employeeId));
  const visibleAdvances = hr.advances.filter((advance) => visibleEmployeeIds.has(advance.employeeId));
  const visibleAdjustments = hr.payrollAdjustments.filter((adjustment) => visibleEmployeeIds.has(adjustment.employeeId));
  const visibleComponents = hr.salaryComponents.filter((component) => visibleEmployeeIds.has(component.employeeId));
  const [slipDialogOpen, setSlipDialogOpen] = useState(false);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [previewSlip, setPreviewSlip] = useState<SalarySlip | null>(null);
  const [employeeId, setEmployeeId] = useState(visibleEmployees[0]?.id || hr.employees[0]?.id || '');
  const [month, setMonth] = useState('2026-06');
  const [releaseModes, setReleaseModes] = useState<Record<string, SalaryRelease['mode']>>({});
  const totalPayroll = visibleEmployees.reduce((sum, employee) => sum + calculateNetSalary(employee), 0);
  const currentRun = hr.payrollRuns.find((run) => run.month === '2026-06');
  const unreleased = visibleSalarySlips.filter((slip) => slip.paymentStatus !== 'Paid').length;
  const pendingAdjustments = visibleAdjustments.filter((adjustment) => adjustment.status === 'Pending Approval').length;
  const formatSensitive = (value: number) => access.canViewSalary ? formatINR(value) : 'Restricted';
  const updateReleaseMode = (slipId: string, mode: SalaryRelease['mode']) => setReleaseModes((current) => ({ ...current, [slipId]: mode }));
  const downloadPayslip = (slip: SalarySlip) => {
    const rows = [
      `Payslip: ${slip.slipNumber}`,
      `Employee: ${slip.employeeName}`,
      `Month: ${slip.month}`,
      `Basic: ${formatSensitive(slip.basic)}`,
      `Allowances: ${formatSensitive(slip.allowances)}`,
      `Deductions: ${formatSensitive(slip.deductions + slip.pf + slip.esi)}`,
      `Net salary: ${formatSensitive(slip.netSalary)}`,
      `Status: ${slip.paymentStatus}`,
    ];
    const url = window.URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/plain;charset=utf-8' }));
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = `${slip.slipNumber.toLowerCase()}-summary.txt`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Payroll"
        description="Salary structures, payroll run approvals, payslips, salary release register, advances, and payroll adjustments."
        action={access.canRunPayroll ? <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setComponentDialogOpen(true)}><PlusCircle className="h-4 w-4" />Add component</Button><Button onClick={() => setSlipDialogOpen(true)}><FilePlus2 className="h-4 w-4" />Generate salary slip</Button></div> : undefined}
      />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly payroll" value={formatSensitive(totalPayroll)} icon={<WalletCards className="h-4 w-4" />} />
        <StatCard label="June run" value={currentRun?.status || 'Not started'} icon={<Banknote className="h-4 w-4" />} />
        <StatCard label="Unreleased slips" value={String(unreleased)} icon={<FileCheck2 className="h-4 w-4" />} />
        <StatCard label="Pending adjustments" value={String(pendingAdjustments)} icon={<ReceiptText className="h-4 w-4" />} />
      </section>
      <Tabs defaultValue="runs">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
          <TabsTrigger value="structures">Salary Structures</TabsTrigger>
          <TabsTrigger value="slips">Salary Slips</TabsTrigger>
          <TabsTrigger value="release">Release Register</TabsTrigger>
          <TabsTrigger value="advance">Advances</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
        </TabsList>
        <TabsContent value="runs" className="mt-4">
          <section className="mb-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700"><Banknote className="h-5 w-5" /></span>
                <div>
                  <h2 className="font-semibold text-slate-950">June 2026 payroll</h2>
                  <p className="text-sm text-slate-500">{hr.salarySlips.filter((slip) => slip.month === '2026-06').length} of {hr.employees.length} salary slips processed</p>
                </div>
              </div>
              <Button disabled={!access.canRunPayroll} onClick={() => hr.processPayroll('2026-06')}>Process all employees</Button>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${(hr.salarySlips.filter((slip) => slip.month === '2026-06').length / Math.max(hr.employees.length, 1)) * 100}%` }} /></div>
          </section>
          <DataTable headers={['Month', 'Employees', 'Gross', 'Deductions', 'Net', 'Prepared by', 'Status', 'Locked']}>
            {hr.payrollRuns.map((run) => <tr key={run.id}><td className="px-4 py-3 font-medium text-indigo-700">{run.month}</td><td className="px-4 py-3 text-slate-600">{run.employeeCount}</td><td className="px-4 py-3 text-slate-600">{formatSensitive(run.grossAmount)}</td><td className="px-4 py-3 text-slate-600">{formatSensitive(run.deductionAmount)}</td><td className="px-4 py-3 font-semibold text-slate-950">{formatSensitive(run.netAmount)}</td><td className="px-4 py-3 text-slate-600">{run.preparedBy}</td><td className="px-4 py-3"><RunStatusSelect value={run.status} disabled={run.locked || !access.canRunPayroll} onChange={(status) => hr.updatePayrollRunStatus(run.id, status)} /></td><td className="px-4 py-3">{run.locked ? <LockKeyhole className="h-4 w-4 text-slate-500" /> : <span className="text-xs text-slate-500">{access.canRunPayroll ? 'Editable' : 'View only'}</span>}</td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="structures" className="mt-4">
          <section className="mb-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Components" value={String(visibleComponents.length)} />
            <StatCard label="Earnings" value={String(visibleComponents.filter((component) => component.type === 'Earning').length)} />
            <StatCard label="Statutory rows" value={String(visibleComponents.filter((component) => component.type === 'Statutory').length)} />
          </section>
          <DataTable headers={['Employee', 'Component', 'Type', 'Amount', 'Taxable', 'Formula']}>
            {visibleComponents.map((component) => <tr key={component.id}><td className="px-4 py-3 font-medium text-slate-950">{component.employeeName}</td><td className="px-4 py-3 text-slate-600">{component.name}</td><td className="px-4 py-3"><HrStatusBadge status={component.type === 'Earning' ? 'Processed' : component.type === 'Deduction' ? 'Pending' : 'Verified'} /></td><td className="px-4 py-3 font-medium text-slate-950">{formatSensitive(component.amount)}</td><td className="px-4 py-3 text-slate-600">{component.taxable ? 'Yes' : 'No'}</td><td className="px-4 py-3 text-slate-600">{component.formula || 'Fixed amount'}</td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="slips" className="mt-4">
          <DataTable headers={['Slip number', 'Employee', 'Month', 'Gross', 'Deductions', 'Net salary', 'Status', 'Actions']}>
            {visibleSalarySlips.map((slip) => (
              <tr key={slip.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{slip.slipNumber}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{slip.employeeName}</td>
                <td className="px-4 py-3 text-slate-600">{slip.month}</td>
                <td className="px-4 py-3">{formatSensitive(slip.basic + slip.allowances)}</td>
                <td className="px-4 py-3">{formatSensitive(slip.deductions + slip.pf + slip.esi)}</td>
                <td className="px-4 py-3 font-semibold">{formatSensitive(slip.netSalary)}</td>
                <td className="px-4 py-3"><HrStatusBadge status={slip.paymentStatus} /></td>
                <td className="px-4 py-3">
                  <div className="flex min-w-80 flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setPreviewSlip(slip)}><Eye className="h-4 w-4" />Preview</Button>
                    <Button size="sm" variant="outline" onClick={() => downloadPayslip(slip)}><Download className="h-4 w-4" />Download</Button>
                    {slip.paymentStatus === 'Paid' ? <span className="rounded-sm bg-emerald-50 px-2 py-1.5 text-xs font-medium text-emerald-700">Released</span> : access.canRunPayroll ? <div className="flex min-w-64 gap-2"><select className={compactSelectClass} value={releaseModes[slip.id] || 'Bank Transfer'} onChange={(event) => updateReleaseMode(slip.id, event.target.value as SalaryRelease['mode'])}>{paymentModes.map((mode) => <option key={mode}>{mode}</option>)}</select><Button size="sm" variant="outline" onClick={() => hr.releaseSalarySlip(slip.id, releaseModes[slip.id] || 'Bank Transfer')}>Release</Button></div> : <span className="text-xs text-slate-500">No release access</span>}
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="release" className="mt-4">
          <DataTable headers={['Employee', 'Month', 'Amount', 'Mode', 'Reference', 'Release date', 'Status']}>
            {visibleReleases.map((release) => <tr key={release.id}><td className="px-4 py-3 font-medium text-slate-950">{release.employeeName}</td><td className="px-4 py-3 text-slate-600">{release.month}</td><td className="px-4 py-3 font-semibold text-slate-950">{formatSensitive(release.amount)}</td><td className="px-4 py-3 text-slate-600">{release.mode}</td><td className="px-4 py-3 font-medium text-indigo-700">{release.reference}</td><td className="px-4 py-3 text-slate-600">{release.releaseDate || '-'}</td><td className="px-4 py-3"><HrStatusBadge status={release.status} /></td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="advance" className="mt-4">
          <DataTable headers={['Employee', 'Amount', 'Request date', 'Status']}>
            {visibleAdvances.map((advance) => <tr key={advance.id}><td className="px-4 py-3 font-medium text-slate-950">{advance.employeeName}</td><td className="px-4 py-3">{formatSensitive(advance.amount)}</td><td className="px-4 py-3 text-slate-600">{advance.requestDate}</td><td className="px-4 py-3">{access.canRunPayroll ? <AdvanceStatusSelect value={advance.status} onChange={(status) => hr.updateAdvanceStatus(advance.id, status)} /> : <HrStatusBadge status={advance.status} />}</td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="adjustments" className="mt-4">
          <DataTable headers={['Employee', 'Type', 'Month', 'Amount', 'Reason', 'Requested by', 'Created', 'Status']}>
            {visibleAdjustments.map((adjustment) => <tr key={adjustment.id}><td className="px-4 py-3 font-medium text-slate-950">{adjustment.employeeName}</td><td className="px-4 py-3 text-slate-600">{adjustment.type}</td><td className="px-4 py-3 text-slate-600">{adjustment.month}</td><td className="px-4 py-3 font-semibold text-slate-950">{formatSensitive(adjustment.amount)}</td><td className="max-w-80 px-4 py-3 text-slate-600">{adjustment.reason}</td><td className="px-4 py-3 text-slate-600">{adjustment.requestedBy}</td><td className="px-4 py-3 text-slate-600">{adjustment.createdDate}</td><td className="px-4 py-3">{access.canRunPayroll ? <PayrollAdjustmentStatusSelect value={adjustment.status} onChange={(status) => hr.updatePayrollAdjustmentStatus(adjustment.id, status)} /> : <HrStatusBadge status={adjustment.status} />}</td></tr>)}
          </DataTable>
        </TabsContent>
      </Tabs>
      <Dialog open={slipDialogOpen} onOpenChange={setSlipDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate salary slip</DialogTitle><DialogDescription>Process one employee for a payroll month.</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); hr.generateSalarySlip(employeeId, month); setSlipDialogOpen(false); }}>
            <Label className="block">Employee<select className={selectClass} value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>{hr.employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></Label>
            <Label className="block">Payroll month<input className={selectClass} type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></Label>
            <Button type="submit" className="w-full">Generate salary slip</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={componentDialogOpen} onOpenChange={setComponentDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Add salary component</DialogTitle><DialogDescription>Add a payroll component to an employee salary structure.</DialogDescription></DialogHeader>
          <SalaryComponentForm employees={hr.employees} onSubmit={(draft) => { hr.createSalaryComponent(draft); setComponentDialogOpen(false); }} />
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(previewSlip)} onOpenChange={(open) => !open && setPreviewSlip(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Payslip preview</DialogTitle><DialogDescription>{previewSlip?.slipNumber || 'Salary slip'}</DialogDescription></DialogHeader>
          {previewSlip && <PayslipPreview slip={previewSlip} formatSensitive={formatSensitive} onDownload={downloadPayslip} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RunStatusSelect: React.FC<{ value: PayrollRunStatus; disabled: boolean; onChange: (status: PayrollRunStatus) => void }> = ({ value, disabled, onChange }) => <select className={compactSelectClass} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as PayrollRunStatus)}>{runStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const AdvanceStatusSelect: React.FC<{ value: AdvanceSalary['status']; onChange: (status: AdvanceSalary['status']) => void }> = ({ value, onChange }) => <select className={compactSelectClass} value={value} onChange={(event) => onChange(event.target.value as AdvanceSalary['status'])}>{advanceStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const PayrollAdjustmentStatusSelect: React.FC<{ value: PayrollAdjustmentStatus; onChange: (status: PayrollAdjustmentStatus) => void }> = ({ value, onChange }) => <select className={compactSelectClass} value={value} onChange={(event) => onChange(event.target.value as PayrollAdjustmentStatus)}>{adjustmentStatuses.map((status) => <option key={status}>{status}</option>)}</select>;

const SalaryComponentForm: React.FC<{ employees: ReturnType<typeof useHrData>['employees']; onSubmit: (draft: SalaryComponentDraft) => void }> = ({ employees, onSubmit }) => {
  const [draft, setDraft] = useState<SalaryComponentDraft>({
    employeeId: employees[0]?.id || '',
    name: 'Special Allowance',
    type: 'Earning',
    amount: 0,
    taxable: true,
    formula: '',
  });
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...draft, amount: Number(draft.amount), formula: draft.formula || undefined }); }}>
      <Field label="Employee"><select className={selectClass} value={draft.employeeId} onChange={(event) => setDraft({ ...draft, employeeId: event.target.value })}>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></Field>
      <Field label="Component name"><Input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field>
      <Field label="Type"><select className={selectClass} value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as SalaryComponentType })}>{componentTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
      <Field label="Amount"><Input type="number" min="0" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: Number(event.target.value) })} /></Field>
      <Field label="Formula" className="sm:col-span-2"><Input value={draft.formula || ''} onChange={(event) => setDraft({ ...draft, formula: event.target.value })} /></Field>
      <Label className="flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 sm:col-span-2"><Checkbox checked={draft.taxable} onCheckedChange={(checked) => setDraft({ ...draft, taxable: Boolean(checked) })} />Taxable component</Label>
      <Button className="sm:col-span-2" type="submit" disabled={!draft.employeeId || !draft.name}><PlusCircle className="h-4 w-4" />Add component</Button>
    </form>
  );
};

const PayslipPreview: React.FC<{ slip: SalarySlip; formatSensitive: (value: number) => string; onDownload: (slip: SalarySlip) => void }> = ({ slip, formatSensitive, onDownload }) => (
  <section className="space-y-4">
    <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div><p className="text-sm font-semibold text-slate-950">{slip.employeeName}</p><p className="mt-1 text-xs text-slate-500">{slip.month} | Generated {slip.generatedDate}</p></div>
      <HrStatusBadge status={slip.paymentStatus} />
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <PayslipLine label="Basic" value={formatSensitive(slip.basic)} />
      <PayslipLine label="Allowances" value={formatSensitive(slip.allowances)} />
      <PayslipLine label="Other deductions" value={formatSensitive(slip.deductions)} />
      <PayslipLine label="Provident fund" value={formatSensitive(slip.pf)} />
      <PayslipLine label="ESI" value={formatSensitive(slip.esi)} />
      <PayslipLine label="Net salary" value={formatSensitive(slip.netSalary)} strong />
    </div>
    <Button className="w-full" onClick={() => onDownload(slip)}><Download className="h-4 w-4" />Download summary</Button>
  </section>
);

const PayslipLine: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="rounded-sm border border-slate-200 bg-white p-3">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className={`mt-1 ${strong ? 'text-lg font-semibold text-slate-950' : 'font-medium text-slate-800'}`}>{value}</p>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>;

export default PayrollPage;
