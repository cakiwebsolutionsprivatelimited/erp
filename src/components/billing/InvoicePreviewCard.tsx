import React from 'react';
import { 
  Download, 
  Share2, 
  Send, 
  Building2, 
  User, 
  Check, 
  Copy,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { notify } from '@/services/notificationService';
import type { Invoice } from './types';

interface InvoicePreviewCardProps {
  invoice: Invoice;
  isLoading?: boolean;
  onAction?: (actionType: string, invoice: Invoice) => void;
}

export const InvoicePreviewCard: React.FC<InvoicePreviewCardProps> = ({
  invoice,
  isLoading = false,
  onAction
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(invoice.qrCodeData);
    setCopied(true);
    notify.success("Invoicing Link Copied", `Payment link copied for ${invoice.id}.`);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6 animate-pulse shadow-2xs">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
          <div className="h-6 w-20 bg-muted rounded-full" />
        </div>
        <div className="h-[1px] w-full bg-muted" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
        </div>
        <div className="h-10 w-full bg-muted rounded-xl" />
      </div>
    );
  }

  // Invoice status badge configurations
  const statusConfig = {
    paid: {
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      label: "Fully Paid"
    },
    pending: {
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      label: "Payment Pending"
    },
    overdue: {
      color: "text-rose-500",
      bg: "bg-rose-500/10 border-rose-500/20 animate-pulse",
      label: "Invoice Overdue"
    },
    draft: {
      color: "text-muted-foreground",
      bg: "bg-muted border-transparent",
      label: "Draft Roster"
    }
  };

  const currentStatus = statusConfig[invoice.status] || statusConfig.pending;

  return (
    <div className="bg-card border rounded-3xl p-6 shadow-2xs flex flex-col justify-between overflow-hidden relative">
      
      {/* Invoice Header details */}
      <div>
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider font-mono">
              Corporate Invoice
            </span>
            <h3 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5 mt-0.5">
              {invoice.id}
            </h3>
            <span className="text-xs text-muted-foreground font-semibold block mt-0.5">
              Issue Date: <strong>{invoice.issueDate}</strong>
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge className={cn("border font-bold text-[10px] py-0 px-2 shrink-0", currentStatus.bg, currentStatus.color)}>
              {invoice.status === "overdue" && (
                <AlertCircle size={10} className="mr-0.5 shrink-0 animate-bounce" />
              )}
              {currentStatus.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Due Date: <strong className="text-rose-500">{invoice.dueDate}</strong>
            </span>
          </div>
        </div>

        <Separator className="bg-muted my-4" />

        {/* Client Roster Information */}
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground mb-4">
          <div>
            <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Bill To Client</span>
            <div className="flex items-center gap-1.5 text-foreground font-bold mb-0.5">
              <User size={13} className="text-muted-foreground" />
              {invoice.clientName}
            </div>
            <span className="text-muted-foreground/80 block text-[11px] truncate">{invoice.clientEmail}</span>
          </div>

          <div>
            <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Billing Entity</span>
            <div className="flex items-center gap-1.5 text-foreground font-bold mb-0.5">
              <Building2 size={13} className="text-muted-foreground" />
              {invoice.clientCompany}
            </div>
            <span className="text-muted-foreground/80 block text-[10px] truncate" title={invoice.clientAddress}>
              {invoice.clientAddress}
            </span>
          </div>
        </div>

        <Separator className="bg-muted/70 my-3 border-dashed" />

        {/* Line Items Preview Block */}
        <div className="space-y-2 mb-5">
          <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block">Line Items Roster</span>
          
          <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
            {invoice.items.map(item => (
              <div 
                key={item.id} 
                className="bg-muted/30 border border-border/20 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs font-semibold"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-foreground font-bold truncate tracking-tight">{item.description}</h4>
                  <span className="text-[10px] text-muted-foreground">
                    Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </span>
                </div>
                <span className="text-foreground font-bold shrink-0">
                  ${item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary totals */}
        <div className="bg-muted/40 rounded-2xl p-4 space-y-2.5 text-xs font-semibold text-muted-foreground mb-4">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="text-foreground font-bold">${invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>GST Output Tax ({invoice.taxRate}%)</span>
            <span className="text-foreground font-bold">${invoice.taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>

          <Separator className="bg-muted my-1" />

          <div className="flex items-center justify-between">
            <span className="text-foreground font-bold">Total Amount Due</span>
            <span className="text-base font-extrabold text-primary tracking-tight">
              ${invoice.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* QR Code and Actions Footer */}
      <div>
        <div className="grid grid-cols-12 gap-3 items-center mb-4">
          {/* Quick Copy Link Widget */}
          <div className="col-span-8">
            <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Reconciliation Link</span>
            <div 
              onClick={handleCopyLink}
              className="flex items-center justify-between gap-2 p-2 bg-muted/50 border hover:bg-muted/80 rounded-xl cursor-pointer transition-all group/link"
              title="Click to copy payment Link"
            >
              <span className="text-[10px] font-bold text-foreground truncate font-mono">
                {invoice.qrCodeData}
              </span>
              {copied ? (
                <Check className="h-3 w-3 shrink-0 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3 shrink-0 text-muted-foreground group-hover/link:text-primary transition-colors" />
              )}
            </div>
          </div>

          {/* QR Payment Badge Mock */}
          <div className="col-span-4 flex justify-end">
            <div className="h-14 w-14 bg-white p-1 rounded-xl shadow-2xs border flex items-center justify-center shrink-0" title="Scan to Reconcile">
              <QrCode className="h-full w-full text-black shrink-0" />
            </div>
          </div>
        </div>

        {/* Operational buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            onClick={() => {
              notify.success("Sent Reminder", `Billing alert reminder dispatched to ${invoice.clientEmail} successfully.`)
              onAction?.("reminder", invoice)
            }}
            variant="outline" 
            size="sm"
            className="text-[11px] font-bold h-9 border-muted-foreground/20 rounded-xl cursor-pointer gap-1"
          >
            <Send size={12} />
            Remind
          </Button>

          <Button 
            onClick={() => {
              notify.info("Share Link", `Preparing link sharing modal package.`)
              onAction?.("share", invoice)
            }}
            variant="outline" 
            size="sm"
            className="text-[11px] font-bold h-9 border-muted-foreground/20 rounded-xl cursor-pointer gap-1"
          >
            <Share2 size={12} />
            Share
          </Button>

          <Button 
            onClick={() => {
              notify.success("Document Download", `Triggered invoice statement PDF compile download for ${invoice.id}.`)
              onAction?.("download", invoice)
            }}
            size="sm"
            className="text-[11px] font-bold h-9 rounded-xl cursor-pointer gap-1"
          >
            <Download size={12} />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

const Separator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("h-[1px] w-full", className)} />
);
