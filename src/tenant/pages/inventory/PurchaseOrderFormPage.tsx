import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/tenant/components/TenantUI';
import { PurchaseOrderForm } from '@/tenant/inventory/components/PurchaseOrderForm';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const PurchaseOrderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const inventory = useInventoryData();

  return (
    <div>
      <PageHeader
        title="Create Purchase Order"
        description="Select supplier, expected delivery, product rows, GST, quantities, totals, and notes."
      />
      <PurchaseOrderForm
        products={inventory.products}
        suppliers={inventory.suppliers}
        onCancel={() => navigate('/inventory/purchase')}
        onSubmit={(order) => {
          inventory.createPurchaseOrder(order);
          navigate('/inventory/purchase');
        }}
      />
    </div>
  );
};

export default PurchaseOrderFormPage;
