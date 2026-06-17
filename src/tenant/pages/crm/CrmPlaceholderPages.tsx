import React from 'react';
import { BarChart3, FileText } from 'lucide-react';
import { DataTable, EmptyState, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

export const CrmQuotationsPage: React.FC = () => {
  const { quotations } = useTenantData();
  return (
    <div>
      <PageHeader title="CRM Quotations" description="Placeholder quotation records linked to CRM leads." />
      <DataTable headers={['Quotation', 'Customer', 'Amount', 'Status', 'Created']}>
        {quotations.map((quotation) => (
          <tr key={quotation.id}>
            <td className="px-4 py-3 font-medium text-slate-950">{quotation.id}</td>
            <td className="px-4 py-3 text-slate-600">{quotation.customerName}</td>
            <td className="px-4 py-3 font-medium text-slate-900">{formatINR(quotation.amount)}</td>
            <td className="px-4 py-3 text-slate-600">{quotation.status}</td>
            <td className="px-4 py-3 text-slate-600">{quotation.createdAt}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export const CrmReportsPage: React.FC = () => {
  const { leads, customers } = useTenantData();
  return (
    <div>
      <PageHeader title="CRM Reports" description="Report placeholders for pipeline, sources, owners, and conversion trends." />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Lead source report" value="8 sources" hint="Website, WhatsApp, referrals and more" icon={<BarChart3 className="h-4 w-4" />} />
        <StatCard label="Conversion rate" value={`${Math.round((customers.length / leads.length) * 100)}%`} hint="Demo customer conversions" icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Pipeline stages" value="7 stages" hint="New to Won/Lost workflow" icon={<BarChart3 className="h-4 w-4" />} />
      </section>
      <div className="mt-5">
        <EmptyState title="Report builder placeholder" description="Charts and exportable reports will connect here after the backend reporting API is ready." />
      </div>
    </div>
  );
};
