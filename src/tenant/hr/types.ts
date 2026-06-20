export type EmployeeStatus = 'Active' | 'Probation' | 'Notice Period' | 'Inactive';
export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Late' | 'Leave' | 'Holiday';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type PayrollStatus = 'Draft' | 'Processed' | 'Paid';

export interface EmployeeSalary {
  basic: number;
  allowances: number;
  deductions: number;
  pf: number;
  esi: number;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  designation: string;
  manager: string;
  joiningDate: string;
  employmentType: string;
  status: EmployeeStatus;
  salary: EmployeeSalary;
  bankName: string;
  bankAccountLast4: string;
  notes: string;
}

export type EmployeeDraft = Omit<Employee, 'id' | 'employeeNumber'>;

export interface AttendanceEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  workHours: number;
  location: string;
}

export type AttendanceDraft = Pick<AttendanceEntry, 'employeeId' | 'date' | 'checkIn' | 'checkOut' | 'status' | 'location'>;

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
}

export type LeaveDraft = Pick<LeaveRequest, 'employeeId' | 'leaveType' | 'fromDate' | 'toDate' | 'reason'>;

export interface SalarySlip {
  id: string;
  slipNumber: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  pf: number;
  esi: number;
  netSalary: number;
  paymentStatus: PayrollStatus;
  generatedDate: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  location: string;
  budget: number;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: string;
  fileName: string;
  expiryDate?: string;
  status: 'Verified' | 'Pending' | 'Expired';
}

export interface AdvanceSalary {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Recovered';
}

export interface HrStateShape {
  employees: Employee[];
  attendance: AttendanceEntry[];
  leaveRequests: LeaveRequest[];
  salarySlips: SalarySlip[];
  departments: Department[];
  documents: EmployeeDocument[];
  advances: AdvanceSalary[];
}
