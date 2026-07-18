import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { DeliveryChallanStatus, InventoryBackorderStatus, InventoryDropshipmentStatus, InventoryFulfillmentStatus, InventoryPackageStatus, InventoryReturnStatus, PickListStatus, ProductStatus, PurchaseOrderStatus, PurchaseReceiveStatus, StockStatus, StockTransferStatus, SupplierStatus, VendorBillStatus, VendorPaymentStatus, WarehouseBinStatus, WarehouseRestrictionStatus, WarehouseStatus } from '@/tenant/inventory/types';
import { cn } from '@/utils';

type InventoryBadgeStatus = StockStatus | ProductStatus | PurchaseOrderStatus | SupplierStatus | WarehouseStatus | StockTransferStatus | WarehouseBinStatus | WarehouseRestrictionStatus | PickListStatus | InventoryFulfillmentStatus | InventoryPackageStatus | DeliveryChallanStatus | InventoryReturnStatus | InventoryBackorderStatus | InventoryDropshipmentStatus | PurchaseReceiveStatus | VendorBillStatus | VendorPaymentStatus;

const statusStyles: Record<string, string> = {
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Inactive: 'border-slate-200 bg-slate-100 text-slate-600',
  'In Stock': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Low Stock': 'border-amber-200 bg-amber-50 text-amber-700',
  'Out of Stock': 'border-red-200 bg-red-50 text-red-700',
  Draft: 'border-slate-200 bg-slate-100 text-slate-700',
  Sent: 'border-blue-200 bg-blue-50 text-blue-700',
  Received: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Partially Received': 'border-amber-200 bg-amber-50 text-amber-700',
  Cancelled: 'border-red-200 bg-red-50 text-red-700',
  'In Transit': 'border-blue-200 bg-blue-50 text-blue-700',
  Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'High Utilization': 'border-amber-200 bg-amber-50 text-amber-700',
  Maintenance: 'border-blue-200 bg-blue-50 text-blue-700',
  Restricted: 'border-red-200 bg-red-50 text-red-700',
  Picking: 'border-blue-200 bg-blue-50 text-blue-700',
  Packed: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  Hold: 'border-amber-200 bg-amber-50 text-amber-700',
  'Pending Pick': 'border-amber-200 bg-amber-50 text-amber-700',
  Shipped: 'border-blue-200 bg-blue-50 text-blue-700',
  Delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'On Hold': 'border-amber-200 bg-amber-50 text-amber-700',
  'Ready to Ship': 'border-blue-200 bg-blue-50 text-blue-700',
  Issued: 'border-blue-200 bg-blue-50 text-blue-700',
  Returned: 'border-red-200 bg-red-50 text-red-700',
  Requested: 'border-amber-200 bg-amber-50 text-amber-700',
  Approved: 'border-blue-200 bg-blue-50 text-blue-700',
  'Refund Pending': 'border-amber-200 bg-amber-50 text-amber-700',
  Closed: 'border-slate-200 bg-slate-100 text-slate-700',
  Open: 'border-red-200 bg-red-50 text-red-700',
  Allocated: 'border-blue-200 bg-blue-50 text-blue-700',
  'Ready to Fulfil': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'PO Sent': 'border-blue-200 bg-blue-50 text-blue-700',
  'Quality Hold': 'border-amber-200 bg-amber-50 text-amber-700',
  'Pending Approval': 'border-amber-200 bg-amber-50 text-amber-700',
  Paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Overdue: 'border-red-200 bg-red-50 text-red-700',
  Scheduled: 'border-blue-200 bg-blue-50 text-blue-700',
  Reconciled: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Failed: 'border-red-200 bg-red-50 text-red-700',
};

export const InventoryStatusBadge: React.FC<{ status: InventoryBadgeStatus; className?: string }> = ({ status, className }) => (
  <Badge className={cn('border text-[11px] hover:bg-inherit', statusStyles[status] || statusStyles.Draft, className)}>
    {status}
  </Badge>
);
