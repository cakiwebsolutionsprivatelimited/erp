import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, FileUp, IndianRupee, PlusCircle, Quote, Target, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

const TODAY = '2026-06-17';

const CrmDashboardPage: React.FC = () => {
  const { leads, customers, followUps } = useTenantData();
  const navigate = useNavigate();
  const openLeads = leads.filter((lead) => lead.status === 'open');
  const newLeads = leads.filter((lead) => lead.stage === 'New');
  const wonLeads = leads.filter((lead) => lead.stage === 'Won');
  const lostLeads = leads.filter((lead) => lead.stage === 'Lost');
  const pipelineValue = openLeads.reduce((sum, lead) => sum + lead.expectedValue, 0);
  const dueToday = followUps.filter((followUp) => !followUp.completed && followUp.date.slice(0, 10) === TODAY);
  const overdue = followUps.filter((followUp) => !followUp.completed && followUp.date.slice(0, 10) < TODAY);
  const conversionRate = leads.length ? Math.round((wonLeads.length / leads.length) * 100) : 0;
  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const highValueLeads = [...openLeads].sort((a, b) => b.expectedValue - a.expectedValue).slice(0, 6);
  const sourceCounts = countBy(leads.map((lead) => lead.source));
  const stageCounts = countBy(leads.map((lead) => lead.stage));

  return (
    <div>
      <PageHeader
        title="CRM Dashboard"
        description="Sales pipeline overview for demo leads, follow-ups, activities, and customers."
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/crm/leads/new')}><PlusCircle className="h-4 w-4" />Add Lead</Button>
            <Button variant="outline"><FileUp className="h-4 w-4" />Import Leads</Button>
            <Button variant="outline" onClick={() => navigate('/crm/follow-ups')}><CalendarDays className="h-4 w-4" />Schedule Follow-up</Button>
            <Button variant="outline" onClick={() => navigate('/crm/quotations')}><Quote className="h-4 w-4" />Create Quotation</Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Total leads" value={String(leads.length)} hint="All demo enquiries" icon={<Target className="h-4 w-4" />} />
        <StatCard label="New leads" value={String(newLeads.length)} hint="Awaiting first contact" icon={<PlusCircle className="h-4 w-4" />} />
        <StatCard label="Due today" value={String(dueToday.length)} hint="Follow-ups scheduled" icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Overdue" value={String(overdue.length)} hint="Needs attention" icon={<TrendingDown className="h-4 w-4" />} />
        <StatCard label="Won" value={String(wonLeads.length)} hint="Closed successfully" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Lost" value={String(lostLeads.length)} hint="Closed lost" icon={<TrendingDown className="h-4 w-4" />} />
        <StatCard label="Expected revenue" value={formatINR(pipelineValue)} hint="Open pipeline value" icon={<IndianRupee className="h-4 w-4" />} />
        <StatCard label="Conversion" value={`${conversionRate}%`} hint={`${customers.length} customers`} icon={<Users className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <SummaryPanel title="Leads by source" items={sourceCounts} />
        <SummaryPanel title="Leads by stage" items={stageCounts} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <DataTable headers={['Recently created lead', 'Stage', 'Owner', 'Value', 'Next follow-up']}>
          {recentLeads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-4 py-3">
                <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link>
                <p className="text-xs text-slate-500">{lead.company} · {lead.city || 'Bhubaneswar'}</p>
              </td>
              <td className="px-4 py-3"><Badge variant="secondary">{lead.stage}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{lead.assignedTo}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{formatINR(lead.expectedValue)}</td>
              <td className="px-4 py-3 text-slate-600">{new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </DataTable>

        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Today's and overdue follow-ups</h2>
          <div className="mt-4 space-y-3">
            {[...dueToday, ...overdue].slice(0, 6).map((followUp) => {
              const lead = leads.find((item) => item.id === followUp.leadId);
              return (
                <Link key={followUp.id} to={`/crm/leads/${followUp.leadId}`} className="block rounded-md border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{followUp.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{lead?.name} · {new Date(followUp.date).toLocaleString('en-IN')}</p>
                    </div>
                    <Badge className={followUp.date.slice(0, 10) < TODAY ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}>
                      {followUp.date.slice(0, 10) < TODAY ? 'Overdue' : 'Today'}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-950">High-value opportunities</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {highValueLeads.map((lead) => (
            <Link key={lead.id} to={`/crm/leads/${lead.id}`} className="rounded-md border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{lead.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{lead.company} · {lead.probability}% probability</p>
                </div>
                <Badge className={lead.priority === 'High' ? 'bg-red-50 text-red-700' : lead.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}>
                  {lead.priority || 'Medium'}
                </Badge>
              </div>
              <p className="mt-3 font-semibold text-slate-900">{formatINR(lead.expectedValue)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

const countBy = (items: string[]) =>
  Object.entries(items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

const SummaryPanel: React.FC<{ title: string; items: Array<[string, number]> }> = ({ title, items }) => {
  const max = Math.max(...items.map((item) => item[1]), 1);
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.slice(0, 8).map(([label, count]) => (
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
    </div>
  );
};

export default CrmDashboardPage;
