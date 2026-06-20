import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Boxes, ClipboardList, FilePlus2, PackageCheck, Repeat, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, formatINR } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';
import {
  getCategoryDistribution,
  getFastMovingProducts,
  getInventoryMetrics,
  getPurchaseOrderTotal,
  getStockStatus,
} from '@/tenant/inventory/services/inventoryDemoService';

const InventoryDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const inventory = useInventoryData();
  const metrics = getInventoryMetrics(inventory);
  const categoryDistribution = getCategoryDistribution(inventory.products);
  const fastMovingProducts = getFastMovingProducts(inventory.products);
  const maxStockValue = Math.max(...inventory.products.map((product) => product.currentStock * product.purchasePrice), 1);
  const maxCategoryCount = Math.max(...Object.values(categoryDistribution), 1);

  return (
    <div>
      <PageHeader
        title="Inventory Dashboard"
        description="Products, stock health, purchase orders, suppliers, warehouses, and transfers."
        action={<Button onClick={() => navigate('/inventory/products/new')}><FilePlus2 className="h-4 w-4" />Create product</Button>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <MetricCard label="Total products" value={String(metrics.totalProducts)} hint="Catalogue records" icon={<PackageCheck className="h-4 w-4" />} />
        <MetricCard label="Low stock" value={String(metrics.lowStock)} hint="At reorder level" tone="warning" icon={<AlertTriangle className="h-4 w-4" />} />
        <MetricCard label="Out of stock" value={String(metrics.outOfStock)} hint="Needs purchase" tone="danger" />
        <MetricCard label="Stock value" value={formatINR(metrics.stockValue)} hint="Purchase value" />
        <MetricCard label="Purchase this month" value={formatINR(metrics.purchaseThisMonth)} hint="June POs" icon={<ShoppingBag className="h-4 w-4" />} />
        <MetricCard label="Pending POs" value={String(metrics.pendingPurchaseOrders)} hint="Draft, sent, partial" icon={<ClipboardList className="h-4 w-4" />} />
        <MetricCard label="Expiring batches" value={String(metrics.expiringBatches)} hint="Placeholder watchlist" tone="warning" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Stock value trend</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Today'].map((label, index) => {
              const value = Math.round(metrics.stockValue * (0.84 + index * 0.04));
              return (
                <div key={label} className="rounded-md bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{formatINR(value)}</p>
                  <div className="mt-3 h-16 rounded-sm bg-indigo-100">
                    <div className="mt-auto rounded-sm bg-indigo-600" style={{ height: `${45 + index * 10}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Category distribution</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(categoryDistribution).map(([category, count]) => (
              <Bar key={category} label={category} valueLabel={`${count} products`} percent={(count / maxCategoryCount) * 100} tone="bg-teal-600" />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Fast moving products</h2>
          <div className="mt-4 space-y-3">
            {fastMovingProducts.map((product) => (
              <Bar key={product.id} label={product.name} valueLabel={`${product.monthlySales} sold`} percent={(product.monthlySales / fastMovingProducts[0].monthlySales) * 100} tone="bg-emerald-600" />
            ))}
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Product stock value</h2>
          <div className="mt-4 space-y-3">
            {inventory.products.slice(0, 5).map((product) => {
              const value = product.currentStock * product.purchasePrice;
              return <Bar key={product.id} label={product.name} valueLabel={formatINR(value)} percent={(value / maxStockValue) * 100} tone="bg-cyan-600" />;
            })}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div>
          <SectionTitle title="Low stock watchlist" action={<Button size="sm" variant="outline" onClick={() => navigate('/inventory/stock')}>Open stock</Button>} />
          <DataTable headers={['Product', 'Current', 'Reorder', 'Status']}>
            {inventory.products.filter((product) => getStockStatus(product) !== 'In Stock').map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{product.name}</td>
                <td className="px-4 py-3 text-slate-600">{product.currentStock} {product.unit}</td>
                <td className="px-4 py-3 text-slate-600">{product.reorderLevel} {product.unit}</td>
                <td className="px-4 py-3"><InventoryStatusBadge status={getStockStatus(product)} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div>
          <SectionTitle title="Recent purchase orders" action={<Button size="sm" variant="outline" onClick={() => navigate('/inventory/purchase')}>View all</Button>} />
          <DataTable headers={['PO', 'Supplier', 'Expected', 'Amount', 'Status']}>
            {inventory.purchaseOrders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{order.number}</td>
                <td className="px-4 py-3">{order.supplierName}</td>
                <td className="px-4 py-3 text-slate-600">{order.expectedDelivery}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{formatINR(getPurchaseOrderTotal(order))}</td>
                <td className="px-4 py-3"><InventoryStatusBadge status={order.status} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>

      <section className="mt-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-950">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction label="Stock adjustment" icon={<Boxes className="h-4 w-4" />} onClick={() => navigate('/inventory/stock')} />
          <QuickAction label="Create purchase order" icon={<ShoppingBag className="h-4 w-4" />} onClick={() => navigate('/inventory/purchase/new')} />
          <QuickAction label="Add supplier" icon={<ClipboardList className="h-4 w-4" />} onClick={() => navigate('/inventory/suppliers')} />
          <QuickAction label="Transfer stock" icon={<Repeat className="h-4 w-4" />} onClick={() => navigate('/inventory/transfers')} />
        </div>
      </section>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; hint: string; tone?: 'default' | 'warning' | 'danger'; icon?: React.ReactNode }> = ({
  label,
  value,
  hint,
  tone = 'default',
  icon,
}) => {
  const toneClass = tone === 'danger' ? 'text-red-700' : tone === 'warning' ? 'text-amber-700' : 'text-slate-950';
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className={`mt-2 truncate text-xl font-semibold ${toneClass}`}>{value}</p>
        </div>
        {icon && <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700">{icon}</span>}
      </div>
      <p className="mt-3 text-xs text-slate-500">{hint}</p>
    </div>
  );
};

const Bar: React.FC<{ label: string; valueLabel: string; percent: number; tone: string }> = ({ label, valueLabel, percent, tone }) => (
  <div>
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="truncate font-medium text-slate-700">{label}</span>
      <span className="shrink-0 text-slate-500">{valueLabel}</span>
    </div>
    <div className="mt-2 h-2 rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.min(100, Math.max(4, percent))}%` }} />
    </div>
  </div>
);

const SectionTitle: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <h2 className="font-semibold text-slate-950">{title}</h2>
    {action}
  </div>
);

const QuickAction: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
  <Button variant="outline" className="h-14 justify-start" onClick={onClick}>
    {icon}
    {label}
  </Button>
);

export default InventoryDashboardPage;
