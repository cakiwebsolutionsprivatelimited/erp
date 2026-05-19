import React from 'react';
import { 
  FileText, 
  Send, 
  Download, 
  ArrowUpRight, 
  MoreHorizontal, 
  DollarSign, 
  Building2, 
  AlertCircle,
  Clock,
  CheckCircle2
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
import type { Invoice } from './types';

interface InvoiceManagementRowProps {
  invoice: Invoice;
  isSelected?: boolean;
  onSelectChange?: (checked: boolean) => void;
  isLoading?: boolean;
  onAction?: (actionType: string, invoice: Invoice) => void;
}

export const InvoiceManagementRow: React.FC<InvoiceManagementRowProps> = ({
  invoice,
  isSelected = false,
  onSelectChange,
  isLoading = false,
  onAction
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-card border rounded-2xl animate-pulse gap-3 shadow-2xs">
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

  // Invoice status badge configurations
  const statusStyles = {
    paid: {
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20",
      icon: CheckCircle2,
      label: "Paid"
    },
    pending: {
      color: "text-amber-500",
      bg: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20",
      icon: Clock,
      label: "Pending"
    },
    overdue: {
      color: "text-rose-500",
      bg: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20",
      icon: AlertCircle,
      label: "Overdue"
    },
    draft: {
      color: "text-muted-foreground",
      bg: "bg-muted border-transparent",
      icon: Clock,
      label: "Draft"
    }
  };

  const currentStyles = statusStyles[invoice.status] || statusStyles.pending;
  const StatusIcon = currentStyles.icon;

  return (
    <div 
      onClick={() => onAction?.("inspect", invoice)}
      className={cn(
        "relative flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 bg-card border rounded-2xl shadow-2xs gap-4 transition-all hover:shadow-xs group/row cursor-pointer",
        isSelected ? "border-primary/50 bg-primary/5 dark:bg-primary/2" : "hover:border-primary/20"
      )}
    >
      {/* Left Column Area: Checkbox, Client details, SKU code */}
      <div className="flex items-center gap-3 w-full xl:flex-1 min-w-0">
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

        {/* Invoice Icon Badge */}
        <div className="relative shrink-0">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-2xs group-hover/row:scale-105 transition-transform">
            <FileText size={20} />
          </div>
          {/* Small status overlay icon */}
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-background border flex items-center justify-center">
            <StatusIcon className={cn("h-2.5 w-2.5 shrink-0", currentStyles.color)} />
          </span>
        </div>

        {/* Identity Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h4 className="text-sm font-bold text-foreground truncate group-hover/row:text-primary transition-colors">
              {invoice.clientName}
            </h4>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase font-mono tracking-tight shrink-0">
              {invoice.id}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1">
              <Building2 size={11} className="text-muted-foreground" />
              {invoice.clientCompany}
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span>{invoice.clientEmail}</span>
          </div>
        </div>
      </div>

      {/* Middle Row Area: Due dates, amount summaries, tax info */}
      <div className="flex flex-wrap items-center justify-between xl:justify-end gap-x-6 gap-y-3 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0">
        
        {/* Financial Status Badge */}
        <div className="shrink-0 min-w-[90px]">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Status</span>
          <Badge className={cn("border font-bold text-[9px] py-0 px-1.5 shrink-0", currentStyles.bg, currentStyles.color)}>
            <StatusIcon size={9} className="mr-0.5 shrink-0" />
            {currentStyles.label}
          </Badge>
        </div>

        {/* Timeline Dates */}
        <div className="shrink-0 min-w-[110px]">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Due Timeline</span>
          <span className="text-xs font-bold text-foreground block tracking-tight">
            {invoice.issueDate} / <strong className="text-rose-500">{invoice.dueDate}</strong>
          </span>
        </div>

        {/* Subtotal & Tax Rates */}
        <div className="shrink-0 min-w-[120px] hidden sm:block">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Subtotal / Output Tax</span>
          <span className="text-xs font-bold text-muted-foreground block tracking-tight">
            ${invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} / <strong className="text-foreground">${invoice.taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ({invoice.taxRate}%)</strong>
          </span>
        </div>

        {/* Net Total Amount */}
        <div className="shrink-0 min-w-[110px]">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Net Total Due</span>
          <span className="text-sm font-extrabold text-primary tracking-tight">
            ${invoice.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Payment Method */}
        <div className="shrink-0 min-w-[100px] hidden md:block">
          <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Method</span>
          <span className="text-xs font-bold text-foreground bg-muted/40 px-2 py-0.5 rounded-md border border-border/20">
            {invoice.paymentMethod}
          </span>
        </div>

      </div>

      {/* Right Column Area: Quick Buttons & Actions */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-end gap-2 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0 self-stretch xl:self-auto"
      >
        <Button 
          onClick={() => onAction?.("reminder", invoice)}
          variant="outline" 
          size="sm" 
          className="h-9 gap-1 text-xs font-bold border-muted-foreground/20 hover:border-primary/30 rounded-xl cursor-pointer flex-1 xl:flex-none"
        >
          <Send size={13} />
          Remind
        </Button>
        
        <Button 
          onClick={() => onAction?.("download", invoice)}
          size="sm" 
          className="h-9 gap-1 text-xs font-bold rounded-xl cursor-pointer flex-1 xl:flex-none"
        >
          <Download size={13} />
          PDF
        </Button>

        {/* Context Dropdown trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 cursor-pointer rounded-xl hover:bg-muted" size="icon-sm">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Reconciliation Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => onAction?.("reconcile", invoice)}>
              Reconcile Payment
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onAction?.("edit", invoice)}>
              Edit Invoice Items
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-destructive/10" onClick={() => onAction?.("delete", invoice)}>
              Void / Delete Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
