import React, { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InventoryProduct, StockAdjustmentDraft, Warehouse } from '@/tenant/inventory/types';

export const StockAdjustmentForm: React.FC<{
  products: InventoryProduct[];
  warehouses: Warehouse[];
  onSubmit: (adjustment: StockAdjustmentDraft) => void;
}> = ({ products, warehouses, onSubmit }) => {
  const [draft, setDraft] = useState<StockAdjustmentDraft>({
    productId: products[0]?.id || '',
    warehouseId: warehouses[0]?.id || '',
    adjustmentType: 'Add',
    quantity: 1,
    reason: 'Physical count correction',
    date: '2026-06-18',
    notes: '',
  });
  const product = useMemo(() => products.find((item) => item.id === draft.productId), [draft.productId, products]);

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...draft, quantity: Number(draft.quantity) || 0 });
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Select label="Product" value={draft.productId} options={products.map((item) => [item.id, item.name])} onChange={(value) => setDraft((current) => ({ ...current, productId: value }))} />
        <Select label="Warehouse" value={draft.warehouseId} options={warehouses.map((item) => [item.id, item.name])} onChange={(value) => setDraft((current) => ({ ...current, warehouseId: value }))} />
        <Select label="Adjustment type" value={draft.adjustmentType} options={[['Add', 'Add'], ['Reduce', 'Reduce']]} onChange={(value) => setDraft((current) => ({ ...current, adjustmentType: value as StockAdjustmentDraft['adjustmentType'] }))} />
        <NumberField label="Quantity" value={draft.quantity} onChange={(quantity) => setDraft((current) => ({ ...current, quantity }))} />
        <Field label="Reason" value={draft.reason} onChange={(reason) => setDraft((current) => ({ ...current, reason }))} />
        <Field type="date" label="Date" value={draft.date} onChange={(date) => setDraft((current) => ({ ...current, date }))} />
      </div>
      <label className="grid gap-1">
        <span className="text-xs font-medium text-slate-500">Notes</span>
        <textarea value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} className="min-h-20 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
      </label>
      <div className="rounded-sm bg-slate-50 p-3 text-sm text-slate-600">
        Current stock: <span className="font-semibold text-slate-950">{product?.currentStock ?? 0}</span>
      </div>
      <Button type="submit"><SlidersHorizontal className="h-4 w-4" />Apply adjustment</Button>
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
