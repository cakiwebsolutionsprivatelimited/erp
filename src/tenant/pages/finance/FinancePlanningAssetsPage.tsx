import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

type PlanningView =
  | 'Budgets'
  | 'Project Accounting'
  | 'Payroll Journals'
  | 'Reimbursements'
  | 'Fixed Assets'
  | 'Depreciation'
  | 'Transfers & Disposals'
  | 'Asset Reports';

const views: PlanningView[] = [
  'Budgets',
  'Project Accounting',
  'Payroll Journals',
  'Reimbursements',
  'Fixed Assets',
  'Depreciation',
  'Transfers & Disposals',
  'Asset Reports',
];

const FinancePlanningAssetsPage: React.FC = () => {
  const finance = useFinanceData();
  const [view, setView] = useState<PlanningView>('Budgets');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const totalBudget = finance.budgets.reduce((sum, budget) => sum + budget.budgetAmount, 0);
  const committedAndActual = finance.budgets.reduce((sum, budget) => sum + budget.actualAmount + budget.committedAmount, 0);
  const budgetAlerts = finance.budgets.filter((budget) => ['Watch', 'Over Budget'].includes(budget.status)).length;
  const projectMargin = finance.projectAccounting.reduce((sum, project) => sum + project.margin, 0);
  const payrollQueue = finance.payrollJournals.filter((journal) => journal.status !== 'Posted').length;
  const reimbursementQueue = finance.reimbursements.filter((claim) => ['Submitted', 'Approved'].includes(claim.status)).length;
  const assetBookValue = finance.fixedAssets.reduce((sum, asset) => sum + asset.bookValue, 0);
  const depreciationOpen = finance.depreciationSchedules.filter((schedule) => schedule.status !== 'Posted').length;

  const budgets = useMemo(() => finance.budgets.filter((budget) =>
    matchesQuery([budget.name, budget.fiscalYear, budget.owner, budget.department, budget.status], query)
  ), [finance.budgets, query]);

  const projects = useMemo(() => finance.projectAccounting.filter((project) =>
    matchesQuery([project.projectCode, project.projectName, project.customer, project.manager, project.status], query)
  ), [finance.projectAccounting, query]);

  const payrollJournals = useMemo(() => finance.payrollJournals.filter((journal) =>
    matchesQuery([journal.journalNumber, journal.payrollPeriod, journal.postingDate, journal.status], query)
  ), [finance.payrollJournals, query]);

  const reimbursements = useMemo(() => finance.reimbursements.filter((claim) =>
    matchesQuery([claim.claimNumber, claim.employee, claim.department, claim.category, claim.status], query)
  ), [finance.reimbursements, query]);

  const fixedAssets = useMemo(() => finance.fixedAssets.filter((asset) =>
    matchesQuery([asset.assetTag, asset.name, asset.category, asset.location, asset.custodian, asset.status], query)
  ), [finance.fixedAssets, query]);

  const depreciationSchedules = useMemo(() => finance.depreciationSchedules.filter((schedule) =>
    matchesQuery([schedule.assetTag, schedule.assetName, schedule.period, schedule.method, schedule.status], query)
  ), [finance.depreciationSchedules, query]);

  const assetTransfers = useMemo(() => finance.assetTransfers.filter((transfer) =>
    matchesQuery([transfer.transferNumber, transfer.assetTag, transfer.assetName, transfer.fromLocation, transfer.toLocation, transfer.requestedBy, transfer.status], query)
  ), [finance.assetTransfers, query]);

  const assetDisposals = useMemo(() => finance.assetDisposals.filter((disposal) =>
    matchesQuery([disposal.disposalNumber, disposal.assetTag, disposal.assetName, disposal.reason, disposal.status], query)
  ), [finance.assetDisposals, query]);

  const assetReports = useMemo(() => finance.assetReports.filter((report) =>
    matchesQuery([report.name, report.category, report.period, report.metric, report.owner, report.status], query)
  ), [finance.assetReports, query]);

  return (
    <div>
      <PageHeader
        title="Planning & Assets"
        description="Static budget controls, project profitability, payroll accounting, reimbursements, asset register, depreciation, transfers, disposals, and asset reports."
        action={<Button variant="outline">Create planning snapshot</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="FY budget" value={formatINR(totalBudget)} hint="Approved plan" />
        <StatCard label="Used + committed" value={formatINR(committedAndActual)} hint="Budget consumption" />
        <StatCard label="Budget alerts" value={String(budgetAlerts)} hint="Watch/over budget" />
        <StatCard label="Project margin" value={formatINR(projectMargin)} hint="Profitability preview" />
        <StatCard label="Payroll queue" value={String(payrollQueue)} hint={`${reimbursementQueue} reimbursement claims queued`} />
        <StatCard label="Asset book value" value={formatINR(assetBookValue)} hint={`${depreciationOpen} depreciation items open`} />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search budgets, projects, payroll, reimbursements, assets..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Budgets' && (
        <DataTable headers={['Budget', 'Department', 'Owner', 'FY', 'Approved', 'Actual', 'Committed', 'Variance', 'Used', 'Status']}>
          {budgets.map((budget) => (
            <tr key={budget.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{budget.name}</td>
              <td className="px-4 py-3 text-slate-600">{budget.department}</td>
              <td className="px-4 py-3 text-slate-600">{budget.owner}</td>
              <td className="px-4 py-3 text-slate-600">{budget.fiscalYear}</td>
              <td className="px-4 py-3"><AmountDisplay value={budget.budgetAmount} /></td>
              <td className="px-4 py-3"><AmountDisplay value={budget.actualAmount} /></td>
              <td className="px-4 py-3"><AmountDisplay value={budget.committedAmount} tone="warning" /></td>
              <td className="px-4 py-3"><AmountDisplay value={budget.variance} tone={budget.variance < 0 ? 'danger' : 'success'} /></td>
              <td className="px-4 py-3"><BudgetProgress budget={budget.budgetAmount} used={budget.actualAmount + budget.committedAmount} /></td>
              <td className="px-4 py-3"><StatusPill value={budget.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Project Accounting' && (
        <DataTable headers={['Project', 'Customer', 'Manager', 'Budget', 'Revenue', 'Cost', 'Billed', 'Unbilled', 'Margin', 'Status']}>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-indigo-700">{project.projectCode}</p>
                <p className="text-sm text-slate-600">{project.projectName}</p>
              </td>
              <td className="px-4 py-3 font-medium text-slate-950">{project.customer}</td>
              <td className="px-4 py-3 text-slate-600">{project.manager}</td>
              <td className="px-4 py-3"><AmountDisplay value={project.budget} /></td>
              <td className="px-4 py-3"><AmountDisplay value={project.revenue} tone="success" /></td>
              <td className="px-4 py-3"><AmountDisplay value={project.cost} tone="warning" /></td>
              <td className="px-4 py-3"><AmountDisplay value={project.billed} /></td>
              <td className="px-4 py-3"><AmountDisplay value={project.unbilled} tone={project.unbilled ? 'warning' : 'success'} /></td>
              <td className="px-4 py-3"><AmountDisplay value={project.margin} tone={project.margin < 0 ? 'danger' : 'success'} /></td>
              <td className="px-4 py-3"><StatusPill value={project.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Payroll Journals' && (
        <DataTable headers={['Journal', 'Period', 'Employees', 'Gross pay', 'Deductions', 'Employer cost', 'Net pay', 'Posting date', 'Status']}>
          {payrollJournals.map((journal) => (
            <tr key={journal.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{journal.journalNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{journal.payrollPeriod}</td>
              <td className="px-4 py-3 text-slate-600">{journal.employeeCount}</td>
              <td className="px-4 py-3"><AmountDisplay value={journal.grossPay} /></td>
              <td className="px-4 py-3"><AmountDisplay value={journal.deductions} tone="warning" /></td>
              <td className="px-4 py-3"><AmountDisplay value={journal.employerContribution} /></td>
              <td className="px-4 py-3"><AmountDisplay value={journal.netPay} tone="success" /></td>
              <td className="px-4 py-3 text-slate-600">{journal.postingDate}</td>
              <td className="px-4 py-3"><StatusPill value={journal.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Reimbursements' && (
        <DataTable headers={['Claim', 'Employee', 'Department', 'Submitted', 'Category', 'Claimed', 'Approved', 'Paid date', 'Status']}>
          {reimbursements.map((claim) => (
            <tr key={claim.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{claim.claimNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{claim.employee}</td>
              <td className="px-4 py-3 text-slate-600">{claim.department}</td>
              <td className="px-4 py-3 text-slate-600">{claim.submittedDate}</td>
              <td className="px-4 py-3 text-slate-600">{claim.category}</td>
              <td className="px-4 py-3"><AmountDisplay value={claim.amount} /></td>
              <td className="px-4 py-3"><AmountDisplay value={claim.approvedAmount} tone={claim.approvedAmount ? 'success' : 'warning'} /></td>
              <td className="px-4 py-3 text-slate-600">{claim.paidDate}</td>
              <td className="px-4 py-3"><StatusPill value={claim.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Fixed Assets' && (
        <DataTable headers={['Asset', 'Category', 'Location', 'Custodian', 'Acquired', 'Cost', 'Accum. dep.', 'Book value', 'Status']}>
          {fixedAssets.map((asset) => (
            <tr key={asset.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-indigo-700">{asset.assetTag}</p>
                <p className="text-sm text-slate-600">{asset.name}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{asset.category}</td>
              <td className="px-4 py-3 text-slate-600">{asset.location}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{asset.custodian}</td>
              <td className="px-4 py-3 text-slate-600">{asset.acquisitionDate}</td>
              <td className="px-4 py-3"><AmountDisplay value={asset.acquisitionCost} /></td>
              <td className="px-4 py-3"><AmountDisplay value={asset.accumulatedDepreciation} tone="warning" /></td>
              <td className="px-4 py-3"><AmountDisplay value={asset.bookValue} tone={asset.bookValue ? 'success' : 'default'} /></td>
              <td className="px-4 py-3"><StatusPill value={asset.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Depreciation' && (
        <DataTable headers={['Asset', 'Period', 'Method', 'Depreciation', 'Accum. dep.', 'Book value after', 'Status']}>
          {depreciationSchedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-indigo-700">{schedule.assetTag}</p>
                <p className="text-sm text-slate-600">{schedule.assetName}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{schedule.period}</td>
              <td className="px-4 py-3 text-slate-600">{schedule.method}</td>
              <td className="px-4 py-3"><AmountDisplay value={schedule.depreciationAmount} /></td>
              <td className="px-4 py-3"><AmountDisplay value={schedule.accumulatedDepreciation} tone="warning" /></td>
              <td className="px-4 py-3"><AmountDisplay value={schedule.bookValueAfter} tone="success" /></td>
              <td className="px-4 py-3"><StatusPill value={schedule.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Transfers & Disposals' && (
        <section className="grid gap-5 xl:grid-cols-2">
          <div>
            <h2 className="mb-3 font-semibold text-slate-950">Asset transfers</h2>
            <DataTable headers={['Transfer', 'Asset', 'From', 'To', 'Requested by', 'Date', 'Status']}>
              {assetTransfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td className="px-4 py-3 font-medium text-indigo-700">{transfer.transferNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-950">{transfer.assetTag}</p>
                    <p className="text-sm text-slate-600">{transfer.assetName}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{transfer.fromLocation}</td>
                  <td className="px-4 py-3 text-slate-600">{transfer.toLocation}</td>
                  <td className="px-4 py-3 text-slate-600">{transfer.requestedBy}</td>
                  <td className="px-4 py-3 text-slate-600">{transfer.transferDate}</td>
                  <td className="px-4 py-3"><StatusPill value={transfer.status} /></td>
                </tr>
              ))}
            </DataTable>
          </div>

          <div>
            <h2 className="mb-3 font-semibold text-slate-950">Asset disposals</h2>
            <DataTable headers={['Disposal', 'Asset', 'Date', 'Book value', 'Proceeds', 'Gain/Loss', 'Status', 'Reason']}>
              {assetDisposals.map((disposal) => (
                <tr key={disposal.id}>
                  <td className="px-4 py-3 font-medium text-indigo-700">{disposal.disposalNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-950">{disposal.assetTag}</p>
                    <p className="text-sm text-slate-600">{disposal.assetName}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{disposal.disposalDate}</td>
                  <td className="px-4 py-3"><AmountDisplay value={disposal.bookValue} /></td>
                  <td className="px-4 py-3"><AmountDisplay value={disposal.proceeds} tone="success" /></td>
                  <td className="px-4 py-3"><AmountDisplay value={disposal.gainLoss} tone={disposal.gainLoss < 0 ? 'danger' : 'success'} /></td>
                  <td className="px-4 py-3"><StatusPill value={disposal.status} /></td>
                  <td className="px-4 py-3 text-slate-600">{disposal.reason}</td>
                </tr>
              ))}
            </DataTable>
          </div>
        </section>
      )}

      {view === 'Asset Reports' && (
        <DataTable headers={['Report', 'Category', 'Period', 'Metric', 'Owner', 'Status']}>
          {assetReports.map((report) => (
            <tr key={report.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{report.name}</td>
              <td className="px-4 py-3 text-slate-600">{report.category}</td>
              <td className="px-4 py-3 text-slate-600">{report.period}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{report.metric}</td>
              <td className="px-4 py-3 text-slate-600">{report.owner}</td>
              <td className="px-4 py-3"><StatusPill value={report.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const matchesQuery = (values: Array<string | number>, query: string) =>
  !query || values.join(' ').toLowerCase().includes(query);

const BudgetProgress: React.FC<{ budget: number; used: number }> = ({ budget, used }) => {
  const percent = budget > 0 ? Math.min(120, Math.round((used / budget) * 100)) : 0;
  const tone = percent > 100 ? 'bg-red-500' : percent > 85 ? 'bg-amber-500' : 'bg-emerald-600';

  return (
    <div className="min-w-[120px]">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{percent}%</span>
        <span>{formatINR(used)}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const tone = ['On Track', 'Active', 'Completed', 'Posted', 'Paid', 'In Use', 'Ready'].includes(value)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : ['Watch', 'Draft', 'Submitted', 'Scheduled', 'Requested', 'Approved', 'Under Maintenance', 'Paused'].includes(value)
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : ['Over Budget', 'At Risk', 'Rejected', 'Skipped', 'Reversed'].includes(value)
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return <Badge className={`border ${tone}`}>{value}</Badge>;
};

export default FinancePlanningAssetsPage;
