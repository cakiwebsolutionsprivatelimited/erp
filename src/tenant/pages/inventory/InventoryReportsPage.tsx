import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, formatINR } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import {
  getDeadStockProducts,
  getFastMovingProducts,
  getPurchaseOrderTotal,
  getStockStatus,
} from '@/tenant/inventory/services/inventoryDemoService';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const InventoryReportsPage: React.FC = () => {
  const inventory = useInventoryData();
  const fastMovingProducts = getFastMovingProducts(inventory.products);
  const deadStockProducts = getDeadStockProducts(inventory.products);

  return (
    <div>
      <PageHeader
        title="Inventory Reports"
        description="Stock ledger, fast moving products, dead stock analysis, purchase report, and supplier purchase report."
        action={<Button variant="outline"><Download className="h-3.5 w-3.5" />Export Reports</Button>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReportCard title="Stock ledger" value={`${inventory.stockLedger.length} entries`} />
        <ReportCard title="Fast moving" value={`${fastMovingProducts.length} products`} />
        <ReportCard title="Dead stock" value={`${deadStockProducts.length} products`} />
        <ReportCard title="Product-wise profit" value="Placeholder" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div>
          <SectionTitle title="Fast moving products" />
          <DataTable headers={['Product', 'Category', 'Monthly Sales', 'Stock', 'Status']}>
            {fastMovingProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{product.name}</td>
                <td className="px-4 py-3 text-slate-600">{product.category}</td>
                <td className="px-4 py-3 text-slate-600">{product.monthlySales}</td>
                <td className="px-4 py-3 text-slate-600">{product.currentStock} {product.unit}</td>
                <td className="px-4 py-3"><InventoryStatusBadge status={getStockStatus(product)} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div>
          <SectionTitle title="Dead stock analysis" />
          <DataTable headers={['Product', 'Stock', 'Monthly Sales', 'Stock Value']}>
            {deadStockProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{product.name}</td>
                <td className="px-4 py-3 text-slate-600">{product.currentStock} {product.unit}</td>
                <td className="px-4 py-3 text-slate-600">{product.monthlySales}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{formatINR(product.currentStock * product.purchasePrice)}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div>
          <SectionTitle title="Purchase report" />
          <DataTable headers={['PO', 'Supplier', 'Date', 'Expected', 'Amount', 'Status']}>
            {inventory.purchaseOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{order.number}</td>
                <td className="px-4 py-3">{order.supplierName}</td>
                <td className="px-4 py-3 text-slate-600">{order.date}</td>
                <td className="px-4 py-3 text-slate-600">{order.expectedDelivery}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{formatINR(getPurchaseOrderTotal(order))}</td>
                <td className="px-4 py-3"><InventoryStatusBadge status={order.status} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div>
          <SectionTitle title="Supplier purchase report" />
          <DataTable headers={['Supplier', 'Orders', 'Purchase Value']}>
            {inventory.suppliers.map((supplier) => {
              const orders = inventory.purchaseOrders.filter((order) => order.supplierId === supplier.id);
              const value = orders.reduce((sum, order) => sum + getPurchaseOrderTotal(order), 0);
              return (
                <tr key={supplier.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{supplier.name}</td>
                  <td className="px-4 py-3 text-slate-600">{orders.length}</td>
                  <td className="px-4 py-3 font-medium text-slate-950">{formatINR(value)}</td>
                </tr>
              );
            })}
          </DataTable>
        </div>
      </section>
    </div>
  );
};

const ReportCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => <h2 className="mb-3 font-semibold text-slate-950">{title}</h2>;

export default InventoryReportsPage;
