import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/tenant/components/TenantUI';
import { InvoiceItemTable } from '@/tenant/finance/components/InvoiceItemTable';
import { TaxSummary } from '@/tenant/finance/components/TaxSummary';
import type { InvoiceDraft, InvoiceItem, InvoiceStatus } from '@/tenant/finance/types';
import { COMPANY_STATE, calculateInvoiceTotals, createInvoiceNumber } from '@/tenant/finance/services/financeDemoService';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

const states = ['Odisha', 'West Bengal', 'Maharashtra', 'Karnataka', 'Delhi'];
const invoiceStatuses: InvoiceStatus[] = ['Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'];

const InvoiceFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const finance = useFinanceData();
  const existing = finance.invoices.find((invoice) => invoice.id === id);
  const firstCustomer = finance.customers[0];

  const [form, setForm] = useState({
    number: existing?.number || createInvoiceNumber(finance.invoices.length),
    invoiceDate: existing?.invoiceDate || '2026-06-18',
    dueDate: existing?.dueDate || '2026-07-03',
    placeOfSupply: existing?.placeOfSupply || firstCustomer?.state || COMPANY_STATE,
    customerId: existing?.customerId || firstCustomer?.id || '',
    customerName: existing?.customerName || firstCustomer?.name || '',
    customerPhone: existing?.customerPhone || firstCustomer?.phone || '',
    customerEmail: existing?.customerEmail || firstCustomer?.email || '',
    customerGstin: existing?.customerGstin || firstCustomer?.gstin || '',
    billingAddress: existing?.billingAddress || firstCustomer?.billingAddress || '',
    shippingAddress: existing?.shippingAddress || firstCustomer?.billingAddress || '',
    paymentTerms: existing?.paymentTerms || 'Payment due within 15 days from invoice date.',
    notes: existing?.notes || 'Bank details and UPI payment instructions can be added here.',
    status: existing?.status || 'Draft' as InvoiceStatus,
    paidAmount: existing?.paidAmount || 0,
    roundOff: existing?.roundOff || 0,
  });
  const [items, setItems] = useState<InvoiceItem[]>(existing?.items || [{
    id: `FIT-${Date.now()}`,
    productName: 'GST Billing Setup',
    hsnSac: '998313',
    quantity: 1,
    unit: 'Project',
    rate: 35000,
    discount: 0,
    gstRate: 18,
  }]);

  const totals = useMemo(
    () => calculateInvoiceTotals(items, form.placeOfSupply, COMPANY_STATE, form.roundOff),
    [form.placeOfSupply, form.roundOff, items]
  );

  const changeCustomer = (customerId: string) => {
    const customer = finance.customers.find((item) => item.id === customerId);
    if (!customer) return;
    setForm((current) => ({
      ...current,
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerGstin: customer.gstin,
      billingAddress: customer.billingAddress,
      shippingAddress: customer.billingAddress,
      placeOfSupply: customer.state,
    }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const draft: InvoiceDraft = {
      ...form,
      items,
      paidAmount: Math.min(form.paidAmount, totals.grandTotal),
    };

    if (existing) {
      finance.updateInvoice(existing.id, draft);
      navigate(`/finance/invoices/${existing.id}`);
      return;
    }

    const newId = finance.createInvoice(draft);
    navigate(`/finance/invoices/${newId}`);
  };

  return (
    <div>
      <PageHeader
        title={existing ? 'Edit GST Invoice' : 'Create GST Invoice'}
        description="Indian SME invoice form with local CGST/SGST/IGST calculations and backend-ready data shape."
      />

      <form onSubmit={submit} className="space-y-5">
        <Panel title="Invoice details">
          <Field label="Invoice number" value={form.number} onChange={(value) => setForm((current) => ({ ...current, number: value }))} required />
          <Field label="Invoice date" type="date" value={form.invoiceDate} onChange={(value) => setForm((current) => ({ ...current, invoiceDate: value }))} />
          <Field label="Due date" type="date" value={form.dueDate} onChange={(value) => setForm((current) => ({ ...current, dueDate: value }))} />
          <Select label="Place of supply" value={form.placeOfSupply} options={states.map((state) => [state, state])} onChange={(value) => setForm((current) => ({ ...current, placeOfSupply: value }))} />
          <Select label="Status" value={form.status} options={invoiceStatuses.map((status) => [status, status])} onChange={(value) => setForm((current) => ({ ...current, status: value as InvoiceStatus }))} />
          <Field label="Round off" type="number" value={String(form.roundOff)} onChange={(value) => setForm((current) => ({ ...current, roundOff: Number(value) }))} />
        </Panel>

        <Panel title="Customer billing details">
          <Select label="Customer" value={form.customerId} options={finance.customers.map((customer) => [customer.id, customer.name])} onChange={changeCustomer} />
          <Field label="Customer name" value={form.customerName} onChange={(value) => setForm((current) => ({ ...current, customerName: value }))} required />
          <Field label="Customer phone" value={form.customerPhone} onChange={(value) => setForm((current) => ({ ...current, customerPhone: value }))} />
          <Field label="Customer email" type="email" value={form.customerEmail} onChange={(value) => setForm((current) => ({ ...current, customerEmail: value }))} />
          <Field label="Customer GSTIN" value={form.customerGstin} onChange={(value) => setForm((current) => ({ ...current, customerGstin: value }))} />
          <TextArea label="Billing address" value={form.billingAddress} onChange={(value) => setForm((current) => ({ ...current, billingAddress: value }))} />
          <TextArea label="Shipping address optional" value={form.shippingAddress} onChange={(value) => setForm((current) => ({ ...current, shippingAddress: value }))} />
        </Panel>

        <InvoiceItemTable items={items} totals={totals} onChange={setItems} />

        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <Panel title="Payment terms and notes">
            <TextArea label="Payment terms" value={form.paymentTerms} onChange={(value) => setForm((current) => ({ ...current, paymentTerms: value }))} />
            <TextArea label="Notes" value={form.notes} onChange={(value) => setForm((current) => ({ ...current, notes: value }))} />
            <Field label="Paid amount" type="number" value={String(form.paidAmount)} onChange={(value) => setForm((current) => ({ ...current, paidAmount: Number(value) }))} />
          </Panel>
          <TaxSummary totals={totals} />
        </section>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(existing ? `/finance/invoices/${existing.id}` : '/finance/invoices')}>Cancel</Button>
          <Button type="submit">{existing ? 'Save invoice' : 'Create invoice'}</Button>
        </div>
      </form>
    </div>
  );
};

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
  </section>
);

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', required }) => (
  <label className="grid gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
  </label>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label className="grid gap-1.5 xl:col-span-2">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-24 rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
  </label>
);

const Select: React.FC<{ label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map(([optionValue, labelText]) => <option key={optionValue} value={optionValue}>{labelText}</option>)}
    </select>
  </label>
);

export default InvoiceFormPage;
