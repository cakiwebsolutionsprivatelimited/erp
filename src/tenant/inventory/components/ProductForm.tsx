import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InventoryItemGroup, InventoryProduct, InventoryTrackingType, ProductDraft, ProductStatus } from '@/tenant/inventory/types';

const categories = ['Hardware', 'Software', 'Inventory Supplies', 'Bundle', 'Warehouse', 'Networking'];
const units = ['Piece', 'Pack', 'Roll', 'Set', 'Kit', 'Year', 'Box'];
const gstRates = [0, 5, 12, 18, 28];
const trackingTypes: InventoryTrackingType[] = ['None', 'Serial', 'Batch', 'Serial + Batch'];

const createBlankProduct = (): ProductDraft => ({
  name: '',
  sku: '',
  barcode: '',
  category: 'Hardware',
  subcategory: '',
  unit: 'Piece',
  hsnCode: '',
  gstRate: 18,
  salePrice: 0,
  purchasePrice: 0,
  openingStock: 0,
  reorderLevel: 0,
  description: '',
  status: 'Active',
  imageLabel: 'Item',
  monthlySales: 0,
  trackingType: 'None',
  serialNumbers: [],
  batchNumber: '',
  expiryDate: '',
  warehouseLocation: '',
});

export const ProductForm: React.FC<{
  initialProduct?: InventoryProduct;
  itemGroups?: InventoryItemGroup[];
  onSubmit: (product: ProductDraft) => void;
  onCancel: () => void;
}> = ({ initialProduct, itemGroups = [], onSubmit, onCancel }) => {
  const [draft, setDraft] = useState<ProductDraft>(() => initialProduct ? { trackingType: 'None', serialNumbers: [], ...initialProduct, currentStock: initialProduct.currentStock } : createBlankProduct());
  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          ...draft,
          imageLabel: draft.imageLabel || draft.name || 'Item',
          monthlySales: Number(draft.monthlySales) || 0,
          salePrice: Number(draft.salePrice) || 0,
          purchasePrice: Number(draft.purchasePrice) || 0,
          openingStock: Number(draft.openingStock) || 0,
          currentStock: initialProduct?.currentStock,
          reorderLevel: Number(draft.reorderLevel) || 0,
          gstRate: Number(draft.gstRate) || 0,
          trackingType: draft.trackingType || 'None',
          serialNumbers: draft.serialNumbers || [],
          batchNumber: draft.batchNumber || '',
          expiryDate: draft.expiryDate || '',
          warehouseLocation: draft.warehouseLocation || '',
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Product name" value={draft.name} onChange={(value) => update('name', value)} required />
        <Field label="SKU" value={draft.sku} onChange={(value) => update('sku', value)} placeholder="Auto if blank" />
        <Field label="Barcode" value={draft.barcode} onChange={(value) => update('barcode', value)} />
        <Select label="Category" value={draft.category} options={categories} onChange={(value) => update('category', value)} />
        <Field label="Subcategory" value={draft.subcategory} onChange={(value) => update('subcategory', value)} />
        <Select
          label="Item group"
          value={draft.itemGroupName || 'Unassigned'}
          options={['Unassigned', ...itemGroups.map((group) => group.name)]}
          onChange={(value) => {
            const group = itemGroups.find((item) => item.name === value);
            update('itemGroupId', group?.id);
            update('itemGroupName', value === 'Unassigned' ? undefined : value);
          }}
        />
        <Select label="Unit" value={draft.unit} options={units} onChange={(value) => update('unit', value)} />
        <Field label="HSN code" value={draft.hsnCode} onChange={(value) => update('hsnCode', value)} />
        <Select label="GST rate" value={String(draft.gstRate)} options={gstRates.map(String)} suffix="%" onChange={(value) => update('gstRate', Number(value))} />
        <Select label="Status" value={draft.status} options={['Active', 'Inactive']} onChange={(value) => update('status', value as ProductStatus)} />
        <NumberField label="Sale price" value={draft.salePrice} onChange={(value) => update('salePrice', value)} />
        <NumberField label="Purchase price" value={draft.purchasePrice} onChange={(value) => update('purchasePrice', value)} />
        <NumberField label="Opening stock" value={draft.openingStock} onChange={(value) => update('openingStock', value)} />
        <NumberField label="Reorder level" value={draft.reorderLevel} onChange={(value) => update('reorderLevel', value)} />
        <NumberField label="Monthly sales" value={draft.monthlySales} onChange={(value) => update('monthlySales', value)} />
        <Field label="Image placeholder" value={draft.imageLabel} onChange={(value) => update('imageLabel', value)} />
        <Select label="Tracking type" value={draft.trackingType || 'None'} options={trackingTypes} onChange={(value) => update('trackingType', value as InventoryTrackingType)} />
        <Field label="Batch number" value={draft.batchNumber || ''} onChange={(value) => update('batchNumber', value)} />
        <Field label="Expiry date" type="date" value={draft.expiryDate || ''} onChange={(value) => update('expiryDate', value)} />
        <Field label="Warehouse/bin location" value={draft.warehouseLocation || ''} onChange={(value) => update('warehouseLocation', value)} />
      </div>
      <label className="grid gap-1">
        <span className="text-xs font-medium text-slate-500">Serial numbers</span>
        <textarea
          value={(draft.serialNumbers || []).join(', ')}
          onChange={(event) => update('serialNumbers', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
          placeholder="Comma-separated serials for serialized stock"
          className="min-h-20 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-medium text-slate-500">Description</span>
        <textarea
          value={draft.description}
          onChange={(event) => update('description', event.target.value)}
          className="min-h-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />
      </label>
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit"><Save className="h-4 w-4" />Save product</Button>
      </div>
    </form>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string }> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
    />
  </label>
);

const NumberField: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <input
      type="number"
      min="0"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
    />
  </label>
);

const Select: React.FC<{ label: string; value: string; options: string[]; onChange: (value: string) => void; suffix?: string }> = ({
  label,
  value,
  options,
  onChange,
  suffix = '',
}) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{option}{suffix}</option>)}
    </select>
  </label>
);
