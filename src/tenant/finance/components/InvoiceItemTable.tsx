import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InvoiceItem, InvoiceTotals } from '@/tenant/finance/types';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';

interface InvoiceItemTableProps {
  items: InvoiceItem[];
  totals: InvoiceTotals;
  onChange: (items: InvoiceItem[]) => void;
}

const units = ['Project', 'Month', 'Piece', 'Hour', 'Service', 'License'];
const gstRates = [0, 5, 12, 18, 28];

export const InvoiceItemTable: React.FC<InvoiceItemTableProps> = ({ items, totals, onChange }) => {
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        id: `FIT-${Date.now()}`,
        productName: 'Monthly Support Plan',
        hsnSac: '998314',
        quantity: 1,
        unit: 'Month',
        rate: 12000,
        discount: 0,
        gstRate: 18,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-950">Invoice items</h2>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>Add item</Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const line = totals.lines.find((entry) => entry.itemId === item.id);
          return (
            <div key={item.id} className="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 xl:grid-cols-[1.4fr_110px_90px_120px_120px_100px_120px_110px_44px]">
              <Field label="Product/service" value={item.productName} onChange={(value) => updateItem(item.id, 'productName', value)} />
              <Field label="HSN/SAC" value={item.hsnSac} onChange={(value) => updateItem(item.id, 'hsnSac', value)} />
              <Field label="Qty" value={String(item.quantity)} type="number" onChange={(value) => updateItem(item.id, 'quantity', Number(value))} />
              <Select label="Unit" value={item.unit} options={units} onChange={(value) => updateItem(item.id, 'unit', value)} />
              <Field label="Rate" value={String(item.rate)} type="number" onChange={(value) => updateItem(item.id, 'rate', Number(value))} />
              <Field label="Discount" value={String(item.discount)} type="number" onChange={(value) => updateItem(item.id, 'discount', Number(value))} />
              <Select label="GST %" value={String(item.gstRate)} options={gstRates.map(String)} onChange={(value) => updateItem(item.id, 'gstRate', Number(value))} />
              <div className="text-sm">
                <span className="text-xs font-medium text-slate-500">Line total</span>
                <AmountDisplay value={line?.lineTotal ?? 0} className="mt-2 block" />
              </div>
              <Button type="button" variant="ghost" size="icon-sm" className="self-end" disabled={items.length === 1} onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
        <Total label="Taxable" value={totals.taxableTotal} />
        <Total label="CGST + SGST" value={totals.cgst + totals.sgst} />
        <Total label="IGST" value={totals.igst} />
        <Total label="Grand total" value={totals.grandTotal} strong />
      </div>
    </section>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string }> = ({
  label,
  value,
  onChange,
  type = 'text',
}) => (
  <label className="grid gap-1.5">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <input
      type={type}
      value={value}
      min={type === 'number' ? 0 : undefined}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
    />
  </label>
);

const Select: React.FC<{ label: string; value: string; options: string[]; onChange: (value: string) => void }> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <label className="grid gap-1.5">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

const Total: React.FC<{ label: string; value: number; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="rounded-md bg-slate-50 px-3 py-2">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <AmountDisplay value={value} className={strong ? 'mt-1 block text-base' : 'mt-1 block'} />
  </div>
);
