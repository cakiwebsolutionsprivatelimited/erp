import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Expense, ExpenseCategory, ExpenseDraft, ExpenseStatus, PaymentMode } from '@/tenant/finance/types';

interface ExpenseFormProps {
  initialExpense?: Expense;
  onSubmit: (expense: ExpenseDraft) => void;
}

const categories: ExpenseCategory[] = ['Office Rent', 'Salary', 'Travel', 'Marketing', 'Software', 'Utilities', 'Purchase', 'Miscellaneous'];
const paymentModes: PaymentMode[] = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'];
const statuses: ExpenseStatus[] = ['Draft', 'Pending', 'Paid', 'Rejected'];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialExpense, onSubmit }) => {
  const [form, setForm] = useState<ExpenseDraft>({
    date: initialExpense?.date || '2026-06-18',
    category: initialExpense?.category || 'Software',
    vendor: initialExpense?.vendor || '',
    amount: initialExpense?.amount || 12000,
    gstAmount: initialExpense?.gstAmount || 2160,
    paymentMode: initialExpense?.paymentMode || 'UPI',
    status: initialExpense?.status || 'Pending',
    notes: initialExpense?.notes || '',
    attachmentName: initialExpense?.attachmentName || '',
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date" type="date" value={form.date} onChange={(value) => setForm((current) => ({ ...current, date: value }))} />
        <Select label="Category" value={form.category} options={categories} onChange={(value) => setForm((current) => ({ ...current, category: value as ExpenseCategory }))} />
        <Field label="Vendor name" value={form.vendor} onChange={(value) => setForm((current) => ({ ...current, vendor: value }))} />
        <Field label="Amount" type="number" value={String(form.amount)} onChange={(value) => setForm((current) => ({ ...current, amount: Number(value) }))} />
        <Field label="GST amount" type="number" value={String(form.gstAmount)} onChange={(value) => setForm((current) => ({ ...current, gstAmount: Number(value) }))} />
        <Select label="Payment mode" value={form.paymentMode} options={paymentModes} onChange={(value) => setForm((current) => ({ ...current, paymentMode: value as PaymentMode }))} />
        <Select label="Status" value={form.status} options={statuses} onChange={(value) => setForm((current) => ({ ...current, status: value as ExpenseStatus }))} />
        <Field label="Attachment placeholder" value={form.attachmentName || ''} onChange={(value) => setForm((current) => ({ ...current, attachmentName: value }))} />
      </div>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-slate-700">Notes</span>
        <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="min-h-20 rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
      </label>
      <div className="flex justify-end">
        <Button type="submit">{initialExpense ? 'Save expense' : 'Add expense'}</Button>
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

const Select: React.FC<{ label: string; value: string; options: readonly string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);
