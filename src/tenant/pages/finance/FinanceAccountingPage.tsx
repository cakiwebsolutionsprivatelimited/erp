import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';
import type { FinanceJournalEntry } from '@/tenant/finance/types';

type AccountingView = 'Chart of Accounts' | 'General Ledger' | 'Journal Entries' | 'Periods & Locks' | 'Cost Centers' | 'Audit Trail';

const views: AccountingView[] = ['Chart of Accounts', 'General Ledger', 'Journal Entries', 'Periods & Locks', 'Cost Centers', 'Audit Trail'];

const FinanceAccountingPage: React.FC = () => {
  const finance = useFinanceData();
  const [view, setView] = useState<AccountingView>('Chart of Accounts');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const postedJournals = finance.journalEntries.filter((entry) => entry.status === 'Posted');
  const draftJournals = finance.journalEntries.filter((entry) => entry.status === 'Draft');
  const assetBalance = finance.chartAccounts.filter((account) => account.type === 'Asset').reduce((sum, account) => sum + account.balance, 0);
  const liabilityBalance = finance.chartAccounts.filter((account) => account.type === 'Liability').reduce((sum, account) => sum + account.balance, 0);
  const openPeriods = finance.fiscalPeriods.filter((period) => period.status === 'Open');
  const criticalAuditEvents = finance.auditTrail.filter((event) => event.severity === 'Critical');

  const accounts = useMemo(() => finance.chartAccounts.filter((account) =>
    !query || [account.code, account.name, account.type, account.group, account.linkedModule, account.status].join(' ').toLowerCase().includes(query)
  ), [finance.chartAccounts, query]);

  const ledgerLines = useMemo(() => finance.journalEntries.flatMap((entry) =>
    entry.lines.map((line) => ({
      ...line,
      entryNumber: entry.number,
      entryDate: entry.date,
      entryStatus: entry.status,
      source: entry.source,
    }))
  ).filter((line) =>
    !query || [line.accountCode, line.accountName, line.entryNumber, line.source, line.costCenter, line.narration, line.entryStatus].join(' ').toLowerCase().includes(query)
  ), [finance.journalEntries, query]);

  const journals = useMemo(() => finance.journalEntries.filter((entry) =>
    !query || [entry.number, entry.date, entry.source, entry.reference, entry.description, entry.status, entry.postedBy].join(' ').toLowerCase().includes(query)
  ), [finance.journalEntries, query]);

  const periods = useMemo(() => finance.fiscalPeriods.filter((period) =>
    !query || [period.name, period.fiscalYear, period.status, period.lockedModules.join(' '), period.closeChecklist.join(' ')].join(' ').toLowerCase().includes(query)
  ), [finance.fiscalPeriods, query]);

  const locks = useMemo(() => finance.transactionLocks.filter((lock) =>
    !query || [lock.scope, lock.module, lock.status, lock.owner, lock.reason].join(' ').toLowerCase().includes(query)
  ), [finance.transactionLocks, query]);

  const costCenters = useMemo(() => finance.costCenters.filter((center) =>
    !query || [center.code, center.name, center.owner, center.status].join(' ').toLowerCase().includes(query)
  ), [finance.costCenters, query]);

  const auditTrail = useMemo(() => finance.auditTrail.filter((event) =>
    !query || [event.actor, event.action, event.recordType, event.recordName, event.severity, event.ipAddress].join(' ').toLowerCase().includes(query)
  ), [finance.auditTrail, query]);

  return (
    <div>
      <PageHeader
        title="Accounting Foundation"
        description="Static chart of accounts, general ledger, journals, opening periods, cost centers, transaction locks, and audit trail."
        action={<Button variant="outline">New journal preview</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Accounts" value={String(finance.chartAccounts.length)} hint="Chart of accounts" />
        <StatCard label="Asset balance" value={formatINR(assetBalance)} hint="Static account totals" />
        <StatCard label="Liabilities" value={formatINR(liabilityBalance)} hint="Payables and tax" />
        <StatCard label="Posted journals" value={String(postedJournals.length)} hint={`${draftJournals.length} draft`} />
        <StatCard label="Open periods" value={String(openPeriods.length)} hint="Fiscal controls" />
        <StatCard label="Critical audit" value={String(criticalAuditEvents.length)} hint="Locked-period events" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search accounts, journals, periods, locks, cost centers, audit..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Chart of Accounts' && (
        <DataTable headers={['Code', 'Account', 'Type', 'Group', 'Balance', 'Module', 'Status']}>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{account.code}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{account.name}</td>
              <td className="px-4 py-3"><StatusPill value={account.type} /></td>
              <td className="px-4 py-3 text-slate-600">{account.group}</td>
              <td className="px-4 py-3"><AmountDisplay value={account.balance} /></td>
              <td className="px-4 py-3 text-slate-600">{account.linkedModule}</td>
              <td className="px-4 py-3"><StatusPill value={account.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'General Ledger' && (
        <DataTable headers={['Date', 'Account', 'Journal', 'Debit', 'Credit', 'Cost center', 'Narration']}>
          {ledgerLines.map((line) => (
            <tr key={`${line.entryNumber}-${line.id}`}>
              <td className="px-4 py-3 text-slate-600">{line.entryDate}</td>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{line.accountName}</p><p className="text-xs text-slate-500">{line.accountCode}</p></td>
              <td className="px-4 py-3"><p className="font-medium text-indigo-700">{line.entryNumber}</p><p className="text-xs text-slate-500">{line.source}</p></td>
              <td className="px-4 py-3"><AmountDisplay value={line.debit} /></td>
              <td className="px-4 py-3"><AmountDisplay value={line.credit} /></td>
              <td className="px-4 py-3 text-slate-600">{line.costCenter || '-'}</td>
              <td className="px-4 py-3 text-slate-600">{line.narration}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Journal Entries' && (
        <DataTable headers={['Journal', 'Date', 'Source', 'Reference', 'Debit', 'Credit', 'Status', 'Description']}>
          {journals.map((entry) => {
            const totals = getJournalTotals(entry);
            return (
              <tr key={entry.id}>
                <td className="px-4 py-3"><p className="font-medium text-indigo-700">{entry.number}</p><p className="text-xs text-slate-500">{entry.postedBy}</p></td>
                <td className="px-4 py-3 text-slate-600">{entry.date}</td>
                <td className="px-4 py-3 text-slate-600">{entry.source}</td>
                <td className="px-4 py-3 text-slate-600">{entry.reference}</td>
                <td className="px-4 py-3"><AmountDisplay value={totals.debit} /></td>
                <td className="px-4 py-3"><AmountDisplay value={totals.credit} /></td>
                <td className="px-4 py-3"><StatusPill value={entry.status} /></td>
                <td className="px-4 py-3 text-slate-600">{entry.description}</td>
              </tr>
            );
          })}
        </DataTable>
      )}

      {view === 'Periods & Locks' && (
        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <DataTable headers={['Period', 'Fiscal year', 'Range', 'Locked modules', 'Status', 'Checklist']}>
            {periods.map((period) => (
              <tr key={period.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{period.name}</td>
                <td className="px-4 py-3 text-slate-600">{period.fiscalYear}</td>
                <td className="px-4 py-3 text-slate-600">{period.startDate} to {period.endDate}</td>
                <td className="px-4 py-3 text-slate-600">{period.lockedModules.length ? period.lockedModules.join(', ') : '-'}</td>
                <td className="px-4 py-3"><StatusPill value={period.status} /></td>
                <td className="px-4 py-3 text-slate-600">{period.closeChecklist.join(', ')}</td>
              </tr>
            ))}
          </DataTable>
          <DataTable headers={['Lock', 'Module', 'Range', 'Owner', 'Status', 'Reason']}>
            {locks.map((lock) => (
              <tr key={lock.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{lock.scope}</td>
                <td className="px-4 py-3 text-slate-600">{lock.module}</td>
                <td className="px-4 py-3 text-slate-600">{lock.fromDate} to {lock.toDate}</td>
                <td className="px-4 py-3 text-slate-600">{lock.owner}</td>
                <td className="px-4 py-3"><StatusPill value={lock.status} /></td>
                <td className="px-4 py-3 text-slate-600">{lock.reason}</td>
              </tr>
            ))}
          </DataTable>
        </section>
      )}

      {view === 'Cost Centers' && (
        <DataTable headers={['Code', 'Cost center', 'Owner', 'Budget', 'Actual', 'Variance', 'Usage', 'Status']}>
          {costCenters.map((center) => {
            const usage = center.budget ? Math.round((center.actual / center.budget) * 100) : 0;
            return (
              <tr key={center.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{center.code}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{center.name}</td>
                <td className="px-4 py-3 text-slate-600">{center.owner}</td>
                <td className="px-4 py-3"><AmountDisplay value={center.budget} /></td>
                <td className="px-4 py-3"><AmountDisplay value={center.actual} /></td>
                <td className="px-4 py-3"><AmountDisplay value={center.budget - center.actual} tone={center.actual > center.budget ? 'danger' : 'success'} /></td>
                <td className="px-4 py-3 text-slate-600">{usage}%</td>
                <td className="px-4 py-3"><StatusPill value={center.status} /></td>
              </tr>
            );
          })}
        </DataTable>
      )}

      {view === 'Audit Trail' && (
        <DataTable headers={['When', 'Actor', 'Action', 'Record', 'Severity', 'IP']}>
          {auditTrail.map((event) => (
            <tr key={event.id}>
              <td className="px-4 py-3 text-slate-600">{event.occurredAt}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{event.actor}</td>
              <td className="px-4 py-3 text-slate-600">{event.action}</td>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{event.recordName}</p><p className="text-xs text-slate-500">{event.recordType}</p></td>
              <td className="px-4 py-3"><StatusPill value={event.severity} /></td>
              <td className="px-4 py-3 text-slate-600">{event.ipAddress}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const getJournalTotals = (entry: FinanceJournalEntry) => ({
  debit: entry.lines.reduce((sum, line) => sum + line.debit, 0),
  credit: entry.lines.reduce((sum, line) => sum + line.credit, 0),
});

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const tone = ['Active', 'Posted', 'Open', 'Info', 'Asset', 'Income'].includes(value)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : ['Draft', 'Scheduled', 'Locked', 'Warning', 'Liability', 'Expense'].includes(value)
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : ['Inactive', 'Reversed', 'Closed', 'Released', 'Critical'].includes(value)
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return <Badge className={`border ${tone}`}>{value}</Badge>;
};

export default FinanceAccountingPage;
