import React, { useMemo, useState } from 'react';
import { AlertTriangle, Barcode, CalendarClock, Copy, MapPin, SearchCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { getStockStatus } from '@/tenant/inventory/services/inventoryDemoService';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';
import type { InventoryProduct } from '@/tenant/inventory/types';

const InventoryTrackingPage: React.FC = () => {
  const inventory = useInventoryData();
  const [search, setSearch] = useState('');
  const [scanValue, setScanValue] = useState('');
  const [selectedId, setSelectedId] = useState(inventory.products.find((product) => product.trackingType && product.trackingType !== 'None')?.id || inventory.products[0]?.id || '');
  const query = search.toLowerCase().trim();

  const trackedProducts = inventory.products.filter((product) => product.trackingType && product.trackingType !== 'None');
  const batchProducts = inventory.products.filter((product) => product.trackingType === 'Batch' || product.trackingType === 'Serial + Batch');
  const serialCount = inventory.products.reduce((sum, product) => sum + (product.serialNumbers?.length || 0), 0);
  const expiringProducts = batchProducts.filter((product) => product.expiryDate && product.expiryDate <= '2027-12-31');
  const selected = inventory.products.find((product) => product.id === selectedId) || trackedProducts[0] || inventory.products[0];

  const filteredProducts = useMemo(() => inventory.products.filter((product) =>
    !query || [product.name, product.sku, product.barcode, product.batchNumber, product.warehouseLocation, product.serialNumbers?.join(' ')].join(' ').toLowerCase().includes(query)
  ), [inventory.products, query]);

  const scannedProduct = inventory.products.find((product) =>
    product.barcode === scanValue.trim() ||
    product.sku.toLowerCase() === scanValue.trim().toLowerCase() ||
    product.serialNumbers?.some((serial) => serial.toLowerCase() === scanValue.trim().toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Serial, Batch & Barcode"
        description="Track serialized units, batches, expiry dates, barcode labels, and warehouse bin locations."
        action={<Button variant="outline"><Barcode className="h-4 w-4" />Generate barcodes</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Tracked SKUs" value={String(trackedProducts.length)} hint="Serial or batch enabled" icon={<SearchCheck className="h-4 w-4" />} />
        <StatCard label="Serial units" value={String(serialCount)} hint="Seeded serials" />
        <StatCard label="Batch items" value={String(batchProducts.length)} hint="Batch/expiry enabled" icon={<CalendarClock className="h-4 w-4" />} />
        <StatCard label="Expiry watch" value={String(expiringProducts.length)} hint="Due before 2028" icon={<AlertTriangle className="h-4 w-4" />} />
      </section>

      <section className="mb-5 grid gap-5 xl:grid-cols-[420px_1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Barcode lookup</h2>
          <div className="mt-3 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-500">Barcode, SKU, or serial</span>
              <input
                value={scanValue}
                onChange={(event) => setScanValue(event.target.value)}
                placeholder="Try 8901234500011 or SCN-USB-2601"
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <Button
              type="button"
              onClick={() => scannedProduct && setSelectedId(scannedProduct.id)}
              disabled={!scannedProduct}
            >
              <SearchCheck className="h-4 w-4" />
              Load item
            </Button>
            <div className={`rounded-md border p-3 text-sm ${scannedProduct ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              {scanValue.trim() ? scannedProduct ? `${scannedProduct.name} found in ${scannedProduct.warehouseLocation || 'default warehouse'}` : 'No matching item in local data' : 'Ready for lookup'}
            </div>
          </div>
        </div>

        {selected && <TrackingDetail product={selected} />}
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search product, serial, batch, barcode, location..." />
      </section>

      <DataTable headers={['Product', 'Barcode', 'Tracking', 'Serials', 'Batch', 'Expiry', 'Location', 'Stock', 'Status']}>
        {filteredProducts.map((product) => (
          <tr key={product.id} className={selected?.id === product.id ? 'bg-indigo-50/50' : undefined}>
            <td className="px-4 py-3">
              <button className="text-left font-medium text-indigo-700 hover:underline" onClick={() => setSelectedId(product.id)}>{product.name}</button>
              <p className="text-xs text-slate-500">{product.sku}</p>
            </td>
            <td className="px-4 py-3 font-mono text-xs text-slate-600">{product.barcode}</td>
            <td className="px-4 py-3"><TrackingBadge value={product.trackingType || 'None'} /></td>
            <td className="px-4 py-3 text-slate-600">{product.serialNumbers?.length || '-'}</td>
            <td className="px-4 py-3 text-slate-600">{product.batchNumber || '-'}</td>
            <td className="px-4 py-3 text-slate-600">{product.expiryDate || '-'}</td>
            <td className="px-4 py-3 text-slate-600">{product.warehouseLocation || 'Main warehouse'}</td>
            <td className="px-4 py-3 font-medium text-slate-950">{product.currentStock} {product.unit}</td>
            <td className="px-4 py-3"><InventoryStatusBadge status={getStockStatus(product)} /></td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

const TrackingDetail: React.FC<{ product: InventoryProduct }> = ({ product }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{product.sku}</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">{product.name}</h2>
        <p className="mt-1 text-sm text-slate-500">{product.itemGroupName || product.category}</p>
      </div>
      <TrackingBadge value={product.trackingType || 'None'} />
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <Signal label="Barcode" value={product.barcode} icon={<Barcode className="h-4 w-4" />} mono />
      <Signal label="Batch" value={product.batchNumber || 'Not tracked'} />
      <Signal label="Expiry" value={product.expiryDate || 'Not tracked'} />
      <Signal label="Location" value={product.warehouseLocation || 'Main warehouse'} icon={<MapPin className="h-4 w-4" />} />
      <Signal label="Current stock" value={`${product.currentStock} ${product.unit}`} />
      <Signal label="Reorder level" value={`${product.reorderLevel} ${product.unit}`} />
    </div>

    <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Barcode label</p>
          <p className="mt-2 font-mono text-xl font-semibold tracking-[0.24em] text-slate-950">{product.barcode}</p>
        </div>
        <Button variant="outline" size="sm"><Copy className="h-3.5 w-3.5" />Copy code</Button>
      </div>
    </div>

    <div className="mt-4">
      <p className="mb-2 text-sm font-semibold text-slate-950">Serial numbers</p>
      {product.serialNumbers?.length ? (
        <div className="flex flex-wrap gap-2">
          {product.serialNumbers.map((serial) => <Badge key={serial} variant="outline" className="font-mono">{serial}</Badge>)}
        </div>
      ) : (
        <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">No serials assigned</p>
      )}
    </div>
  </div>
);

const Signal: React.FC<{ label: string; value: string; icon?: React.ReactNode; mono?: boolean }> = ({ label, value, icon, mono }) => (
  <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">{icon}{label}</p>
    <p className={`mt-1 text-sm font-semibold text-slate-950 ${mono ? 'font-mono' : ''}`}>{value}</p>
  </div>
);

const TrackingBadge: React.FC<{ value: string }> = ({ value }) => {
  const className = value === 'Serial'
    ? 'bg-blue-50 text-blue-700'
    : value === 'Batch'
      ? 'bg-amber-50 text-amber-700'
      : value === 'Serial + Batch'
        ? 'bg-indigo-50 text-indigo-700'
        : 'bg-slate-100 text-slate-600';
  return <Badge className={className}>{value}</Badge>;
};

export default InventoryTrackingPage;
