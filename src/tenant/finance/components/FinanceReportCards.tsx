import React from 'react';
import { BarChart3, ClipboardList, FileSpreadsheet, Landmark, ReceiptText, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Expense, Invoice, Payment } from '@/tenant/finance/types';
import { calculateInvoiceTotals, getInvoiceBalance } from '@/tenant/finance/services/financeDemoService';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';

interface FinanceReportCardsProps {
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
}

export const FinanceReportCards: React.FC<FinanceReportCardsProps> = ({ invoices, payments, expenses }) => {
  const invoiceValue = invoices.reduce((sum, invoice) => sum + calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, undefined, invoice.roundOff).grandTotal, 0);
  const paymentValue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = invoices.reduce((sum, invoice) => sum + getInvoiceBalance(invoice), 0);
  const expenseValue = expenses.reduce((sum, expense) => sum + expense.amount + expense.gstAmount, 0);
  const gstValue = invoices.reduce((sum, invoice) => sum + calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, undefined, invoice.roundOff).taxTotal, 0);

  const reports = [
    { title: 'Invoice report', value: invoiceValue, hint: `${invoices.length} invoices`, icon: ReceiptText },
    { title: 'Payment report', value: paymentValue, hint: `${payments.length} receipts`, icon: WalletCards },
    { title: 'Outstanding report', value: outstanding, hint: 'Open balances', icon: Landmark },
    { title: 'Expense report', value: expenseValue, hint: `${expenses.length} expense entries`, icon: ClipboardList },
    { title: 'GST summary', value: gstValue, hint: 'Output GST collected', icon: FileSpreadsheet },
    { title: 'Profit/loss lite', value: paymentValue - expenseValue, hint: 'Demo cash basis', icon: BarChart3 },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <article key={report.title} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{report.title}</p>
              <AmountDisplay value={report.value} className="mt-2 block text-xl" tone={report.value < 0 ? 'danger' : 'default'} />
              <p className="mt-1 text-xs text-slate-500">{report.hint}</p>
            </div>
            <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700">
              <report.icon className="h-4 w-4" />
            </span>
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">Export placeholder</Button>
        </article>
      ))}
    </section>
  );
};
