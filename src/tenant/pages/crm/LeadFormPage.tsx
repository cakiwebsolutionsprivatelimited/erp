import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import {
  campaignOptions,
  captureMethods,
  duplicateRiskOptions,
  getDuplicateRisk,
  getLeadRating,
  getLeadScore,
  getQualification,
  ownerTeams,
  qualificationOptions,
  ratingOptions,
  riskTone,
  scoreTone,
  territories,
} from '@/tenant/crm/crmDemoUtils';
import type { Lead, LeadStage } from '@/tenant/types';

const stages: LeadStage[] = ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];
const sources = ['Website', 'WhatsApp', 'Referral', 'Facebook', 'Google Ads', 'Walk-in', 'Telecalling', 'Existing Customer'];
const priorities = ['Low', 'Medium', 'High'] as const;
const sourceDetails = ['Pricing page', 'Demo form', 'Partner referral', 'Retail campaign', 'Search ad', 'Front desk enquiry', 'Outbound list', 'Support upsell'];
const budgets = ['Under Rs 50,000', 'Rs 50,000 - Rs 1,00,000', 'Rs 1,00,000 - Rs 2,50,000', 'Above Rs 2,50,000'];

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
    sourceDetail: lead?.sourceDetail || 'Demo form',
    captureMethod: lead?.captureMethod || 'Website form',
    campaign: lead?.campaign || 'June Website Enquiries',
    requirement: lead?.requirement || '',
    assignedTo: lead?.assignedTo || users[1]?.name || 'Anita Das',
    ownerTeam: lead?.ownerTeam || 'Inside Sales',
    territory: lead?.territory || 'Bhubaneswar',
    expectedValue: lead?.expectedValue || 50000,
    probability: lead?.probability || 25,
    stage: lead?.stage || 'New' as LeadStage,
    nextFollowUpAt: lead?.nextFollowUpAt?.slice(0, 16) || '2026-06-18T11:00',
    priority: lead?.priority || 'Medium' as 'Low' | 'Medium' | 'High',
    qualificationStatus: lead ? getQualification(lead) : 'Marketing Qualified',
    score: lead ? getLeadScore(lead) : 62,
    rating: lead ? getLeadRating(lead) : 'Warm',
    duplicateRisk: lead ? getDuplicateRisk(lead) : 'Low',
    routingReason: lead?.routingReason || 'Territory match',
    budget: lead?.budget || 'Rs 50,000 - Rs 1,00,000',
    tags: (lead?.tags || []).join(', '),
    existingSystem: lead?.customFields?.['Existing system'] || 'Excel',
    decisionRole: lead?.customFields?.['Decision role'] || 'Owner',
    initialNote: '',
  });

  const duplicateMatches = useMemo(() => {
    const phone = form.phone.trim();
    const email = form.email.trim().toLowerCase();
    const company = form.company.trim().toLowerCase();
    return leads.filter((item) =>
      item.id !== id &&
      ((phone && item.phone === phone) || (email && item.email.toLowerCase() === email) || (company && item.company.toLowerCase() === company))
    );
  }, [form.company, form.email, form.phone, id, leads]);

  const updateField = (field: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      stage: form.stage as LeadStage,
      priority: form.priority as Lead['priority'],
      qualificationStatus: form.qualificationStatus as Lead['qualificationStatus'],
      rating: form.rating as Lead['rating'],
      duplicateRisk: form.duplicateRisk as Lead['duplicateRisk'],
      score: Number(form.score),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      nextFollowUpAt: form.nextFollowUpAt,
      customFields: {
        'Existing system': form.existingSystem,
        'Decision role': form.decisionRole,
      },
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
      <PageHeader title={lead ? 'Edit Lead' : 'Add Lead'} description="Capture, qualify, route, score, and enrich CRM leads using local demo state." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Lead information">
          <Field label="Lead name" value={form.name} onChange={(value) => updateField('name', value)} required />
          <Select label="Lead source" value={form.source} options={sources} onChange={(value) => updateField('source', value)} />
          <Select label="Source detail" value={form.sourceDetail} options={sourceDetails} onChange={(value) => updateField('sourceDetail', value)} />
          <Select label="Capture method" value={form.captureMethod} options={captureMethods} onChange={(value) => updateField('captureMethod', value)} />
          <Select label="Campaign" value={form.campaign} options={campaignOptions} onChange={(value) => updateField('campaign', value)} />
          <Select label="Priority" value={form.priority} options={priorities} onChange={(value) => updateField('priority', value)} />
        </FormSection>

        <FormSection title="Contact information">
          <Field label="Phone" value={form.phone} onChange={(value) => updateField('phone', value)} required />
          <Field label="Alternate phone" value={form.alternatePhone} onChange={(value) => updateField('alternatePhone', value)} />
          <Field label="Email" value={form.email} onChange={(value) => updateField('email', value)} type="email" />
          <Field label="City" value={form.city} onChange={(value) => updateField('city', value)} />
          <Field label="State" value={form.state} onChange={(value) => updateField('state', value)} />
        </FormSection>

        {duplicateMatches.length > 0 ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <div>
                <p className="font-semibold">Possible duplicate found</p>
                <p className="mt-1">{duplicateMatches.slice(0, 2).map((item) => item.name).join(', ')} already match this phone, email, or company.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />No duplicate match in current demo data.</div>
          </div>
        )}

        <FormSection title="Company and qualification">
          <Field label="Company name" value={form.company} onChange={(value) => updateField('company', value)} required />
          <Field label="Industry" value={form.industry} onChange={(value) => updateField('industry', value)} />
          <Select label="Budget" value={form.budget} options={budgets} onChange={(value) => updateField('budget', value)} />
          <Select label="Qualification" value={form.qualificationStatus} options={qualificationOptions} onChange={(value) => updateField('qualificationStatus', value)} />
          <Field label="Existing system" value={form.existingSystem} onChange={(value) => updateField('existingSystem', value)} />
          <Field label="Decision role" value={form.decisionRole} onChange={(value) => updateField('decisionRole', value)} />
          <TextArea label="Requirement" value={form.requirement} onChange={(value) => updateField('requirement', value)} />
        </FormSection>

        <FormSection title="Sales details and assignment">
          <Field label="Expected value" value={String(form.expectedValue)} onChange={(value) => updateField('expectedValue', Number(value))} type="number" />
          <Field label="Probability %" value={String(form.probability)} onChange={(value) => updateField('probability', Number(value))} type="number" />
          <Select label="Stage" value={form.stage} options={stages} onChange={(value) => updateField('stage', value as LeadStage)} />
          <Select label="Assigned user" value={form.assignedTo} options={users.map((user) => user.name)} onChange={(value) => updateField('assignedTo', value)} />
          <Select label="Owner team" value={form.ownerTeam} options={ownerTeams} onChange={(value) => updateField('ownerTeam', value)} />
          <Select label="Territory" value={form.territory} options={territories} onChange={(value) => updateField('territory', value)} />
          <Field label="Routing reason" value={form.routingReason} onChange={(value) => updateField('routingReason', value)} />
          <Field label="Tags" value={form.tags} onChange={(value) => updateField('tags', value)} />
        </FormSection>

        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-slate-950">Score, rating and risk preview</h2>
            <Radar className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Lead score" value={String(form.score)} onChange={(value) => updateField('score', Number(value))} type="number" />
            <Select label="Rating" value={form.rating} options={ratingOptions} onChange={(value) => updateField('rating', value)} />
            <Select label="Duplicate risk" value={form.duplicateRisk} options={duplicateRiskOptions} onChange={(value) => updateField('duplicateRisk', value)} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className={scoreTone(Number(form.score))}>Score {form.score}</Badge>
            <Badge variant="secondary">{form.rating} rating</Badge>
            <Badge className={riskTone(form.duplicateRisk)}>{form.duplicateRisk} duplicate risk</Badge>
          </div>
        </section>

        <FormSection title="Follow-up plan and notes">
          <Field label="Next follow-up date/time" value={form.nextFollowUpAt} onChange={(value) => updateField('nextFollowUpAt', value)} type="datetime-local" />
          {!lead && <TextArea label="Initial note" value={form.initialNote} onChange={(value) => updateField('initialNote', value)} />}
          <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500 xl:col-span-3">Attachments placeholder for proposal files, call notes, and imported lead documents.</div>
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
