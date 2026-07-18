export type EmployeeStatus = 'Active' | 'Probation' | 'Notice Period' | 'Inactive';
export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Late' | 'Leave' | 'Holiday';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type PayrollStatus = 'Draft' | 'Processed' | 'Paid';
export type BranchStatus = 'Active' | 'Inactive' | 'Draft';
export type SetupStatus = 'Active' | 'Inactive' | 'Draft';
export type HolidayType = 'Public Holiday' | 'Optional Holiday' | 'Branch Holiday' | 'Special Working Day';
export type SalaryBasis = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
export type LifecycleTaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
export type LifecycleEventType = 'Joined' | 'Onboarding' | 'Probation' | 'Promotion' | 'Transfer' | 'Salary Revision' | 'Exit';
export type JobRequisitionStatus = 'Draft' | 'Open' | 'On Hold' | 'Closed';
export type RecruitmentApprovalStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
export type CandidateStage = 'Applied' | 'Screened' | 'Shortlisted' | 'Interview' | 'Offer' | 'Accepted' | 'Rejected' | 'Talent Pool';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
export type OfferStatus = 'Draft' | 'Pending Approval' | 'Sent' | 'Accepted' | 'Rejected' | 'Withdrawn';
export type BackgroundCheckStatus = 'Pending' | 'In Progress' | 'Clear' | 'Concern';
export type AttendanceCorrectionStatus = 'Pending' | 'Approved' | 'Rejected';
export type AttendanceExceptionType = 'Absent' | 'Late' | 'Half Day' | 'Missing Punch' | 'Overtime' | 'Correction Pending';
export type PayrollRunStatus = 'Draft' | 'Reviewed' | 'Approved' | 'Released' | 'Locked';
export type SalaryComponentType = 'Earning' | 'Deduction' | 'Statutory';
export type SalaryReleaseStatus = 'Queued' | 'Released' | 'Failed';
export type PerformanceCycleStatus = 'Draft' | 'Active' | 'Calibration' | 'Closed';
export type PerformanceGoalStatus = 'Not Started' | 'On Track' | 'At Risk' | 'Completed';
export type PerformanceReviewStatus = 'Draft' | 'Self Review' | 'Manager Review' | 'Calibration' | 'Finalized';
export type PerformanceFeedbackType = 'Recognition' | 'Coaching' | 'Improvement' | 'Manager Note';
export type AssetStatus = 'Available' | 'Assigned' | 'In Repair' | 'Retired';
export type AssetCondition = 'New' | 'Good' | 'Needs Repair' | 'Damaged';
export type AssetReturnStatus = 'Not Due' | 'Return Due' | 'Returned';
export type DocumentRequestStatus = 'Requested' | 'Submitted' | 'Verified' | 'Rejected';
export type DocumentTemplateStatus = 'Active' | 'Draft';
export type PayrollAdjustmentType = 'Reimbursement' | 'Arrears' | 'Retro Adjustment';
export type PayrollAdjustmentStatus = 'Pending Approval' | 'Approved' | 'Processed' | 'Rejected';

export interface EmployeeSalary {
  basic: number;
  allowances: number;
  deductions: number;
  pf: number;
  esi: number;
}

export interface EmployeeEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface EmployeeGovernmentId {
  type: string;
  valueLast4: string;
  verified: boolean;
}

export interface EmployeeSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface EmployeeEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface EmployeeExperience {
  company: string;
  role: string;
  years: number;
}

