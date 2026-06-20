import React, { useMemo, useState } from 'react';
import { Eye, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar, formatINR } from '@/tenant/components/TenantUI';
import { ProjectForm } from '@/tenant/services/ServiceForms';
import { ServiceStatusBadge } from '@/tenant/services/ServiceStatusBadge';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';
import type { ServiceProject } from '@/tenant/services/types';

const ProjectsPage: React.FC = () => {
  const services = useServicesData();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ServiceProject | null>(null);
  const filtered = useMemo(() => services.projects.filter((project) => `${project.name} ${project.customer} ${project.manager}`.toLowerCase().includes(query.toLowerCase())), [query, services.projects]);

  return (
    <div>
      <PageHeader title="Projects" description="Manage delivery ownership, deadlines, progress, milestones, and team capacity." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Create project</Button>} />
      <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search projects, customers, or managers" /></div>
      <DataTable headers={['Project', 'Customer', 'Manager', 'Start date', 'Deadline', 'Progress', 'Status', '']}>
        {filtered.map((project) => (
          <tr key={project.id}>
            <td className="px-4 py-3"><p className="font-medium text-slate-950">{project.name}</p><p className="mt-0.5 text-xs text-slate-500">{formatINR(project.budget)} budget</p></td>
            <td className="px-4 py-3 text-slate-600">{project.customer}</td>
            <td className="px-4 py-3 text-slate-600">{project.manager}</td>
            <td className="px-4 py-3 text-slate-600">{project.startDate}</td>
            <td className="px-4 py-3 text-slate-600">{project.deadline}</td>
            <td className="min-w-40 px-4 py-3"><div className="flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${project.progress}%` }} /></div><span className="w-9 text-xs font-medium text-slate-600">{project.progress}%</span></div></td>
            <td className="px-4 py-3"><ServiceStatusBadge status={project.status} /></td>
            <td className="px-4 py-3"><Button size="icon" variant="ghost" title="View project" onClick={() => setSelectedProject(project)}><Eye className="h-4 w-4" /></Button></td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Create project</DialogTitle><DialogDescription>Add a delivery project to the services workspace.</DialogDescription></DialogHeader><ProjectForm onSubmit={(draft) => { services.createProject(draft); setFormOpen(false); }} /></DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="sm:max-w-3xl">
          {selectedProject && <ProjectDetail project={selectedProject} taskCount={services.tasks.filter((task) => task.projectId === selectedProject.id).length} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProjectDetail: React.FC<{ project: ServiceProject; taskCount: number }> = ({ project, taskCount }) => (
  <>
    <DialogHeader><DialogTitle>{project.name}</DialogTitle><DialogDescription>{project.customer} · Managed by {project.manager}</DialogDescription></DialogHeader>
    <Tabs defaultValue="overview">
      <TabsList className="w-full justify-start overflow-x-auto">
        {['overview', 'tasks', 'milestones', 'team', 'files', 'time', 'notes'].map((tab) => <TabsTrigger key={tab} value={tab} className="capitalize">{tab === 'time' ? 'Time logs' : tab}</TabsTrigger>)}
      </TabsList>
      <TabsContent value="overview" className="mt-4 grid gap-4 sm:grid-cols-2">
        <Detail label="Status"><ServiceStatusBadge status={project.status} /></Detail><Detail label="Progress">{project.progress}%</Detail><Detail label="Timeline">{project.startDate} to {project.deadline}</Detail><Detail label="Budget">{formatINR(project.budget)}</Detail><Detail label="Summary" className="sm:col-span-2">{project.summary}</Detail>
      </TabsContent>
      <TabsContent value="tasks" className="mt-4 rounded-md border border-slate-200 p-4 text-sm text-slate-600">{taskCount} tasks are linked to this project.</TabsContent>
      <TabsContent value="milestones" className="mt-4 space-y-2">{project.milestones.map((milestone) => <div key={milestone} className="rounded-sm border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{milestone}</div>)}</TabsContent>
      <TabsContent value="team" className="mt-4 grid gap-2 sm:grid-cols-2">{project.team.map((member) => <div key={member} className="rounded-sm border border-slate-200 p-3 text-sm font-medium text-slate-700">{member}</div>)}</TabsContent>
      <TabsContent value="files" className="mt-4 rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Project files placeholder</TabsContent>
      <TabsContent value="time" className="mt-4 rounded-md border border-slate-200 p-4 text-sm text-slate-600">{project.timeLogged} team hours logged.</TabsContent>
      <TabsContent value="notes" className="mt-4 rounded-md border border-slate-200 p-4 text-sm text-slate-600">{project.notes}</TabsContent>
    </Tabs>
  </>
);

const Detail: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <div className={`rounded-sm border border-slate-200 bg-slate-50 p-3 ${className || ''}`}><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><div className="mt-1 text-sm font-medium text-slate-800">{children}</div></div>;

export default ProjectsPage;
