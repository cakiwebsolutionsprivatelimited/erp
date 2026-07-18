import React, { useMemo, useState } from 'react';
import { BriefcaseBusiness, CalendarClock, CheckCircle2, Eye, FileCheck2, PlusCircle, UserRoundCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar, StatCard, formatINR } from '@/tenant/components/TenantUI';
import { CandidateForm, InterviewForm, JobRequisitionForm, OfferForm } from '@/tenant/hr/HrRecruitmentForms';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { getRecruitmentMetrics } from '@/tenant/hr/hrDemoService';
import type { BackgroundCheckStatus, Candidate, CandidateStage, InterviewStatus, OfferStatus } from '@/tenant/hr/types';

const candidateStages: CandidateStage[] = ['Applied', 'Screened', 'Shortlisted', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Talent Pool'];
const interviewStatuses: InterviewStatus[] = ['Scheduled', 'Completed', 'Rescheduled', 'Cancelled'];
const offerStatuses: OfferStatus[] = ['Draft', 'Pending Approval', 'Sent', 'Accepted', 'Rejected', 'Withdrawn'];
const backgroundStatuses: BackgroundCheckStatus[] = ['Pending', 'In Progress', 'Clear', 'Concern'];
const selectClass = 'flex h-9 w-full min-w-32 rounded-sm border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

type DialogType = 'job' | 'candidate' | 'interview' | 'offer' | null;

const RecruitmentPage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const metrics = getRecruitmentMetrics(hr);
  const formatSensitive = (value: number) => access.canViewSalary ? formatINR(value) : 'Restricted';
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState<DialogType>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const filteredCandidates = useMemo(() => hr.candidates.filter((candidate) => `${candidate.candidateNumber} ${candidate.name} ${candidate.jobTitle} ${candidate.source} ${candidate.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [hr.candidates, query]);
  const selectableCandidates = hr.candidates.filter((candidate) => !['Rejected', 'Accepted'].includes(candidate.stage));
  const offerCandidates = hr.candidates.filter((candidate) => ['Shortlisted', 'Interview', 'Offer'].includes(candidate.stage));
  const liveSelectedCandidate = selectedCandidate ? hr.candidates.find((candidate) => candidate.id === selectedCandidate.id) || selectedCandidate : null;

  return (
    <div>
      <PageHeader
        title="Recruitment"
        description="Job requisitions, postings, candidate pipeline, interviews, offers, talent pool, and onboarding handoff."
        action={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setDialog('job')}><PlusCircle className="h-4 w-4" />New requisition</Button><Button onClick={() => setDialog('candidate')}><PlusCircle className="h-4 w-4" />Add candidate</Button></div>}
      />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Open requisitions" value={String(metrics.openRequisitions)} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <StatCard label="Active candidates" value={String(metrics.activeCandidates)} icon={<UserRoundCheck className="h-4 w-4" />} />
        <StatCard label="Interviews due" value={String(metrics.interviewsThisWeek)} icon={<CalendarClock className="h-4 w-4" />} />
        <StatCard label="Offers pending" value={String(metrics.offersPending)} icon={<FileCheck2 className="h-4 w-4" />} />
        <StatCard label="Onboarding handoff" value={String(metrics.acceptedAwaitingOnboarding)} icon={<CheckCircle2 className="h-4 w-4" />} />
      </section>
      <Tabs defaultValue="pipeline">
        <TabsList className="max-w-full justify-start overflow-x-auto">
          {['pipeline', 'jobs', 'candidates', 'interviews', 'offers', 'talent'].map((tab) => <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="pipeline" className="mt-4">
          <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search candidates, roles, sources, or tags" /></div>
          <div className="max-w-full overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {candidateStages.map((stage) => {
                const stageCandidates = filteredCandidates.filter((candidate) => candidate.stage === stage);
                return (
                  <section key={stage} className="w-72 shrink-0 rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-2"><h2 className="font-semibold text-slate-950">{stage}</h2><span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{stageCandidates.length}</span></div>
                    <div className="space-y-2">
                      {stageCandidates.length ? stageCandidates.map((candidate) => (
                        <article key={candidate.id} className="rounded-sm border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-start justify-between gap-2"><div><h3 className="font-medium text-slate-950">{candidate.name}</h3><p className="mt-1 text-xs text-slate-500">{candidate.candidateNumber} | {candidate.jobTitle}</p></div><Button size="icon" variant="ghost" title="View candidate" onClick={() => setSelectedCandidate(candidate)}><Eye className="h-4 w-4" /></Button></div>
                          <div className="mt-3 flex flex-wrap gap-1">{candidate.tags.map((tag) => <span key={tag} className="rounded-sm bg-white px-2 py-1 text-xs text-slate-600">{tag}</span>)}</div>
                          <div className="mt-3"><StageSelect value={candidate.stage} onChange={(nextStage) => hr.updateCandidateStage(candidate.id, nextStage)} /></div>
                        </article>
                      )) : <div className="rounded-sm border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">No candidates</div>}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="jobs" className="mt-4">
          <div className="mb-3 flex justify-end"><Button size="sm" onClick={() => setDialog('job')}><PlusCircle className="h-4 w-4" />New requisition</Button></div>
          <DataTable headers={['Requisition', 'Role', 'Department', 'Branch', 'Headcount', 'Budget', 'Approval', 'Status']}>
            {hr.recruitmentJobs.map((job) => <tr key={job.id}><td className="px-4 py-3 font-medium text-indigo-700">{job.requisitionNumber}</td><td className="px-4 py-3 font-medium text-slate-950">{job.title}</td><td className="px-4 py-3 text-slate-600">{job.department}</td><td className="px-4 py-3 text-slate-600">{job.branchName}</td><td className="px-4 py-3 text-slate-600">{job.filled}/{job.headcount}</td><td className="px-4 py-3 text-slate-600">{formatSensitive(job.budgetMin)} - {formatSensitive(job.budgetMax)}</td><td className="px-4 py-3"><HrStatusBadge status={job.approvalStatus} /></td><td className="px-4 py-3"><HrStatusBadge status={job.status} /></td></tr>)}
          </DataTable>
          <section className="mt-5 grid gap-4 xl:grid-cols-2">
            <Panel title="Job postings">{hr.jobPostings.map((posting) => <InfoRow key={posting.id} label={`${posting.jobTitle} | ${posting.channel}`} value={`${posting.applications} applications | ${posting.status}`} status={posting.status} />)}</Panel>
            <Panel title="Hiring source summary">{['Career Page', 'Referral', 'LinkedIn', 'Internal'].map((source) => <InfoRow key={source} label={source} value={`${hr.candidates.filter((candidate) => candidate.source === source).length} candidates`} />)}</Panel>
          </section>
        </TabsContent>
        <TabsContent value="candidates" className="mt-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-md flex-1"><SearchBar value={query} onChange={setQuery} placeholder="Search candidate table" /></div><Button size="sm" onClick={() => setDialog('candidate')}><PlusCircle className="h-4 w-4" />Add candidate</Button></div>
          <DataTable headers={['Candidate', 'Role', 'Source', 'Expected salary', 'Notice', 'Rating', 'Stage', '']}>
            {filteredCandidates.map((candidate) => <tr key={candidate.id}><td className="px-4 py-3"><div className="font-medium text-slate-950">{candidate.name}</div><div className="text-xs text-slate-500">{candidate.candidateNumber} | {candidate.email}</div></td><td className="px-4 py-3 text-slate-600">{candidate.jobTitle}</td><td className="px-4 py-3 text-slate-600">{candidate.source}</td><td className="px-4 py-3 text-slate-600">{formatSensitive(candidate.expectedSalary)}</td><td className="px-4 py-3 text-slate-600">{candidate.noticePeriod}</td><td className="px-4 py-3 text-slate-600">{candidate.rating}/5</td><td className="px-4 py-3"><StageSelect value={candidate.stage} onChange={(stage) => hr.updateCandidateStage(candidate.id, stage)} /></td><td className="px-4 py-3"><Button size="icon" variant="ghost" title="View candidate" onClick={() => setSelectedCandidate(candidate)}><Eye className="h-4 w-4" /></Button></td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="interviews" className="mt-4">
          <div className="mb-3 flex justify-end"><Button size="sm" onClick={() => setDialog('interview')}><CalendarClock className="h-4 w-4" />Schedule interview</Button></div>
          <DataTable headers={['Candidate', 'Role', 'Round', 'Panel', 'Scheduled', 'Mode', 'Status']}>
            {hr.interviews.map((interview) => <tr key={interview.id}><td className="px-4 py-3 font-medium text-slate-950">{interview.candidateName}</td><td className="px-4 py-3 text-slate-600">{interview.jobTitle}</td><td className="px-4 py-3 text-slate-600">{interview.round}</td><td className="px-4 py-3 text-slate-600">{interview.panel.join(', ')}</td><td className="px-4 py-3 text-slate-600">{formatDateTime(interview.scheduledAt)}</td><td className="px-4 py-3 text-slate-600">{interview.mode}</td><td className="px-4 py-3"><InterviewStatusSelect value={interview.status} onChange={(status) => hr.updateInterviewStatus(interview.id, status)} /></td></tr>)}
          </DataTable>
        </TabsContent>
        <TabsContent value="offers" className="mt-4">
          <div className="mb-3 flex justify-end"><Button size="sm" onClick={() => setDialog('offer')}><FileCheck2 className="h-4 w-4" />Create offer</Button></div>
          <DataTable headers={['Candidate', 'Role', 'Offered salary', 'Joining date', 'Approver', 'Status', 'Action']}>
            {hr.offers.map((offer) => {
              const candidate = hr.candidates.find((item) => item.id === offer.candidateId);
              const alreadyOnboarded = hr.employees.some((employee) => employee.email === candidate?.email);
              return <tr key={offer.id}><td className="px-4 py-3 font-medium text-slate-950">{offer.candidateName}</td><td className="px-4 py-3 text-slate-600">{offer.jobTitle}</td><td className="px-4 py-3 text-slate-600">{formatSensitive(offer.offeredSalary)}</td><td className="px-4 py-3 text-slate-600">{offer.joiningDate}</td><td className="px-4 py-3 text-slate-600">{offer.approver}</td><td className="px-4 py-3"><OfferStatusSelect value={offer.status} onChange={(status) => hr.updateOfferStatus(offer.id, status)} /></td><td className="px-4 py-3">{offer.status === 'Accepted' && candidate ? <Button size="sm" variant="outline" disabled={alreadyOnboarded} onClick={() => hr.handoffCandidateToOnboarding(candidate.id)}>{alreadyOnboarded ? 'Onboarded' : 'Handoff'}</Button> : <span className="text-xs text-slate-500">{offer.status === 'Rejected' || offer.status === 'Withdrawn' ? 'Closed' : 'Awaiting acceptance'}</span>}</td></tr>;
            })}
          </DataTable>
        </TabsContent>
        <TabsContent value="talent" className="mt-4">
          <DataTable headers={['Candidate', 'Skill area', 'Available from', 'Owner', 'Status', 'Notes']}>
            {hr.talentPool.map((entry) => <tr key={entry.id}><td className="px-4 py-3 font-medium text-slate-950">{entry.candidateName}</td><td className="px-4 py-3 text-slate-600">{entry.skillArea}</td><td className="px-4 py-3 text-slate-600">{entry.availableFrom}</td><td className="px-4 py-3 text-slate-600">{entry.owner}</td><td className="px-4 py-3 text-slate-600">{entry.status}</td><td className="px-4 py-3 text-slate-600">{entry.notes}</td></tr>)}
          </DataTable>
        </TabsContent>
      </Tabs>

      <Dialog open={Boolean(dialog)} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader><DialogTitle>{dialogTitle(dialog)}</DialogTitle><DialogDescription>Create or schedule a recruitment record in the HR workspace.</DialogDescription></DialogHeader>
          {dialog === 'job' && <JobRequisitionForm branches={hr.branches} onSubmit={(draft) => { hr.createJobRequisition(draft); setDialog(null); }} />}
          {dialog === 'candidate' && <CandidateForm jobs={hr.recruitmentJobs} onSubmit={(draft) => { hr.createCandidate(draft); setDialog(null); }} />}
          {dialog === 'interview' && <InterviewForm candidates={selectableCandidates} onSubmit={(draft) => { hr.scheduleInterview(draft); setDialog(null); }} />}
          {dialog === 'offer' && <OfferForm candidates={offerCandidates} onSubmit={(draft) => { hr.createOffer(draft); setDialog(null); }} />}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(liveSelectedCandidate)} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          {liveSelectedCandidate && <CandidateDetail candidate={liveSelectedCandidate} hr={hr} canViewSalary={access.canViewSalary} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CandidateDetail: React.FC<{ candidate: Candidate; hr: ReturnType<typeof useHrData>; canViewSalary: boolean }> = ({ candidate, hr, canViewSalary }) => {
  const interviews = hr.interviews.filter((interview) => interview.candidateId === candidate.id);
  const offer = hr.offers.find((item) => item.candidateId === candidate.id);
  const checks = hr.backgroundChecks.filter((check) => check.candidateId === candidate.id);
  const alreadyOnboarded = hr.employees.some((employee) => employee.email === candidate.email);
  return (
    <>
      <DialogHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><div className="flex flex-wrap items-center gap-2"><DialogTitle>{candidate.name}</DialogTitle><HrStatusBadge status={candidate.stage} /></div><DialogDescription>{candidate.candidateNumber} | {candidate.jobTitle} | {candidate.source}</DialogDescription></div>
          <div className="flex flex-wrap gap-2">{candidate.stage === 'Accepted' && <Button size="sm" variant="outline" disabled={alreadyOnboarded} onClick={() => hr.handoffCandidateToOnboarding(candidate.id)}><CheckCircle2 className="h-4 w-4" />{alreadyOnboarded ? 'Onboarded' : 'Handoff to onboarding'}</Button>}</div>
        </div>
      </DialogHeader>
      <Tabs defaultValue="profile">
        <TabsList className="max-w-full justify-start overflow-x-auto">{['profile', 'interviews', 'offer', 'background', 'notes'].map((tab) => <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>)}</TabsList>
        <TabsContent value="profile" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Email" value={candidate.email} /><Detail label="Phone" value={candidate.phone} /><Detail label="Location" value={candidate.location} /><Detail label="Expected salary" value={canViewSalary ? formatINR(candidate.expectedSalary) : 'Restricted'} /><Detail label="Notice period" value={candidate.noticePeriod} /><Detail label="Background" value={<HrStatusBadge status={candidate.backgroundCheckStatus} />} /><Detail label="Owner" value={candidate.owner} /><Detail label="Rating" value={`${candidate.rating}/5`} /><Detail label="Resume" value={candidate.resumeFile} />
          <div className="rounded-sm border border-slate-200 bg-slate-50 p-3 sm:col-span-2 lg:col-span-3"><p className="text-xs font-semibold uppercase text-slate-500">Tags</p><div className="mt-2 flex flex-wrap gap-2">{candidate.tags.map((tag) => <span key={tag} className="rounded-sm border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">{tag}</span>)}</div></div>
        </TabsContent>
        <TabsContent value="interviews" className="mt-4"><DataTable headers={['Round', 'Panel', 'Scheduled', 'Mode', 'Score', 'Status']}>{interviews.length ? interviews.map((interview) => <tr key={interview.id}><td className="px-4 py-3 font-medium text-slate-950">{interview.round}</td><td className="px-4 py-3 text-slate-600">{interview.panel.join(', ')}</td><td className="px-4 py-3 text-slate-600">{formatDateTime(interview.scheduledAt)}</td><td className="px-4 py-3 text-slate-600">{interview.mode}</td><td className="px-4 py-3 text-slate-600">{interview.score || '-'}</td><td className="px-4 py-3"><HrStatusBadge status={interview.status} /></td></tr>) : <EmptyTableRow columns={6} label="No interviews scheduled." />}</DataTable></TabsContent>
        <TabsContent value="offer" className="mt-4">{offer ? <Panel title="Offer details"><InfoRow label="Offered salary" value={canViewSalary ? formatINR(offer.offeredSalary) : 'Restricted'} /><InfoRow label="Joining date" value={offer.joiningDate} /><InfoRow label="Approver" value={offer.approver} /><InfoRow label="Status" value={offer.status} status={offer.status} /><InfoRow label="Notes" value={offer.notes || 'No notes'} /></Panel> : <EmptyState label="No offer created for this candidate." />}</TabsContent>
        <TabsContent value="background" className="mt-4"><DataTable headers={['Check', 'Owner', 'Due date', 'Status', 'Notes']}>{checks.length ? checks.map((check) => <tr key={check.id}><td className="px-4 py-3 font-medium text-slate-950">{check.checkType}</td><td className="px-4 py-3 text-slate-600">{check.owner}</td><td className="px-4 py-3 text-slate-600">{check.dueDate}</td><td className="px-4 py-3"><BackgroundStatusSelect value={check.status} onChange={(status) => hr.updateBackgroundCheckStatus(check.id, status)} /></td><td className="px-4 py-3 text-slate-600">{check.notes}</td></tr>) : <EmptyTableRow columns={5} label="No background checks opened." />}</DataTable></TabsContent>
        <TabsContent value="notes" className="mt-4 rounded-md border border-slate-200 p-4 text-sm text-slate-600">{candidate.duplicateWarning && <div className="mb-3 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">Duplicate profile warning from source history.</div>}{candidate.notes || 'No notes recorded.'}</TabsContent>
      </Tabs>
    </>
  );
};

const StageSelect: React.FC<{ value: CandidateStage; onChange: (stage: CandidateStage) => void }> = ({ value, onChange }) => <select className={selectClass} value={value} onChange={(event) => onChange(event.target.value as CandidateStage)}>{candidateStages.map((stage) => <option key={stage}>{stage}</option>)}</select>;
const InterviewStatusSelect: React.FC<{ value: InterviewStatus; onChange: (status: InterviewStatus) => void }> = ({ value, onChange }) => <select className={selectClass} value={value} onChange={(event) => onChange(event.target.value as InterviewStatus)}>{interviewStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const OfferStatusSelect: React.FC<{ value: OfferStatus; onChange: (status: OfferStatus) => void }> = ({ value, onChange }) => <select className={selectClass} value={value} onChange={(event) => onChange(event.target.value as OfferStatus)}>{offerStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const BackgroundStatusSelect: React.FC<{ value: BackgroundCheckStatus; onChange: (status: BackgroundCheckStatus) => void }> = ({ value, onChange }) => <select className={selectClass} value={value} onChange={(event) => onChange(event.target.value as BackgroundCheckStatus)}>{backgroundStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <section className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-3 font-semibold text-slate-950">{title}</h2><div className="space-y-2">{children}</div></section>;
const InfoRow: React.FC<{ label: string; value: string; status?: string }> = ({ label, value, status }) => <div className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><span className="font-medium text-slate-800">{label}</span>{status ? <HrStatusBadge status={status as OfferStatus} /> : <span className="text-right text-slate-600">{value}</span>}</div>;
const Detail: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => <div className="rounded-sm border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><div className="mt-1 text-sm font-medium text-slate-800">{value}</div></div>;
const EmptyState: React.FC<{ label: string }> = ({ label }) => <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{label}</div>;
const EmptyTableRow: React.FC<{ columns: number; label: string }> = ({ columns, label }) => <tr><td colSpan={columns} className="px-4 py-8 text-center text-sm text-slate-500">{label}</td></tr>;
const formatDateTime = (value: string) => new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const dialogTitle = (dialog: DialogType) => dialog === 'job' ? 'New job requisition' : dialog === 'candidate' ? 'Add candidate' : dialog === 'interview' ? 'Schedule interview' : dialog === 'offer' ? 'Create offer' : 'Recruitment record';

export default RecruitmentPage;
