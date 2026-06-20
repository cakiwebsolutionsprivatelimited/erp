import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ProductStatus, PurchaseOrderStatus, StockStatus, StockTransferStatus, SupplierStatus, WarehouseStatus } from '@/tenant/inventory/types';
import { cn } from '@/utils';

type InventoryBadgeStatus = StockStatus | ProductStatus | PurchaseOrderStatus | SupplierStatus | WarehouseStatus | StockTransferStatus;

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
};

export const InventoryStatusBadge: React.FC<{ status: InventoryBadgeStatus; className?: string }> = ({ status, className }) => (
  <Badge className={cn('border text-[11px] hover:bg-inherit', statusStyles[status] || statusStyles.Draft, className)}>
    {status}
  </Badge>
);
