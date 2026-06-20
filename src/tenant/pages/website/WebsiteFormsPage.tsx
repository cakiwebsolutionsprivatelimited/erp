import React, { useMemo, useState } from 'react';
import { Eye, PlusCircle, TestTube2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { WebsiteFormBuilder } from '@/tenant/website/WebsiteForms';
import { WebsiteStatusBadge } from '@/tenant/website/WebsiteStatusBadge';
import { useWebsiteData } from '@/tenant/website/WebsiteDataProvider';
import type { WebsiteForm, WebsiteFormStatus } from '@/tenant/website/types';

const selectClass = 'h-9 rounded-sm border border-slate-200 bg-white px-2 text-xs outline-none focus:border-indigo-400';

const WebsiteFormsPage: React.FC = () => {
  const website = useWebsiteData();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<WebsiteForm | null>(null);
  const filtered = useMemo(() => website.forms.filter((form) => `${form.name} ${form.submitAction} ${form.fields.map((field) => field.label).join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query, website.forms]);

  return (
    <div>
      <PageHeader title="Forms" description="Build lead capture forms, required fields, submit actions, and CRM lead mapping." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Create form</Button>} />
      <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search forms, fields, or actions" /></div>
      <DataTable headers={['Form name', 'Fields list', 'Required fields', 'Submit action', 'CRM lead mapping', 'Status', 'Submissions', 'Actions']}>
        {filtered.map((form) => (
          <tr key={form.id}>
            <td className="px-4 py-3 font-medium text-slate-950">{form.name}</td>
            <td className="max-w-64 truncate px-4 py-3 text-slate-600">{form.fields.map((field) => field.label).join(', ')}</td>
            <td className="max-w-60 truncate px-4 py-3 text-slate-600">{form.requiredFields.join(', ') || '-'}</td>
            <td className="px-4 py-3 text-slate-600">{form.submitAction}</td>
            <td className="max-w-64 truncate px-4 py-3 text-slate-600">{form.crmLeadMapping.visitorNameField} / {form.crmLeadMapping.phoneField} / {form.crmLeadMapping.emailField}</td>
            <td className="px-4 py-3"><WebsiteStatusBadge status={form.status} /></td>
            <td className="px-4 py-3 text-slate-600">{form.submissionsCount}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <select aria-label={`Status for ${form.name}`} className={selectClass} value={form.status} onChange={(event) => website.updateFormStatus(form.id, event.target.value as WebsiteFormStatus)}>{['Active', 'Draft', 'Paused'].map((status) => <option key={status}>{status}</option>)}</select>
                <Button size="icon" variant="ghost" title="Add sample submission" onClick={() => website.addSampleSubmission(form.id)}><TestTube2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" title="View form" onClick={() => setSelected(form)}><Eye className="h-4 w-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-4xl"><DialogHeader><DialogTitle>Create form</DialogTitle><DialogDescription>Add fields, required rules, submit action, and CRM mapping.</DialogDescription></DialogHeader><WebsiteFormBuilder onSubmit={(draft) => { website.createForm(draft); setFormOpen(false); }} /></DialogContent></Dialog>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="sm:max-w-3xl">{selected && <FormDetail form={website.forms.find((form) => form.id === selected.id) || selected} />}</DialogContent></Dialog>
    </div>
  );
};

const FormDetail: React.FC<{ form: WebsiteForm }> = ({ form }) => (
  <>
    <DialogHeader><div className="flex items-center gap-2"><DialogTitle>{form.name}</DialogTitle><WebsiteStatusBadge status={form.status} /></div><DialogDescription>{form.submitAction} · updated {form.lastUpdated}</DialogDescription></DialogHeader>
    <div className="grid gap-3 sm:grid-cols-2">
      <Detail label="Required fields" value={form.requiredFields.join(', ') || '-'} />
      <Detail label="Submissions" value={String(form.submissionsCount)} />
      <Detail label="CRM mapping" value={`Name: ${form.crmLeadMapping.visitorNameField}, Phone: ${form.crmLeadMapping.phoneField}, Email: ${form.crmLeadMapping.emailField}, Requirement: ${form.crmLeadMapping.requirementField}`} className="sm:col-span-2" />
    </div>
    <div className="rounded-md border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-950">Builder fields</h3>
      <div className="mt-3 grid gap-2">
        {form.fields.map((field) => (
          <div key={field.id} className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <span className="font-medium text-slate-800">{field.label}</span>
            <span className="text-slate-500">{field.type}{field.required ? ' · required' : ''}</span>
          </div>
        ))}
      </div>
    </div>
  </>
);

const Detail: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => <div className={`rounded-sm border border-slate-200 bg-slate-50 p-3 ${className || ''}`}><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-800">{value}</p></div>;

export default WebsiteFormsPage;
