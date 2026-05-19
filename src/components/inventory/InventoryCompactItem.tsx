import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Package, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';
import { Badge } from '@/components/ui/badge';
import type { InventoryItem } from './types';

interface InventoryCompactItemProps {
  item: InventoryItem;
  isLoading?: boolean;
  onAction?: (actionType: string, item: InventoryItem) => void;
}

export const InventoryCompactItem: React.FC<InventoryCompactItemProps> = ({
  item,
  isLoading = false,
  onAction
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-card border border-border/40 rounded-2xl animate-pulse">
        <div className="h-10 w-10 bg-muted rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-3 w-2/3 bg-muted rounded" />
          <div className="h-2 w-1/2 bg-muted rounded" />
        </div>
        <div className="h-5 w-12 bg-muted rounded-full shrink-0" />
      </div>
    );
  }

  // Calculate stock progress ratio (capped at 100%)
  const maxThreshold = item.minQuantity * 3 || 100;
  const stockPercentage = Math.min(100, Math.round((item.quantity / maxThreshold) * 100));

  // Determine helper tags and styling based on status
  const statusStyles = {
    in_stock: {
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      progress: "bg-emerald-500",
      badge: "In Stock"
    },
    low_stock: {
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      progress: "bg-amber-500",
      badge: "Low Stock"
    },
    out_of_stock: {
      color: "text-rose-500",
      bg: "bg-rose-500/10 border-rose-500/20",
      progress: "bg-rose-500",
      badge: "Out of Stock"
    }
  };

  const currentStyles = statusStyles[item.status] || statusStyles.in_stock;

  return (
    <div 
      onClick={() => onAction?.("inspect", item)}
      className="flex items-center gap-3 p-3 bg-card border rounded-2xl shadow-2xs hover:shadow-xs hover:border-primary/20 transition-all group cursor-pointer"
    >
      {/* Category Icon and Avatar Container */}
      <div className="relative shrink-0">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs transition-transform group-hover:scale-105",
          item.thumbnail
        )}>
          {item.name.charAt(0)}
        </div>
        {/* Tiny alert dot */}
        {item.status !== "in_stock" && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              item.status === "out_of_stock" ? "bg-rose-400" : "bg-amber-400"
            )} />
            <span className={cn(
              "relative inline-flex rounded-full h-3 w-3",
              item.status === "out_of_stock" ? "bg-rose-500" : "bg-amber-500"
            )} />
          </span>
        )}
      </div>

      {/* Info Middle Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 justify-between">
          <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {item.name}
          </h4>
          <span className="text-[10px] text-muted-foreground font-semibold shrink-0 uppercase tracking-tight">
            {item.sku}
          </span>
        </div>

        {/* Stock progress tracker */}
        <div className="mt-1.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
            <span className="flex items-center gap-1">
              <Package size={10} />
              {item.quantity} {item.unit}
            </span>
            <span>{stockPercentage}% Capacity</span>
          </div>
          {/* Progress element */}
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500 rounded-full", currentStyles.progress)} 
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mini velocity indicator */}
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <Badge className={cn("border font-bold text-[9px] py-0 px-1.5", currentStyles.bg, currentStyles.color)}>
          {item.status === "out_of_stock" ? (
            <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
          ) : item.status === "low_stock" ? (
            <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
          ) : null}
          {item.quantity}
        </Badge>
        
        {item.salesVelocity === "high" ? (
          <span className="flex items-center text-[9px] font-bold text-emerald-500 gap-0.5">
            <TrendingUp size={10} /> Fast
          </span>
        ) : item.salesVelocity === "low" ? (
          <span className="flex items-center text-[9px] font-bold text-muted-foreground gap-0.5">
            <TrendingDown size={10} /> Slow
          </span>
        ) : (
          <span className="text-[9px] font-bold text-blue-500">Steady</span>
        )}
      </div>
    </div>
  );
};
