import type { AssetActivity, AttendanceCorrection, AttendanceEntry, AttendanceException, AttendanceStatus, BackgroundCheck, Branch, Candidate, Designation, DocumentRequest, DocumentTemplate, Employee, EmployeeDocument, EmployeeLifecycleEvent, Holiday, HrAsset, HrAuditLog, HrStateShape, InterviewRound, JobPosting, JobRequisition, LeaveApprovalEntry, LeaveBalance, LeavePolicy, LeaveRequest, OffboardingItem, Offer, OnboardingTask, PayrollAdjustment, PayrollRun, PerformanceCycle, PerformanceFeedback, PerformanceGoal, PerformanceReview, RolePermission, SalaryComponent, SalaryRelease, SalaryRevision, SalarySlip, ShiftGroup, TalentPoolEntry } from '@/tenant/hr/types';

export const HR_DEMO_TODAY = '2026-06-18';
export const HR_TEAM = ['Bibhudutta Dash', 'Anita Das', 'Rakesh Sahoo', 'Priya Mishra', 'Sameer Patnaik', 'Debasis Rout', 'Sonal Patnaik', 'Arjun Behera'];
export const HR_DEPARTMENTS = ['Management', 'Sales', 'Operations', 'Finance', 'Engineering', 'Customer Success'];
export const HR_WORKING_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const HR_PERMISSION_MENUS = ['Dashboard', 'Employees', 'Recruitment', 'Onboarding', 'Attendance', 'Shifts & Roster', 'Leave', 'Payroll', 'Performance', 'Self Service', 'Departments', 'Documents', 'Assets', 'Reports', 'Settings'];

const baseEmployees: Employee[] = [
  { id: 'HE-1', employeeNumber: 'EMP-001', name: 'Bibhudutta Dash', dateOfBirth: '1988-03-12', gender: 'Male', phone: '+91 94370 10001', email: 'owner@vumtech.example', address: 'Patia, Bhubaneswar', department: 'Management', designation: 'Managing Director', manager: 'Board', joiningDate: '2021-04-01', employmentType: 'Full Time', status: 'Active', salary: { basic: 95000, allowances: 42000, deductions: 4500, pf: 11400, esi: 0 }, bankName: 'HDFC Bank', bankAccountLast4: '2041', notes: 'Founder and business owner.' },
  { id: 'HE-2', employeeNumber: 'EMP-002', name: 'Anita Das', dateOfBirth: '1991-08-20', gender: 'Female', phone: '+91 94370 10002', email: 'anita@vumtech.example', address: 'Saheed Nagar, Bhubaneswar', department: 'Sales', designation: 'Sales Manager', manager: 'Bibhudutta Dash', joiningDate: '2022-01-10', employmentType: 'Full Time', status: 'Active', salary: { basic: 54000, allowances: 18000, deductions: 1800, pf: 6480, esi: 0 }, bankName: 'ICICI Bank', bankAccountLast4: '1184', notes: 'Leads enterprise and channel sales.' },
  { id: 'HE-3', employeeNumber: 'EMP-003', name: 'Rakesh Sahoo', dateOfBirth: '1995-05-18', gender: 'Male', phone: '+91 94370 10003', email: 'rakesh@vumtech.example', address: 'CDA, Cuttack', department: 'Sales', designation: 'Sales Executive', manager: 'Anita Das', joiningDate: '2023-06-05', employmentType: 'Full Time', status: 'Active', salary: { basic: 32000, allowances: 11500, deductions: 900, pf: 3840, esi: 0 }, bankName: 'Axis Bank', bankAccountLast4: '6612', notes: 'Handles SME accounts in coastal Odisha.' },
  { id: 'HE-4', employeeNumber: 'EMP-004', name: 'Priya Mishra', dateOfBirth: '1992-11-02', gender: 'Female', phone: '+91 94370 10004', email: 'priya@vumtech.example', address: 'Khandagiri, Bhubaneswar', department: 'Operations', designation: 'Operations Manager', manager: 'Bibhudutta Dash', joiningDate: '2022-08-16', employmentType: 'Full Time', status: 'Active', salary: { basic: 58000, allowances: 21000, deductions: 1600, pf: 6960, esi: 0 }, bankName: 'SBI', bankAccountLast4: '4022', notes: 'Owns customer delivery and internal operations.' },
  { id: 'HE-5', employeeNumber: 'EMP-005', name: 'Sameer Patnaik', dateOfBirth: '1989-01-29', gender: 'Male', phone: '+91 94370 10005', email: 'sameer@vumtech.example', address: 'Old Town, Bhubaneswar', department: 'Finance', designation: 'Accountant', manager: 'Bibhudutta Dash', joiningDate: '2024-02-01', employmentType: 'Full Time', status: 'Notice Period', salary: { basic: 41000, allowances: 13500, deductions: 1200, pf: 4920, esi: 0 }, bankName: 'Bank of Baroda', bankAccountLast4: '9077', notes: 'Notice period ends July 15.' },
  { id: 'HE-6', employeeNumber: 'EMP-006', name: 'Debasis Rout', dateOfBirth: '1994-07-06', gender: 'Male', phone: '+91 94370 10006', email: 'debasis@vumtech.example', address: 'Rasulgarh, Bhubaneswar', department: 'Engineering', designation: 'Implementation Engineer', manager: 'Priya Mishra', joiningDate: '2024-09-09', employmentType: 'Full Time', status: 'Active', salary: { basic: 44000, allowances: 15500, deductions: 1050, pf: 5280, esi: 0 }, bankName: 'HDFC Bank', bankAccountLast4: '3308', notes: 'Implementation and field hardware specialist.' },
  { id: 'HE-7', employeeNumber: 'EMP-007', name: 'Sonal Patnaik', dateOfBirth: '1997-02-14', gender: 'Female', phone: '+91 94370 10007', email: 'sonal@vumtech.example', address: 'Nayapalli, Bhubaneswar', department: 'Customer Success', designation: 'Support Specialist', manager: 'Priya Mishra', joiningDate: '2025-03-17', employmentType: 'Full Time', status: 'Active', salary: { basic: 30000, allowances: 9800, deductions: 600, pf: 3600, esi: 0 }, bankName: 'Kotak Mahindra Bank', bankAccountLast4: '7814', notes: 'Owns helpdesk queues and customer training.' },
  { id: 'HE-8', employeeNumber: 'EMP-008', name: 'Arjun Behera', dateOfBirth: '1998-09-23', gender: 'Male', phone: '+91 94370 10008', email: 'arjun@vumtech.example', address: 'Mancheswar, Bhubaneswar', department: 'Engineering', designation: 'Field Technician', manager: 'Priya Mishra', joiningDate: '2026-06-03', employmentType: 'Full Time', status: 'Probation', salary: { basic: 26000, allowances: 8200, deductions: 400, pf: 3120, esi: 0 }, bankName: 'SBI', bankAccountLast4: '5129', notes: 'New joiner in the field service team.' },
];

const employeeWorkProfiles = [
  { branchId: 'HB-1', branchName: 'Bhubaneswar HQ', shiftGroupId: 'HSG-1', shiftGroupName: 'General Office' },
  { branchId: 'HB-1', branchName: 'Bhubaneswar HQ', shiftGroupId: 'HSG-1', shiftGroupName: 'General Office' },
  { branchId: 'HB-2', branchName: 'Cuttack Service Desk', shiftGroupId: 'HSG-2', shiftGroupName: 'Support Desk Morning' },
  { branchId: 'HB-1', branchName: 'Bhubaneswar HQ', shiftGroupId: 'HSG-1', shiftGroupName: 'General Office' },
  { branchId: 'HB-1', branchName: 'Bhubaneswar HQ', shiftGroupId: 'HSG-1', shiftGroupName: 'General Office' },
  { branchId: 'HB-3', branchName: 'Rourkela Field Hub', shiftGroupId: 'HSG-3', shiftGroupName: 'Field Operations' },
  { branchId: 'HB-2', branchName: 'Cuttack Service Desk', shiftGroupId: 'HSG-2', shiftGroupName: 'Support Desk Morning' },
  { branchId: 'HB-3', branchName: 'Rourkela Field Hub', shiftGroupId: 'HSG-3', shiftGroupName: 'Field Operations' },
];

