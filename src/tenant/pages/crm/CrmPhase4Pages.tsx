import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, BrainCircuit, CheckCircle2, FileCheck2, GitBranch, KeyRound, PlugZap, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { countBy, getLeadScore, getWeightedValue, sumBy } from '@/tenant/crm/crmDemoUtils';

const workflowStatuses = ['All', 'Draft', 'Active', 'Paused'] as const;
const approvalStatuses = ['All', 'Pending', 'Approved', 'Rejected', 'Escalated'] as const;
const integrationStatuses = ['All', 'Connected', 'Needs Auth', 'Disabled', 'Preview'] as const;
const insightTypes = ['All', 'Lead Scoring', 'Email Generator', 'Meeting Summary', 'Sentiment Analysis'] as const;

export const CrmAutomationPage: React.FC = () => {
  const { crmWorkflows } = useTenantData();
  const [status, setStatus] = useState<(typeof workflowStatuses)[number]>('All');
  const [selectedId, setSelectedId] = useState(crmWorkflows[0]?.id || '');
  const filtered = crmWorkflows.filter((workflow) => status === 'All' || workflow.status === status);
  const selected = crmWorkflows.find((workflow) => workflow.id === selectedId) || crmWorkflows[0];

  return (
    <div>
      <PageHeader
        title="Workflow Automation"
        description="Visual automation builder preview with triggers, conditions, actions, status, and run history. Rules do not execute in UI mode."
        action={<Button variant="outline"><GitBranch className="h-4 w-4" />New workflow preview</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Workflows" value={String(crmWorkflows.length)} hint="Static rules" icon={<GitBranch className="h-4 w-4" />} />
        <StatCard label="Active" value={String(crmWorkflows.filter((item) => item.status === 'Active').length)} hint="Ready preview" />
        <StatCard label="Runs" value={String(sumBy(crmWorkflows, (item) => item.runs))} hint="Demo history" />
        <StatCard label="Avg success" value={`${Math.round(sumBy(crmWorkflows, (item) => item.successRate) / Math.max(1, crmWorkflows.length))}%`} hint="Preview metric" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <Panel title="Workflow list">
          <div className="mb-3">
            <Select label="Status" value={status} options={workflowStatuses} onChange={(value) => setStatus(value as typeof status)} />
          </div>
          <div className="space-y-3">
            {filtered.map((workflow) => (
              <button
                key={workflow.id}
                onClick={() => setSelectedId(workflow.id)}
                className={`w-full rounded-md border p-3 text-left transition ${selected?.id === workflow.id ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-slate-50 hover:border-indigo-200'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950">{workflow.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{workflow.trigger}</p>
                  </div>
                  <Badge className={workflow.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : workflow.status === 'Paused' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}>{workflow.status}</Badge>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        {selected && (
          <Panel title="Builder preview">
            <div className="grid gap-4 xl:grid-cols-3">
              <BuilderColumn title="Trigger" items={[selected.trigger]} tone="indigo" />
              <BuilderColumn title="Conditions" items={selected.conditions} tone="amber" />
              <BuilderColumn title="Actions" items={selected.actions} tone="emerald" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <Signal label="Owner" value={selected.owner} />
              <Signal label="Last run" value={selected.lastRunAt} />
              <Signal label="Runs" value={String(selected.runs)} />
              <Signal label="Success" value={`${selected.successRate}%`} />
            </div>
            <div className="mt-5 rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
              This builder is a static UI preview. Backend triggers, queues, scheduled jobs, and notifications will be built after UI approval.
            </div>
          </Panel>
        )}
      </section>
    </div>
  );
};

export const CrmApprovalsPage: React.FC = () => {
  const { crmApprovals, leads } = useTenantData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<(typeof approvalStatuses)[number]>('All');
  const filtered = crmApprovals.filter((approval) => {
    const query = search.toLowerCase().trim();
    return (!query || [approval.title, approval.requester, approval.approver, approval.reason, approval.relatedQuotationNumber].join(' ').toLowerCase().includes(query)) &&
      (status === 'All' || approval.status === status);
  });

  return (
    <div>
      <PageHeader title="Approval Engine" description="High-value quote, discount, and workflow approval queue. Approve/reject actions are visual previews only." action={<Button variant="outline"><FileCheck2 className="h-4 w-4" />Approval policy preview</Button>} />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Requests" value={String(crmApprovals.length)} hint="Static approvals" icon={<FileCheck2 className="h-4 w-4" />} />
        <StatCard label="Pending" value={String(crmApprovals.filter((item) => item.status === 'Pending').length)} hint="Needs review" />
        <StatCard label="Escalated" value={String(crmApprovals.filter((item) => item.status === 'Escalated').length)} hint="Manager queue" />
        <StatCard label="Amount in review" value={formatINR(sumBy(crmApprovals.filter((item) => item.status === 'Pending' || item.status === 'Escalated'), (item) => item.amount))} hint="Pending + escalated" />
      </section>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search approval, requester, quote..." />
        <Select label="Status" value={status} options={approvalStatuses} onChange={(value) => setStatus(value as typeof status)} />
      </FilterBar>

      <DataTable headers={['Request', 'Type', 'Amount', 'Requester', 'Approver', 'Status', 'Due', 'Related']}>
        {filtered.map((approval) => {
          const lead = approval.relatedLeadId ? leads.find((item) => item.id === approval.relatedLeadId) : undefined;
          return (
            <tr key={approval.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{approval.title}</p>
                <p className="text-xs text-slate-500">{approval.reason}</p>
              </td>
              <td className="px-4 py-3">{approval.type}</td>
              <td className="px-4 py-3 font-medium">{formatINR(approval.amount)}</td>
              <td className="px-4 py-3">{approval.requester}</td>
              <td className="px-4 py-3">{approval.approver}</td>
              <td className="px-4 py-3"><Badge className={approvalTone(approval.status)}>{approval.status}</Badge></td>
              <td className="px-4 py-3">{approval.dueAt}</td>
              <td className="px-4 py-3">{lead ? <Link className="text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link> : approval.relatedQuotationNumber || 'Workflow'}</td>
            </tr>
          );
        })}
      </DataTable>

      <section className="mt-5 grid gap-5 xl:grid-cols-3">
        {[
          ['Quote value threshold', 'Above Rs 1,50,000 routes to Sales Manager'],
          ['Discount threshold', 'Above 12% routes to Business Owner'],
          ['Custom workflow', 'Duplicate-risk conversion requires CRM Admin'],
        ].map(([title, body]) => <PolicyCard key={title} title={title} body={body} />)}
      </section>
    </div>
  );
};

export const CrmAnalyticsPage: React.FC = () => {
  const { leads, followUps, crmCampaigns, crmSupportTickets, crmCommunications } = useTenantData();
  const openLeads = leads.filter((lead) => lead.status === 'open');
  const weightedForecast = sumBy(openLeads, getWeightedValue);
  const stageCounts = countBy(leads.map((lead) => lead.stage));
  const ownerActivity = countBy([...followUps.map((item) => item.owner), ...crmCommunications.map((item) => item.owner)]);
  const breachedTickets = crmSupportTickets.filter((ticket) => ticket.slaStatus === 'Breached');
  const campaignRevenue = sumBy(crmCampaigns, (campaign) => campaign.revenue);

  return (
    <div>
      <PageHeader title="Advanced Analytics" description="Forecasting, conversion funnel, activity leaderboard, SLA breach report, campaign ROI, and export previews." action={<Button variant="outline"><CheckCircle2 className="h-4 w-4" />Export preview</Button>} />
      <section className="mb-5 grid gap-4 md:grid-cols-4 xl:grid-cols-6">
        <StatCard label="Weighted forecast" value={formatINR(weightedForecast)} hint="Open pipeline" />
        <StatCard label="Campaign revenue" value={formatINR(campaignRevenue)} hint="Attributed demo revenue" />
        <StatCard label="SLA breaches" value={String(breachedTickets.length)} hint="Support report" />
        <StatCard label="Avg lead score" value={`${Math.round(sumBy(leads, getLeadScore) / Math.max(1, leads.length))}`} hint="Scoring report" />
        <StatCard label="Open activities" value={String(followUps.filter((item) => !item.completed).length)} hint="Follow-ups" />
        <StatCard label="Exports" value="CSV/PDF" hint="UI controls only" />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="Conversion funnel">
          <BarList items={stageCounts} />
        </Panel>
        <Panel title="Activity leaderboard">
          <div className="space-y-3">
            {ownerActivity.map(([owner, count]) => (
              <div key={owner} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3">
                <span className="font-medium text-slate-800">{owner}</span>
                <Badge variant="secondary">{count} activities</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <DataTable headers={['SLA breach', 'Priority', 'Assignee', 'Due', 'Escalation']}>
          {breachedTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="px-4 py-3"><p className="font-medium text-slate-950">{ticket.subject}</p><p className="text-xs text-slate-500">{ticket.id}</p></td>
              <td className="px-4 py-3">{ticket.priority}</td>
              <td className="px-4 py-3">{ticket.assignee}</td>
              <td className="px-4 py-3">{ticket.dueAt}</td>
              <td className="px-4 py-3">{ticket.escalationLevel}</td>
            </tr>
          ))}
        </DataTable>
        <DataTable headers={['Campaign', 'Spend', 'Revenue', 'ROI', 'Conversions']}>
          {crmCampaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{campaign.name}</td>
              <td className="px-4 py-3">{formatINR(campaign.spend)}</td>
              <td className="px-4 py-3">{formatINR(campaign.revenue)}</td>
              <td className="px-4 py-3"><Badge className="bg-indigo-50 text-indigo-700">{Math.round(campaign.revenue / Math.max(1, campaign.spend))}x</Badge></td>
              <td className="px-4 py-3">{campaign.conversions}</td>
            </tr>
          ))}
        </DataTable>
      </section>
    </div>
  );
};

export const CrmAdminPage: React.FC = () => {
  const { roles, crmCustomFields, crmAuditLogs, crmIntegrations } = useTenantData();
  const [integrationStatus, setIntegrationStatus] = useState<(typeof integrationStatuses)[number]>('All');
  const filteredIntegrations = crmIntegrations.filter((integration) => integrationStatus === 'All' || integration.status === integrationStatus);

  return (
    <div>
      <PageHeader title="Enterprise Admin" description="Roles, permissions, custom fields, layouts, audit logs, API, webhooks, and integration placeholders." action={<Button variant="outline"><KeyRound className="h-4 w-4" />Admin preview</Button>} />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Roles" value={String(roles.length)} hint="Permission matrix" icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Custom fields" value={String(crmCustomFields.length)} hint="Schema preview" />
        <StatCard label="Integrations" value={String(crmIntegrations.length)} hint="No live sync" icon={<PlugZap className="h-4 w-4" />} />
        <StatCard label="Audit events" value={String(crmAuditLogs.length)} hint="Security history" />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="Roles and permissions">
          <DataTable headers={['Role', 'Leads', 'Accounts', 'Automation', 'Approvals', 'Admin']}>
            {roles.map((role) => (
              <tr key={role}>
                <td className="px-4 py-3 font-medium text-slate-950">{role}</td>
                {['Leads', 'Accounts', 'Automation', 'Approvals', 'Admin'].map((module) => (
                  <td key={module} className="px-4 py-3"><Badge className={permissionTone(role, module)}>{permissionLabel(role, module)}</Badge></td>
                ))}
              </tr>
            ))}
          </DataTable>
        </Panel>

        <Panel title="Custom fields and layouts">
          <DataTable headers={['Field', 'Object', 'Type', 'Status', 'List', 'Scoring']}>
            {crmCustomFields.map((field) => (
              <tr key={field.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{field.label}</td>
                <td className="px-4 py-3">{field.objectType}</td>
                <td className="px-4 py-3">{field.fieldType}</td>
                <td className="px-4 py-3"><Badge>{field.status}</Badge></td>
                <td className="px-4 py-3">{field.visibleInList ? 'Visible' : 'Hidden'}</td>
                <td className="px-4 py-3">{field.usedInScoring ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <div>
          <FilterBar>
            <Select label="Integration status" value={integrationStatus} options={integrationStatuses} onChange={(value) => setIntegrationStatus(value as typeof integrationStatus)} />
          </FilterBar>
          <DataTable headers={['Integration', 'Category', 'Status', 'Auth', 'Direction', 'Scopes']}>
            {filteredIntegrations.map((integration) => (
              <tr key={integration.id}>
                <td className="px-4 py-3"><p className="font-medium text-slate-950">{integration.name}</p><p className="text-xs text-slate-500">{integration.description}</p></td>
                <td className="px-4 py-3">{integration.category}</td>
                <td className="px-4 py-3"><Badge className={integrationTone(integration.status)}>{integration.status}</Badge></td>
                <td className="px-4 py-3">{integration.authMode}</td>
                <td className="px-4 py-3">{integration.direction}</td>
                <td className="px-4 py-3 text-slate-600">{integration.scopes.join(', ')}</td>
              </tr>
            ))}
          </DataTable>
        </div>

        <Panel title="Audit log">
          <div className="space-y-3">
            {crmAuditLogs.map((event) => (
              <div key={event.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-950">{event.action}</p>
                    <p className="mt-1 text-xs text-slate-500">{event.actor} · {event.objectType}: {event.objectName}</p>
                  </div>
                  <Badge className={event.severity === 'Critical' ? 'bg-red-50 text-red-700' : event.severity === 'Warning' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}>{event.severity}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">{event.occurredAt} · {event.ipAddress}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
};

export const CrmAiAssistantPage: React.FC = () => {
  const { crmAiInsights, leads, crmCommunications } = useTenantData();
  const [type, setType] = useState<(typeof insightTypes)[number]>('All');
  const filtered = crmAiInsights.filter((insight) => type === 'All' || insight.type === type);

  return (
    <div>
      <PageHeader title="AI Assistant Preview" description="Lead scoring explanation, email draft, meeting summary, and sentiment analysis previews. No AI service is called." action={<Button variant="outline"><Bot className="h-4 w-4" />Generate preview</Button>} />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Insights" value={String(crmAiInsights.length)} hint="Static AI cards" icon={<BrainCircuit className="h-4 w-4" />} />
        <StatCard label="Avg confidence" value={`${Math.round(sumBy(crmAiInsights, (item) => item.confidence) / Math.max(1, crmAiInsights.length))}%`} hint="Preview confidence" />
        <StatCard label="Hot leads" value={String(leads.filter((lead) => getLeadScore(lead) >= 78).length)} hint="Scoring input" />
        <StatCard label="Messages" value={String(crmCommunications.length)} hint="Communication context" />
      </section>

      <FilterBar>
        <Select label="Insight type" value={type} options={insightTypes} onChange={(value) => setType(value as typeof type)} />
      </FilterBar>

      <section className="grid gap-5 xl:grid-cols-2">
        {filtered.map((insight) => (
          <article key={insight.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge className="bg-indigo-50 text-indigo-700">{insight.type}</Badge>
                <h2 className="mt-3 text-lg font-semibold text-slate-950">{insight.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{insight.recordName} · {insight.owner}</p>
              </div>
              <Badge className={insight.status === 'Ready' ? 'bg-emerald-50 text-emerald-700' : insight.status === 'Draft' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}>{insight.status}</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[120px_1fr]">
              <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Confidence</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{insight.confidence}%</p>
              </div>
              <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Summary</p>
                <p className="mt-2 text-sm text-slate-700">{insight.summary}</p>
              </div>
            </div>
            <div className="mt-3 rounded-md border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-900">
              <Sparkles className="mr-2 inline h-4 w-4" />{insight.recommendation}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

const FilterBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid gap-3 md:grid-cols-[220px_1fr]">{children}</div>
  </section>
);

const Select: React.FC<{ label: string; value: string; options: readonly string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
    {children}
  </section>
);

const BuilderColumn: React.FC<{ title: string; items: string[]; tone: 'indigo' | 'amber' | 'emerald' }> = ({ title, items, tone }) => {
  const toneClass = tone === 'indigo' ? 'border-indigo-100 bg-indigo-50' : tone === 'amber' ? 'border-amber-100 bg-amber-50' : 'border-emerald-100 bg-emerald-50';
  return (
    <div className={`rounded-md border p-4 ${toneClass}`}>
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => <div key={item} className="rounded-md bg-white px-3 py-2 text-sm text-slate-700">{item}</div>)}
      </div>
    </div>
  );
};

const Signal: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
  </div>
);

const PolicyCard: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <p className="font-semibold text-slate-950">{title}</p>
    <p className="mt-2 text-sm text-slate-500">{body}</p>
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

const approvalTone = (status: string) => {
  if (status === 'Approved') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Rejected') return 'bg-red-50 text-red-700';
  if (status === 'Escalated') return 'bg-amber-50 text-amber-700';
  return 'bg-blue-50 text-blue-700';
};

const permissionLabel = (role: string, module: string) => {
  if (role === 'Owner' || role === 'Admin') return 'Full';
  if (module === 'Admin') return 'No';
  if (module === 'Automation' || module === 'Approvals') return role.includes('Manager') ? 'Approve' : 'View';
  return role.includes('Sales') ? 'Edit' : 'View';
};

const permissionTone = (role: string, module: string) => {
  const label = permissionLabel(role, module);
  if (label === 'Full' || label === 'Edit' || label === 'Approve') return 'bg-emerald-50 text-emerald-700';
  if (label === 'No') return 'bg-red-50 text-red-700';
  return 'bg-slate-100 text-slate-700';
};

const integrationTone = (status: string) => {
  if (status === 'Connected') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Needs Auth') return 'bg-amber-50 text-amber-700';
  if (status === 'Disabled') return 'bg-slate-100 text-slate-700';
  return 'bg-indigo-50 text-indigo-700';
};
