import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, BriefcaseBusiness, CalendarClock, ClipboardCheck, Headphones, PlusCircle, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { ServiceStatusBadge } from '@/tenant/services/ServiceStatusBadge';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';
import { TASK_STATUSES, getProjectProgress, getServicesMetrics, getTechnicianWorkload } from '@/tenant/services/servicesDemoService';

const ServicesDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const services = useServicesData();
  const metrics = getServicesMetrics(services);
  const projectProgress = getProjectProgress(services.projects);
  const technicianWorkload = getTechnicianWorkload(services.visits);
  const ticketStatuses = ['Open', 'Assigned', 'In Progress', 'Waiting Customer', 'Resolved', 'Closed'];

  return (
    <div>
      <PageHeader
        title="Services Dashboard"
        description="Delivery health across projects, tasks, support queues, and technician visits."
        action={<Button onClick={() => navigate('/services/tasks')}><PlusCircle className="h-4 w-4" />Create task</Button>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <StatCard label="Active projects" value={String(metrics.activeProjects)} hint="Active or at risk" icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <StatCard label="Open tasks" value={String(metrics.openTasks)} hint="Across all projects" icon={<ClipboardCheck className="h-4 w-4" />} />
        <StatCard label="Overdue tasks" value={String(metrics.overdueTasks)} hint="Past due date" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Open tickets" value={String(metrics.openTickets)} hint="Awaiting closure" icon={<Headphones className="h-4 w-4" />} />
        <StatCard label="Visits today" value={String(metrics.visitsToday)} hint="Scheduled or active" icon={<CalendarClock className="h-4 w-4" />} />
        <StatCard label="Work orders done" value={String(metrics.completedWorkOrders)} hint="All-time demo records" icon={<Wrench className="h-4 w-4" />} />
        <StatCard label="SLA breached" value={String(metrics.slaBreached)} hint="Needs attention" icon={<AlertTriangle className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Ticket status">
          {ticketStatuses.map((status) => {
            const count = services.tickets.filter((ticket) => ticket.status === status).length;
            return <Bar key={status} label={status} value={count} percent={(count / Math.max(services.tickets.length, 1)) * 100} tone="bg-indigo-600" />;
          })}
        </ChartPanel>
        <ChartPanel title="Task completion">
          {TASK_STATUSES.map((status) => {
            const count = services.tasks.filter((task) => task.status === status).length;
            return <Bar key={status} label={status} value={count} percent={(count / Math.max(services.tasks.length, 1)) * 100} tone={status === 'Done' ? 'bg-emerald-600' : 'bg-teal-600'} />;
          })}
        </ChartPanel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Technician workload">
          {technicianWorkload.map((item) => <Bar key={item.technician} label={item.technician} value={item.count} percent={(item.count / Math.max(...technicianWorkload.map((entry) => entry.count), 1)) * 100} tone="bg-cyan-600" />)}
        </ChartPanel>
        <ChartPanel title="Project progress">
          {projectProgress.slice(0, 5).map((project) => <Bar key={project.id} label={project.name} value={`${project.progress}%`} percent={project.progress} tone={project.status === 'At Risk' ? 'bg-red-500' : 'bg-violet-600'} />)}
        </ChartPanel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading title="Priority tickets" action={<Button size="sm" variant="outline" onClick={() => navigate('/services/helpdesk')}>View helpdesk</Button>} />
          <DataTable headers={['Ticket', 'Customer', 'Subject', 'Priority', 'Status']}>
            {services.tickets.filter((ticket) => ['High', 'Urgent'].includes(ticket.priority)).slice(0, 5).map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{ticket.number}</td>
                <td className="px-4 py-3 text-slate-600">{ticket.customer}</td>
                <td className="max-w-60 truncate px-4 py-3 font-medium text-slate-950">{ticket.subject}</td>
                <td className="px-4 py-3"><ServiceStatusBadge status={ticket.priority} /></td>
                <td className="px-4 py-3"><ServiceStatusBadge status={ticket.status} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div className="min-w-0">
          <SectionHeading title="Today's field visits" action={<Button size="sm" variant="outline" onClick={() => navigate('/services/field-service')}>Open schedule</Button>} />
          <DataTable headers={['Request', 'Customer', 'Technician', 'Time', 'Status']}>
            {services.visits.filter((visit) => visit.visitAt.startsWith('2026-06-18')).map((visit) => (
              <tr key={visit.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{visit.requestNumber}</td>
                <td className="px-4 py-3 text-slate-600">{visit.customer}</td>
                <td className="px-4 py-3 text-slate-600">{visit.technician}</td>
                <td className="px-4 py-3 text-slate-600">{new Date(visit.visitAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="px-4 py-3"><ServiceStatusBadge status={visit.status} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>
    </div>
  );
};

const ChartPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="font-semibold text-slate-950">{title}</h2>
    <div className="mt-4 space-y-3">{children}</div>
  </div>
);

const Bar: React.FC<{ label: string; value: string | number; percent: number; tone: string }> = ({ label, value, percent, tone }) => (
  <div>
    <div className="flex items-center justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{label}</span><span className="shrink-0 text-slate-500">{value}</span></div>
    <div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.max(4, Math.min(100, percent))}%` }} /></div>
  </div>
);

const SectionHeading: React.FC<{ title: string; action: React.ReactNode }> = ({ title, action }) => (
  <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-semibold text-slate-950">{title}</h2>{action}</div>
);

export default ServicesDashboardPage;