export interface EmploymentHistoryEntry {
  date: string;
  event: string;
  role: string;
  department: string;
  manager: string;
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
  branchId?: string;
  branchName?: string;
  shiftGroupId?: string;
  shiftGroupName?: string;
  probationEndDate?: string;
  salary: EmployeeSalary;
  bankName: string;
  bankAccountLast4: string;
  emergencyContacts?: EmployeeEmergencyContact[];
  governmentIds?: EmployeeGovernmentId[];
  skills?: EmployeeSkill[];
  education?: EmployeeEducation[];
  experience?: EmployeeExperience[];
  employmentHistory?: EmploymentHistoryEntry[];
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

export interface AttendanceCorrection {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  oldCheckIn: string;
  oldCheckOut: string;
  newCheckIn: string;
  newCheckOut: string;
  reason: string;
  approver: string;
  status: AttendanceCorrectionStatus;
  requestedAt: string;
  resolvedAt?: string;
}

export type AttendanceCorrectionDraft = Pick<AttendanceCorrection, 'employeeId' | 'date' | 'newCheckIn' | 'newCheckOut' | 'reason' | 'approver'>;

export interface AttendanceException {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  type: AttendanceExceptionType;
  shiftGroupName: string;
  detail: string;
  status: 'Open' | 'Resolved';
}

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

export interface LeaveBalance {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  annualAllowance: number;
  used: number;
  pending: number;
  available: number;
  carryForward: number;
}

export interface LeaveApprovalEntry {
  id: string;
  leaveId: string;
  actor: string;
  action: 'Applied' | 'Approved' | 'Rejected' | 'Cancelled' | 'Delegated';
  timestamp: string;
  comment: string;
}

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

export interface SalaryComponent {
  id: string;
  employeeId: string;
  employeeName: string;
  name: string;
  type: SalaryComponentType;
  amount: number;
  taxable: boolean;
  formula?: string;
}

export type SalaryComponentDraft = Pick<SalaryComponent, 'employeeId' | 'name' | 'type' | 'amount' | 'taxable' | 'formula'>;

export interface PayrollRun {
  id: string;
  month: string;
  status: PayrollRunStatus;
  employeeCount: number;
  grossAmount: number;
  deductionAmount: number;
  netAmount: number;
  preparedBy: string;
  approvedBy?: string;
  releasedAt?: string;
  locked: boolean;
}

export interface SalaryRelease {
  id: string;
  slipId: string;
  employeeId: string;
  employeeName: string;
  month: string;
  amount: number;
  mode: 'Bank Transfer' | 'Cash' | 'Net Banking' | 'UPI';
  status: SalaryReleaseStatus;
  reference: string;
  releaseDate?: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  location: string;
  budget: number;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  admin: string;
  workingDays: string[];
  holidayCalendar: string;
  status: BranchStatus;
}

export type BranchDraft = Omit<Branch, 'id'>;

export interface Designation {
  id: string;
  title: string;
  department: string;
  level: string;
  employmentType: string;
  status: SetupStatus;
}

export type DesignationDraft = Omit<Designation, 'id'>;

export interface LeavePolicy {
  id: string;
  code: string;
  name: string;
  paid: boolean;
  annualAllowance: number;
  carryForward: boolean;
  maxCarryForward: number;
  encashment: boolean;
  expiryRule: string;
  approvalChain: string;
  status: SetupStatus;
}

export type LeavePolicyDraft = Omit<LeavePolicy, 'id'>;

export interface Holiday {
  id: string;
  name: string;
  date: string;
  branchId: string;
  branchName: string;
  type: HolidayType;
  status: SetupStatus;
}

export type HolidayDraft = Omit<Holiday, 'id' | 'branchName'>;

export interface ShiftGroup {
  id: string;
  name: string;
  branchId: string;
  branchName: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  overtimeEligible: boolean;
  workingDays: string[];
  status: SetupStatus;
}

export type ShiftGroupDraft = Omit<ShiftGroup, 'id' | 'branchName'>;

export interface RolePermission {
  id: string;
  role: 'Business Owner' | 'HR Admin' | 'Manager' | 'Staff';
  scope: string;
  menuAccess: string[];
  canViewSalary: boolean;
  canApproveLeave: boolean;
  canEditAttendance: boolean;
  canRunPayroll: boolean;
  canExport: boolean;
}

export interface PayrollCalendar {
  fiscalYearStart: string;
  fiscalYearEnd: string;
  salaryDay: number;
  payrollCutoffDay: number;
  defaultSalaryBasis: SalaryBasis;
  approvalRequired: boolean;
  paymentModes: string[];
}

export interface HrCompanyProfile {
  legalName: string;
  brandName: string;
  hrEmail: string;
  hrPhone: string;
  fiscalYearLabel: string;
  payrollCalendarName: string;
  defaultBranchId: string;
}

export interface HrAuditLog {
  id: string;
  actor: string;
  action: string;
  module: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  owner: string;
  dueDate: string;
  category: 'HR' | 'IT' | 'Payroll' | 'Manager' | 'Admin';
  status: LifecycleTaskStatus;
}

export interface OffboardingItem {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  owner: string;
  dueDate: string;
  status: LifecycleTaskStatus;
}

export interface EmployeeLifecycleEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LifecycleEventType;
  date: string;
  title: string;
  details: string;
  actor: string;
}

