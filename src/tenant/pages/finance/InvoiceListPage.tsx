import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { DateRangeFilter } from '@/tenant/finance/components/DateRangeFilter';
import { InvoiceTable } from '@/tenant/finance/components/InvoiceTable';
import { PaymentForm } from '@/tenant/finance/components/PaymentForm';
import type { InvoiceStatus } from '@/tenant/finance/types';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

const statuses: Array<'All' | InvoiceStatus> = ['All', 'Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'];

const InvoiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const finance = useFinanceData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | InvoiceStatus>('All');
  const [customerId, setCustomerId] = useState('All');
  const [fromDate, setFromDate] = useState('2026-06-01');
  const [toDate, setToDate] = useState('2026-06-30');
  const [paymentInvoiceId, setPaymentInvoiceId] = useState<string | null>(null);

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase().trim();
    return finance.invoices.filter((invoice) => {
      const searchMatch = !query || [invoice.number, invoice.customerName, invoice.customerGstin, invoice.status].join(' ').toLowerCase().includes(query);
      const statusMatch = status === 'All' || invoice.status === status;
      const customerMatch = customerId === 'All' || invoice.customerId === customerId;
      const dateMatch = invoice.invoiceDate >= fromDate && invoice.invoiceDate <= toDate;
      return searchMatch && statusMatch && customerMatch && dateMatch;
    });
  }, [customerId, finance.invoices, fromDate, search, status, toDate]);

  const duplicateInvoice = (id: string) => {
    const nextId = finance.duplicateInvoice(id);
    if (nextId) navigate(`/finance/invoices/${nextId}/edit`);
  };

  const recordPayment = (payment: Parameters<typeof finance.recordPayment>[0]) => {
    finance.recordPayment(payment);
    setPaymentInvoiceId(null);
  };

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="GST invoice list with local filters, payment recording, duplicate, preview, and cancellation actions."
        action={<Button onClick={() => navigate('/finance/invoices/new')}><FilePlus2 className="h-4 w-4" />Create Invoice</Button>}
      />

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_220px_280px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search invoice, customer, GSTIN..." />
          <Select label="Status" value={status} options={statuses} onChange={(value) => setStatus(value as typeof status)} />
          <Select label="Customer" value={customerId} options={['All', ...finance.customers.map((customer) => customer.id)]} labels={Object.fromEntries(finance.customers.map((customer) => [customer.id, customer.name]))} onChange={setCustomerId} />
          <DateRangeFilter from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Export</Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/finance/invoices/new')}>GST invoice</Button>
          </div>
          <p className="text-sm text-slate-500">{filteredInvoices.length} invoices</p>
        </div>
      </section>

      <InvoiceTable
        invoices={filteredInvoices}
        onView={(id) => navigate(`/finance/invoices/${id}`)}
        onEdit={(id) => navigate(`/finance/invoices/${id}/edit`)}
        onRecordPayment={setPaymentInvoiceId}
        onDuplicate={duplicateInvoice}
        onCancel={finance.cancelInvoice}
        onSend={finance.sendInvoice}
      />

      <Dialog open={!!paymentInvoiceId} onOpenChange={(open) => !open && setPaymentInvoiceId(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
            <DialogDescription>Capture a local demo receipt and update invoice balance immediately.</DialogDescription>
          </DialogHeader>
          <PaymentForm customers={finance.customers} invoices={finance.invoices} initialInvoiceId={paymentInvoiceId || undefined} onSubmit={recordPayment} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Select: React.FC<{ label: string; value: string; options: readonly string[]; labels?: Record<string, string>; onChange: (value: string) => void }> = ({
  label,
  value,
  options,
  labels,
  onChange,
}) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{labels?.[option] || option}</option>)}
    </select>
  </label>
);

export default InvoiceListPage;
