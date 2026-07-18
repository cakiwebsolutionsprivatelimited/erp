import React from 'react';
import { Bell, GitBranch, ListChecks, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { assignmentRules, duplicateRules, leadStages, scoringRules } from '@/tenant/crm/crmDemoUtils';

const customFields = [
  ['Existing system', 'Lead', 'Text', 'Visible on form and detail'],
  ['Decision role', 'Lead/Contact', 'Select', 'Used in qualification'],
  ['Budget band', 'Lead', 'Select', 'Used in scoring preview'],
  ['Customer health score', 'Customer', 'Number', 'Used in Customer 360'],
];

const notificationTemplates = [
  ['High value lead alert', 'When expected value crosses Rs 1,50,000', 'Sales Manager'],
  ['Overdue follow-up reminder', 'Daily at 09:00', 'Lead owner'],
  ['Quotation sent follow-up', '2 days after quote handoff', 'Sales owner'],
  ['Duplicate risk review', 'When duplicate risk is High', 'CRM Admin'],
];

const CrmSettingsPage: React.FC = () => {
  const { leads, users, roles } = useTenantData();
  const sources = Array.from(new Set(leads.map((lead) => lead.source)));
  const campaigns = Array.from(new Set(leads.map((lead) => lead.campaign || lead.source)));

  return (
    <div>
      <PageHeader title="CRM Settings" description="Static enterprise CRM configuration for stages, sources, routing, scoring, duplicates, fields, and notifications." />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Stages" value={String(leadStages.length)} hint="Lead workflow" icon={<GitBranch className="h-4 w-4" />} />
        <StatCard label="Sources" value={String(sources.length)} hint="Lead capture channels" icon={<ListChecks className="h-4 w-4" />} />
        <StatCard label="Rules" value={String(assignmentRules.length + scoringRules.length)} hint="Routing and scoring" icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="Templates" value={String(notificationTemplates.length)} hint="Notification previews" icon={<Bell className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Lead workflow stages">
          <div className="flex flex-wrap gap-2">
            {leadStages.map((stage, index) => <Badge key={stage} variant="secondary">{index + 1}. {stage}</Badge>)}
          </div>
        </Panel>
        <Panel title="Lead sources and campaigns">
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Sources</p>
              <div className="flex flex-wrap gap-2">{sources.map((source) => <Badge key={source} className="bg-indigo-50 text-indigo-700">{source}</Badge>)}</div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Campaigns</p>
              <div className="flex flex-wrap gap-2">{campaigns.slice(0, 8).map((campaign) => <Badge key={campaign} variant="outline">{campaign}</Badge>)}</div>
            </div>
          </div>
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <DataTable headers={['Assignment rule', 'Condition', 'Action']}>
          {assignmentRules.map(([name, condition, action]) => (
            <tr key={name}>
              <td className="px-4 py-3 font-medium text-slate-950">{name}</td>
              <td className="px-4 py-3 text-slate-600">{condition}</td>
              <td className="px-4 py-3 text-slate-600">{action}</td>
            </tr>
          ))}
        </DataTable>

        <DataTable headers={['Scoring rule', 'Score', 'Reason']}>
          {scoringRules.map(([name, score, reason]) => (
            <tr key={name}>
              <td className="px-4 py-3 font-medium text-slate-950">{name}</td>
              <td className="px-4 py-3"><Badge className="bg-emerald-50 text-emerald-700">{score}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{reason}</td>
            </tr>
          ))}
        </DataTable>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <DataTable headers={['Duplicate rule', 'Risk', 'Handling']}>
          {duplicateRules.map(([name, risk, handling]) => (
            <tr key={name}>
              <td className="px-4 py-3 font-medium text-slate-950">{name}</td>
              <td className="px-4 py-3"><Badge>{risk}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{handling}</td>
            </tr>
          ))}
        </DataTable>

        <DataTable headers={['Custom field', 'Object', 'Type', 'Use']}>
          {customFields.map(([name, object, type, use]) => (
            <tr key={name}>
              <td className="px-4 py-3 font-medium text-slate-950">{name}</td>
              <td className="px-4 py-3 text-slate-600">{object}</td>
              <td className="px-4 py-3 text-slate-600">{type}</td>
              <td className="px-4 py-3 text-slate-600">{use}</td>
            </tr>
          ))}
        </DataTable>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <DataTable headers={['Template', 'Trigger', 'Audience']}>
          {notificationTemplates.map(([template, trigger, audience]) => (
            <tr key={template}>
              <td className="px-4 py-3 font-medium text-slate-950">{template}</td>
              <td className="px-4 py-3 text-slate-600">{trigger}</td>
              <td className="px-4 py-3 text-slate-600">{audience}</td>
            </tr>
          ))}
        </DataTable>

        <Panel title="Roles and integration placeholders">
          <div className="grid gap-3 md:grid-cols-2">
            <MiniPanel icon={<ShieldCheck className="h-4 w-4" />} label="CRM roles" value={`${roles.filter((role) => role.includes('Sales') || role === 'Admin' || role === 'Owner').length} configured`} />
            <MiniPanel icon={<SlidersHorizontal className="h-4 w-4" />} label="API/webhooks" value="Preview only" />
            <MiniPanel icon={<Bell className="h-4 w-4" />} label="Email/SMS/WhatsApp" value="Delivery disabled" />
            <MiniPanel icon={<Sparkles className="h-4 w-4" />} label="AI scoring" value="UI placeholder" />
          </div>
          <div className="mt-4 rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
            These controls describe future CRM backend behavior. Phase 1 keeps everything static and local.
          </div>
        </Panel>
      </section>

      <section className="mt-5">
        <DataTable headers={['Sales owner', 'Role', 'Status', 'Routing context']}>
          {users.filter((user) => user.role.toLowerCase().includes('sales') || user.role === 'Owner' || user.role === 'Admin').map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{user.name}</td>
              <td className="px-4 py-3 text-slate-600">{user.role}</td>
              <td className="px-4 py-3"><Badge className={user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}>{user.status}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{user.role === 'Sales Manager' ? 'High-value and approvals' : user.role === 'Sales Executive' ? 'Round-robin lead owner' : 'Admin visibility'}</td>
            </tr>
          ))}
        </DataTable>
      </section>
    </div>
  );
};

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
    {children}
  </div>
);

const MiniPanel: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
    <div className="flex items-center gap-2 text-indigo-700">{icon}<span className="text-xs font-semibold uppercase tracking-wide">{label}</span></div>
    <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
  </div>
);

export default CrmSettingsPage;
