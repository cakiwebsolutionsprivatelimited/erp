import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, Edit, FileUp, PlusCircle, Tags, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatINR, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import {
  duplicateRiskOptions,
  getDuplicateRisk,
  getLeadRating,
  getLeadScore,
  getNextActivity,
  getQualification,
  ratingOptions,
  ratingTone,
  riskTone,
  scoreTone,
} from '@/tenant/crm/crmDemoUtils';
import type { LeadStage } from '@/tenant/types';

const stageOptions: Array<'All' | LeadStage> = ['All', 'New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];
const savedViews = ['All leads', 'My hot leads', 'Needs follow-up', 'Duplicate risk', 'Proposal ready'] as const;

const LeadsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { leads, followUps, users, deleteLead } = useTenantData();
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<'All' | LeadStage>('All');
  const [source, setSource] = useState('All');
  const [owner, setOwner] = useState('All');
  const [rating, setRating] = useState('All');
  const [risk, setRisk] = useState('All');
  const [view, setView] = useState<(typeof savedViews)[number]>('All leads');
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkMessage, setBulkMessage] = useState('');

  const sources = useMemo(() => ['All', ...Array.from(new Set(leads.map((lead) => lead.source)))], [leads]);
  const owners = useMemo(() => ['All', ...Array.from(new Set(users.map((user) => user.name)))], [users]);

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim();
    return leads.filter((lead) => {
      const searchMatch = !query || [
        lead.name,
        lead.company,
        lead.stage,
        lead.source,
        lead.sourceDetail,
        lead.campaign,
        lead.assignedTo,
        lead.ownerTeam,
        lead.phone,
        lead.email,
        lead.requirement,
        getQualification(lead),
      ].join(' ').toLowerCase().includes(query);
      const stageMatch = stage === 'All' || lead.stage === stage;
      const sourceMatch = source === 'All' || lead.source === source;
      const ownerMatch = owner === 'All' || lead.assignedTo === owner;
      const ratingMatch = rating === 'All' || getLeadRating(lead) === rating;
      const riskMatch = risk === 'All' || getDuplicateRisk(lead) === risk;
      const viewMatch =
        view === 'All leads' ||
        (view === 'My hot leads' && getLeadRating(lead) === 'Hot') ||
        (view === 'Needs follow-up' && lead.nextFollowUpAt.slice(0, 10) <= '2026-06-17') ||
        (view === 'Duplicate risk' && getDuplicateRisk(lead) !== 'Low') ||
        (view === 'Proposal ready' && getQualification(lead) === 'Proposal Ready');
      return searchMatch && stageMatch && sourceMatch && ownerMatch && ratingMatch && riskMatch && viewMatch;
    });
  }, [leads, owner, rating, risk, search, source, stage, view]);

  const toggleSelected = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const runBulkPreview = (label: string) => {
    setBulkMessage(`${label} preview ready for ${selected.length} selected lead${selected.length === 1 ? '' : 's'}.`);
  };

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Score, qualify, route, filter, and work CRM leads from local demo data."
        action={<Button onClick={() => navigate('/crm/leads/new')}><PlusCircle className="h-4 w-4" />Add Lead</Button>}
      />

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {savedViews.map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium ${view === item ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-3 xl:grid-cols-[1fr_repeat(5,160px)]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search lead, phone, campaign, source, requirement..." />
          <Select label="Stage" value={stage} options={stageOptions} onChange={(value) => setStage(value as typeof stage)} />
          <Select label="Source" value={source} options={sources} onChange={setSource} />
          <Select label="Owner" value={owner} options={owners} onChange={setOwner} />
          <Select label="Rating" value={rating} options={['All', ...ratingOptions]} onChange={setRating} />
          <Select label="Dup risk" value={risk} options={['All', ...duplicateRiskOptions]} onChange={setRisk} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm"><FileUp className="h-3.5 w-3.5" />Import</Button>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Export</Button>
            <Button variant="outline" size="sm" disabled={!selected.length} onClick={() => runBulkPreview('Assign user')}><UserPlus className="h-3.5 w-3.5" />Assign</Button>
            <Button variant="outline" size="sm" disabled={!selected.length} onClick={() => runBulkPreview('Change stage')}>Change stage</Button>
            <Button variant="outline" size="sm" disabled={!selected.length} onClick={() => runBulkPreview('Add tag')}><Tags className="h-3.5 w-3.5" />Add tag</Button>
            <Button variant="destructive" size="sm" disabled={!selected.length} onClick={() => runBulkPreview('Delete')}>Delete selected</Button>
          </div>
          <p className="text-sm text-slate-500">{filteredLeads.length} leads · {selected.length} selected</p>
        </div>
        {bulkMessage && (
          <div className="mt-3 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-800">
            {bulkMessage} This is a UI-only bulk action preview.
          </div>
        )}
      </section>

      <DataTable headers={['', 'Lead', 'Score', 'Rating', 'Qualification', 'Duplicate', 'Campaign/source', 'Owner/team', 'Next activity', 'Value', 'Stage', 'Actions']}>
        {filteredLeads.map((lead) => (
          <tr key={lead.id}>
            <td className="px-4 py-3">
              <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleSelected(lead.id)} />
            </td>
            <td className="px-4 py-3">
              <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link>
              <p className="text-xs text-slate-500">{lead.company} · {lead.phone}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {(lead.tags || []).slice(0, 2).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </td>
            <td className="px-4 py-3"><Badge className={scoreTone(getLeadScore(lead))}>{getLeadScore(lead)}</Badge></td>
            <td className="px-4 py-3"><Badge className={ratingTone(getLeadRating(lead))}>{getLeadRating(lead)}</Badge></td>
            <td className="px-4 py-3"><Badge variant="secondary">{getQualification(lead)}</Badge></td>
            <td className="px-4 py-3"><Badge className={riskTone(getDuplicateRisk(lead))}>{getDuplicateRisk(lead)}</Badge></td>
            <td className="px-4 py-3 text-slate-600">
              <p className="font-medium text-slate-800">{lead.campaign || lead.source}</p>
              <p className="text-xs text-slate-500">{lead.source} · {lead.sourceDetail || 'Demo source'}</p>
            </td>
            <td className="px-4 py-3 text-slate-600">
              <p>{lead.assignedTo}</p>
              <p className="text-xs text-slate-500">{lead.ownerTeam || 'Inside Sales'} · {lead.territory || lead.city}</p>
            </td>
            <td className="px-4 py-3 text-slate-600">{getNextActivity(lead, followUps)}</td>
            <td className="px-4 py-3">
              <p className="font-medium text-slate-900">{formatINR(lead.expectedValue)}</p>
              <p className="text-xs text-slate-500">{lead.probability}% probability</p>
            </td>
            <td className="px-4 py-3"><Badge variant="secondary">{lead.stage}</Badge></td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button variant="outline" size="icon-sm" onClick={() => navigate(`/crm/leads/${lead.id}/edit`)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="destructive" size="icon-sm" onClick={() => deleteLead(lead.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

const Select: React.FC<{ label: string; value: string; options: readonly string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

export default LeadsListPage;
