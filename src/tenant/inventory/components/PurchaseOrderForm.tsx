import React, { useMemo, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR } from '@/tenant/components/TenantUI';
import { calculatePurchaseOrderTotals } from '@/tenant/inventory/services/inventoryDemoService';
import type { InventoryProduct, InventorySupplier, PurchaseOrderDraft, PurchaseOrderItem, PurchaseOrderStatus } from '@/tenant/inventory/types';

interface DraftItem {
  productId: string;
  quantity: number;
  rate: number;
  gstRate: number;
}

export const PurchaseOrderForm: React.FC<{
  products: InventoryProduct[];
  suppliers: InventorySupplier[];
  onSubmit: (order: PurchaseOrderDraft) => void;
  onCancel: () => void;
}> = ({ products, suppliers, onSubmit, onCancel }) => {
  const firstProduct = products[0];
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [date, setDate] = useState('2026-06-18');
  const [expectedDelivery, setExpectedDelivery] = useState('2026-06-25');
  const [status, setStatus] = useState<PurchaseOrderStatus>('Draft');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<DraftItem[]>([
    { productId: firstProduct?.id || '', quantity: 1, rate: firstProduct?.purchasePrice || 0, gstRate: firstProduct?.gstRate || 18 },
  ]);

  const orderItems = useMemo<PurchaseOrderItem[]>(() => items.flatMap((item, index) => {
    const product = products.find((productItem) => productItem.id === item.productId);
    return product
      ? [{ id: `POI-DRAFT-${index}`, productId: product.id, productName: product.name, quantity: Number(item.quantity) || 0, rate: Number(item.rate) || 0, gstRate: Number(item.gstRate) || 0 }]
      : [];
  }), [items, products]);
  const totals = calculatePurchaseOrderTotals(orderItems);

  const updateItem = (index: number, patch: Partial<DraftItem>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  return (
    <form
      className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ supplierId, date, expectedDelivery, status, notes, items: orderItems });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Select label="Supplier" value={supplierId} options={suppliers.map((supplier) => [supplier.id, supplier.name])} onChange={setSupplierId} />
        <Field type="date" label="Date" value={date} onChange={setDate} />
        <Field type="date" label="Expected delivery" value={expectedDelivery} onChange={setExpectedDelivery} />
        <Select label="Status" value={status} options={['Draft', 'Sent'].map((item) => [item, item])} onChange={(value) => setStatus(value as PurchaseOrderStatus)} />
      </div>

      <DataTable headers={['Product', 'Quantity', 'Rate', 'GST', 'Amount', '']}>
        {items.map((item, index) => {
          const product = products.find((productItem) => productItem.id === item.productId);
          const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
          return (
            <tr key={`${item.productId}-${index}`}>
              <td className="px-4 py-3">
                <select
                  value={item.productId}
                  onChange={(event) => {
                    const nextProduct = products.find((productItem) => productItem.id === event.target.value);
                    updateItem(index, {
                      productId: event.target.value,
                      rate: nextProduct?.purchasePrice || 0,
                      gstRate: nextProduct?.gstRate || 18,
                    });
                  }}
                  className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm outline-none focus:border-indigo-400"
                >
                  {products.map((productItem) => <option key={productItem.id} value={productItem.id}>{productItem.name}</option>)}
                </select>
                <p className="mt-1 text-xs text-slate-500">{product?.sku}</p>
              </td>
              <td className="px-4 py-3"><SmallNumber value={item.quantity} onChange={(quantity) => updateItem(index, { quantity })} /></td>
              <td className="px-4 py-3"><SmallNumber value={item.rate} onChange={(rate) => updateItem(index, { rate })} /></td>
              <td className="px-4 py-3"><SmallNumber value={item.gstRate} onChange={(gstRate) => updateItem(index, { gstRate })} /></td>
              <td className="px-4 py-3 font-medium text-slate-950">{formatINR(amount)}</td>
              <td className="px-4 py-3">
                <Button type="button" variant="ghost" size="icon" disabled={items.length === 1} onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={() => setItems((current) => [...current, { productId: firstProduct?.id || '', quantity: 1, rate: firstProduct?.purchasePrice || 0, gstRate: firstProduct?.gstRate || 18 }])}>
          <Plus className="h-4 w-4" />
          Add item
        </Button>
        <div className="text-right text-sm">
          <p className="text-slate-500">Subtotal {formatINR(totals.subtotal)}</p>
          <p className="text-slate-500">GST {formatINR(totals.tax)}</p>
          <p className="text-base font-semibold text-slate-950">Total {formatINR(totals.total)}</p>
        </div>
      </div>

      <label className="grid gap-1">
        <span className="text-xs font-medium text-slate-500">Notes</span>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-20 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
      </label>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit"><Save className="h-4 w-4" />Create PO</Button>
      </div>
    </form>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
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

const SmallNumber: React.FC<{ value: number; onChange: (value: number) => void }> = ({ value, onChange }) => (
  <input type="number" min="0" value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-9 w-24 rounded-md border border-slate-200 bg-white px-2 text-sm outline-none focus:border-indigo-400" />
);
