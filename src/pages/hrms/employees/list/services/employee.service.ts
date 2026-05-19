import type { Employee } from '../types/employee.types';
import { notify } from '@/services/notificationService';

const STORAGE_KEY = 'erp_hrms_employee_directory';

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    firstName: 'Richard',
    lastName: 'Hendricks',
    fullName: 'Richard Hendricks',
    email: 'richard.hendricks@piedpiper.com',
    mobile: '+1 555 0192',
    department: 'Engineering',
    designation: 'Principal Engineer',
    joiningDate: '2023-01-15',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    workLocation: 'San Francisco HQ',
    shiftTiming: '09:00 AM - 06:00 PM',
    reportingManager: 'Dinesh Chugtai',
    status: 'Active',
    profileCompleteness: 95,
    uanNumber: '100983274591',
    esiNumber: '31002348576000102',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '9876-5432-1098',
    basicSalary: 12000,
    hra: 4800,
    grossSalary: 18000,
    netSalary: 16500,
    bankName: 'Silicon Valley Bank',
    accountNumber: '••••••••8392',
    emergencyContactName: 'Monica Hall',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+1 555 0134',
    attendanceStatus: 'Present',
    payrollSyncStatus: 'Synchronized',
    backgroundVerificationStatus: 'Approved',
    documentVerificationStatus: 'Verified',
    timelineActivity: [
      { id: '1', timestamp: '09:05 AM', message: 'Checked in via Gate RFID Reader A.', type: 'success' },
      { id: '2', timestamp: 'Yesterday', message: 'UAN document signed and finalized.', type: 'info' }
    ]
  },
  {
    id: 'EMP002',
    firstName: 'Erlich',
    lastName: 'Bachman',
    fullName: 'Erlich Bachman',
    email: 'erlich.bachman@incubator.com',
    mobile: '+1 555 0184',
    department: 'Operations',
    designation: 'General Manager',
    joiningDate: '2022-06-01',
    employmentType: 'Full-time',
    workMode: 'Onsite',
    workLocation: 'Incubator Office',
    shiftTiming: '10:00 AM - 07:00 PM',
    reportingManager: 'Laurie Bream',
    status: 'Active',
    profileCompleteness: 85,
    uanNumber: '100948573921',
    esiNumber: '31004829576000105',
    panNumber: 'FGHIJ5678K',
    aadhaarNumber: '1234-5678-9012',
    basicSalary: 15000,
    hra: 6000,
    grossSalary: 23000,
    netSalary: 21000,
    bankName: 'Chase Bank',
    accountNumber: '••••••••4729',
    emergencyContactName: 'Jian-Yang',
    emergencyContactRelation: 'Friend',
    emergencyContactPhone: '+1 555 0112',
    attendanceStatus: 'Late',
    payrollSyncStatus: 'Synchronized',
    backgroundVerificationStatus: 'Approved',
    documentVerificationStatus: 'Verified',
    timelineActivity: [
      { id: '1', timestamp: '10:14 AM', message: 'Checked in late via Lobby entrance.', type: 'warning' },
      { id: '2', timestamp: '3 days ago', message: 'Assigned dynamic asset kit (Laptop & Desk set).', type: 'success' }
    ]
  },
  {
    id: 'EMP003',
    firstName: 'Dinesh',
    lastName: 'Chugtai',
    fullName: 'Dinesh Chugtai',
    email: 'dinesh.chugtai@piedpiper.com',
    mobile: '+1 555 0173',
    department: 'Engineering',
    designation: 'Senior Lead Dev',
    joiningDate: '2023-02-01',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    workLocation: 'San Francisco HQ',
    shiftTiming: '09:00 AM - 06:00 PM',
    reportingManager: 'Richard Hendricks',
    status: 'Active',
    profileCompleteness: 90,
    uanNumber: '100847293849',
    panNumber: 'LMNO1234P',
    aadhaarNumber: '4321-8765-0987',
    basicSalary: 10000,
    hra: 4000,
    grossSalary: 15000,
    netSalary: 13800,
    bankName: 'Wells Fargo',
    accountNumber: '••••••••1093',
    emergencyContactName: 'Gilfoyle',
    emergencyContactRelation: 'Sibling',
    emergencyContactPhone: '+1 555 0142',
    attendanceStatus: 'Present',
    payrollSyncStatus: 'Synchronized',
    backgroundVerificationStatus: 'Approved',
    documentVerificationStatus: 'Verified',
    timelineActivity: [
      { id: '1', timestamp: '08:50 AM', message: 'Checked in via Gate RFID Reader B.', type: 'success' }
    ]
  },
  {
    id: 'EMP004',
    firstName: 'Bertram',
    lastName: 'Gilfoyle',
    fullName: 'Bertram Gilfoyle',
    email: 'gilfoyle@piedpiper.com',
    mobile: '+1 555 0142',
    department: 'Engineering',
    designation: 'Security Lead',
    joiningDate: '2023-02-01',
    employmentType: 'Full-time',
    workMode: 'Remote',
    workLocation: 'Remote Canada',
    shiftTiming: '09:00 AM - 06:00 PM',
    reportingManager: 'Richard Hendricks',
    status: 'On Leave',
    profileCompleteness: 75,
    uanNumber: '100839284719',
    panNumber: 'QRST5678U',
    aadhaarNumber: '5678-1234-9081',
    basicSalary: 11000,
    hra: 4400,
    grossSalary: 16500,
    netSalary: 15100,
    bankName: 'Royal Bank of Canada',
    accountNumber: '••••••••2847',
    emergencyContactName: 'Tara',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+1 555 0149',
    attendanceStatus: 'On Leave',
    payrollSyncStatus: 'Synchronized',
    backgroundVerificationStatus: 'Approved',
    documentVerificationStatus: 'Verified',
    timelineActivity: [
      { id: '1', timestamp: 'Yesterday', message: 'Submitted sick leave application.', type: 'info' }
    ]
  },
  {
    id: 'EMP005',
    firstName: 'Jared',
    lastName: 'Dunn',
    fullName: 'Jared Dunn',
    email: 'jared.dunn@piedpiper.com',
    mobile: '+1 555 0122',
    department: 'Human Resources',
    designation: 'HR Chief Officer',
    joiningDate: '2023-03-01',
    employmentType: 'Full-time',
    workMode: 'Onsite',
    workLocation: 'San Francisco HQ',
    shiftTiming: '08:30 AM - 05:30 PM',
    reportingManager: 'Richard Hendricks',
    status: 'Active',
    profileCompleteness: 100,
    uanNumber: '100482937582',
    esiNumber: '31002348576000299',
    panNumber: 'VWXY1234Z',
    aadhaarNumber: '8901-2345-6789',
    basicSalary: 9000,
    hra: 3600,
    grossSalary: 13000,
    netSalary: 12100,
    bankName: 'Silicon Valley Bank',
    accountNumber: '••••••••1122',
    emergencyContactName: 'Richard Hendricks',
    emergencyContactRelation: 'Friend',
    emergencyContactPhone: '+1 555 0192',
    attendanceStatus: 'Present',
    payrollSyncStatus: 'Synchronized',
    backgroundVerificationStatus: 'Approved',
    documentVerificationStatus: 'Verified',
    timelineActivity: [
      { id: '1', timestamp: '08:15 AM', message: 'Checked in early via security hub.', type: 'success' },
      { id: '2', timestamp: '4 days ago', message: 'Completed global regulatory HR audit review.', type: 'success' }
    ]
  },
  {
    id: 'EMP006',
    firstName: 'Monica',
    lastName: 'Hall',
    fullName: 'Monica Hall',
    email: 'monica@raviga.com',
    mobile: '+1 555 0134',
    department: 'Finance',
    designation: 'Partner Associate',
    joiningDate: '2022-10-15',
    employmentType: 'Contract',
    workMode: 'Hybrid',
    workLocation: 'Raviga Building',
    shiftTiming: '09:00 AM - 06:00 PM',
    reportingManager: 'Laurie Bream',
    status: 'Active',
    profileCompleteness: 92,
    uanNumber: '100492837492',
    panNumber: 'AJKD8293M',
    aadhaarNumber: '2468-1357-9012',
    basicSalary: 18000,
    hra: 7200,
    grossSalary: 27000,
    netSalary: 24800,
    bankName: 'Bank of America',
    accountNumber: '••••••••9023',
    emergencyContactName: 'Laurie Bream',
    emergencyContactRelation: 'Other',
    emergencyContactPhone: '+1 555 0111',
    attendanceStatus: 'Present',
    payrollSyncStatus: 'Synchronized',
    backgroundVerificationStatus: 'Approved',
    documentVerificationStatus: 'Verified',
    timelineActivity: [
      { id: '1', timestamp: '08:58 AM', message: 'Checked in via main lobby entrance.', type: 'success' }
    ]
  },
  {
    id: 'EMP007',
    firstName: 'Nelson',
    lastName: 'Bighetti',
    fullName: 'Nelson Bighetti',
    email: 'bighead@hooli.com',
    mobile: '+1 555 0155',
    department: 'Operations',
    designation: 'Operations Consultant',
    joiningDate: '2024-01-01',
    employmentType: 'Intern',
    workMode: 'Hybrid',
    workLocation: 'Hooli Plaza',
    shiftTiming: '10:00 AM - 05:00 PM',
    reportingManager: 'Erlich Bachman',
    status: 'Probation',
    profileCompleteness: 60,
    uanNumber: '100492834710',
    panNumber: 'POIU9876Y',
    aadhaarNumber: '3691-2580-1470',
    basicSalary: 4000,
    hra: 1600,
    grossSalary: 6000,
    netSalary: 5600,
    bankName: 'Capital One',
    accountNumber: '••••••••8829',
    emergencyContactName: 'Mr. Bighetti',
    emergencyContactRelation: 'Parent',
    emergencyContactPhone: '+1 555 0156',
    attendanceStatus: 'Absent',
    payrollSyncStatus: 'Pending',
    backgroundVerificationStatus: 'In Progress',
    documentVerificationStatus: 'Pending Audit',
    timelineActivity: [
      { id: '1', timestamp: '11:00 AM', message: 'Flagged as absent for morning shift.', type: 'error' },
      { id: '2', timestamp: 'Last week', message: 'Background verification check triggered.', type: 'warning' }
    ]
  },
  {
    id: 'EMP008',
    firstName: 'Gavin',
    lastName: 'Belson',
    fullName: 'Gavin Belson',
    email: 'gavin.belson@hooli.com',
    mobile: '+1 555 0100',
    department: 'Executive',
    designation: 'Chief CEO Advisor',
    joiningDate: '2021-01-01',
    employmentType: 'Full-time',
    workMode: 'Onsite',
    workLocation: 'Hooli Plaza',
    shiftTiming: '09:00 AM - 06:00 PM',
    reportingManager: 'Board of Directors',
    status: 'Inactive',
    profileCompleteness: 98,
    uanNumber: '100392817293',
    panNumber: 'GAVN1000B',
    aadhaarNumber: '1111-2222-3333',
    basicSalary: 50000,
    hra: 20000,
    grossSalary: 75000,
    netSalary: 69000,
    bankName: 'Hooli Security Bank',
    accountNumber: '••••••••0001',
    emergencyContactName: 'Denny',
    emergencyContactRelation: 'Friend',
    emergencyContactPhone: '+1 555 0101',
    attendanceStatus: 'Absent',
    payrollSyncStatus: 'Synchronized',
    backgroundVerificationStatus: 'Approved',
    documentVerificationStatus: 'Verified',
    timelineActivity: [
      { id: '1', timestamp: '2 weeks ago', message: 'Security status switched to Inactive.', type: 'warning' }
    ]
  },
  {
    id: 'EMP009',
    firstName: 'Laurie',
    lastName: 'Bream',
    fullName: 'Laurie Bream',
    email: 'laurie@raviga.com',
    mobile: '+1 555 0111',
    department: 'Finance',
    designation: 'Managing Partner',
    joiningDate: '2022-01-15',
    employmentType: 'Full-time',
    workMode: 'Onsite',
    workLocation: 'Raviga Building',
    shiftTiming: '08:00 AM - 05:00 PM',
    reportingManager: 'Raviga Board',
    status: 'Active',
    profileCompleteness: 88,
    uanNumber: '100493827103',
    panNumber: 'LBRE8392X',
    aadhaarNumber: '5555-6666-7777',
    basicSalary: 30000,
    hra: 12000,
    grossSalary: 45000,
    netSalary: 41000,
    bankName: 'Wells Fargo',
    accountNumber: '••••••••4892',
    emergencyContactName: 'Monica Hall',
    emergencyContactRelation: 'Friend',
    emergencyContactPhone: '+1 555 0134',
    attendanceStatus: 'Present',
    payrollSyncStatus: 'Synchronized',
    backgroundVerificationStatus: 'Approved',
    documentVerificationStatus: 'Verified',
    timelineActivity: [
      { id: '1', timestamp: '08:02 AM', message: 'Checked in early via security kiosk.', type: 'success' }
    ]
  },
  {
    id: 'EMP010',
    firstName: 'Jian',
    lastName: 'Yang',
    fullName: 'Jian Yang',
    email: 'jian.yang@incubator.com',
    mobile: '+1 555 0112',
    department: 'Operations',
    designation: 'Junior Developer',
    joiningDate: '2023-05-10',
    employmentType: 'Contract',
    workMode: 'Remote',
    workLocation: 'Remote China',
    shiftTiming: '09:00 AM - 06:00 PM',
    reportingManager: 'Erlich Bachman',
    status: 'Resigned',
    profileCompleteness: 50,
    uanNumber: '100984920482',
    panNumber: 'JIAN8392Y',
    aadhaarNumber: '8888-9999-0000',
    basicSalary: 6000,
    hra: 2400,
    grossSalary: 9000,
    netSalary: 8300,
    bankName: 'Bank of Beijing',
    accountNumber: '••••••••8392',
    emergencyContactName: 'Erlich Bachman',
    emergencyContactRelation: 'Friend',
    emergencyContactPhone: '+1 555 0184',
    attendanceStatus: 'Absent',
    payrollSyncStatus: 'Pending',
    backgroundVerificationStatus: 'Failed',
    documentVerificationStatus: 'Rejected',
    timelineActivity: [
      { id: '1', timestamp: '3 weeks ago', message: 'Onboarding docs rejected due to lack of verified passport copies.', type: 'error' },
      { id: '2', timestamp: 'Yesterday', message: 'Submitted formal resignation notice.', type: 'warning' }
    ]
  }
];

