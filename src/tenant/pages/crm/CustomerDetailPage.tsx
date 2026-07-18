import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataTable, EmptyState, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { customerHealthTone, getLeadScore, getWeightedValue, scoreTone, sumBy } from '@/tenant/crm/crmDemoUtils';

const tabs = ['Overview', 'Contacts', 'Relationship', 'Opportunities', 'Quotations', 'Orders/Invoices', 'Support', 'Communication', 'Notes', 'Documents'] as const;

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams();
  const { customers, crmCompanies, crmContacts, leads, quotations, salesQuotations, salesOrders, salesSubscriptions } = useTenantData();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Overview');
  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    return <EmptyState title="Customer not found" description="Convert a lead to create a new customer in this demo." />;
  }

  const relatedLeads = leads.filter((lead) => lead.email === customer.email || lead.company === customer.company);
  const companyRecord = crmCompanies.find((company) => company.customerId === customer.id || company.name === customer.company);
  const companyContacts = companyRecord
    ? crmContacts.filter((contact) => contact.companyId === companyRecord.id)
    : crmContacts.filter((contact) => contact.customerId === customer.id || contact.email === customer.email);
  const parentCompany = companyRecord?.parentCompanyId ? crmCompanies.find((company) => company.id === companyRecord.parentCompanyId) : undefined;
  const childCompanies = companyRecord ? crmCompanies.filter((company) => company.parentCompanyId === companyRecord.id) : [];
  const openOpportunities = relatedLeads.filter((lead) => lead.status === 'open');
  const relatedQuotations = quotations.filter((quotation) => relatedLeads.some((lead) => lead.id === quotation.leadId));
  const relatedSalesQuotes = salesQuotations.filter((quotation) => quotation.customerName === customer.company);
  const relatedOrders = salesOrders.filter((order) => order.customerName === customer.company);
  const relatedSubscriptions = salesSubscriptions.filter((subscription) => subscription.customerName === customer.company);
  const weightedValue = sumBy(openOpportunities, getWeightedValue);

  return (
    <div>
      <PageHeader
        title={customer.name}
        description={`${customer.company} · ${customer.city || 'Bhubaneswar'} · ${customer.owner || 'Anita Das'}`}
        action={<Badge className={customerHealthTone(customer)}>{customer.accountHealth || 'Healthy'} · {customer.healthScore || 72}%</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-6">
        <StatCard label="Lifetime value" value={formatINR(customer.value)} hint="Demo converted value" />
        <StatCard label="Open forecast" value={formatINR(weightedValue)} hint={`${openOpportunities.length} active opportunities`} />
        <StatCard label="Health" value={`${customer.healthScore || 72}%`} hint={customer.accountHealth || 'Healthy'} />
        <StatCard label="Renewal" value={customer.renewalDate || '2026-09-15'} hint={customer.lifecycleStage || 'Customer'} />
        <StatCard label="Tickets" value={String(customer.ticketsOpen || 0)} hint="Support placeholder" />
        <StatCard label="Documents" value={String(customer.documentsCount || 0)} hint="Files placeholder" />
      </section>

      <div className="my-5 flex gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <Panel title="Customer 360 profile">
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Company" value={customer.company} />
              <Info label="Phone" value={customer.phone} />
              <Info label="Email" value={customer.email} />
              <Info label="City" value={customer.city || 'Bhubaneswar'} />
              <Info label="Industry" value={customer.industry} />
              <Info label="Owner" value={customer.owner || 'Anita Das'} />
              <Info label="Lifecycle" value={customer.lifecycleStage || 'Customer'} />
              <Info label="Last contact" value={customer.lastContactAt || customer.since} />
              <Info label="Company record" value={companyRecord?.displayName || 'Not linked'} />
              <Info label="Primary contacts" value={String(companyContacts.filter((contact) => contact.isPrimary).length || companyContacts.length)} />
            </div>
          </Panel>
          <Panel title="Account signals">
            <div className="space-y-3">
              <Signal label="Communication touches" value={customer.communicationCount || 5} />
              <Signal label="Open support tickets" value={customer.ticketsOpen || 0} />
              <Signal label="Documents stored" value={customer.documentsCount || 0} />
              <Signal label="Open opportunities" value={customer.openOpportunities || openOpportunities.length} />
            </div>
          </Panel>
        </section>
      )}

      {activeTab === 'Contacts' && (
        <DataTable headers={['Contact', 'Role', 'Phone', 'Email', 'Preference', 'Status']}>
          {companyContacts.map((contact) => (
            <tr key={contact.id}>
              <td className="px-4 py-3">
                <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/contacts/${contact.id}`}>{contact.name}</Link>
                <p className="text-xs text-slate-500">{contact.title} · {contact.department}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{contact.decisionRole}</td>
              <td className="px-4 py-3 text-slate-600">{contact.phone}</td>
              <td className="px-4 py-3 text-slate-600">{contact.email}</td>
              <td className="px-4 py-3 text-slate-600">{contact.preferredChannel}</td>
              <td className="px-4 py-3"><Badge className={contact.lifecycleStatus === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>{contact.lifecycleStatus}</Badge></td>
            </tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Relationship' && (
        <Panel title="Customer relationship map">
          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr_1fr]">
            <RelationColumn title="Parent account" items={parentCompany ? [parentCompany.displayName] : ['No parent account']} />
            <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-indigo-700">Customer account</p>
              <p className="mt-2 text-xl font-semibold text-indigo-950">{companyRecord?.displayName || customer.company}</p>
              <p className="mt-1 text-sm text-indigo-800">{customer.lifecycleStage || 'Customer'} · {customer.accountHealth || 'Healthy'}</p>
              {companyRecord && <Link className="mt-4 inline-flex text-sm font-medium text-indigo-700 hover:underline" to={`/crm/companies/${companyRecord.id}`}>Open company record</Link>}
            </div>
            <RelationColumn title="Child accounts" items={childCompanies.length ? childCompanies.map((company) => company.displayName) : ['No child accounts']} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {companyContacts.map((contact) => (
              <Link key={contact.id} to={`/crm/contacts/${contact.id}`} className="rounded-md border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50">
                <p className="font-medium text-slate-950">{contact.name}</p>
                <p className="mt-1 text-xs text-slate-500">{contact.decisionRole} · {contact.preferredChannel}</p>
              </Link>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === 'Opportunities' && (
        <DataTable headers={['Lead/opportunity', 'Stage', 'Score', 'Expected', 'Weighted', 'Next follow-up']}>
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

      {activeTab === 'Quotations' && (
        <div className="grid gap-5">
          <DataTable headers={['CRM quotation', 'Amount', 'Status', 'Created']}>
            {relatedQuotations.map((quotation) => (
              <tr key={quotation.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{quotation.id}</td>
                <td className="px-4 py-3">{formatINR(quotation.amount)}</td>
                <td className="px-4 py-3">{quotation.status}</td>
                <td className="px-4 py-3">{quotation.createdAt}</td>
              </tr>
            ))}
          </DataTable>
          <DataTable headers={['Sales quote', 'Status', 'Salesperson', 'Created']}>
            {relatedSalesQuotes.map((quotation) => (
              <tr key={quotation.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{quotation.number}</td>
                <td className="px-4 py-3">{quotation.status}</td>
                <td className="px-4 py-3">{quotation.salesperson}</td>
                <td className="px-4 py-3">{quotation.createdAt}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      )}

      {activeTab === 'Orders/Invoices' && (
        <DataTable headers={['Order', 'Quotation', 'Amount', 'Order status', 'Invoice status', 'Payment']}>
          {relatedOrders.map((order, index) => (
            <tr key={order.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{order.orderNumber}</td>
              <td className="px-4 py-3">{order.quotationNumber}</td>
              <td className="px-4 py-3">{formatINR(order.amount)}</td>
              <td className="px-4 py-3">{order.status}</td>
              <td className="px-4 py-3">{index % 2 === 0 ? 'Invoice draft' : 'Invoice sent'}</td>
              <td className="px-4 py-3">{index % 2 === 0 ? 'Pending' : 'Partial'}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Support' && (
        <DataTable headers={['Ticket', 'Priority', 'SLA', 'Assignee', 'Status']}>
          {Array.from({ length: Math.max(1, customer.ticketsOpen || 0) }, (_, index) => (
            <tr key={index}>
              <td className="px-4 py-3 font-medium text-slate-950">TCK-2026-{String(index + 1).padStart(3, '0')}</td>
              <td className="px-4 py-3">{index % 2 === 0 ? 'Medium' : 'High'}</td>
              <td className="px-4 py-3">{index % 2 === 0 ? 'On track' : 'At risk'}</td>
              <td className="px-4 py-3">Support Executive</td>
              <td className="px-4 py-3"><Badge>{index % 2 === 0 ? 'Open' : 'Escalated'}</Badge></td>
            </tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Communication' && (
        <Panel title="Communication timeline">
          <div className="space-y-3">
            {['Welcome email sent preview', 'WhatsApp onboarding reminder preview', 'Implementation check-in call logged', 'Renewal nurture task scheduled'].map((item, index) => (
              <div key={item} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">{item}</p>
                <p className="mt-1 text-xs text-slate-500">2026-06-{String(10 + index).padStart(2, '0')} · Local demo timeline</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === 'Notes' && <EmptyState title="Notes placeholder" description="Customer success notes and meeting summaries will appear here as local UI in later CRM phases." />}
      {activeTab === 'Documents' && (
        <DataTable headers={['Document', 'Type', 'Owner', 'Updated']}>
          {['Proposal copy', 'Signed terms placeholder', 'Implementation checklist'].map((name, index) => (
            <tr key={name}>
              <td className="px-4 py-3 font-medium text-slate-950">{name}</td>
              <td className="px-4 py-3">{index === 0 ? 'Quotation' : index === 1 ? 'Contract' : 'Checklist'}</td>
              <td className="px-4 py-3">{customer.owner || 'Anita Das'}</td>
              <td className="px-4 py-3">2026-06-{String(12 + index).padStart(2, '0')}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {relatedSubscriptions.length > 0 && (
        <section className="mt-5 rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
          Active subscription context: {relatedSubscriptions.map((item) => `${item.planName} renews ${item.renewalDate}`).join(', ')}.
        </section>
      )}
    </div>
  );
};

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

const Signal: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <Badge variant="secondary">{value}</Badge>
  </div>
);

const RelationColumn: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
    <p className="text-sm font-semibold text-slate-900">{title}</p>
    <div className="mt-3 space-y-2">
      {items.map((item) => <div key={item} className="rounded-md bg-white px-3 py-2 text-sm text-slate-700">{item}</div>)}
    </div>
  </div>
);

export default CustomerDetailPage;
