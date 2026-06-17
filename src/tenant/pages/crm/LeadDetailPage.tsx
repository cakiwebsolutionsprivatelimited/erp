import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarPlus, Edit, FileText, Trash2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivityTimeline, DataTable, EmptyState, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import type { LeadStage } from '@/tenant/types';

const stages: LeadStage[] = ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];
const tabs = ['Overview', 'Follow-ups', 'Activities', 'Notes', 'Quotations', 'Files', 'Timeline'] as const;

const LeadDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, followUps, quotations, changeLeadStage, addNote, addFollowUp, completeFollowUp, convertLeadToCustomer, deleteLead } = useTenantData();
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
            <Button variant="outline" onClick={() => navigate('/crm/quotations')}><FileText className="h-4 w-4" />Create quotation</Button>
            <Button variant="outline" onClick={() => convertLeadToCustomer(lead.id)}><UserCheck className="h-4 w-4" />Convert</Button>
            <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4" />Delete</Button>
          </div>
        }
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Expected value" value={formatINR(lead.expectedValue)} hint={`${lead.probability}% probability`} />
        <StatCard label="Stage" value={lead.stage} hint={lead.status} />
        <StatCard label="Priority" value={lead.priority || 'Medium'} hint={(lead.tags || []).join(', ') || 'No tags'} />
        <StatCard label="Next follow-up" value={new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')} hint={lead.phone} />
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
                <Info label="Lead source" value={lead.source} />
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-slate-700">Change stage</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stages.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => changeLeadStage(lead.id, stage)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${lead.stage === stage ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          {activeTab === 'Follow-ups' && (
            <Panel title="Follow-ups">
              <FollowUpList followUps={leadFollowUps} onComplete={completeFollowUp} />
            </Panel>
          )}

          {activeTab === 'Activities' && <ActivityTimeline lead={lead} followUps={leadFollowUps} />}

          {activeTab === 'Notes' && (
            <Panel title="Notes">
              <div className="space-y-3">
                {lead.notes.map((item) => (
                  <div key={item.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                    <p className="text-sm text-slate-700">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-400">{item.author} · {item.createdAt}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {activeTab === 'Quotations' && (
            <DataTable headers={['Quotation', 'Amount', 'Status', 'Created']}>
              {leadQuotations.map((quotation) => (
                <tr key={quotation.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{quotation.id}</td>
                  <td className="px-4 py-3">{formatINR(quotation.amount)}</td>
                  <td className="px-4 py-3">{quotation.status}</td>
                  <td className="px-4 py-3">{quotation.createdAt}</td>
                </tr>
              ))}
            </DataTable>
          )}

          {activeTab === 'Files' && <EmptyState title="Files placeholder" description="Attachments and proposal files will appear here when document storage is connected." />}
          {activeTab === 'Timeline' && <ActivityTimeline lead={lead} followUps={leadFollowUps} />}
        </div>

        <aside className="space-y-5">
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

const FollowUpList: React.FC<{ followUps: ReturnType<typeof useTenantData>['followUps']; onComplete: (id: string) => void }> = ({ followUps, onComplete }) => (
  <div className="space-y-3">
    {followUps.map((item) => (
      <div key={item.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-900">{item.title}</p>
          <Badge className={item.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>{item.completed ? 'Done' : 'Open'}</Badge>
        </div>
        <p className="mt-1 text-xs text-slate-500">{new Date(item.date).toLocaleString('en-IN')}</p>
        {!item.completed && <Button className="mt-2" variant="outline" size="sm" onClick={() => onComplete(item.id)}>Mark complete</Button>}
      </div>
    ))}
  </div>
);

export default LeadDetailPage;
