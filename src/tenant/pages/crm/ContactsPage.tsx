import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail, MessageCircle, Phone, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable, EmptyState, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { getLeadScore, getWeightedValue, scoreTone, sumBy } from '@/tenant/crm/crmDemoUtils';
import type { CrmContact } from '@/tenant/types';

const roleFilters = ['All', 'Decision Maker', 'Influencer', 'Evaluator', 'Finance', 'User'] as const;
const channelFilters = ['All', 'Email', 'Phone', 'WhatsApp', 'Meeting'] as const;

export const ContactsPage: React.FC = () => {
  const { crmContacts, crmCompanies } = useTenantData();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<(typeof roleFilters)[number]>('All');
  const [channel, setChannel] = useState<(typeof channelFilters)[number]>('All');
  const [owner, setOwner] = useState('All');
  const owners = useMemo(() => ['All', ...Array.from(new Set(crmContacts.map((contact) => contact.owner)))], [crmContacts]);

  const filteredContacts = useMemo(() => {
    const query = search.toLowerCase().trim();
    return crmContacts.filter((contact) => {
      const company = crmCompanies.find((item) => item.id === contact.companyId);
      const searchMatch = !query || [contact.name, contact.email, contact.phone, contact.title, contact.department, company?.displayName, contact.tags.join(' ')].join(' ').toLowerCase().includes(query);
      const roleMatch = role === 'All' || contact.decisionRole === role;
      const channelMatch = channel === 'All' || contact.preferredChannel === channel;
      const ownerMatch = owner === 'All' || contact.owner === owner;
      return searchMatch && roleMatch && channelMatch && ownerMatch;
    });
  }, [channel, crmCompanies, crmContacts, owner, role, search]);

  return (
    <div>
      <PageHeader title="Contacts" description="People workspace for stakeholders, decision roles, channel preferences, consent, and account relationships." />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Contacts" value={String(crmContacts.length)} hint="All account people" icon={<UserRound className="h-4 w-4" />} />
        <StatCard label="Decision makers" value={String(crmContacts.filter((contact) => contact.decisionRole === 'Decision Maker').length)} hint="Primary buying authority" />
        <StatCard label="WhatsApp consent" value={String(crmContacts.filter((contact) => contact.whatsappConsent).length)} hint="Demo consent flags" icon={<MessageCircle className="h-4 w-4" />} />
        <StatCard label="Active contacts" value={String(crmContacts.filter((contact) => contact.lifecycleStatus === 'Active').length)} hint="Ready for activity" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_repeat(3,180px)]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search contacts, company, title, phone, email..." />
          <Select label="Decision role" value={role} options={roleFilters} onChange={(value) => setRole(value as typeof role)} />
          <Select label="Channel" value={channel} options={channelFilters} onChange={(value) => setChannel(value as typeof channel)} />
          <Select label="Owner" value={owner} options={owners} onChange={setOwner} />
        </div>
      </section>

      <DataTable headers={['Contact', 'Company', 'Role', 'Channel', 'Consent', 'Owner', 'Status', 'Last activity']}>
        {filteredContacts.map((contact) => {
          const company = crmCompanies.find((item) => item.id === contact.companyId);
          return (
            <tr key={contact.id}>
              <td className="px-4 py-3">
                <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/contacts/${contact.id}`}>{contact.name}</Link>
                <p className="text-xs text-slate-500">{contact.title} · {contact.department}</p>
                {contact.isPrimary && <Badge className="mt-2 bg-indigo-50 text-indigo-700">Primary</Badge>}
              </td>
              <td className="px-4 py-3">
                {company ? <Link className="text-indigo-700 hover:underline" to={`/crm/companies/${company.id}`}>{company.displayName}</Link> : 'No company'}
              </td>
              <td className="px-4 py-3 text-slate-600">{contact.decisionRole}</td>
              <td className="px-4 py-3 text-slate-600">{contact.preferredChannel}</td>
              <td className="px-4 py-3 text-slate-600">{consentSummary(contact)}</td>
              <td className="px-4 py-3 text-slate-600">{contact.owner}</td>
              <td className="px-4 py-3"><Badge className={contact.lifecycleStatus === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>{contact.lifecycleStatus}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{contact.lastActivityAt}</td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
};

export const ContactDetailPage: React.FC = () => {
  const { id } = useParams();
  const { crmContacts, crmCompanies, leads, followUps, customers } = useTenantData();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Relationship' | 'Opportunities' | 'Activities' | 'Consent' | 'Notes'>('Overview');
  const contact = crmContacts.find((item) => item.id === id);

  if (!contact) {
    return <EmptyState title="Contact not found" description="The contact may not exist in local demo state." />;
  }

  const company = crmCompanies.find((item) => item.id === contact.companyId);
  const relatedLeads = leads.filter((lead) => lead.company === company?.name || lead.email === contact.email || lead.phone === contact.phone);
  const relatedFollowUps = followUps.filter((followUp) => relatedLeads.some((lead) => lead.id === followUp.leadId));
  const customer = contact.customerId ? customers.find((item) => item.id === contact.customerId) : customers.find((item) => item.email === contact.email);
  const tabs = ['Overview', 'Relationship', 'Opportunities', 'Activities', 'Consent', 'Notes'] as const;

  return (
    <div>
      <PageHeader
        title={contact.name}
        description={`${contact.title} · ${contact.department} · ${company?.displayName || 'No company'}`}
        action={<Badge className={contact.lifecycleStatus === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>{contact.lifecycleStatus}</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-6">
        <StatCard label="Decision role" value={contact.decisionRole} hint={contact.isPrimary ? 'Primary contact' : 'Secondary contact'} />
        <StatCard label="Preferred channel" value={contact.preferredChannel} hint={consentSummary(contact)} />
        <StatCard label="Open opportunities" value={String(relatedLeads.filter((lead) => lead.status === 'open').length)} hint={company?.displayName || 'Company'} />
        <StatCard label="Weighted value" value={formatINR(sumBy(relatedLeads.filter((lead) => lead.status === 'open'), getWeightedValue))} hint="Related open leads" />
        <StatCard label="Activities" value={String(relatedFollowUps.length)} hint="Follow-ups" />
        <StatCard label="Customer" value={customer ? 'Linked' : 'Not linked'} hint={customer?.lifecycleStage || 'Prospect'} />
      </section>

      <TabStrip tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'Overview' && (
        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <Panel title="Contact profile">
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Name" value={contact.name} />
              <Info label="Title" value={contact.title} />
              <Info label="Department" value={contact.department} />
              <Info label="Phone" value={contact.phone} />
              <Info label="Email" value={contact.email} />
              <Info label="Owner" value={contact.owner} />
              <Info label="Preferred channel" value={contact.preferredChannel} />
              <Info label="Last activity" value={contact.lastActivityAt} />
            </div>
          </Panel>
          <Panel title="Quick communication">
            <div className="grid gap-3">
              <Comm icon={<Phone className="h-4 w-4" />} label="Call" value={contact.phone} enabled />
              <Comm icon={<Mail className="h-4 w-4" />} label="Email" value={contact.email} enabled={contact.emailConsent} />
              <Comm icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" value={contact.phone} enabled={contact.whatsappConsent} />
            </div>
            <div className="mt-4 rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
              Communication actions are static previews only in this UI phase.
            </div>
          </Panel>
        </section>
      )}

      {activeTab === 'Relationship' && (
        <Panel title="Relationship context">
          <div className="grid gap-4 xl:grid-cols-3">
            <RelationCard title="Company" value={company?.displayName || 'No company'} helper={company?.lifecycleStatus || 'Unlinked'} to={company ? `/crm/companies/${company.id}` : undefined} />
            <RelationCard title="Customer" value={customer?.company || 'Not converted'} helper={customer?.accountHealth || 'Prospect'} to={customer ? `/crm/customers/${customer.id}` : undefined} />
            <RelationCard title="Role" value={contact.decisionRole} helper={contact.isPrimary ? 'Primary stakeholder' : 'Supporting stakeholder'} />
          </div>
        </Panel>
      )}

      {activeTab === 'Opportunities' && (
        <DataTable headers={['Opportunity', 'Stage', 'Score', 'Expected', 'Weighted', 'Next follow-up']}>
          {relatedLeads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-4 py-3"><Link className="font-medium text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link></td>
              <td className="px-4 py-3">{lead.stage}</td>
              <td className="px-4 py-3"><Badge className={scoreTone(getLeadScore(lead))}>{getLeadScore(lead)}</Badge></td>
              <td className="px-4 py-3">{formatINR(lead.expectedValue)}</td>
              <td className="px-4 py-3">{formatINR(getWeightedValue(lead))}</td>
              <td className="px-4 py-3">{new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Activities' && (
        <DataTable headers={['Activity', 'Lead', 'Owner', 'Date', 'Status']}>
          {relatedFollowUps.map((followUp) => {
            const lead = leads.find((item) => item.id === followUp.leadId);
            return (
              <tr key={followUp.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{followUp.title}</td>
                <td className="px-4 py-3">{lead ? <Link className="text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link> : 'Deleted lead'}</td>
                <td className="px-4 py-3">{followUp.owner}</td>
                <td className="px-4 py-3">{new Date(followUp.date).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3"><Badge>{followUp.completed ? 'Done' : 'Open'}</Badge></td>
              </tr>
            );
          })}
        </DataTable>
      )}

      {activeTab === 'Consent' && (
        <Panel title="Communication consent">
          <div className="grid gap-3 md:grid-cols-3">
            <Consent label="Email" enabled={contact.emailConsent} />
            <Consent label="WhatsApp" enabled={contact.whatsappConsent} />
            <Consent label="SMS" enabled={contact.smsConsent} />
          </div>
        </Panel>
      )}

      {activeTab === 'Notes' && <EmptyState title="Contact notes placeholder" description="Meeting notes and stakeholder-specific summaries will appear here in later CRM phases." />}
    </div>
  );
};

const Select: React.FC<{ label: string; value: string; options: readonly string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

const TabStrip = <T extends string,>({ tabs, activeTab, setActiveTab }: { tabs: readonly T[]; activeTab: T; setActiveTab: (tab: T) => void }) => (
  <div className="my-5 flex gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white p-2 shadow-sm">
    {tabs.map((tab) => (
      <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
        {tab}
      </button>
    ))}
  </div>
);

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
    {children}
  </section>
);

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
  </div>
);

const Comm: React.FC<{ icon: React.ReactNode; label: string; value: string; enabled: boolean }> = ({ icon, label, value, enabled }) => (
  <div className={`rounded-md border p-3 ${enabled ? 'border-emerald-100 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">{icon}{label}</div>
    <p className="mt-2 text-xs text-slate-500">{enabled ? value : 'Consent disabled'}</p>
  </div>
);

const RelationCard: React.FC<{ title: string; value: string; helper: string; to?: string }> = ({ title, value, helper, to }) => {
  const content = (
    <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </div>
  );
  return to ? <Link to={to} className="block transition hover:opacity-90">{content}</Link> : content;
};

const Consent: React.FC<{ label: string; enabled: boolean }> = ({ label, enabled }) => (
  <div className={`rounded-md border p-4 ${enabled ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
    <p className="font-medium">{label}</p>
    <p className="mt-1 text-sm">{enabled ? 'Consent captured' : 'No consent'}</p>
  </div>
);

const consentSummary = (contact: CrmContact) =>
  [
    contact.emailConsent ? 'Email' : '',
    contact.whatsappConsent ? 'WhatsApp' : '',
    contact.smsConsent ? 'SMS' : '',
  ].filter(Boolean).join(', ') || 'No consent';
