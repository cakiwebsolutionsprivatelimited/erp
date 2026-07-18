import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

type InsightsView = 'Advanced Reports' | 'Integrations' | 'Automation' | 'Templates & Tags' | 'Portals & Web Tabs' | 'Webhooks & Audit';

const views: InsightsView[] = ['Advanced Reports', 'Integrations', 'Automation', 'Templates & Tags', 'Portals & Web Tabs', 'Webhooks & Audit'];

const InventoryInsightsPage: React.FC = () => {
  const inventory = useInventoryData();
  const [view, setView] = useState<InsightsView>('Advanced Reports');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();
  const stockValue = inventory.products.reduce((sum, product) => sum + product.currentStock * product.purchasePrice, 0);
  const payables = inventory.vendorBills.filter((bill) => bill.status !== 'Paid' && bill.status !== 'Cancelled').reduce((sum, bill) => sum + bill.total, 0);
  const receivables = inventory.fulfillmentOrders.filter((order) => order.paymentStatus !== 'Paid').reduce((sum, order) => sum + order.amount, 0);
  const criticalEvents = inventory.auditEvents.filter((event) => event.severity === 'Critical');

  const reports = useMemo(() => inventory.advancedReports.filter((report) =>
    !query || [report.name, report.category, report.metric, report.owner, report.description, report.status].join(' ').toLowerCase().includes(query)
  ), [inventory.advancedReports, query]);

  const integrations = useMemo(() => inventory.integrations.filter((integration) =>
    !query || [integration.name, integration.category, integration.mode, integration.direction, integration.owner, integration.status, integration.description].join(' ').toLowerCase().includes(query)
  ), [inventory.integrations, query]);

  const automations = useMemo(() => inventory.automationRules.filter((rule) =>
    !query || [rule.name, rule.trigger, rule.conditions.join(' '), rule.actions.join(' '), rule.status].join(' ').toLowerCase().includes(query)
  ), [inventory.automationRules, query]);

  const templates = useMemo(() => inventory.documentTemplates.filter((template) =>
    !query || [template.name, template.type, template.locale, template.status].join(' ').toLowerCase().includes(query)
  ), [inventory.documentTemplates, query]);

  const tags = useMemo(() => inventory.reportingTags.filter((tag) =>
    !query || [tag.name, tag.appliesTo.join(' '), tag.color].join(' ').toLowerCase().includes(query)
  ), [inventory.reportingTags, query]);

  const portals = useMemo(() => inventory.portalPreviews.filter((portal) =>
    !query || [portal.name, portal.audience, portal.enabledModules.join(' '), portal.status].join(' ').toLowerCase().includes(query)
  ), [inventory.portalPreviews, query]);

  const webTabs = useMemo(() => inventory.webTabs.filter((tab) =>
    !query || [tab.name, tab.url, tab.owner, tab.status].join(' ').toLowerCase().includes(query)
  ), [inventory.webTabs, query]);

  const webhooks = useMemo(() => inventory.webhooks.filter((webhook) =>
    !query || [webhook.name, webhook.event, webhook.target, webhook.status].join(' ').toLowerCase().includes(query)
  ), [inventory.webhooks, query]);

  const auditEvents = useMemo(() => inventory.auditEvents.filter((event) =>
    !query || [event.actor, event.action, event.objectType, event.objectName, event.severity, event.ipAddress].join(' ').toLowerCase().includes(query)
  ), [inventory.auditEvents, query]);

  return (
    <div>
      <PageHeader
        title="Insights & Admin"
        description="Advanced analytics, integrations, automation, templates, tags, portals, custom functions, webhooks, and audit previews."
        action={<Button variant="outline">Create report preview</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4 xl:grid-cols-6">
        <StatCard label="Stock value" value={formatINR(stockValue)} hint="Purchase valuation" />
        <StatCard label="Payables" value={formatINR(payables)} hint="Open vendor bills" />
        <StatCard label="Receivables" value={formatINR(receivables)} hint="Inventory-linked orders" />
        <StatCard label="Integrations" value={String(inventory.integrations.length)} hint="Preview connectors" />
        <StatCard label="Automations" value={String(inventory.automationRules.length)} hint="Rules only" />
        <StatCard label="Critical events" value={String(criticalEvents.length)} hint="Audit alerts" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search reports, integrations, automation, templates, portals, audit..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Advanced Reports' && (
        <DataTable headers={['Report', 'Category', 'Metric', 'Owner', 'Last run', 'Status', 'Description']}>
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{report.name}</td>
              <td className="px-4 py-3"><StatusPill value={report.category} /></td>
              <td className="px-4 py-3 font-medium text-slate-950">{report.metric}</td>
              <td className="px-4 py-3 text-slate-600">{report.owner}</td>
              <td className="px-4 py-3 text-slate-600">{report.lastRunAt}</td>
              <td className="px-4 py-3"><StatusPill value={report.status} /></td>
              <td className="px-4 py-3 text-slate-600">{report.description}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Integrations' && (
        <DataTable headers={['Integration', 'Category', 'Mode', 'Direction', 'Last sync', 'Owner', 'Status', 'Description']}>
          {integrations.map((integration) => (
            <tr key={integration.id}>
              <td className="px-4 py-3 font-medium text-indigo-700">{integration.name}</td>
              <td className="px-4 py-3">{integration.category}</td>
              <td className="px-4 py-3 text-slate-600">{integration.mode}</td>
              <td className="px-4 py-3 text-slate-600">{integration.direction}</td>
              <td className="px-4 py-3 text-slate-600">{integration.lastSyncAt}</td>
              <td className="px-4 py-3 text-slate-600">{integration.owner}</td>
              <td className="px-4 py-3"><StatusPill value={integration.status} /></td>
              <td className="px-4 py-3 text-slate-600">{integration.description}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Automation' && (
        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <DataTable headers={['Rule', 'Trigger', 'Runs', 'Last run', 'Status']}>
            {automations.map((rule) => (
              <tr key={rule.id}>
                <td className="px-4 py-3"><p className="font-medium text-slate-950">{rule.name}</p><p className="text-xs text-slate-500">{rule.conditions.join(' · ')}</p></td>
                <td className="px-4 py-3 text-slate-600">{rule.trigger}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{rule.runs}</td>
                <td className="px-4 py-3 text-slate-600">{rule.lastRunAt}</td>
                <td className="px-4 py-3"><StatusPill value={rule.status} /></td>
              </tr>
            ))}
          </DataTable>
          <DataTable headers={['Function', 'Language', 'Trigger', 'Last test', 'Status']}>
            {inventory.customFunctions.filter((item) => !query || [item.name, item.language, item.trigger, item.status].join(' ').toLowerCase().includes(query)).map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
                <td className="px-4 py-3 text-slate-600">{item.language}</td>
                <td className="px-4 py-3 text-slate-600">{item.trigger}</td>
                <td className="px-4 py-3 text-slate-600">{item.lastTestAt}</td>
                <td className="px-4 py-3"><StatusPill value={item.status} /></td>
              </tr>
            ))}
          </DataTable>
        </section>
      )}

      {view === 'Templates & Tags' && (
        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <DataTable headers={['Template', 'Type', 'Locale', 'Updated', 'Status']}>
            {templates.map((template) => (
              <tr key={template.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{template.name}</td>
                <td className="px-4 py-3 text-slate-600">{template.type}</td>
                <td className="px-4 py-3 text-slate-600">{template.locale}</td>
                <td className="px-4 py-3 text-slate-600">{template.lastUpdated}</td>
                <td className="px-4 py-3"><StatusPill value={template.status} /></td>
              </tr>
            ))}
          </DataTable>
          <DataTable headers={['Tag', 'Applies to', 'Color', 'Records']}>
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{tag.name}</td>
                <td className="px-4 py-3 text-slate-600">{tag.appliesTo.join(', ')}</td>
                <td className="px-4 py-3"><StatusPill value={tag.color} /></td>
                <td className="px-4 py-3 font-medium text-slate-950">{tag.records}</td>
              </tr>
            ))}
          </DataTable>
        </section>
      )}

      {view === 'Portals & Web Tabs' && (
        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <DataTable headers={['Portal', 'Audience', 'Modules', 'Records', 'Last activity', 'Status']}>
            {portals.map((portal) => (
              <tr key={portal.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{portal.name}</td>
                <td className="px-4 py-3 text-slate-600">{portal.audience}</td>
                <td className="px-4 py-3 text-slate-600">{portal.enabledModules.join(', ')}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{portal.records}</td>
                <td className="px-4 py-3 text-slate-600">{portal.lastActivityAt}</td>
                <td className="px-4 py-3"><StatusPill value={portal.status} /></td>
              </tr>
            ))}
          </DataTable>
          <DataTable headers={['Web tab', 'URL', 'Owner', 'Status']}>
            {webTabs.map((tab) => (
              <tr key={tab.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{tab.name}</td>
                <td className="px-4 py-3 text-slate-600">{tab.url}</td>
                <td className="px-4 py-3 text-slate-600">{tab.owner}</td>
                <td className="px-4 py-3"><StatusPill value={tab.status} /></td>
              </tr>
            ))}
          </DataTable>
        </section>
      )}

      {view === 'Webhooks & Audit' && (
        <section className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
          <DataTable headers={['Webhook', 'Event', 'Target', 'Last delivery', 'Success', 'Status']}>
            {webhooks.map((webhook) => (
              <tr key={webhook.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{webhook.name}</td>
                <td className="px-4 py-3 text-slate-600">{webhook.event}</td>
                <td className="px-4 py-3 text-slate-600">{webhook.target}</td>
                <td className="px-4 py-3 text-slate-600">{webhook.lastDeliveryAt}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{webhook.successRate}%</td>
                <td className="px-4 py-3"><StatusPill value={webhook.status} /></td>
              </tr>
            ))}
          </DataTable>
          <DataTable headers={['When', 'Actor', 'Action', 'Object', 'Severity', 'IP']}>
            {auditEvents.map((event) => (
              <tr key={event.id}>
                <td className="px-4 py-3 text-slate-600">{event.occurredAt}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{event.actor}</td>
                <td className="px-4 py-3 text-slate-600">{event.action}</td>
                <td className="px-4 py-3 text-slate-600">{event.objectType}: {event.objectName}</td>
                <td className="px-4 py-3"><StatusPill value={event.severity} /></td>
                <td className="px-4 py-3 text-slate-600">{event.ipAddress}</td>
              </tr>
            ))}
          </DataTable>
        </section>
      )}
    </div>
  );
};

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const tone = ['Ready', 'Connected', 'Active', 'Enabled', 'Healthy', 'Info', 'Emerald', 'Paid'].includes(value)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : ['Needs Review', 'Needs Auth', 'Draft', 'Preview', 'Warning', 'Amber', 'Paused', 'Scheduled'].includes(value)
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : ['Critical', 'Failing', 'Disabled', 'Archived', 'Rose'].includes(value)
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';
  return <Badge className={`border ${tone}`}>{value}</Badge>;
};

export default InventoryInsightsPage;
