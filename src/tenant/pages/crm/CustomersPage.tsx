import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { customerHealthTone, sumBy } from '@/tenant/crm/crmDemoUtils';

const lifecycleFilters = ['All', 'New Customer', 'Implementation', 'Adoption', 'Renewal'] as const;

const CustomersPage: React.FC = () => {
  const { customers, leads } = useTenantData();
  const [search, setSearch] = useState('');
  const [lifecycle, setLifecycle] = useState<(typeof lifecycleFilters)[number]>('All');
  const [owner, setOwner] = useState('All');
  const owners = useMemo(() => ['All', ...Array.from(new Set(customers.map((customer) => customer.owner || 'Anita Das')))], [customers]);

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();
    return customers.filter((customer) => {
      const searchMatch = !query || [customer.name, customer.company, customer.email, customer.phone, customer.industry, customer.owner, customer.lifecycleStage].join(' ').toLowerCase().includes(query);
      const lifecycleMatch = lifecycle === 'All' || customer.lifecycleStage === lifecycle;
      const ownerMatch = owner === 'All' || customer.owner === owner;
      return searchMatch && lifecycleMatch && ownerMatch;
    });
  }, [customers, lifecycle, owner, search]);

  const totalValue = sumBy(customers, (customer) => customer.value);
  const avgHealth = customers.length ? Math.round(sumBy(customers, (customer) => customer.healthScore || 72) / customers.length) : 0;
  const openOpportunities = sumBy(customers, (customer) => customer.openOpportunities || 0);
  const openTickets = sumBy(customers, (customer) => customer.ticketsOpen || 0);

  return (
    <div>
      <PageHeader title="Customers" description="Converted CRM customers with health, value, opportunity, renewal, and support context." />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Customer value" value={formatINR(totalValue)} hint={`${customers.length} customers`} />
        <StatCard label="Avg health" value={`${avgHealth}%`} hint="Customer 360 score" />
        <StatCard label="Open opportunities" value={String(openOpportunities)} hint={`${leads.filter((lead) => lead.status === 'open').length} active leads`} />
        <StatCard label="Open tickets" value={String(openTickets)} hint="Support placeholder" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search customers, company, phone, lifecycle..." />
          <Select label="Lifecycle" value={lifecycle} options={lifecycleFilters} onChange={(value) => setLifecycle(value as typeof lifecycle)} />
          <Select label="Owner" value={owner} options={owners} onChange={setOwner} />
        </div>
      </section>

      <DataTable headers={['Customer', 'Health', 'Company', 'Contact', 'Value', 'Opportunities', 'Renewal', 'Owner', 'Status']}>
        {filteredCustomers.map((customer) => (
          <tr key={customer.id}>
            <td className="px-4 py-3">
              <Link to={`/crm/customers/${customer.id}`} className="font-medium text-indigo-700 hover:underline">{customer.name}</Link>
              <p className="text-xs text-slate-500">{customer.industry} · {customer.lifecycleStage || 'Customer'}</p>
            </td>
            <td className="px-4 py-3">
              <Badge className={customerHealthTone(customer)}>{customer.healthScore || 72}%</Badge>
              <p className="mt-1 text-xs text-slate-500">{customer.accountHealth || 'Healthy'}</p>
            </td>
            <td className="px-4 py-3 text-slate-600">{customer.company}</td>
            <td className="px-4 py-3 text-slate-600">
              <p>{customer.phone}</p>
              <p className="text-xs text-slate-500">{customer.email}</p>
            </td>
            <td className="px-4 py-3 font-medium text-slate-900">{formatINR(customer.value)}</td>
            <td className="px-4 py-3 text-slate-600">{customer.openOpportunities || 0}</td>
            <td className="px-4 py-3 text-slate-600">{customer.renewalDate || '2026-09-15'}</td>
            <td className="px-4 py-3 text-slate-600">{customer.owner || 'Anita Das'}</td>
            <td className="px-4 py-3"><Badge className="bg-emerald-50 text-emerald-700">{customer.status || 'active'}</Badge></td>
          </tr>
        ))}
      </DataTable>
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

export default CustomersPage;
