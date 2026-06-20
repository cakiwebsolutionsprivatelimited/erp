import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { WarehouseForm } from '@/tenant/inventory/components/WarehouseForm';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const WarehousesPage: React.FC = () => {
  const inventory = useInventoryData();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Warehouses"
        description="Manage storage locations, codes, addresses, managers, and active status."
        action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Add Warehouse</Button>}
      />

      <DataTable headers={['Warehouse', 'Code', 'Address', 'Manager', 'Status']}>
        {inventory.warehouses.map((warehouse) => (
          <tr key={warehouse.id}>
            <td className="px-4 py-3 font-medium text-slate-950">{warehouse.name}</td>
            <td className="px-4 py-3 text-slate-600">{warehouse.code}</td>
            <td className="px-4 py-3 text-slate-600">{warehouse.address}</td>
            <td className="px-4 py-3 text-slate-600">{warehouse.manager}</td>
            <td className="px-4 py-3"><InventoryStatusBadge status={warehouse.status} /></td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add warehouse</DialogTitle>
            <DialogDescription>Create a local warehouse or store location.</DialogDescription>
          </DialogHeader>
          <WarehouseForm onSubmit={(warehouse) => { inventory.addWarehouse(warehouse); setFormOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehousesPage;
