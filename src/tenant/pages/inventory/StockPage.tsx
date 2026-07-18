import React, { useMemo, useState } from 'react';
import { Download, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { StockAdjustmentForm } from '@/tenant/inventory/components/StockAdjustmentForm';
import { getDeadStockProducts, getStockStatus } from '@/tenant/inventory/services/inventoryDemoService';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

type StockView = 'Current Stock' | 'Stock Ledger' | 'Low Stock' | 'Dead Stock';

const StockPage: React.FC = () => {
  const inventory = useInventoryData();
  const [view, setView] = useState<StockView>('Current Stock');
  const [search, setSearch] = useState('');
  const [adjustOpen, setAdjustOpen] = useState(false);
  const lowStockProducts = inventory.products.filter((product) => getStockStatus(product) !== 'In Stock');
  const deadStockProducts = getDeadStockProducts(inventory.products);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    const source = view === 'Low Stock' ? lowStockProducts : view === 'Dead Stock' ? deadStockProducts : inventory.products;
    return source.filter((product) => !query || [product.name, product.sku, product.category].join(' ').toLowerCase().includes(query));
  }, [deadStockProducts, inventory.products, lowStockProducts, search, view]);

  const filteredLedger = useMemo(() => {
    const query = search.toLowerCase().trim();
    return inventory.stockLedger.filter((entry) => !query || [entry.productName, entry.warehouseName, entry.type, entry.reference].join(' ').toLowerCase().includes(query));
  }, [inventory.stockLedger, search]);

  return (
    <div>
      <PageHeader
        title="Stock"
        description="Review current stock, ledger movements, low stock, dead stock, and apply stock adjustments."
        action={<Button onClick={() => setAdjustOpen(true)}><SlidersHorizontal className="h-4 w-4" />Stock Adjustment</Button>}
      />

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search product, SKU, warehouse, reference..." />
            <Button variant="outline"><Download className="h-3.5 w-3.5" />Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['Current Stock', 'Stock Ledger', 'Low Stock', 'Dead Stock'] as StockView[]).map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Stock Ledger' ? (
        <DataTable headers={['Date', 'Product', 'Warehouse', 'Type', 'In', 'Out', 'Balance', 'Reference']}>
          {filteredLedger.map((entry) => (
            <tr key={entry.id}>
              <td className="px-4 py-3 text-slate-600">{entry.date}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{entry.productName}</td>
              <td className="px-4 py-3 text-slate-600">{entry.warehouseName}</td>
              <td className="px-4 py-3 text-slate-600">{entry.type}</td>
              <td className="px-4 py-3 text-emerald-700">{entry.quantityIn || '-'}</td>
              <td className="px-4 py-3 text-red-700">{entry.quantityOut || '-'}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{entry.balanceAfter}</td>
              <td className="px-4 py-3 text-slate-600">{entry.reference}</td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <DataTable headers={['Product', 'SKU', 'Category', 'Current', 'Reorder', 'Warehouse', 'Status']}>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{product.name}</td>
              <td className="px-4 py-3 text-slate-600">{product.sku}</td>
              <td className="px-4 py-3 text-slate-600">{product.category}</td>
              <td className="px-4 py-3 font-semibold text-slate-950">{product.currentStock} {product.unit}</td>
              <td className="px-4 py-3 text-slate-600">{product.reorderLevel} {product.unit}</td>
              <td className="px-4 py-3 text-slate-600">{inventory.warehouses[0]?.name || 'Main Warehouse'}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={getStockStatus(product)} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Stock adjustment</DialogTitle>
            <DialogDescription>Add or reduce stock and create a local stock ledger movement.</DialogDescription>
          </DialogHeader>
          <StockAdjustmentForm products={inventory.products} warehouses={inventory.warehouses} onSubmit={(adjustment) => { inventory.adjustStock(adjustment); setAdjustOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockPage;
