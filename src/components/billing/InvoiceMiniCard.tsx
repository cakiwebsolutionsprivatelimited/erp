import React from 'react';
import { FileText, Calendar, DollarSign, ArrowUpRight, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';
import { Badge } from '@/components/ui/badge';
import type { Invoice } from './types';

interface InvoiceMiniCardProps {
  invoice: Invoice;
  isLoading?: boolean;
  onAction?: (actionType: string, invoice: Invoice) => void;
}

export const InvoiceMiniCard: React.FC<InvoiceMiniCardProps> = ({
  invoice,
  isLoading = false,
  onAction
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 bg-card border border-border/40 rounded-2xl animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-2 w-12 bg-muted rounded" />
          </div>
        </div>
        <div className="h-5 w-14 bg-muted rounded-full shrink-0" />
      </div>
    );
  }

  // Status-based color mapping
  const statusConfig = {
    paid: {
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      label: "Paid"
    },
    pending: {
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      label: "Pending"
    },
    overdue: {
      color: "text-rose-500",
      bg: "bg-rose-500/10 border-rose-500/20 animate-pulse",
      label: "Overdue"
    },
    draft: {
      color: "text-muted-foreground",
      bg: "bg-muted border-transparent",
      label: "Draft"
    }
  };

  const currentStatus = statusConfig[invoice.status] || statusConfig.pending;

  return (
    <div 
      onClick={() => onAction?.("inspect", invoice)}
      className="flex items-center justify-between p-3.5 bg-card border rounded-2xl shadow-2xs hover:shadow-xs hover:border-primary/20 transition-all group cursor-pointer"
    >
      {/* Client Identity & Invoice Reference */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <FileText size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-tight uppercase shrink-0">
              {invoice.id}
            </span>
            <span className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {invoice.clientName}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold mt-0.5">
            <Calendar size={10} className="shrink-0" />
            Due: {invoice.dueDate}
          </span>
        </div>
      </div>

      {/* Amount and Status Ratios */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <span className="text-xs font-extrabold text-foreground tracking-tight block">
            ${invoice.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider leading-none">
            {invoice.paymentMethod}
          </span>
        </div>

        <Badge className={cn("border font-bold text-[9px] py-0 px-1.5 shrink-0", currentStatus.bg, currentStatus.color)}>
          {invoice.status === "overdue" && (
            <AlertCircle size={9} className="mr-0.5 shrink-0" />
          )}
          {currentStatus.label}
        </Badge>

        <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
};
