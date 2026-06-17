import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, Edit, FileUp, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatINR, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import type { LeadStage } from '@/tenant/types';

const stageOptions: Array<'All' | LeadStage> = ['All', 'New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];

const LeadsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { leads, users, deleteLead } = useTenantData();
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<'All' | LeadStage>('All');
  const [source, setSource] = useState('All');
  const [owner, setOwner] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);

  const sources = useMemo(() => ['All', ...Array.from(new Set(leads.map((lead) => lead.source)))], [leads]);
  const owners = useMemo(() => ['All', ...Array.from(new Set(users.map((user) => user.name)))], [users]);

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim();
    return leads.filter((lead) => {
      const searchMatch = !query || [lead.name, lead.company, lead.stage, lead.source, lead.assignedTo, lead.phone, lead.email, lead.requirement].join(' ').toLowerCase().includes(query);
      const stageMatch = stage === 'All' || lead.stage === stage;
      const sourceMatch = source === 'All' || lead.source === source;
      const ownerMatch = owner === 'All' || lead.assignedTo === owner;
      const dateMatch = dateFilter === 'All' || lead.createdAt >= '2026-06-01';
      return searchMatch && stageMatch && sourceMatch && ownerMatch && dateMatch;
    });
  }, [dateFilter, leads, owner, search, source, stage]);

  const toggleSelected = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Search, filter, edit, delete, and open CRM lead records from local demo data."
        action={<Button onClick={() => navigate('/crm/leads/new')}><PlusCircle className="h-4 w-4" />Add Lead</Button>}
      />

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_repeat(4,180px)]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search leads, phone, company, requirement..." />
          <Select label="Stage" value={stage} options={stageOptions} onChange={(value) => setStage(value as typeof stage)} />
          <Select label="Source" value={source} options={sources} onChange={setSource} />
          <Select label="Assigned user" value={owner} options={owners} onChange={setOwner} />
          <Select label="Date" value={dateFilter} options={['All', 'This month']} onChange={setDateFilter} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm"><FileUp className="h-3.5 w-3.5" />Import</Button>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Export</Button>
            <Button variant="outline" size="sm" disabled={!selected.length}>Assign user</Button>
            <Button variant="outline" size="sm" disabled={!selected.length}>Change stage</Button>
            <Button variant="destructive" size="sm" disabled={!selected.length}>Delete selected</Button>
          </div>
          <p className="text-sm text-slate-500">{filteredLeads.length} leads · {selected.length} selected</p>
        </div>
      </section>

      <DataTable headers={['', 'Lead', 'Contact', 'Source', 'Stage', 'Assigned to', 'Follow-up', 'Value', 'Probability', 'Status', 'Created', 'Actions']}>
        {filteredLeads.map((lead) => (
          <tr key={lead.id}>
            <td className="px-4 py-3">
              <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleSelected(lead.id)} />
            </td>
            <td className="px-4 py-3">
              <Link className="font-medium text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link>
              <p className="text-xs text-slate-500">{lead.company} · {lead.city || 'Bhubaneswar'}</p>
            </td>
            <td className="px-4 py-3 text-slate-600">
              <p>{lead.phone}</p>
              <p className="text-xs text-slate-500">{lead.email}</p>
            </td>
            <td className="px-4 py-3 text-slate-600">{lead.source}</td>
            <td className="px-4 py-3"><Badge variant="secondary">{lead.stage}</Badge></td>
            <td className="px-4 py-3 text-slate-600">{lead.assignedTo}</td>
            <td className="px-4 py-3 text-slate-600">{new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')}</td>
            <td className="px-4 py-3 font-medium text-slate-900">{formatINR(lead.expectedValue)}</td>
            <td className="px-4 py-3 text-slate-600">{lead.probability}%</td>
            <td className="px-4 py-3"><Badge className={lead.status === 'won' ? 'bg-emerald-50 text-emerald-700' : lead.status === 'lost' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}>{lead.status}</Badge></td>
            <td className="px-4 py-3 text-slate-600">{lead.createdAt}</td>
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
