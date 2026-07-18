import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HR_DEPARTMENTS, HR_DEMO_TODAY, HR_TEAM } from '@/tenant/hr/hrDemoService';
import type { AttendanceDraft, Branch, Employee, EmployeeDraft, LeaveDraft, ShiftGroup } from '@/tenant/hr/types';

const selectClass = 'flex h-10 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';
const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>;
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <fieldset className="grid gap-4 rounded-md border border-slate-200 p-4 sm:grid-cols-2"><legend className="px-2 text-sm font-semibold text-slate-800">{title}</legend>{children}</fieldset>;

export const EmployeeForm: React.FC<{ onSubmit: (draft: EmployeeDraft) => void; branches?: Branch[]; shiftGroups?: ShiftGroup[] }> = ({ onSubmit, branches = [], shiftGroups = [] }) => {
  const defaultBranch = branches[0];
  const defaultShift = shiftGroups.find((shift) => shift.branchId === defaultBranch?.id) || shiftGroups[0];
  const [skillText, setSkillText] = useState('ERP implementation, Customer support');
  const [draft, setDraft] = useState<EmployeeDraft>({
    name: '',
    dateOfBirth: '1995-01-01',
    gender: 'Female',
    phone: '',
    email: '',
    address: '',
    department: 'Engineering',
    designation: '',
    manager: 'Priya Mishra',
    joiningDate: HR_DEMO_TODAY,
    employmentType: 'Full Time',
    status: 'Probation',
    branchId: defaultBranch?.id,
    branchName: defaultBranch?.name,
    shiftGroupId: defaultShift?.id,
    shiftGroupName: defaultShift?.name,
    probationEndDate: '2026-09-18',
    salary: { basic: 30000, allowances: 10000, deductions: 0, pf: 3600, esi: 0 },
    bankName: '',
    bankAccountLast4: '',
    emergencyContacts: [{ name: '', relationship: 'Parent', phone: '' }],
    governmentIds: [{ type: 'PAN', valueLast4: '', verified: false }, { type: 'Aadhaar', valueLast4: '', verified: false }],
    skills: [{ name: 'ERP implementation', level: 'Intermediate' }, { name: 'Customer support', level: 'Intermediate' }],
    education: [],
    experience: [],
    employmentHistory: [],
    notes: '',
  });
  const changeBranch = (branchId: string) => {
    const branch = branches.find((item) => item.id === branchId);
    const shift = shiftGroups.find((item) => item.branchId === branchId) || shiftGroups[0];
    setDraft({ ...draft, branchId, branchName: branch?.name, shiftGroupId: shift?.id, shiftGroupName: shift?.name });
  };
  const changeShift = (shiftId: string) => {
    const shift = shiftGroups.find((item) => item.id === shiftId);
    setDraft({ ...draft, shiftGroupId: shiftId, shiftGroupName: shift?.name });
  };
  const updateEmergency = (key: 'name' | 'relationship' | 'phone', value: string) => {
    const contact = draft.emergencyContacts?.[0] || { name: '', relationship: '', phone: '' };
    setDraft({ ...draft, emergencyContacts: [{ ...contact, [key]: value }] });
  };
  const updateGovernmentId = (type: 'PAN' | 'Aadhaar', valueLast4: string) => {
    const nextIds = (draft.governmentIds || []).map((item) => item.type === type ? { ...item, valueLast4 } : item);
    setDraft({ ...draft, governmentIds: nextIds });
  };
  const updateSkills = (value: string) => {
    setSkillText(value);
    setDraft({ ...draft, skills: value.split(',').map((name) => name.trim()).filter(Boolean).map((name) => ({ name, level: 'Intermediate' })) });
  };
  const updateSalary = (key: keyof EmployeeDraft['salary'], value: number) => setDraft({ ...draft, salary: { ...draft.salary, [key]: value } });
  return (
    <form className="max-h-[72vh] space-y-4 overflow-y-auto pr-1" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}>
      <Section title="Personal details"><Field label="Full name"><Input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field><Field label="Date of birth"><Input type="date" required value={draft.dateOfBirth} onChange={(event) => setDraft({ ...draft, dateOfBirth: event.target.value })} /></Field><Field label="Gender"><select className={selectClass} value={draft.gender} onChange={(event) => setDraft({ ...draft, gender: event.target.value })}>{['Female', 'Male', 'Non-binary', 'Prefer not to say'].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Employment status"><select className={selectClass} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as EmployeeDraft['status'] })}>{['Active', 'Probation', 'Notice Period', 'Inactive'].map((item) => <option key={item}>{item}</option>)}</select></Field></Section>
      <Section title="Contact details"><Field label="Phone"><Input required value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></Field><Field label="Email"><Input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></Field><Field label="Emergency contact"><Input value={draft.emergencyContacts?.[0]?.name || ''} onChange={(event) => updateEmergency('name', event.target.value)} /></Field><Field label="Emergency phone"><Input value={draft.emergencyContacts?.[0]?.phone || ''} onChange={(event) => updateEmergency('phone', event.target.value)} /></Field><Field label="Address" className="sm:col-span-2"><Textarea required value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} /></Field></Section>
      <Section title="Job details"><Field label="Department"><select className={selectClass} value={draft.department} onChange={(event) => setDraft({ ...draft, department: event.target.value })}>{HR_DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Designation"><Input required value={draft.designation} onChange={(event) => setDraft({ ...draft, designation: event.target.value })} /></Field><Field label="Manager"><select className={selectClass} value={draft.manager} onChange={(event) => setDraft({ ...draft, manager: event.target.value })}>{HR_TEAM.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Joining date"><Input type="date" required value={draft.joiningDate} onChange={(event) => setDraft({ ...draft, joiningDate: event.target.value })} /></Field><Field label="Employment type"><select className={selectClass} value={draft.employmentType} onChange={(event) => setDraft({ ...draft, employmentType: event.target.value })}>{['Full Time', 'Part Time', 'Contract', 'Intern'].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Branch"><select className={selectClass} value={draft.branchId || ''} onChange={(event) => changeBranch(event.target.value)}>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></Field><Field label="Shift group"><select className={selectClass} value={draft.shiftGroupId || ''} onChange={(event) => changeShift(event.target.value)}>{shiftGroups.map((shift) => <option key={shift.id} value={shift.id}>{shift.name}</option>)}</select></Field><Field label="Probation end date"><Input type="date" value={draft.probationEndDate || ''} onChange={(event) => setDraft({ ...draft, probationEndDate: event.target.value })} /></Field></Section>
      <Section title="Identity and skills"><Field label="PAN last 4"><Input maxLength={4} value={draft.governmentIds?.find((item) => item.type === 'PAN')?.valueLast4 || ''} onChange={(event) => updateGovernmentId('PAN', event.target.value)} /></Field><Field label="Aadhaar last 4"><Input maxLength={4} value={draft.governmentIds?.find((item) => item.type === 'Aadhaar')?.valueLast4 || ''} onChange={(event) => updateGovernmentId('Aadhaar', event.target.value)} /></Field><Field label="Skills" className="sm:col-span-2"><Input value={skillText} onChange={(event) => updateSkills(event.target.value)} /></Field></Section>
      <Section title="Salary details">{(['basic', 'allowances', 'deductions', 'pf', 'esi'] as const).map((key) => <Field key={key} label={key === 'pf' ? 'PF' : key === 'esi' ? 'ESI' : key[0].toUpperCase() + key.slice(1)}><Input type="number" min="0" value={draft.salary[key]} onChange={(event) => updateSalary(key, Number(event.target.value))} /></Field>)}</Section>
      <Section title="Bank details"><Field label="Bank name"><Input value={draft.bankName} onChange={(event) => setDraft({ ...draft, bankName: event.target.value })} /></Field><Field label="Account last 4 digits"><Input maxLength={4} value={draft.bankAccountLast4} onChange={(event) => setDraft({ ...draft, bankAccountLast4: event.target.value })} /></Field></Section>
      <Section title="Documents and notes">
        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
          {['Identity proof', 'Bank proof', 'Signed contract'].map((label) => (
            <Label key={label} className="block rounded-sm border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
              <span className="mb-2 block">{label}</span>
              <Input type="file" />
            </Label>
          ))}
        </div>
        <Field label="HR notes" className="sm:col-span-2"><Textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></Field>
      </Section>
      <div className="flex justify-end"><Button type="submit">Add employee</Button></div>
    </form>
  );
};

export const AttendanceForm: React.FC<{ employees: Employee[]; onSubmit: (draft: AttendanceDraft) => void }> = ({ employees, onSubmit }) => {
  const [draft, setDraft] = useState<AttendanceDraft>({ employeeId: employees[0]?.id || '', date: HR_DEMO_TODAY, checkIn: '09:30', checkOut: '18:00', status: 'Present', location: 'Bhubaneswar Office' });
  return <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}><Field label="Employee"><select className={selectClass} value={draft.employeeId} onChange={(event) => setDraft({ ...draft, employeeId: event.target.value })}>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></Field><Field label="Date"><Input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></Field><Field label="Check-in"><Input type="time" value={draft.checkIn} onChange={(event) => setDraft({ ...draft, checkIn: event.target.value })} /></Field><Field label="Check-out"><Input type="time" value={draft.checkOut} onChange={(event) => setDraft({ ...draft, checkOut: event.target.value })} /></Field><Field label="Status"><select className={selectClass} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as AttendanceDraft['status'] })}>{['Present', 'Absent', 'Half Day', 'Late', 'Leave', 'Holiday'].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Location"><Input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></Field><div className="flex justify-end sm:col-span-2"><Button type="submit">Mark attendance</Button></div></form>;
};

