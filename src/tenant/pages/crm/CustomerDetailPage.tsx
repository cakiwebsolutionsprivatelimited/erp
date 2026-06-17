import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataTable, EmptyState, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

const tabs = ['Overview', 'Contacts', 'Leads history', 'Quotations', 'Invoices', 'Communication', 'Notes', 'Files'] as const;

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams();
  const { customers, leads, quotations } = useTenantData();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Overview');
  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    return <EmptyState title="Customer not found" description="Convert a lead to create a new customer in this demo." />;
  }

  const relatedLeads = leads.filter((lead) => lead.email === customer.email || lead.company === customer.company);
  const relatedQuotations = quotations.filter((quotation) => relatedLeads.some((lead) => lead.id === quotation.leadId));

  return (
    <div>
      <PageHeader title={customer.name} description={`${customer.company} · ${customer.city || 'Bhubaneswar'} · ${customer.owner || 'Anita Das'}`} action={<Badge className="bg-emerald-50 text-emerald-700">{customer.status || 'active'}</Badge>} />
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Lifetime value" value={formatINR(customer.value)} hint="Demo converted value" />
        <StatCard label="Industry" value={customer.industry} hint={customer.phone} />
        <StatCard label="Last contact" value={customer.lastContactAt || customer.since} hint={customer.email} />
        <StatCard label="Owner" value={customer.owner || 'Anita Das'} hint="CRM account owner" />
      </section>

      <div className="my-5 flex gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-950">Customer profile</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Info label="Company" value={customer.company} />
            <Info label="Phone" value={customer.phone} />
            <Info label="Email" value={customer.email} />
            <Info label="City" value={customer.city || 'Bhubaneswar'} />
          </div>
        </section>
      )}

      {activeTab === 'Leads history' && (
        <DataTable headers={['Lead', 'Stage', 'Value', 'Created']}>
          {relatedLeads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{lead.name}</td>
              <td className="px-4 py-3">{lead.stage}</td>
              <td className="px-4 py-3">{formatINR(lead.expectedValue)}</td>
              <td className="px-4 py-3">{lead.createdAt}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {activeTab === 'Quotations' && (
        <DataTable headers={['Quotation', 'Amount', 'Status', 'Created']}>
          {relatedQuotations.map((quotation) => (
            <tr key={quotation.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{quotation.id}</td>
              <td className="px-4 py-3">{formatINR(quotation.amount)}</td>
              <td className="px-4 py-3">{quotation.status}</td>
              <td className="px-4 py-3">{quotation.createdAt}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {['Contacts', 'Invoices', 'Communication', 'Notes', 'Files'].includes(activeTab) && (
        <EmptyState title={`${activeTab} placeholder`} description="This customer tab is ready for the next module integrations." />
      )}
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
  </div>
);

export default CustomerDetailPage;
