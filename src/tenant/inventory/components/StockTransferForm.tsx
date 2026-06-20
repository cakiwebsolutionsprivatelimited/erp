import React, { useState } from 'react';
import { Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InventoryProduct, StockTransferDraft, StockTransferStatus, Warehouse } from '@/tenant/inventory/types';

export const StockTransferForm: React.FC<{
  products: InventoryProduct[];
  warehouses: Warehouse[];
  onSubmit: (transfer: StockTransferDraft) => void;
}> = ({ products, warehouses, onSubmit }) => {
  const [draft, setDraft] = useState<StockTransferDraft>({
    fromWarehouseId: warehouses[0]?.id || '',
    toWarehouseId: warehouses[1]?.id || warehouses[0]?.id || '',
    productId: products[0]?.id || '',
    quantity: 1,
    transferDate: '2026-06-18',
    status: 'In Transit',
    notes: '',
  });

  return (
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...draft, quantity: Number(draft.quantity) || 0 }); }}>
      <div className="grid gap-3 md:grid-cols-2">
        <Select label="From warehouse" value={draft.fromWarehouseId} options={warehouses.map((warehouse) => [warehouse.id, warehouse.name])} onChange={(value) => setDraft((current) => ({ ...current, fromWarehouseId: value }))} />
        <Select label="To warehouse" value={draft.toWarehouseId} options={warehouses.map((warehouse) => [warehouse.id, warehouse.name])} onChange={(value) => setDraft((current) => ({ ...current, toWarehouseId: value }))} />
        <Select label="Product" value={draft.productId} options={products.map((product) => [product.id, product.name])} onChange={(value) => setDraft((current) => ({ ...current, productId: value }))} />
        <NumberField label="Quantity" value={draft.quantity} onChange={(quantity) => setDraft((current) => ({ ...current, quantity }))} />
        <Field type="date" label="Transfer date" value={draft.transferDate} onChange={(transferDate) => setDraft((current) => ({ ...current, transferDate }))} />
        <Select label="Status" value={draft.status} options={['Draft', 'In Transit', 'Completed'].map((status) => [status, status])} onChange={(status) => setDraft((current) => ({ ...current, status: status as StockTransferStatus }))} />
      </div>
      <label className="grid gap-1">
        <span className="text-xs font-medium text-slate-500">Notes</span>
        <textarea value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} className="min-h-20 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
      </label>
      <Button type="submit"><Repeat className="h-4 w-4" />Create transfer</Button>
    </form>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
  </label>
);

const NumberField: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <input type="number" min="1" value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
  </label>
);

const Select: React.FC<{ label: string; value: string; options: string[][]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map(([id, labelText]) => <option key={id} value={id}>{labelText}</option>)}
    </select>
  </label>
);
