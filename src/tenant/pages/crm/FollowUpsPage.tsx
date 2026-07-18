import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { CRM_TODAY, getLeadRating, getLeadScore, ratingTone, scoreTone } from '@/tenant/crm/crmDemoUtils';

const views = ['Today', 'Week', 'Month', 'Overdue', 'Assigned to me'] as const;
const modes = ['Cards', 'Table'] as const;

const FollowUpsPage: React.FC = () => {
  const { followUps, leads, completeFollowUp } = useTenantData();
  const [view, setView] = useState<(typeof views)[number]>('Week');
  const [mode, setMode] = useState<(typeof modes)[number]>('Cards');
  const [activeFollowUpId, setActiveFollowUpId] = useState<string | null>(null);
  const [localDates, setLocalDates] = useState<Record<string, string>>({});
  const [outcomes, setOutcomes] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (view === 'Today') return followUps.filter((item) => displayDate(item.id, item.date, localDates).slice(0, 10) === CRM_TODAY);
    if (view === 'Overdue') return followUps.filter((item) => !item.completed && displayDate(item.id, item.date, localDates).slice(0, 10) < CRM_TODAY);
    if (view === 'Assigned to me') return followUps.filter((item) => item.owner === 'Demo User' || item.owner === 'Anita Das');
    if (view === 'Month') return followUps.filter((item) => displayDate(item.id, item.date, localDates).slice(0, 7) === '2026-06');
    return followUps.filter((item) => displayDate(item.id, item.date, localDates).slice(0, 10) >= CRM_TODAY && displayDate(item.id, item.date, localDates).slice(0, 10) <= '2026-06-24');
  }, [followUps, localDates, view]);

  const activeFollowUp = followUps.find((item) => item.id === activeFollowUpId);

  const saveReschedulePreview = (id: string, value: string) => {
    setLocalDates((current) => ({ ...current, [id]: value }));
  };

  return (
    <div>
      <PageHeader title="Follow-up Calendar" description="Work overdue, today, week, month, and assigned follow-ups with local reschedule and outcome previews." />

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {views.map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium ${view === item ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex rounded-md border border-slate-200 bg-slate-50 p-1">
            {modes.map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium ${mode === item ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <Summary label="Open" value={filtered.filter((item) => !item.completed).length} icon={<Clock3 className="h-4 w-4" />} />
        <Summary label="Completed" value={filtered.filter((item) => item.completed).length} icon={<CheckCircle2 className="h-4 w-4" />} />
        <Summary label="Overdue" value={filtered.filter((item) => !item.completed && displayDate(item.id, item.date, localDates).slice(0, 10) < CRM_TODAY).length} icon={<CalendarDays className="h-4 w-4" />} />
        <Summary label="Rescheduled" value={Object.keys(localDates).length} icon={<CalendarDays className="h-4 w-4" />} />
      </section>

      {mode === 'Cards' ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((followUp) => {
            const lead = leads.find((item) => item.id === followUp.leadId);
            const date = displayDate(followUp.id, followUp.date, localDates);
            return (
              <div key={followUp.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{followUp.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{followUp.channel || 'Task'} · {followUp.owner}</p>
                  </div>
                  <Badge className={followUp.completed ? 'bg-emerald-50 text-emerald-700' : date.slice(0, 10) < CRM_TODAY ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}>
                    {followUp.completed ? 'Done' : date.slice(0, 10) < CRM_TODAY ? 'Overdue' : 'Open'}
                  </Badge>
                </div>
                {lead && (
                  <Link to={`/crm/leads/${lead.id}`} className="mt-4 block rounded-md border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-indigo-700">{lead.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{lead.company}</p>
                      </div>
                      <Badge className={scoreTone(getLeadScore(lead))}>{getLeadScore(lead)}</Badge>
                    </div>
                    <Badge className={`mt-3 ${ratingTone(getLeadRating(lead))}`}>{getLeadRating(lead)}</Badge>
                  </Link>
                )}
                <p className="mt-4 text-sm text-slate-600">{new Date(date).toLocaleString('en-IN')}</p>
                {(outcomes[followUp.id] || followUp.outcome) && <p className="mt-2 rounded-md bg-slate-50 p-2 text-sm text-slate-600">{outcomes[followUp.id] || followUp.outcome}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {!followUp.completed && <Button variant="outline" size="sm" onClick={() => completeFollowUp(followUp.id)}>Mark complete</Button>}
                  <Button variant="outline" size="sm" onClick={() => setActiveFollowUpId(followUp.id)}>Reschedule</Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable headers={['Follow-up', 'Lead', 'Owner', 'Date', 'Channel', 'Status', 'Action']}>
          {filtered.map((followUp) => {
            const lead = leads.find((item) => item.id === followUp.leadId);
            const date = displayDate(followUp.id, followUp.date, localDates);
            return (
              <tr key={followUp.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{followUp.title}</td>
                <td className="px-4 py-3">{lead ? <Link className="text-indigo-700 hover:underline" to={`/crm/leads/${lead.id}`}>{lead.name}</Link> : 'Deleted lead'}</td>
                <td className="px-4 py-3 text-slate-600">{followUp.owner}</td>
                <td className="px-4 py-3 text-slate-600">{new Date(date).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-slate-600">{followUp.channel || 'Task'}</td>
                <td className="px-4 py-3"><Badge>{followUp.completed ? 'Done' : 'Open'}</Badge></td>
                <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => setActiveFollowUpId(followUp.id)}>Open</Button></td>
              </tr>
            );
          })}
        </DataTable>
      )}

      {activeFollowUp && (
        <section className="mt-5 rounded-md border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-indigo-950">Reschedule and outcome preview</h2>
              <p className="mt-1 text-sm text-indigo-800">{activeFollowUp.title} · {activeFollowUp.owner}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveFollowUpId(null)}>Close</Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto]">
            <input
              type="datetime-local"
              value={(localDates[activeFollowUp.id] || activeFollowUp.date).slice(0, 16)}
              onChange={(event) => saveReschedulePreview(activeFollowUp.id, event.target.value)}
              className="h-10 rounded-md border border-indigo-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
            <input
              value={outcomes[activeFollowUp.id] || ''}
              onChange={(event) => setOutcomes((current) => ({ ...current, [activeFollowUp.id]: event.target.value }))}
              placeholder="Outcome note, e.g. demo confirmed, quote requested..."
              className="h-10 rounded-md border border-indigo-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
            <Button onClick={() => setActiveFollowUpId(null)}>Save preview</Button>
          </div>
        </section>
      )}
    </div>
  );
};

const displayDate = (id: string, date: string, localDates: Record<string, string>) => localDates[id] || date;

const Summary: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      </div>
      <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700">{icon}</span>
    </div>
  </div>
);

export default FollowUpsPage;
