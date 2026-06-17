import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatINR, PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

const CustomersPage: React.FC = () => {
  const { customers } = useTenantData();
  return (
    <div>
      <PageHeader title="Customers" description="Converted CRM customers with owner, last-contact, value, and status context." />
      <DataTable headers={['Customer', 'Company', 'Phone', 'Email', 'City', 'Total value', 'Last contact', 'Owner', 'Status']}>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td className="px-4 py-3">
              <Link to={`/crm/customers/${customer.id}`} className="font-medium text-indigo-700 hover:underline">{customer.name}</Link>
              <p className="text-xs text-slate-500">{customer.industry}</p>
            </td>
            <td className="px-4 py-3 text-slate-600">{customer.company}</td>
            <td className="px-4 py-3 text-slate-600">{customer.phone}</td>
            <td className="px-4 py-3 text-slate-600">{customer.email}</td>
            <td className="px-4 py-3 text-slate-600">{customer.city || 'Bhubaneswar'}</td>
            <td className="px-4 py-3 font-medium text-slate-900">{formatINR(customer.value)}</td>
            <td className="px-4 py-3 text-slate-600">{customer.lastContactAt || customer.since}</td>
            <td className="px-4 py-3 text-slate-600">{customer.owner || 'Anita Das'}</td>
            <td className="px-4 py-3"><Badge className="bg-emerald-50 text-emerald-700">{customer.status || 'active'}</Badge></td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export default CustomersPage;
