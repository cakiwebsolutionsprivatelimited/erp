import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, CalendarCheck, CalendarX, Clock3, UserMinus, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, StatCard, formatINR } from '@/tenant/components/TenantUI';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { HR_DEMO_TODAY, getDepartmentHeadcount, getHrMetrics, getMonthlyPayrollCost } from '@/tenant/hr/hrDemoService';

const HrDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const hr = useHrData();
  const access = useHrAccess();
  const metrics = getHrMetrics(hr);
  const departmentHeadcount = getDepartmentHeadcount(hr);
  const leaveStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
  const attendanceDays = Array.from({ length: 7 }, (_, index) => `2026-06-${String(12 + index).padStart(2, '0')}`);
  const payroll = getMonthlyPayrollCost(hr);

  return (
    <div>
      <PageHeader title="HR Dashboard" description="Workforce attendance, leave, payroll, and employee health in one operational view." action={<Button onClick={() => navigate('/hr/employees')}><UserPlus className="h-4 w-4" />Add employee</Button>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <StatCard label="Total employees" value={String(metrics.totalEmployees)} hint="Active workforce" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Present today" value={String(metrics.presentToday)} hint="Present, late, half day" icon={<CalendarCheck className="h-4 w-4" />} />
        <StatCard label="Absent today" value={String(metrics.absentToday)} hint="Marked absent" icon={<UserMinus className="h-4 w-4" />} />
        <StatCard label="On leave" value={String(metrics.onLeave)} hint={HR_DEMO_TODAY} icon={<CalendarX className="h-4 w-4" />} />
        <StatCard label="Pending leave" value={String(metrics.pendingLeave)} hint="Awaiting decision" icon={<Clock3 className="h-4 w-4" />} />
        <StatCard label="Payroll due" value={String(metrics.payrollDue)} hint="June salary slips" icon={<Banknote className="h-4 w-4" />} />
        <StatCard label="New joiners" value={String(metrics.newJoiners)} hint="Joined this month" icon={<UserPlus className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Attendance trend">
          {attendanceDays.map((date) => { const entries = hr.attendance.filter((item) => item.date === date); const present = entries.filter((item) => ['Present', 'Late', 'Half Day'].includes(item.status)).length; return <Bar key={date} label={new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} value={`${present}/${entries.length}`} percent={entries.length ? (present / entries.length) * 100 : 0} tone="bg-emerald-600" />; })}
        </ChartPanel>
        <ChartPanel title="Department headcount">{departmentHeadcount.map((item) => <Bar key={item.name} label={item.name} value={item.count} percent={(item.count / Math.max(...departmentHeadcount.map((entry) => entry.count), 1)) * 100} tone="bg-indigo-600" />)}</ChartPanel>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Leave summary">{leaveStatuses.map((status) => { const count = hr.leaveRequests.filter((leave) => leave.status === status).length; return <Bar key={status} label={status} value={count} percent={(count / hr.leaveRequests.length) * 100} tone={status === 'Approved' ? 'bg-emerald-600' : status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'} />; })}</ChartPanel>
        <ChartPanel title="Payroll cost trend">{['March', 'April', 'May', 'June'].map((month, index) => <Bar key={month} label={month} value={access.canViewSalary ? formatINR(Math.round(payroll * (0.92 + index * 0.025))) : 'Restricted'} percent={92 + index * 2.5} tone="bg-cyan-600" />)}</ChartPanel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="min-w-0"><SectionHeading title="Pending leave requests" action={<Button size="sm" variant="outline" onClick={() => navigate('/hr/leave')}>Review leave</Button>} /><DataTable headers={['Employee', 'Type', 'Dates', 'Days', 'Status']}>{hr.leaveRequests.filter((leave) => leave.status === 'Pending').map((leave) => <tr key={leave.id}><td className="px-4 py-3 font-medium text-slate-950">{leave.employeeName}</td><td className="px-4 py-3 text-slate-600">{leave.leaveType}</td><td className="px-4 py-3 text-slate-600">{leave.fromDate} to {leave.toDate}</td><td className="px-4 py-3 text-slate-600">{leave.days}</td><td className="px-4 py-3"><HrStatusBadge status={leave.status} /></td></tr>)}</DataTable></div>
        <div className="min-w-0"><SectionHeading title="New joiners" action={<Button size="sm" variant="outline" onClick={() => navigate('/hr/employees')}>View employees</Button>} /><DataTable headers={['Employee', 'Department', 'Designation', 'Joining date', 'Status']}>{hr.employees.filter((employee) => employee.joiningDate >= '2026-06-01').map((employee) => <tr key={employee.id}><td className="px-4 py-3 font-medium text-slate-950">{employee.name}</td><td className="px-4 py-3 text-slate-600">{employee.department}</td><td className="px-4 py-3 text-slate-600">{employee.designation}</td><td className="px-4 py-3 text-slate-600">{employee.joiningDate}</td><td className="px-4 py-3"><HrStatusBadge status={employee.status} /></td></tr>)}</DataTable></div>
      </section>
    </div>
  );
};

const ChartPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold text-slate-950">{title}</h2><div className="mt-4 space-y-3">{children}</div></div>;
const Bar: React.FC<{ label: string; value: string | number; percent: number; tone: string }> = ({ label, value, percent, tone }) => <div><div className="flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{label}</span><span className="shrink-0 text-slate-500">{value}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.max(3, Math.min(100, percent))}%` }} /></div></div>;
const SectionHeading: React.FC<{ title: string; action: React.ReactNode }> = ({ title, action }) => <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-semibold text-slate-950">{title}</h2>{action}</div>;
export default HrDashboardPage;
