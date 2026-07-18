import React, { useEffect, useMemo, useState } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import type { RolePermission } from '@/tenant/hr/types';

export type HrRoleName = RolePermission['role'];

const STORAGE_KEY = 'hr-active-role-v1';
const ROLE_CHANGE_EVENT = 'hr-active-role-change';
const DEFAULT_ROLE: HrRoleName = 'HR Admin';
const DEMO_MANAGER_NAME = 'Priya Mishra';
const DEMO_STAFF_EMPLOYEE_ID = 'HE-7';

const menuAliases: Record<string, string[]> = {
  Dashboard: ['Dashboard'],
  Employees: ['Employees'],
  Recruitment: ['Recruitment'],
  Onboarding: ['Onboarding'],
  Attendance: ['Attendance'],
  'Shifts & Roster': ['Shifts & Roster'],
  Leave: ['Leave'],
  Payroll: ['Payroll'],
  Performance: ['Performance'],
  'Self Service': ['Self Service'],
  Departments: ['Departments'],
  Documents: ['Documents'],
  Assets: ['Assets'],
  Reports: ['Reports'],
  'HR Settings': ['Settings'],
  Settings: ['Settings'],
};

export const getHrMenuForPath = (path: string) => {
  if (path.includes('/hr/recruitment')) return 'Recruitment';
  if (path.includes('/hr/onboarding')) return 'Onboarding';
  if (path.includes('/hr/attendance')) return 'Attendance';
  if (path.includes('/hr/shifts')) return 'Shifts & Roster';
  if (path.includes('/hr/leave')) return 'Leave';
  if (path.includes('/hr/payroll')) return 'Payroll';
  if (path.includes('/hr/performance')) return 'Performance';
  if (path.includes('/hr/self-service')) return 'Self Service';
  if (path.includes('/hr/departments')) return 'Departments';
  if (path.includes('/hr/documents')) return 'Documents';
  if (path.includes('/hr/assets')) return 'Assets';
  if (path.includes('/hr/reports')) return 'Reports';
  if (path.includes('/hr/settings')) return 'HR Settings';
  if (path.includes('/hr/employees')) return 'Employees';
  return 'Dashboard';
};

const readStoredRole = (): HrRoleName => {
  try {
    return (localStorage.getItem(STORAGE_KEY) as HrRoleName | null) || DEFAULT_ROLE;
  } catch {
    return DEFAULT_ROLE;
  }
};

export const useHrAccess = () => {
  const hr = useHrData();
  const [activeRole, setActiveRoleState] = useState<HrRoleName>(readStoredRole);
  const roleOptions = hr.rolePermissions.map((role) => role.role);
  const permission = useMemo(
    () => hr.rolePermissions.find((role) => role.role === activeRole) || hr.rolePermissions.find((role) => role.role === DEFAULT_ROLE) || hr.rolePermissions[0],
    [activeRole, hr.rolePermissions],
  );
  const scopedEmployeeIds = useMemo(() => {
    if (permission?.role === 'Manager') {
      return new Set(hr.employees.filter((employee) => employee.name === DEMO_MANAGER_NAME || employee.manager === DEMO_MANAGER_NAME).map((employee) => employee.id));
    }
    if (permission?.role === 'Staff') return new Set(hr.employees.filter((employee) => employee.id === DEMO_STAFF_EMPLOYEE_ID).map((employee) => employee.id));
    return new Set(hr.employees.map((employee) => employee.id));
  }, [hr.employees, permission?.role]);

  useEffect(() => {
    const handleRoleChange = (event: Event) => {
      const nextRole = (event as CustomEvent<HrRoleName>).detail || readStoredRole();
      setActiveRoleState(nextRole);
    };
    window.addEventListener(ROLE_CHANGE_EVENT, handleRoleChange);
    window.addEventListener('storage', handleRoleChange);
    return () => {
      window.removeEventListener(ROLE_CHANGE_EVENT, handleRoleChange);
      window.removeEventListener('storage', handleRoleChange);
    };
  }, []);

  const setActiveRole = (role: HrRoleName) => {
    setActiveRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEY, role);
    } catch {
      // Ignore storage failures; the role switcher still works in memory.
    }
    window.dispatchEvent(new CustomEvent(ROLE_CHANGE_EVENT, { detail: role }));
  };

  const canAccessMenu = (menu: string) => {
    if (!permission) return false;
    if (permission.role === 'Business Owner') return true;
    const candidates = menuAliases[menu] || [menu];
    return candidates.some((candidate) => permission.menuAccess.includes(candidate));
  };

  const canAccessPath = (path: string) => canAccessMenu(getHrMenuForPath(path));

  return {
    activeRole: permission?.role || activeRole,
    canApproveLeave: Boolean(permission?.canApproveLeave),
    canEditAttendance: Boolean(permission?.canEditAttendance),
    canExport: Boolean(permission?.canExport),
    canRunPayroll: Boolean(permission?.canRunPayroll),
    canViewSalary: Boolean(permission?.canViewSalary),
    canAccessMenu,
    canAccessPath,
    permission,
    roleOptions,
    scopedEmployeeIds,
    isEmployeeInScope: (employeeId: string) => scopedEmployeeIds.has(employeeId),
    setActiveRole,
  };
};

export const HrRestrictedState: React.FC<{ menu?: string }> = ({ menu = 'this area' }) => {
  const navigate = useNavigate();
  const access = useHrAccess();
  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white text-amber-700">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Access restricted</h2>
            <p className="mt-1 text-sm text-amber-800">{access.activeRole} does not have access to {menu}.</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/hr/self-service')}>
          <ShieldCheck className="h-4 w-4" />
          Open self service
        </Button>
      </div>
    </section>
  );
};
