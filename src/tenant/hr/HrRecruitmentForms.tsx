import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HR_DEPARTMENTS, HR_DEMO_TODAY, HR_TEAM } from '@/tenant/hr/hrDemoService';
import type { Branch, Candidate, CandidateDraft, InterviewDraft, JobRequisition, JobRequisitionDraft, OfferDraft } from '@/tenant/hr/types';

const selectClass = 'flex h-10 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';
const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>;

export const JobRequisitionForm: React.FC<{ branches: Branch[]; onSubmit: (draft: JobRequisitionDraft) => void }> = ({ branches, onSubmit }) => {
  const [draft, setDraft] = useState<JobRequisitionDraft>({ title: 'Implementation Engineer', department: 'Engineering', branchId: branches[0]?.id || '', hiringManager: 'Priya Mishra', headcount: 1, budgetMin: 32000, budgetMax: 45000, experience: '2-4 years', employmentType: 'Full Time', priority: 'Medium', approvalStatus: 'Pending Approval', status: 'Draft', openedDate: HR_DEMO_TODAY, targetDate: '2026-07-31', description: '' });
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Role title"><Input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></Field>
      <Field label="Department"><select className={selectClass} value={draft.department} onChange={(event) => setDraft({ ...draft, department: event.target.value })}>{HR_DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Branch"><select className={selectClass} value={draft.branchId} onChange={(event) => setDraft({ ...draft, branchId: event.target.value })}>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></Field>
      <Field label="Hiring manager"><select className={selectClass} value={draft.hiringManager} onChange={(event) => setDraft({ ...draft, hiringManager: event.target.value })}>{HR_TEAM.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Headcount"><Input type="number" min="1" value={draft.headcount} onChange={(event) => setDraft({ ...draft, headcount: Number(event.target.value) })} /></Field>
      <Field label="Experience"><Input value={draft.experience} onChange={(event) => setDraft({ ...draft, experience: event.target.value })} /></Field>
      <Field label="Budget min"><Input type="number" min="0" value={draft.budgetMin} onChange={(event) => setDraft({ ...draft, budgetMin: Number(event.target.value) })} /></Field>
      <Field label="Budget max"><Input type="number" min="0" value={draft.budgetMax} onChange={(event) => setDraft({ ...draft, budgetMax: Number(event.target.value) })} /></Field>
      <Field label="Employment type"><select className={selectClass} value={draft.employmentType} onChange={(event) => setDraft({ ...draft, employmentType: event.target.value })}>{['Full Time', 'Part Time', 'Contract', 'Intern'].map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Priority"><select className={selectClass} value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as JobRequisitionDraft['priority'] })}>{['Low', 'Medium', 'High'].map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Approval"><select className={selectClass} value={draft.approvalStatus} onChange={(event) => setDraft({ ...draft, approvalStatus: event.target.value as JobRequisitionDraft['approvalStatus'] })}>{['Draft', 'Pending Approval', 'Approved', 'Rejected'].map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Status"><select className={selectClass} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as JobRequisitionDraft['status'] })}>{['Draft', 'Open', 'On Hold', 'Closed'].map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Opened date"><Input type="date" value={draft.openedDate} onChange={(event) => setDraft({ ...draft, openedDate: event.target.value })} /></Field>
      <Field label="Target date"><Input type="date" value={draft.targetDate} onChange={(event) => setDraft({ ...draft, targetDate: event.target.value })} /></Field>
      <Field label="Role description" className="sm:col-span-2"><Textarea required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Create requisition</Button></div>
    </form>
  );
};

export const CandidateForm: React.FC<{ jobs: JobRequisition[]; onSubmit: (draft: CandidateDraft) => void }> = ({ jobs, onSubmit }) => {
  const [tagText, setTagText] = useState('Support, Training');
  const [draft, setDraft] = useState<CandidateDraft>({ jobId: jobs[0]?.id || '', name: '', email: '', phone: '', location: 'Bhubaneswar', source: 'Career Page', expectedSalary: 32000, noticePeriod: 'Immediate', appliedDate: HR_DEMO_TODAY, owner: 'Priya Mishra', tags: ['Support', 'Training'], resumeFile: 'candidate-resume.pdf', notes: '' });
  const updateTags = (value: string) => {
    setTagText(value);
    setDraft({ ...draft, tags: value.split(',').map((item) => item.trim()).filter(Boolean) });
  };
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Job"><select className={selectClass} value={draft.jobId} onChange={(event) => setDraft({ ...draft, jobId: event.target.value })}>{jobs.map((job) => <option key={job.id} value={job.id}>{job.title} - {job.department}</option>)}</select></Field>
      <Field label="Source"><select className={selectClass} value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value })}>{['Career Page', 'Referral', 'LinkedIn', 'Internal', 'Agency'].map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Candidate name"><Input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field>
      <Field label="Email"><Input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></Field>
      <Field label="Phone"><Input required value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></Field>
      <Field label="Location"><Input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></Field>
      <Field label="Expected salary"><Input type="number" min="0" value={draft.expectedSalary} onChange={(event) => setDraft({ ...draft, expectedSalary: Number(event.target.value) })} /></Field>
      <Field label="Notice period"><Input value={draft.noticePeriod} onChange={(event) => setDraft({ ...draft, noticePeriod: event.target.value })} /></Field>
      <Field label="Applied date"><Input type="date" value={draft.appliedDate} onChange={(event) => setDraft({ ...draft, appliedDate: event.target.value })} /></Field>
      <Field label="Owner"><select className={selectClass} value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value })}>{HR_TEAM.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Resume file"><Input value={draft.resumeFile} onChange={(event) => setDraft({ ...draft, resumeFile: event.target.value })} /></Field>
      <Field label="Tags"><Input value={tagText} onChange={(event) => updateTags(event.target.value)} /></Field>
      <Field label="Notes" className="sm:col-span-2"><Textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Add candidate</Button></div>
    </form>
  );
};

