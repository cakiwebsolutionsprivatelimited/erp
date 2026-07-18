import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SERVICE_TEAM, TECHNICIANS } from '@/tenant/services/servicesDemoService';
import type { FieldVisitDraft, ProjectDraft, ServiceProject, TaskDraft, TicketDraft } from '@/tenant/services/types';

const selectClass = 'flex h-10 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <Label className={`block ${className || ''}`}>
    <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
    {children}
  </Label>
);

export const ProjectForm: React.FC<{ onSubmit: (draft: ProjectDraft) => void }> = ({ onSubmit }) => {
  const [draft, setDraft] = useState<ProjectDraft>({ name: '', customer: '', manager: SERVICE_TEAM[0], startDate: '2026-06-18', deadline: '2026-08-31', status: 'Active', summary: '', budget: 0, notes: '' });
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Project name"><Input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field>
      <Field label="Customer"><Input required value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} /></Field>
      <Field label="Manager"><select className={selectClass} value={draft.manager} onChange={(event) => setDraft({ ...draft, manager: event.target.value })}>{SERVICE_TEAM.map((name) => <option key={name}>{name}</option>)}</select></Field>
      <Field label="Status"><select className={selectClass} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ProjectDraft['status'] })}>{['Planned', 'Active', 'At Risk', 'On Hold'].map((status) => <option key={status}>{status}</option>)}</select></Field>
      <Field label="Start date"><Input type="date" required value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} /></Field>
      <Field label="Deadline"><Input type="date" required value={draft.deadline} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} /></Field>
      <Field label="Budget"><Input type="number" min="0" value={draft.budget} onChange={(event) => setDraft({ ...draft, budget: Number(event.target.value) })} /></Field>
      <Field label="Delivery note"><Input value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></Field>
      <Field label="Summary" className="sm:col-span-2"><Textarea required value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Create project</Button></div>
    </form>
  );
};

export const TaskForm: React.FC<{ projects: ServiceProject[]; onSubmit: (draft: TaskDraft) => void }> = ({ projects, onSubmit }) => {
  const [draft, setDraft] = useState<TaskDraft>({ title: '', projectId: projects[0]?.id || '', assignedTo: SERVICE_TEAM[0], priority: 'Medium', dueDate: '2026-06-25', description: '', checklist: [], status: 'To Do' });
  const [checklist, setChecklist] = useState('');
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...draft, checklist: checklist.split(',').map((item) => item.trim()) }); }}>
      <Field label="Task title" className="sm:col-span-2"><Input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></Field>
      <Field label="Project"><select required className={selectClass} value={draft.projectId} onChange={(event) => setDraft({ ...draft, projectId: event.target.value })}>{projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></Field>
      <Field label="Assigned to"><select className={selectClass} value={draft.assignedTo} onChange={(event) => setDraft({ ...draft, assignedTo: event.target.value })}>{SERVICE_TEAM.map((name) => <option key={name}>{name}</option>)}</select></Field>
      <Field label="Priority"><select className={selectClass} value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as TaskDraft['priority'] })}>{['Low', 'Medium', 'High', 'Urgent'].map((priority) => <option key={priority}>{priority}</option>)}</select></Field>
      <Field label="Due date"><Input required type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} /></Field>
      <Field label="Description" className="sm:col-span-2"><Textarea required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></Field>
      <Field label="Checklist items, comma separated" className="sm:col-span-2"><Input value={checklist} onChange={(event) => setChecklist(event.target.value)} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Create task</Button></div>
    </form>
  );
};

export const TicketForm: React.FC<{ onSubmit: (draft: TicketDraft) => void }> = ({ onSubmit }) => {
  const [draft, setDraft] = useState<TicketDraft>({ customer: '', customerEmail: '', customerPhone: '', subject: '', category: 'Technical', priority: 'Medium', description: '' });
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Customer"><Input required value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} /></Field>
      <Field label="Category"><select className={selectClass} value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{['Technical', 'Hardware', 'Billing', 'Configuration', 'Report', 'Field Service'].map((category) => <option key={category}>{category}</option>)}</select></Field>
      <Field label="Email"><Input type="email" required value={draft.customerEmail} onChange={(event) => setDraft({ ...draft, customerEmail: event.target.value })} /></Field>
      <Field label="Phone"><Input required value={draft.customerPhone} onChange={(event) => setDraft({ ...draft, customerPhone: event.target.value })} /></Field>
      <Field label="Subject" className="sm:col-span-2"><Input required value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} /></Field>
      <Field label="Priority"><select className={selectClass} value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as TicketDraft['priority'] })}>{['Low', 'Medium', 'High', 'Urgent'].map((priority) => <option key={priority}>{priority}</option>)}</select></Field>
      <Field label="Description" className="sm:col-span-2"><Textarea required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Create ticket</Button></div>
    </form>
  );
};

export const FieldVisitForm: React.FC<{ onSubmit: (draft: FieldVisitDraft) => void }> = ({ onSubmit }) => {
  const [draft, setDraft] = useState<FieldVisitDraft>({ serviceRequest: '', customer: '', location: '', technician: TECHNICIANS[0], visitAt: '2026-06-20T10:00', serviceType: 'Maintenance', notes: '' });
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Service request" className="sm:col-span-2"><Input required value={draft.serviceRequest} onChange={(event) => setDraft({ ...draft, serviceRequest: event.target.value })} /></Field>
      <Field label="Customer"><Input required value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} /></Field>
      <Field label="Technician"><select className={selectClass} value={draft.technician} onChange={(event) => setDraft({ ...draft, technician: event.target.value })}>{TECHNICIANS.map((name) => <option key={name}>{name}</option>)}</select></Field>
      <Field label="Visit date and time"><Input type="datetime-local" required value={draft.visitAt} onChange={(event) => setDraft({ ...draft, visitAt: event.target.value })} /></Field>
      <Field label="Service type"><select className={selectClass} value={draft.serviceType} onChange={(event) => setDraft({ ...draft, serviceType: event.target.value })}>{['Maintenance', 'Installation', 'Hardware Repair', 'Preventive Maintenance', 'Training'].map((type) => <option key={type}>{type}</option>)}</select></Field>
      <Field label="Location" className="sm:col-span-2"><Input required value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></Field>
      <Field label="Visit notes" className="sm:col-span-2"><Textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Schedule visit</Button></div>
    </form>
  );
};
