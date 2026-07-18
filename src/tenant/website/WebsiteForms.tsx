import React, { useMemo, useState } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WEBSITE_FIELD_TYPES } from '@/tenant/website/websiteDemoService';
import type {
  LandingPageDraft,
  WebsiteFieldType,
  WebsiteForm,
  WebsiteFormDraft,
  WebsiteFormField,
  WebsitePageDraft,
  WebsiteSubmissionDraft,
} from '@/tenant/website/types';

const selectClass = 'flex h-10 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';
const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>
);

export const WebsitePageForm: React.FC<{ onSubmit: (draft: WebsitePageDraft) => void }> = ({ onSubmit }) => {
  const [sectionsText, setSectionsText] = useState('Hero\nModule grid\nCustomer proof\nContact form');
  const [draft, setDraft] = useState<Omit<WebsitePageDraft, 'sections'>>({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    status: 'Draft',
  });

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => {
      event.preventDefault();
      onSubmit({ ...draft, sections: sectionsText.split('\n').map((section) => section.trim()).filter(Boolean) });
    }}>
      <Field label="Title"><Input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></Field>
      <Field label="Slug"><Input required placeholder="/page-slug" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} /></Field>
      <Field label="Meta title" className="sm:col-span-2"><Input required value={draft.metaTitle} onChange={(event) => setDraft({ ...draft, metaTitle: event.target.value })} /></Field>
      <Field label="Meta description" className="sm:col-span-2"><Textarea required value={draft.metaDescription} onChange={(event) => setDraft({ ...draft, metaDescription: event.target.value })} /></Field>
      <Field label="Page sections" className="sm:col-span-2"><Textarea rows={5} value={sectionsText} onChange={(event) => setSectionsText(event.target.value)} /></Field>
      <Field label="Publish status"><select className={selectClass} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as WebsitePageDraft['status'] })}><option>Draft</option><option>Published</option></select></Field>
      <div className="flex items-end justify-end sm:col-span-2"><Button type="submit">Create page</Button></div>
    </form>
  );
};

export const LandingPageForm: React.FC<{ forms: WebsiteForm[]; onSubmit: (draft: LandingPageDraft) => void }> = ({ forms, onSubmit }) => {
  const [draft, setDraft] = useState<LandingPageDraft>({
    name: '',
    campaign: '',
    slug: '',
    heroTitle: '',
    ctaButton: 'Book free demo',
    formId: forms[0]?.id || '',
    status: 'Draft',
  });

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Landing page name"><Input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field>
      <Field label="Campaign"><Input required value={draft.campaign} onChange={(event) => setDraft({ ...draft, campaign: event.target.value })} /></Field>
      <Field label="URL slug"><Input required placeholder="/lp/campaign-name" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} /></Field>
      <Field label="CTA button"><Input required value={draft.ctaButton} onChange={(event) => setDraft({ ...draft, ctaButton: event.target.value })} /></Field>
      <Field label="Hero title" className="sm:col-span-2"><Textarea required value={draft.heroTitle} onChange={(event) => setDraft({ ...draft, heroTitle: event.target.value })} /></Field>
      <Field label="Form attached"><select className={selectClass} value={draft.formId} onChange={(event) => setDraft({ ...draft, formId: event.target.value })}>{forms.map((form) => <option key={form.id} value={form.id}>{form.name}</option>)}</select></Field>
      <Field label="Status"><select className={selectClass} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as LandingPageDraft['status'] })}>{['Draft', 'Published', 'Paused', 'Archived'].map((status) => <option key={status}>{status}</option>)}</select></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Create landing page</Button></div>
    </form>
  );
};

const createField = (index: number): WebsiteFormField => ({
  id: `field-${Date.now()}-${index}`,
  label: '',
  type: 'Text',
  required: false,
});

