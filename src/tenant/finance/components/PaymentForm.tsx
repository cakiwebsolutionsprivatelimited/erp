import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { FinanceCustomer, Invoice, PaymentDraft, PaymentMode } from '@/tenant/finance/types';
import { getInvoiceBalance } from '@/tenant/finance/services/financeDemoService';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';

interface PaymentFormProps {
  customers: FinanceCustomer[];
  invoices: Invoice[];
  initialInvoiceId?: string;
  onSubmit: (payment: PaymentDraft) => void;
}

const paymentModes: PaymentMode[] = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'];

export const PaymentForm: React.FC<PaymentFormProps> = ({ customers, invoices, initialInvoiceId, onSubmit }) => {
  const initialInvoice = invoices.find((invoice) => invoice.id === initialInvoiceId) ?? invoices.find((invoice) => getInvoiceBalance(invoice) > 0) ?? invoices[0];
  const [customerId, setCustomerId] = useState(initialInvoice?.customerId || customers[0]?.id || '');
  const [invoiceId, setInvoiceId] = useState(initialInvoice?.id || '');
  const selectedInvoice = invoices.find((invoice) => invoice.id === invoiceId);
  const customerInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.customerId === customerId && invoice.status !== 'Cancelled'),
    [customerId, invoices]
  );
  const [payment, setPayment] = useState({
    paymentDate: '2026-06-18',
    amount: selectedInvoice ? getInvoiceBalance(selectedInvoice) : 0,
    mode: 'UPI' as PaymentMode,
    referenceNumber: '',
    notes: '',
  });

  const changeCustomer = (value: string) => {
    const firstInvoice = invoices.find((invoice) => invoice.customerId === value && invoice.status !== 'Cancelled');
    setCustomerId(value);
    setInvoiceId(firstInvoice?.id || '');
    setPayment((current) => ({ ...current, amount: firstInvoice ? getInvoiceBalance(firstInvoice) : 0 }));
  };

  const changeInvoice = (value: string) => {
    const invoice = invoices.find((item) => item.id === value);
    setInvoiceId(value);
    setCustomerId(invoice?.customerId || customerId);
    setPayment((current) => ({ ...current, amount: invoice ? getInvoiceBalance(invoice) : current.amount }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedInvoice) return;
    onSubmit({
      customerId,
      invoiceId,
      paymentDate: payment.paymentDate,
      amount: Math.max(0, payment.amount),
      mode: payment.mode,
      referenceNumber: payment.referenceNumber || 'DEMO-REF',
      notes: payment.notes,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Customer" value={customerId} options={customers.map((customer) => [customer.id, customer.name])} onChange={changeCustomer} />
        <Select label="Invoice" value={invoiceId} options={customerInvoices.map((invoice) => [invoice.id, invoice.number])} onChange={changeInvoice} />
        <Field label="Payment date" type="date" value={payment.paymentDate} onChange={(value) => setPayment((current) => ({ ...current, paymentDate: value }))} />
        <Field label="Amount" type="number" value={String(payment.amount)} onChange={(value) => setPayment((current) => ({ ...current, amount: Number(value) }))} />
        <Select label="Payment mode" value={payment.mode} options={paymentModes.map((mode) => [mode, mode])} onChange={(value) => setPayment((current) => ({ ...current, mode: value as PaymentMode }))} />
        <Field label="Reference number" value={payment.referenceNumber} onChange={(value) => setPayment((current) => ({ ...current, referenceNumber: value }))} />
      </div>
      {selectedInvoice && (
        <div className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Current invoice balance: <AmountDisplay value={getInvoiceBalance(selectedInvoice)} tone="warning" />
        </div>
      )}
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-slate-700">Notes</span>
        <textarea value={payment.notes} onChange={(event) => setPayment((current) => ({ ...current, notes: event.target.value }))} className="min-h-20 rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
      </label>
      <div className="flex justify-end">
        <Button type="submit" disabled={!selectedInvoice}>Record payment</Button>
      </div>
    </form>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <label className="grid gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input type={type} min={type === 'number' ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
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
