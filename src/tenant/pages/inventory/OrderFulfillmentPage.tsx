import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';
import type { InventoryFulfillmentOrder } from '@/tenant/inventory/types';

type FulfillmentView = 'Sales Orders' | 'Packages' | 'Delivery Challans' | 'Returns' | 'Backorders' | 'Dropshipment';

const views: FulfillmentView[] = ['Sales Orders', 'Packages', 'Delivery Challans', 'Returns', 'Backorders', 'Dropshipment'];

const OrderFulfillmentPage: React.FC = () => {
  const inventory = useInventoryData();
  const [view, setView] = useState<FulfillmentView>('Sales Orders');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();
  const openOrders = inventory.fulfillmentOrders.filter((order) => !['Delivered'].includes(order.fulfillmentStatus));
  const pendingBackorders = inventory.backorders.filter((backorder) => backorder.status !== 'Closed');
  const openReturns = inventory.salesReturns.filter((item) => item.status !== 'Closed');
  const dropshipInMotion = inventory.dropshipments.filter((item) => item.status !== 'Delivered');

  const fulfillmentOrders = useMemo(() => inventory.fulfillmentOrders.filter((order) =>
    !query || [order.salesOrderNumber, order.customerName, order.warehouseName, order.channel, order.fulfillmentStatus, order.pickListNumber, order.packageNumber, order.challanNumber].join(' ').toLowerCase().includes(query)
  ), [inventory.fulfillmentOrders, query]);

  const packages = useMemo(() => inventory.packages.filter((pkg) =>
    !query || [pkg.packageNumber, pkg.salesOrderNumber, pkg.customerName, pkg.warehouseName, pkg.carrier, pkg.trackingNumber, pkg.status].join(' ').toLowerCase().includes(query)
  ), [inventory.packages, query]);

  const challans = useMemo(() => inventory.deliveryChallans.filter((challan) =>
    !query || [challan.challanNumber, challan.salesOrderNumber, challan.customerName, challan.transporter, challan.vehicleNumber, challan.eWayBillNumber, challan.status].join(' ').toLowerCase().includes(query)
  ), [inventory.deliveryChallans, query]);

  const returns = useMemo(() => inventory.salesReturns.filter((item) =>
    !query || [item.returnNumber, item.salesOrderNumber, item.customerName, item.productName, item.reason, item.status].join(' ').toLowerCase().includes(query)
  ), [inventory.salesReturns, query]);

  const backorders = useMemo(() => inventory.backorders.filter((item) =>
    !query || [item.salesOrderNumber, item.customerName, item.productName, item.replenishmentSource, item.status].join(' ').toLowerCase().includes(query)
  ), [inventory.backorders, query]);

  const dropshipments = useMemo(() => inventory.dropshipments.filter((item) =>
    !query || [item.dropshipNumber, item.salesOrderNumber, item.customerName, item.supplierName, item.productName, item.purchaseOrderNumber, item.carrier, item.status].join(' ').toLowerCase().includes(query)
  ), [inventory.dropshipments, query]);

  return (
    <div>
      <PageHeader
        title="Order Fulfillment"
        description="Inventory-facing sales orders, packages, delivery challans, returns, backorders, and dropshipment previews."
        action={<Button variant="outline">Create package preview</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4 xl:grid-cols-6">
        <StatCard label="Fulfillment orders" value={String(inventory.fulfillmentOrders.length)} hint={`${openOrders.length} open`} />
        <StatCard label="Packages" value={String(inventory.packages.length)} hint="Packed/shipping units" />
        <StatCard label="Challans" value={String(inventory.deliveryChallans.length)} hint="Goods movement docs" />
        <StatCard label="Open returns" value={String(openReturns.length)} hint="Return workflow" />
        <StatCard label="Backorders" value={String(pendingBackorders.length)} hint="Awaiting stock" />
        <StatCard label="Dropships" value={String(dropshipInMotion.length)} hint="Supplier direct" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search order, package, challan, return, supplier..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Sales Orders' && (
        <DataTable headers={['Order', 'Customer/channel', 'Warehouse', 'Items', 'Allocation', 'Amount', 'Payment', 'Linked docs', 'Status']}>
          {fulfillmentOrders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3">
                <Link to="/sales/orders" className="font-medium text-indigo-700 hover:underline">{order.salesOrderNumber}</Link>
                <p className="text-xs text-slate-500">Order date {order.orderDate}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{order.customerName}</p>
                <p className="text-xs text-slate-500">{order.channel} · promised {order.promisedDate}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{order.warehouseName}</td>
              <td className="px-4 py-3"><OrderItems order={order} /></td>
              <td className="px-4 py-3"><AllocationBadge order={order} /></td>
              <td className="px-4 py-3 font-medium text-slate-950">{formatINR(order.amount)}</td>
              <td className="px-4 py-3"><PaymentBadge status={order.paymentStatus} /></td>
              <td className="px-4 py-3 text-xs text-slate-600">
                <p>{order.pickListNumber || '-'}</p>
                <p>{order.packageNumber || '-'}</p>
                <p>{order.challanNumber || '-'}</p>
              </td>
              <td className="px-4 py-3"><InventoryStatusBadge status={order.fulfillmentStatus} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Packages' && (
        <DataTable headers={['Package', 'Order/customer', 'Warehouse', 'Packed by', 'Dimensions', 'Weight', 'Carrier/tracking', 'Items', 'Status']}>
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-indigo-700">{pkg.packageNumber}</p>
                <p className="text-xs text-slate-500">{pkg.packageDate}</p>
              </td>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{pkg.salesOrderNumber}</p><p className="text-xs text-slate-500">{pkg.customerName}</p></td>
              <td className="px-4 py-3 text-slate-600">{pkg.warehouseName}</td>
              <td className="px-4 py-3 text-slate-600">{pkg.packedBy}</td>
              <td className="px-4 py-3 text-slate-600">{pkg.dimensions}</td>
              <td className="px-4 py-3 text-slate-600">{pkg.weightKg} kg</td>
              <td className="px-4 py-3 text-xs text-slate-600"><p>{pkg.carrier}</p><p>{pkg.trackingNumber}</p></td>
              <td className="px-4 py-3 font-medium text-slate-950">{pkg.itemCount}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={pkg.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Delivery Challans' && (
        <DataTable headers={['Challan', 'Order/customer', 'Issue date', 'Transporter', 'Vehicle', 'Place of supply', 'E-way bill', 'Status']}>
          {challans.map((challan) => (
            <tr key={challan.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{challan.challanNumber}</td>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{challan.salesOrderNumber}</p><p className="text-xs text-slate-500">{challan.customerName}</p></td>
              <td className="px-4 py-3 text-slate-600">{challan.issueDate}</td>
              <td className="px-4 py-3 text-slate-600">{challan.transporter}</td>
              <td className="px-4 py-3 text-slate-600">{challan.vehicleNumber}</td>
              <td className="px-4 py-3 text-slate-600">{challan.placeOfSupply}</td>
              <td className="px-4 py-3 text-slate-600">{challan.eWayBillNumber || 'Not required'}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={challan.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Returns' && (
        <DataTable headers={['Return', 'Order/customer', 'Product', 'Qty', 'Reason', 'Inspection', 'Refund', 'Status']}>
          {returns.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3"><p className="font-medium text-indigo-700">{item.returnNumber}</p><p className="text-xs text-slate-500">{item.returnDate}</p></td>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{item.salesOrderNumber}</p><p className="text-xs text-slate-500">{item.customerName}</p></td>
              <td className="px-4 py-3 text-slate-600">{item.productName}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{item.quantity}</td>
              <td className="px-4 py-3 text-slate-600">{item.reason}</td>
              <td className="px-4 py-3"><SmallBadge value={item.inspectionStatus} /></td>
              <td className="px-4 py-3"><SmallBadge value={item.refundStatus} /></td>
              <td className="px-4 py-3"><InventoryStatusBadge status={item.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Backorders' && (
        <DataTable headers={['Order/customer', 'Product', 'Ordered', 'Available', 'Backorder', 'Source', 'Expected', 'Status']}>
          {backorders.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{item.salesOrderNumber}</p><p className="text-xs text-slate-500">{item.customerName}</p></td>
              <td className="px-4 py-3 text-slate-600">{item.productName}</td>
              <td className="px-4 py-3 text-slate-600">{item.orderedQuantity}</td>
              <td className="px-4 py-3 text-slate-600">{item.availableQuantity}</td>
              <td className="px-4 py-3 font-medium text-red-700">{item.backorderedQuantity}</td>
              <td className="px-4 py-3 text-slate-600">{item.replenishmentSource}</td>
              <td className="px-4 py-3 text-slate-600">{item.expectedDate}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={item.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Dropshipment' && (
        <DataTable headers={['Dropship', 'Order/customer', 'Supplier', 'Product', 'PO', 'Ship to', 'Carrier/tracking', 'Status']}>
          {dropshipments.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{item.dropshipNumber}</td>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{item.salesOrderNumber}</p><p className="text-xs text-slate-500">{item.customerName}</p></td>
              <td className="px-4 py-3 text-slate-600">{item.supplierName}</td>
              <td className="px-4 py-3 text-slate-600">{item.productName}</td>
              <td className="px-4 py-3 text-slate-600">{item.purchaseOrderNumber}</td>
              <td className="px-4 py-3 text-slate-600">{item.shipToCity}</td>
              <td className="px-4 py-3 text-xs text-slate-600"><p>{item.carrier}</p><p>{item.trackingNumber}</p></td>
              <td className="px-4 py-3"><InventoryStatusBadge status={item.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const OrderItems: React.FC<{ order: InventoryFulfillmentOrder }> = ({ order }) => (
  <div className="space-y-1">
    {order.items.slice(0, 2).map((item) => (
      <p key={item.id} className="text-xs text-slate-600">{item.orderedQuantity} x {item.productName} · {item.warehouseBinCode}</p>
    ))}
    {order.items.length > 2 && <p className="text-xs text-slate-400">+{order.items.length - 2} more items</p>}
  </div>
);

const AllocationBadge: React.FC<{ order: InventoryFulfillmentOrder }> = ({ order }) => {
  const ordered = order.items.reduce((sum, item) => sum + item.orderedQuantity, 0);
  const allocated = order.items.reduce((sum, item) => sum + item.allocatedQuantity, 0);
  const packed = order.items.reduce((sum, item) => sum + item.packedQuantity, 0);
  const percent = Math.round((allocated / Math.max(1, ordered)) * 100);
  return <Badge className={percent === 100 ? 'bg-emerald-50 text-emerald-700' : percent > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}>{allocated}/{ordered} allocated · {packed} packed</Badge>;
};

const PaymentBadge: React.FC<{ status: InventoryFulfillmentOrder['paymentStatus'] }> = ({ status }) => {
  const tone = status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : status === 'Partially Paid' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';
  return <Badge className={tone}>{status}</Badge>;
};

const SmallBadge: React.FC<{ value: string }> = ({ value }) => {
  const tone = ['Accepted', 'Processed'].includes(value) ? 'bg-emerald-50 text-emerald-700' : value === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700';
  return <Badge className={tone}>{value}</Badge>;
};

export default OrderFulfillmentPage;
