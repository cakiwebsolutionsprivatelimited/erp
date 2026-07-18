import React from 'react';
import { BookOpen, Landmark, ReceiptText, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/tenant/components/TenantUI';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { LedgerTable } from '@/tenant/finance/components/LedgerTable';
import { buildCustomerLedgers } from '@/tenant/finance/services/financeDemoService';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

export const CustomerLedgerPage: React.FC = () => {
  const finance = useFinanceData();
  const rows = buildCustomerLedgers(finance);
  const outstanding = rows.reduce((sum, row) => sum + row.outstanding, 0);

  return (
    <div>
      <PageHeader title="Customer Ledger" description="Customer opening balances, invoices, receipts, outstanding amount, and last payment date." />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <MetricCard label="Customers" textValue={String(rows.length)} icon={<BookOpen className="h-4 w-4" />} />
        <MetricCard label="Outstanding" value={outstanding} hint="Total ledger balance" tone="warning" />
        <MetricCard label="Overdue customers" textValue={String(rows.filter((row) => row.status === 'Overdue').length)} />
        <MetricCard label="Clear accounts" textValue={String(rows.filter((row) => row.status === 'Clear').length)} />
      </section>
      <LedgerTable type="customer" rows={rows} />
      <AccountsLiteCards />
    </div>
  );
};

export const SupplierLedgerPage: React.FC = () => {
  const finance = useFinanceData();
  const outstanding = finance.suppliers.reduce((sum, row) => sum + row.outstanding, 0);

  return (
    <div>
      <PageHeader title="Supplier Ledger" description="Supplier opening balances, purchase placeholder totals, paid amount, and outstanding balances." />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <MetricCard label="Suppliers" textValue={String(finance.suppliers.length)} icon={<BookOpen className="h-4 w-4" />} />
        <MetricCard label="Outstanding" value={outstanding} hint="Payable balance" tone="warning" />
        <MetricCard label="Clear suppliers" textValue={String(finance.suppliers.filter((row) => row.status === 'Clear').length)} />
        <MetricCard label="Purchase records" textValue="Placeholder" />
      </section>
      <LedgerTable type="supplier" rows={finance.suppliers} />
      <AccountsLiteCards />
    </div>
  );
};

const AccountsLiteCards: React.FC = () => (
  <section className="mt-5 grid gap-4 md:grid-cols-4">
    <PlaceholderCard title="Cash Book" description="Cash inflow/outflow placeholder for local finance entries." icon={<ReceiptText className="h-4 w-4" />} />
    <PlaceholderCard title="Bank Book" description="Bank transfer and cheque activity placeholder." icon={<Landmark className="h-4 w-4" />} />
    <PlaceholderCard title="Day Book" description="Daily invoice, payment, and expense movement placeholder." icon={<BookOpen className="h-4 w-4" />} />
    <PlaceholderCard title="Profit & Loss Lite" description="Simple cash-basis profit/loss placeholder." icon={<TrendingUp className="h-4 w-4" />} />
  </section>
);

const MetricCard: React.FC<{
  label: string;
  value?: number;
  textValue?: string;
  hint?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}> = ({ label, value, textValue, hint, tone = 'default', icon }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        {typeof value === 'number'
          ? <AmountDisplay value={value} tone={tone} className="mt-2 block truncate text-2xl" />
          : <p className="mt-2 text-2xl font-semibold text-slate-950">{textValue}</p>}
      </div>
      {icon && <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700">{icon}</span>}
    </div>
    {hint && <p className="mt-3 text-xs text-slate-500">{hint}</p>}
  </div>
);

const PlaceholderCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <span className="inline-flex rounded-sm bg-indigo-50 p-2 text-indigo-700">{icon}</span>
    <h3 className="mt-3 font-semibold text-slate-950">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
  </article>
);
