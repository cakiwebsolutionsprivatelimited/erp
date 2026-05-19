import type { Employee } from '../types/employee.types';

// Mask PAN card/IFSC/Account codes for security compliance
export const maskSensitiveData = (value?: string, visibleChars = 4): string => {
  if (!value) return 'N/A';
  if (value.length <= visibleChars) return value;
  const maskedLength = value.length - visibleChars;
  return '•'.repeat(maskedLength) + value.slice(-visibleChars);
};

// AI employee duplicate check mock
export const checkForDuplicateEmployee = (
  list: Employee[], 
  email: string, 
  mobile: string,
  panNumber?: string
): { duplicate: boolean; matchedId?: string; reason?: string } => {
  const normEmail = email.toLowerCase().trim();
  const normMobile = mobile.replace(/[\s+-]/g, '');

  for (const emp of list) {
    if (emp.email.toLowerCase().trim() === normEmail) {
      return { duplicate: true, matchedId: emp.id, reason: 'Duplicate corporate/personal email registered' };
    }
    if (emp.mobile.replace(/[\s+-]/g, '') === normMobile) {
      return { duplicate: true, matchedId: emp.id, reason: 'Duplicate contact mobile number' };
    }
    if (panNumber && emp.panNumber && emp.panNumber.toUpperCase().trim() === panNumber.toUpperCase().trim()) {
      return { duplicate: true, matchedId: emp.id, reason: 'Duplicate national PAN security card ledger' };
    }
  }

  return { duplicate: false };
};

// Calculate profile directory health statistics
export const getEmployeeDirectoryStats = (list: Employee[]) => {
  const total = list.length;
  const active = list.filter(e => e.status === 'Active').length;
  const onLeave = list.filter(e => e.status === 'On Leave').length;
  const probation = list.filter(e => e.status === 'Probation').length;
  const averageCompleteness = total > 0 
    ? Math.round(list.reduce((acc, curr) => acc + curr.profileCompleteness, 0) / total) 
    : 0;

  return {
    total,
    active,
    onLeave,
    probation,
    averageCompleteness
  };
};