export interface SalaryRevision {
  id: string;
  employeeId: string;
  employeeName: string;
  effectiveDate: string;
  previousNet: number;
  revisedNet: number;
  reason: string;
  status: 'Draft' | 'Approved' | 'Applied';
}

export interface PerformanceCycle {
  id: string;
  name: string;
  period: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: PerformanceCycleStatus;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  employeeName: string;
  cycleId: string;
  title: string;
  metric: string;
  target: number;
  current: number;
  weight: number;
  dueDate: string;
  owner: string;
  status: PerformanceGoalStatus;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  cycleId: string;
  cycleName: string;
  reviewer: string;
  selfRating: number;
  managerRating: number;
  finalRating?: number;
  status: PerformanceReviewStatus;
  submittedAt?: string;
  summary: string;
  feedback: string;
}

export interface PerformanceFeedback {
  id: string;
  employeeId: string;
  employeeName: string;
  from: string;
  date: string;
  type: PerformanceFeedbackType;
  note: string;
}

export type PerformanceFeedbackDraft = Pick<PerformanceFeedback, 'employeeId' | 'from' | 'type' | 'note'>;

export interface JobRequisition {
  id: string;
  requisitionNumber: string;
  title: string;
  department: string;
  branchId: string;
  branchName: string;
  hiringManager: string;
  headcount: number;
  filled: number;
  budgetMin: number;
  budgetMax: number;
  experience: string;
  employmentType: string;
  priority: 'Low' | 'Medium' | 'High';
  approvalStatus: RecruitmentApprovalStatus;
  status: JobRequisitionStatus;
  openedDate: string;
  targetDate: string;
  description: string;
}

export type JobRequisitionDraft = Omit<JobRequisition, 'id' | 'requisitionNumber' | 'branchName' | 'filled'>;

export interface JobPosting {
  id: string;
  jobId: string;
  jobTitle: string;
  channel: 'Internal' | 'Career Page' | 'LinkedIn' | 'Referral';
  visibility: 'Internal' | 'Public';
  status: 'Draft' | 'Published' | 'Paused';
  applications: number;
  publishedDate?: string;
}

export interface Candidate {
  id: string;
  candidateNumber: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  source: string;
  stage: CandidateStage;
  expectedSalary: number;
  noticePeriod: string;
  rating: number;
  appliedDate: string;
  owner: string;
  tags: string[];
  resumeFile: string;
  duplicateWarning?: boolean;
  backgroundCheckStatus: BackgroundCheckStatus;
  notes: string;
}

export type CandidateDraft = Omit<Candidate, 'id' | 'candidateNumber' | 'jobTitle' | 'stage' | 'rating' | 'backgroundCheckStatus'>;

export interface InterviewRound {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  round: string;
  panel: string[];
  scheduledAt: string;
  mode: 'In person' | 'Video' | 'Phone';
  status: InterviewStatus;
  score?: number;
  feedback: string;
}

export type InterviewDraft = Omit<InterviewRound, 'id' | 'candidateName' | 'jobTitle' | 'status' | 'score' | 'feedback'>;

