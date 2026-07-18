import React, { createContext, useContext, useMemo, useState } from 'react';
import { HR_DEMO_TODAY, calculateLeaveDays, calculateNetSalary, calculateWorkHours, createHrInitialState } from '@/tenant/hr/hrDemoService';
import type {
  AttendanceDraft,
  AttendanceCorrection,
  AttendanceCorrectionDraft,
  AttendanceCorrectionStatus,
  AttendanceEntry,
  AdvanceSalary,
  AssetCondition,
  AssetStatus,
  AssetActivity,
  BackgroundCheckStatus,
  Branch,
  BranchDraft,
  Candidate,
  CandidateDraft,
  CandidateStage,
  Designation,
  DesignationDraft,
  DocumentRequestStatus,
  EmployeeDocument,
  EmployeeDocumentDraft,
  Employee,
  EmployeeDraft,
  EmployeeLifecycleEvent,
  Holiday,
  HolidayDraft,
  HrCompanyProfile,
  HrStateShape,
  InterviewDraft,
  InterviewRound,
  InterviewStatus,
  JobRequisition,
  JobRequisitionDraft,
  LeaveDraft,
  LeaveApprovalEntry,
  LeaveBalance,
  LeavePolicy,
  LeavePolicyDraft,
  LeaveRequest,
  LeaveStatus,
  LifecycleTaskStatus,
  OffboardingItem,
  OnboardingTask,
  Offer,
  OfferDraft,
  OfferStatus,
  PayrollCalendar,
  PayrollAdjustmentStatus,
  PayrollRunStatus,
  PerformanceFeedback,
  PerformanceFeedbackDraft,
  PerformanceGoalStatus,
  PerformanceReviewStatus,
  RolePermission,
  SalaryComponent,
  SalaryComponentDraft,
  SalaryRelease,
  SalaryRevision,
  SalarySlip,
  ShiftGroup,
  ShiftGroupDraft,
} from '@/tenant/hr/types';

type PermissionKey = 'canViewSalary' | 'canApproveLeave' | 'canEditAttendance' | 'canRunPayroll' | 'canExport';

interface HrDataState extends HrStateShape {
  addEmployee: (draft: EmployeeDraft) => string;
  markAttendance: (draft: AttendanceDraft) => void;
  createAttendanceCorrection: (draft: AttendanceCorrectionDraft) => string;
  updateAttendanceCorrectionStatus: (id: string, status: AttendanceCorrectionStatus) => void;
  applyLeave: (draft: LeaveDraft) => string;
  updateLeaveStatus: (id: string, status: LeaveStatus) => void;
  bulkUpdateLeaveStatus: (ids: string[], status: LeaveStatus) => void;
  createEmployeeDocument: (draft: EmployeeDocumentDraft) => string;
  generateEmployeeDocument: (templateId: string, employeeId: string) => string;
  updateEmployeeDocumentStatus: (id: string, status: EmployeeDocument['status']) => void;
  updateDocumentRequestStatus: (id: string, status: DocumentRequestStatus) => void;
  generateSalarySlip: (employeeId: string, month: string) => string;
  createSalaryComponent: (draft: SalaryComponentDraft) => string;
  processPayroll: (month: string) => void;
  updatePayrollRunStatus: (id: string, status: PayrollRunStatus) => void;
  releaseSalarySlip: (slipId: string, mode: SalaryRelease['mode']) => void;
  updateAdvanceStatus: (id: string, status: AdvanceSalary['status']) => void;
  updatePayrollAdjustmentStatus: (id: string, status: PayrollAdjustmentStatus) => void;
  updateOnboardingTaskStatus: (id: string, status: LifecycleTaskStatus) => void;
  confirmProbation: (employeeId: string) => void;
  startOffboarding: (employeeId: string, lastWorkingDay: string) => void;
  updateOffboardingItemStatus: (id: string, status: LifecycleTaskStatus) => void;
  recordSalaryRevision: (employeeId: string, revisedNet: number, reason: string) => string;
  updatePerformanceGoalStatus: (id: string, status: PerformanceGoalStatus) => void;
  updatePerformanceReviewStatus: (id: string, status: PerformanceReviewStatus) => void;
  createPerformanceFeedback: (draft: PerformanceFeedbackDraft) => string;
  assignAsset: (assetId: string, employeeId: string) => void;
  markAssetReturned: (assetId: string, condition: AssetCondition) => void;
  updateAssetStatus: (assetId: string, status: AssetStatus) => void;
  createJobRequisition: (draft: JobRequisitionDraft) => string;
  createCandidate: (draft: CandidateDraft) => string;
  updateCandidateStage: (id: string, stage: CandidateStage) => void;
  scheduleInterview: (draft: InterviewDraft) => string;
  updateInterviewStatus: (id: string, status: InterviewStatus, score?: number, feedback?: string) => void;
  createOffer: (draft: OfferDraft) => string;
  updateOfferStatus: (id: string, status: OfferStatus) => void;
  updateBackgroundCheckStatus: (id: string, status: BackgroundCheckStatus) => void;
  handoffCandidateToOnboarding: (candidateId: string) => string;
  updateCompanyProfile: (profile: HrCompanyProfile) => void;
  createBranch: (draft: BranchDraft) => string;
  createDesignation: (draft: DesignationDraft) => string;
  createLeavePolicy: (draft: LeavePolicyDraft) => string;
  createHoliday: (draft: HolidayDraft) => string;
  createShiftGroup: (draft: ShiftGroupDraft) => string;
  updatePayrollCalendar: (calendar: PayrollCalendar) => void;
  toggleRolePermission: (id: string, key: PermissionKey) => void;
  resetHrData: () => void;
}

const STORAGE_KEY = 'hr-demo-state-v1';
const initialState = createHrInitialState();

