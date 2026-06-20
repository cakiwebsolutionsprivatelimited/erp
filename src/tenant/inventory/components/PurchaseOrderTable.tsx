import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { getPurchaseOrderTotal } from '@/tenant/inventory/services/inventoryDemoService';
import type { PurchaseOrder } from '@/tenant/inventory/types';

export const PurchaseOrderTable: React.FC<{ orders: PurchaseOrder[]; onReceive: (id: string) => void }> = ({ orders, onReceive }) => (
  <DataTable headers={['PO Number', 'Supplier', 'Date', 'Expected', 'Items', 'Amount', 'Status', 'Actions']}>
    {orders.map((order) => (
      <tr key={order.id}>
        <td className="px-4 py-3 font-medium text-indigo-700">{order.number}</td>
        <td className="px-4 py-3">{order.supplierName}</td>
        <td className="px-4 py-3 text-slate-600">{order.date}</td>
        <td className="px-4 py-3 text-slate-600">{order.expectedDelivery}</td>
        <td className="px-4 py-3 text-slate-600">{order.items.length}</td>
        <td className="px-4 py-3 font-medium text-slate-950">{formatINR(getPurchaseOrderTotal(order))}</td>
        <td className="px-4 py-3"><InventoryStatusBadge status={order.status} /></td>
        <td className="px-4 py-3">
          <Button variant="outline" size="sm" disabled={order.status === 'Received' || order.status === 'Cancelled'} onClick={() => onReceive(order.id)}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Receive
          </Button>
        </td>
      </tr>
    ))}
  </DataTable>
);
