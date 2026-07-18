import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, PlusCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { CRM_TODAY, campaignMetrics, countBy, getLeadScore, getWeightedValue, scoreTone, sumBy } from '@/tenant/crm/crmDemoUtils';

export const CrmQuotationsPage: React.FC = () => {
  const { leads, quotations, salesQuotations } = useTenantData();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="CRM Quotations"
        description="CRM-linked quote visibility with handoff into the Sales quotation workspace."
        action={<Button onClick={() => navigate('/sales/quotations/new')}><PlusCircle className="h-4 w-4" />Create in Sales</Button>}
      />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="CRM quote records" value={String(quotations.length)} hint="Lead-linked summary" icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Sales quotations" value={String(salesQuotations.length)} hint="Owned by Sales module" icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Accepted/converted" value={String(salesQuotations.filter((item) => ['Accepted', 'Converted to Order'].includes(item.status)).length)} hint="Sales quote states" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Open CRM value" value={formatINR(sumBy(quotations, (item) => item.amount))} hint="Local demo amount" />
      </section>

      <DataTable headers={['Quotation', 'Lead', 'Score', 'Amount', 'Status', 'Created', 'Handoff']}>
        {quotations.map((quotation) => {
          const lead = leads.find((item) => item.id === quotation.leadId);
          return (
            <tr key={quotation.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{quotation.id}</td>
              <td className="px-4 py-3">
                {lead ? <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link> : quotation.customerName}
                <p className="text-xs text-slate-500">{quotation.customerName}</p>
              </td>
              <td className="px-4 py-3">{lead && <Badge className={scoreTone(getLeadScore(lead))}>{getLeadScore(lead)}</Badge>}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{formatINR(quotation.amount)}</td>
              <td className="px-4 py-3 text-slate-600">{quotation.status}</td>
              <td className="px-4 py-3 text-slate-600">{quotation.createdAt}</td>
              <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => navigate('/sales/quotations')}>Open Sales</Button></td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
};

export const CrmReportsPage: React.FC = () => {
  const { leads, customers, followUps } = useTenantData();
  const won = leads.filter((lead) => lead.stage === 'Won');
  const lost = leads.filter((lead) => lead.stage === 'Lost');
  const open = leads.filter((lead) => lead.status === 'open');
  const overdue = followUps.filter((item) => !item.completed && item.date.slice(0, 10) < CRM_TODAY);
  const conversionRate = leads.length ? Math.round((won.length / leads.length) * 100) : 0;
  const weightedForecast = sumBy(open, getWeightedValue);
  const sourceCounts = countBy(leads.map((lead) => lead.source));
  const stageCounts = countBy(leads.map((lead) => lead.stage));
  const ownerCounts = countBy(leads.map((lead) => lead.assignedTo));
  const followUpSla = buildFollowUpSla(followUps);

  return (
    <div>
      <PageHeader title="CRM Reports" description="Static report panels for source conversion, pipeline stages, owner performance, follow-up SLA, won/lost, and forecast." />
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Lead conversion" value={`${conversionRate}%`} hint={`${won.length} won of ${leads.length}`} icon={<BarChart3 className="h-4 w-4" />} />
        <StatCard label="Customers" value={String(customers.length)} hint="Converted CRM records" icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Weighted forecast" value={formatINR(weightedForecast)} hint="Open pipeline forecast" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Overdue follow-ups" value={String(overdue.length)} hint="SLA attention" icon={<BarChart3 className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Lead source conversion">
          <DataTable headers={['Source', 'Leads', 'Demo conversion', 'Campaign ROI']}>
            {sourceCounts.map(([source, count], index) => (
              <tr key={source}>
                <td className="px-4 py-3 font-medium text-slate-950">{source}</td>
                <td className="px-4 py-3">{count}</td>
                <td className="px-4 py-3">{Math.max(8, 34 - index * 3)}%</td>
                <td className="px-4 py-3">{index < campaignMetrics.length ? `${Math.round(campaignMetrics[index].revenue / Math.max(1, campaignMetrics[index].spend))}x` : '2x'}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>

        <Panel title="Pipeline stage report">
          <BarList items={stageCounts} />
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-3">
        <Panel title="Owner performance">
          <div className="space-y-3">
            {ownerCounts.map(([owner, count]) => (
              <div key={owner} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{owner}</span>
                  <Badge variant="secondary">{count} leads</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">Demo won/lost and activity performance will expand with backend reporting.</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Follow-up SLA">
          <div className="space-y-3">
            {followUpSla.map((item) => (
              <div key={item.label} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{item.label}</span>
                  <Badge className={item.label === 'Overdue' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}>{item.count}</Badge>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Won/lost reasons">
          <div className="space-y-3">
            {[
              ['Won', won.length, 'Need matched and implementation timeline agreed'],
              ['Lost', lost.length, 'Budget delayed or competitor selected'],
              ['Nurture', open.length, 'Still in active follow-up'],
            ].map(([label, count, reason]) => (
              <div key={label as string} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{label as string}</span>
                  <Badge variant="secondary">{count as number}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">{reason as string}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
};

const buildFollowUpSla = (followUps: ReturnType<typeof useTenantData>['followUps']) => {
  const total = Math.max(1, followUps.length);
  const overdue = followUps.filter((item) => !item.completed && item.date.slice(0, 10) < CRM_TODAY).length;
  const completed = followUps.filter((item) => item.completed).length;
  const open = followUps.length - overdue - completed;
  return [
    { label: 'Completed', count: completed, percent: Math.round((completed / total) * 100) },
    { label: 'Open', count: open, percent: Math.round((open / total) * 100) },
    { label: 'Overdue', count: overdue, percent: Math.round((overdue / total) * 100) },
  ];
};

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
    {children}
  </div>
);

const BarList: React.FC<{ items: Array<[string, number]> }> = ({ items }) => {
  const max = Math.max(...items.map((item) => item[1]), 1);
  return (
    <div className="space-y-3">
      {items.map(([label, count]) => (
        <div key={label}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{label}</span>
            <span className="text-slate-500">{count}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${(count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};
