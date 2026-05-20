import React from 'react';
import { 
  MapPin, 
  ArrowLeftRight, 
  Plus, 
  MoreHorizontal, 
  TrendingUp, 
  AlertTriangle,
  AlertCircle
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
import type { InventoryItem } from './types';

interface InventoryStockRowProps {
  item: InventoryItem;
  isSelected?: boolean;
  onSelectChange?: (checked: boolean) => void;
  isLoading?: boolean;
  onAction?: (actionType: string, item: InventoryItem) => void;
}

export const InventoryStockRow: React.FC<InventoryStockRowProps> = ({
  item,
  isSelected = false,
  onSelectChange,
  isLoading = false,
  onAction
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-2xl animate-pulse gap-3 shadow-2xs">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 bg-muted rounded-xl shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="h-4 w-2/3 bg-muted rounded" />
            <div className="h-3 w-1/3 bg-muted rounded" />
          </div>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <div className="h-8 w-16 bg-muted rounded-lg" />
          <div className="h-8 w-16 bg-muted rounded-lg" />
          <div className="h-8 w-8 bg-muted rounded-full" />
        </div>
      </div>
    );
  }

  // Stock status styles
  const statusStyles = {
    in_stock: {
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20",
      badge: "In Stock"
    },
    low_stock: {
      color: "text-amber-500",
      bg: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20",
      badge: "Low Stock"
    },
    out_of_stock: {
      color: "text-rose-500",
      bg: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20",
      badge: "Out of Stock"
    }
  };

  const currentStyles = statusStyles[item.status] || statusStyles.in_stock;

  return (
    <div 
      onClick={() => onAction?.("inspect", item)}
      className={cn(
        "relative flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 bg-card border rounded-2xl shadow-2xs gap-4 transition-all hover:shadow-xs group/row cursor-pointer",
        isSelected ? "border-primary/50 bg-primary/5 dark:bg-primary/2" : "hover:border-primary/20"
      )}
    >
      {/* Left Column Area: Avatar, Name, Category, SKU */}
      <div className="flex items-center gap-3 w-full lg:flex-1 min-w-0">
        {/* Checkbox Selector - optional propagation wrapped */}
        {onSelectChange && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="shrink-0 flex items-center pr-1"
          >
            <input 
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectChange?.(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0"
            />
          </div>
        )}

        {/* Product Color Avatar */}
        <div className="relative shrink-0">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs group-hover/row:scale-105 transition-transform",
            item.thumbnail
          )}>
            {item.name.charAt(0)}
          </div>
          {/* Small warning mark inside container */}
          {item.status !== "in_stock" && (
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-background border flex items-center justify-center">
              {item.status === "out_of_stock" ? (
                <AlertCircle className="h-2.5 w-2.5 text-rose-500 shrink-0" />
              ) : (
                <AlertTriangle className="h-2.5 w-2.5 text-amber-500 shrink-0" />
              )}
            </span>
          )}
        </div>

        {/* Identity Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h4 className="text-sm font-bold text-foreground truncate group-hover/row:text-primary transition-colors">
              {item.name}
            </h4>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase font-mono tracking-tight shrink-0">
              {item.sku}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-muted-foreground font-semibold">
            <span>{item.category}</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-muted-foreground" />
              {item.warehouseLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row Area: Stock Levels, Batch, Pricing Margin */}
      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-x-6 gap-y-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
        
        {/* Quantity status */}
        <div className="shrink-0 min-w-[100px]">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Stock Level</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-foreground tracking-tight">
              {item.quantity} {item.unit}
            </span>
            <Badge className={cn("border font-bold text-[9px] py-0 px-1.5 shrink-0", currentStyles.bg, currentStyles.color)}>
              {currentStyles.badge}
            </Badge>
          </div>
        </div>

        {/* Batch Number */}
        <div className="shrink-0 min-w-[100px] hidden sm:block">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Batch Track</span>
          <span className="text-xs font-bold text-foreground font-mono bg-muted/40 px-2 py-0.5 rounded-md border border-border/20">
            {item.batchNumber}
          </span>
        </div>

        {/* Price values details */}
        <div className="shrink-0 min-w-[110px]">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Price (Buy/Sell)</span>
          <span className="text-xs font-bold text-foreground block tracking-tight">
            ${item.price.purchase.toFixed(2)} / <strong className="text-primary">${item.price.selling.toFixed(2)}</strong>
          </span>
        </div>

        {/* Profit Margin Info */}
        <div className="shrink-0 min-w-[80px]">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Margin</span>
          <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 w-max">
            <TrendingUp size={11} className="shrink-0" />
            {item.margin}%
          </span>
        </div>

      </div>

      {/* Right Column Area: Quick Buttons & Actions */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-end gap-2 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 self-stretch lg:self-auto"
      >
        <Button 
          onClick={() => onAction?.("restock", item)}
          variant="outline" 
          size="sm" 
          className="h-9 gap-1 text-xs font-bold border-muted-foreground/20 hover:border-primary/30 rounded-xl cursor-pointer flex-1 lg:flex-none"
        >
          <Plus size={14} />
          Restock
        </Button>
        <Button 
          onClick={() => onAction?.("transfer", item)}
          size="sm" 
          className="h-9 gap-1 text-xs font-bold rounded-xl cursor-pointer flex-1 lg:flex-none"
        >
          <ArrowLeftRight size={14} />
          Transfer
        </Button>

        {/* Context Dropdown trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 cursor-pointer rounded-xl hover:bg-muted" size="icon-sm">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Administrative Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => onAction?.("edit", item)}>
              Edit Product Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onAction?.("audit", item)}>
              Audit Stock Count
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-destructive/10" onClick={() => onAction?.("write_off", item)}>
              Write Off Stock
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
