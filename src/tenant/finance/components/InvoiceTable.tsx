import React from 'react';
import { Copy, Eye, FileText, ReceiptIndianRupee, Send, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/tenant/components/TenantUI';
import type { Invoice } from '@/tenant/finance/types';
import { calculateInvoiceTotals, getInvoiceBalance } from '@/tenant/finance/services/financeDemoService';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { FinanceStatusBadge } from '@/tenant/finance/components/FinanceStatusBadge';

interface InvoiceTableProps {
  invoices: Invoice[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onRecordPayment: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCancel: (id: string) => void;
  onSend?: (id: string) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onView,
  onEdit,
  onRecordPayment,
  onDuplicate,
  onCancel,
  onSend,
}) => (
  <DataTable headers={['Invoice', 'Customer', 'Invoice date', 'Due date', 'Amount', 'GST', 'Total', 'Paid', 'Balance', 'Status', 'Actions']}>
    {invoices.map((invoice) => {
      const totals = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, undefined, invoice.roundOff);
      const balance = getInvoiceBalance(invoice);
      return (
        <tr key={invoice.id}>
          <td className="px-4 py-3">
            <button className="font-medium text-indigo-700 hover:underline" onClick={() => onView(invoice.id)}>{invoice.number}</button>
          </td>
          <td className="px-4 py-3">
            <p className="font-medium text-slate-900">{invoice.customerName}</p>
            <p className="text-xs text-slate-500">{invoice.placeOfSupply} · {invoice.customerGstin}</p>
          </td>
          <td className="px-4 py-3 text-slate-600">{invoice.invoiceDate}</td>
          <td className="px-4 py-3 text-slate-600">{invoice.dueDate}</td>
          <td className="px-4 py-3"><AmountDisplay value={totals.taxableTotal} /></td>
          <td className="px-4 py-3"><AmountDisplay value={totals.taxTotal} /></td>
          <td className="px-4 py-3"><AmountDisplay value={totals.grandTotal} /></td>
          <td className="px-4 py-3"><AmountDisplay value={invoice.paidAmount} tone="success" /></td>
          <td className="px-4 py-3"><AmountDisplay value={balance} tone={balance > 0 ? 'warning' : 'success'} /></td>
          <td className="px-4 py-3"><FinanceStatusBadge status={invoice.status} /></td>
          <td className="px-4 py-3">
            <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="icon-sm" onClick={() => onView(invoice.id)} title="View invoice"><Eye className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="icon-sm" onClick={() => onEdit(invoice.id)} title="Edit invoice"><FileText className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="icon-sm" onClick={() => onRecordPayment(invoice.id)} title="Record payment"><ReceiptIndianRupee className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="icon-sm" onClick={() => onDuplicate(invoice.id)} title="Duplicate invoice"><Copy className="h-3.5 w-3.5" /></Button>
              {onSend && <Button variant="outline" size="icon-sm" onClick={() => onSend(invoice.id)} title="Send invoice demo"><Send className="h-3.5 w-3.5" /></Button>}
              <Button variant="destructive" size="icon-sm" onClick={() => onCancel(invoice.id)} title="Cancel invoice"><XCircle className="h-3.5 w-3.5" /></Button>
            </div>
          </td>
        </tr>
      );
    })}
  </DataTable>
);
