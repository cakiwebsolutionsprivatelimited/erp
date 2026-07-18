import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, CalendarDays, FileUp, IndianRupee, PlusCircle, Quote, Radar, Target, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { CRM_TODAY, countBy, getLeadRating, getLeadScore, getQualification, getWeightedValue, scoreTone, sumBy } from '@/tenant/crm/crmDemoUtils';
import type { Lead, LeadStage } from '@/tenant/types';

const stageOrder: LeadStage[] = ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];

const CrmDashboardPage: React.FC = () => {
  const { leads, followUps } = useTenantData();
  const navigate = useNavigate();
  const openLeads = leads.filter((lead) => lead.status === 'open');
  const newLeads = leads.filter((lead) => lead.stage === 'New');
  const wonLeads = leads.filter((lead) => lead.stage === 'Won');
  const lostLeads = leads.filter((lead) => lead.stage === 'Lost');
  const dueToday = followUps.filter((followUp) => !followUp.completed && followUp.date.slice(0, 10) === CRM_TODAY);
  const overdue = followUps.filter((followUp) => !followUp.completed && followUp.date.slice(0, 10) < CRM_TODAY);
  const pipelineValue = sumBy(openLeads, (lead) => lead.expectedValue);
  const weightedForecast = sumBy(openLeads, getWeightedValue);
  const averageScore = leads.length ? Math.round(sumBy(leads, getLeadScore) / leads.length) : 0;
  const hotLeads = leads.filter((lead) => getLeadRating(lead) === 'Hot');
  const qualifiedLeads = leads.filter((lead) => ['Sales Qualified', 'Proposal Ready'].includes(getQualification(lead)));
  const conversionRate = leads.length ? Math.round((wonLeads.length / leads.length) * 100) : 0;
  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const topOpportunities = [...openLeads].sort((a, b) => getWeightedValue(b) - getWeightedValue(a)).slice(0, 6);
  const sourcePerformance = buildSourcePerformance(leads);
  const scoreDistribution = buildScoreDistribution(leads);
  const stageCounts = stageOrder.map((stage) => [stage, leads.filter((lead) => lead.stage === stage).length] as [string, number]);
  const ownerPerformance = countBy(leads.map((lead) => lead.assignedTo));

  return (
    <div>
      <PageHeader
        title="CRM Dashboard"
        description="Enterprise lead-to-revenue overview using local demo data, scoring, forecast, source performance, and follow-up risk."
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/crm/leads/new')}><PlusCircle className="h-4 w-4" />Add Lead</Button>
            <Button variant="outline"><FileUp className="h-4 w-4" />Import Leads</Button>
            <Button variant="outline" onClick={() => navigate('/crm/follow-ups')}><CalendarDays className="h-4 w-4" />Schedule Follow-up</Button>
            <Button variant="outline" onClick={() => navigate('/sales/quotations/new')}><Quote className="h-4 w-4" />Create Quotation</Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Total leads" value={String(leads.length)} hint={`${newLeads.length} new`} icon={<Target className="h-4 w-4" />} />
        <StatCard label="Qualified leads" value={String(qualifiedLeads.length)} hint="SQL or proposal ready" icon={<Radar className="h-4 w-4" />} />
        <StatCard label="Hot leads" value={String(hotLeads.length)} hint={`Avg score ${averageScore}`} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Due today" value={String(dueToday.length)} hint="Follow-ups scheduled" icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Overdue" value={String(overdue.length)} hint="Needs attention" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Expected revenue" value={formatINR(pipelineValue)} hint="Open pipeline" icon={<IndianRupee className="h-4 w-4" />} />
        <StatCard label="Weighted forecast" value={formatINR(weightedForecast)} hint="Probability adjusted" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Conversion" value={`${conversionRate}%`} hint={`${wonLeads.length} won, ${lostLeads.length} lost`} icon={<Users className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Conversion funnel">
          <Funnel items={stageCounts} />
        </Panel>
        <Panel title="Lead score distribution">
          <div className="grid gap-3 sm:grid-cols-3">
            {scoreDistribution.map((item) => (
              <div key={item.label} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <Badge className={scoreTone(item.score)}>{item.count}</Badge>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${item.percent}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.percent}% of leads</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-3">
        <Panel title="Source performance">
          <div className="space-y-3">
            {sourcePerformance.slice(0, 6).map((source) => (
              <div key={source.name} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{source.name}</p>
                    <p className="text-xs text-slate-500">{source.count} leads · {source.conversion}% conversion</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-950">{formatINR(source.value)}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className="h-2 rounded-full bg-teal-600" style={{ width: `${source.conversion}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Owner leaderboard">
          <div className="space-y-3">
            {ownerPerformance.map(([owner, count]) => (
              <div key={owner} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{owner}</p>
                  <p className="text-xs text-slate-500">Active CRM owner</p>
                </div>
                <Badge variant="secondary">{count} leads</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Follow-up risk">
          <div className="space-y-3">
            {[...overdue, ...dueToday].slice(0, 6).map((followUp) => {
              const lead = leads.find((item) => item.id === followUp.leadId);
              return (
                <Link key={followUp.id} to={`/crm/leads/${followUp.leadId}`} className="block rounded-md border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{followUp.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{lead?.name} · {new Date(followUp.date).toLocaleString('en-IN')}</p>
                    </div>
                    <Badge className={followUp.date.slice(0, 10) < CRM_TODAY ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}>
                      {followUp.date.slice(0, 10) < CRM_TODAY ? 'Overdue' : 'Today'}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <DataTable headers={['Recently created lead', 'Qualification', 'Score', 'Owner', 'Value', 'Next activity']}>
          {recentLeads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-4 py-3">
                <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link>
                <p className="text-xs text-slate-500">{lead.company} · {lead.campaign || lead.source}</p>
              </td>
              <td className="px-4 py-3"><Badge variant="secondary">{getQualification(lead)}</Badge></td>
              <td className="px-4 py-3"><Badge className={scoreTone(getLeadScore(lead))}>{getLeadScore(lead)}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{lead.assignedTo}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{formatINR(lead.expectedValue)}</td>
              <td className="px-4 py-3 text-slate-600">{new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </DataTable>

        <Panel title="Top opportunities">
          <div className="space-y-3">
            {topOpportunities.map((lead) => (
              <Link key={lead.id} to={`/crm/leads/${lead.id}`} className="block rounded-md border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{lead.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{lead.company} · {lead.probability}% probability</p>
                  </div>
                  <Badge className={scoreTone(getLeadScore(lead))}>{getLeadScore(lead)}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Weighted</span>
                  <span className="font-semibold text-slate-900">{formatINR(getWeightedValue(lead))}</span>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
};

const buildSourcePerformance = (leads: Lead[]) =>
  Object.values(leads.reduce<Record<string, { name: string; count: number; value: number; won: number }>>((acc, lead) => {
    acc[lead.source] ||= { name: lead.source, count: 0, value: 0, won: 0 };
    acc[lead.source].count += 1;
    acc[lead.source].value += lead.expectedValue;
    acc[lead.source].won += lead.stage === 'Won' ? 1 : 0;
    return acc;
  }, {}))
    .map((item) => ({ ...item, conversion: Math.round((item.won / Math.max(1, item.count)) * 100) }))
    .sort((a, b) => b.value - a.value);

const buildScoreDistribution = (leads: Lead[]) => {
  const total = Math.max(1, leads.length);
  const buckets = [
    { label: 'Hot 78+', count: leads.filter((lead) => getLeadScore(lead) >= 78).length, score: 90 },
    { label: 'Warm 55-77', count: leads.filter((lead) => getLeadScore(lead) >= 55 && getLeadScore(lead) < 78).length, score: 66 },
    { label: 'Cold <55', count: leads.filter((lead) => getLeadScore(lead) < 55).length, score: 42 },
  ];
  return buckets.map((bucket) => ({ ...bucket, percent: Math.round((bucket.count / total) * 100) }));
};

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
    {children}
  </div>
);

const Funnel: React.FC<{ items: Array<[string, number]> }> = ({ items }) => {
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

export default CrmDashboardPage;
