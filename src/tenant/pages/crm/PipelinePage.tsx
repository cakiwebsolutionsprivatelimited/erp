import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatINR, PageHeader } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { getLeadAgeDays, getLeadRating, getLeadScore, getNextActivity, getWeightedValue, leadStages, ratingTone, scoreTone, sumBy } from '@/tenant/crm/crmDemoUtils';

const PipelinePage: React.FC = () => {
  const { leads, followUps, changeLeadStage } = useTenantData();

  return (
    <div>
      <PageHeader title="Pipeline Kanban" description="Opportunity-style CRM board with weighted forecast, score, owner, age, and next activity." />
      <div className="flex gap-4 overflow-x-auto pb-4">
        {leadStages.map((stage) => {
          const items = leads.filter((lead) => lead.stage === stage);
          const total = sumBy(items, (lead) => lead.expectedValue);
          const weighted = sumBy(items, getWeightedValue);

          return (
            <section
              key={stage}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => changeLeadStage(event.dataTransfer.getData('leadId'), stage)}
              className="min-h-[620px] w-80 shrink-0 rounded-md border border-slate-200 bg-slate-100/70 p-3"
            >
              <div className="mb-3 rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-900">{stage}</h2>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-slate-50 p-2">
                    <p className="text-slate-500">Pipeline</p>
                    <p className="mt-1 font-semibold text-slate-950">{formatINR(total)}</p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-2">
                    <p className="text-slate-500">Weighted</p>
                    <p className="mt-1 font-semibold text-slate-950">{formatINR(weighted)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((lead) => (
                  <Link
                    key={lead.id}
                    to={`/crm/leads/${lead.id}`}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData('leadId', lead.id)}
                    className="block rounded-md border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-200 hover:shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{lead.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{lead.company}</p>
                      </div>
                      <Badge className={scoreTone(getLeadScore(lead))}>{getLeadScore(lead)}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      <Badge className={ratingTone(getLeadRating(lead))}>{getLeadRating(lead)}</Badge>
                      <Badge variant="outline">{lead.priority || 'Medium'}</Badge>
                      {(lead.tags || []).slice(0, 1).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                    <div className="mt-3 grid gap-2 text-xs">
                      <div className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5">
                        <span className="flex items-center gap-1 text-slate-500"><IndianRupee className="h-3.5 w-3.5" />Value</span>
                        <span className="font-semibold text-slate-900">{formatINR(lead.expectedValue)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5">
                        <span className="text-slate-500">Weighted</span>
                        <span className="font-semibold text-slate-900">{formatINR(getWeightedValue(lead))}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{lead.assignedTo} · {lead.ownerTeam || 'Inside Sales'}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />{getLeadAgeDays(lead)} days · {getNextActivity(lead, followUps)}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default PipelinePage;
