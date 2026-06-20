import React, { createContext, useContext, useMemo, useState } from 'react';
import { HR_DEMO_TODAY, calculateLeaveDays, calculateNetSalary, calculateWorkHours, createHrInitialState } from '@/tenant/hr/hrDemoService';
import type { AttendanceDraft, AttendanceEntry, Employee, EmployeeDraft, HrStateShape, LeaveDraft, LeaveRequest, LeaveStatus, SalarySlip } from '@/tenant/hr/types';

interface HrDataState extends HrStateShape {
  addEmployee: (draft: EmployeeDraft) => string;
  markAttendance: (draft: AttendanceDraft) => void;
  applyLeave: (draft: LeaveDraft) => string;
  updateLeaveStatus: (id: string, status: LeaveStatus) => void;
  generateSalarySlip: (employeeId: string, month: string) => string;
  processPayroll: (month: string) => void;
  resetHrData: () => void;
}

const STORAGE_KEY = 'hr-demo-state-v1';
const initialState = createHrInitialState();
const readInitialState = (): HrStateShape => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialState, ...JSON.parse(stored) } : initialState;
  } catch {
    return initialState;
  }
};

const HrDataContext = createContext<HrDataState | null>(null);

export const HrDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HrStateShape>(readInitialState);
  const persist = (next: HrStateShape) => { setState(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const value = useMemo<HrDataState>(() => ({
    ...state,
    addEmployee: (draft) => {
      const id = `HE-${Date.now()}`;
      const employee: Employee = { ...draft, id, employeeNumber: `EMP-${String(state.employees.length + 1).padStart(3, '0')}` };
      persist({ ...state, employees: [employee, ...state.employees] });
      return id;
    },
    markAttendance: (draft) => {
      const employee = state.employees.find((item) => item.id === draft.employeeId);
      if (!employee) return;
      const entry: AttendanceEntry = { ...draft, id: `HA-${draft.employeeId}-${draft.date}`, employeeName: employee.name, workHours: calculateWorkHours(draft.checkIn, draft.checkOut) };
      const existing = state.attendance.some((item) => item.employeeId === draft.employeeId && item.date === draft.date);
      persist({ ...state, attendance: existing ? state.attendance.map((item) => item.employeeId === draft.employeeId && item.date === draft.date ? entry : item) : [entry, ...state.attendance] });
    },
    applyLeave: (draft) => {
      const employee = state.employees.find((item) => item.id === draft.employeeId);
      const id = `HL-${Date.now()}`;
      const request: LeaveRequest = { ...draft, id, employeeName: employee?.name || 'Employee', days: calculateLeaveDays(draft.fromDate, draft.toDate), status: 'Pending', appliedDate: HR_DEMO_TODAY };
      persist({ ...state, leaveRequests: [request, ...state.leaveRequests] });
      return id;
    },
    updateLeaveStatus: (id, status) => persist({ ...state, leaveRequests: state.leaveRequests.map((request) => request.id === id ? { ...request, status } : request) }),
    generateSalarySlip: (employeeId, month) => {
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!employee) return '';
      const existing = state.salarySlips.find((slip) => slip.employeeId === employeeId && slip.month === month);
      if (existing) return existing.id;
      const id = `HS-${Date.now()}`;
      const slip: SalarySlip = { id, slipNumber: `PAY-${month}-${String(state.salarySlips.length + 1).padStart(3, '0')}`, employeeId, employeeName: employee.name, month, ...employee.salary, netSalary: calculateNetSalary(employee), paymentStatus: 'Processed', generatedDate: HR_DEMO_TODAY };
      persist({ ...state, salarySlips: [slip, ...state.salarySlips] });
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
      persist({ ...state, salarySlips: [...generated, ...state.salarySlips] });
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
