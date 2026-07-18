import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SupplierDraft, SupplierStatus } from '@/tenant/inventory/types';

export const SupplierForm: React.FC<{ onSubmit: (supplier: SupplierDraft) => void }> = ({ onSubmit }) => {
  const [draft, setDraft] = useState<SupplierDraft>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstNumber: '',
    address: '',
    paymentTerms: '30 days credit',
    status: 'Active',
  });
  const update = <K extends keyof SupplierDraft>(key: K, value: SupplierDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Supplier name" value={draft.name} onChange={(value) => update('name', value)} required />
        <Field label="Contact person" value={draft.contactPerson} onChange={(value) => update('contactPerson', value)} />
        <Field label="Phone" value={draft.phone} onChange={(value) => update('phone', value)} />
        <Field label="Email" value={draft.email} onChange={(value) => update('email', value)} />
        <Field label="GST number" value={draft.gstNumber} onChange={(value) => update('gstNumber', value)} />
        <Field label="Payment terms" value={draft.paymentTerms} onChange={(value) => update('paymentTerms', value)} />
        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-500">Status</span>
          <select value={draft.status} onChange={(event) => update('status', event.target.value as SupplierStatus)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1">
        <span className="text-xs font-medium text-slate-500">Address</span>
        <textarea value={draft.address} onChange={(event) => update('address', event.target.value)} className="min-h-20 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
      </label>
      <Button type="submit"><Save className="h-4 w-4" />Save supplier</Button>
    </form>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; required?: boolean }> = ({ label, value, onChange, required }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <input value={value} required={required} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
  </label>
);
