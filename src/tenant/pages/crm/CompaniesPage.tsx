import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable, EmptyState, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { getLeadScore, getWeightedValue, scoreTone, sumBy } from '@/tenant/crm/crmDemoUtils';
import type { CrmCompany } from '@/tenant/types';

const lifecycleFilters = ['All', 'Lead', 'Prospect', 'Customer', 'Partner', 'Inactive'] as const;

export const CompaniesPage: React.FC = () => {
  const { crmCompanies, crmContacts } = useTenantData();
  const [search, setSearch] = useState('');
  const [lifecycle, setLifecycle] = useState<(typeof lifecycleFilters)[number]>('All');
  const [owner, setOwner] = useState('All');
  const owners = useMemo(() => ['All', ...Array.from(new Set(crmCompanies.map((company) => company.owner)))], [crmCompanies]);

  const filteredCompanies = useMemo(() => {
    const query = search.toLowerCase().trim();
    return crmCompanies.filter((company) => {
      const searchMatch = !query || [company.name, company.legalName, company.industry, company.city, company.owner, company.tags.join(' ')].join(' ').toLowerCase().includes(query);
      const lifecycleMatch = lifecycle === 'All' || company.lifecycleStatus === lifecycle;
      const ownerMatch = owner === 'All' || company.owner === owner;
      return searchMatch && lifecycleMatch && ownerMatch;
    });
  }, [crmCompanies, lifecycle, owner, search]);

  return (
    <div>
      <PageHeader title="Companies" description="Enterprise account workspace for legal entities, ownership, health, hierarchy, contacts, and opportunity context." />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Companies" value={String(crmCompanies.length)} hint="Accounts and prospects" icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Customers" value={String(crmCompanies.filter((company) => company.lifecycleStatus === 'Customer').length)} hint="Converted accounts" />
        <StatCard label="Contacts" value={String(crmContacts.length)} hint="People linked to accounts" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Pipeline value" value={formatINR(sumBy(crmCompanies, (company) => company.totalPipelineValue))} hint="Account-level total" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search companies, industry, city, owner..." />
          <Select label="Lifecycle" value={lifecycle} options={lifecycleFilters} onChange={(value) => setLifecycle(value as typeof lifecycle)} />
          <Select label="Owner" value={owner} options={owners} onChange={setOwner} />
        </div>
      </section>

      <DataTable headers={['Company', 'Lifecycle', 'Health', 'Industry', 'Contacts', 'Pipeline', 'Owner', 'Location', 'Last activity']}>
        {filteredCompanies.map((company) => {
          const contactCount = crmContacts.filter((contact) => contact.companyId === company.id).length;
          return (
            <tr key={company.id}>
              <td className="px-4 py-3">
                <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/companies/${company.id}`}>{company.displayName}</Link>
                <p className="text-xs text-slate-500">{company.legalName}</p>
                <div className="mt-2 flex flex-wrap gap-1">{company.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
              </td>
              <td className="px-4 py-3"><Badge variant="secondary">{company.lifecycleStatus}</Badge></td>
              <td className="px-4 py-3"><Badge className={companyTone(company)}>{company.healthScore}%</Badge></td>
              <td className="px-4 py-3 text-slate-600">{company.industry}</td>
              <td className="px-4 py-3 text-slate-600">{contactCount}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{formatINR(company.totalPipelineValue)}</p>
                <p className="text-xs text-slate-500">{company.openOpportunities} open opportunities</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{company.owner}</td>
              <td className="px-4 py-3 text-slate-600">{company.city}, {company.state}</td>
              <td className="px-4 py-3 text-slate-600">{company.lastActivityAt}</td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
};

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams();
  const { crmCompanies, crmContacts, leads, customers, quotations, salesQuotations, salesOrders } = useTenantData();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Contacts' | 'Opportunities' | 'Relationship' | 'Quotations' | 'Orders/Invoices' | 'Documents' | 'Timeline'>('Overview');
  const company = crmCompanies.find((item) => item.id === id);

  if (!company) {
    return <EmptyState title="Company not found" description="The company may not exist in local demo state." />;
  }

  const companyContacts = crmContacts.filter((contact) => contact.companyId === company.id);
  const companyLeads = leads.filter((lead) => lead.company === company.name);
  const companyCustomer = company.customerId ? customers.find((customer) => customer.id === company.customerId) : customers.find((customer) => customer.company === company.name);
  const relatedQuotations = quotations.filter((quotation) => companyLeads.some((lead) => lead.id === quotation.leadId));
  const relatedSalesQuotes = salesQuotations.filter((quotation) => quotation.customerName === company.name);
  const relatedOrders = salesOrders.filter((order) => order.customerName === company.name);
  const parentCompany = company.parentCompanyId ? crmCompanies.find((item) => item.id === company.parentCompanyId) : undefined;
  const childCompanies = crmCompanies.filter((item) => item.parentCompanyId === company.id);
  const weightedValue = sumBy(companyLeads.filter((lead) => lead.status === 'open'), getWeightedValue);

  const tabs = ['Overview', 'Contacts', 'Opportunities', 'Relationship', 'Quotations', 'Orders/Invoices', 'Documents', 'Timeline'] as const;

  return (
    <div>
      <PageHeader
        title={company.displayName}
        description={`${company.legalName} · ${company.industry} · ${company.owner}`}
        action={<Badge className={companyTone(company)}>{company.accountHealth} · {company.healthScore}%</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-6">
        <StatCard label="Lifecycle" value={company.lifecycleStatus} hint={company.city} />
        <StatCard label="Pipeline" value={formatINR(company.totalPipelineValue)} hint={`${company.openOpportunities} open opportunities`} />
        <StatCard label="Weighted forecast" value={formatINR(weightedValue)} hint="Open opportunities" />
        <StatCard label="Contacts" value={String(companyContacts.length)} hint={`${companyContacts.filter((contact) => contact.isPrimary).length} primary`} />
        <StatCard label="Quotes" value={String(relatedSalesQuotes.length + relatedQuotations.length)} hint="CRM + Sales" />
        <StatCard label="Orders" value={String(relatedOrders.length)} hint="Sales placeholder" />
      </section>

      <TabStrip tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'Overview' && (
        <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <Panel title="Company profile">
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Legal name" value={company.legalName} />
              <Info label="Display name" value={company.displayName} />
              <Info label="Industry" value={company.industry} />
              <Info label="Employee size" value={company.employeeSize} />
              <Info label="Revenue band" value={company.annualRevenueBand} />
              <Info label="GST/tax" value={company.gstNumber || 'Not captured'} />
              <Info label="Phone" value={company.phone} />
              <Info label="Email" value={company.email} />
              <Info label="Address" value={`${company.address}, ${company.city}, ${company.state}`} />
              <Info label="Website" value={company.website || 'Not captured'} />
            </div>
          </Panel>
          <Panel title="Account signals">
            <Signal label="Account health" value={`${company.accountHealth} · ${company.healthScore}%`} />
            <Signal label="Last activity" value={company.lastActivityAt} />
            <Signal label="Customer record" value={companyCustomer ? companyCustomer.name : 'Not converted'} />
            <Signal label="Parent account" value={parentCompany?.displayName || 'None'} />
          </Panel>
        </section>
      )}

      {activeTab === 'Contacts' && (
        <DataTable headers={['Contact', 'Role', 'Channel', 'Consent', 'Owner', 'Last activity']}>
          {companyContacts.map((contact) => (
            <tr key={contact.id}>
              <td className="px-4 py-3">
                <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/contacts/${contact.id}`}>{contact.name}</Link>
                <p className="text-xs text-slate-500">{contact.title} · {contact.department}</p>
              </td>
              <td className="px-4 py-3">{contact.decisionRole}</td>
              <td className="px-4 py-3">{contact.preferredChannel}</td>
              <td className="px-4 py-3 text-slate-600">{consentSummary(contact)}</td>
              <td className="px-4 py-3 text-slate-600">{contact.owner}</td>
              <td className="px-4 py-3 text-slate-600">{contact.lastActivityAt}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Opportunities' && (
        <DataTable headers={['Opportunity', 'Stage', 'Score', 'Expected', 'Weighted', 'Owner', 'Next follow-up']}>
          {companyLeads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-4 py-3"><Link className="font-medium text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link></td>
              <td className="px-4 py-3">{lead.stage}</td>
              <td className="px-4 py-3"><Badge className={scoreTone(getLeadScore(lead))}>{getLeadScore(lead)}</Badge></td>
              <td className="px-4 py-3">{formatINR(lead.expectedValue)}</td>
              <td className="px-4 py-3">{formatINR(getWeightedValue(lead))}</td>
              <td className="px-4 py-3">{lead.assignedTo}</td>
              <td className="px-4 py-3">{new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Relationship' && (
        <RelationshipMap company={company} parentCompany={parentCompany} childCompanies={childCompanies} contacts={companyContacts} />
      )}

      {activeTab === 'Quotations' && (
        <DataTable headers={['Record', 'Type', 'Amount/status', 'Created', 'Owner']}>
          {relatedQuotations.map((quotation) => (
            <tr key={quotation.id}><td className="px-4 py-3 font-medium">{quotation.id}</td><td className="px-4 py-3">CRM quote</td><td className="px-4 py-3">{formatINR(quotation.amount)} · {quotation.status}</td><td className="px-4 py-3">{quotation.createdAt}</td><td className="px-4 py-3">{company.owner}</td></tr>
          ))}
          {relatedSalesQuotes.map((quotation) => (
            <tr key={quotation.id}><td className="px-4 py-3 font-medium text-indigo-700">{quotation.number}</td><td className="px-4 py-3">Sales quote</td><td className="px-4 py-3">{quotation.status}</td><td className="px-4 py-3">{quotation.createdAt}</td><td className="px-4 py-3">{quotation.salesperson}</td></tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Orders/Invoices' && (
        <DataTable headers={['Order', 'Quotation', 'Amount', 'Delivery', 'Order status', 'Invoice/payment']}>
          {relatedOrders.map((order, index) => (
            <tr key={order.id}><td className="px-4 py-3 font-medium">{order.orderNumber}</td><td className="px-4 py-3">{order.quotationNumber}</td><td className="px-4 py-3">{formatINR(order.amount)}</td><td className="px-4 py-3">{order.deliveryDate}</td><td className="px-4 py-3">{order.status}</td><td className="px-4 py-3">{index % 2 === 0 ? 'Invoice draft' : 'Partial payment'}</td></tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Documents' && <DocumentTable owner={company.owner} />}
      {activeTab === 'Timeline' && <Timeline company={company} contacts={companyContacts} />}
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

const Signal: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <span className="text-sm font-semibold text-slate-950">{value}</span>
  </div>
);

const RelationshipMap: React.FC<{ company: CrmCompany; parentCompany?: CrmCompany; childCompanies: CrmCompany[]; contacts: ReturnType<typeof useTenantData>['crmContacts'] }> = ({ company, parentCompany, childCompanies, contacts }) => (
  <Panel title="Relationship map">
    <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr_1fr]">
      <RelationColumn title="Parent account" items={parentCompany ? [parentCompany.displayName] : ['No parent account']} tone="slate" />
      <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center">
        <Building2 className="mx-auto h-6 w-6 text-indigo-700" />
        <p className="mt-2 text-lg font-semibold text-indigo-950">{company.displayName}</p>
        <p className="text-sm text-indigo-800">{company.lifecycleStatus} · {company.industry}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Badge className={companyTone(company)}>{company.accountHealth}</Badge>
          <Badge variant="secondary">{contacts.length} contacts</Badge>
        </div>
      </div>
      <RelationColumn title="Child accounts" items={childCompanies.length ? childCompanies.map((item) => item.displayName) : ['No child accounts']} tone="emerald" />
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {contacts.slice(0, 4).map((contact) => (
        <Link key={contact.id} to={`/crm/contacts/${contact.id}`} className="rounded-md border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50">
          <p className="font-medium text-slate-950">{contact.name}</p>
          <p className="mt-1 text-xs text-slate-500">{contact.decisionRole} · {contact.preferredChannel}</p>
        </Link>
      ))}
    </div>
  </Panel>
);

const RelationColumn: React.FC<{ title: string; items: string[]; tone: 'slate' | 'emerald' }> = ({ title, items, tone }) => (
  <div className={`rounded-md border p-4 ${tone === 'emerald' ? 'border-emerald-100 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
    <p className="text-sm font-semibold text-slate-900">{title}</p>
    <div className="mt-3 space-y-2">
      {items.map((item) => <div key={item} className="rounded-md bg-white px-3 py-2 text-sm text-slate-700">{item}</div>)}
    </div>
  </div>
);

const DocumentTable: React.FC<{ owner: string }> = ({ owner }) => (
  <DataTable headers={['Document', 'Type', 'Owner', 'Updated']}>
    {['Company profile', 'GST document placeholder', 'Relationship notes'].map((name, index) => (
      <tr key={name}><td className="px-4 py-3 font-medium">{name}</td><td className="px-4 py-3">{index === 0 ? 'Profile' : index === 1 ? 'Tax' : 'Notes'}</td><td className="px-4 py-3">{owner}</td><td className="px-4 py-3">2026-06-{String(12 + index).padStart(2, '0')}</td></tr>
    ))}
  </DataTable>
);

const Timeline: React.FC<{ company: CrmCompany; contacts: ReturnType<typeof useTenantData>['crmContacts'] }> = ({ company, contacts }) => (
  <Panel title="Account timeline">
    <div className="space-y-3">
      {[
        `Company created from ${company.lifecycleStatus.toLowerCase()} workflow`,
        `${contacts.length} contacts associated with account`,
        `Last activity recorded on ${company.lastActivityAt}`,
        'Customer 360 sync preview available',
      ].map((item) => <div key={item} className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">{item}</div>)}
    </div>
  </Panel>
);

const companyTone = (company: CrmCompany) => {
  if (company.healthScore >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (company.healthScore >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

const consentSummary = (contact: ReturnType<typeof useTenantData>['crmContacts'][number]) =>
  [
    contact.emailConsent ? 'Email' : '',
    contact.whatsappConsent ? 'WhatsApp' : '',
    contact.smsConsent ? 'SMS' : '',
  ].filter(Boolean).join(', ') || 'No consent';
