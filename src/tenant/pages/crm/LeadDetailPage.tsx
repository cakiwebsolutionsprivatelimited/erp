import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarPlus, CheckCircle2, Edit, FileText, MessageSquare, Radar, Route, Sparkles, Trash2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivityTimeline, DataTable, EmptyState, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import {
  getDuplicateRisk,
  getLeadAgeDays,
  getLeadLastActivity,
  getLeadRating,
  getLeadScore,
  getNextActivity,
  getQualification,
  getWeightedValue,
  leadStages,
  ratingTone,
  riskTone,
  scoreTone,
} from '@/tenant/crm/crmDemoUtils';
import type { LeadStage } from '@/tenant/types';

const tabs = ['Overview', 'Qualification', 'Follow-ups', 'Activities', 'Communication', 'Notes', 'Quotations', 'Files', 'Timeline'] as const;

const LeadDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    leads,
    crmCompanies,
    crmContacts,
    followUps,
    quotations,
    salesQuotations,
    changeLeadStage,
    addNote,
    addFollowUp,
    completeFollowUp,
    convertLeadToCustomer,
    deleteLead,
  } = useTenantData();
  const lead = leads.find((item) => item.id === id);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Overview');
  const [note, setNote] = useState('');
  const [followUpTitle, setFollowUpTitle] = useState('Call customer');
  const [followUpDate, setFollowUpDate] = useState('2026-06-18T11:00');

  if (!lead) {
    return <EmptyState title="Lead not found" description="The lead may have been deleted from local demo data." action={<Button onClick={() => navigate('/crm/leads')}>Back to Leads</Button>} />;
  }

  const leadFollowUps = followUps.filter((item) => item.leadId === lead.id);
  const leadQuotations = quotations.filter((item) => item.leadId === lead.id);
  const relatedSalesQuotes = salesQuotations.filter((item) => item.customerName === lead.company || item.customerName === lead.name);
  const duplicateMatches = leads.filter((item) =>
    item.id !== lead.id && (item.phone === lead.phone || item.email === lead.email || item.company === lead.company)
  );
  const linkedCompany = crmCompanies.find((company) => company.name === lead.company || company.email === lead.email);
  const linkedContacts = crmContacts.filter((contact) => contact.companyId === linkedCompany?.id || contact.email === lead.email || contact.phone === lead.phone);
  const score = getLeadScore(lead);
  const rating = getLeadRating(lead);
  const qualification = getQualification(lead);
  const duplicateRisk = getDuplicateRisk(lead);

  const handleDelete = () => {
    deleteLead(lead.id);
    navigate('/crm/leads');
  };

  return (
    <div>
      <PageHeader
        title={lead.name}
        description={`${lead.company} · ${lead.city || 'Bhubaneswar'}, ${lead.state || 'Odisha'} · ${lead.assignedTo}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate(`/crm/leads/${lead.id}/edit`)}><Edit className="h-4 w-4" />Edit lead</Button>
            <Button variant="outline" onClick={() => changeLeadStage(lead.id, 'Won')}>Mark won</Button>
            <Button variant="outline" onClick={() => changeLeadStage(lead.id, 'Lost')}>Mark lost</Button>
            <Button variant="outline" onClick={() => navigate('/sales/quotations/new')}><FileText className="h-4 w-4" />Create quotation</Button>
            <Button variant="outline" onClick={() => convertLeadToCustomer(lead.id)}><UserCheck className="h-4 w-4" />Convert</Button>
            <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4" />Delete</Button>
          </div>
        }
      />

      <StagePath stage={lead.stage} onChange={(stage) => changeLeadStage(lead.id, stage)} />

      <section className="my-5 grid gap-4 md:grid-cols-4 xl:grid-cols-6">
        <StatCard label="Expected value" value={formatINR(lead.expectedValue)} hint={`${lead.probability}% probability`} />
        <StatCard label="Weighted value" value={formatINR(getWeightedValue(lead))} hint="Forecast value" />
        <StatCard label="Lead score" value={String(score)} hint={`${rating} rating`} />
        <StatCard label="Qualification" value={qualification} hint={lead.budget || 'Budget pending'} />
        <StatCard label="Duplicate risk" value={duplicateRisk} hint={`${duplicateMatches.length} possible matches`} />
        <StatCard label="Next activity" value={new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')} hint={getNextActivity(lead, leadFollowUps)} />
      </section>

      <div className="mb-5 flex gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div>
          {activeTab === 'Overview' && (
            <Panel title="Overview">
              <div className="grid gap-3 md:grid-cols-2">
                <Info label="Email" value={lead.email} />
                <Info label="Phone" value={lead.phone} />
                <Info label="Alternate phone" value={lead.alternatePhone || 'Not provided'} />
                <Info label="Company" value={lead.company} />
                <Info label="Requirement" value={lead.requirement || 'Requirement discovery pending'} />
                <Info label="Lead source" value={`${lead.source} · ${lead.sourceDetail || 'Demo source'}`} />
                <Info label="Campaign" value={lead.campaign || 'Not attributed'} />
                <Info label="Capture method" value={lead.captureMethod || 'Manual entry'} />
                <Info label="Owner team" value={`${lead.ownerTeam || 'Inside Sales'} · ${lead.territory || lead.city || 'Bhubaneswar'}`} />
                <Info label="Routing reason" value={lead.routingReason || 'Round-robin balance'} />
                <Info label="Company record" value={linkedCompany?.displayName || 'Will be created on conversion'} />
                <Info label="Contact record" value={linkedContacts[0]?.name || 'Will be created on conversion'} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {Object.entries(lead.customFields || { 'Existing system': 'Excel', 'Decision role': 'Owner' }).map(([label, value]) => (
                  <Info key={label} label={label} value={value} />
                ))}
              </div>
            </Panel>
          )}

          {activeTab === 'Qualification' && (
            <div className="grid gap-5">
              <Panel title="Qualification and scoring">
                <div className="grid gap-4 md:grid-cols-3">
                  <ScoreTile label="Score" value={String(score)} badgeClass={scoreTone(score)} />
                  <ScoreTile label="Rating" value={rating} badgeClass={ratingTone(rating)} />
                  <ScoreTile label="Duplicate risk" value={duplicateRisk} badgeClass={riskTone(duplicateRisk)} />
                </div>
                <ScoreBreakdown leadScore={score} />
              </Panel>
              <Panel title="Duplicate review">
                {duplicateMatches.length ? (
                  <div className="space-y-3">
                    {duplicateMatches.map((match) => (
                      <div key={match.id} className="rounded-md border border-amber-100 bg-amber-50 p-3">
                        <p className="font-medium text-amber-950">{match.name}</p>
                        <p className="mt-1 text-sm text-amber-800">{match.company} · {match.phone} · {match.stage}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" /> No exact duplicate in local demo data.
                  </div>
                )}
              </Panel>
              <Panel title="Conversion wizard preview">
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    ['Company/account', linkedCompany ? linkedCompany.displayName : 'Create from lead company'],
                    ['Primary contact', linkedContacts[0] ? linkedContacts[0].name : 'Create from lead contact'],
                    ['Customer + quote handoff', lead.status === 'won' ? 'Customer-ready' : 'Mark won or convert'],
                  ].map(([step, helper], index) => (
                    <div key={step} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                      <Badge variant="secondary">Step {index + 1}</Badge>
                      <p className="mt-3 text-sm font-semibold text-slate-900">{step}</p>
                      <p className="mt-1 text-xs text-slate-500">{helper}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-md border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-800">
                  The Convert action creates or reuses Company, Contact, and Customer demo records locally.
                </div>
              </Panel>
            </div>
          )}

          {activeTab === 'Follow-ups' && (
            <Panel title="Follow-ups">
              <FollowUpList followUps={leadFollowUps} onComplete={completeFollowUp} />
            </Panel>
          )}

          {activeTab === 'Activities' && <ActivityTimeline lead={lead} followUps={leadFollowUps} />}
          {activeTab === 'Communication' && <CommunicationTimeline leadName={lead.name} leadSource={lead.source} followUps={leadFollowUps} notes={lead.notes || []} />}

          {activeTab === 'Notes' && (
            <Panel title="Notes">
              <div className="space-y-3">
                {(lead.notes || []).map((item) => (
                  <div key={item.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                    <p className="text-sm text-slate-700">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-400">{item.author} · {item.createdAt}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {activeTab === 'Quotations' && (
            <div className="grid gap-5">
              <DataTable headers={['CRM quotation', 'Amount', 'Status', 'Created']}>
                {leadQuotations.map((quotation) => (
                  <tr key={quotation.id}>
                    <td className="px-4 py-3 font-medium text-slate-950">{quotation.id}</td>
                    <td className="px-4 py-3">{formatINR(quotation.amount)}</td>
                    <td className="px-4 py-3">{quotation.status}</td>
                    <td className="px-4 py-3">{quotation.createdAt}</td>
                  </tr>
                ))}
              </DataTable>
              <DataTable headers={['Sales quote', 'Customer', 'Status', 'Created']}>
                {relatedSalesQuotes.map((quotation) => (
                  <tr key={quotation.id}>
                    <td className="px-4 py-3 font-medium text-indigo-700">{quotation.number}</td>
                    <td className="px-4 py-3">{quotation.customerName}</td>
                    <td className="px-4 py-3">{quotation.status}</td>
                    <td className="px-4 py-3">{quotation.createdAt}</td>
                  </tr>
                ))}
              </DataTable>
            </div>
          )}

          {activeTab === 'Files' && <EmptyState title="Files placeholder" description="Attachments and proposal files will appear here when document storage is connected." />}
          {activeTab === 'Timeline' && <ActivityTimeline lead={lead} followUps={leadFollowUps} />}
        </div>

        <aside className="space-y-5">
          <Panel title="Lead intelligence">
            <div className="space-y-3">
              <Info label="Age" value={`${getLeadAgeDays(lead)} days in pipeline`} />
              <Info label="Last activity" value={getLeadLastActivity(lead, leadFollowUps)} />
              <Info label="Next step" value={getNextActivity(lead, leadFollowUps)} />
            </div>
          </Panel>

          <Panel title="Add note">
            <textarea value={note} onChange={(event) => setNote(event.target.value)} className="min-h-28 w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" placeholder="Write a sales note..." />
            <Button className="mt-3 w-full" disabled={!note.trim()} onClick={() => { addNote(lead.id, note); setNote(''); }}>Save note</Button>
          </Panel>

          <Panel title="Add follow-up">
            <input value={followUpTitle} onChange={(event) => setFollowUpTitle(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            <input type="datetime-local" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} className="mt-3 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            <Button className="mt-3 w-full" onClick={() => addFollowUp(lead.id, followUpTitle, followUpDate)}><CalendarPlus className="h-4 w-4" />Add follow-up</Button>
          </Panel>
        </aside>
      </section>
    </div>
  );
};

const StagePath: React.FC<{ stage: LeadStage; onChange: (stage: LeadStage) => void }> = ({ stage, onChange }) => (
  <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
    <div className="flex items-center gap-2 overflow-x-auto">
      {leadStages.map((item, index) => {
        const activeIndex = leadStages.indexOf(stage);
        const isActive = item === stage;
        const isDone = index < activeIndex;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${isActive ? 'border-indigo-600 bg-indigo-600 text-white' : isDone ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
);

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
    {children}
  </div>
);

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
  </div>
);

const ScoreTile: React.FC<{ label: string; value: string; badgeClass: string }> = ({ label, value, badgeClass }) => (
  <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
    <p className="text-sm text-slate-500">{label}</p>
    <Badge className={`mt-3 border ${badgeClass}`}>{value}</Badge>
  </div>
);

const ScoreBreakdown: React.FC<{ leadScore: number }> = ({ leadScore }) => {
  const items: Array<[string, number, React.ElementType]> = [
    ['Fit', Math.min(100, leadScore + 8), Radar],
    ['Intent', Math.max(20, leadScore - 6), Sparkles],
    ['Routing', Math.min(100, leadScore + 2), Route],
  ];

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      {items.map(([label, value, Icon]) => (
      <div key={label} className="rounded-md border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <Icon className="h-4 w-4 text-indigo-600" />
        </div>
        <div className="mt-3 h-2 rounded-full bg-white">
          <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${value}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">{value}/100 demo score</p>
      </div>
      ))}
    </div>
  );
};

const FollowUpList: React.FC<{ followUps: ReturnType<typeof useTenantData>['followUps']; onComplete: (id: string) => void }> = ({ followUps, onComplete }) => (
  <div className="space-y-3">
    {followUps.map((item) => (
      <div key={item.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-900">{item.title}</p>
          <Badge className={item.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>{item.completed ? 'Done' : 'Open'}</Badge>
        </div>
        <p className="mt-1 text-xs text-slate-500">{item.channel || 'Task'} · {new Date(item.date).toLocaleString('en-IN')}</p>
        {item.outcome && <p className="mt-2 text-sm text-slate-600">{item.outcome}</p>}
        {!item.completed && <Button className="mt-2" variant="outline" size="sm" onClick={() => onComplete(item.id)}>Mark complete</Button>}
      </div>
    ))}
  </div>
);

const CommunicationTimeline: React.FC<{ leadName: string; leadSource: string; followUps: ReturnType<typeof useTenantData>['followUps']; notes: ReturnType<typeof useTenantData>['leads'][number]['notes'] }> = ({ leadName, leadSource, followUps, notes }) => (
  <Panel title="Unified communication timeline">
    <div className="space-y-4">
      <div className="flex gap-3">
        <MessageSquare className="mt-0.5 h-4 w-4 text-indigo-600" />
        <p className="text-sm text-slate-600">{leadName} entered from {leadSource}; welcome message preview is queued locally.</p>
      </div>
      {followUps.map((item) => (
        <div key={item.id} className="flex gap-3">
          <CalendarPlus className="mt-0.5 h-4 w-4 text-amber-600" />
          <p className="text-sm text-slate-600">{item.channel || 'Task'}: {item.title} on {new Date(item.date).toLocaleString('en-IN')}.</p>
        </div>
      ))}
      {notes.map((note) => (
        <div key={note.id} className="flex gap-3">
          <FileText className="mt-0.5 h-4 w-4 text-slate-500" />
          <p className="text-sm text-slate-600">{note.body} <span className="text-slate-400">by {note.author}</span></p>
        </div>
      ))}
      <div className="rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
        Email, SMS, WhatsApp, and call logging are represented as UI previews only in this phase.
      </div>
    </div>
  </Panel>
);

export default LeadDetailPage;
