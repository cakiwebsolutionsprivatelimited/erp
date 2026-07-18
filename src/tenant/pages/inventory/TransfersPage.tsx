import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPinned, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { StockTransferForm } from '@/tenant/inventory/components/StockTransferForm';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const TransfersPage: React.FC = () => {
  const navigate = useNavigate();
  const inventory = useInventoryData();
  const [formOpen, setFormOpen] = useState(false);
  const draftTransfers = inventory.transfers.filter((transfer) => transfer.status === 'Draft');
  const inTransitTransfers = inventory.transfers.filter((transfer) => transfer.status === 'In Transit');
  const completedTransfers = inventory.transfers.filter((transfer) => transfer.status === 'Completed');

  return (
    <div>
      <PageHeader
        title="Stock Transfers"
        description="Move stock between warehouses, track bins, transfer stages, in-transit stock, ETA, carrier, and notes."
        action={(
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/inventory/warehouse-operations')}><MapPinned className="h-4 w-4" />Warehouse Ops</Button>
            <Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Create Transfer</Button>
          </div>
        )}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Draft" value={String(draftTransfers.length)} hint="Transfer orders waiting" />
        <StatCard label="In transit" value={String(inTransitTransfers.length)} hint="Stock currently moving" />
        <StatCard label="Completed" value={String(completedTransfers.length)} hint="Received transfers" />
        <StatCard label="Units moving" value={String(inTransitTransfers.reduce((sum, transfer) => sum + transfer.quantity, 0))} hint="In-transit quantity" />
      </section>

      <DataTable headers={['Transfer', 'From', 'To', 'Product', 'Quantity', 'Bins', 'Dates', 'Carrier', 'Requested by', 'Priority', 'Status', 'Actions']}>
        {inventory.transfers.map((transfer) => (
          <tr key={transfer.id}>
            <td className="px-4 py-3 font-medium text-indigo-700">{transfer.number}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.fromWarehouseName}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.toWarehouseName}</td>
            <td className="px-4 py-3 font-medium text-slate-950">{transfer.productName}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.quantity}</td>
            <td className="px-4 py-3 text-xs text-slate-600">
              <p>{transfer.sourceBinCode || '-'}</p>
              <p>{transfer.destinationBinCode || '-'}</p>
            </td>
            <td className="px-4 py-3 text-xs text-slate-600">
              <p>Out: {transfer.transferDate}</p>
              <p>ETA: {transfer.expectedArrival || '-'}</p>
            </td>
            <td className="px-4 py-3 text-slate-600">{transfer.carrier || 'Internal'}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.requestedBy || '-'}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.priority || 'Medium'}</td>
            <td className="px-4 py-3"><InventoryStatusBadge status={transfer.status} /></td>
            <td className="px-4 py-3">
              <Button variant="outline" size="sm" disabled={transfer.status === 'Completed' || transfer.status === 'Cancelled'} onClick={() => inventory.completeTransfer(transfer.id)}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Complete
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create transfer</DialogTitle>
            <DialogDescription>Create a local transfer record and ledger movement when completed.</DialogDescription>
          </DialogHeader>
          <StockTransferForm products={inventory.products} warehouses={inventory.warehouses} warehouseBins={inventory.warehouseBins} onSubmit={(transfer) => { inventory.createTransfer(transfer); setFormOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransfersPage;
