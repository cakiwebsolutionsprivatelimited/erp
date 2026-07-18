import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WarehouseDraft, WarehouseStatus } from '@/tenant/inventory/types';

export const WarehouseForm: React.FC<{ onSubmit: (warehouse: WarehouseDraft) => void }> = ({ onSubmit }) => {
  const [draft, setDraft] = useState<WarehouseDraft>({
    name: '',
    code: '',
    address: '',
    manager: '',
    status: 'Active',
  });
  const update = <K extends keyof WarehouseDraft>(key: K, value: WarehouseDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Warehouse name" value={draft.name} onChange={(value) => update('name', value)} required />
        <Field label="Code" value={draft.code} onChange={(value) => update('code', value)} required />
        <Field label="Manager" value={draft.manager} onChange={(value) => update('manager', value)} />
        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-500">Status</span>
          <select value={draft.status} onChange={(event) => update('status', event.target.value as WarehouseStatus)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1">
        <span className="text-xs font-medium text-slate-500">Address</span>
        <textarea value={draft.address} onChange={(event) => update('address', event.target.value)} className="min-h-20 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
      </label>
      <Button type="submit"><Save className="h-4 w-4" />Save warehouse</Button>
    </form>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; required?: boolean }> = ({ label, value, onChange, required }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <input value={value} required={required} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
  </label>
);
