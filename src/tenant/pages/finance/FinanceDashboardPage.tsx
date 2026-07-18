import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BriefcaseBusiness, FilePlus2, Landmark, Percent, PlusCircle, ReceiptIndianRupee, ShieldCheck, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader } from '@/tenant/components/TenantUI';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { FinanceStatusBadge } from '@/tenant/finance/components/FinanceStatusBadge';
import { GSTSummaryCard } from '@/tenant/finance/components/GSTSummaryCard';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';
import {
  buildCustomerLedgers,
  calculateGSTSummary,
  calculateInvoiceTotals,
  getFinanceMetrics,
  getInvoiceBalance,
} from '@/tenant/finance/services/financeDemoService';

const FinanceDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const finance = useFinanceData();
  const metrics = getFinanceMetrics(finance);
  const gstSummary = calculateGSTSummary(finance);
  const ledgers = buildCustomerLedgers(finance).sort((a, b) => b.outstanding - a.outstanding);
  const recentInvoices = finance.invoices.slice(0, 6);
  const overdueInvoices = finance.invoices.filter((invoice) => invoice.status === 'Overdue').slice(0, 5);
  const openPayables = finance.vendorBills
    .filter((bill) => !['Paid', 'Cancelled'].includes(bill.status))
    .reduce((sum, bill) => sum + Math.max(0, bill.total - bill.paidAmount), 0);
  const bankReviewItems = finance.bankStatementLines.filter((line) => line.status === 'Needs Review').length;
  const complianceIssues = finance.invoiceCompliance.filter((item) =>
    item.gstinStatus !== 'Compliant' || item.taxStatus !== 'Compliant' || ['Pending', 'Failed'].includes(item.eInvoiceStatus)
  ).length + finance.taxReturns.filter((item) => item.status === 'Overdue').length;
  const assetBookValue = finance.fixedAssets.reduce((sum, asset) => sum + asset.bookValue, 0);
  const budgetAlerts = finance.budgets.filter((budget) => ['Watch', 'Over Budget'].includes(budget.status)).length;
  const adminReviews = finance.securityControls.filter((control) => control.status !== 'Enabled').length
    + finance.integrationConnectors.filter((connector) => ['Needs Review', 'Not Connected'].includes(connector.status)).length
    + finance.permissionPolicies.filter((policy) => policy.status === 'Review').length;

  return (
    <div>
      <PageHeader
        title="Finance Dashboard"
        description="Billing, GST, payments, expenses, ledgers, and accounts-lite demo overview."
        action={(
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/finance/accounting')}><BookOpen className="h-4 w-4" />Accounting</Button>
            <Button variant="outline" onClick={() => navigate('/finance/payables')}><ReceiptIndianRupee className="h-4 w-4" />Payables</Button>
            <Button variant="outline" onClick={() => navigate('/finance/compliance')}><Percent className="h-4 w-4" />Compliance</Button>
            <Button variant="outline" onClick={() => navigate('/finance/planning-assets')}><BriefcaseBusiness className="h-4 w-4" />Planning</Button>
            <Button variant="outline" onClick={() => navigate('/finance/advanced-admin')}><ShieldCheck className="h-4 w-4" />Admin</Button>
            <Button onClick={() => navigate('/finance/invoices/new')}><FilePlus2 className="h-4 w-4" />Create invoice</Button>
          </div>
        )}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-12">
        <MetricCard label="Total invoiced" value={metrics.totalInvoiced} hint="Active invoices" icon={<ReceiptIndianRupee className="h-4 w-4" />} />
        <MetricCard label="Payments received" value={metrics.paymentsReceived} hint="Demo receipts" tone="success" icon={<WalletCards className="h-4 w-4" />} />
        <MetricCard label="Outstanding" value={metrics.outstandingAmount} hint="Open balances" tone="warning" icon={<Landmark className="h-4 w-4" />} />
        <MetricCard label="Overdue invoices" textValue={String(metrics.overdueCount)} hint="Needs follow-up" />
        <MetricCard label="Expenses this month" value={metrics.expensesThisMonth} hint="June demo data" />
        <MetricCard label="Net revenue" value={metrics.netRevenue} hint="Cash basis" tone={metrics.netRevenue >= 0 ? 'success' : 'danger'} />
        <MetricCard label="GST payable" value={metrics.gstPayableEstimate} hint="Estimate" tone="warning" />
        <MetricCard label="Journal entries" textValue={String(finance.journalEntries.length)} hint="Accounting preview" icon={<BookOpen className="h-4 w-4" />} />
        <MetricCard label="Open payables" value={openPayables} hint="Vendor bill balance" tone="warning" />
        <MetricCard label="Bank review" textValue={String(bankReviewItems)} hint="Statement lines" icon={<WalletCards className="h-4 w-4" />} />
        <MetricCard label="Compliance issues" textValue={String(complianceIssues)} hint="Tax review queue" icon={<Percent className="h-4 w-4" />} />
        <MetricCard label="Asset book value" value={assetBookValue} hint={`${budgetAlerts} budget alerts`} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <MetricCard label="Admin reviews" textValue={String(adminReviews)} hint="Security/connectors/roles" icon={<ShieldCheck className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Revenue vs expenses</h2>
          <div className="mt-4 space-y-4">
            <Bar label="Invoiced" value={metrics.totalInvoiced} max={Math.max(metrics.totalInvoiced, metrics.expensesThisMonth, 1)} tone="bg-indigo-600" />
            <Bar label="Collected" value={metrics.paymentsReceived} max={Math.max(metrics.totalInvoiced, metrics.expensesThisMonth, 1)} tone="bg-emerald-600" />
            <Bar label="Expenses" value={metrics.expensesThisMonth} max={Math.max(metrics.totalInvoiced, metrics.expensesThisMonth, 1)} tone="bg-amber-500" />
            <Bar label="Outstanding" value={metrics.outstandingAmount} max={Math.max(metrics.totalInvoiced, metrics.expensesThisMonth, 1)} tone="bg-red-500" />
          </div>
        </div>
        <GSTSummaryCard summary={gstSummary} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Payment collection trend</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {finance.payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="rounded-md bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{payment.paymentDate}</p>
                <AmountDisplay value={payment.amount} tone="success" className="mt-1 block" />
                <p className="mt-1 truncate text-xs text-slate-500">{payment.mode}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Outstanding by customer</h2>
          <div className="mt-4 space-y-3">
            {ledgers.slice(0, 5).map((ledger) => (
              <Bar key={ledger.customerId} label={ledger.customer} value={ledger.outstanding} max={Math.max(ledgers[0]?.outstanding || 1, 1)} tone="bg-amber-500" />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div>
          <SectionTitle title="Recent invoices" action={<Button size="sm" variant="outline" onClick={() => navigate('/finance/invoices')}>View all</Button>} />
          <DataTable headers={['Invoice', 'Customer', 'Total', 'Balance', 'Status']}>
            {recentInvoices.map((invoice) => {
              const totals = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, undefined, invoice.roundOff);
              return (
                <tr key={invoice.id}>
                  <td className="px-4 py-3 font-medium text-indigo-700">{invoice.number}</td>
                  <td className="px-4 py-3">{invoice.customerName}</td>
                  <td className="px-4 py-3"><AmountDisplay value={totals.grandTotal} /></td>
                  <td className="px-4 py-3"><AmountDisplay value={getInvoiceBalance(invoice)} tone="warning" /></td>
                  <td className="px-4 py-3"><FinanceStatusBadge status={invoice.status} /></td>
                </tr>
              );
            })}
          </DataTable>
        </div>
        <div>
          <SectionTitle title="Recent payments" action={<Button size="sm" variant="outline" onClick={() => navigate('/finance/payments')}>Open payments</Button>} />
          <DataTable headers={['Payment', 'Customer', 'Invoice', 'Amount', 'Mode']}>
            {finance.payments.slice(0, 6).map((payment) => (
              <tr key={payment.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{payment.number}</td>
                <td className="px-4 py-3">{payment.customerName}</td>
                <td className="px-4 py-3 text-slate-600">{payment.invoiceNumber}</td>
                <td className="px-4 py-3"><AmountDisplay value={payment.amount} tone="success" /></td>
                <td className="px-4 py-3 text-slate-600">{payment.mode}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div>
          <SectionTitle title="Overdue invoices" action={<Button size="sm" variant="outline" onClick={() => navigate('/finance/customer-ledger')}>View outstanding</Button>} />
          <DataTable headers={['Invoice', 'Customer', 'Due date', 'Balance']}>
            {overdueInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{invoice.number}</td>
                <td className="px-4 py-3">{invoice.customerName}</td>
                <td className="px-4 py-3 text-red-600">{invoice.dueDate}</td>
                <td className="px-4 py-3"><AmountDisplay value={getInvoiceBalance(invoice)} tone="danger" /></td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div>
          <SectionTitle title="Quick actions" />
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickAction label="Create Invoice" onClick={() => navigate('/finance/invoices/new')} />
            <QuickAction label="Record Payment" onClick={() => navigate('/finance/payments')} />
            <QuickAction label="Add Expense" onClick={() => navigate('/finance/expenses')} />
            <QuickAction label="GST Summary" onClick={() => navigate('/finance/reports')} />
            <QuickAction label="Accounting" onClick={() => navigate('/finance/accounting')} />
            <QuickAction label="Payables" onClick={() => navigate('/finance/payables')} />
            <QuickAction label="Banking" onClick={() => navigate('/finance/banking')} />
            <QuickAction label="Tax Compliance" onClick={() => navigate('/finance/compliance')} />
            <QuickAction label="Planning & Assets" onClick={() => navigate('/finance/planning-assets')} />
            <QuickAction label="Advanced Admin" onClick={() => navigate('/finance/advanced-admin')} />
          </div>
        </div>
      </section>
    </div>
  );
};

const MetricCard: React.FC<{
  label: string;
  value?: number;
  textValue?: string;
  hint?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}> = ({ label, value, textValue, hint, tone = 'default', icon }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        {typeof value === 'number'
          ? <AmountDisplay value={value} tone={tone} className="mt-2 block text-xl" />
          : <p className="mt-2 text-2xl font-semibold text-slate-950">{textValue}</p>}
      </div>
      {icon && <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700">{icon}</span>}
    </div>
    {hint && <p className="mt-3 text-xs text-slate-500">{hint}</p>}
  </div>
);

const Bar: React.FC<{ label: string; value: number; max: number; tone: string }> = ({ label, value, max, tone }) => (
  <div>
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <AmountDisplay value={value} />
    </div>
    <div className="mt-2 h-2 rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  </div>
);

const SectionTitle: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <h2 className="font-semibold text-slate-950">{title}</h2>
    {action}
  </div>
);

const QuickAction: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <Button variant="outline" className="h-14 justify-start" onClick={onClick}>
    <PlusCircle className="h-4 w-4" />
    {label}
  </Button>
);

export default FinanceDashboardPage;