export const WebsiteFormBuilder: React.FC<{ onSubmit: (draft: WebsiteFormDraft) => void }> = ({ onSubmit }) => {
  const [draft, setDraft] = useState<WebsiteFormDraft>({
    name: '',
    fields: [
      { id: 'new-name', label: 'Visitor Name', type: 'Text', required: true },
      { id: 'new-phone', label: 'Phone', type: 'Phone', required: true },
      { id: 'new-email', label: 'Email', type: 'Email', required: true },
      { id: 'new-requirement', label: 'Requirement', type: 'Textarea', required: true },
    ],
    submitAction: 'Create CRM Lead',
    crmLeadMapping: {
      visitorNameField: 'Visitor Name',
      phoneField: 'Phone',
      emailField: 'Email',
      requirementField: 'Requirement',
    },
    status: 'Active',
  });

  const fieldLabels = useMemo(() => draft.fields.map((field) => field.label).filter(Boolean), [draft.fields]);
  const updateField = (id: string, patch: Partial<WebsiteFormField>) => setDraft({ ...draft, fields: draft.fields.map((field) => field.id === id ? { ...field, ...patch } : field) });
  const removeField = (id: string) => setDraft({ ...draft, fields: draft.fields.filter((field) => field.id !== id) });

  return (
    <form className="max-h-[72vh] space-y-4 overflow-y-auto pr-1" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Form name"><Input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field>
        <Field label="Status"><select className={selectClass} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as WebsiteFormDraft['status'] })}>{['Active', 'Draft', 'Paused'].map((status) => <option key={status}>{status}</option>)}</select></Field>
        <Field label="Submit action"><select className={selectClass} value={draft.submitAction} onChange={(event) => setDraft({ ...draft, submitAction: event.target.value as WebsiteFormDraft['submitAction'] })}>{['Create CRM Lead', 'Email Notification', 'Save Submission'].map((action) => <option key={action}>{action}</option>)}</select></Field>
      </div>

      <fieldset className="rounded-md border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-800">Fields list</legend>
        <div className="space-y-3">
          {draft.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1.3fr_0.9fr_auto_auto] sm:items-end">
              <Field label={`Field ${index + 1}`}><Input required value={field.label} onChange={(event) => updateField(field.id, { label: event.target.value })} /></Field>
              <Field label="Type"><select className={selectClass} value={field.type} onChange={(event) => updateField(field.id, { type: event.target.value as WebsiteFieldType })}>{WEBSITE_FIELD_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
              <Label className="flex h-10 items-center gap-2 text-sm font-medium text-slate-700"><Checkbox checked={field.required} onCheckedChange={(checked) => updateField(field.id, { required: Boolean(checked) })} />Required</Label>
              <Button type="button" variant="ghost" size="icon" title="Remove field" disabled={draft.fields.length <= 1} onClick={() => removeField(field.id)}><MinusCircle className="h-4 w-4" /></Button>
              {field.type === 'Select' && <Field label="Select options" className="sm:col-span-4"><Input placeholder="Option A, Option B" value={(field.options || []).join(', ')} onChange={(event) => updateField(field.id, { options: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} /></Field>}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" className="mt-3" onClick={() => setDraft({ ...draft, fields: [...draft.fields, createField(draft.fields.length + 1)] })}><PlusCircle className="h-4 w-4" />Add field</Button>
      </fieldset>

      <fieldset className="grid gap-4 rounded-md border border-slate-200 p-4 sm:grid-cols-2">
        <legend className="px-2 text-sm font-semibold text-slate-800">CRM lead mapping</legend>
        {(['visitorNameField', 'phoneField', 'emailField', 'requirementField'] as const).map((key) => (
          <Field key={key} label={key === 'visitorNameField' ? 'Visitor name' : key === 'phoneField' ? 'Phone' : key === 'emailField' ? 'Email' : 'Requirement'}>
            <select className={selectClass} value={draft.crmLeadMapping[key]} onChange={(event) => setDraft({ ...draft, crmLeadMapping: { ...draft.crmLeadMapping, [key]: event.target.value } })}>
              {fieldLabels.map((label) => <option key={label}>{label}</option>)}
            </select>
          </Field>
        ))}
      </fieldset>

      <div className="flex justify-end"><Button type="submit">Create form</Button></div>
    </form>
  );
};

export const SubmissionCaptureForm: React.FC<{ forms: WebsiteForm[]; onSubmit: (draft: WebsiteSubmissionDraft) => void }> = ({ forms, onSubmit }) => {
  const [draft, setDraft] = useState<WebsiteSubmissionDraft>({
    formId: forms[0]?.id || '',
    visitorName: '',
    phone: '',
    email: '',
    sourcePage: '/',
    values: { Requirement: '' },
  });

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => {
      event.preventDefault();
      onSubmit({
        ...draft,
        values: {
          'Visitor Name': draft.visitorName,
          Phone: draft.phone,
          Email: draft.email,
          Requirement: draft.values.Requirement || 'Website enquiry',
        },
      });
    }}>
      <Field label="Form"><select className={selectClass} value={draft.formId} onChange={(event) => setDraft({ ...draft, formId: event.target.value })}>{forms.map((form) => <option key={form.id} value={form.id}>{form.name}</option>)}</select></Field>
      <Field label="Source page"><Input required value={draft.sourcePage} onChange={(event) => setDraft({ ...draft, sourcePage: event.target.value })} /></Field>
      <Field label="Visitor name"><Input required value={draft.visitorName} onChange={(event) => setDraft({ ...draft, visitorName: event.target.value })} /></Field>
      <Field label="Phone"><Input required value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></Field>
      <Field label="Email"><Input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></Field>
      <Field label="Requirement" className="sm:col-span-2"><Textarea value={draft.values.Requirement || ''} onChange={(event) => setDraft({ ...draft, values: { ...draft.values, Requirement: event.target.value } })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Add submission</Button></div>
    </form>
  );
};
