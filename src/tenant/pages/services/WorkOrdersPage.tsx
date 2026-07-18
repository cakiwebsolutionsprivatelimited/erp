import React, { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, SearchBar, formatINR } from '@/tenant/components/TenantUI';
import { ServiceStatusBadge } from '@/tenant/services/ServiceStatusBadge';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';

const WorkOrdersPage: React.FC = () => {
  const services = useServicesData();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => services.workOrders.filter((order) => `${order.number} ${order.customer} ${order.technician} ${order.visitSummary}`.toLowerCase().includes(query.toLowerCase())), [query, services.workOrders]);

  return (
    <div>
      <PageHeader title="Work Orders" description="Review delivered items and services, visit summaries, charges, and collection status." />
      <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search work orders, customers, or technicians" /></div>
      <DataTable headers={['Work order', 'Customer', 'Technician', 'Items/services', 'Visit summary', 'Charges', 'Payment', 'Status', '']}>
        {filtered.map((order) => (
          <tr key={order.id}>
            <td className="px-4 py-3 font-medium text-indigo-700">{order.number}</td>
            <td className="px-4 py-3 text-slate-600">{order.customer}</td>
            <td className="px-4 py-3 text-slate-600">{order.technician}</td>
            <td className="px-4 py-3"><p className="font-medium text-slate-700">{order.items.length} line items</p><p className="mt-0.5 max-w-48 truncate text-xs text-slate-500">{order.items.map((item) => item.description).join(', ') || 'No items'}</p></td>
            <td className="max-w-72 px-4 py-3 text-slate-600">{order.visitSummary}</td>
            <td className="px-4 py-3 font-medium text-slate-950">{formatINR(order.charges)}</td>
            <td className="px-4 py-3"><ServiceStatusBadge status={order.paymentStatus} /></td>
            <td className="px-4 py-3"><ServiceStatusBadge status={order.status} /></td>
            <td className="px-4 py-3">{order.status === 'Open' && <Button size="sm" variant="outline" onClick={() => services.completeWorkOrder(order.id)}><CheckCircle2 className="h-3.5 w-3.5" />Complete</Button>}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export default WorkOrdersPage;
