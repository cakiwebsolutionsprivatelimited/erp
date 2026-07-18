import React, { useMemo, useState } from 'react';
import { CalendarDays, ListChecks, PlusCircle, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { TaskForm } from '@/tenant/services/ServiceForms';
import { ServiceStatusBadge } from '@/tenant/services/ServiceStatusBadge';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';
import { TASK_STATUSES, isTaskOverdue } from '@/tenant/services/servicesDemoService';
import type { TaskStatus } from '@/tenant/services/types';

const TasksPage: React.FC = () => {
  const services = useServicesData();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const filtered = useMemo(() => services.tasks.filter((task) => `${task.title} ${task.projectName} ${task.assignedTo}`.toLowerCase().includes(query.toLowerCase())), [query, services.tasks]);

  const moveTask = (event: React.DragEvent, status: TaskStatus) => {
    const taskId = event.dataTransfer.getData('taskId');
    if (taskId) services.updateTaskStatus(taskId, status);
  };

  return (
    <div>
      <PageHeader title="Tasks" description="Move work through To Do, In Progress, Review, Done, and Blocked." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Create task</Button>} />
      <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search tasks, projects, or assignees" /></div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {TASK_STATUSES.map((status) => {
          const tasks = filtered.filter((task) => task.status === status);
          return (
            <section key={status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => moveTask(event, status)} className="min-h-[580px] w-72 shrink-0 rounded-md border border-slate-200 bg-slate-100/70 p-3">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-800">{status}</h2><Badge variant="secondary">{tasks.length}</Badge></div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <article key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData('taskId', task.id)} className="cursor-grab rounded-md border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-200 hover:shadow active:cursor-grabbing">
                    <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold text-slate-950">{task.title}</h3><ServiceStatusBadge status={task.priority} /></div>
                    <p className="mt-2 text-xs font-medium text-indigo-700">{task.projectName}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>
                    <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <p className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5" />{task.assignedTo}</p>
                      <p className={`flex items-center gap-2 ${isTaskOverdue(task) ? 'font-medium text-red-600' : ''}`}><CalendarDays className="h-3.5 w-3.5" />{task.dueDate}</p>
                      {task.checklist.length > 0 && <p className="flex items-center gap-2"><ListChecks className="h-3.5 w-3.5" />{task.checklist.filter((item) => item.done).length}/{task.checklist.length} checklist</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Create task</DialogTitle><DialogDescription>Add project work and assign its initial owner.</DialogDescription></DialogHeader><TaskForm projects={services.projects} onSubmit={(draft) => { services.createTask(draft); setFormOpen(false); }} /></DialogContent></Dialog>
    </div>
  );
};

export default TasksPage;
