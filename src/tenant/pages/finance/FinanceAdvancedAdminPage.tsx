import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

type AdminView =
  | 'Custom Reports'
  | 'Templates'
  | 'Numbering'
  | 'Permissions'
  | 'Security'
  | 'Integrations'
  | 'Global Settings'
  | 'AI Copilot';

const views: AdminView[] = [
  'Custom Reports',
  'Templates',
  'Numbering',
  'Permissions',
  'Security',
  'Integrations',
  'Global Settings',
  'AI Copilot',
];

const FinanceAdvancedAdminPage: React.FC = () => {
  const finance = useFinanceData();
  const [view, setView] = useState<AdminView>('Custom Reports');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const scheduledReports = finance.advancedReports.filter((report) => report.status === 'Scheduled').length;
  const activeTemplates = finance.documentTemplates.filter((template) => template.status === 'Active').length;
  const connectedIntegrations = finance.integrationConnectors.filter((connector) => connector.status === 'Connected').length;
  const securityWarnings = finance.securityControls.filter((control) => control.status !== 'Enabled').length;
  const policyCoverage = finance.permissionPolicies.reduce((sum, policy) => sum + policy.approvalLimit, 0);
  const copilotReady = finance.copilotInsights.filter((insight) => insight.status === 'Ready').length;

  const advancedReports = useMemo(() => finance.advancedReports.filter((report) =>
    matchesQuery([report.name, report.category, report.sourceModules.join(' '), report.owner, report.frequency, report.exportFormat, report.status], query)
  ), [finance.advancedReports, query]);

  const documentTemplates = useMemo(() => finance.documentTemplates.filter((template) =>
    matchesQuery([template.name, template.documentType, template.layout, template.defaultTerms, template.status], query)
  ), [finance.documentTemplates, query]);

  const numberingSeries = useMemo(() => finance.numberingSeries.filter((series) =>
    matchesQuery([series.seriesName, series.documentType, series.prefix, series.nextNumber, series.resetCycle, series.branch, series.status], query)
  ), [finance.numberingSeries, query]);

  const permissionPolicies = useMemo(() => finance.permissionPolicies.filter((policy) =>
    matchesQuery([policy.role, policy.scope, policy.accessLevel, policy.sensitiveActions.join(' '), policy.status], query)
  ), [finance.permissionPolicies, query]);

  const securityControls = useMemo(() => finance.securityControls.filter((control) =>
    matchesQuery([control.control, control.category, control.coverage, control.owner, control.status], query)
  ), [finance.securityControls, query]);

  const integrationConnectors = useMemo(() => finance.integrationConnectors.filter((connector) =>
    matchesQuery([connector.name, connector.category, connector.connectedModule, connector.mode, connector.nextAction, connector.status], query)
  ), [finance.integrationConnectors, query]);

  const globalSettings = useMemo(() => finance.globalSettings.filter((setting) =>
    matchesQuery([setting.name, setting.category, setting.value, setting.scope, setting.owner, setting.status], query)
  ), [finance.globalSettings, query]);

  const copilotInsights = useMemo(() => finance.copilotInsights.filter((insight) =>
    matchesQuery([insight.title, insight.area, insight.impact, insight.recommendation, insight.status], query)
  ), [finance.copilotInsights, query]);

  return (
    <div>
      <PageHeader
        title="Advanced Finance Admin"
        description="Static advanced reporting, template, numbering, permission, security, integration, mobile/global, and AI/copilot previews."
        action={<Button variant="outline">Save admin snapshot</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Scheduled reports" value={String(scheduledReports)} hint="Report automation" />
        <StatCard label="Active templates" value={String(activeTemplates)} hint="Documents" />
        <StatCard label="Connected modules" value={String(connectedIntegrations)} hint="Static connectors" />
        <StatCard label="Security warnings" value={String(securityWarnings)} hint="Needs admin review" />
        <StatCard label="Approval coverage" value={formatINR(policyCoverage)} hint="Role limits" />
        <StatCard label="AI insights ready" value={String(copilotReady)} hint="Copilot queue" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search reports, templates, roles, connectors, settings..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Custom Reports' && (
        <DataTable headers={['Report', 'Category', 'Sources', 'Owner', 'Frequency', 'Last run', 'Export', 'Status']}>
          {advancedReports.map((report) => (
            <tr key={report.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{report.name}</td>
              <td className="px-4 py-3 text-slate-600">{report.category}</td>
              <td className="px-4 py-3"><BadgeList values={report.sourceModules} /></td>
              <td className="px-4 py-3 text-slate-600">{report.owner}</td>
              <td className="px-4 py-3 text-slate-600">{report.frequency}</td>
              <td className="px-4 py-3 text-slate-600">{report.lastRun}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{report.exportFormat}</td>
              <td className="px-4 py-3"><StatusPill value={report.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Templates' && (
        <DataTable headers={['Template', 'Document', 'Layout', 'Default terms', 'Updated', 'Status']}>
          {documentTemplates.map((template) => (
            <tr key={template.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{template.name}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{template.documentType}</td>
              <td className="px-4 py-3 text-slate-600">{template.layout}</td>
              <td className="px-4 py-3 text-slate-600">{template.defaultTerms}</td>
              <td className="px-4 py-3 text-slate-600">{template.lastUpdated}</td>
              <td className="px-4 py-3"><StatusPill value={template.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Numbering' && (
        <DataTable headers={['Series', 'Document', 'Prefix', 'Next number', 'Reset cycle', 'Branch', 'Status']}>
          {numberingSeries.map((series) => (
            <tr key={series.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{series.seriesName}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{series.documentType}</td>
              <td className="px-4 py-3 text-slate-600">{series.prefix}</td>
              <td className="px-4 py-3 text-slate-600">{series.nextNumber}</td>
              <td className="px-4 py-3 text-slate-600">{series.resetCycle}</td>
              <td className="px-4 py-3 text-slate-600">{series.branch}</td>
              <td className="px-4 py-3"><StatusPill value={series.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Permissions' && (
        <DataTable headers={['Role', 'Scope', 'Access', 'Approval limit', 'Sensitive actions', 'Status']}>
          {permissionPolicies.map((policy) => (
            <tr key={policy.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{policy.role}</td>
              <td className="px-4 py-3 text-slate-600">{policy.scope}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{policy.accessLevel}</td>
              <td className="px-4 py-3"><AmountDisplay value={policy.approvalLimit} /></td>
              <td className="px-4 py-3"><BadgeList values={policy.sensitiveActions} /></td>
              <td className="px-4 py-3"><StatusPill value={policy.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Security' && (
        <DataTable headers={['Control', 'Category', 'Coverage', 'Last review', 'Owner', 'Status']}>
          {securityControls.map((control) => (
            <tr key={control.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{control.control}</td>
              <td className="px-4 py-3 text-slate-600">{control.category}</td>
              <td className="px-4 py-3 text-slate-600">{control.coverage}</td>
              <td className="px-4 py-3 text-slate-600">{control.lastReview}</td>
              <td className="px-4 py-3 text-slate-600">{control.owner}</td>
              <td className="px-4 py-3"><StatusPill value={control.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Integrations' && (
        <DataTable headers={['Connector', 'Category', 'Module', 'Mode', 'Last sync', 'Next action', 'Status']}>
          {integrationConnectors.map((connector) => (
            <tr key={connector.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{connector.name}</td>
              <td className="px-4 py-3 text-slate-600">{connector.category}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{connector.connectedModule}</td>
              <td className="px-4 py-3 text-slate-600">{connector.mode}</td>
              <td className="px-4 py-3 text-slate-600">{connector.lastSync}</td>
              <td className="px-4 py-3 text-slate-600">{connector.nextAction}</td>
              <td className="px-4 py-3"><StatusPill value={connector.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Global Settings' && (
        <DataTable headers={['Setting', 'Category', 'Value', 'Scope', 'Owner', 'Status']}>
          {globalSettings.map((setting) => (
            <tr key={setting.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{setting.name}</td>
              <td className="px-4 py-3 text-slate-600">{setting.category}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{setting.value}</td>
              <td className="px-4 py-3 text-slate-600">{setting.scope}</td>
              <td className="px-4 py-3 text-slate-600">{setting.owner}</td>
              <td className="px-4 py-3"><StatusPill value={setting.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'AI Copilot' && (
        <DataTable headers={['Insight', 'Area', 'Impact', 'Recommendation', 'Confidence', 'Status']}>
          {copilotInsights.map((insight) => (
            <tr key={insight.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{insight.title}</td>
              <td className="px-4 py-3 text-slate-600">{insight.area}</td>
              <td className="px-4 py-3 text-slate-600">{insight.impact}</td>
              <td className="px-4 py-3 text-slate-600">{insight.recommendation}</td>
              <td className="px-4 py-3"><Confidence value={insight.confidence} /></td>
              <td className="px-4 py-3"><StatusPill value={insight.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const matchesQuery = (values: Array<string | number>, query: string) =>
  !query || values.join(' ').toLowerCase().includes(query);

const BadgeList: React.FC<{ values: string[] }> = ({ values }) => (
  <div className="flex max-w-[360px] flex-wrap gap-1">
    {values.map((value) => (
      <Badge key={value} variant="secondary" className="border border-slate-200 bg-slate-50 text-slate-700">{value}</Badge>
    ))}
  </div>
);

const Confidence: React.FC<{ value: number }> = ({ value }) => {
  const tone = value >= 85 ? 'bg-emerald-600' : value >= 75 ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div className="min-w-[120px]">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{value}%</span>
        <span>confidence</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const tone = ['Ready', 'Active', 'Enabled', 'Connected'].includes(value)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : ['Scheduled', 'Draft', 'Needs Review', 'Review', 'Warning', 'Sandbox', 'Learning'].includes(value)
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : ['Archived', 'Paused', 'Disabled', 'Not Connected', 'Restricted'].includes(value)
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return <Badge className={`border ${tone}`}>{value}</Badge>;
};

export default FinanceAdvancedAdminPage;