const skillProfiles: Employee['skills'][] = [
  [{ name: 'Business strategy', level: 'Expert' }, { name: 'Finance review', level: 'Advanced' }],
  [{ name: 'Enterprise sales', level: 'Expert' }, { name: 'Channel management', level: 'Advanced' }],
  [{ name: 'Lead qualification', level: 'Advanced' }, { name: 'Field demos', level: 'Intermediate' }],
  [{ name: 'Delivery operations', level: 'Expert' }, { name: 'Vendor coordination', level: 'Advanced' }],
  [{ name: 'Payroll accounting', level: 'Advanced' }, { name: 'GST filings', level: 'Intermediate' }],
  [{ name: 'Implementation', level: 'Advanced' }, { name: 'Hardware setup', level: 'Advanced' }],
  [{ name: 'Helpdesk operations', level: 'Advanced' }, { name: 'Customer training', level: 'Intermediate' }],
  [{ name: 'Field service', level: 'Intermediate' }, { name: 'Device installation', level: 'Intermediate' }],
];

const employees: Employee[] = baseEmployees.map((employee, index) => ({
  ...employee,
  ...employeeWorkProfiles[index],
  probationEndDate: employee.status === 'Probation' ? '2026-09-03' : undefined,
  emergencyContacts: [{ name: index % 2 === 0 ? 'Ritu Dash' : 'Amit Das', relationship: index % 2 === 0 ? 'Spouse' : 'Sibling', phone: `+91 94371 20${String(index + 1).padStart(3, '0')}` }],
  governmentIds: [
    { type: 'PAN', valueLast4: `${2041 + index}`, verified: true },
    { type: 'Aadhaar', valueLast4: `${7710 + index}`, verified: index !== 7 },
  ],
  skills: skillProfiles[index],
  education: [{ degree: index === 0 ? 'MBA' : 'Bachelor Degree', institution: index % 2 === 0 ? 'Utkal University' : 'BPUT', year: `${2010 + index}` }],
  experience: [{ company: index < 2 ? 'Previous venture' : 'Regional SaaS company', role: employee.designation, years: Math.max(1, 8 - index) }],
  employmentHistory: [
    { date: employee.joiningDate, event: 'Joined', role: employee.designation, department: employee.department, manager: employee.manager },
    ...(employee.id === 'HE-2' ? [{ date: '2024-04-01', event: 'Promotion', role: 'Sales Manager', department: 'Sales', manager: 'Bibhudutta Dash' }] : []),
    ...(employee.id === 'HE-5' ? [{ date: '2026-06-01', event: 'Exit initiated', role: employee.designation, department: employee.department, manager: employee.manager }] : []),
  ],
}));

const todayStatuses: AttendanceStatus[] = ['Present', 'Present', 'Late', 'Present', 'Leave', 'Present', 'Half Day', 'Absent'];

const attendance: AttendanceEntry[] = employees.flatMap((employee, employeeIndex) =>
  Array.from({ length: 18 }, (_, dayIndex) => {
    const day = dayIndex + 1;
    const date = `2026-06-${String(day).padStart(2, '0')}`;
    const weekend = [7, 14].includes(day);
    const status: AttendanceStatus = weekend ? 'Holiday' : day === 18 ? todayStatuses[employeeIndex] : ((employeeIndex + day) % 11 === 0 ? 'Late' : (employeeIndex + day) % 17 === 0 ? 'Half Day' : 'Present');
    const absent = ['Absent', 'Leave', 'Holiday'].includes(status);
    return {
      id: `HA-${employeeIndex + 1}-${day}`,
      employeeId: employee.id,
      employeeName: employee.name,
      date,
      checkIn: absent ? '' : status === 'Late' ? '10:18' : '09:32',
      checkOut: absent ? '' : status === 'Half Day' ? '13:35' : '18:16',
      status,
      workHours: absent ? 0 : status === 'Half Day' ? 4 : status === 'Late' ? 7.5 : 8.25,
      location: absent ? '' : employeeIndex % 3 === 0 ? 'Bhubaneswar Office' : 'Remote / Client Site',
    };
  })
);