const normaliseHrState = (stored: Partial<HrStateShape>): HrStateShape => {
  const merged: HrStateShape = { ...initialState, ...stored };
  return {
    ...merged,
    employees: merged.employees.map((employee) => {
      const seeded = initialState.employees.find((item) => item.id === employee.id);
      return {
        ...(seeded || employee),
        ...employee,
        branchId: employee.branchId || seeded?.branchId,
        branchName: employee.branchName || seeded?.branchName,
        shiftGroupId: employee.shiftGroupId || seeded?.shiftGroupId,
        shiftGroupName: employee.shiftGroupName || seeded?.shiftGroupName,
        probationEndDate: employee.probationEndDate || seeded?.probationEndDate,
        emergencyContacts: employee.emergencyContacts || seeded?.emergencyContacts || [],
        governmentIds: employee.governmentIds || seeded?.governmentIds || [],
        skills: employee.skills || seeded?.skills || [],
        education: employee.education || seeded?.education || [],
        experience: employee.experience || seeded?.experience || [],
        employmentHistory: employee.employmentHistory || seeded?.employmentHistory || [{ date: employee.joiningDate, event: 'Joined', role: employee.designation, department: employee.department, manager: employee.manager }],
      };
    }),
    attendanceCorrections: merged.attendanceCorrections || initialState.attendanceCorrections,
    attendanceExceptions: merged.attendanceExceptions || initialState.attendanceExceptions,
    leaveBalances: merged.leaveBalances || initialState.leaveBalances,
    leaveApprovalHistory: merged.leaveApprovalHistory || initialState.leaveApprovalHistory,
    salaryComponents: merged.salaryComponents || initialState.salaryComponents,
    payrollRuns: merged.payrollRuns || initialState.payrollRuns,
    salaryReleases: merged.salaryReleases || initialState.salaryReleases,
    rolePermissions: initialState.rolePermissions.map((seededRole) => {
      const storedRole = merged.rolePermissions?.find((role) => role.role === seededRole.role);
      return storedRole ? { ...seededRole, ...storedRole, menuAccess: seededRole.menuAccess } : seededRole;
    }),
    onboardingTasks: merged.onboardingTasks || initialState.onboardingTasks,
    offboardingItems: merged.offboardingItems || initialState.offboardingItems,
    lifecycleEvents: merged.lifecycleEvents || initialState.lifecycleEvents,
    salaryRevisions: merged.salaryRevisions || initialState.salaryRevisions,
    performanceCycles: merged.performanceCycles || initialState.performanceCycles,
    performanceGoals: merged.performanceGoals || initialState.performanceGoals,
    performanceReviews: merged.performanceReviews || initialState.performanceReviews,
    performanceFeedback: merged.performanceFeedback || initialState.performanceFeedback,
    recruitmentJobs: merged.recruitmentJobs || initialState.recruitmentJobs,
    jobPostings: merged.jobPostings || initialState.jobPostings,
    candidates: merged.candidates || initialState.candidates,
    interviews: merged.interviews || initialState.interviews,
    offers: merged.offers || initialState.offers,
    backgroundChecks: merged.backgroundChecks || initialState.backgroundChecks,
    talentPool: merged.talentPool || initialState.talentPool,
    documents: merged.documents || initialState.documents,
    documentTemplates: merged.documentTemplates || initialState.documentTemplates,
    documentRequests: merged.documentRequests || initialState.documentRequests,
    advances: merged.advances || initialState.advances,
    payrollAdjustments: merged.payrollAdjustments || initialState.payrollAdjustments,
    assets: merged.assets || initialState.assets,
    assetActivities: merged.assetActivities || initialState.assetActivities,
  };
};

const readInitialState = (): HrStateShape => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normaliseHrState(JSON.parse(stored) as Partial<HrStateShape>) : initialState;
  } catch {
    return initialState;
  }
};

const withAudit = (next: HrStateShape, action: string, module: string, target: string, details: string): HrStateShape => ({
  ...next,
  auditLogs: [
    { id: `HAL-${Date.now()}`, actor: 'Demo User', action, module, target, timestamp: new Date().toISOString(), details },
    ...next.auditLogs,
  ].slice(0, 50),
});

const addDays = (date: string, days: number) => {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
};

const salaryFromOffer = (netSalary: number): Employee['salary'] => {
  const basic = Math.round(netSalary * 0.65);
  const pf = Math.round(basic * 0.12);
  return { basic, allowances: netSalary - basic + pf, deductions: 0, pf, esi: 0 };
};

const updateLeaveBalancesForStatus = (balances: LeaveBalance[], request: LeaveRequest, fromStatus: LeaveStatus | null, toStatus: LeaveStatus) =>
  balances.map((balance) => {
    if (balance.employeeId !== request.employeeId || balance.leaveType !== request.leaveType) return balance;
    let pending = balance.pending;
    let used = balance.used;
    let available = balance.available;
    if (fromStatus === 'Pending') pending -= request.days;
    if (fromStatus === 'Approved') {
      used -= request.days;
      available += request.days;
    }
    if (toStatus === 'Pending') pending += request.days;
    if (toStatus === 'Approved') {
      used += request.days;
      available -= request.days;
    }
    return { ...balance, pending: Math.max(0, pending), used: Math.max(0, used), available: Math.max(0, available) };
  });

const HrDataContext = createContext<HrDataState | null>(null);

