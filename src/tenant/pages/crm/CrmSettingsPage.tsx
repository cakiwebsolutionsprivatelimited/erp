import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable, PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

const stages = ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];
const automationRules = [
  ['Quotation follow-up', 'When stage becomes Quotation Sent', 'Create follow-up after 2 days'],
  ['High value alert', 'When expected value exceeds ₹1,50,000', 'Notify Sales Manager'],
  ['Won conversion', 'When stage becomes Won', 'Suggest Convert to Customer'],
];

const CrmSettingsPage: React.FC = () => {
  const { leads, users } = useTenantData();
  const sources = Array.from(new Set(leads.map((lead) => lead.source)));

  return (
    <div>
      <PageHeader title="CRM Settings" description="Demo CRM configuration for stages, sources, owners, and automation placeholders." />
      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Lead workflow stages</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {stages.map((stage, index) => <Badge key={stage} variant="secondary">{index + 1}. {stage}</Badge>)}
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Lead sources</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {sources.map((source) => <Badge key={source} className="bg-indigo-50 text-indigo-700">{source}</Badge>)}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <DataTable headers={['Sales owner', 'Role', 'Status']}>
          {users.filter((user) => user.role.toLowerCase().includes('sales') || user.role === 'Owner').map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{user.name}</td>
              <td className="px-4 py-3 text-slate-600">{user.role}</td>
              <td className="px-4 py-3"><Badge className={user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}>{user.status}</Badge></td>
            </tr>
          ))}
        </DataTable>

        <DataTable headers={['Rule', 'Trigger', 'Action']}>
          {automationRules.map(([name, trigger, action]) => (
            <tr key={name}>
              <td className="px-4 py-3 font-medium text-slate-950">{name}</td>
              <td className="px-4 py-3 text-slate-600">{trigger}</td>
              <td className="px-4 py-3 text-slate-600">{action}</td>
            </tr>
          ))}
        </DataTable>
      </section>
    </div>
  );
};

export default CrmSettingsPage;
