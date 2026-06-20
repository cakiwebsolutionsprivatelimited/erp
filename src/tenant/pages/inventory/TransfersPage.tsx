import React, { useState } from 'react';
import { CheckCircle2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { StockTransferForm } from '@/tenant/inventory/components/StockTransferForm';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const TransfersPage: React.FC = () => {
  const inventory = useInventoryData();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Stock Transfers"
        description="Move stock between warehouses, track status, transfer date, quantity, and notes."
        action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Create Transfer</Button>}
      />

      <DataTable headers={['Transfer', 'From', 'To', 'Product', 'Quantity', 'Date', 'Status', 'Actions']}>
        {inventory.transfers.map((transfer) => (
          <tr key={transfer.id}>
            <td className="px-4 py-3 font-medium text-indigo-700">{transfer.number}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.fromWarehouseName}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.toWarehouseName}</td>
            <td className="px-4 py-3 font-medium text-slate-950">{transfer.productName}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.quantity}</td>
            <td className="px-4 py-3 text-slate-600">{transfer.transferDate}</td>
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
          <StockTransferForm products={inventory.products} warehouses={inventory.warehouses} onSubmit={(transfer) => { inventory.createTransfer(transfer); setFormOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransfersPage;
