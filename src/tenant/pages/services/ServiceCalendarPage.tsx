import React from 'react';
import { CalendarDays, ClipboardCheck, FolderKanban, MapPin } from 'lucide-react';
import { PageHeader } from '@/tenant/components/TenantUI';
import { ServiceStatusBadge } from '@/tenant/services/ServiceStatusBadge';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';

const ServiceCalendarPage: React.FC = () => {
  const services = useServicesData();
  const events = [
    ...services.tasks.map((task) => ({ id: `task-${task.id}`, date: task.dueDate, title: task.title, meta: `${task.projectName} · ${task.assignedTo}`, type: 'Task', status: task.status })),
    ...services.visits.map((visit) => ({ id: `visit-${visit.id}`, date: visit.visitAt.slice(0, 10), title: visit.serviceRequest, meta: `${visit.customer} · ${visit.technician}`, type: 'Visit', status: visit.status })),
    ...services.projects.map((project) => ({ id: `project-${project.id}`, date: project.deadline, title: project.name, meta: `${project.customer} · Project deadline`, type: 'Deadline', status: project.status })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <PageHeader title="Service Calendar" description="A unified schedule of task due dates, field visits, and project deadlines." />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => <article key={event.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-sm bg-indigo-50 text-indigo-700">{event.type === 'Visit' ? <MapPin className="h-4 w-4" /> : event.type === 'Task' ? <ClipboardCheck className="h-4 w-4" /> : <FolderKanban className="h-4 w-4" />}</span><ServiceStatusBadge status={event.status} /></div><p className="mt-4 text-xs font-semibold uppercase text-slate-500">{event.type}</p><h2 className="mt-1 font-semibold text-slate-950">{event.title}</h2><p className="mt-1 text-sm text-slate-500">{event.meta}</p><p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700"><CalendarDays className="h-4 w-4" />{new Date(`${event.date}T12:00:00`).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p></article>)}
      </div>
    </div>
  );
};

export default ServiceCalendarPage;
