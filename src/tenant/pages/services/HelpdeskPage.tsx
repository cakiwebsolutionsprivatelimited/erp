import React, { useMemo, useState } from 'react';
import { Eye, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { TicketForm } from '@/tenant/services/ServiceForms';
import { ServiceStatusBadge } from '@/tenant/services/ServiceStatusBadge';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';
import { SERVICE_TEAM, isSlaBreached } from '@/tenant/services/servicesDemoService';
import type { HelpdeskTicket, TicketStatus } from '@/tenant/services/types';

const selectClass = 'h-9 rounded-sm border border-slate-200 bg-white px-2 text-xs outline-none focus:border-indigo-400';
const ticketStatuses: TicketStatus[] = ['Open', 'Assigned', 'In Progress', 'Waiting Customer', 'Resolved', 'Closed'];

const HelpdeskPage: React.FC = () => {
  const services = useServicesData();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const filtered = useMemo(() => services.tickets.filter((ticket) => {
    const matchesQuery = `${ticket.number} ${ticket.customer} ${ticket.subject} ${ticket.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'All' || ticket.status === status);
  }), [query, services.tickets, status]);

  return (
    <div>
      <PageHeader title="Helpdesk Tickets" description="Manage customer issues, SLA commitments, ownership, and resolution state." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Create ticket</Button>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row"><div className="w-full max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search tickets, customers, or categories" /></div><select className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{ticketStatuses.map((item) => <option key={item}>{item}</option>)}</select></div>
      <DataTable headers={['Ticket ID', 'Customer', 'Subject', 'Category', 'Priority', 'Assigned to', 'Status', 'Created', 'SLA', '']}>
        {filtered.map((ticket) => (
          <tr key={ticket.id}>
            <td className="px-4 py-3 font-medium text-indigo-700">{ticket.number}</td>
            <td className="px-4 py-3 text-slate-600">{ticket.customer}</td>
            <td className="max-w-64 truncate px-4 py-3 font-medium text-slate-950">{ticket.subject}</td>
            <td className="px-4 py-3 text-slate-600">{ticket.category}</td>
            <td className="px-4 py-3"><ServiceStatusBadge status={ticket.priority} /></td>
            <td className="px-4 py-3"><select aria-label={`Assign ${ticket.number}`} className={selectClass} value={ticket.assignedTo} onChange={(event) => services.assignTicket(ticket.id, event.target.value)}><option>Unassigned</option>{SERVICE_TEAM.map((name) => <option key={name}>{name}</option>)}</select></td>
            <td className="px-4 py-3"><select aria-label={`Status for ${ticket.number}`} className={selectClass} value={ticket.status} onChange={(event) => services.updateTicketStatus(ticket.id, event.target.value as TicketStatus)}>{ticketStatuses.map((item) => <option key={item}>{item}</option>)}</select></td>
            <td className="px-4 py-3 text-slate-600">{new Date(ticket.createdDate).toLocaleDateString('en-IN')}</td>
            <td className="px-4 py-3">{isSlaBreached(ticket) ? <span className="text-xs font-semibold text-red-600">Breached</span> : <span className="text-xs font-medium text-emerald-600">On track</span>}</td>
            <td className="px-4 py-3"><Button size="icon" variant="ghost" title="View ticket" onClick={() => setSelectedTicket(ticket)}><Eye className="h-4 w-4" /></Button></td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Create ticket</DialogTitle><DialogDescription>Capture a customer issue and start its SLA clock.</DialogDescription></DialogHeader><TicketForm onSubmit={(draft) => { services.createTicket(draft); setFormOpen(false); }} /></DialogContent></Dialog>
      <Dialog open={Boolean(selectedTicket)} onOpenChange={(open) => !open && setSelectedTicket(null)}><DialogContent className="sm:max-w-3xl">{selectedTicket && <TicketDetail ticket={services.tickets.find((item) => item.id === selectedTicket.id) || selectedTicket} />}</DialogContent></Dialog>
    </div>
  );
};

const TicketDetail: React.FC<{ ticket: HelpdeskTicket }> = ({ ticket }) => (
  <>
    <DialogHeader><div className="flex items-center gap-2"><DialogTitle>{ticket.number}</DialogTitle><ServiceStatusBadge status={ticket.status} /></div><DialogDescription>{ticket.subject} · {ticket.customer}</DialogDescription></DialogHeader>
    <Tabs defaultValue="conversation">
      <TabsList className="w-full justify-start overflow-x-auto"><TabsTrigger value="conversation">Conversation</TabsTrigger><TabsTrigger value="notes">Internal notes</TabsTrigger><TabsTrigger value="customer">Customer details</TabsTrigger><TabsTrigger value="work-order">Related work order</TabsTrigger><TabsTrigger value="attachments">Attachments</TabsTrigger></TabsList>
      <TabsContent value="conversation" className="mt-4 space-y-3"><div className="rounded-sm border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{ticket.description}</div>{ticket.messages.filter((message) => !message.internal).map((message) => <div key={message.id} className="rounded-sm border border-slate-200 p-3"><div className="flex justify-between gap-3 text-xs text-slate-500"><span className="font-semibold text-slate-700">{message.author}</span><span>{new Date(message.timestamp).toLocaleString('en-IN')}</span></div><p className="mt-2 text-sm text-slate-600">{message.body}</p></div>)}</TabsContent>
      <TabsContent value="notes" className="mt-4 rounded-md border border-slate-200 p-4 text-sm text-slate-600">Assigned to {ticket.assignedTo}. Internal notes remain private to the service team.</TabsContent>
      <TabsContent value="customer" className="mt-4 grid gap-3 sm:grid-cols-2"><Detail label="Customer" value={ticket.customer} /><Detail label="Email" value={ticket.customerEmail} /><Detail label="Phone" value={ticket.customerPhone} /><Detail label="Category" value={ticket.category} /></TabsContent>
      <TabsContent value="work-order" className="mt-4 rounded-md border border-slate-200 p-4 text-sm text-slate-600">{ticket.relatedWorkOrderId || 'No work order linked yet.'}</TabsContent>
      <TabsContent value="attachments" className="mt-4 rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Attachments placeholder</TabsContent>
    </Tabs>
  </>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="rounded-sm border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-800">{value}</p></div>;

export default HelpdeskPage;
