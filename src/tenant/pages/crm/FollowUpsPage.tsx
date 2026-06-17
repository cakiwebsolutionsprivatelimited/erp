import React, { useMemo, useState } from 'react';
import { FollowUpCalendar, PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

const TODAY = '2026-06-17';
const views = ['Today', 'Week', 'Month', 'Overdue', 'Assigned to me'] as const;

const FollowUpsPage: React.FC = () => {
  const { followUps, leads, completeFollowUp } = useTenantData();
  const [view, setView] = useState<(typeof views)[number]>('Week');

  const filtered = useMemo(() => {
    if (view === 'Today') return followUps.filter((item) => item.date.slice(0, 10) === TODAY);
    if (view === 'Overdue') return followUps.filter((item) => !item.completed && item.date.slice(0, 10) < TODAY);
    if (view === 'Assigned to me') return followUps.filter((item) => item.owner === 'Demo User' || item.owner === 'Anita Das');
    if (view === 'Month') return followUps.filter((item) => item.date.slice(0, 7) === '2026-06');
    return followUps.filter((item) => item.date.slice(0, 10) >= TODAY && item.date.slice(0, 10) <= '2026-06-24');
  }, [followUps, view]);

  return (
    <div>
      <PageHeader title="Follow-up Calendar" description="Switch between today, week, month, overdue, and assigned-to-me CRM follow-up views." />
      <div className="mb-4 flex gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white p-2 shadow-sm">
        {views.map((item) => (
          <button
            key={item}
            onClick={() => setView(item)}
            className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium ${view === item ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <FollowUpCalendar followUps={filtered} leads={leads} onComplete={completeFollowUp} />
    </div>
  );
};

export default FollowUpsPage;
