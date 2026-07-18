import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

type PayablesView = 'Vendor Bills' | 'Recurring Bills' | 'Vendor Credits' | 'Approvals' | 'Bill Matching' | 'Payments Made';

const views: PayablesView[] = ['Vendor Bills', 'Recurring Bills', 'Vendor Credits', 'Approvals', 'Bill Matching', 'Payments Made'];

const FinancePayablesPage: React.FC = () => {
  const finance = useFinanceData();
  const [view, setView] = useState<PayablesView>('Vendor Bills');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const openBillValue = finance.vendorBills
    .filter((bill) => !['Paid', 'Cancelled'].includes(bill.status))
    .reduce((sum, bill) => sum + Math.max(0, bill.total - bill.paidAmount), 0);
  const overdueBills = finance.vendorBills.filter((bill) => bill.status === 'Overdue');
  const approvalQueue = finance.purchaseApprovals.filter((approval) => ['Requested', 'Escalated'].includes(approval.status));
  const varianceValue = finance.billMatches.reduce((sum, match) => sum + Math.abs(match.variance), 0);

  const vendorBills = useMemo(() => finance.vendorBills.filter((bill) =>
    !query || [bill.billNumber, bill.vendor, bill.purchaseOrderNumber, bill.status, bill.approvalOwner, bill.matchStatus].join(' ').toLowerCase().includes(query)
  ), [finance.vendorBills, query]);

  const recurringBills = useMemo(() => finance.recurringBills.filter((bill) =>
    !query || [bill.vendor, bill.schedule, bill.accountName, bill.status].join(' ').toLowerCase().includes(query)
  ), [finance.recurringBills, query]);

  const vendorCredits = useMemo(() => finance.vendorCredits.filter((credit) =>
    !query || [credit.creditNumber, credit.vendor, credit.status, credit.reason].join(' ').toLowerCase().includes(query)
  ), [finance.vendorCredits, query]);

  const approvals = useMemo(() => finance.purchaseApprovals.filter((approval) =>
    !query || [approval.requestNumber, approval.vendor, approval.requestedBy, approval.status, approval.approver, approval.policy].join(' ').toLowerCase().includes(query)
  ), [finance.purchaseApprovals, query]);

  const matches = useMemo(() => finance.billMatches.filter((match) =>
    !query || [match.matchNumber, match.billNumber, match.purchaseOrderNumber, match.receiptNumber, match.vendor, match.status, match.owner].join(' ').toLowerCase().includes(query)
  ), [finance.billMatches, query]);

  const paymentsMade = useMemo(() => finance.paymentsMade.filter((payment) =>
    !query || [payment.paymentNumber, payment.vendor, payment.billNumber, payment.mode, payment.referenceNumber, payment.status].join(' ').toLowerCase().includes(query)
  ), [finance.paymentsMade, query]);

  return (
    <div>
      <PageHeader
        title="Payables"
        description="Static vendor bills, recurring bills, vendor credits, approvals, bill matching, and payments made."
        action={<Button variant="outline">Create bill preview</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Vendor bills" value={String(finance.vendorBills.length)} hint="Bills and approvals" />
        <StatCard label="Open payables" value={formatINR(openBillValue)} hint="Unpaid bill balance" />
        <StatCard label="Overdue bills" value={String(overdueBills.length)} hint="Needs payment review" />
        <StatCard label="Approval queue" value={String(approvalQueue.length)} hint="Requested/escalated" />
        <StatCard label="Match variance" value={formatINR(varianceValue)} hint="PO vs bill variance" />
        <StatCard label="Payments made" value={String(finance.paymentsMade.length)} hint="Static disbursements" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search bills, vendors, approvals, matches, payments..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Vendor Bills' && (
        <DataTable headers={['Bill', 'Vendor', 'PO', 'Due', 'Total', 'Paid', 'Balance', 'Approval', 'Match', 'Status']}>
          {vendorBills.map((bill) => (
            <tr key={bill.id}>
              <td className="px-4 py-3"><p className="font-medium text-indigo-700">{bill.billNumber}</p><p className="text-xs text-slate-500">{bill.billDate}</p></td>
              <td className="px-4 py-3 font-medium text-slate-950">{bill.vendor}</td>
              <td className="px-4 py-3 text-slate-600">{bill.purchaseOrderNumber}</td>
              <td className="px-4 py-3 text-slate-600">{bill.dueDate}</td>
              <td className="px-4 py-3"><AmountDisplay value={bill.total} /></td>
              <td className="px-4 py-3"><AmountDisplay value={bill.paidAmount} tone="success" /></td>
              <td className="px-4 py-3"><AmountDisplay value={Math.max(0, bill.total - bill.paidAmount)} tone={bill.total > bill.paidAmount ? 'warning' : 'success'} /></td>
              <td className="px-4 py-3 text-slate-600">{bill.approvalOwner}</td>
              <td className="px-4 py-3"><StatusPill value={bill.matchStatus} /></td>
              <td className="px-4 py-3"><StatusPill value={bill.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Recurring Bills' && (
        <DataTable headers={['Vendor', 'Schedule', 'Next run', 'Account', 'Amount', 'Status']}>
          {recurringBills.map((bill) => (
            <tr key={bill.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{bill.vendor}</td>
              <td className="px-4 py-3 text-slate-600">{bill.schedule}</td>
              <td className="px-4 py-3 text-slate-600">{bill.nextRun}</td>
              <td className="px-4 py-3 text-slate-600">{bill.accountName}</td>
              <td className="px-4 py-3"><AmountDisplay value={bill.amount} /></td>
              <td className="px-4 py-3"><StatusPill value={bill.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Vendor Credits' && (
        <DataTable headers={['Credit', 'Vendor', 'Date', 'Amount', 'Available', 'Status', 'Reason']}>
          {vendorCredits.map((credit) => (
            <tr key={credit.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{credit.creditNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{credit.vendor}</td>
              <td className="px-4 py-3 text-slate-600">{credit.date}</td>
              <td className="px-4 py-3"><AmountDisplay value={credit.amount} /></td>
              <td className="px-4 py-3"><AmountDisplay value={credit.availableAmount} tone={credit.availableAmount > 0 ? 'warning' : 'success'} /></td>
              <td className="px-4 py-3"><StatusPill value={credit.status} /></td>
              <td className="px-4 py-3 text-slate-600">{credit.reason}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Approvals' && (
        <DataTable headers={['Request', 'Vendor', 'Requested by', 'Amount', 'Due', 'Approver', 'Status', 'Policy']}>
          {approvals.map((approval) => (
            <tr key={approval.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{approval.requestNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{approval.vendor}</td>
              <td className="px-4 py-3 text-slate-600">{approval.requestedBy}</td>
              <td className="px-4 py-3"><AmountDisplay value={approval.amount} /></td>
              <td className="px-4 py-3 text-slate-600">{approval.dueDate}</td>
              <td className="px-4 py-3 text-slate-600">{approval.approver}</td>
              <td className="px-4 py-3"><StatusPill value={approval.status} /></td>
              <td className="px-4 py-3 text-slate-600">{approval.policy}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Bill Matching' && (
        <DataTable headers={['Match', 'Bill', 'PO', 'Receipt', 'Vendor', 'PO amount', 'Bill amount', 'Variance', 'Owner', 'Status']}>
          {matches.map((match) => (
            <tr key={match.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{match.matchNumber}</td>
              <td className="px-4 py-3 text-slate-600">{match.billNumber}</td>
              <td className="px-4 py-3 text-slate-600">{match.purchaseOrderNumber}</td>
              <td className="px-4 py-3 text-slate-600">{match.receiptNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{match.vendor}</td>
              <td className="px-4 py-3"><AmountDisplay value={match.purchaseOrderAmount} /></td>
              <td className="px-4 py-3"><AmountDisplay value={match.billAmount} /></td>
              <td className="px-4 py-3"><AmountDisplay value={match.variance} tone={match.variance ? 'warning' : 'success'} /></td>
              <td className="px-4 py-3 text-slate-600">{match.owner}</td>
              <td className="px-4 py-3"><StatusPill value={match.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Payments Made' && (
        <DataTable headers={['Payment', 'Vendor', 'Bill', 'Date', 'Amount', 'Mode', 'Reference', 'Status']}>
          {paymentsMade.map((payment) => (
            <tr key={payment.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{payment.paymentNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{payment.vendor}</td>
              <td className="px-4 py-3 text-slate-600">{payment.billNumber}</td>
              <td className="px-4 py-3 text-slate-600">{payment.paymentDate}</td>
              <td className="px-4 py-3"><AmountDisplay value={payment.amount} tone="success" /></td>
              <td className="px-4 py-3 text-slate-600">{payment.mode}</td>
              <td className="px-4 py-3 text-slate-600">{payment.referenceNumber}</td>
              <td className="px-4 py-3"><StatusPill value={payment.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const tone = ['Paid', 'Approved', 'Matched', 'Active', 'Applied', 'Reconciled'].includes(value)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : ['Pending Approval', 'Partially Paid', 'Overdue', 'Paused', 'Requested', 'Escalated', 'Variance', 'Pending Review', 'Scheduled', 'Open'].includes(value)
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : ['Rejected', 'Failed', 'Cancelled', 'Refunded'].includes(value)
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return <Badge className={`border ${tone}`}>{value}</Badge>;
};

export default FinancePayablesPage;
