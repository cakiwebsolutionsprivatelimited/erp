import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Copy, Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, EmptyState, PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { FinanceStatusBadge } from '@/tenant/finance/components/FinanceStatusBadge';
import { PaymentForm } from '@/tenant/finance/components/PaymentForm';
import { TaxSummary } from '@/tenant/finance/components/TaxSummary';
import { calculateInvoiceTotals, getInvoiceBalance } from '@/tenant/finance/services/financeDemoService';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

const InvoicePreviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company } = useTenantData();
  const finance = useFinanceData();
  const invoice = finance.invoices.find((item) => item.id === id);
  const [paymentOpen, setPaymentOpen] = useState(false);

  if (!invoice) {
    return <EmptyState title="Invoice not found" description="Create a finance invoice to preview it here." action={<Button onClick={() => navigate('/finance/invoices/new')}>Create invoice</Button>} />;
  }

  const totals = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, undefined, invoice.roundOff);
  const balance = getInvoiceBalance(invoice);

  const duplicateInvoice = () => {
    const nextId = finance.duplicateInvoice(invoice.id);
    if (nextId) navigate(`/finance/invoices/${nextId}/edit`);
  };

  const recordPayment = (payment: Parameters<typeof finance.recordPayment>[0]) => {
    finance.recordPayment(payment);
    setPaymentOpen(false);
  };

  return (
    <div>
      <PageHeader
        title={invoice.number}
        description={`${invoice.customerName} · Balance ${balance > 0 ? 'pending' : 'clear'}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate(`/finance/invoices/${invoice.id}/edit`)}>Edit</Button>
            <Button variant="outline" onClick={() => setPaymentOpen(true)}>Record Payment</Button>
            <Button variant="outline"><Download className="h-4 w-4" />PDF</Button>
            <Button variant="outline" onClick={() => finance.sendInvoice(invoice.id)}><Send className="h-4 w-4" />Send</Button>
            <Button variant="outline" onClick={duplicateInvoice}><Copy className="h-4 w-4" />Duplicate</Button>
            <Button variant="destructive" onClick={() => finance.cancelInvoice(invoice.id)}>Cancel</Button>
          </div>
        }
      />

      <section className="mx-auto max-w-5xl rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
              LOGO
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{company.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{company.address}, {company.city}, {company.state}</p>
              <p className="mt-1 text-sm text-slate-500">GSTIN {company.gstNumber} · PAN {company.panNumber}</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-slate-500">GST Tax Invoice</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{invoice.number}</p>
            <div className="mt-2"><FinanceStatusBadge status={invoice.status} /></div>
          </div>
        </div>

        <div className="grid gap-4 py-6 md:grid-cols-2">
          <Info label="Invoice date" value={invoice.invoiceDate} />
          <Info label="Due date" value={invoice.dueDate} />
          <Info label="Place of supply" value={invoice.placeOfSupply} />
          <Info label="Payment status" value={invoice.status} />
        </div>

        <div className="grid gap-5 border-y border-slate-200 py-6 md:grid-cols-2">
          <AddressBlock title="Bill to" lines={[invoice.customerName, invoice.billingAddress, invoice.customerPhone, invoice.customerEmail, `GSTIN ${invoice.customerGstin}`]} />
          <AddressBlock title="Ship to" lines={[invoice.shippingAddress || invoice.billingAddress]} />
        </div>

        <div className="py-6">
          <DataTable headers={['Product/service', 'HSN/SAC', 'Qty', 'Rate', 'Discount', 'Taxable', 'CGST', 'SGST', 'IGST', 'Total']}>
            {invoice.items.map((item) => {
              const line = totals.lines.find((entry) => entry.itemId === item.id);
              return (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{item.productName}</td>
                  <td className="px-4 py-3 text-slate-600">{item.hsnSac}</td>
                  <td className="px-4 py-3 text-slate-600">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3"><AmountDisplay value={item.rate} /></td>
                  <td className="px-4 py-3"><AmountDisplay value={item.discount} tone="muted" /></td>
                  <td className="px-4 py-3"><AmountDisplay value={line?.taxableValue || 0} /></td>
                  <td className="px-4 py-3"><AmountDisplay value={line?.cgst || 0} /></td>
                  <td className="px-4 py-3"><AmountDisplay value={line?.sgst || 0} /></td>
                  <td className="px-4 py-3"><AmountDisplay value={line?.igst || 0} /></td>
                  <td className="px-4 py-3"><AmountDisplay value={line?.lineTotal || 0} /></td>
                </tr>
              );
            })}
          </DataTable>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_360px]">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-950">Notes and terms</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{invoice.notes}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{invoice.paymentTerms}</p>
          </div>
          <div>
            <TaxSummary totals={totals} compact />
            <div className="mt-3 rounded-md border border-amber-100 bg-amber-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-900">Balance due</span>
                <AmountDisplay value={balance} tone={balance > 0 ? 'warning' : 'success'} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
            <DialogDescription>Capture payment against {invoice.number} and update local balance.</DialogDescription>
          </DialogHeader>
          <PaymentForm customers={finance.customers} invoices={finance.invoices} initialInvoiceId={invoice.id} onSubmit={recordPayment} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md bg-slate-50 p-3">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-950">{value}</p>
  </div>
);

const AddressBlock: React.FC<{ title: string; lines: string[] }> = ({ title, lines }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
    <div className="mt-2 space-y-1 text-sm text-slate-700">
      {lines.filter(Boolean).map((line) => <p key={line}>{line}</p>)}
    </div>
  </div>
);

export default InvoicePreviewPage;