export const InterviewForm: React.FC<{ candidates: Candidate[]; onSubmit: (draft: InterviewDraft) => void }> = ({ candidates, onSubmit }) => {
  const firstCandidate = candidates[0];
  const [panelText, setPanelText] = useState('Priya Mishra, Sonal Patnaik');
  const [draft, setDraft] = useState<InterviewDraft>({ candidateId: firstCandidate?.id || '', jobId: firstCandidate?.jobId || '', round: 'Manager Round', panel: ['Priya Mishra', 'Sonal Patnaik'], scheduledAt: '2026-06-24T11:00', mode: 'Video' });
  const changeCandidate = (candidateId: string) => {
    const candidate = candidates.find((item) => item.id === candidateId);
    setDraft({ ...draft, candidateId, jobId: candidate?.jobId || draft.jobId });
  };
  const updatePanel = (value: string) => {
    setPanelText(value);
    setDraft({ ...draft, panel: value.split(',').map((item) => item.trim()).filter(Boolean) });
  };
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Candidate"><select className={selectClass} value={draft.candidateId} onChange={(event) => changeCandidate(event.target.value)}>{candidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} - {candidate.jobTitle}</option>)}</select></Field>
      <Field label="Round"><select className={selectClass} value={draft.round} onChange={(event) => setDraft({ ...draft, round: event.target.value })}>{['HR Screening', 'Technical Round', 'Manager Round', 'Final Round'].map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Scheduled at"><Input type="datetime-local" value={draft.scheduledAt} onChange={(event) => setDraft({ ...draft, scheduledAt: event.target.value })} /></Field>
      <Field label="Mode"><select className={selectClass} value={draft.mode} onChange={(event) => setDraft({ ...draft, mode: event.target.value as InterviewDraft['mode'] })}>{['Video', 'In person', 'Phone'].map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Panel" className="sm:col-span-2"><Input value={panelText} onChange={(event) => updatePanel(event.target.value)} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Schedule interview</Button></div>
    </form>
  );
};

export const OfferForm: React.FC<{ candidates: Candidate[]; onSubmit: (draft: OfferDraft) => void }> = ({ candidates, onSubmit }) => {
  const firstCandidate = candidates[0];
  const [draft, setDraft] = useState<OfferDraft>({ candidateId: firstCandidate?.id || '', offeredSalary: firstCandidate?.expectedSalary || 32000, joiningDate: '2026-07-15', approver: 'Bibhudutta Dash', notes: '' });
  const changeCandidate = (candidateId: string) => {
    const candidate = candidates.find((item) => item.id === candidateId);
    setDraft({ ...draft, candidateId, offeredSalary: candidate?.expectedSalary || draft.offeredSalary });
  };
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Candidate"><select className={selectClass} value={draft.candidateId} onChange={(event) => changeCandidate(event.target.value)}>{candidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} - {candidate.jobTitle}</option>)}</select></Field>
      <Field label="Approver"><select className={selectClass} value={draft.approver} onChange={(event) => setDraft({ ...draft, approver: event.target.value })}>{HR_TEAM.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Offered salary"><Input type="number" min="0" value={draft.offeredSalary} onChange={(event) => setDraft({ ...draft, offeredSalary: Number(event.target.value) })} /></Field>
      <Field label="Joining date"><Input type="date" value={draft.joiningDate} onChange={(event) => setDraft({ ...draft, joiningDate: event.target.value })} /></Field>
      <Field label="Notes" className="sm:col-span-2"><Textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit">Create offer</Button></div>
    </form>
  );
};
