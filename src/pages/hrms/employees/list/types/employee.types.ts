export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave' | 'Probation' | 'Terminated' | 'Resigned';
export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';

export interface Employee {
  id: string; // e.g. EMP001
  photoUrl?: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  workLocation: string;
  shiftTiming: string;
  reportingManager: string;
  status: EmployeeStatus;
  profileCompleteness: number; // 0 - 100
  
  // Sensitive / Additional KYC Info (Mock Masking supported)
  uanNumber?: string;
  esiNumber?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  passportNumber?: string;

  // Salary details
  basicSalary?: number;
  hra?: number;
  grossSalary?: number;
  netSalary?: number;
  bankName?: string;
  accountNumber?: string;

  // Emergency contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;

  // Activities & Status flags
  attendanceStatus?: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';
  payrollSyncStatus?: 'Synchronized' | 'Pending' | 'Error';
  backgroundVerificationStatus?: 'Approved' | 'In Progress' | 'Failed';
  documentVerificationStatus?: 'Verified' | 'Pending Audit' | 'Rejected';
  timelineActivity?: Array<{
    id: string;
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>;
}