export const HrDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HrStateShape>(readInitialState);
  const persist = (next: HrStateShape) => { setState(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const value = useMemo<HrDataState>(() => ({
    ...state,
    addEmployee: (draft) => {
      const id = `HE-${Date.now()}`;
      const branch = state.branches.find((item) => item.id === draft.branchId);
      const shift = state.shiftGroups.find((item) => item.id === draft.shiftGroupId);
      const employee: Employee = { ...draft, id, employeeNumber: `EMP-${String(state.employees.length + 1).padStart(3, '0')}`, branchName: draft.branchName || branch?.name, shiftGroupName: draft.shiftGroupName || shift?.name };
      const onboardingTasks: OnboardingTask[] = [
        { id: `HOT-${Date.now()}-hr`, employeeId: id, employeeName: employee.name, title: 'Verify identity, bank, and signed joining forms', owner: 'HR Admin', dueDate: employee.joiningDate, category: 'HR', status: 'Pending' },
        { id: `HOT-${Date.now()}-it`, employeeId: id, employeeName: employee.name, title: 'Allocate workspace, system access, and device kit', owner: 'IT', dueDate: employee.joiningDate, category: 'IT', status: 'Pending' },
        { id: `HOT-${Date.now()}-manager`, employeeId: id, employeeName: employee.name, title: 'Complete manager induction and first-week plan', owner: employee.manager, dueDate: employee.probationEndDate || employee.joiningDate, category: 'Manager', status: 'Pending' },
        { id: `HOT-${Date.now()}-payroll`, employeeId: id, employeeName: employee.name, title: 'Activate payroll, leave, and attendance profile', owner: 'Payroll', dueDate: employee.joiningDate, category: 'Payroll', status: 'Pending' },
      ];
      const joinEvent: EmployeeLifecycleEvent = { id: `HLE-${Date.now()}`, employeeId: id, employeeName: employee.name, type: 'Joined', date: employee.joiningDate, title: 'Employee profile created', details: `${employee.name} added as ${employee.designation || 'new employee'} in ${employee.department}.`, actor: 'Demo User' };
      persist(withAudit({ ...state, employees: [employee, ...state.employees], onboardingTasks: [...onboardingTasks, ...state.onboardingTasks], lifecycleEvents: [joinEvent, ...state.lifecycleEvents] }, 'Created employee', 'Employees', employee.name, `Added ${employee.employeeNumber}.`));
      return id;
    },
    markAttendance: (draft) => {
      const employee = state.employees.find((item) => item.id === draft.employeeId);
      if (!employee) return;
      const entry: AttendanceEntry = { ...draft, id: `HA-${draft.employeeId}-${draft.date}`, employeeName: employee.name, workHours: calculateWorkHours(draft.checkIn, draft.checkOut) };
      const existing = state.attendance.some((item) => item.employeeId === draft.employeeId && item.date === draft.date);
      persist(withAudit({ ...state, attendance: existing ? state.attendance.map((item) => item.employeeId === draft.employeeId && item.date === draft.date ? entry : item) : [entry, ...state.attendance] }, existing ? 'Updated attendance' : 'Marked attendance', 'Attendance', employee.name, `${draft.date} marked as ${draft.status}.`));
    },
    createAttendanceCorrection: (draft) => {
      const employee = state.employees.find((item) => item.id === draft.employeeId);
      if (!employee) return '';
      const existing = state.attendance.find((item) => item.employeeId === draft.employeeId && item.date === draft.date);
      const id = `HAC-${Date.now()}`;
      const correction: AttendanceCorrection = { ...draft, id, employeeName: employee.name, oldCheckIn: existing?.checkIn || '', oldCheckOut: existing?.checkOut || '', status: 'Pending', requestedAt: new Date().toISOString() };
      persist(withAudit({
        ...state,
        attendanceCorrections: [correction, ...state.attendanceCorrections],
        attendanceExceptions: [{ id: `HAE-${Date.now()}`, employeeId: employee.id, employeeName: employee.name, date: draft.date, type: 'Correction Pending', shiftGroupName: employee.shiftGroupName || 'Shift not assigned', detail: draft.reason, status: 'Open' }, ...state.attendanceExceptions],
      }, 'Requested attendance correction', 'Attendance', employee.name, `${draft.date}: ${draft.reason}`));
      return id;
    },
    updateAttendanceCorrectionStatus: (id, status) => {
      const correction = state.attendanceCorrections.find((item) => item.id === id);
      if (!correction) return;
      const workHours = calculateWorkHours(correction.newCheckIn, correction.newCheckOut);
      const existing = state.attendance.find((item) => item.employeeId === correction.employeeId && item.date === correction.date);
      const correctedEntry: AttendanceEntry = {
        id: existing?.id || `HA-${correction.employeeId}-${correction.date}`,
        employeeId: correction.employeeId,
        employeeName: correction.employeeName,
        date: correction.date,
        checkIn: correction.newCheckIn,
        checkOut: correction.newCheckOut,
        status: workHours >= 8 ? 'Present' : workHours >= 4 ? 'Half Day' : 'Late',
        workHours,
        location: existing?.location || 'Manual correction',
      };
      const nextAttendance = status === 'Approved'
        ? existing ? state.attendance.map((item) => item.id === existing.id ? correctedEntry : item) : [correctedEntry, ...state.attendance]
        : state.attendance;
      persist(withAudit({
        ...state,
        attendance: nextAttendance,
        attendanceCorrections: state.attendanceCorrections.map((item) => item.id === id ? { ...item, status, resolvedAt: new Date().toISOString() } : item),
        attendanceExceptions: state.attendanceExceptions.map((item) => item.employeeId === correction.employeeId && item.date === correction.date ? { ...item, status: status === 'Approved' ? 'Resolved' : item.status } : item),
      }, `${status} attendance correction`, 'Attendance', correction.employeeName, `${correction.date} correction ${status.toLowerCase()}.`));
    },
    applyLeave: (draft) => {
      const employee = state.employees.find((item) => item.id === draft.employeeId);
      const id = `HL-${Date.now()}`;
      const request: LeaveRequest = { ...draft, id, employeeName: employee?.name || 'Employee', days: calculateLeaveDays(draft.fromDate, draft.toDate), status: 'Pending', appliedDate: HR_DEMO_TODAY };
      const history: LeaveApprovalEntry = { id: `LAH-${Date.now()}`, leaveId: id, actor: request.employeeName, action: 'Applied', timestamp: new Date().toISOString(), comment: request.reason };
      persist(withAudit({ ...state, leaveRequests: [request, ...state.leaveRequests], leaveBalances: updateLeaveBalancesForStatus(state.leaveBalances, request, null, 'Pending'), leaveApprovalHistory: [history, ...state.leaveApprovalHistory] }, 'Created leave request', 'Leave', request.employeeName, `${request.leaveType} for ${request.days} day(s).`));
      return id;
    },
    updateLeaveStatus: (id, status) => {
      const request = state.leaveRequests.find((item) => item.id === id);
      if (!request) return;
      const history: LeaveApprovalEntry = { id: `LAH-${Date.now()}`, leaveId: id, actor: 'Demo User', action: status === 'Approved' ? 'Approved' : status === 'Rejected' ? 'Rejected' : status === 'Cancelled' ? 'Cancelled' : 'Applied', timestamp: new Date().toISOString(), comment: `Status changed to ${status}.` };
      persist(withAudit({ ...state, leaveRequests: state.leaveRequests.map((item) => item.id === id ? { ...item, status } : item), leaveBalances: updateLeaveBalancesForStatus(state.leaveBalances, request, request.status, status), leaveApprovalHistory: [history, ...state.leaveApprovalHistory] }, 'Updated leave status', 'Leave', request.employeeName, `Status changed to ${status}.`));
    },
    bulkUpdateLeaveStatus: (ids, status) => {
      const selected = state.leaveRequests.filter((item) => ids.includes(item.id));
      const nextBalances = selected.reduce((balances, request) => updateLeaveBalancesForStatus(balances, request, request.status, status), state.leaveBalances);
      const histories: LeaveApprovalEntry[] = selected.map((request, index) => ({ id: `LAH-${Date.now()}-${index}`, leaveId: request.id, actor: 'Demo User', action: status === 'Approved' ? 'Approved' : status === 'Rejected' ? 'Rejected' : status === 'Cancelled' ? 'Cancelled' : 'Applied', timestamp: new Date().toISOString(), comment: `Bulk ${status.toLowerCase()} from leave workbench.` }));
      persist(withAudit({ ...state, leaveRequests: state.leaveRequests.map((item) => ids.includes(item.id) ? { ...item, status } : item), leaveBalances: nextBalances, leaveApprovalHistory: [...histories, ...state.leaveApprovalHistory] }, 'Bulk updated leave', 'Leave', `${selected.length} requests`, `Status changed to ${status}.`));
    },
    createEmployeeDocument: (draft) => {
      const employee = state.employees.find((item) => item.id === draft.employeeId);
      if (!employee) return '';
      const id = `DOC-${Date.now()}`;
      const document: EmployeeDocument = { ...draft, id, employeeName: employee.name, status: 'Pending' };
      persist(withAudit({
        ...state,
        documents: [document, ...state.documents],
        documentRequests: state.documentRequests.map((request) => request.employeeId === draft.employeeId && request.documentType === draft.documentType ? { ...request, status: 'Submitted' } : request),
      }, 'Uploaded employee document', 'Documents', employee.name, `${draft.documentType} uploaded as ${draft.fileName}.`));
      return id;
    },
    generateEmployeeDocument: (templateId, employeeId) => {
      const template = state.documentTemplates.find((item) => item.id === templateId);
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!template || !employee) return '';
      const id = `DOC-${Date.now()}`;
      const safeName = template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const document: EmployeeDocument = { id, employeeId, employeeName: employee.name, documentType: template.name, fileName: `${employee.employeeNumber.toLowerCase()}-${safeName}.pdf`, status: 'Pending' };
      persist(withAudit({ ...state, documents: [document, ...state.documents] }, 'Generated employee document', 'Documents', employee.name, `${template.name} generated from template.`));
      return id;
    },
    updateEmployeeDocumentStatus: (id, status) => {
      const document = state.documents.find((item) => item.id === id);
      if (!document) return;
      persist(withAudit({ ...state, documents: state.documents.map((item) => item.id === id ? { ...item, status } : item) }, 'Updated document status', 'Documents', document.employeeName, `${document.documentType} moved to ${status}.`));
    },
    updateDocumentRequestStatus: (id, status) => {
      const request = state.documentRequests.find((item) => item.id === id);
      if (!request) return;
      persist(withAudit({ ...state, documentRequests: state.documentRequests.map((item) => item.id === id ? { ...item, status } : item) }, 'Updated document request', 'Documents', request.employeeName, `${request.documentType} request moved to ${status}.`));
    },
    generateSalarySlip: (employeeId, month) => {
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!employee) return '';
      const existing = state.salarySlips.find((slip) => slip.employeeId === employeeId && slip.month === month);
      if (existing) return existing.id;
      const id = `HS-${Date.now()}`;
      const slip: SalarySlip = { id, slipNumber: `PAY-${month}-${String(state.salarySlips.length + 1).padStart(3, '0')}`, employeeId, employeeName: employee.name, month, ...employee.salary, netSalary: calculateNetSalary(employee), paymentStatus: 'Processed', generatedDate: HR_DEMO_TODAY };
      persist(withAudit({ ...state, salarySlips: [slip, ...state.salarySlips] }, 'Generated salary slip', 'Payroll', employee.name, `${slip.slipNumber} generated.`));
      return id;
    },
    createSalaryComponent: (draft) => {
      const employee = state.employees.find((item) => item.id === draft.employeeId);
      if (!employee) return '';
      const id = `HSC-${Date.now()}`;
      const component: SalaryComponent = { ...draft, id, employeeName: employee.name };
      persist(withAudit({ ...state, salaryComponents: [component, ...state.salaryComponents] }, 'Created salary component', 'Payroll', employee.name, `${draft.name} added to salary structure.`));
      return id;
    },
    processPayroll: (month) => {
      const existingKeys = new Set(state.salarySlips.map((slip) => `${slip.employeeId}-${slip.month}`));
      const generated = state.employees
        .filter((employee) => !existingKeys.has(`${employee.id}-${month}`))
        .map((employee, index): SalarySlip => ({
          id: `HS-${Date.now()}-${index}`,
          slipNumber: `PAY-${month}-${String(state.salarySlips.length + index + 1).padStart(3, '0')}`,
          employeeId: employee.id,
          employeeName: employee.name,
          month,
          ...employee.salary,
          netSalary: calculateNetSalary(employee),
          paymentStatus: 'Processed',
          generatedDate: HR_DEMO_TODAY,
        }));
      const slips = [...generated, ...state.salarySlips];
      const monthSlips = slips.filter((slip) => slip.month === month);
      const grossAmount = monthSlips.reduce((sum, slip) => sum + slip.basic + slip.allowances, 0);
      const deductionAmount = monthSlips.reduce((sum, slip) => sum + slip.deductions + slip.pf + slip.esi, 0);
      persist(withAudit({
        ...state,
        salarySlips: slips,
        payrollRuns: state.payrollRuns.some((run) => run.month === month)
          ? state.payrollRuns.map((run) => run.month === month ? { ...run, status: 'Reviewed', employeeCount: monthSlips.length, grossAmount, deductionAmount, netAmount: monthSlips.reduce((sum, slip) => sum + slip.netSalary, 0) } : run)
          : [{ id: `HPR-${Date.now()}`, month, status: 'Reviewed', employeeCount: monthSlips.length, grossAmount, deductionAmount, netAmount: monthSlips.reduce((sum, slip) => sum + slip.netSalary, 0), preparedBy: 'Demo User', locked: false }, ...state.payrollRuns],
      }, 'Processed payroll', 'Payroll', month, `${generated.length} salary slips generated.`));
    },
    updatePayrollRunStatus: (id, status) => {
      const run = state.payrollRuns.find((item) => item.id === id);
      if (!run) return;
      persist(withAudit({
        ...state,
        payrollRuns: state.payrollRuns.map((item) => item.id === id ? { ...item, status, approvedBy: status === 'Approved' ? 'Demo User' : item.approvedBy, releasedAt: status === 'Released' ? new Date().toISOString() : item.releasedAt, locked: status === 'Locked' || item.locked } : item),
      }, 'Updated payroll run', 'Payroll', run.month, `Run moved to ${status}.`));
    },
    releaseSalarySlip: (slipId, mode) => {
      const slip = state.salarySlips.find((item) => item.id === slipId);
      if (!slip) return;
      const release: SalaryRelease = { id: `HSREL-${Date.now()}`, slipId, employeeId: slip.employeeId, employeeName: slip.employeeName, month: slip.month, amount: slip.netSalary, mode, status: 'Released', reference: `UTR${Date.now()}`, releaseDate: HR_DEMO_TODAY };
      persist(withAudit({
        ...state,
        salarySlips: state.salarySlips.map((item) => item.id === slipId ? { ...item, paymentStatus: 'Paid' } : item),
        salaryReleases: state.salaryReleases.some((item) => item.slipId === slipId) ? state.salaryReleases.map((item) => item.slipId === slipId ? { ...item, ...release, id: item.id } : item) : [release, ...state.salaryReleases],
      }, 'Released salary', 'Payroll', slip.employeeName, `${slip.month} paid via ${mode}.`));
    },
    updateAdvanceStatus: (id, status) => {
      const advance = state.advances.find((item) => item.id === id);
      if (!advance) return;
      persist(withAudit({ ...state, advances: state.advances.map((item) => item.id === id ? { ...item, status } : item) }, 'Updated advance salary', 'Payroll', advance.employeeName, `Advance moved to ${status}.`));
    },
    updatePayrollAdjustmentStatus: (id, status) => {
      const adjustment = state.payrollAdjustments.find((item) => item.id === id);
      if (!adjustment) return;
      persist(withAudit({ ...state, payrollAdjustments: state.payrollAdjustments.map((item) => item.id === id ? { ...item, status } : item) }, 'Updated payroll adjustment', 'Payroll', adjustment.employeeName, `${adjustment.type} moved to ${status}.`));
    },
    updateOnboardingTaskStatus: (id, status) => {
      const task = state.onboardingTasks.find((item) => item.id === id);
      persist(withAudit({ ...state, onboardingTasks: state.onboardingTasks.map((item) => item.id === id ? { ...item, status } : item) }, 'Updated onboarding task', 'Employees', task?.employeeName || id, `${task?.title || 'Task'} moved to ${status}.`));
    },
    confirmProbation: (employeeId) => {
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!employee) return;
      const event: EmployeeLifecycleEvent = { id: `HLE-${Date.now()}`, employeeId, employeeName: employee.name, type: 'Probation', date: HR_DEMO_TODAY, title: 'Probation confirmed', details: `${employee.name} moved from probation to active employment.`, actor: 'Demo User' };
      const nextRevisions: SalaryRevision[] = state.salaryRevisions.map((revision) => revision.employeeId === employeeId && revision.status === 'Draft' ? { ...revision, status: 'Approved' } : revision);
      persist(withAudit({ ...state, employees: state.employees.map((item) => item.id === employeeId ? { ...item, status: 'Active', probationEndDate: item.probationEndDate || HR_DEMO_TODAY } : item), salaryRevisions: nextRevisions, lifecycleEvents: [event, ...state.lifecycleEvents] }, 'Confirmed probation', 'Employees', employee.name, 'Employment status moved to Active.'));
    },
    startOffboarding: (employeeId, lastWorkingDay) => {
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!employee) return;
      const existing = state.offboardingItems.some((item) => item.employeeId === employeeId);
      const checklist: OffboardingItem[] = existing ? [] : [
        { id: `HOFF-${Date.now()}-handover`, employeeId, employeeName: employee.name, title: 'Complete role handover and open work review', owner: employee.manager, dueDate: lastWorkingDay, status: 'Pending' },
        { id: `HOFF-${Date.now()}-assets`, employeeId, employeeName: employee.name, title: 'Collect assets, ID card, and revoke access', owner: 'IT Admin', dueDate: lastWorkingDay, status: 'Pending' },
        { id: `HOFF-${Date.now()}-finance`, employeeId, employeeName: employee.name, title: 'Clear advances and payroll deductions', owner: 'Finance', dueDate: lastWorkingDay, status: 'Pending' },
        { id: `HOFF-${Date.now()}-settlement`, employeeId, employeeName: employee.name, title: 'Prepare final settlement and relieving letter', owner: 'HR Admin', dueDate: lastWorkingDay, status: 'Pending' },
      ];
      const event: EmployeeLifecycleEvent = { id: `HLE-${Date.now()}`, employeeId, employeeName: employee.name, type: 'Exit', date: HR_DEMO_TODAY, title: 'Offboarding initiated', details: `Last working day planned for ${lastWorkingDay}.`, actor: 'Demo User' };
      persist(withAudit({ ...state, employees: state.employees.map((item) => item.id === employeeId ? { ...item, status: 'Notice Period' } : item), offboardingItems: [...checklist, ...state.offboardingItems], lifecycleEvents: [event, ...state.lifecycleEvents] }, 'Started offboarding', 'Employees', employee.name, `Last working day ${lastWorkingDay}.`));
    },
    updateOffboardingItemStatus: (id, status) => {
      const item = state.offboardingItems.find((entry) => entry.id === id);
      persist(withAudit({ ...state, offboardingItems: state.offboardingItems.map((entry) => entry.id === id ? { ...entry, status } : entry) }, 'Updated offboarding task', 'Employees', item?.employeeName || id, `${item?.title || 'Task'} moved to ${status}.`));
    },
    recordSalaryRevision: (employeeId, revisedNet, reason) => {
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!employee) return '';
      const id = `HSR-${Date.now()}`;
      const revision: SalaryRevision = { id, employeeId, employeeName: employee.name, effectiveDate: HR_DEMO_TODAY, previousNet: calculateNetSalary(employee), revisedNet, reason, status: 'Draft' };
      const event: EmployeeLifecycleEvent = { id: `HLE-${Date.now()}`, employeeId, employeeName: employee.name, type: 'Salary Revision', date: HR_DEMO_TODAY, title: 'Salary revision drafted', details: reason, actor: 'Demo User' };
      persist(withAudit({ ...state, salaryRevisions: [revision, ...state.salaryRevisions], lifecycleEvents: [event, ...state.lifecycleEvents] }, 'Drafted salary revision', 'Payroll', employee.name, `${reason}: ${revisedNet}.`));
      return id;
    },
    updatePerformanceGoalStatus: (id, status) => {
      const goal = state.performanceGoals.find((item) => item.id === id);
      if (!goal) return;
      persist(withAudit({ ...state, performanceGoals: state.performanceGoals.map((item) => item.id === id ? { ...item, status, current: status === 'Completed' ? item.target : item.current } : item) }, 'Updated performance goal', 'Performance', goal.employeeName, `${goal.title} moved to ${status}.`));
    },
    updatePerformanceReviewStatus: (id, status) => {
      const review = state.performanceReviews.find((item) => item.id === id);
      if (!review) return;
      persist(withAudit({ ...state, performanceReviews: state.performanceReviews.map((item) => item.id === id ? { ...item, status, finalRating: status === 'Finalized' ? item.finalRating || item.managerRating || item.selfRating : item.finalRating } : item) }, 'Updated performance review', 'Performance', review.employeeName, `${review.cycleName} moved to ${status}.`));
    },
    createPerformanceFeedback: (draft) => {
      const employee = state.employees.find((item) => item.id === draft.employeeId);
      if (!employee) return '';
      const id = `HPF-${Date.now()}`;
      const feedback: PerformanceFeedback = { ...draft, id, employeeName: employee.name, date: HR_DEMO_TODAY };
      persist(withAudit({ ...state, performanceFeedback: [feedback, ...state.performanceFeedback] }, 'Added performance feedback', 'Performance', employee.name, `${draft.type}: ${draft.note}`));
      return id;
    },
    assignAsset: (assetId, employeeId) => {
      const asset = state.assets.find((item) => item.id === assetId);
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!asset || !employee) return;
      const activity: AssetActivity = { id: `HAA-${Date.now()}`, assetId, assetTag: asset.assetTag, employeeName: employee.name, date: HR_DEMO_TODAY, action: 'Assigned', owner: 'Demo User', notes: `${asset.name} assigned to ${employee.name}.` };
      persist(withAudit({
        ...state,
        assets: state.assets.map((item) => item.id === assetId ? { ...item, assignedToId: employee.id, assignedToName: employee.name, assignedDate: HR_DEMO_TODAY, expectedReturnDate: employee.status === 'Notice Period' ? '2026-07-12' : item.expectedReturnDate || '2027-06-18', location: employee.branchName || item.location, status: 'Assigned', returnStatus: employee.status === 'Notice Period' ? 'Return Due' : 'Not Due' } : item),
        assetActivities: [activity, ...state.assetActivities],
      }, 'Assigned asset', 'Assets', asset.assetTag, `${asset.name} assigned to ${employee.name}.`));
    },
    markAssetReturned: (assetId, condition) => {
      const asset = state.assets.find((item) => item.id === assetId);
      if (!asset) return;
      const previousOwner = asset.assignedToName || 'Unassigned';
      const nextStatus: AssetStatus = condition === 'Needs Repair' || condition === 'Damaged' ? 'In Repair' : 'Available';
      const activity: AssetActivity = { id: `HAA-${Date.now()}`, assetId, assetTag: asset.assetTag, employeeName: previousOwner, date: HR_DEMO_TODAY, action: 'Returned', owner: 'Demo User', notes: `${asset.name} returned in ${condition.toLowerCase()} condition.` };
      persist(withAudit({
        ...state,
        assets: state.assets.map((item) => item.id === assetId ? { ...item, assignedToId: undefined, assignedToName: undefined, assignedDate: undefined, expectedReturnDate: undefined, condition, status: nextStatus, returnStatus: 'Returned', location: item.location || 'IT Store' } : item),
        assetActivities: [activity, ...state.assetActivities],
      }, 'Returned asset', 'Assets', asset.assetTag, `${asset.name} returned by ${previousOwner}.`));
    },
    updateAssetStatus: (assetId, status) => {
      const asset = state.assets.find((item) => item.id === assetId);
      if (!asset) return;
      const activity: AssetActivity = { id: `HAA-${Date.now()}`, assetId, assetTag: asset.assetTag, employeeName: asset.assignedToName || 'IT Store', date: HR_DEMO_TODAY, action: `Status changed to ${status}`, owner: 'Demo User', notes: `${asset.name} status updated.` };
      persist(withAudit({
        ...state,
        assets: state.assets.map((item) => item.id === assetId ? { ...item, status, condition: status === 'In Repair' ? 'Needs Repair' : item.condition, returnStatus: status === 'Assigned' ? item.returnStatus : item.returnStatus } : item),
        assetActivities: [activity, ...state.assetActivities],
      }, 'Updated asset status', 'Assets', asset.assetTag, `${asset.name} moved to ${status}.`));
    },
    createJobRequisition: (draft) => {
      const id = `HJR-${Date.now()}`;
      const branch = state.branches.find((item) => item.id === draft.branchId);
      const job: JobRequisition = { ...draft, id, requisitionNumber: `REQ-2026-${String(state.recruitmentJobs.length + 1).padStart(3, '0')}`, branchName: branch?.name || 'Branch', filled: 0 };
      persist(withAudit({ ...state, recruitmentJobs: [job, ...state.recruitmentJobs] }, 'Created job requisition', 'Recruitment', job.title, `${job.headcount} opening(s) for ${job.department}.`));
      return id;
    },
    createCandidate: (draft) => {
      const id = `HC-${Date.now()}`;
      const job = state.recruitmentJobs.find((item) => item.id === draft.jobId);
      const candidate: Candidate = { ...draft, id, candidateNumber: `CAN-${String(state.candidates.length + 1).padStart(3, '0')}`, jobTitle: job?.title || 'Open role', stage: 'Applied', rating: 3, backgroundCheckStatus: 'Pending' };
      persist(withAudit({ ...state, candidates: [candidate, ...state.candidates] }, 'Added candidate', 'Recruitment', candidate.name, `${candidate.candidateNumber} applied for ${candidate.jobTitle}.`));
      return id;
    },
    updateCandidateStage: (id, stage) => {
      const candidate = state.candidates.find((item) => item.id === id);
      if (!candidate) return;
      const poolExists = state.talentPool.some((item) => item.candidateId === id);
      const talentPool = stage === 'Talent Pool' && !poolExists ? [{ id: `HTP-${Date.now()}`, candidateId: id, candidateName: candidate.name, skillArea: candidate.tags[0] || candidate.jobTitle, availableFrom: candidate.noticePeriod, owner: candidate.owner, status: 'Warm' as const, notes: candidate.notes }, ...state.talentPool] : state.talentPool;
      persist(withAudit({ ...state, candidates: state.candidates.map((item) => item.id === id ? { ...item, stage } : item), talentPool }, 'Moved candidate stage', 'Recruitment', candidate.name, `Stage changed to ${stage}.`));
    },
    scheduleInterview: (draft) => {
      const id = `HIR-${Date.now()}`;
      const candidate = state.candidates.find((item) => item.id === draft.candidateId);
      const job = state.recruitmentJobs.find((item) => item.id === draft.jobId);
      const interview: InterviewRound = { ...draft, id, candidateName: candidate?.name || 'Candidate', jobTitle: job?.title || candidate?.jobTitle || 'Open role', status: 'Scheduled', feedback: '' };
      persist(withAudit({ ...state, interviews: [interview, ...state.interviews], candidates: state.candidates.map((item) => item.id === draft.candidateId ? { ...item, stage: 'Interview' } : item) }, 'Scheduled interview', 'Recruitment', interview.candidateName, `${interview.round} on ${interview.scheduledAt}.`));
      return id;
    },
    updateInterviewStatus: (id, status, score, feedback) => {
      const interview = state.interviews.find((item) => item.id === id);
      persist(withAudit({ ...state, interviews: state.interviews.map((item) => item.id === id ? { ...item, status, score: score ?? item.score, feedback: feedback ?? item.feedback } : item) }, 'Updated interview', 'Recruitment', interview?.candidateName || id, `Interview moved to ${status}.`));
    },
    createOffer: (draft) => {
      const candidate = state.candidates.find((item) => item.id === draft.candidateId);
      if (!candidate) return '';
      const id = `HOF-${Date.now()}`;
      const offer: Offer = { ...draft, id, candidateName: candidate.name, jobId: candidate.jobId, jobTitle: candidate.jobTitle, status: 'Pending Approval' };
      persist(withAudit({ ...state, offers: [offer, ...state.offers], candidates: state.candidates.map((item) => item.id === candidate.id ? { ...item, stage: 'Offer' } : item) }, 'Created offer', 'Recruitment', candidate.name, `${offer.jobTitle} offer awaiting approval.`));
      return id;
    },
    updateOfferStatus: (id, status) => {
      const offer = state.offers.find((item) => item.id === id);
      if (!offer) return;
      const nextStage: CandidateStage | null = status === 'Accepted' ? 'Accepted' : status === 'Rejected' || status === 'Withdrawn' ? 'Rejected' : status === 'Sent' ? 'Offer' : null;
      persist(withAudit({
        ...state,
        offers: state.offers.map((item) => item.id === id ? { ...item, status, sentDate: status === 'Sent' ? HR_DEMO_TODAY : item.sentDate, acceptedDate: status === 'Accepted' ? HR_DEMO_TODAY : item.acceptedDate } : item),
        candidates: nextStage ? state.candidates.map((candidate) => candidate.id === offer.candidateId ? { ...candidate, stage: nextStage } : candidate) : state.candidates,
      }, 'Updated offer', 'Recruitment', offer.candidateName, `Offer status changed to ${status}.`));
    },
    updateBackgroundCheckStatus: (id, status) => {
      const check = state.backgroundChecks.find((item) => item.id === id);
      persist(withAudit({
        ...state,
        backgroundChecks: state.backgroundChecks.map((item) => item.id === id ? { ...item, status } : item),
        candidates: check ? state.candidates.map((candidate) => candidate.id === check.candidateId ? { ...candidate, backgroundCheckStatus: status } : candidate) : state.candidates,
      }, 'Updated background check', 'Recruitment', check?.candidateName || id, `Verification moved to ${status}.`));
    },
    handoffCandidateToOnboarding: (candidateId) => {
      const candidate = state.candidates.find((item) => item.id === candidateId);
      if (!candidate) return '';
      const existingEmployee = state.employees.find((employee) => employee.email === candidate.email);
      if (existingEmployee) return existingEmployee.id;
      const job = state.recruitmentJobs.find((item) => item.id === candidate.jobId);
      const offer = state.offers.find((item) => item.candidateId === candidateId && item.status === 'Accepted');
      const shift = state.shiftGroups.find((item) => item.branchId === job?.branchId) || state.shiftGroups[0];
      const joiningDate = offer?.joiningDate || HR_DEMO_TODAY;
      const employeeId = `HE-${Date.now()}`;
      const employee: Employee = {
        id: employeeId,
        employeeNumber: `EMP-${String(state.employees.length + 1).padStart(3, '0')}`,
        name: candidate.name,
        dateOfBirth: '1998-01-01',
        gender: 'Prefer not to say',
        phone: candidate.phone,
        email: candidate.email,
        address: candidate.location,
        department: job?.department || 'Operations',
        designation: job?.title || candidate.jobTitle,
        manager: job?.hiringManager || candidate.owner,
        joiningDate,
        employmentType: job?.employmentType || 'Full Time',
        status: 'Probation',
        branchId: job?.branchId,
        branchName: job?.branchName,
        shiftGroupId: shift?.id,
        shiftGroupName: shift?.name,
        probationEndDate: addDays(joiningDate, 90),
        salary: salaryFromOffer(offer?.offeredSalary || candidate.expectedSalary),
        bankName: '',
        bankAccountLast4: '',
        emergencyContacts: [],
        governmentIds: [],
        skills: candidate.tags.map((tag) => ({ name: tag, level: 'Intermediate' })),
        education: [],
        experience: [],
        employmentHistory: [{ date: joiningDate, event: 'Joined', role: job?.title || candidate.jobTitle, department: job?.department || 'Operations', manager: job?.hiringManager || candidate.owner }],
        notes: `Converted from recruitment candidate ${candidate.candidateNumber}. ${candidate.notes}`,
      };
      const onboardingTasks: OnboardingTask[] = [
        { id: `HOT-${Date.now()}-candidate-hr`, employeeId, employeeName: employee.name, title: 'Collect joining documents and create employee file', owner: 'HR Admin', dueDate: joiningDate, category: 'HR', status: 'Pending' },
        { id: `HOT-${Date.now()}-candidate-it`, employeeId, employeeName: employee.name, title: 'Provision workspace, system access, and assets', owner: 'IT', dueDate: joiningDate, category: 'IT', status: 'Pending' },
        { id: `HOT-${Date.now()}-candidate-manager`, employeeId, employeeName: employee.name, title: 'Confirm first-week induction and role plan', owner: employee.manager, dueDate: addDays(joiningDate, 3), category: 'Manager', status: 'Pending' },
        { id: `HOT-${Date.now()}-candidate-payroll`, employeeId, employeeName: employee.name, title: 'Activate payroll and attendance profile', owner: 'Payroll', dueDate: joiningDate, category: 'Payroll', status: 'Pending' },
      ];
      const event: EmployeeLifecycleEvent = { id: `HLE-${Date.now()}`, employeeId, employeeName: employee.name, type: 'Onboarding', date: HR_DEMO_TODAY, title: 'Recruitment handoff completed', details: `${candidate.name} converted from ${candidate.candidateNumber} to employee onboarding.`, actor: 'Demo User' };
      persist(withAudit({
        ...state,
        employees: [employee, ...state.employees],
        candidates: state.candidates.map((item) => item.id === candidateId ? { ...item, stage: 'Accepted' } : item),
        recruitmentJobs: state.recruitmentJobs.map((item) => item.id === candidate.jobId ? { ...item, filled: Math.min(item.headcount, item.filled + 1) } : item),
        onboardingTasks: [...onboardingTasks, ...state.onboardingTasks],
        lifecycleEvents: [event, ...state.lifecycleEvents],
      }, 'Converted candidate to onboarding', 'Recruitment', candidate.name, `${candidate.candidateNumber} is now ${employee.employeeNumber}.`));
      return employeeId;
    },
    updateCompanyProfile: (profile) => persist(withAudit({ ...state, companyProfile: profile }, 'Updated HR company profile', 'Settings', profile.legalName, 'Company HR setup changed.')),
    createBranch: (draft) => {
      const id = `HB-${Date.now()}`;
      const branch: Branch = { ...draft, id };
      persist(withAudit({ ...state, branches: [branch, ...state.branches] }, 'Created branch', 'Settings', branch.name, `${branch.city}, ${branch.state}`));
      return id;
    },
    createDesignation: (draft) => {
      const id = `HDES-${Date.now()}`;
      const designation: Designation = { ...draft, id };
      persist(withAudit({ ...state, designations: [designation, ...state.designations] }, 'Created designation', 'Settings', designation.title, `${designation.department} designation added.`));
      return id;
    },
    createLeavePolicy: (draft) => {
      const id = `HLP-${Date.now()}`;
      const policy: LeavePolicy = { ...draft, id };
      persist(withAudit({ ...state, leavePolicies: [policy, ...state.leavePolicies] }, 'Created leave policy', 'Leave', policy.name, `${policy.code} policy added.`));
      return id;
    },
    createHoliday: (draft) => {
      const branch = state.branches.find((item) => item.id === draft.branchId);
      const id = `HH-${Date.now()}`;
      const holiday: Holiday = { ...draft, id, branchName: draft.branchId === 'all' ? 'All branches' : branch?.name || 'Branch' };
      persist(withAudit({ ...state, holidays: [holiday, ...state.holidays] }, 'Created holiday', 'Settings', holiday.name, `${holiday.date} for ${holiday.branchName}.`));
      return id;
    },
    createShiftGroup: (draft) => {
      const branch = state.branches.find((item) => item.id === draft.branchId);
      const id = `HSG-${Date.now()}`;
      const shift: ShiftGroup = { ...draft, id, branchName: branch?.name || 'Branch' };
      persist(withAudit({ ...state, shiftGroups: [shift, ...state.shiftGroups] }, 'Created shift group', 'Attendance', shift.name, `${shift.startTime}-${shift.endTime}.`));
      return id;
    },
    updatePayrollCalendar: (calendar) => persist(withAudit({ ...state, payrollCalendar: calendar }, 'Updated payroll calendar', 'Payroll', state.companyProfile.payrollCalendarName, `Salary day ${calendar.salaryDay}, cutoff ${calendar.payrollCutoffDay}.`)),
    toggleRolePermission: (id, key) => {
      const role = state.rolePermissions.find((item) => item.id === id);
      const nextRoles: RolePermission[] = state.rolePermissions.map((item) => item.id === id ? { ...item, [key]: !item[key] } : item);
      persist(withAudit({ ...state, rolePermissions: nextRoles }, 'Updated role permission', 'Permissions', role?.role || id, `${key} toggled.`));
    },
    resetHrData: () => persist(createHrInitialState()),
  }), [state]);

  return <HrDataContext.Provider value={value}>{children}</HrDataContext.Provider>;
};

export const useHrData = () => {
  const context = useContext(HrDataContext);
  if (!context) throw new Error('useHrData must be used within HrDataProvider');
  return context;
};
