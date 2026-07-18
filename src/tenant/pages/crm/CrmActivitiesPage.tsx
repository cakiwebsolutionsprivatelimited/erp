import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataTable, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { CRM_TODAY, getLeadScore, scoreTone } from '@/tenant/crm/crmDemoUtils';

const typeFilters = ['All', 'Follow-up', 'Note'] as const;
const statusFilters = ['All', 'Open', 'Done', 'Logged', 'Overdue'] as const;

const CrmActivitiesPage: React.FC = () => {
  const { leads, followUps } = useTenantData();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<(typeof typeFilters)[number]>('All');
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('All');

  const activities = useMemo(() => {
    const noteActivities = leads.flatMap((lead) =>
      (lead.notes || []).map((note) => ({
        id: note.id,
        type: 'Note',
        channel: 'Internal note',
        title: note.body,
        owner: note.author,
        date: note.createdAt,
        lead,
        status: 'Logged',
        outcome: note.body,
      }))
    );
    const followUpActivities = followUps.map((followUp) => {
      const followUpStatus = followUp.completed ? 'Done' : followUp.date.slice(0, 10) < CRM_TODAY ? 'Overdue' : 'Open';
      return {
        id: followUp.id,
        type: 'Follow-up',
        channel: followUp.channel || 'Task',
        title: followUp.title,
        owner: followUp.owner,
        date: followUp.date,
        lead: leads.find((lead) => lead.id === followUp.leadId),
        status: followUpStatus,
        outcome: followUp.outcome || 'Outcome note pending',
      };
    });
    return [...followUpActivities, ...noteActivities].sort((a, b) => b.date.localeCompare(a.date));
  }, [followUps, leads]);

  const filteredActivities = useMemo(() => {
    const query = search.toLowerCase().trim();
    return activities.filter((activity) => {
      const searchMatch = !query || [activity.title, activity.owner, activity.channel, activity.lead?.name, activity.lead?.company].join(' ').toLowerCase().includes(query);
      const typeMatch = type === 'All' || activity.type === type;
      const statusMatch = status === 'All' || activity.status === status;
      return searchMatch && typeMatch && statusMatch;
    });
  }, [activities, search, status, type]);

  return (
    <div>
      <PageHeader title="CRM Activities" description="Unified activity workspace for follow-ups, notes, channels, outcomes, and overdue sales work." />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Activities" value={String(activities.length)} hint="Notes and follow-ups" />
        <StatCard label="Open" value={String(activities.filter((activity) => activity.status === 'Open').length)} hint="Pending work" />
        <StatCard label="Overdue" value={String(activities.filter((activity) => activity.status === 'Overdue').length)} hint="SLA risk" />
        <StatCard label="Logged" value={String(activities.filter((activity) => activity.status === 'Logged' || activity.status === 'Done').length)} hint="Completed/history" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search activities, owner, channel, lead..." />
          <Select label="Type" value={type} options={typeFilters} onChange={(value) => setType(value as typeof type)} />
          <Select label="Status" value={status} options={statusFilters} onChange={(value) => setStatus(value as typeof status)} />
        </div>
      </section>

      <DataTable headers={['Activity', 'Lead', 'Score', 'Owner', 'Date', 'Channel', 'Status', 'Outcome']}>
        {filteredActivities.map((activity) => (
          <tr key={`${activity.type}-${activity.id}`}>
            <td className="px-4 py-3">
              <p className="font-medium text-slate-950">{activity.type}</p>
              <p className="max-w-lg truncate text-xs text-slate-500">{activity.title}</p>
            </td>
            <td className="px-4 py-3">
              {activity.lead ? <Link className="text-indigo-700 hover:underline" to={`/crm/leads/${activity.lead.id}`}>{activity.lead.name}</Link> : 'Deleted lead'}
              <p className="text-xs text-slate-500">{activity.lead?.company}</p>
            </td>
            <td className="px-4 py-3">{activity.lead && <Badge className={scoreTone(getLeadScore(activity.lead))}>{getLeadScore(activity.lead)}</Badge>}</td>
            <td className="px-4 py-3 text-slate-600">{activity.owner}</td>
            <td className="px-4 py-3 text-slate-600">{new Date(activity.date).toLocaleString('en-IN')}</td>
            <td className="px-4 py-3 text-slate-600">{activity.channel}</td>
            <td className="px-4 py-3"><Badge className={activity.status === 'Done' || activity.status === 'Logged' ? 'bg-emerald-50 text-emerald-700' : activity.status === 'Overdue' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}>{activity.status}</Badge></td>
            <td className="px-4 py-3 text-slate-600">{activity.outcome}</td>
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

export default CrmActivitiesPage;
