import React from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, IndianRupee, MapPinned } from 'lucide-react';
import { PageHeader, StatCard, formatINR } from '@/tenant/components/TenantUI';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';
import { SERVICE_TEAM, getTechnicianWorkload, getWorkOrderRevenue, isSlaBreached } from '@/tenant/services/servicesDemoService';

const ServicesReportsPage: React.FC = () => {
  const services = useServicesData();
  const completedTasks = services.tasks.filter((task) => task.status === 'Done').length;
  const slaBreaches = services.tickets.filter(isSlaBreached).length;
  const workload = getTechnicianWorkload(services.visits);

  return (
    <div>
      <PageHeader title="Service Reports" description="Project progress, task performance, ticket SLA, technician visits, and work-order revenue." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Average project progress" value={`${Math.round(services.projects.reduce((sum, project) => sum + project.progress, 0) / services.projects.length)}%`} icon={<BarChart3 className="h-4 w-4" />} />
        <StatCard label="Task completion" value={`${Math.round((completedTasks / services.tasks.length) * 100)}%`} hint={`${completedTasks} tasks done`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="SLA breaches" value={String(slaBreaches)} hint={`${services.tickets.length} tickets reviewed`} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Technician visits" value={String(services.visits.filter((visit) => visit.status !== 'Cancelled').length)} icon={<MapPinned className="h-4 w-4" />} />
        <StatCard label="Work-order revenue" value={formatINR(getWorkOrderRevenue(services.workOrders))} icon={<IndianRupee className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ReportPanel title="Project progress">
          {services.projects.map((project) => <ReportBar key={project.id} label={project.name} value={`${project.progress}%`} percent={project.progress} tone={project.status === 'At Risk' ? 'bg-red-500' : 'bg-indigo-600'} />)}
        </ReportPanel>
        <ReportPanel title="Task performance by owner">
          {SERVICE_TEAM.map((owner) => {
            const ownerTasks = services.tasks.filter((task) => task.assignedTo === owner);
            const done = ownerTasks.filter((task) => task.status === 'Done').length;
            return <ReportBar key={owner} label={owner} value={`${done}/${ownerTasks.length}`} percent={ownerTasks.length ? (done / ownerTasks.length) * 100 : 0} tone="bg-emerald-600" />;
          })}
        </ReportPanel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ReportPanel title="Ticket SLA">
          {['Urgent', 'High', 'Medium', 'Low'].map((priority) => {
            const total = services.tickets.filter((ticket) => ticket.priority === priority).length;
            const breached = services.tickets.filter((ticket) => ticket.priority === priority && isSlaBreached(ticket)).length;
            return <ReportBar key={priority} label={`${priority} priority`} value={`${breached} breached`} percent={total ? (breached / total) * 100 : 0} tone={breached ? 'bg-red-500' : 'bg-emerald-600'} />;
          })}
        </ReportPanel>
        <ReportPanel title="Technician visits">
          {workload.map((item) => <ReportBar key={item.technician} label={item.technician} value={`${item.count} visits`} percent={(item.count / Math.max(...workload.map((entry) => entry.count), 1)) * 100} tone="bg-cyan-600" />)}
        </ReportPanel>
      </section>

      <section className="mt-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-indigo-700" /><h2 className="font-semibold text-slate-950">Work-order revenue trend</h2></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{services.workOrders.filter((order) => order.status === 'Completed').map((order) => <div key={order.id} className="rounded-sm bg-slate-50 p-3"><p className="text-xs text-slate-500">{order.number}</p><p className="mt-1 font-semibold text-slate-950">{formatINR(order.charges)}</p><p className="mt-1 truncate text-xs text-slate-500">{order.customer}</p></div>)}</div>
      </section>
    </div>
  );
};

const ReportPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold text-slate-950">{title}</h2><div className="mt-4 space-y-4">{children}</div></div>;
const ReportBar: React.FC<{ label: string; value: string; percent: number; tone: string }> = ({ label, value, percent, tone }) => <div><div className="flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{label}</span><span className="shrink-0 text-slate-500">{value}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.max(3, Math.min(100, percent))}%` }} /></div></div>;

export default ServicesReportsPage;
