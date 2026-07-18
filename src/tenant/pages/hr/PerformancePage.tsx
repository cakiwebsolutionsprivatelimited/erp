import React, { useMemo, useState } from 'react';
import { MessageSquarePlus, Star, Target, TrendingUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import type { Employee, PerformanceFeedbackDraft, PerformanceFeedbackType, PerformanceGoalStatus, PerformanceReviewStatus } from '@/tenant/hr/types';

const goalStatuses: PerformanceGoalStatus[] = ['Not Started', 'On Track', 'At Risk', 'Completed'];
const reviewStatuses: PerformanceReviewStatus[] = ['Draft', 'Self Review', 'Manager Review', 'Calibration', 'Finalized'];
const feedbackTypes: PerformanceFeedbackType[] = ['Recognition', 'Coaching', 'Improvement', 'Manager Note'];
const selectClass = 'flex h-9 w-full min-w-36 rounded-sm border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

const PerformancePage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const canManagePerformance = ['Business Owner', 'HR Admin', 'Manager'].includes(access.activeRole);
  const [query, setQuery] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const visibleEmployees = useMemo(() => hr.employees.filter((employee) => access.isEmployeeInScope(employee.id)), [access, hr.employees]);
  const visibleEmployeeIds = access.scopedEmployeeIds;
  const visibleGoals = hr.performanceGoals.filter((goal) => visibleEmployeeIds.has(goal.employeeId));
  const visibleReviews = hr.performanceReviews.filter((review) => visibleEmployeeIds.has(review.employeeId));
  const visibleFeedback = hr.performanceFeedback.filter((feedback) => visibleEmployeeIds.has(feedback.employeeId));
  const filteredGoals = useMemo(() => visibleGoals.filter((goal) => `${goal.employeeName} ${goal.title} ${goal.metric} ${goal.owner}`.toLowerCase().includes(query.toLowerCase())), [query, visibleGoals]);
  const activeCycle = hr.performanceCycles.find((cycle) => cycle.status === 'Active');
  const atRiskGoals = visibleGoals.filter((goal) => goal.status === 'At Risk').length;
  const pendingReviews = visibleReviews.filter((review) => review.status !== 'Finalized').length;
  const ratedReviews = visibleReviews.filter((review) => (review.finalRating || review.managerRating) > 0);
  const averageRating = ratedReviews.length ? (ratedReviews.reduce((sum, review) => sum + (review.finalRating || review.managerRating), 0) / ratedReviews.length).toFixed(1) : '-';

  return (
    <div>
      <PageHeader
        title="Performance"
        description="Goals, review cycles, manager ratings, coaching feedback, and team performance snapshots."
        action={canManagePerformance ? <Button onClick={() => setFeedbackOpen(true)}><MessageSquarePlus className="h-4 w-4" />Add feedback</Button> : undefined}
      />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active cycle" value={activeCycle?.name || 'No active cycle'} hint={activeCycle?.period} icon={<Trophy className="h-4 w-4" />} />
        <StatCard label="Tracked goals" value={String(visibleGoals.length)} icon={<Target className="h-4 w-4" />} />
        <StatCard label="At-risk goals" value={String(atRiskGoals)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Average rating" value={averageRating} hint={`${pendingReviews} review(s) open`} icon={<Star className="h-4 w-4" />} />
      </section>

      <Tabs defaultValue="goals">
        <TabsList className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="cycles">Cycles</TabsTrigger>
          <TabsTrigger value="snapshot">Team Snapshot</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="mt-4">
          <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search goals, employees, metrics, or owners" /></div>
          <DataTable headers={['Employee', 'Goal', 'Metric', 'Progress', 'Weight', 'Due date', 'Owner', 'Status']}>
            {filteredGoals.map((goal) => (
              <tr key={goal.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{goal.employeeName}</td>
                <td className="max-w-72 px-4 py-3 text-slate-600">{goal.title}</td>
                <td className="px-4 py-3 text-slate-600">{goal.metric}</td>
                <td className="px-4 py-3"><Progress value={goal.current} target={goal.target} /></td>
                <td className="px-4 py-3 text-slate-600">{goal.weight}%</td>
                <td className="px-4 py-3 text-slate-600">{goal.dueDate}</td>
                <td className="px-4 py-3 text-slate-600">{goal.owner}</td>
                <td className="px-4 py-3"><GoalStatusSelect value={goal.status} disabled={!canManagePerformance} onChange={(status) => hr.updatePerformanceGoalStatus(goal.id, status)} /></td>
              </tr>
            ))}
            {!filteredGoals.length && <EmptyTableRow columns={8} label="No performance goals match this view." />}
          </DataTable>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <DataTable headers={['Employee', 'Cycle', 'Reviewer', 'Self', 'Manager', 'Final', 'Summary', 'Status']}>
            {visibleReviews.map((review) => (
              <tr key={review.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{review.employeeName}</td>
                <td className="px-4 py-3 text-slate-600">{review.cycleName}</td>
                <td className="px-4 py-3 text-slate-600">{review.reviewer}</td>
                <td className="px-4 py-3 text-slate-600">{formatRating(review.selfRating)}</td>
                <td className="px-4 py-3 text-slate-600">{formatRating(review.managerRating)}</td>
                <td className="px-4 py-3 font-semibold text-slate-950">{formatRating(review.finalRating)}</td>
                <td className="max-w-80 px-4 py-3 text-slate-600">{review.summary}</td>
                <td className="px-4 py-3"><ReviewStatusSelect value={review.status} disabled={!canManagePerformance} onChange={(status) => hr.updatePerformanceReviewStatus(review.id, status)} /></td>
              </tr>
            ))}
            {!visibleReviews.length && <EmptyTableRow columns={8} label="No reviews available for this role." />}
          </DataTable>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4">
          <DataTable headers={['Employee', 'From', 'Type', 'Date', 'Note']}>
            {visibleFeedback.map((feedback) => (
              <tr key={feedback.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{feedback.employeeName}</td>
                <td className="px-4 py-3 text-slate-600">{feedback.from}</td>
                <td className="px-4 py-3"><HrStatusBadge status={feedback.type === 'Recognition' ? 'Verified' : feedback.type === 'Improvement' ? 'At Risk' : 'In Progress'} /></td>
                <td className="px-4 py-3 text-slate-600">{feedback.date}</td>
                <td className="max-w-96 px-4 py-3 text-slate-600">{feedback.note}</td>
              </tr>
            ))}
            {!visibleFeedback.length && <EmptyTableRow columns={5} label="No feedback has been recorded for this view." />}
          </DataTable>
        </TabsContent>

        <TabsContent value="cycles" className="mt-4">
          <DataTable headers={['Cycle', 'Period', 'Owner', 'Dates', 'Goals', 'Reviews', 'Status']}>
            {hr.performanceCycles.map((cycle) => (
              <tr key={cycle.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{cycle.name}</td>
                <td className="px-4 py-3 text-slate-600">{cycle.period}</td>
                <td className="px-4 py-3 text-slate-600">{cycle.owner}</td>
                <td className="px-4 py-3 text-slate-600">{cycle.startDate} to {cycle.endDate}</td>
                <td className="px-4 py-3 text-slate-600">{visibleGoals.filter((goal) => goal.cycleId === cycle.id).length}</td>
                <td className="px-4 py-3 text-slate-600">{visibleReviews.filter((review) => review.cycleId === cycle.id).length}</td>
                <td className="px-4 py-3"><HrStatusBadge status={cycle.status} /></td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>

        <TabsContent value="snapshot" className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleEmployees.map((employee) => {
            const goals = visibleGoals.filter((goal) => goal.employeeId === employee.id);
            const review = visibleReviews.find((item) => item.employeeId === employee.id);
            const completed = goals.filter((goal) => goal.status === 'Completed').length;
            const atRisk = goals.filter((goal) => goal.status === 'At Risk').length;
            return (
              <article key={employee.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-950">{employee.name}</h2>
                    <p className="mt-1 text-xs text-slate-500">{employee.designation} | {employee.manager}</p>
                  </div>
                  {review && <HrStatusBadge status={review.status} />}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Metric label="Goals" value={String(goals.length)} />
                  <Metric label="Done" value={String(completed)} />
                  <Metric label="Risk" value={String(atRisk)} />
                </div>
                <p className="mt-3 text-sm text-slate-600">{review?.feedback || 'Review feedback not recorded yet.'}</p>
              </article>
            );
          })}
        </TabsContent>
      </Tabs>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add performance feedback</DialogTitle>
            <DialogDescription>Record static recognition, coaching, improvement, or manager notes for the selected employee.</DialogDescription>
          </DialogHeader>
          <FeedbackForm employees={visibleEmployees} onSubmit={(draft) => { hr.createPerformanceFeedback(draft); setFeedbackOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FeedbackForm: React.FC<{ employees: Employee[]; onSubmit: (draft: PerformanceFeedbackDraft) => void }> = ({ employees, onSubmit }) => {
  const [draft, setDraft] = useState<PerformanceFeedbackDraft>({ employeeId: employees[0]?.id || '', from: 'Demo User', type: 'Recognition', note: '' });
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Field label="Employee"><select required className={selectClass} value={draft.employeeId} onChange={(event) => setDraft({ ...draft, employeeId: event.target.value })}>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></Field>
      <Field label="From"><Input value={draft.from} onChange={(event) => setDraft({ ...draft, from: event.target.value })} /></Field>
      <Field label="Type"><select className={selectClass} value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as PerformanceFeedbackType })}>{feedbackTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
      <Field label="Note" className="sm:col-span-2"><Textarea required value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit" disabled={!draft.employeeId}>Save feedback</Button></div>
    </form>
  );
};

const GoalStatusSelect: React.FC<{ value: PerformanceGoalStatus; disabled: boolean; onChange: (status: PerformanceGoalStatus) => void }> = ({ value, disabled, onChange }) => <select className={selectClass} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as PerformanceGoalStatus)}>{goalStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const ReviewStatusSelect: React.FC<{ value: PerformanceReviewStatus; disabled: boolean; onChange: (status: PerformanceReviewStatus) => void }> = ({ value, disabled, onChange }) => <select className={selectClass} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as PerformanceReviewStatus)}>{reviewStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const Progress: React.FC<{ value: number; target: number }> = ({ value, target }) => {
  const percent = Math.max(0, Math.min(100, (value / Math.max(target, 1)) * 100));
  return <div className="min-w-40"><div className="flex justify-between gap-3 text-xs text-slate-500"><span>{value}/{target}</span><span>{Math.round(percent)}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.max(4, percent)}%` }} /></div></div>;
};
const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="rounded-sm bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-slate-950">{value}</p></div>;
const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>;
const EmptyTableRow: React.FC<{ columns: number; label: string }> = ({ columns, label }) => <tr><td colSpan={columns} className="px-4 py-8 text-center text-sm text-slate-500">{label}</td></tr>;
const formatRating = (value?: number) => value && value > 0 ? value.toFixed(1) : '-';

export default PerformancePage;
