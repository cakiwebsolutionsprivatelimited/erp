import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FilePlus2, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, SearchBar, StatCard, formatINR } from '@/tenant/components/TenantUI';
import { PurchaseOrderTable } from '@/tenant/inventory/components/PurchaseOrderTable';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';
import type { PurchaseOrderStatus } from '@/tenant/inventory/types';

const statuses: Array<'All' | PurchaseOrderStatus> = ['All', 'Draft', 'Sent', 'Received', 'Partially Received', 'Cancelled'];

const PurchasePage: React.FC = () => {
  const navigate = useNavigate();
  const inventory = useInventoryData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | PurchaseOrderStatus>('All');
  const openBillValue = inventory.vendorBills.filter((bill) => bill.status !== 'Paid' && bill.status !== 'Cancelled').reduce((sum, bill) => sum + bill.total, 0);
  const paidValue = inventory.vendorPayments.filter((payment) => payment.status === 'Paid' || payment.status === 'Reconciled').reduce((sum, payment) => sum + payment.amount, 0);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();
    return inventory.purchaseOrders.filter((order) => {
      const searchMatch = !query || [order.number, order.supplierName, order.status].join(' ').toLowerCase().includes(query);
      const statusMatch = status === 'All' || order.status === status;
      return searchMatch && statusMatch;
    });
  }, [inventory.purchaseOrders, search, status]);

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description="Create POs, track expected deliveries, receives, vendor bills, payments, and lifecycle status."
        action={(
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/inventory/purchase-operations')}><ReceiptText className="h-4 w-4" />Purchase Ops</Button>
            <Button onClick={() => navigate('/inventory/purchase/new')}><FilePlus2 className="h-4 w-4" />Create PO</Button>
          </div>
        )}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="POs" value={String(inventory.purchaseOrders.length)} hint="Purchase orders" />
        <StatCard label="Receives" value={String(inventory.purchaseReceives.length)} hint="GRN records" />
        <StatCard label="Open bill value" value={formatINR(openBillValue)} hint="Unpaid/vendor open" />
        <StatCard label="Paid" value={formatINR(paidValue)} hint="Paid or reconciled" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_220px_auto]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search PO, supplier, status..." />
          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-500">Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="flex items-end justify-end">
            <Button variant="outline"><Download className="h-3.5 w-3.5" />Export</Button>
          </div>
        </div>
      </section>

      <PurchaseOrderTable orders={filteredOrders} onReceive={inventory.markPurchaseReceived} />
    </div>
  );
};

export default PurchasePage;
