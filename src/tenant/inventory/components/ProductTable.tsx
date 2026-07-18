import React from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { getStockStatus } from '@/tenant/inventory/services/inventoryDemoService';
import type { InventoryProduct } from '@/tenant/inventory/types';

export const ProductTable: React.FC<{ products: InventoryProduct[]; onEdit: (id: string) => void }> = ({ products, onEdit }) => (
  <DataTable headers={['Product', 'SKU', 'Barcode', 'Group', 'Tracking', 'Category', 'Unit', 'GST', 'Sale Price', 'Purchase', 'Stock', 'Status', 'Actions']}>
    {products.map((product) => (
      <tr key={product.id}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-slate-100 text-xs font-semibold text-slate-600">
              {product.imageLabel.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="font-medium text-slate-950">{product.name}</p>
              <p className="text-xs text-slate-500">{product.hsnCode} · {product.subcategory}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-slate-600">{product.sku}</td>
        <td className="px-4 py-3 text-slate-600">{product.barcode}</td>
        <td className="px-4 py-3 text-slate-600">{product.itemGroupName || '-'}</td>
        <td className="px-4 py-3 text-slate-600">{product.trackingType || 'None'}</td>
        <td className="px-4 py-3 text-slate-600">{product.category}</td>
        <td className="px-4 py-3 text-slate-600">{product.unit}</td>
        <td className="px-4 py-3 text-slate-600">{product.gstRate}%</td>
        <td className="px-4 py-3 font-medium text-slate-900">{formatINR(product.salePrice)}</td>
        <td className="px-4 py-3 text-slate-600">{formatINR(product.purchasePrice)}</td>
        <td className="px-4 py-3">
          <span className="font-semibold text-slate-950">{product.currentStock}</span>
          <span className="ml-1 text-xs text-slate-500">{product.unit}</span>
        </td>
        <td className="px-4 py-3"><InventoryStatusBadge status={getStockStatus(product)} /></td>
        <td className="px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => onEdit(product.id)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </td>
      </tr>
    ))}
  </DataTable>
);
