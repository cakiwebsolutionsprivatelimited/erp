import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataTable, PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

const CrmActivitiesPage: React.FC = () => {
  const { leads, followUps } = useTenantData();
  const noteActivities = leads.flatMap((lead) =>
    lead.notes.map((note) => ({
      id: note.id,
      type: 'Note',
      title: note.body,
      owner: note.author,
      date: note.createdAt,
      lead,
      status: 'Logged',
    }))
  );
  const followUpActivities = followUps.map((followUp) => ({
    id: followUp.id,
    type: 'Follow-up',
    title: followUp.title,
    owner: followUp.owner,
    date: followUp.date,
    lead: leads.find((lead) => lead.id === followUp.leadId),
    status: followUp.completed ? 'Done' : 'Open',
  }));
  const activities = [...followUpActivities, ...noteActivities].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader title="CRM Activities" description="Communication history across notes and follow-ups." />
      <DataTable headers={['Activity', 'Lead', 'Owner', 'Date', 'Status']}>
        {activities.map((activity) => (
          <tr key={`${activity.type}-${activity.id}`}>
            <td className="px-4 py-3">
              <p className="font-medium text-slate-950">{activity.type}</p>
              <p className="max-w-lg truncate text-xs text-slate-500">{activity.title}</p>
            </td>
            <td className="px-4 py-3">
              {activity.lead ? <Link className="text-indigo-700 hover:underline" to={`/crm/leads/${activity.lead.id}`}>{activity.lead.name}</Link> : 'Deleted lead'}
            </td>
            <td className="px-4 py-3 text-slate-600">{activity.owner}</td>
            <td className="px-4 py-3 text-slate-600">{new Date(activity.date).toLocaleString('en-IN')}</td>
            <td className="px-4 py-3"><Badge className={activity.status === 'Done' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}>{activity.status}</Badge></td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export default CrmActivitiesPage;