export const LeaveForm: React.FC<{ employees: Employee[]; onSubmit: (draft: LeaveDraft) => void }> = ({ employees, onSubmit }) => {
  const [draft, setDraft] = useState<LeaveDraft>({ employeeId: employees[0]?.id || '', leaveType: 'Casual Leave', fromDate: '2026-06-23', toDate: '2026-06-23', reason: '' });
  return <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}><Field label="Employee"><select className={selectClass} value={draft.employeeId} onChange={(event) => setDraft({ ...draft, employeeId: event.target.value })}>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></Field><Field label="Leave type"><select className={selectClass} value={draft.leaveType} onChange={(event) => setDraft({ ...draft, leaveType: event.target.value })}>{['Casual Leave', 'Sick Leave', 'Earned Leave', 'Comp Off', 'Unpaid Leave'].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="From date"><Input type="date" value={draft.fromDate} onChange={(event) => setDraft({ ...draft, fromDate: event.target.value })} /></Field><Field label="To date"><Input type="date" min={draft.fromDate} value={draft.toDate} onChange={(event) => setDraft({ ...draft, toDate: event.target.value })} /></Field><Field label="Reason" className="sm:col-span-2"><Textarea required value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} /></Field><div className="flex justify-end sm:col-span-2"><Button type="submit">Apply leave</Button></div></form>;
};
