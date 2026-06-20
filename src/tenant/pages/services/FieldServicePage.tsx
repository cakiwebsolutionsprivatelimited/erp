import React, { useMemo, useState } from 'react';
import { MapPin, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, SearchBar, formatINR } from '@/tenant/components/TenantUI';
import { FieldVisitForm } from '@/tenant/services/ServiceForms';
import { ServiceStatusBadge } from '@/tenant/services/ServiceStatusBadge';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';
import type { VisitStatus } from '@/tenant/services/types';

const visitStatuses: VisitStatus[] = ['Scheduled', 'On the Way', 'In Progress', 'Completed', 'Cancelled'];
const selectClass = 'h-9 rounded-sm border border-slate-200 bg-white px-2 text-xs outline-none focus:border-indigo-400';

const FieldServicePage: React.FC = () => {
  const services = useServicesData();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const filtered = useMemo(() => services.visits.filter((visit) => `${visit.requestNumber} ${visit.customer} ${visit.technician} ${visit.serviceType}`.toLowerCase().includes(query.toLowerCase())), [query, services.visits]);

  return (
    <div>
      <PageHeader title="Field Service" description="Dispatch technicians, monitor visit state, materials, signatures, and collections." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Schedule visit</Button>} />
      <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search requests, customers, or technicians" /></div>
      <DataTable headers={['Request', 'Service request', 'Customer & location', 'Technician', 'Visit date/time', 'Service type', 'Status', 'Materials', 'Signature', 'Collected']}>
        {filtered.map((visit) => (
          <tr key={visit.id}>
            <td className="px-4 py-3 font-medium text-indigo-700">{visit.requestNumber}</td>
            <td className="max-w-52 px-4 py-3 font-medium text-slate-950">{visit.serviceRequest}</td>
            <td className="px-4 py-3"><p className="text-slate-700">{visit.customer}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{visit.location}</p></td>
            <td className="px-4 py-3 text-slate-600">{visit.technician}</td>
            <td className="px-4 py-3 whitespace-nowrap text-slate-600">{new Date(visit.visitAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            <td className="px-4 py-3 text-slate-600">{visit.serviceType}</td>
            <td className="px-4 py-3"><select aria-label={`Status for ${visit.requestNumber}`} className={selectClass} value={visit.status} onChange={(event) => services.updateVisitStatus(visit.id, event.target.value as VisitStatus)}>{visitStatuses.map((status) => <option key={status}>{status}</option>)}</select></td>
            <td className="max-w-40 truncate px-4 py-3 text-slate-600">{visit.materialsUsed || 'None'}</td>
            <td className="px-4 py-3"><ServiceStatusBadge status={visit.signatureCaptured ? 'Completed' : 'Pending'} /></td>
            <td className="px-4 py-3 font-medium text-slate-950">{formatINR(visit.paymentCollected)}</td>
          </tr>
        ))}
      </DataTable>
      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Schedule field visit</DialogTitle><DialogDescription>Assign an onsite service request to a technician.</DialogDescription></DialogHeader><FieldVisitForm onSubmit={(draft) => { services.scheduleVisit(draft); setFormOpen(false); }} /></DialogContent></Dialog>
    </div>
  );
};

export default FieldServicePage;
