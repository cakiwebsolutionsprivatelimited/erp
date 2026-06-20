import type { AttendanceEntry, AttendanceStatus, Employee, HrStateShape, SalarySlip } from '@/tenant/hr/types';

export const HR_DEMO_TODAY = '2026-06-18';
export const HR_TEAM = ['Bibhudutta Dash', 'Anita Das', 'Rakesh Sahoo', 'Priya Mishra', 'Sameer Patnaik', 'Debasis Rout', 'Sonal Patnaik', 'Arjun Behera'];
export const HR_DEPARTMENTS = ['Management', 'Sales', 'Operations', 'Finance', 'Engineering', 'Customer Success'];

const employees: Employee[] = [
  { id: 'HE-1', employeeNumber: 'EMP-001', name: 'Bibhudutta Dash', dateOfBirth: '1988-03-12', gender: 'Male', phone: '+91 94370 10001', email: 'owner@vumtech.example', address: 'Patia, Bhubaneswar', department: 'Management', designation: 'Managing Director', manager: 'Board', joiningDate: '2021-04-01', employmentType: 'Full Time', status: 'Active', salary: { basic: 95000, allowances: 42000, deductions: 4500, pf: 11400, esi: 0 }, bankName: 'HDFC Bank', bankAccountLast4: '2041', notes: 'Founder and business owner.' },
  { id: 'HE-2', employeeNumber: 'EMP-002', name: 'Anita Das', dateOfBirth: '1991-08-20', gender: 'Female', phone: '+91 94370 10002', email: 'anita@vumtech.example', address: 'Saheed Nagar, Bhubaneswar', department: 'Sales', designation: 'Sales Manager', manager: 'Bibhudutta Dash', joiningDate: '2022-01-10', employmentType: 'Full Time', status: 'Active', salary: { basic: 54000, allowances: 18000, deductions: 1800, pf: 6480, esi: 0 }, bankName: 'ICICI Bank', bankAccountLast4: '1184', notes: 'Leads enterprise and channel sales.' },
  { id: 'HE-3', employeeNumber: 'EMP-003', name: 'Rakesh Sahoo', dateOfBirth: '1995-05-18', gender: 'Male', phone: '+91 94370 10003', email: 'rakesh@vumtech.example', address: 'CDA, Cuttack', department: 'Sales', designation: 'Sales Executive', manager: 'Anita Das', joiningDate: '2023-06-05', employmentType: 'Full Time', status: 'Active', salary: { basic: 32000, allowances: 11500, deductions: 900, pf: 3840, esi: 0 }, bankName: 'Axis Bank', bankAccountLast4: '6612', notes: 'Handles SME accounts in coastal Odisha.' },
  { id: 'HE-4', employeeNumber: 'EMP-004', name: 'Priya Mishra', dateOfBirth: '1992-11-02', gender: 'Female', phone: '+91 94370 10004', email: 'priya@vumtech.example', address: 'Khandagiri, Bhubaneswar', department: 'Operations', designation: 'Operations Manager', manager: 'Bibhudutta Dash', joiningDate: '2022-08-16', employmentType: 'Full Time', status: 'Active', salary: { basic: 58000, allowances: 21000, deductions: 1600, pf: 6960, esi: 0 }, bankName: 'SBI', bankAccountLast4: '4022', notes: 'Owns customer delivery and internal operations.' },
  { id: 'HE-5', employeeNumber: 'EMP-005', name: 'Sameer Patnaik', dateOfBirth: '1989-01-29', gender: 'Male', phone: '+91 94370 10005', email: 'sameer@vumtech.example', address: 'Old Town, Bhubaneswar', department: 'Finance', designation: 'Accountant', manager: 'Bibhudutta Dash', joiningDate: '2024-02-01', employmentType: 'Full Time', status: 'Notice Period', salary: { basic: 41000, allowances: 13500, deductions: 1200, pf: 4920, esi: 0 }, bankName: 'Bank of Baroda', bankAccountLast4: '9077', notes: 'Notice period ends July 15.' },
  { id: 'HE-6', employeeNumber: 'EMP-006', name: 'Debasis Rout', dateOfBirth: '1994-07-06', gender: 'Male', phone: '+91 94370 10006', email: 'debasis@vumtech.example', address: 'Rasulgarh, Bhubaneswar', department: 'Engineering', designation: 'Implementation Engineer', manager: 'Priya Mishra', joiningDate: '2024-09-09', employmentType: 'Full Time', status: 'Active', salary: { basic: 44000, allowances: 15500, deductions: 1050, pf: 5280, esi: 0 }, bankName: 'HDFC Bank', bankAccountLast4: '3308', notes: 'Implementation and field hardware specialist.' },
  { id: 'HE-7', employeeNumber: 'EMP-007', name: 'Sonal Patnaik', dateOfBirth: '1997-02-14', gender: 'Female', phone: '+91 94370 10007', email: 'sonal@vumtech.example', address: 'Nayapalli, Bhubaneswar', department: 'Customer Success', designation: 'Support Specialist', manager: 'Priya Mishra', joiningDate: '2025-03-17', employmentType: 'Full Time', status: 'Active', salary: { basic: 30000, allowances: 9800, deductions: 600, pf: 3600, esi: 0 }, bankName: 'Kotak Mahindra Bank', bankAccountLast4: '7814', notes: 'Owns helpdesk queues and customer training.' },
  { id: 'HE-8', employeeNumber: 'EMP-008', name: 'Arjun Behera', dateOfBirth: '1998-09-23', gender: 'Male', phone: '+91 94370 10008', email: 'arjun@vumtech.example', address: 'Mancheswar, Bhubaneswar', department: 'Engineering', designation: 'Field Technician', manager: 'Priya Mishra', joiningDate: '2026-06-03', employmentType: 'Full Time', status: 'Probation', salary: { basic: 26000, allowances: 8200, deductions: 400, pf: 3120, esi: 0 }, bankName: 'SBI', bankAccountLast4: '5129', notes: 'New joiner in the field service team.' },
];

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

