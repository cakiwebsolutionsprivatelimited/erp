import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

type ComplianceView = 'Tax Rules' | 'Invoice Compliance' | 'E-Invoice & E-Way' | 'TDS/TCS' | 'Returns Checklist' | 'Input Credit' | 'Tax Reports';

const views: ComplianceView[] = ['Tax Rules', 'Invoice Compliance', 'E-Invoice & E-Way', 'TDS/TCS', 'Returns Checklist', 'Input Credit', 'Tax Reports'];

const FinanceCompliancePage: React.FC = () => {
  const finance = useFinanceData();
  const [view, setView] = useState<ComplianceView>('Tax Rules');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const outputTax = finance.taxReturns.filter((item) => item.period === 'June 2026').reduce((sum, item) => sum + item.outputTax, 0);
  const inputCredit = finance.inputCreditReviews.reduce((sum, item) => sum + item.eligibleAmount, 0);
  const pendingEInvoice = finance.eInvoiceRecords.filter((record) => ['Pending', 'Failed'].includes(record.irnStatus));
  const returnQueue = finance.taxReturns.filter((taxReturn) => taxReturn.status !== 'Filed');
  const tdsTcsPayable = finance.tdsTcsRules.reduce((sum, rule) => sum + rule.payable, 0);
  const creditIssues = finance.inputCreditReviews.filter((credit) => ['Mismatch', 'Blocked', 'Pending'].includes(credit.status));

  const taxRules = useMemo(() => finance.taxRules.filter((rule) =>
    !query || [rule.name, rule.taxType, rule.supplyType, rule.appliesTo, rule.placeOfSupply, rule.accountCode, rule.status].join(' ').toLowerCase().includes(query)
  ), [finance.taxRules, query]);

  const invoiceCompliance = useMemo(() => finance.invoiceCompliance.filter((invoice) =>
    !query || [invoice.invoiceNumber, invoice.customer, invoice.gstinStatus, invoice.taxStatus, invoice.eInvoiceStatus, invoice.eWayBillStatus, invoice.owner].join(' ').toLowerCase().includes(query)
  ), [finance.invoiceCompliance, query]);

  const eInvoiceRecords = useMemo(() => finance.eInvoiceRecords.filter((record) =>
    !query || [record.invoiceNumber, record.customer, record.irnStatus, record.ackNumber, record.eWayBillStatus, record.transporter].join(' ').toLowerCase().includes(query)
  ), [finance.eInvoiceRecords, query]);

  const tdsTcsRules = useMemo(() => finance.tdsTcsRules.filter((rule) =>
    !query || [rule.section, rule.partyType, rule.status, rule.nextDueDate].join(' ').toLowerCase().includes(query)
  ), [finance.tdsTcsRules, query]);

  const taxReturns = useMemo(() => finance.taxReturns.filter((taxReturn) =>
    !query || [taxReturn.period, taxReturn.returnType, taxReturn.owner, taxReturn.status, taxReturn.checklist.join(' ')].join(' ').toLowerCase().includes(query)
  ), [finance.taxReturns, query]);

  const inputCredits = useMemo(() => finance.inputCreditReviews.filter((credit) =>
    !query || [credit.billNumber, credit.vendor, credit.vendorGstin, credit.status, credit.mismatchReason].join(' ').toLowerCase().includes(query)
  ), [finance.inputCreditReviews, query]);

  const taxReports = useMemo(() => finance.taxReports.filter((report) =>
    !query || [report.name, report.category, report.period, report.metric, report.owner, report.status].join(' ').toLowerCase().includes(query)
  ), [finance.taxReports, query]);

  return (
    <div>
      <PageHeader
        title="Tax & Compliance"
        description="Static GST/VAT rules, invoice compliance, e-invoice/e-way previews, TDS/TCS, tax returns, input credit, and tax reports."
        action={<Button variant="outline">Prepare return preview</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="June output tax" value={formatINR(outputTax)} hint="Return preview" />
        <StatCard label="Eligible ITC" value={formatINR(inputCredit)} hint="Input credit review" />
        <StatCard label="E-invoice issues" value={String(pendingEInvoice.length)} hint="Pending/failed IRN" />
        <StatCard label="Return queue" value={String(returnQueue.length)} hint="Not filed" />
        <StatCard label="TDS/TCS payable" value={formatINR(tdsTcsPayable)} hint="Withholding preview" />
        <StatCard label="Credit issues" value={String(creditIssues.length)} hint="Mismatch/blocked/pending" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search tax rules, invoices, returns, credits, reports..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Tax Rules' && (
        <DataTable headers={['Rule', 'Type', 'Rate', 'Supply', 'Applies to', 'Place', 'Account', 'Status']}>
          {taxRules.map((rule) => (
            <tr key={rule.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{rule.name}</td>
              <td className="px-4 py-3"><StatusPill value={rule.taxType} /></td>
              <td className="px-4 py-3 font-medium text-slate-950">{rule.rate}%</td>
              <td className="px-4 py-3 text-slate-600">{rule.supplyType}</td>
              <td className="px-4 py-3 text-slate-600">{rule.appliesTo}</td>
              <td className="px-4 py-3 text-slate-600">{rule.placeOfSupply}</td>
              <td className="px-4 py-3 font-medium text-indigo-700">{rule.accountCode}</td>
              <td className="px-4 py-3"><StatusPill value={rule.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Invoice Compliance' && (
        <DataTable headers={['Invoice', 'Customer', 'Date', 'Taxable', 'Tax', 'GSTIN', 'Tax calc', 'IRN', 'E-way', 'Owner']}>
          {invoiceCompliance.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{invoice.invoiceNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{invoice.customer}</td>
              <td className="px-4 py-3 text-slate-600">{invoice.invoiceDate}</td>
              <td className="px-4 py-3"><AmountDisplay value={invoice.taxableValue} /></td>
              <td className="px-4 py-3"><AmountDisplay value={invoice.taxAmount} /></td>
              <td className="px-4 py-3"><StatusPill value={invoice.gstinStatus} /></td>
              <td className="px-4 py-3"><StatusPill value={invoice.taxStatus} /></td>
              <td className="px-4 py-3"><StatusPill value={invoice.eInvoiceStatus} /></td>
              <td className="px-4 py-3"><StatusPill value={invoice.eWayBillStatus} /></td>
              <td className="px-4 py-3 text-slate-600">{invoice.owner}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'E-Invoice & E-Way' && (
        <DataTable headers={['Invoice', 'Customer', 'IRN', 'Ack/Message', 'E-way', 'Transporter', 'Distance', 'Updated']}>
          {eInvoiceRecords.map((record) => (
            <tr key={record.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{record.invoiceNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{record.customer}</td>
              <td className="px-4 py-3"><StatusPill value={record.irnStatus} /></td>
              <td className="px-4 py-3 text-slate-600">{record.ackNumber}</td>
              <td className="px-4 py-3"><StatusPill value={record.eWayBillStatus} /></td>
              <td className="px-4 py-3 text-slate-600">{record.transporter}</td>
              <td className="px-4 py-3 text-slate-600">{record.distanceKm} km</td>
              <td className="px-4 py-3 text-slate-600">{record.lastUpdated}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'TDS/TCS' && (
        <DataTable headers={['Section', 'Party type', 'Rate', 'Threshold', 'Deducted/Collected', 'Payable', 'Next due', 'Status']}>
          {tdsTcsRules.map((rule) => (
            <tr key={rule.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{rule.section}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{rule.partyType}</td>
              <td className="px-4 py-3 text-slate-600">{rule.rate}%</td>
              <td className="px-4 py-3"><AmountDisplay value={rule.threshold} /></td>
              <td className="px-4 py-3"><AmountDisplay value={rule.deductedOrCollected} /></td>
              <td className="px-4 py-3"><AmountDisplay value={rule.payable} tone={rule.payable ? 'warning' : 'success'} /></td>
              <td className="px-4 py-3 text-slate-600">{rule.nextDueDate}</td>
              <td className="px-4 py-3"><StatusPill value={rule.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Returns Checklist' && (
        <DataTable headers={['Period', 'Return', 'Due date', 'Output tax', 'Input credit', 'Payable', 'Owner', 'Status', 'Checklist']}>
          {taxReturns.map((taxReturn) => (
            <tr key={taxReturn.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{taxReturn.period}</td>
              <td className="px-4 py-3 font-medium text-indigo-700">{taxReturn.returnType}</td>
              <td className="px-4 py-3 text-slate-600">{taxReturn.dueDate}</td>
              <td className="px-4 py-3"><AmountDisplay value={taxReturn.outputTax} /></td>
              <td className="px-4 py-3"><AmountDisplay value={taxReturn.inputCredit} tone="success" /></td>
              <td className="px-4 py-3"><AmountDisplay value={taxReturn.payable} tone={taxReturn.payable ? 'warning' : 'success'} /></td>
              <td className="px-4 py-3 text-slate-600">{taxReturn.owner}</td>
              <td className="px-4 py-3"><StatusPill value={taxReturn.status} /></td>
              <td className="px-4 py-3 text-slate-600">{taxReturn.checklist.join(', ')}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Input Credit' && (
        <DataTable headers={['Bill', 'Vendor', 'GSTIN', 'Date', 'Input GST', 'Eligible', 'Status', 'Mismatch reason']}>
          {inputCredits.map((credit) => (
            <tr key={credit.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{credit.billNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{credit.vendor}</td>
              <td className="px-4 py-3 text-slate-600">{credit.vendorGstin}</td>
              <td className="px-4 py-3 text-slate-600">{credit.billDate}</td>
              <td className="px-4 py-3"><AmountDisplay value={credit.inputGst} /></td>
              <td className="px-4 py-3"><AmountDisplay value={credit.eligibleAmount} tone={credit.eligibleAmount ? 'success' : 'warning'} /></td>
              <td className="px-4 py-3"><StatusPill value={credit.status} /></td>
              <td className="px-4 py-3 text-slate-600">{credit.mismatchReason}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Tax Reports' && (
        <DataTable headers={['Report', 'Category', 'Period', 'Metric', 'Owner', 'Status']}>
          {taxReports.map((report) => (
            <tr key={report.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{report.name}</td>
              <td className="px-4 py-3 text-slate-600">{report.category}</td>
              <td className="px-4 py-3 text-slate-600">{report.period}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{report.metric}</td>
              <td className="px-4 py-3 text-slate-600">{report.owner}</td>
              <td className="px-4 py-3"><StatusPill value={report.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const tone = ['Active', 'Generated', 'Compliant', 'Ready', 'Filed', 'Matched'].includes(value)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : ['Draft', 'Pending', 'Needs Review', 'Review', 'In Progress', 'Mismatch', 'Scheduled', 'Expired'].includes(value)
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : ['Archived', 'Failed', 'Blocked', 'Paused', 'Overdue'].includes(value)
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return <Badge className={`border ${tone}`}>{value}</Badge>;
};

export default FinanceCompliancePage;
