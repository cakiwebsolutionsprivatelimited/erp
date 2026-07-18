import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

type BankingView = 'Bank Accounts' | 'Cash Accounts' | 'Statement Import' | 'Categorization Rules' | 'Reconciliation' | 'Cheque Management';

const views: BankingView[] = ['Bank Accounts', 'Cash Accounts', 'Statement Import', 'Categorization Rules', 'Reconciliation', 'Cheque Management'];

const FinanceBankingPage: React.FC = () => {
  const finance = useFinanceData();
  const [view, setView] = useState<BankingView>('Bank Accounts');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const bankBalance = finance.bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const bookBalance = finance.bankAccounts.reduce((sum, account) => sum + account.bookBalance, 0);
  const cashBalance = finance.cashAccounts.reduce((sum, account) => sum + account.balance, 0);
  const statementReview = finance.bankStatementLines.filter((line) => line.status === 'Needs Review');
  const unreconciled = finance.bankReconciliations.reduce((sum, reconciliation) => sum + reconciliation.unmatchedItems, 0);
  const activeCheques = finance.chequeInstruments.filter((cheque) => ['Issued', 'Deposited'].includes(cheque.status));

  const bankAccounts = useMemo(() => finance.bankAccounts.filter((account) =>
    !query || [account.accountName, account.bankName, account.accountType, account.accountNumberLast4, account.status, account.lastSyncAt].join(' ').toLowerCase().includes(query)
  ), [finance.bankAccounts, query]);

  const cashAccounts = useMemo(() => finance.cashAccounts.filter((account) =>
    !query || [account.accountName, account.custodian, account.location, account.status, account.lastCountAt].join(' ').toLowerCase().includes(query)
  ), [finance.cashAccounts, query]);

  const statementLines = useMemo(() => finance.bankStatementLines.filter((line) =>
    !query || [line.description, line.type, line.bankAccount, line.category, line.matchedRecord, line.status].join(' ').toLowerCase().includes(query)
  ), [finance.bankStatementLines, query]);

  const rules = useMemo(() => finance.categorizationRules.filter((rule) =>
    !query || [rule.name, rule.condition, rule.category, rule.accountCode, rule.status].join(' ').toLowerCase().includes(query)
  ), [finance.categorizationRules, query]);

  const reconciliations = useMemo(() => finance.bankReconciliations.filter((reconciliation) =>
    !query || [reconciliation.period, reconciliation.bankAccount, reconciliation.status, reconciliation.reviewer].join(' ').toLowerCase().includes(query)
  ), [finance.bankReconciliations, query]);

  const cheques = useMemo(() => finance.chequeInstruments.filter((cheque) =>
    !query || [cheque.chequeNumber, cheque.bankAccount, cheque.party, cheque.status, cheque.purpose].join(' ').toLowerCase().includes(query)
  ), [finance.chequeInstruments, query]);

  return (
    <div>
      <PageHeader
        title="Banking"
        description="Static bank accounts, cash accounts, statement import, categorization rules, reconciliation, and cheque management."
        action={<Button variant="outline">Import statement preview</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Bank balance" value={formatINR(bankBalance)} hint="Statement balance" />
        <StatCard label="Book balance" value={formatINR(bookBalance)} hint="Finance ledger balance" />
        <StatCard label="Cash balance" value={formatINR(cashBalance)} hint="Manual cash books" />
        <StatCard label="Needs review" value={String(statementReview.length)} hint="Statement lines" />
        <StatCard label="Unmatched items" value={String(unreconciled)} hint="Reconciliation queue" />
        <StatCard label="Active cheques" value={String(activeCheques.length)} hint="Issued/deposited" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search accounts, statements, rules, reconciliations, cheques..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Bank Accounts' && (
        <DataTable headers={['Account', 'Bank', 'Type', 'Last 4', 'Statement balance', 'Book balance', 'Difference', 'Last sync', 'Status']}>
          {bankAccounts.map((account) => (
            <tr key={account.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{account.accountName}</td>
              <td className="px-4 py-3 text-slate-600">{account.bankName}</td>
              <td className="px-4 py-3 text-slate-600">{account.accountType}</td>
              <td className="px-4 py-3 text-slate-600">{account.accountNumberLast4}</td>
              <td className="px-4 py-3"><AmountDisplay value={account.balance} /></td>
              <td className="px-4 py-3"><AmountDisplay value={account.bookBalance} /></td>
              <td className="px-4 py-3"><AmountDisplay value={account.balance - account.bookBalance} tone={account.balance === account.bookBalance ? 'success' : 'warning'} /></td>
              <td className="px-4 py-3 text-slate-600">{account.lastSyncAt}</td>
              <td className="px-4 py-3"><StatusPill value={account.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Cash Accounts' && (
        <DataTable headers={['Cash account', 'Custodian', 'Location', 'Balance', 'Last count', 'Status']}>
          {cashAccounts.map((account) => (
            <tr key={account.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{account.accountName}</td>
              <td className="px-4 py-3 text-slate-600">{account.custodian}</td>
              <td className="px-4 py-3 text-slate-600">{account.location}</td>
              <td className="px-4 py-3"><AmountDisplay value={account.balance} /></td>
              <td className="px-4 py-3 text-slate-600">{account.lastCountAt}</td>
              <td className="px-4 py-3"><StatusPill value={account.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Statement Import' && (
        <DataTable headers={['Date', 'Description', 'Account', 'Type', 'Amount', 'Category', 'Matched record', 'Status']}>
          {statementLines.map((line) => (
            <tr key={line.id}>
              <td className="px-4 py-3 text-slate-600">{line.date}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{line.description}</td>
              <td className="px-4 py-3 text-slate-600">{line.bankAccount}</td>
              <td className="px-4 py-3"><StatusPill value={line.type} /></td>
              <td className="px-4 py-3"><AmountDisplay value={line.amount} tone={line.type === 'Credit' ? 'success' : 'default'} /></td>
              <td className="px-4 py-3 text-slate-600">{line.category}</td>
              <td className="px-4 py-3 text-slate-600">{line.matchedRecord}</td>
              <td className="px-4 py-3"><StatusPill value={line.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Categorization Rules' && (
        <DataTable headers={['Rule', 'Condition', 'Category', 'Account', 'Confidence', 'Status']}>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{rule.name}</td>
              <td className="px-4 py-3 text-slate-600">{rule.condition}</td>
              <td className="px-4 py-3 text-slate-600">{rule.category}</td>
              <td className="px-4 py-3 font-medium text-indigo-700">{rule.accountCode}</td>
              <td className="px-4 py-3 text-slate-600">{rule.confidence}%</td>
              <td className="px-4 py-3"><StatusPill value={rule.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Reconciliation' && (
        <DataTable headers={['Period', 'Account', 'Statement', 'Book', 'Difference', 'Matched', 'Unmatched', 'Reviewer', 'Status']}>
          {reconciliations.map((reconciliation) => (
            <tr key={reconciliation.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{reconciliation.period}</td>
              <td className="px-4 py-3 text-slate-600">{reconciliation.bankAccount}</td>
              <td className="px-4 py-3"><AmountDisplay value={reconciliation.statementBalance} /></td>
              <td className="px-4 py-3"><AmountDisplay value={reconciliation.bookBalance} /></td>
              <td className="px-4 py-3"><AmountDisplay value={reconciliation.difference} tone={reconciliation.difference ? 'warning' : 'success'} /></td>
              <td className="px-4 py-3 text-slate-600">{reconciliation.matchedItems}</td>
              <td className="px-4 py-3 text-slate-600">{reconciliation.unmatchedItems}</td>
              <td className="px-4 py-3 text-slate-600">{reconciliation.reviewer}</td>
              <td className="px-4 py-3"><StatusPill value={reconciliation.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Cheque Management' && (
        <DataTable headers={['Cheque', 'Account', 'Party', 'Issue date', 'Amount', 'Status', 'Purpose']}>
          {cheques.map((cheque) => (
            <tr key={cheque.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{cheque.chequeNumber}</td>
              <td className="px-4 py-3 text-slate-600">{cheque.bankAccount}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{cheque.party}</td>
              <td className="px-4 py-3 text-slate-600">{cheque.issueDate}</td>
              <td className="px-4 py-3"><AmountDisplay value={cheque.amount} /></td>
              <td className="px-4 py-3"><StatusPill value={cheque.status} /></td>
              <td className="px-4 py-3 text-slate-600">{cheque.purpose}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const tone = ['Connected', 'Mapped', 'Active', 'Reconciled', 'Cleared', 'Deposited', 'Credit'].includes(value)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : ['Manual', 'Needs Review', 'Imported', 'Draft', 'Paused', 'In Progress', 'Issued', 'Debit'].includes(value)
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : ['Inactive', 'Stopped', 'Void'].includes(value)
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return <Badge className={`border ${tone}`}>{value}</Badge>;
};

export default FinanceBankingPage;
