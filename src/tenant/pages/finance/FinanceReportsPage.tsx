import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { DateRangeFilter } from '@/tenant/finance/components/DateRangeFilter';
import { FinanceReportCards } from '@/tenant/finance/components/FinanceReportCards';
import { GSTSummaryCard } from '@/tenant/finance/components/GSTSummaryCard';
import { LedgerTable } from '@/tenant/finance/components/LedgerTable';
import type { ExpenseCategory, InvoiceStatus } from '@/tenant/finance/types';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import {
  buildCustomerLedgers,
  calculateGSTSummary,
  calculateInvoiceTotals,
  getInvoiceBalance,
} from '@/tenant/finance/services/financeDemoService';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

const invoiceStatuses: Array<'All' | InvoiceStatus> = ['All', 'Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'];
const categories: Array<'All' | ExpenseCategory> = ['All', 'Office Rent', 'Salary', 'Travel', 'Marketing', 'Software', 'Utilities', 'Purchase', 'Miscellaneous'];

const FinanceReportsPage: React.FC = () => {
  const finance = useFinanceData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | InvoiceStatus>('All');
  const [category, setCategory] = useState<'All' | ExpenseCategory>('All');
  const [fromDate, setFromDate] = useState('2026-06-01');
  const [toDate, setToDate] = useState('2026-06-30');

  const filteredInvoices = useMemo(() => finance.invoices.filter((invoice) => {
    const query = search.toLowerCase().trim();
    const searchMatch = !query || [invoice.number, invoice.customerName, invoice.status].join(' ').toLowerCase().includes(query);
    const statusMatch = status === 'All' || invoice.status === status;
    const dateMatch = invoice.invoiceDate >= fromDate && invoice.invoiceDate <= toDate;
    return searchMatch && statusMatch && dateMatch;
  }), [finance.invoices, fromDate, search, status, toDate]);

  const filteredExpenses = useMemo(() => finance.expenses.filter((expense) => {
    const categoryMatch = category === 'All' || expense.category === category;
    const dateMatch = expense.date >= fromDate && expense.date <= toDate;
    return categoryMatch && dateMatch;
  }), [category, finance.expenses, fromDate, toDate]);

  const customerLedger = buildCustomerLedgers(finance);
  const gstSummary = calculateGSTSummary(finance);

  return (
    <div>
      <PageHeader title="Finance Reports" description="Demo invoice, payment, outstanding, expense, GST, customer ledger, and profit/loss reports." action={<Button variant="outline"><Download className="h-4 w-4" />Export placeholder</Button>} />

      <section className="mb-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_280px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search report rows..." />
          <Select label="Status" value={status} options={invoiceStatuses} onChange={(value) => setStatus(value as typeof status)} />
          <Select label="Category" value={category} options={categories} onChange={(value) => setCategory(value as typeof category)} />
          <DateRangeFilter from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
        </div>
      </section>

      <FinanceReportCards invoices={filteredInvoices} payments={finance.payments} expenses={filteredExpenses} />

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <GSTSummaryCard summary={gstSummary} />
        <div>
          <h2 className="mb-3 font-semibold text-slate-950">Invoice report</h2>
          <DataTable headers={['Invoice', 'Customer', 'Total', 'Balance', 'Status']}>
            {filteredInvoices.slice(0, 8).map((invoice) => {
              const totals = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, undefined, invoice.roundOff);
              return (
                <tr key={invoice.id}>
                  <td className="px-4 py-3 font-medium text-indigo-700">{invoice.number}</td>
                  <td className="px-4 py-3">{invoice.customerName}</td>
                  <td className="px-4 py-3"><AmountDisplay value={totals.grandTotal} /></td>
                  <td className="px-4 py-3"><AmountDisplay value={getInvoiceBalance(invoice)} tone="warning" /></td>
                  <td className="px-4 py-3 text-slate-600">{invoice.status}</td>
                </tr>
              );
            })}
          </DataTable>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 font-semibold text-slate-950">Customer ledger report</h2>
        <LedgerTable type="customer" rows={customerLedger} />
      </section>
    </div>
  );
};

const Select: React.FC<{ label: string; value: string; options: readonly string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  </label>
);

export default FinanceReportsPage;