const salarySlips: SalarySlip[] = employees.slice(0, 6).map((employee, index) => {
  const { basic, allowances, deductions, pf, esi } = employee.salary;
  return {
    id: `HS-${index + 1}`, slipNumber: `PAY-2026-05-${String(index + 1).padStart(3, '0')}`,
    employeeId: employee.id, employeeName: employee.name, month: '2026-05', basic, allowances, deductions, pf, esi,
    netSalary: basic + allowances - deductions - pf - esi, paymentStatus: index < 5 ? 'Paid' : 'Processed', generatedDate: '2026-05-31',
  };
});

export const createHrInitialState = (): HrStateShape => ({
  employees,
  attendance,
  leaveRequests: [
    { id: 'HL-1', employeeId: 'HE-5', employeeName: 'Sameer Patnaik', leaveType: 'Earned Leave', fromDate: '2026-06-18', toDate: '2026-06-18', days: 1, reason: 'Personal appointment', status: 'Approved', appliedDate: '2026-06-14' },
    { id: 'HL-2', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', leaveType: 'Casual Leave', fromDate: '2026-06-23', toDate: '2026-06-24', days: 2, reason: 'Family function', status: 'Pending', appliedDate: '2026-06-17' },
    { id: 'HL-3', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', leaveType: 'Sick Leave', fromDate: '2026-06-19', toDate: '2026-06-19', days: 1, reason: 'Medical rest', status: 'Pending', appliedDate: '2026-06-18' },
    { id: 'HL-4', employeeId: 'HE-2', employeeName: 'Anita Das', leaveType: 'Earned Leave', fromDate: '2026-07-02', toDate: '2026-07-04', days: 3, reason: 'Planned travel', status: 'Pending', appliedDate: '2026-06-16' },
    { id: 'HL-5', employeeId: 'HE-6', employeeName: 'Debasis Rout', leaveType: 'Comp Off', fromDate: '2026-06-12', toDate: '2026-06-12', days: 1, reason: 'Weekend deployment compensation', status: 'Approved', appliedDate: '2026-06-09' },
    { id: 'HL-6', employeeId: 'HE-4', employeeName: 'Priya Mishra', leaveType: 'Casual Leave', fromDate: '2026-06-10', toDate: '2026-06-10', days: 1, reason: 'Personal work', status: 'Rejected', appliedDate: '2026-06-08' },
  ],
  salarySlips,
  departments: [
    { id: 'HD-1', name: 'Sales', head: 'Anita Das', location: 'Bhubaneswar', budget: 1800000 },
    { id: 'HD-2', name: 'Operations', head: 'Priya Mishra', location: 'Bhubaneswar', budget: 2200000 },
    { id: 'HD-3', name: 'Engineering', head: 'Priya Mishra', location: 'Bhubaneswar', budget: 2800000 },
    { id: 'HD-4', name: 'Finance', head: 'Bibhudutta Dash', location: 'Bhubaneswar', budget: 900000 },
    { id: 'HD-5', name: 'Customer Success', head: 'Priya Mishra', location: 'Bhubaneswar', budget: 1200000 },
  ],
  documents: [
    { id: 'DOC-1', employeeId: 'HE-2', employeeName: 'Anita Das', documentType: 'PAN Card', fileName: 'anita-pan.pdf', status: 'Verified' },
    { id: 'DOC-2', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', documentType: 'Address Proof', fileName: 'rakesh-address.pdf', status: 'Verified' },
    { id: 'DOC-3', employeeId: 'HE-6', employeeName: 'Debasis Rout', documentType: 'Employment Contract', fileName: 'debasis-contract.pdf', status: 'Verified' },
    { id: 'DOC-4', employeeId: 'HE-8', employeeName: 'Arjun Behera', documentType: 'Bank Proof', fileName: 'arjun-bank.pdf', status: 'Pending' },
    { id: 'DOC-5', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', documentType: 'Certification', fileName: 'support-certification.pdf', expiryDate: '2026-08-31', status: 'Verified' },
  ],
  advances: [
    { id: 'ADV-1', employeeId: 'HE-3', employeeName: 'Rakesh Sahoo', amount: 15000, requestDate: '2026-06-12', status: 'Approved' },
    { id: 'ADV-2', employeeId: 'HE-7', employeeName: 'Sonal Patnaik', amount: 8000, requestDate: '2026-06-17', status: 'Pending' },
  ],
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
export const getMonthlyPayrollCost = (state: HrStateShape) => state.employees.reduce((sum, employee) => sum + calculateNetSalary(employee), 0);