export const employeeService = {
  getEmployees(): Employee[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EMPLOYEES));
      return DEFAULT_EMPLOYEES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_EMPLOYEES;
    }
  },

  saveEmployees(employees: Employee[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  },

  addEmployee(employee: Omit<Employee, 'id' | 'profileCompleteness'> & { id?: string }): Employee {
    const list = this.getEmployees();
    const newId = employee.id || `EMP${String(list.length + 1).padStart(3, '0')}`;
    const newEmp: Employee = {
      ...employee,
      id: newId,
      profileCompleteness: 75, // Default for manual addition
      timelineActivity: [
        { id: '1', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Employee file established manually.', type: 'success' }
      ]
    };
    list.unshift(newEmp);
    this.saveEmployees(list);
    notify.success('Employee Added', `${newEmp.fullName} successfully enrolled into directory.`);
    return newEmp;
  },

  updateEmployee(id: string, updatedData: Partial<Employee>): Employee {
    const list = this.getEmployees();
    const index = list.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found.`);
    }
    const current = list[index];
    
    // Auto sync fullName if first/last names change
    const firstName = updatedData.firstName !== undefined ? updatedData.firstName : current.firstName;
    const lastName = updatedData.lastName !== undefined ? updatedData.lastName : current.lastName;
    const fullName = `${firstName} ${lastName}`;

    const merged: Employee = {
      ...current,
      ...updatedData,
      fullName,
      timelineActivity: [
        {
          id: String(Date.now()),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: 'Employee records updated and authorized.',
          type: 'info'
        },
        ...(current.timelineActivity || [])
      ]
    };
    list[index] = merged;
    this.saveEmployees(list);
    notify.success('Employee Updated', `Successfully updated records for ${merged.fullName}.`);
    return merged;
  },

  deleteEmployee(id: string): void {
    const list = this.getEmployees();
    const index = list.findIndex(e => e.id === id);
    if (index === -1) return;
    
    // Soft delete logic: change status to Terminated
    const current = list[index];
    current.status = 'Terminated';
    current.timelineActivity = [
      {
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: 'Employee contract soft-deleted / archived.',
        type: 'error'
      },
      ...(current.timelineActivity || [])
    ];
    this.saveEmployees(list);
    notify.error('Employee Soft-Deleted', `${current.fullName} status updated to Terminated.`);
  },

  bulkDeleteEmployees(ids: string[]): void {
    const list = this.getEmployees();
    const updated = list.map(emp => {
      if (ids.includes(emp.id)) {
        return {
          ...emp,
          status: 'Terminated' as const,
          timelineActivity: [
            {
              id: String(Date.now()),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              message: 'Batch contract soft-deleted / archived.',
              type: 'error' as const
            },
            ...(emp.timelineActivity || [])
          ]
        };
      }
      return emp;
    });
    this.saveEmployees(updated);
    notify.error('Bulk Archival Done', `Successfully archived ${ids.length} employee accounts.`);
  },

  bulkUpdateDepartment(ids: string[], department: string): void {
    const list = this.getEmployees();
    const updated = list.map(emp => {
      if (ids.includes(emp.id)) {
        return {
          ...emp,
          department,
          timelineActivity: [
            {
              id: String(Date.now()),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              message: `Batch reassigned to ${department} department.`,
              type: 'info' as const
            },
            ...(emp.timelineActivity || [])
          ]
        };
      }
      return emp;
    });
    this.saveEmployees(updated);
    notify.success('Bulk Update Done', `Reassigned ${ids.length} employees to ${department}.`);
  },

  bulkUpdateStatus(ids: string[], status: Employee['status']): void {
    const list = this.getEmployees();
    const updated = list.map(emp => {
      if (ids.includes(emp.id)) {
        return {
          ...emp,
          status,
          timelineActivity: [
            {
              id: String(Date.now()),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              message: `Batch status changed to ${status}.`,
              type: 'info' as const
            },
            ...(emp.timelineActivity || [])
          ]
        };
      }
      return emp;
    });
    this.saveEmployees(updated);
    notify.success('Bulk Status Update', `Updated ${ids.length} accounts status to ${status}.`);
  }
};
