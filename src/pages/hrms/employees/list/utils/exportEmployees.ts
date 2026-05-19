import type { Employee } from '../types/employee.types';
import { notify } from '@/services/notificationService';

export const exportEmployeesToExcel = (
  employees: Employee[], 
  selectedIds: string[], 
  columnsToShow: string[]
) => {
  try {
    // 1. Filter dataset depending on selection
    const targetData = selectedIds.length > 0
      ? employees.filter(emp => selectedIds.includes(emp.id))
      : employees;

    if (targetData.length === 0) {
      notify.warning('Export Alert', 'No active employee data to download.');
      return;
    }

    // 2. Define standard headers mapping
    const headerMap: Record<string, string> = {
      id: 'Employee ID',
      fullName: 'Full Name',
      email: 'Corporate Email',
      mobile: 'Mobile Number',
      department: 'Department',
      designation: 'Designation',
      joiningDate: 'Joining Date',
      employmentType: 'Employment Type',
      workMode: 'Work Mode',
      workLocation: 'Work Location',
      status: 'Status',
      profileCompleteness: 'Profile Completeness (%)',
      grossSalary: 'Gross Salary ($/yr)',
      uanNumber: 'UAN Number',
      panNumber: 'PAN Number',
      reportingManager: 'Reporting Manager'
    };

    // Filter headers based on columnsToShow if provided
    const keys = Object.keys(headerMap).filter(k => {
      // Always export ID and fullName for integrity
      if (k === 'id' || k === 'fullName') return true;
      return columnsToShow.includes(k);
    });

    const headers = keys.map(k => headerMap[k]);

    // 3. Build CSV Content
    let csvContent = '\uFEFF'; // Excel BOM for proper UTF-8 decoding
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\r\n';

    targetData.forEach(emp => {
      const row = keys.map(key => {
        const val = emp[key as keyof Employee];
        if (val === undefined || val === null) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvContent += row.join(',') + '\r\n';
    });

    // 4. Trigger browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_ledger_export_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify.success('Export Successful', `Downloaded records for ${targetData.length} personnel folders in Excel sheet format.`);
  } catch (error) {
    console.error('Export failed', error);
    notify.error('Export Failed', 'An unexpected error occurred during CSV packaging.');
  }
};
