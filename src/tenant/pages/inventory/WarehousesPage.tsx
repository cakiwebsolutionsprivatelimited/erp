import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinned, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { WarehouseForm } from '@/tenant/inventory/components/WarehouseForm';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const WarehousesPage: React.FC = () => {
  const navigate = useNavigate();
  const inventory = useInventoryData();
  const [formOpen, setFormOpen] = useState(false);
  const totalBins = inventory.warehouseBins.length;
  const averageUtilization = Math.round(inventory.warehouseBins.reduce((sum, bin) => sum + bin.capacityUtilization, 0) / Math.max(1, totalBins));
  const restrictedBins = inventory.warehouseBins.filter((bin) => bin.status === 'Restricted' || bin.status === 'Maintenance').length;

  return (
    <div>
      <PageHeader
        title="Warehouses"
        description="Manage storage locations, bins, operational access, managers, and active status."
        action={(
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/inventory/warehouse-operations')}><MapPinned className="h-4 w-4" />Warehouse Ops</Button>
            <Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Add Warehouse</Button>
          </div>
        )}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Warehouses" value={String(inventory.warehouses.length)} hint="Active storage locations" />
        <StatCard label="Bins" value={String(totalBins)} hint="Pickable locations" />
        <StatCard label="Avg utilization" value={`${averageUtilization}%`} hint="Across all bins" />
        <StatCard label="Restricted/hold" value={String(restrictedBins)} hint="Secure or maintenance bins" />
      </section>

      <DataTable headers={['Warehouse', 'Code', 'Address', 'Manager', 'Bins', 'Avg utilization', 'Access roles', 'Status']}>
        {inventory.warehouses.map((warehouse) => (
          <WarehouseRow key={warehouse.id} warehouse={warehouse} inventory={inventory} />
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

const WarehouseRow: React.FC<{ warehouse: ReturnType<typeof useInventoryData>['warehouses'][number]; inventory: ReturnType<typeof useInventoryData> }> = ({ warehouse, inventory }) => {
  const bins = inventory.warehouseBins.filter((bin) => bin.warehouseId === warehouse.id);
  const utilization = Math.round(bins.reduce((sum, bin) => sum + bin.capacityUtilization, 0) / Math.max(1, bins.length));
  const roles = inventory.warehouseRestrictions.filter((restriction) => restriction.warehouseIds.includes(warehouse.id) || restriction.warehouseNames.includes('All warehouses'));

  return (
    <tr>
      <td className="px-4 py-3 font-medium text-slate-950">{warehouse.name}</td>
      <td className="px-4 py-3 text-slate-600">{warehouse.code}</td>
      <td className="px-4 py-3 text-slate-600">{warehouse.address}</td>
      <td className="px-4 py-3 text-slate-600">{warehouse.manager}</td>
      <td className="px-4 py-3 font-medium text-slate-950">{bins.length}</td>
      <td className="px-4 py-3 text-slate-600">{utilization}%</td>
      <td className="px-4 py-3 text-slate-600">{roles.map((role) => role.role).join(', ') || '-'}</td>
      <td className="px-4 py-3"><InventoryStatusBadge status={warehouse.status} /></td>
    </tr>
  );
};

export default WarehousesPage;
