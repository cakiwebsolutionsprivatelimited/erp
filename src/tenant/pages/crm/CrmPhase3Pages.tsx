import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, BookOpen, FileText, Mail, Megaphone, MessageCircle, Phone, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { countBy, sumBy } from '@/tenant/crm/crmDemoUtils';
import type { CrmCommunicationChannel } from '@/tenant/types';

const communicationChannels = ['All', 'Email', 'WhatsApp', 'SMS', 'Call', 'Meeting'] as const;
const campaignStatuses = ['All', 'Draft', 'Scheduled', 'Running', 'Paused', 'Completed'] as const;
const ticketStatuses = ['All', 'New', 'Open', 'Waiting on Customer', 'Escalated', 'Resolved'] as const;
const documentTypes = ['All', 'Proposal', 'Contract', 'KYC', 'Note', 'Checklist', 'Attachment'] as const;
const segmentObjects = ['All', 'Lead', 'Company', 'Contact', 'Customer'] as const;

export const CrmCommunicationsPage: React.FC = () => {
  const { crmCommunications, crmCompanies, crmContacts, leads } = useTenantData();
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState<(typeof communicationChannels)[number]>('All');
  const [status, setStatus] = useState('All');
  const statuses = useMemo(() => ['All', ...Array.from(new Set(crmCommunications.map((item) => item.status)))], [crmCommunications]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return crmCommunications.filter((item) => {
      const company = crmCompanies.find((record) => record.id === item.relatedCompanyId);
      const contact = crmContacts.find((record) => record.id === item.relatedContactId);
      const lead = leads.find((record) => record.id === item.relatedLeadId);
      const searchMatch = !query || [item.subject, item.preview, item.owner, company?.displayName, contact?.name, lead?.name, item.templateName].join(' ').toLowerCase().includes(query);
      const channelMatch = channel === 'All' || item.channel === channel;
      const statusMatch = status === 'All' || item.status === status;
      return searchMatch && channelMatch && statusMatch;
    });
  }, [channel, crmCommunications, crmCompanies, crmContacts, leads, search, status]);

  return (
    <div>
      <PageHeader
        title="Communications"
        description="Unified email, WhatsApp, SMS, call, and meeting timeline. Delivery actions are static previews only."
        action={<Button variant="outline"><Mail className="h-4 w-4" />Compose preview</Button>}
      />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Messages" value={String(crmCommunications.length)} hint="All communication records" icon={<MessageCircle className="h-4 w-4" />} />
        <StatCard label="Outbound" value={String(crmCommunications.filter((item) => item.direction === 'Outbound').length)} hint="Sent/queued previews" />
        <StatCard label="Consent missing" value={String(crmCommunications.filter((item) => item.consentStatus === 'Missing').length)} hint="Needs review" />
        <StatCard label="Failed" value={String(crmCommunications.filter((item) => item.status === 'Failed').length)} hint="Demo failure state" />
      </section>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search subject, contact, company, owner..." />
        <Select label="Channel" value={channel} options={communicationChannels} onChange={(value) => setChannel(value as typeof channel)} />
        <Select label="Status" value={status} options={statuses} onChange={setStatus} />
      </FilterBar>

      <DataTable headers={['Message', 'Related record', 'Channel', 'Direction', 'Status', 'Consent', 'Owner', 'Sent/logged']}>
        {filtered.map((item) => {
          const company = crmCompanies.find((record) => record.id === item.relatedCompanyId);
          const contact = crmContacts.find((record) => record.id === item.relatedContactId);
          const lead = leads.find((record) => record.id === item.relatedLeadId);
          return (
            <tr key={item.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{item.subject}</p>
                <p className="text-xs text-slate-500">{item.preview}</p>
                {item.templateName && <Badge className="mt-2 bg-indigo-50 text-indigo-700">{item.templateName}</Badge>}
              </td>
              <td className="px-4 py-3">
                {company ? <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/companies/${company.id}`}>{company.displayName}</Link> : lead ? <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link> : 'Unlinked'}
                <p className="text-xs text-slate-500">{contact?.name || 'No contact'}</p>
              </td>
              <td className="px-4 py-3"><ChannelBadge channel={item.channel} /></td>
              <td className="px-4 py-3 text-slate-600">{item.direction}</td>
              <td className="px-4 py-3"><Badge className={statusTone(item.status)}>{item.status}</Badge></td>
              <td className="px-4 py-3"><Badge className={item.consentStatus === 'Missing' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}>{item.consentStatus}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{item.owner}</td>
              <td className="px-4 py-3 text-slate-600">{new Date(item.sentAt).toLocaleString('en-IN')}</td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
};

export const CrmCampaignsPage: React.FC = () => {
  const { crmCampaigns, crmSegments } = useTenantData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<(typeof campaignStatuses)[number]>('All');
  const [channel, setChannel] = useState('All');
  const channels = useMemo(() => ['All', ...Array.from(new Set(crmCampaigns.map((item) => item.channel)))], [crmCampaigns]);
  const filtered = crmCampaigns.filter((campaign) => {
    const query = search.toLowerCase().trim();
    const segment = crmSegments.find((item) => item.id === campaign.segmentId);
    return (!query || [campaign.name, campaign.owner, campaign.channel, segment?.name].join(' ').toLowerCase().includes(query)) &&
      (status === 'All' || campaign.status === status) &&
      (channel === 'All' || campaign.channel === channel);
  });
  const spend = sumBy(crmCampaigns, (item) => item.spend);
  const revenue = sumBy(crmCampaigns, (item) => item.revenue);

  return (
    <div>
      <PageHeader title="Campaigns" description="Marketing campaign workspace for lists, landing pages, UTM tracking, ROI, and lead conversion previews." action={<Button variant="outline"><Megaphone className="h-4 w-4" />New campaign preview</Button>} />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Campaigns" value={String(crmCampaigns.length)} hint="Static campaigns" icon={<Megaphone className="h-4 w-4" />} />
        <StatCard label="Spend" value={formatINR(spend)} hint="Demo budget used" />
        <StatCard label="Revenue" value={formatINR(revenue)} hint="Attributed revenue" />
        <StatCard label="ROI" value={`${Math.round(revenue / Math.max(1, spend))}x`} hint="Revenue / spend" />
      </section>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search campaigns, owner, segment..." />
        <Select label="Status" value={status} options={campaignStatuses} onChange={(value) => setStatus(value as typeof status)} />
        <Select label="Channel" value={channel} options={channels} onChange={setChannel} />
      </FilterBar>

      <DataTable headers={['Campaign', 'Channel', 'Status', 'Segment', 'Spend', 'Leads', 'Conversions', 'ROI', 'UTM']}>
        {filtered.map((campaign) => {
          const segment = crmSegments.find((item) => item.id === campaign.segmentId);
          const roi = Math.round(campaign.revenue / Math.max(1, campaign.spend));
          return (
            <tr key={campaign.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{campaign.name}</p>
                <p className="text-xs text-slate-500">{campaign.startDate} to {campaign.endDate} · {campaign.owner}</p>
              </td>
              <td className="px-4 py-3">{campaign.channel}</td>
              <td className="px-4 py-3"><Badge className={campaign.status === 'Running' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}>{campaign.status}</Badge></td>
              <td className="px-4 py-3">{segment?.name || 'No segment'}</td>
              <td className="px-4 py-3">{formatINR(campaign.spend)} / {formatINR(campaign.budget)}</td>
              <td className="px-4 py-3">{campaign.leads}</td>
              <td className="px-4 py-3">{campaign.conversions}</td>
              <td className="px-4 py-3"><Badge className="bg-indigo-50 text-indigo-700">{roi}x</Badge></td>
              <td className="px-4 py-3 text-slate-600">{campaign.utmSource} / {campaign.utmMedium}</td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
};

export const CrmSupportPage: React.FC = () => {
  const { crmSupportTickets, crmCompanies, crmContacts, customers } = useTenantData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<(typeof ticketStatuses)[number]>('All');
  const [sla, setSla] = useState('All');
  const slaOptions = useMemo(() => ['All', ...Array.from(new Set(crmSupportTickets.map((item) => item.slaStatus)))], [crmSupportTickets]);
  const filtered = crmSupportTickets.filter((ticket) => {
    const company = crmCompanies.find((item) => item.id === ticket.companyId);
    const contact = crmContacts.find((item) => item.id === ticket.contactId);
    const query = search.toLowerCase().trim();
    return (!query || [ticket.subject, ticket.assignee, ticket.category, company?.displayName, contact?.name].join(' ').toLowerCase().includes(query)) &&
      (status === 'All' || ticket.status === status) &&
      (sla === 'All' || ticket.slaStatus === sla);
  });

  return (
    <div>
      <PageHeader title="Support" description="Post-sales ticket, SLA, escalation, knowledge base, and customer portal previews." action={<Button variant="outline"><BookOpen className="h-4 w-4" />Knowledge base preview</Button>} />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Tickets" value={String(crmSupportTickets.length)} hint="Customer issues" />
        <StatCard label="Escalated" value={String(crmSupportTickets.filter((item) => item.status === 'Escalated').length)} hint="Manager attention" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="SLA breached" value={String(crmSupportTickets.filter((item) => item.slaStatus === 'Breached').length)} hint="Risk queue" />
        <StatCard label="Customers covered" value={String(customers.length)} hint="Portal placeholder" />
      </section>

      <section className="mb-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div>
          <FilterBar>
            <SearchBar value={search} onChange={setSearch} placeholder="Search tickets, account, contact, assignee..." />
            <Select label="Status" value={status} options={ticketStatuses} onChange={(value) => setStatus(value as typeof status)} />
            <Select label="SLA" value={sla} options={slaOptions} onChange={setSla} />
          </FilterBar>
          <DataTable headers={['Ticket', 'Account/contact', 'Priority', 'SLA', 'Assignee', 'Due', 'Status']}>
            {filtered.map((ticket) => {
              const company = crmCompanies.find((item) => item.id === ticket.companyId);
              const contact = crmContacts.find((item) => item.id === ticket.contactId);
              return (
                <tr key={ticket.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-950">{ticket.id}</p>
                    <p className="text-xs text-slate-500">{ticket.subject} · {ticket.category}</p>
                  </td>
                  <td className="px-4 py-3">
                    {company ? <Link className="text-indigo-700 hover:underline" to={`/crm/companies/${company.id}`}>{company.displayName}</Link> : 'No company'}
                    <p className="text-xs text-slate-500">{contact?.name || 'No contact'}</p>
                  </td>
                  <td className="px-4 py-3"><Badge className={ticket.priority === 'Urgent' || ticket.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'}>{ticket.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge className={slaTone(ticket.slaStatus)}>{ticket.slaStatus}</Badge></td>
                  <td className="px-4 py-3">{ticket.assignee}</td>
                  <td className="px-4 py-3">{ticket.dueAt}</td>
                  <td className="px-4 py-3">{ticket.status}</td>
                </tr>
              );
            })}
          </DataTable>
        </div>
        <Panel title="Knowledge base and portal">
          {['Getting started checklist', 'GST invoice copy request', 'Workflow configuration FAQ', 'Customer portal access preview'].map((item) => (
            <div key={item} className="mb-3 rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="font-medium text-slate-900">{item}</p>
              <p className="mt-1 text-xs text-slate-500">Static support content preview</p>
            </div>
          ))}
        </Panel>
      </section>
    </div>
  );
};

export const CrmDocumentsPage: React.FC = () => {
  const { crmDocuments, crmCompanies, leads } = useTenantData();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<(typeof documentTypes)[number]>('All');
  const filtered = crmDocuments.filter((doc) => {
    const company = crmCompanies.find((item) => item.id === doc.relatedCompanyId);
    const lead = leads.find((item) => item.id === doc.relatedLeadId);
    const query = search.toLowerCase().trim();
    return (!query || [doc.name, doc.owner, doc.status, company?.displayName, lead?.name].join(' ').toLowerCase().includes(query)) &&
      (type === 'All' || doc.type === type);
  });

  return (
    <div>
      <PageHeader title="Documents and Notes" description="CRM document, attachment, generated note, and checklist workspace. Storage is a UI placeholder." action={<Button variant="outline"><FileText className="h-4 w-4" />Upload preview</Button>} />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Documents" value={String(crmDocuments.length)} hint="All CRM files" icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Shared" value={String(crmDocuments.filter((doc) => doc.status === 'Shared').length)} hint="Visible to customer" />
        <StatCard label="Signed" value={String(crmDocuments.filter((doc) => doc.status === 'Signed').length)} hint="Contract placeholders" />
        <StatCard label="Generated" value={String(crmDocuments.filter((doc) => doc.source === 'Generated').length)} hint="System-created notes" />
      </section>
      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search documents, owner, account, lead..." />
        <Select label="Type" value={type} options={documentTypes} onChange={(value) => setType(value as typeof type)} />
      </FilterBar>
      <DataTable headers={['Document', 'Related record', 'Type', 'Status', 'Source', 'Owner', 'Updated']}>
        {filtered.map((doc) => {
          const company = crmCompanies.find((item) => item.id === doc.relatedCompanyId);
          const lead = leads.find((item) => item.id === doc.relatedLeadId);
          return (
            <tr key={doc.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{doc.name}</td>
              <td className="px-4 py-3">
                {company ? <Link className="text-indigo-700 hover:underline" to={`/crm/companies/${company.id}`}>{company.displayName}</Link> : lead ? <Link className="text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link> : doc.relatedType}
              </td>
              <td className="px-4 py-3">{doc.type}</td>
              <td className="px-4 py-3"><Badge>{doc.status}</Badge></td>
              <td className="px-4 py-3">{doc.source}</td>
              <td className="px-4 py-3">{doc.owner}</td>
              <td className="px-4 py-3">{doc.updatedAt}</td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
};

export const CrmSegmentsPage: React.FC = () => {
  const { crmSegments, crmCampaigns, leads, crmCompanies, crmContacts, customers } = useTenantData();
  const [search, setSearch] = useState('');
  const [objectType, setObjectType] = useState<(typeof segmentObjects)[number]>('All');
  const filtered = crmSegments.filter((segment) => {
    const query = search.toLowerCase().trim();
    return (!query || [segment.name, segment.description, segment.owner, segment.tags.join(' '), segment.criteria.join(' ')].join(' ').toLowerCase().includes(query)) &&
      (objectType === 'All' || segment.objectType === objectType);
  });
  const tagCounts = countBy([
    ...leads.flatMap((lead) => lead.tags || []),
    ...crmCompanies.flatMap((company) => company.tags),
    ...crmContacts.flatMap((contact) => contact.tags),
    ...customers.flatMap((customer) => [customer.lifecycleStage || 'Customer']),
  ]);

  return (
    <div>
      <PageHeader title="Tags and Segments" description="Static audience builder for lead, account, contact, and customer segmentation." action={<Button variant="outline"><Tags className="h-4 w-4" />New segment preview</Button>} />
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Segments" value={String(crmSegments.length)} hint="Saved audiences" icon={<Tags className="h-4 w-4" />} />
        <StatCard label="Tags" value={String(tagCounts.length)} hint="Across CRM records" />
        <StatCard label="Campaign-linked" value={String(crmCampaigns.filter((campaign) => campaign.segmentId).length)} hint="Uses segment" />
        <StatCard label="Total records" value={String(sumBy(crmSegments, (segment) => segment.recordCount))} hint="Segment memberships" />
      </section>

      <section className="mb-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div>
          <FilterBar>
            <SearchBar value={search} onChange={setSearch} placeholder="Search segments, tags, criteria..." />
            <Select label="Object" value={objectType} options={segmentObjects} onChange={(value) => setObjectType(value as typeof objectType)} />
          </FilterBar>
          <DataTable headers={['Segment', 'Object', 'Criteria', 'Records', 'Owner', 'Tags', 'Refreshed']}>
            {filtered.map((segment) => (
              <tr key={segment.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-950">{segment.name}</p>
                  <p className="text-xs text-slate-500">{segment.description}</p>
                </td>
                <td className="px-4 py-3">{segment.objectType}</td>
                <td className="px-4 py-3 text-slate-600">{segment.criteria.join('; ')}</td>
                <td className="px-4 py-3"><Badge className="bg-indigo-50 text-indigo-700">{segment.recordCount}</Badge></td>
                <td className="px-4 py-3">{segment.owner}</td>
                <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{segment.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div></td>
                <td className="px-4 py-3">{segment.lastRefreshedAt}</td>
              </tr>
            ))}
          </DataTable>
        </div>
        <Panel title="Tag manager">
          {tagCounts.slice(0, 12).map(([tag, count]) => (
            <div key={tag} className="mb-2 flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3">
              <span className="text-sm font-medium text-slate-800">{tag}</span>
              <Badge variant="secondary">{count}</Badge>
            </div>
          ))}
        </Panel>
      </section>
    </div>
  );
};

const FilterBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid gap-3 xl:grid-cols-[1fr_repeat(2,180px)]">{children}</div>
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

const ChannelBadge: React.FC<{ channel: CrmCommunicationChannel }> = ({ channel }) => {
  const Icon = channel === 'Email' ? Mail : channel === 'WhatsApp' ? MessageCircle : channel === 'Call' ? Phone : channel === 'SMS' ? MessageCircle : BookOpen;
  return <Badge className="bg-slate-100 text-slate-700"><Icon className="mr-1 h-3 w-3" />{channel}</Badge>;
};

const statusTone = (status: string) => {
  if (['Sent', 'Delivered', 'Opened', 'Logged'].includes(status)) return 'bg-emerald-50 text-emerald-700';
  if (status === 'Failed') return 'bg-red-50 text-red-700';
  return 'bg-amber-50 text-amber-700';
};

const slaTone = (sla: string) => {
  if (sla === 'Breached') return 'bg-red-50 text-red-700';
  if (sla === 'At Risk') return 'bg-amber-50 text-amber-700';
  return 'bg-emerald-50 text-emerald-700';
};
