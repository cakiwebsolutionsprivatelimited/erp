import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { SupplierForm } from '@/tenant/inventory/components/SupplierForm';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const SuppliersPage: React.FC = () => {
  const inventory = useInventoryData();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Maintain supplier contacts, GST numbers, addresses, payment terms, and status."
        action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Add Supplier</Button>}
      />

      <DataTable headers={['Supplier', 'Contact', 'Phone', 'Email', 'GST Number', 'Payment Terms', 'Status']}>
        {inventory.suppliers.map((supplier) => (
          <tr key={supplier.id}>
            <td className="px-4 py-3">
              <p className="font-medium text-slate-950">{supplier.name}</p>
              <p className="text-xs text-slate-500">{supplier.address}</p>
            </td>
            <td className="px-4 py-3 text-slate-600">{supplier.contactPerson}</td>
            <td className="px-4 py-3 text-slate-600">{supplier.phone}</td>
            <td className="px-4 py-3 text-slate-600">{supplier.email}</td>
            <td className="px-4 py-3 text-slate-600">{supplier.gstNumber}</td>
            <td className="px-4 py-3 text-slate-600">{supplier.paymentTerms}</td>
            <td className="px-4 py-3"><InventoryStatusBadge status={supplier.status} /></td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add supplier</DialogTitle>
            <DialogDescription>Create a local demo supplier record for purchase orders.</DialogDescription>
          </DialogHeader>
          <SupplierForm onSubmit={(supplier) => { inventory.addSupplier(supplier); setFormOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuppliersPage;
