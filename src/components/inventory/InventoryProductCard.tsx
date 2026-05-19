import React from 'react';
import { 
  Package, 
  MapPin, 
  Tag, 
  Calendar, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  QrCode, 
  Copy, 
  Check, 
  MoreVertical,
  Activity,
  Boxes
} from 'lucide-react';
import { cn } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { notify } from '@/services/notificationService';
import type { InventoryItem } from './types';

interface InventoryProductCardProps {
  item: InventoryItem;
  isLoading?: boolean;
  onAction?: (actionType: string, item: InventoryItem) => void;
}

export const InventoryProductCard: React.FC<InventoryProductCardProps> = ({
  item,
  isLoading = false,
  onAction
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyBarcode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.barcode);
    setCopied(true);
    notify.success("Barcode Copied", `Barcode ${item.barcode} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border/40 rounded-3xl p-5 space-y-4 animate-pulse shadow-2xs">
        <div className="flex justify-between items-start">
          <div className="h-12 w-12 bg-muted rounded-2xl" />
          <div className="h-6 w-20 bg-muted rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
        <div className="border-t border-dashed pt-4 grid grid-cols-2 gap-3">
          <div className="h-8 bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  // Helper styles based on stock status
  const statusConfig = {
    in_stock: {
      badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      label: "In Stock",
      border: "hover:border-emerald-500/20"
    },
    low_stock: {
      badge: "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse",
      label: "Low Stock",
      border: "hover:border-amber-500/20"
    },
    out_of_stock: {
      badge: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      label: "Out of Stock",
      border: "hover:border-rose-500/20"
    }
  };

  const currentStatus = statusConfig[item.status] || statusConfig.in_stock;

  return (
    <div 
      className={cn(
        "bg-card border rounded-3xl p-5 shadow-2xs hover:shadow-xs transition-all relative group flex flex-col justify-between overflow-hidden",
        currentStatus.border
      )}
    >
      <div>
        {/* Card Header: Product Icon, Badges, and More Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs group-hover:scale-105 transition-transform shrink-0",
            item.thumbnail
          )}>
            {item.name.charAt(0)}
          </div>
          
          <div className="flex flex-wrap gap-1.5 items-center justify-end">
            <Badge className={cn("border font-bold text-[10px] py-0 px-2 shrink-0", currentStatus.badge)}>
              {currentStatus.label}
            </Badge>
            <Badge variant="outline" className="bg-muted/40 text-muted-foreground text-[10px] py-0 px-2 shrink-0 border-transparent font-semibold">
              GST: {item.gstRate}%
            </Badge>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer" size="icon-sm">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Inventory Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => onAction?.("restock", item)}>
                  Restock Product
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => onAction?.("transfer", item)}>
                  Transfer Warehouse
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => onAction?.("edit", item)}>
                  Edit Catalog Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Title, SKU, and Location */}
        <div className="mt-4">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider leading-none">
            SKU: {item.sku}
          </span>
          <h3 className="text-base font-bold text-foreground mt-0.5 tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          <span className="text-xs text-muted-foreground/80 font-medium block mt-1">
            Category: <strong className="text-foreground">{item.category}</strong>
          </span>
        </div>

        <Separator className="bg-muted my-3.5" />

        {/* Barcode & Shelf Location Grid */}
        <div className="grid grid-cols-2 gap-3.5 text-xs font-semibold text-muted-foreground mb-4">
          {/* Barcode Copy Widget */}
          <div 
            onClick={handleCopyBarcode}
            className="flex items-center gap-2 p-2 bg-muted/40 hover:bg-muted/70 rounded-xl cursor-pointer border border-transparent hover:border-border transition-all group/barcode min-w-0"
            title="Click to copy Barcode"
          >
            <QrCode className="h-4 w-4 shrink-0 text-muted-foreground group-hover/barcode:text-primary transition-colors" />
            <div className="min-w-0 flex-1">
              <span className="text-[8px] text-muted-foreground/80 uppercase font-bold tracking-wider block">Barcode</span>
              <span className="text-[10px] font-bold text-foreground truncate block">{item.barcode}</span>
            </div>
            {copied ? (
              <Check className="h-3 w-3 shrink-0 text-emerald-500 animate-in zoom-in-50" />
            ) : (
              <Copy className="h-3 w-3 shrink-0 opacity-0 group-hover/barcode:opacity-100 transition-opacity" />
            )}
          </div>

          {/* Location details */}
          <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-xl min-w-0">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="text-[8px] text-muted-foreground/80 uppercase font-bold tracking-wider block">Location</span>
              <span className="text-[10px] font-bold text-foreground truncate block">{item.warehouseLocation}</span>
            </div>
          </div>
        </div>

        {/* Info Rows: Supplier, Batch, Expiry */}
        <div className="space-y-2 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground/80">
              <Tag size={13} /> Batch No
            </span>
            <span className="text-foreground font-bold font-mono">{item.batchNumber}</span>
          </div>

          {item.expiryDate && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground/80">
                <Calendar size={13} /> Expiry Date
              </span>
              <span className="text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-1.5 rounded text-[10px]">
                {item.expiryDate}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground/80">
              <Truck size={13} /> Supplier
            </span>
            <span className="text-foreground font-bold truncate max-w-[140px]" title={item.supplier.name}>
              {item.supplier.name}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics & Quick Action Section */}
      <div className="mt-5">
        <div className="bg-muted/30 border border-dashed rounded-2xl p-3 grid grid-cols-3 gap-2 text-center mb-4">
          <div>
            <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block">Stock Level</span>
            <span className="text-sm font-extrabold text-foreground flex items-center justify-center gap-1 mt-0.5">
              <Boxes className="h-3 w-3 text-primary shrink-0" />
              {item.quantity}
            </span>
          </div>
          <div>
            <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block">Profit Margin</span>
            <span className="text-sm font-extrabold text-emerald-500 flex items-center justify-center gap-0.5 mt-0.5">
              <DollarSign className="h-3 w-3 shrink-0" />
              {item.margin}%
            </span>
          </div>
          <div>
            <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block">Monthly Sales</span>
            <span className="text-sm font-extrabold text-indigo-500 flex items-center justify-center gap-1 mt-0.5">
              <Activity className="h-3 w-3 shrink-0" />
              {item.monthlySalesCount}
            </span>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button 
            onClick={() => onAction?.("restock", item)}
            variant="outline" 
            size="sm"
            className="w-full text-xs font-bold h-9 border-muted-foreground/20 hover:border-primary/30 rounded-xl cursor-pointer"
          >
            Restock
          </Button>
          <Button 
            onClick={() => onAction?.("transfer", item)}
            size="sm"
            className="w-full text-xs font-bold h-9 rounded-xl cursor-pointer"
          >
            Transfer
          </Button>
        </div>
      </div>
    </div>
  );
};

const Separator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("h-[1px] w-full", className)} />
);
