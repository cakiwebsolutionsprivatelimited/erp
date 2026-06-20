import React, { useMemo, useState } from 'react';
import { PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { PaymentForm } from '@/tenant/finance/components/PaymentForm';
import { PaymentTable } from '@/tenant/finance/components/PaymentTable';
import type { PaymentMode } from '@/tenant/finance/types';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

const paymentModes: Array<'All' | PaymentMode> = ['All', 'Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'];

const PaymentsPage: React.FC = () => {
  const finance = useFinanceData();
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'All' | PaymentMode>('All');

  const payments = useMemo(() => {
    const query = search.toLowerCase().trim();
    return finance.payments.filter((payment) => {
      const searchMatch = !query || [payment.number, payment.customerName, payment.invoiceNumber, payment.referenceNumber].join(' ').toLowerCase().includes(query);
      const modeMatch = mode === 'All' || payment.mode === mode;
      return searchMatch && modeMatch;
    });
  }, [finance.payments, mode, search]);

  return (
    <div>
      <PageHeader title="Payments" description="Record customer receipts and update invoice balances locally." />
      <section className="mb-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-950">Record payment</h2>
          <PaymentForm customers={finance.customers} invoices={finance.invoices} onSubmit={finance.recordPayment} />
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-950">Collection summary</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Summary label="Receipts" value={String(finance.payments.length)} />
            <Summary label="Modes" value={String(new Set(finance.payments.map((payment) => payment.mode)).size)} />
            <Summary label="Demo behavior" value="Updates invoices" />
          </div>
        </div>
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search payment, invoice, customer, reference..." />
          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-500">Payment mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
              {paymentModes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </section>

      <PaymentTable payments={payments} />
    </div>
  );
};

const Summary: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md bg-slate-50 p-3">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
  </div>
);

export default PaymentsPage;
