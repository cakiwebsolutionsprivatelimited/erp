import React, { useMemo, useState } from 'react';
import { AlertTriangle, ClipboardList, MapPinned, Repeat, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';
import type { PickList, PickListPriority } from '@/tenant/inventory/types';

type OperationsView = 'Bins & Locations' | 'Pick Lists' | 'Restrictions' | 'In Transit';

const views: OperationsView[] = ['Bins & Locations', 'Pick Lists', 'Restrictions', 'In Transit'];

const WarehouseOperationsPage: React.FC = () => {
  const inventory = useInventoryData();
  const [view, setView] = useState<OperationsView>('Bins & Locations');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();
  const inTransitTransfers = inventory.transfers.filter((transfer) => transfer.status === 'In Transit');
  const activePickLists = inventory.pickLists.filter((pickList) => pickList.status !== 'Completed');
  const restrictedBins = inventory.warehouseBins.filter((bin) => bin.status === 'Restricted' || bin.status === 'Maintenance');

  const filteredBins = useMemo(() => inventory.warehouseBins.filter((bin) =>
    !query || [bin.warehouseName, bin.code, bin.zone, bin.aisle, bin.assignedTo, bin.status].join(' ').toLowerCase().includes(query)
  ), [inventory.warehouseBins, query]);

  const filteredPickLists = useMemo(() => inventory.pickLists.filter((pickList) =>
    !query || [pickList.number, pickList.salesOrderNumber, pickList.customerName, pickList.warehouseName, pickList.assignedTo, pickList.status].join(' ').toLowerCase().includes(query)
  ), [inventory.pickLists, query]);

  const filteredRestrictions = useMemo(() => inventory.warehouseRestrictions.filter((restriction) =>
    !query || [restriction.role, restriction.warehouseNames.join(' '), restriction.permissions.join(' '), restriction.status].join(' ').toLowerCase().includes(query)
  ), [inventory.warehouseRestrictions, query]);

  const filteredTransfers = useMemo(() => inventory.transfers.filter((transfer) =>
    !query || [transfer.number, transfer.productName, transfer.fromWarehouseName, transfer.toWarehouseName, transfer.sourceBinCode, transfer.destinationBinCode, transfer.requestedBy, transfer.carrier, transfer.status].join(' ').toLowerCase().includes(query)
  ), [inventory.transfers, query]);

  return (
    <div>
      <PageHeader
        title="Warehouse Operations"
        description="Manage bins, location capacity, pick lists, warehouse restrictions, and in-transit stock visibility."
        action={<Button variant="outline"><ClipboardList className="h-4 w-4" />Create pick wave</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Bins" value={String(inventory.warehouseBins.length)} hint="Across locations" icon={<MapPinned className="h-4 w-4" />} />
        <StatCard label="Active pick lists" value={String(activePickLists.length)} hint="Open fulfilment work" icon={<ClipboardList className="h-4 w-4" />} />
        <StatCard label="In transit" value={String(inTransitTransfers.length)} hint="Transfer orders moving" icon={<Repeat className="h-4 w-4" />} />
        <StatCard label="Restricted/hold" value={String(restrictedBins.length)} hint="Secure or maintenance bins" icon={<AlertTriangle className="h-4 w-4" />} />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search warehouse, bin, pick list, role, transfer..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Bins & Locations' && (
        <DataTable headers={['Bin', 'Warehouse', 'Zone', 'Aisle', 'Capacity', 'SKUs', 'Pick sequence', 'Assigned to', 'Status']}>
          {filteredBins.map((bin) => (
            <tr key={bin.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{bin.code}</td>
              <td className="px-4 py-3 text-slate-600">{bin.warehouseName}</td>
              <td className="px-4 py-3 text-slate-600">{bin.zone}</td>
              <td className="px-4 py-3 text-slate-600">{bin.aisle}</td>
              <td className="px-4 py-3">
                <CapacityBar value={bin.capacityUtilization} />
              </td>
              <td className="px-4 py-3 font-medium text-slate-950">{bin.currentSkuCount}</td>
              <td className="px-4 py-3 text-slate-600">{bin.pickSequence}</td>
              <td className="px-4 py-3 text-slate-600">{bin.assignedTo}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={bin.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Pick Lists' && (
        <DataTable headers={['Pick list', 'Order/customer', 'Warehouse', 'Items', 'Progress', 'Assignee', 'Due', 'Priority', 'Status']}>
          {filteredPickLists.map((pickList) => (
            <tr key={pickList.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{pickList.number}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{pickList.salesOrderNumber}</p>
                <p className="text-xs text-slate-500">{pickList.customerName}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{pickList.warehouseName}</td>
              <td className="px-4 py-3">
                <PickItems pickList={pickList} />
              </td>
              <td className="px-4 py-3"><ProgressPill pickList={pickList} /></td>
              <td className="px-4 py-3 text-slate-600">{pickList.assignedTo}</td>
              <td className="px-4 py-3 text-slate-600">{pickList.dueDate}</td>
              <td className="px-4 py-3"><PriorityBadge priority={pickList.priority} /></td>
              <td className="px-4 py-3"><InventoryStatusBadge status={pickList.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Restrictions' && (
        <DataTable headers={['Role', 'Warehouses', 'Permissions', 'Status']}>
          {filteredRestrictions.map((restriction) => (
            <tr key={restriction.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{restriction.role}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500"><ShieldCheck className="h-3 w-3" />Access preview only</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{restriction.warehouseNames.join(', ')}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {restriction.permissions.map((permission) => <Badge key={permission} variant="outline">{permission}</Badge>)}
                </div>
              </td>
              <td className="px-4 py-3"><InventoryStatusBadge status={restriction.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'In Transit' && (
        <DataTable headers={['Transfer', 'Product', 'From', 'To', 'Qty', 'Bins', 'ETA', 'Carrier', 'Requested by', 'Priority', 'Status']}>
          {filteredTransfers.map((transfer) => (
            <tr key={transfer.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{transfer.number}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{transfer.productName}</td>
              <td className="px-4 py-3 text-slate-600">{transfer.fromWarehouseName}</td>
              <td className="px-4 py-3 text-slate-600">{transfer.toWarehouseName}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{transfer.quantity}</td>
              <td className="px-4 py-3 text-xs text-slate-600">
                <p>{transfer.sourceBinCode || '-'}</p>
                <p>{transfer.destinationBinCode || '-'}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{transfer.expectedArrival || transfer.transferDate}</td>
              <td className="px-4 py-3 text-slate-600">{transfer.carrier || 'Internal'}</td>
              <td className="px-4 py-3 text-slate-600">{transfer.requestedBy || '-'}</td>
              <td className="px-4 py-3"><PriorityBadge priority={transfer.priority || 'Medium'} /></td>
              <td className="px-4 py-3"><InventoryStatusBadge status={transfer.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const CapacityBar: React.FC<{ value: number }> = ({ value }) => {
  const tone = value >= 85 ? 'bg-amber-500' : value >= 65 ? 'bg-blue-500' : 'bg-emerald-500';
  return (
    <div className="min-w-36">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-slate-700">{value}%</span>
        <span className="text-slate-400">capacity</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.min(100, Math.max(4, value))}%` }} />
      </div>
    </div>
  );
};

const PickItems: React.FC<{ pickList: PickList }> = ({ pickList }) => (
  <div className="space-y-1">
    {pickList.items.slice(0, 2).map((item) => (
      <p key={item.id} className="text-xs text-slate-600">{item.quantity} x {item.productName} · {item.binCode}</p>
    ))}
    {pickList.items.length > 2 && <p className="text-xs text-slate-400">+{pickList.items.length - 2} more items</p>}
  </div>
);

const ProgressPill: React.FC<{ pickList: PickList }> = ({ pickList }) => {
  const total = pickList.items.reduce((sum, item) => sum + item.quantity, 0);
  const picked = pickList.items.reduce((sum, item) => sum + item.pickedQuantity, 0);
  const percent = Math.round((picked / Math.max(1, total)) * 100);
  return <Badge className={percent === 100 ? 'bg-emerald-50 text-emerald-700' : percent > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'}>{picked}/{total} · {percent}%</Badge>;
};

const PriorityBadge: React.FC<{ priority: PickListPriority }> = ({ priority }) => {
  const tone = priority === 'Urgent' || priority === 'High'
    ? 'bg-red-50 text-red-700'
    : priority === 'Medium'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-slate-100 text-slate-700';
  return <Badge className={tone}>{priority}</Badge>;
};

export default WarehouseOperationsPage;