export interface Offer {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  offeredSalary: number;
  joiningDate: string;
  approver: string;
  status: OfferStatus;
  sentDate?: string;
  acceptedDate?: string;
  notes: string;
}

export type OfferDraft = Omit<Offer, 'id' | 'candidateName' | 'jobId' | 'jobTitle' | 'status' | 'sentDate' | 'acceptedDate'>;

export interface BackgroundCheck {
  id: string;
  candidateId: string;
  candidateName: string;
  checkType: string;
  owner: string;
  dueDate: string;
  status: BackgroundCheckStatus;
  notes: string;
}

export interface TalentPoolEntry {
  id: string;
  candidateId: string;
  candidateName: string;
  skillArea: string;
  availableFrom: string;
  owner: string;
  status: 'Warm' | 'Nurture' | 'Do Not Contact';
  notes: string;
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

export type EmployeeDocumentDraft = Pick<EmployeeDocument, 'employeeId' | 'documentType' | 'fileName' | 'expiryDate'>;

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  owner: string;
  lastUpdated: string;
  status: DocumentTemplateStatus;
}

export interface DocumentRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: string;
  requestedBy: string;
  dueDate: string;
  status: DocumentRequestStatus;
  notes: string;
}

export interface AdvanceSalary {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Recovered';
}

export interface PayrollAdjustment {
  id: string;
  employeeId: string;
  employeeName: string;
  type: PayrollAdjustmentType;
  amount: number;
  month: string;
  reason: string;
  status: PayrollAdjustmentStatus;
  requestedBy: string;
  createdDate: string;
}

export type PayrollAdjustmentDraft = Pick<PayrollAdjustment, 'employeeId' | 'type' | 'amount' | 'month' | 'reason'>;

export interface HrAsset {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  serialNumber: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedDate?: string;
  expectedReturnDate?: string;
  condition: AssetCondition;
  location: string;
  status: AssetStatus;
  returnStatus: AssetReturnStatus;
  notes: string;
}

export interface AssetActivity {
  id: string;
  assetId: string;
  assetTag: string;
  employeeName: string;
  date: string;
  action: string;
  owner: string;
  notes: string;
}

export interface HrStateShape {
  employees: Employee[];
  attendance: AttendanceEntry[];
  attendanceCorrections: AttendanceCorrection[];
  attendanceExceptions: AttendanceException[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  leaveApprovalHistory: LeaveApprovalEntry[];
  salarySlips: SalarySlip[];
  salaryComponents: SalaryComponent[];
  payrollRuns: PayrollRun[];
  salaryReleases: SalaryRelease[];
  departments: Department[];
  branches: Branch[];
  designations: Designation[];
  leavePolicies: LeavePolicy[];
  holidays: Holiday[];
  shiftGroups: ShiftGroup[];
  rolePermissions: RolePermission[];
  payrollCalendar: PayrollCalendar;
  companyProfile: HrCompanyProfile;
  auditLogs: HrAuditLog[];
  onboardingTasks: OnboardingTask[];
  offboardingItems: OffboardingItem[];
  lifecycleEvents: EmployeeLifecycleEvent[];
  salaryRevisions: SalaryRevision[];
  performanceCycles: PerformanceCycle[];
  performanceGoals: PerformanceGoal[];
  performanceReviews: PerformanceReview[];
  performanceFeedback: PerformanceFeedback[];
  recruitmentJobs: JobRequisition[];
  jobPostings: JobPosting[];
  candidates: Candidate[];
  interviews: InterviewRound[];
  offers: Offer[];
  backgroundChecks: BackgroundCheck[];
  talentPool: TalentPoolEntry[];
  documents: EmployeeDocument[];
  documentTemplates: DocumentTemplate[];
  documentRequests: DocumentRequest[];
  advances: AdvanceSalary[];
  payrollAdjustments: PayrollAdjustment[];
  assets: HrAsset[];
  assetActivities: AssetActivity[];
}
