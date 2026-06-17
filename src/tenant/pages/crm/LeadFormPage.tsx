import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import type { LeadStage } from '@/tenant/types';

const stages: LeadStage[] = ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];
const sources = ['Website', 'WhatsApp', 'Referral', 'Facebook', 'Google Ads', 'Walk-in', 'Telecalling', 'Existing Customer'];
const priorities = ['Low', 'Medium', 'High'] as const;

const LeadFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, users, addLead, updateLead } = useTenantData();
  const lead = useMemo(() => leads.find((item) => item.id === id), [id, leads]);
  const [form, setForm] = useState({
    name: lead?.name || '',
    company: lead?.company || '',
    industry: lead?.industry || 'Service Business',
    phone: lead?.phone || '',
    alternatePhone: lead?.alternatePhone || '',
    email: lead?.email || '',
    city: lead?.city || 'Bhubaneswar',
    state: lead?.state || 'Odisha',
    source: lead?.source || 'Website',
    requirement: lead?.requirement || '',
    assignedTo: lead?.assignedTo || users[1]?.name || 'Anita Das',
    expectedValue: lead?.expectedValue || 50000,
    probability: lead?.probability || 25,
    stage: lead?.stage || 'New' as LeadStage,
    nextFollowUpAt: lead?.nextFollowUpAt?.slice(0, 16) || '2026-06-18T11:00',
    priority: lead?.priority || 'Medium' as 'Low' | 'Medium' | 'High',
    tags: (lead?.tags || []).join(', '),
    initialNote: '',
  });

  const updateField = (field: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      nextFollowUpAt: form.nextFollowUpAt,
    };
    if (id && lead) {
      updateLead(id, payload);
      navigate(`/crm/leads/${id}`);
      return;
    }
    const newId = addLead(payload);
    navigate(`/crm/leads/${newId}`);
  };

  return (
    <div>
      <PageHeader title={lead ? 'Edit Lead' : 'Add Lead'} description="Grouped CRM form with contact, requirement, sales, assignment, and follow-up sections." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Lead information">
          <Field label="Lead name" value={form.name} onChange={(value) => updateField('name', value)} required />
          <Select label="Lead source" value={form.source} options={sources} onChange={(value) => updateField('source', value)} />
          <Select label="Stage" value={form.stage} options={stages} onChange={(value) => updateField('stage', value as LeadStage)} />
          <Select label="Priority" value={form.priority} options={priorities} onChange={(value) => updateField('priority', value)} />
        </FormSection>

        <FormSection title="Contact information">
          <Field label="Phone" value={form.phone} onChange={(value) => updateField('phone', value)} required />
          <Field label="Alternate phone" value={form.alternatePhone} onChange={(value) => updateField('alternatePhone', value)} />
          <Field label="Email" value={form.email} onChange={(value) => updateField('email', value)} type="email" />
          <Field label="City" value={form.city} onChange={(value) => updateField('city', value)} />
          <Field label="State" value={form.state} onChange={(value) => updateField('state', value)} />
        </FormSection>

        <FormSection title="Company and requirement">
          <Field label="Company name" value={form.company} onChange={(value) => updateField('company', value)} required />
          <Field label="Industry" value={form.industry} onChange={(value) => updateField('industry', value)} />
          <TextArea label="Requirement" value={form.requirement} onChange={(value) => updateField('requirement', value)} />
        </FormSection>

        <FormSection title="Sales details and assignment">
          <Field label="Expected value" value={String(form.expectedValue)} onChange={(value) => updateField('expectedValue', Number(value))} type="number" />
          <Field label="Probability %" value={String(form.probability)} onChange={(value) => updateField('probability', Number(value))} type="number" />
          <Select label="Assigned user" value={form.assignedTo} options={users.map((user) => user.name)} onChange={(value) => updateField('assignedTo', value)} />
          <Field label="Tags" value={form.tags} onChange={(value) => updateField('tags', value)} />
        </FormSection>

        <FormSection title="Follow-up plan and notes">
          <Field label="Next follow-up date/time" value={form.nextFollowUpAt} onChange={(value) => updateField('nextFollowUpAt', value)} type="datetime-local" />
          {!lead && <TextArea label="Initial note" value={form.initialNote} onChange={(value) => updateField('initialNote', value)} />}
        </FormSection>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/crm/leads')}>Cancel</Button>
          <Button type="submit">{lead ? 'Save changes' : 'Create lead'}</Button>
        </div>
      </form>
    </div>
  );
};

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
  </section>
);

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', required }) => (
  <label className="grid gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
  </label>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label className="grid gap-1.5 xl:col-span-2">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-24 rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
  </label>
);

const Select: React.FC<{ label: string; value: string; options: readonly string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

export default LeadFormPage;