const attendanceCorrections: AttendanceCorrection[] = [
  { id: 'HAC-1', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', date: '2026-06-18', oldCheckIn: '10:18', oldCheckOut: '18:16', newCheckIn: '09:41', newCheckOut: '18:22', reason: 'Client-site check-in was captured late after network issue.', approver: 'Anita Das', status: 'Pending', requestedAt: '2026-06-18T12:05:00' },
  { id: 'HAC-2', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', date: '2026-06-18', oldCheckIn: '09:32', oldCheckOut: '13:35', newCheckIn: '09:28', newCheckOut: '18:04', reason: 'Forgot afternoon punch after training session.', approver: 'Priya Mishra', status: 'Approved', requestedAt: '2026-06-18T16:20:00', resolvedAt: '2026-06-18T17:05:00' },
  { id: 'HAC-3', employeeId: 'HE-8', employeeName: 'Arjun Behera', date: '2026-06-18', oldCheckIn: '', oldCheckOut: '', newCheckIn: '10:05', newCheckOut: '19:00', reason: 'New device not mapped to attendance profile.', approver: 'Priya Mishra', status: 'Pending', requestedAt: '2026-06-18T11:40:00' },
];

const attendanceExceptions: AttendanceException[] = [
  { id: 'HAE-1', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', date: '2026-06-18', type: 'Late', shiftGroupName: 'Support Desk Morning', detail: 'Check-in 138 minutes after shift start.', status: 'Open' },
  { id: 'HAE-2', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', date: '2026-06-18', type: 'Half Day', shiftGroupName: 'Support Desk Morning', detail: 'Only 4.0 hours recorded before correction.', status: 'Resolved' },
  { id: 'HAE-3', employeeId: 'HE-8', employeeName: 'Arjun Behera', date: '2026-06-18', type: 'Missing Punch', shiftGroupName: 'Field Operations', detail: 'No biometric attendance mapped for new joiner.', status: 'Open' },
  { id: 'HAE-4', employeeId: 'HE-6', employeeName: 'Debasis Rout', date: '2026-06-12', type: 'Overtime', shiftGroupName: 'Field Operations', detail: 'Weekend deployment recorded as comp-off eligible.', status: 'Resolved' },
];

const leaveRequests: LeaveRequest[] = [
  { id: 'HL-1', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', leaveType: 'Earned Leave', fromDate: '2026-06-18', toDate: '2026-06-18', days: 1, reason: 'Personal appointment', status: 'Approved', appliedDate: '2026-06-14' },
  { id: 'HL-2', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', leaveType: 'Casual Leave', fromDate: '2026-06-23', toDate: '2026-06-24', days: 2, reason: 'Family function', status: 'Pending', appliedDate: '2026-06-17' },
  { id: 'HL-3', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', leaveType: 'Sick Leave', fromDate: '2026-06-19', toDate: '2026-06-19', days: 1, reason: 'Medical rest', status: 'Pending', appliedDate: '2026-06-18' },
  { id: 'HL-4', employeeId: 'HE-2', employeeName: 'Anita Das', leaveType: 'Earned Leave', fromDate: '2026-07-02', toDate: '2026-07-04', days: 3, reason: 'Planned travel', status: 'Pending', appliedDate: '2026-06-16' },
  { id: 'HL-5', employeeId: 'HE-6', employeeName: 'Debasis Rout', leaveType: 'Comp Off', fromDate: '2026-06-12', toDate: '2026-06-12', days: 1, reason: 'Weekend deployment compensation', status: 'Approved', appliedDate: '2026-06-09' },
  { id: 'HL-6', employeeId: 'HE-4', employeeName: 'Priya Mishra', leaveType: 'Casual Leave', fromDate: '2026-06-10', toDate: '2026-06-10', days: 1, reason: 'Personal work', status: 'Rejected', appliedDate: '2026-06-08' },
];

const salarySlips: SalarySlip[] = employees.slice(0, 6).map((employee, index) => {
  const { basic, allowances, deductions, pf, esi } = employee.salary;
  return {
    id: `HS-${index + 1}`, slipNumber: `PAY-2026-05-${String(index + 1).padStart(3, '0')}`,
    employeeId: employee.id, employeeName: employee.name, month: '2026-05', basic, allowances, deductions, pf, esi,
    netSalary: basic + allowances - deductions - pf - esi, paymentStatus: index < 5 ? 'Paid' : 'Processed', generatedDate: '2026-05-31',
  };
});

const leaveBalances: LeaveBalance[] = employees.flatMap((employee, index) => [
  { id: `HLB-${employee.id}-CL`, employeeId: employee.id, employeeName: employee.name, leaveType: 'Casual Leave', annualAllowance: 12, used: index % 3, pending: leaveRequests.filter((leave) => leave.employeeId === employee.id && leave.leaveType === 'Casual Leave' && leave.status === 'Pending').reduce((sum, leave) => sum + leave.days, 0), available: 12 - (index % 3), carryForward: 0 },
  { id: `HLB-${employee.id}-SL`, employeeId: employee.id, employeeName: employee.name, leaveType: 'Sick Leave', annualAllowance: 10, used: index % 2, pending: leaveRequests.filter((leave) => leave.employeeId === employee.id && leave.leaveType === 'Sick Leave' && leave.status === 'Pending').reduce((sum, leave) => sum + leave.days, 0), available: 10 - (index % 2), carryForward: 0 },
  { id: `HLB-${employee.id}-EL`, employeeId: employee.id, employeeName: employee.name, leaveType: 'Earned Leave', annualAllowance: 18, used: index + 1, pending: leaveRequests.filter((leave) => leave.employeeId === employee.id && leave.leaveType === 'Earned Leave' && leave.status === 'Pending').reduce((sum, leave) => sum + leave.days, 0), available: Math.max(0, 18 - index - 1), carryForward: index % 4 },
]);

const leaveApprovalHistory: LeaveApprovalEntry[] = [
  { id: 'LAH-1', leaveId: 'HL-1', actor: 'Sameer Patnaik', action: 'Applied', timestamp: '2026-06-14T10:15:00', comment: 'Personal appointment request submitted.' },
  { id: 'LAH-2', leaveId: 'HL-1', actor: 'Bibhudutta Dash', action: 'Approved', timestamp: '2026-06-15T09:30:00', comment: 'Approved as earned leave.' },
  { id: 'LAH-3', leaveId: 'HL-2', actor: 'Rakesh Sahoo', action: 'Applied', timestamp: '2026-06-17T14:10:00', comment: 'Family function leave submitted.' },
  { id: 'LAH-4', leaveId: 'HL-3', actor: 'Sonal Patnaik', action: 'Applied', timestamp: '2026-06-18T09:05:00', comment: 'Medical rest requested.' },
  { id: 'LAH-5', leaveId: 'HL-4', actor: 'Anita Das', action: 'Applied', timestamp: '2026-06-16T12:45:00', comment: 'Planned travel submitted for manager approval.' },
  { id: 'LAH-6', leaveId: 'HL-6', actor: 'Bibhudutta Dash', action: 'Rejected', timestamp: '2026-06-09T16:20:00', comment: 'Rejected due to delivery review schedule.' },
];

const salaryComponents: SalaryComponent[] = employees.flatMap((employee) => [
  { id: `HSC-${employee.id}-basic`, employeeId: employee.id, employeeName: employee.name, name: 'Basic Salary', type: 'Earning', amount: employee.salary.basic, taxable: true, formula: 'Fixed monthly basic' },
  { id: `HSC-${employee.id}-allowance`, employeeId: employee.id, employeeName: employee.name, name: 'Allowances', type: 'Earning', amount: employee.salary.allowances, taxable: true, formula: 'Role allowance + travel support' },
  { id: `HSC-${employee.id}-deduction`, employeeId: employee.id, employeeName: employee.name, name: 'Other Deductions', type: 'Deduction', amount: employee.salary.deductions, taxable: false },
  { id: `HSC-${employee.id}-pf`, employeeId: employee.id, employeeName: employee.name, name: 'Provident Fund', type: 'Statutory', amount: employee.salary.pf, taxable: false, formula: '12% of basic where applicable' },
]);

const mayGross = salarySlips.reduce((sum, slip) => sum + slip.basic + slip.allowances, 0);
const mayDeductions = salarySlips.reduce((sum, slip) => sum + slip.deductions + slip.pf + slip.esi, 0);
const payrollRuns: PayrollRun[] = [
  { id: 'HPR-1', month: '2026-05', status: 'Released', employeeCount: salarySlips.length, grossAmount: mayGross, deductionAmount: mayDeductions, netAmount: salarySlips.reduce((sum, slip) => sum + slip.netSalary, 0), preparedBy: 'Sameer Patnaik', approvedBy: 'Bibhudutta Dash', releasedAt: '2026-05-31T18:30:00', locked: true },
  { id: 'HPR-2', month: '2026-06', status: 'Draft', employeeCount: employees.length, grossAmount: employees.reduce((sum, employee) => sum + employee.salary.basic + employee.salary.allowances, 0), deductionAmount: employees.reduce((sum, employee) => sum + employee.salary.deductions + employee.salary.pf + employee.salary.esi, 0), netAmount: employees.reduce((sum, employee) => sum + employee.salary.basic + employee.salary.allowances - employee.salary.deductions - employee.salary.pf - employee.salary.esi, 0), preparedBy: 'Demo User', locked: false },
];

const salaryReleases: SalaryRelease[] = salarySlips.slice(0, 5).map((slip, index) => ({
  id: `HSREL-${index + 1}`,
  slipId: slip.id,
  employeeId: slip.employeeId,
  employeeName: slip.employeeName,
  month: slip.month,
  amount: slip.netSalary,
  mode: index % 2 === 0 ? 'Bank Transfer' : 'Net Banking',
  status: 'Released',
  reference: `UTR202605${String(index + 1).padStart(3, '0')}`,
  releaseDate: '2026-05-31',
}));

const branches: Branch[] = [
  { id: 'HB-1', name: 'Bhubaneswar HQ', code: 'BBI-HQ', city: 'Bhubaneswar', state: 'Odisha', address: 'Plot 42, Infocity Road, Patia', admin: 'Priya Mishra', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], holidayCalendar: 'Odisha Corporate Calendar', status: 'Active' },
  { id: 'HB-2', name: 'Cuttack Service Desk', code: 'CTC-SD', city: 'Cuttack', state: 'Odisha', address: 'CDA Sector 9, Cuttack', admin: 'Rakesh Sahoo', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], holidayCalendar: 'Service Desk Calendar', status: 'Active' },
  { id: 'HB-3', name: 'Rourkela Field Hub', code: 'RKL-FH', city: 'Rourkela', state: 'Odisha', address: 'Civil Township, Rourkela', admin: 'Debasis Rout', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], holidayCalendar: 'Field Operations Calendar', status: 'Draft' },
];

const designations: Designation[] = [
  { id: 'HDES-1', title: 'Sales Manager', department: 'Sales', level: 'Manager', employmentType: 'Full Time', status: 'Active' },
  { id: 'HDES-2', title: 'Implementation Engineer', department: 'Engineering', level: 'Senior Associate', employmentType: 'Full Time', status: 'Active' },
  { id: 'HDES-3', title: 'Support Specialist', department: 'Customer Success', level: 'Associate', employmentType: 'Full Time', status: 'Active' },
  { id: 'HDES-4', title: 'Field Technician', department: 'Engineering', level: 'Associate', employmentType: 'Full Time', status: 'Active' },
  { id: 'HDES-5', title: 'Payroll Executive', department: 'Finance', level: 'Associate', employmentType: 'Contract', status: 'Draft' },
];

const leavePolicies: LeavePolicy[] = [
  { id: 'HLP-1', code: 'CL', name: 'Casual Leave', paid: true, annualAllowance: 12, carryForward: false, maxCarryForward: 0, encashment: false, expiryRule: 'Expires at financial year end', approvalChain: 'Manager -> HR Admin', status: 'Active' },
  { id: 'HLP-2', code: 'SL', name: 'Sick Leave', paid: true, annualAllowance: 10, carryForward: false, maxCarryForward: 0, encashment: false, expiryRule: 'Medical certificate after 2 days', approvalChain: 'Manager -> HR Admin', status: 'Active' },
  { id: 'HLP-3', code: 'EL', name: 'Earned Leave', paid: true, annualAllowance: 18, carryForward: true, maxCarryForward: 30, encashment: true, expiryRule: 'Carry forward up to cap', approvalChain: 'Manager -> HR Admin -> Owner', status: 'Active' },
  { id: 'HLP-4', code: 'LWP', name: 'Leave Without Pay', paid: false, annualAllowance: 0, carryForward: false, maxCarryForward: 0, encashment: false, expiryRule: 'Payroll deduction applies', approvalChain: 'Manager -> HR Admin', status: 'Active' },
];

const holidays: Holiday[] = [
  { id: 'HH-1', name: 'Ratha Yatra', date: '2026-07-16', branchId: 'HB-1', branchName: 'Bhubaneswar HQ', type: 'Public Holiday', status: 'Active' },
  { id: 'HH-2', name: 'Independence Day', date: '2026-08-15', branchId: 'all', branchName: 'All branches', type: 'Public Holiday', status: 'Active' },
  { id: 'HH-3', name: 'Service desk maintenance day', date: '2026-07-05', branchId: 'HB-2', branchName: 'Cuttack Service Desk', type: 'Special Working Day', status: 'Active' },
  { id: 'HH-4', name: 'Optional local festival', date: '2026-09-02', branchId: 'HB-3', branchName: 'Rourkela Field Hub', type: 'Optional Holiday', status: 'Draft' },
];

const shiftGroups: ShiftGroup[] = [
  { id: 'HSG-1', name: 'General Office', branchId: 'HB-1', branchName: 'Bhubaneswar HQ', startTime: '09:30', endTime: '18:00', graceMinutes: 15, overtimeEligible: false, workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], status: 'Active' },
  { id: 'HSG-2', name: 'Support Desk Morning', branchId: 'HB-2', branchName: 'Cuttack Service Desk', startTime: '08:00', endTime: '16:30', graceMinutes: 10, overtimeEligible: true, workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], status: 'Active' },
  { id: 'HSG-3', name: 'Field Operations', branchId: 'HB-3', branchName: 'Rourkela Field Hub', startTime: '10:00', endTime: '19:00', graceMinutes: 20, overtimeEligible: true, workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], status: 'Draft' },
];

const rolePermissions: RolePermission[] = [
  { id: 'HRP-1', role: 'Business Owner', scope: 'Tenant-wide', menuAccess: HR_PERMISSION_MENUS, canViewSalary: true, canApproveLeave: true, canEditAttendance: true, canRunPayroll: true, canExport: true },
  { id: 'HRP-2', role: 'HR Admin', scope: 'Tenant-wide HR data', menuAccess: HR_PERMISSION_MENUS, canViewSalary: true, canApproveLeave: true, canEditAttendance: true, canRunPayroll: true, canExport: true },
  { id: 'HRP-3', role: 'Manager', scope: 'Assigned team only', menuAccess: ['Employees', 'Attendance', 'Leave', 'Performance', 'Self Service', 'Reports'], canViewSalary: false, canApproveLeave: true, canEditAttendance: false, canRunPayroll: false, canExport: false },
  { id: 'HRP-4', role: 'Staff', scope: 'Own records only', menuAccess: ['Self Service'], canViewSalary: false, canApproveLeave: false, canEditAttendance: false, canRunPayroll: false, canExport: false },
];

const auditLogs: HrAuditLog[] = [
  { id: 'HAL-1', actor: 'Priya Mishra', action: 'Updated leave policy', module: 'Leave', target: 'Earned Leave', timestamp: '2026-06-18T10:15:00', details: 'Carry forward cap reviewed for FY 2026-27.' },
  { id: 'HAL-2', actor: 'Sameer Patnaik', action: 'Processed payroll preview', module: 'Payroll', target: 'May 2026 payroll', timestamp: '2026-06-17T17:40:00', details: 'Payroll preview generated before owner approval.' },
  { id: 'HAL-3', actor: 'Anita Das', action: 'Approved leave', module: 'Leave', target: 'Rakesh Sahoo', timestamp: '2026-06-17T14:05:00', details: 'Casual leave request moved to pending HR confirmation.' },
];

const onboardingTasks: OnboardingTask[] = [
  { id: 'HOT-1', employeeId: 'HE-8', employeeName: 'Arjun Behera', title: 'Collect bank proof and signed joining forms', owner: 'HR Admin', dueDate: '2026-06-19', category: 'HR', status: 'In Progress' },
  { id: 'HOT-2', employeeId: 'HE-8', employeeName: 'Arjun Behera', title: 'Allocate field service kit and mobile device', owner: 'IT', dueDate: '2026-06-20', category: 'IT', status: 'Pending' },
  { id: 'HOT-3', employeeId: 'HE-8', employeeName: 'Arjun Behera', title: 'Manager induction and first-week route plan', owner: 'Priya Mishra', dueDate: '2026-06-21', category: 'Manager', status: 'Pending' },
  { id: 'HOT-4', employeeId: 'HE-8', employeeName: 'Arjun Behera', title: 'Payroll and attendance profile activation', owner: 'Sameer Patnaik', dueDate: '2026-06-22', category: 'Payroll', status: 'Blocked' },
  { id: 'HOT-5', employeeId: 'HE-6', employeeName: 'Debasis Rout', title: 'Implementation certification upload', owner: 'HR Admin', dueDate: '2026-06-25', category: 'Admin', status: 'Completed' },
];

const offboardingItems: OffboardingItem[] = [
  { id: 'HOFF-1', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', title: 'Knowledge handover to finance backup', owner: 'Bibhudutta Dash', dueDate: '2026-07-05', status: 'In Progress' },
  { id: 'HOFF-2', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', title: 'Collect laptop, ID card, and access token', owner: 'IT Admin', dueDate: '2026-07-12', status: 'Pending' },
  { id: 'HOFF-3', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', title: 'Finance clearance and advance reconciliation', owner: 'Finance', dueDate: '2026-07-13', status: 'Pending' },
  { id: 'HOFF-4', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', title: 'Final settlement review', owner: 'HR Admin', dueDate: '2026-07-15', status: 'Pending' },
];

const lifecycleEvents: EmployeeLifecycleEvent[] = [
  ...employees.map((employee, index): EmployeeLifecycleEvent => ({
    id: `HLE-${index + 1}`,
    employeeId: employee.id,
    employeeName: employee.name,
    type: 'Joined',
    date: employee.joiningDate,
    title: 'Joined organization',
    details: `${employee.name} joined as ${employee.designation} in ${employee.department}.`,
    actor: 'HR Admin',
  })),
  { id: 'HLE-20', employeeId: 'HE-8', employeeName: 'Arjun Behera', type: 'Onboarding', date: '2026-06-18', title: 'Onboarding checklist opened', details: 'Documents, field kit, manager induction, and payroll activation tracked.', actor: 'Priya Mishra' },
  { id: 'HLE-21', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', type: 'Exit', date: '2026-06-01', title: 'Notice period started', details: 'Last working day planned for 2026-07-15 with clearance checklist.', actor: 'Bibhudutta Dash' },
  { id: 'HLE-22', employeeId: 'HE-4', employeeName: 'Priya Mishra', type: 'Salary Revision', date: '2026-04-01', title: 'Annual revision approved', details: 'Revised monthly net salary based on annual performance review.', actor: 'Bibhudutta Dash' },
];

const salaryRevisions: SalaryRevision[] = [
  { id: 'HSR-1', employeeId: 'HE-4', employeeName: 'Priya Mishra', effectiveDate: '2026-04-01', previousNet: 74480, revisedNet: 78440, reason: 'Annual performance revision', status: 'Applied' },
  { id: 'HSR-2', employeeId: 'HE-2', employeeName: 'Anita Das', effectiveDate: '2026-07-01', previousNet: 63720, revisedNet: 68200, reason: 'Sales target achievement review', status: 'Approved' },
  { id: 'HSR-3', employeeId: 'HE-8', employeeName: 'Arjun Behera', effectiveDate: '2026-09-03', previousNet: 30680, revisedNet: 33500, reason: 'Probation confirmation revision', status: 'Draft' },
];

const performanceCycles: PerformanceCycle[] = [
  { id: 'HPC-1', name: 'FY26 Q1 Review', period: 'Apr-Jun 2026', owner: 'Priya Mishra', startDate: '2026-04-01', endDate: '2026-06-30', status: 'Active' },
  { id: 'HPC-2', name: 'FY25 Annual Review', period: 'Apr 2025-Mar 2026', owner: 'Bibhudutta Dash', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Closed' },
  { id: 'HPC-3', name: 'Probation Review Batch', period: 'Jun-Sep 2026', owner: 'HR Admin', startDate: '2026-06-01', endDate: '2026-09-30', status: 'Draft' },
];

const performanceGoals: PerformanceGoal[] = [
  { id: 'HPG-1', employeeId: 'HE-4', employeeName: 'Priya Mishra', cycleId: 'HPC-1', title: 'Improve implementation SLA adherence', metric: 'On-time milestones', target: 95, current: 91, weight: 30, dueDate: '2026-06-30', owner: 'Bibhudutta Dash', status: 'At Risk' },
  { id: 'HPG-2', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', cycleId: 'HPC-1', title: 'Maintain first response discipline', metric: 'SLA response rate', target: 96, current: 94, weight: 25, dueDate: '2026-06-30', owner: 'Priya Mishra', status: 'On Track' },
  { id: 'HPG-3', employeeId: 'HE-6', employeeName: 'Debasis Rout', cycleId: 'HPC-1', title: 'Raise installation handover quality', metric: 'Customer handover CSAT', target: 90, current: 92, weight: 25, dueDate: '2026-06-25', owner: 'Priya Mishra', status: 'Completed' },
  { id: 'HPG-4', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', cycleId: 'HPC-1', title: 'Build qualified SME pipeline', metric: 'Qualified opportunities', target: 28, current: 18, weight: 35, dueDate: '2026-06-30', owner: 'Anita Das', status: 'At Risk' },
  { id: 'HPG-5', employeeId: 'HE-2', employeeName: 'Anita Das', cycleId: 'HPC-1', title: 'Close partner-led monthly bookings', metric: 'Bookings in lakh', target: 16, current: 13, weight: 40, dueDate: '2026-06-30', owner: 'Bibhudutta Dash', status: 'On Track' },
  { id: 'HPG-6', employeeId: 'HE-8', employeeName: 'Arjun Behera', cycleId: 'HPC-3', title: 'Complete field technician probation skills', metric: 'Checklist completion', target: 100, current: 35, weight: 50, dueDate: '2026-09-03', owner: 'Priya Mishra', status: 'Not Started' },
];

const performanceReviews: PerformanceReview[] = [
  { id: 'HPRV-1', employeeId: 'HE-4', employeeName: 'Priya Mishra', cycleId: 'HPC-1', cycleName: 'FY26 Q1 Review', reviewer: 'Bibhudutta Dash', selfRating: 4.1, managerRating: 4.0, status: 'Manager Review', submittedAt: '2026-06-16', summary: 'Delivery throughput improved but SLA recovery needs tighter escalation.', feedback: 'Add weekly exception review with service owners.' },
  { id: 'HPRV-2', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', cycleId: 'HPC-1', cycleName: 'FY26 Q1 Review', reviewer: 'Priya Mishra', selfRating: 4.4, managerRating: 4.2, finalRating: 4.2, status: 'Finalized', submittedAt: '2026-06-15', summary: 'Strong support ownership and customer training follow-through.', feedback: 'Ready for senior support queue exposure.' },
  { id: 'HPRV-3', employeeId: 'HE-6', employeeName: 'Debasis Rout', cycleId: 'HPC-1', cycleName: 'FY26 Q1 Review', reviewer: 'Priya Mishra', selfRating: 4.0, managerRating: 4.1, status: 'Calibration', submittedAt: '2026-06-14', summary: 'Reliable field delivery with strong customer sign-offs.', feedback: 'Document repeatable handover checklist.' },
  { id: 'HPRV-4', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', cycleId: 'HPC-1', cycleName: 'FY26 Q1 Review', reviewer: 'Anita Das', selfRating: 3.5, managerRating: 3.4, status: 'Self Review', submittedAt: '2026-06-13', summary: 'Pipeline creation below target but follow-up quality improved.', feedback: 'Tighten discovery notes before quotation handoff.' },
  { id: 'HPRV-5', employeeId: 'HE-8', employeeName: 'Arjun Behera', cycleId: 'HPC-3', cycleName: 'Probation Review Batch', reviewer: 'Priya Mishra', selfRating: 0, managerRating: 0, status: 'Draft', summary: 'Probation review will open after first month field observation.', feedback: 'Pending field route readiness.' },
];

const performanceFeedback: PerformanceFeedback[] = [
  { id: 'HPF-1', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', from: 'Priya Mishra', date: '2026-06-12', type: 'Recognition', note: 'Resolved two priority onboarding tickets with clear customer communication.' },
  { id: 'HPF-2', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', from: 'Anita Das', date: '2026-06-11', type: 'Coaching', note: 'Add decision criteria and budget notes before moving leads to quotation.' },
  { id: 'HPF-3', employeeId: 'HE-6', employeeName: 'Debasis Rout', from: 'Priya Mishra', date: '2026-06-10', type: 'Recognition', note: 'Field deployment handover received positive customer feedback.' },
  { id: 'HPF-4', employeeId: 'HE-8', employeeName: 'Arjun Behera', from: 'Priya Mishra', date: '2026-06-18', type: 'Manager Note', note: 'Pair with Debasis for first three client visits before independent assignment.' },
];

const assets: HrAsset[] = [
  { id: 'HRA-1', assetTag: 'VT-LAP-004', name: 'Dell Latitude 5440', category: 'Laptop', serialNumber: 'DL5440-0821', assignedToId: 'HE-4', assignedToName: 'Priya Mishra', assignedDate: '2024-04-08', expectedReturnDate: '2027-04-08', condition: 'Good', location: 'Bhubaneswar HQ', status: 'Assigned', returnStatus: 'Not Due', notes: 'Operations manager device with admin tools.' },
  { id: 'HRA-2', assetTag: 'VT-HDS-011', name: 'Jabra Support Headset', category: 'Headset', serialNumber: 'JAB-3001', assignedToId: 'HE-7', assignedToName: 'Sonal Patnaik', assignedDate: '2025-03-17', expectedReturnDate: '2027-03-17', condition: 'Good', location: 'Cuttack Service Desk', status: 'Assigned', returnStatus: 'Not Due', notes: 'Service desk headset for support calls.' },
  { id: 'HRA-3', assetTag: 'VT-FLD-006', name: 'Field Service Toolkit', category: 'Toolkit', serialNumber: 'KIT-8806', assignedToId: 'HE-6', assignedToName: 'Debasis Rout', assignedDate: '2024-09-09', expectedReturnDate: '2026-12-31', condition: 'Good', location: 'Rourkela Field Hub', status: 'Assigned', returnStatus: 'Not Due', notes: 'Scanner, cable tester, label kit, and install accessories.' },
  { id: 'HRA-4', assetTag: 'VT-LAP-002', name: 'Lenovo ThinkPad E14', category: 'Laptop', serialNumber: 'LNE14-4412', assignedToId: 'HE-5', assignedToName: 'Sameer Patnaik', assignedDate: '2024-02-01', expectedReturnDate: '2026-07-12', condition: 'Good', location: 'Bhubaneswar HQ', status: 'Assigned', returnStatus: 'Return Due', notes: 'Return linked to finance offboarding clearance.' },
  { id: 'HRA-5', assetTag: 'VT-MOB-009', name: 'Android Field Phone', category: 'Phone', serialNumber: 'MOB-9009', condition: 'New', location: 'Rourkela Field Hub', status: 'Available', returnStatus: 'Returned', notes: 'Ready for new field technician allocation.' },
  { id: 'HRA-6', assetTag: 'VT-TAB-003', name: 'Samsung Service Tablet', category: 'Tablet', serialNumber: 'TAB-3303', condition: 'Needs Repair', location: 'Bhubaneswar HQ', status: 'In Repair', returnStatus: 'Returned', notes: 'Screen replacement requested.' },
];

const assetActivities: AssetActivity[] = [
  { id: 'HAA-1', assetId: 'HRA-4', assetTag: 'VT-LAP-002', employeeName: 'Sameer Patnaik', date: '2026-06-18', action: 'Return due', owner: 'HR Admin', notes: 'Added to offboarding clearance checklist.' },
  { id: 'HAA-2', assetId: 'HRA-5', assetTag: 'VT-MOB-009', employeeName: 'Unassigned', date: '2026-06-17', action: 'Received', owner: 'IT Admin', notes: 'New phone stocked for field operations.' },
  { id: 'HAA-3', assetId: 'HRA-6', assetTag: 'VT-TAB-003', employeeName: 'IT Store', date: '2026-06-15', action: 'Repair logged', owner: 'IT Admin', notes: 'Screen crack logged after return inspection.' },
  { id: 'HAA-4', assetId: 'HRA-2', assetTag: 'VT-HDS-011', employeeName: 'Sonal Patnaik', date: '2025-03-17', action: 'Assigned', owner: 'HR Admin', notes: 'Issued during support desk joining kit.' },
];

const recruitmentJobs: JobRequisition[] = [
  { id: 'HJR-1', requisitionNumber: 'REQ-2026-001', title: 'Field Technician', department: 'Engineering', branchId: 'HB-3', branchName: 'Rourkela Field Hub', hiringManager: 'Priya Mishra', headcount: 2, filled: 1, budgetMin: 28000, budgetMax: 35000, experience: '1-3 years', employmentType: 'Full Time', priority: 'High', approvalStatus: 'Approved', status: 'Open', openedDate: '2026-06-04', targetDate: '2026-07-15', description: 'Field service technician for installations, maintenance visits, and customer handover.' },
  { id: 'HJR-2', requisitionNumber: 'REQ-2026-002', title: 'Payroll Executive', department: 'Finance', branchId: 'HB-1', branchName: 'Bhubaneswar HQ', hiringManager: 'Bibhudutta Dash', headcount: 1, filled: 0, budgetMin: 32000, budgetMax: 42000, experience: '2-4 years', employmentType: 'Full Time', priority: 'Medium', approvalStatus: 'Pending Approval', status: 'Draft', openedDate: '2026-06-12', targetDate: '2026-08-01', description: 'Payroll operations, statutory deductions, salary register support, and employee queries.' },
  { id: 'HJR-3', requisitionNumber: 'REQ-2026-003', title: 'Customer Success Associate', department: 'Customer Success', branchId: 'HB-2', branchName: 'Cuttack Service Desk', hiringManager: 'Priya Mishra', headcount: 2, filled: 0, budgetMin: 26000, budgetMax: 34000, experience: '0-2 years', employmentType: 'Full Time', priority: 'Medium', approvalStatus: 'Approved', status: 'Open', openedDate: '2026-06-08', targetDate: '2026-07-20', description: 'Customer onboarding, ticket triage, training follow-ups, and adoption monitoring.' },
  { id: 'HJR-4', requisitionNumber: 'REQ-2026-004', title: 'Enterprise Sales Executive', department: 'Sales', branchId: 'HB-1', branchName: 'Bhubaneswar HQ', hiringManager: 'Anita Das', headcount: 1, filled: 0, budgetMin: 38000, budgetMax: 52000, experience: '3-5 years', employmentType: 'Full Time', priority: 'Low', approvalStatus: 'Approved', status: 'On Hold', openedDate: '2026-05-28', targetDate: '2026-08-15', description: 'Pipeline generation, partner leads, demos, and enterprise customer follow-ups.' },
];

const jobPostings: JobPosting[] = [
  { id: 'HJP-1', jobId: 'HJR-1', jobTitle: 'Field Technician', channel: 'Career Page', visibility: 'Public', status: 'Published', applications: 18, publishedDate: '2026-06-05' },
  { id: 'HJP-2', jobId: 'HJR-1', jobTitle: 'Field Technician', channel: 'Referral', visibility: 'Internal', status: 'Published', applications: 4, publishedDate: '2026-06-06' },
  { id: 'HJP-3', jobId: 'HJR-3', jobTitle: 'Customer Success Associate', channel: 'LinkedIn', visibility: 'Public', status: 'Published', applications: 26, publishedDate: '2026-06-09' },
  { id: 'HJP-4', jobId: 'HJR-2', jobTitle: 'Payroll Executive', channel: 'Internal', visibility: 'Internal', status: 'Draft', applications: 0 },
];

const candidates: Candidate[] = [
  { id: 'HC-1', candidateNumber: 'CAN-001', jobId: 'HJR-1', jobTitle: 'Field Technician', name: 'Kiran Nayak', email: 'kiran.nayak@example.com', phone: '+91 94380 22001', location: 'Rourkela', source: 'Referral', stage: 'Accepted', expectedSalary: 33000, noticePeriod: '15 days', rating: 4, appliedDate: '2026-06-06', owner: 'Priya Mishra', tags: ['Field service', 'Hardware'], resumeFile: 'kiran-nayak-resume.pdf', backgroundCheckStatus: 'Clear', notes: 'Accepted offer; ready for onboarding handoff.' },
  { id: 'HC-2', candidateNumber: 'CAN-002', jobId: 'HJR-3', jobTitle: 'Customer Success Associate', name: 'Madhumita Sethi', email: 'madhumita.sethi@example.com', phone: '+91 94380 22002', location: 'Cuttack', source: 'LinkedIn', stage: 'Offer', expectedSalary: 32000, noticePeriod: 'Immediate', rating: 5, appliedDate: '2026-06-10', owner: 'Priya Mishra', tags: ['Support', 'Training'], resumeFile: 'madhumita-sethi-resume.pdf', backgroundCheckStatus: 'In Progress', notes: 'Strong communication and product adoption experience.' },
  { id: 'HC-3', candidateNumber: 'CAN-003', jobId: 'HJR-1', jobTitle: 'Field Technician', name: 'Sanjay Pradhan', email: 'sanjay.pradhan@example.com', phone: '+91 94380 22003', location: 'Sambalpur', source: 'Career Page', stage: 'Interview', expectedSalary: 31000, noticePeriod: '30 days', rating: 3, appliedDate: '2026-06-11', owner: 'Debasis Rout', tags: ['Installation', 'Travel ready'], resumeFile: 'sanjay-pradhan-resume.pdf', backgroundCheckStatus: 'Pending', notes: 'Technical round scheduled with field manager.' },
  { id: 'HC-4', candidateNumber: 'CAN-004', jobId: 'HJR-2', jobTitle: 'Payroll Executive', name: 'Tanya Mohanty', email: 'tanya.mohanty@example.com', phone: '+91 94380 22004', location: 'Bhubaneswar', source: 'Internal', stage: 'Shortlisted', expectedSalary: 39000, noticePeriod: '20 days', rating: 4, appliedDate: '2026-06-13', owner: 'Sameer Patnaik', tags: ['Payroll', 'Excel'], resumeFile: 'tanya-mohanty-resume.pdf', backgroundCheckStatus: 'Pending', notes: 'Shortlisted pending requisition approval.' },
  { id: 'HC-5', candidateNumber: 'CAN-005', jobId: 'HJR-3', jobTitle: 'Customer Success Associate', name: 'Rohit Panda', email: 'rohit.panda@example.com', phone: '+91 94380 22005', location: 'Bhubaneswar', source: 'Career Page', stage: 'Screened', expectedSalary: 30000, noticePeriod: 'Immediate', rating: 3, appliedDate: '2026-06-15', owner: 'Sonal Patnaik', tags: ['Helpdesk', 'Fresh graduate'], resumeFile: 'rohit-panda-resume.pdf', backgroundCheckStatus: 'Pending', notes: 'Screening call completed; move to panel if slots open.' },
  { id: 'HC-6', candidateNumber: 'CAN-006', jobId: 'HJR-4', jobTitle: 'Enterprise Sales Executive', name: 'Anwesha Ray', email: 'anwesha.ray@example.com', phone: '+91 94380 22006', location: 'Bhubaneswar', source: 'LinkedIn', stage: 'Talent Pool', expectedSalary: 52000, noticePeriod: '45 days', rating: 4, appliedDate: '2026-05-30', owner: 'Anita Das', tags: ['Enterprise', 'Partner sales'], resumeFile: 'anwesha-ray-resume.pdf', duplicateWarning: true, backgroundCheckStatus: 'Pending', notes: 'Good fit when sales hiring reopens.' },
  { id: 'HC-7', candidateNumber: 'CAN-007', jobId: 'HJR-1', jobTitle: 'Field Technician', name: 'Biswajit Das', email: 'biswajit.das@example.com', phone: '+91 94380 22007', location: 'Rourkela', source: 'Referral', stage: 'Rejected', expectedSalary: 38000, noticePeriod: '30 days', rating: 2, appliedDate: '2026-06-07', owner: 'Debasis Rout', tags: ['Field service'], resumeFile: 'biswajit-das-resume.pdf', backgroundCheckStatus: 'Concern', notes: 'Rejected after technical round due to skill mismatch.' },
];

const interviews: InterviewRound[] = [
  { id: 'HIR-1', candidateId: 'HC-3', candidateName: 'Sanjay Pradhan', jobId: 'HJR-1', jobTitle: 'Field Technician', round: 'Technical Round', panel: ['Debasis Rout', 'Priya Mishra'], scheduledAt: '2026-06-20T11:00:00', mode: 'Video', status: 'Scheduled', feedback: '' },
  { id: 'HIR-2', candidateId: 'HC-2', candidateName: 'Madhumita Sethi', jobId: 'HJR-3', jobTitle: 'Customer Success Associate', round: 'Manager Round', panel: ['Priya Mishra', 'Sonal Patnaik'], scheduledAt: '2026-06-17T15:00:00', mode: 'Video', status: 'Completed', score: 92, feedback: 'Excellent customer communication and escalation handling.' },
  { id: 'HIR-3', candidateId: 'HC-1', candidateName: 'Kiran Nayak', jobId: 'HJR-1', jobTitle: 'Field Technician', round: 'Final Round', panel: ['Priya Mishra'], scheduledAt: '2026-06-14T12:30:00', mode: 'In person', status: 'Completed', score: 88, feedback: 'Strong hands-on device installation knowledge.' },
  { id: 'HIR-4', candidateId: 'HC-4', candidateName: 'Tanya Mohanty', jobId: 'HJR-2', jobTitle: 'Payroll Executive', round: 'HR Screening', panel: ['Sameer Patnaik'], scheduledAt: '2026-06-21T10:30:00', mode: 'Phone', status: 'Scheduled', feedback: '' },
];

const offers: Offer[] = [
  { id: 'HOF-1', candidateId: 'HC-1', candidateName: 'Kiran Nayak', jobId: 'HJR-1', jobTitle: 'Field Technician', offeredSalary: 33500, joiningDate: '2026-07-08', approver: 'Bibhudutta Dash', status: 'Accepted', sentDate: '2026-06-16', acceptedDate: '2026-06-18', notes: 'Accepted with July 8 joining.' },
  { id: 'HOF-2', candidateId: 'HC-2', candidateName: 'Madhumita Sethi', jobId: 'HJR-3', jobTitle: 'Customer Success Associate', offeredSalary: 32500, joiningDate: '2026-07-10', approver: 'Priya Mishra', status: 'Sent', sentDate: '2026-06-18', notes: 'Awaiting candidate response.' },
  { id: 'HOF-3', candidateId: 'HC-4', candidateName: 'Tanya Mohanty', jobId: 'HJR-2', jobTitle: 'Payroll Executive', offeredSalary: 39000, joiningDate: '2026-08-01', approver: 'Bibhudutta Dash', status: 'Pending Approval', notes: 'Offer draft depends on requisition approval.' },
];

const backgroundChecks: BackgroundCheck[] = [
  { id: 'HBC-1', candidateId: 'HC-1', candidateName: 'Kiran Nayak', checkType: 'Reference check', owner: 'HR Admin', dueDate: '2026-06-18', status: 'Clear', notes: 'Previous supervisor verified employment.' },
  { id: 'HBC-2', candidateId: 'HC-2', candidateName: 'Madhumita Sethi', checkType: 'Document verification', owner: 'HR Admin', dueDate: '2026-06-24', status: 'In Progress', notes: 'Address proof pending.' },
  { id: 'HBC-3', candidateId: 'HC-7', candidateName: 'Biswajit Das', checkType: 'Reference check', owner: 'HR Admin', dueDate: '2026-06-16', status: 'Concern', notes: 'Reference feedback did not match experience claim.' },
];

const talentPool: TalentPoolEntry[] = [
  { id: 'HTP-1', candidateId: 'HC-6', candidateName: 'Anwesha Ray', skillArea: 'Enterprise sales', availableFrom: '2026-08-01', owner: 'Anita Das', status: 'Warm', notes: 'Revisit when sales requisition is reopened.' },
  { id: 'HTP-2', candidateId: 'HC-5', candidateName: 'Rohit Panda', skillArea: 'Customer support', availableFrom: 'Immediate', owner: 'Sonal Patnaik', status: 'Nurture', notes: 'Good junior profile for future service desk expansion.' },
];

const documents: EmployeeDocument[] = [
  { id: 'DOC-1', employeeId: 'HE-2', employeeName: 'Anita Das', documentType: 'PAN Card', fileName: 'anita-pan.pdf', status: 'Verified' },
  { id: 'DOC-2', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', documentType: 'Address Proof', fileName: 'rakesh-address.pdf', status: 'Verified' },
  { id: 'DOC-3', employeeId: 'HE-6', employeeName: 'Debasis Rout', documentType: 'Employment Contract', fileName: 'debasis-contract.pdf', status: 'Verified' },
  { id: 'DOC-4', employeeId: 'HE-8', employeeName: 'Arjun Behera', documentType: 'Bank Proof', fileName: 'arjun-bank.pdf', status: 'Pending' },
  { id: 'DOC-5', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', documentType: 'Certification', fileName: 'support-certification.pdf', expiryDate: '2026-08-31', status: 'Verified' },
  { id: 'DOC-6', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', documentType: 'Experience Letter Draft', fileName: 'sameer-experience-draft.docx', expiryDate: '2026-07-15', status: 'Pending' },
  { id: 'DOC-7', employeeId: 'HE-6', employeeName: 'Debasis Rout', documentType: 'Safety Certification', fileName: 'field-safety-cert.pdf', expiryDate: '2026-06-10', status: 'Expired' },
];

const documentTemplates: DocumentTemplate[] = [
  { id: 'HDT-1', name: 'Offer Letter', category: 'Recruitment', description: 'Candidate offer letter with compensation and joining date merge fields.', owner: 'HR Admin', lastUpdated: '2026-06-12', status: 'Active' },
  { id: 'HDT-2', name: 'Employment Contract', category: 'Joining', description: 'Standard employment agreement for full-time staff.', owner: 'HR Admin', lastUpdated: '2026-06-10', status: 'Active' },
  { id: 'HDT-3', name: 'Experience Letter', category: 'Exit', description: 'Relieving and experience letter for offboarding closure.', owner: 'HR Admin', lastUpdated: '2026-06-18', status: 'Draft' },
  { id: 'HDT-4', name: 'Salary Certificate', category: 'Payroll', description: 'Salary certificate generated from the current payroll profile.', owner: 'Payroll', lastUpdated: '2026-06-15', status: 'Active' },
];

const documentRequests: DocumentRequest[] = [
  { id: 'HDR-1', employeeId: 'HE-8', employeeName: 'Arjun Behera', documentType: 'Bank Proof', requestedBy: 'HR Admin', dueDate: '2026-06-20', status: 'Requested', notes: 'Needed before payroll activation.' },
  { id: 'HDR-2', employeeId: 'HE-6', employeeName: 'Debasis Rout', documentType: 'Safety Certification Renewal', requestedBy: 'Priya Mishra', dueDate: '2026-06-28', status: 'Submitted', notes: 'Renewed certificate uploaded for verification.' },
  { id: 'HDR-3', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', documentType: 'No Dues Declaration', requestedBy: 'HR Admin', dueDate: '2026-07-12', status: 'Requested', notes: 'Required before final settlement.' },
];

const advances = [
  { id: 'ADV-1', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', amount: 15000, requestDate: '2026-06-12', status: 'Approved' as const },
  { id: 'ADV-2', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', amount: 8000, requestDate: '2026-06-17', status: 'Pending' as const },
];

const payrollAdjustments: PayrollAdjustment[] = [
  { id: 'HPA-1', employeeId: 'HE-6', employeeName: 'Debasis Rout', type: 'Reimbursement', amount: 4200, month: '2026-06', reason: 'Field travel and installation materials', status: 'Pending Approval', requestedBy: 'Debasis Rout', createdDate: '2026-06-15' },
  { id: 'HPA-2', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', type: 'Arrears', amount: 2800, month: '2026-06', reason: 'Shift allowance missed in May payroll', status: 'Approved', requestedBy: 'Priya Mishra', createdDate: '2026-06-16' },
  { id: 'HPA-3', employeeId: 'HE-4', employeeName: 'Priya Mishra', type: 'Retro Adjustment', amount: 6500, month: '2026-07', reason: 'Annual revision effective from April', status: 'Processed', requestedBy: 'Bibhudutta Dash', createdDate: '2026-06-18' },
];

export const createHrInitialState = (): HrStateShape => ({
  employees,
  attendance,
  attendanceCorrections,
  attendanceExceptions,
  leaveRequests,
  leaveBalances,
  leaveApprovalHistory,
  salarySlips,
  salaryComponents,
  payrollRuns,
  salaryReleases,
  companyProfile: {
    legalName: 'VumTech Solutions Pvt. Ltd.',
    brandName: 'VumTech',
    hrEmail: 'hr@vumtech.example',
    hrPhone: '+91 674 401 2233',
    fiscalYearLabel: 'FY 2026-27',
    payrollCalendarName: 'India Monthly Payroll',
    defaultBranchId: 'HB-1',
  },
  departments: [
    { id: 'HD-1', name: 'Sales', head: 'Anita Das', location: 'Bhubaneswar', budget: 1800000 },
    { id: 'HD-2', name: 'Operations', head: 'Priya Mishra', location: 'Bhubaneswar', budget: 2200000 },
    { id: 'HD-3', name: 'Engineering', head: 'Priya Mishra', location: 'Bhubaneswar', budget: 2800000 },
    { id: 'HD-4', name: 'Finance', head: 'Bibhudutta Dash', location: 'Bhubaneswar', budget: 900000 },
    { id: 'HD-5', name: 'Customer Success', head: 'Priya Mishra', location: 'Bhubaneswar', budget: 1200000 },
  ],
  branches,
  designations,
  leavePolicies,
  holidays,
  shiftGroups,
  rolePermissions,
  payrollCalendar: {
    fiscalYearStart: '2026-04-01',
    fiscalYearEnd: '2027-03-31',
    salaryDay: 30,
    payrollCutoffDay: 25,
    defaultSalaryBasis: 'Monthly',
    approvalRequired: true,
    paymentModes: ['Bank Transfer', 'Cash', 'Net Banking', 'UPI'],
  },
  auditLogs,
  onboardingTasks,
  offboardingItems,
  lifecycleEvents,
  salaryRevisions,
  performanceCycles,
  performanceGoals,
  performanceReviews,
  performanceFeedback,
  recruitmentJobs,
  jobPostings,
  candidates,
  interviews,
  offers,
  backgroundChecks,
  talentPool,
  documents,
  documentTemplates,
  documentRequests,
  advances,
  payrollAdjustments,
  assets,
  assetActivities,
});

export const calculateWorkHours = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;
  const [inHour, inMinute] = checkIn.split(':').map(Number);
  const [outHour, outMinute] = checkOut.split(':').map(Number);
  return Math.max(0, Math.round((((outHour * 60 + outMinute) - (inHour * 60 + inMinute)) / 60) * 100) / 100);
};

export const calculateLeaveDays = (fromDate: string, toDate: string) => Math.max(1, Math.round((new Date(toDate).getTime() - new Date(fromDate).getTime()) / 86400000) + 1);
export const calculateNetSalary = (employee: Employee) => employee.salary.basic + employee.salary.allowances - employee.salary.deductions - employee.salary.pf - employee.salary.esi;

export const getHrMetrics = (state: HrStateShape) => {
  const today = state.attendance.filter((entry) => entry.date === HR_DEMO_TODAY);
  return {
    totalEmployees: state.employees.filter((employee) => employee.status !== 'Inactive').length,
    presentToday: today.filter((entry) => ['Present', 'Late', 'Half Day'].includes(entry.status)).length,
    absentToday: today.filter((entry) => entry.status === 'Absent').length,
    onLeave: today.filter((entry) => entry.status === 'Leave').length,
    pendingLeave: state.leaveRequests.filter((leave) => leave.status === 'Pending').length,
    payrollDue: state.employees.length - state.salarySlips.filter((slip) => slip.month === '2026-06').length,
    newJoiners: state.employees.filter((employee) => employee.joiningDate >= '2026-06-01').length,
  };
};

export const getDepartmentHeadcount = (state: HrStateShape) => state.departments.map((department) => ({ name: department.name, count: state.employees.filter((employee) => employee.department === department.name).length }));
export const getBranchHeadcount = (state: HrStateShape) => state.branches.map((branch, branchIndex) => ({
  branch,
  count: state.employees.filter((employee, employeeIndex) => employee.branchId ? employee.branchId === branch.id : employeeIndex % state.branches.length === branchIndex).length,
}));
export const getShiftCoverage = (state: HrStateShape) => state.shiftGroups.map((shift, shiftIndex) => ({
  shift,
  assigned: state.employees.filter((employee, employeeIndex) => employee.shiftGroupId ? employee.shiftGroupId === shift.id : employeeIndex % state.shiftGroups.length === shiftIndex).length,
}));
export const getMonthlyPayrollCost = (state: HrStateShape) => state.employees.reduce((sum, employee) => sum + calculateNetSalary(employee), 0);

export const getRecruitmentMetrics = (state: HrStateShape) => ({
  openRequisitions: state.recruitmentJobs.filter((job) => job.status === 'Open').length,
  activeCandidates: state.candidates.filter((candidate) => !['Rejected', 'Accepted', 'Talent Pool'].includes(candidate.stage)).length,
  interviewsThisWeek: state.interviews.filter((interview) => interview.status === 'Scheduled' && interview.scheduledAt >= HR_DEMO_TODAY).length,
  offersPending: state.offers.filter((offer) => ['Pending Approval', 'Sent'].includes(offer.status)).length,
  acceptedAwaitingOnboarding: state.candidates.filter((candidate) => candidate.stage === 'Accepted' && !state.employees.some((employee) => employee.email === candidate.email)).length,
});
