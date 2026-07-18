import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { getPurchaseOrderTotal } from '@/tenant/inventory/services/inventoryDemoService';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';
import type { PurchaseOrder, VendorBill } from '@/tenant/inventory/types';

type PurchaseOpsView = 'Lifecycle' | 'Receives' | 'Vendor Bills' | 'Payments Made';
type LifecycleStage = 'Ordered' | 'Received' | 'Billed' | 'Paid';

const views: PurchaseOpsView[] = ['Lifecycle', 'Receives', 'Vendor Bills', 'Payments Made'];
const lifecycleStages: LifecycleStage[] = ['Ordered', 'Received', 'Billed', 'Paid'];

const PurchaseOperationsPage: React.FC = () => {
  const inventory = useInventoryData();
  const [view, setView] = useState<PurchaseOpsView>('Lifecycle');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();
  const pendingBills = inventory.vendorBills.filter((bill) => ['Draft', 'Pending Approval', 'Approved', 'Overdue'].includes(bill.status));
  const scheduledPayments = inventory.vendorPayments.filter((payment) => payment.status === 'Scheduled');
  const qualityHolds = inventory.purchaseReceives.filter((receive) => receive.status === 'Quality Hold');
  const lifecycle = useMemo(() => inventory.purchaseOrders.map((order) => createLifecycleRecord(order, inventory.vendorBills, inventory.vendorPayments, inventory.purchaseReceives)), [inventory.purchaseOrders, inventory.purchaseReceives, inventory.vendorBills, inventory.vendorPayments]);

  const filteredLifecycle = lifecycle.filter((record) =>
    !query || [record.order.number, record.order.supplierName, record.stage, record.receiveNumber, record.billNumber, record.paymentStatus].join(' ').toLowerCase().includes(query)
  );

  const receives = inventory.purchaseReceives.filter((receive) =>
    !query || [receive.receiveNumber, receive.purchaseOrderNumber, receive.supplierName, receive.warehouseName, receive.receivedBy, receive.status, receive.inspectionNote].join(' ').toLowerCase().includes(query)
  );

  const bills = inventory.vendorBills.filter((bill) =>
    !query || [bill.billNumber, bill.purchaseOrderNumber, bill.supplierName, bill.status].join(' ').toLowerCase().includes(query)
  );

  const payments = inventory.vendorPayments.filter((payment) =>
    !query || [payment.paymentNumber, payment.billNumber, payment.supplierName, payment.mode, payment.reference, payment.status].join(' ').toLowerCase().includes(query)
  );

  return (
    <div>
      <PageHeader
        title="Purchase Operations"
        description="Track purchase receives, vendor bills, payments made, and PO lifecycle from ordered to paid."
        action={<Button variant="outline">Create receive preview</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Purchase orders" value={String(inventory.purchaseOrders.length)} hint="Ordered pipeline" />
        <StatCard label="Receives" value={String(inventory.purchaseReceives.length)} hint={`${qualityHolds.length} quality hold`} />
        <StatCard label="Pending bills" value={String(pendingBills.length)} hint="Draft/approval/open" />
        <StatCard label="Scheduled payments" value={String(scheduledPayments.length)} hint="Payment queue" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search PO, receive, bill, payment, supplier..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Lifecycle' && (
        <section className="grid gap-4 xl:grid-cols-4">
          {lifecycleStages.map((stage) => (
            <div key={stage} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-semibold text-slate-950">{stage}</h2>
                <Badge variant="secondary">{filteredLifecycle.filter((record) => record.stage === stage).length}</Badge>
              </div>
              <div className="space-y-3">
                {filteredLifecycle.filter((record) => record.stage === stage).map((record) => (
                  <LifecycleCard key={record.order.id} record={record} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {view === 'Receives' && (
        <DataTable headers={['Receive', 'PO/supplier', 'Warehouse', 'Items', 'Accepted/rejected', 'Received by', 'Inspection', 'Status']}>
          {receives.map((receive) => {
            const accepted = receive.items.reduce((sum, item) => sum + item.acceptedQuantity, 0);
            const rejected = receive.items.reduce((sum, item) => sum + item.rejectedQuantity, 0);
            return (
              <tr key={receive.id}>
                <td className="px-4 py-3"><p className="font-medium text-indigo-700">{receive.receiveNumber}</p><p className="text-xs text-slate-500">{receive.receiveDate}</p></td>
                <td className="px-4 py-3"><p className="font-medium text-slate-950">{receive.purchaseOrderNumber}</p><p className="text-xs text-slate-500">{receive.supplierName}</p></td>
                <td className="px-4 py-3 text-slate-600">{receive.warehouseName}</td>
                <td className="px-4 py-3"><ReceiveItems receive={receive} /></td>
                <td className="px-4 py-3"><Badge className={rejected > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}>{accepted} accepted · {rejected} rejected</Badge></td>
                <td className="px-4 py-3 text-slate-600">{receive.receivedBy}</td>
                <td className="px-4 py-3 text-slate-600">{receive.inspectionNote}</td>
                <td className="px-4 py-3"><InventoryStatusBadge status={receive.status} /></td>
              </tr>
            );
          })}
        </DataTable>
      )}

      {view === 'Vendor Bills' && (
        <DataTable headers={['Bill', 'PO/supplier', 'Bill date', 'Due date', 'Received value', 'Subtotal', 'Tax', 'Total', 'Status']}>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{bill.billNumber}</td>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{bill.purchaseOrderNumber}</p><p className="text-xs text-slate-500">{bill.supplierName}</p></td>
              <td className="px-4 py-3 text-slate-600">{bill.billDate}</td>
              <td className="px-4 py-3 text-slate-600">{bill.dueDate}</td>
              <td className="px-4 py-3 text-slate-600">{formatINR(bill.receivedAmount)}</td>
              <td className="px-4 py-3 text-slate-600">{formatINR(bill.subtotal)}</td>
              <td className="px-4 py-3 text-slate-600">{formatINR(bill.tax)}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{formatINR(bill.total)}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={bill.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Payments Made' && (
        <DataTable headers={['Payment', 'Bill/supplier', 'Date', 'Amount', 'Mode', 'Reference', 'Status']}>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{payment.paymentNumber}</td>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{payment.billNumber}</p><p className="text-xs text-slate-500">{payment.supplierName}</p></td>
              <td className="px-4 py-3 text-slate-600">{payment.paymentDate}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{formatINR(payment.amount)}</td>
              <td className="px-4 py-3 text-slate-600">{payment.mode}</td>
              <td className="px-4 py-3 text-slate-600">{payment.reference}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={payment.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const createLifecycleRecord = (order: PurchaseOrder, bills: VendorBill[], payments: ReturnType<typeof useInventoryData>['vendorPayments'], receives: ReturnType<typeof useInventoryData>['purchaseReceives']) => {
  const receive = receives.find((item) => item.purchaseOrderId === order.id);
  const bill = bills.find((item) => item.purchaseOrderId === order.id);
  const billPayments = bill ? payments.filter((payment) => payment.vendorBillId === bill.id) : [];
  const paidAmount = billPayments.filter((payment) => ['Paid', 'Reconciled'].includes(payment.status)).reduce((sum, payment) => sum + payment.amount, 0);
  const stage: LifecycleStage = bill && (bill.status === 'Paid' || paidAmount >= bill.total)
    ? 'Paid'
    : bill && bill.status !== 'Draft'
      ? 'Billed'
      : receive
        ? 'Received'
        : 'Ordered';
  return {
    order,
    receiveNumber: receive?.receiveNumber || '',
    billNumber: bill?.billNumber || '',
    paymentStatus: billPayments[0]?.status || 'Not scheduled',
    paidAmount,
    stage,
  };
};

const LifecycleCard: React.FC<{ record: ReturnType<typeof createLifecycleRecord> }> = ({ record }) => (
  <article className="rounded-md border border-slate-100 bg-slate-50 p-3">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-medium text-slate-950">{record.order.number}</p>
        <p className="mt-1 text-xs text-slate-500">{record.order.supplierName}</p>
      </div>
      <InventoryStatusBadge status={record.order.status} />
    </div>
    <div className="mt-3 grid gap-2 text-xs text-slate-600">
      <p>Expected: {record.order.expectedDelivery}</p>
      <p>Amount: {formatINR(getPurchaseOrderTotal(record.order))}</p>
      <p>Receive: {record.receiveNumber || '-'}</p>
      <p>Bill: {record.billNumber || '-'}</p>
      <p>Payment: {record.paymentStatus}</p>
    </div>
  </article>
);

const ReceiveItems: React.FC<{ receive: ReturnType<typeof useInventoryData>['purchaseReceives'][number] }> = ({ receive }) => (
  <div className="space-y-1">
    {receive.items.slice(0, 2).map((item) => (
      <p key={item.id} className="text-xs text-slate-600">{item.receivedQuantity}/{item.orderedQuantity} {item.productName} · {item.warehouseBinCode}</p>
    ))}
    {receive.items.length > 2 && <p className="text-xs text-slate-400">+{receive.items.length - 2} more items</p>}
  </div>
);

export default PurchaseOperationsPage;
