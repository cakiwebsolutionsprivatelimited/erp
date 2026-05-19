import { type EmployeeFormData } from '../types/employee.types';
import { MOCK_EMPLOYEES } from '@/components/hrms/mockData';

export interface UploadProgressCallback {
  (percent: number): void;
}

export const employeeService = {
  /**
   * Generates a new unique employee ID based on the existing directory.
   */
  generateEmployeeId: async (): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network latency
    const ids = MOCK_EMPLOYEES.map(emp => {
      const num = parseInt(emp.id.replace('EMP', ''), 10);
      return isNaN(num) ? 0 : num;
    });
    const maxId = Math.max(...ids, 5); // default mock has up to EMP005
    const nextId = maxId + 1;
    return `EMP${nextId.toString().padStart(3, '0')}`;
  },

  /**
   * Checks for duplicate employee records (email or mobile).
   */
  checkDuplicates: async (email: string, mobile: string): Promise<{ emailExists: boolean; mobileExists: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const emailExists = MOCK_EMPLOYEES.some(
      emp => emp.email.toLowerCase() === email.toLowerCase()
    );
    const mobileClean = mobile.replace(/[^0-9]/g, '');
    const mobileExists = MOCK_EMPLOYEES.some(emp => {
      const empMobileClean = emp.phone.replace(/[^0-9]/g, '');
      return empMobileClean && empMobileClean === mobileClean;
    });

    return { emailExists, mobileExists };
  },

  /**
   * Simulates a secure file upload with progress tracking.
   */
  uploadDocument: async (
    file: File,
    onProgress: UploadProgressCallback
  ): Promise<{ fileUrl: string; fileName: string }> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Generate a fake, premium looking URL
          const mockUrl = `/uploads/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
          resolve({
            fileUrl: mockUrl,
            fileName: file.name
          });
        }
        onProgress(Math.min(progress, 100));
      }, 150);
    });
  },

  /**
   * Submits the completed onboarding record to the backend database.
   */
  submitEmployee: async (data: EmployeeFormData): Promise<{ success: boolean; data: any }> => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API payload write latency
    
    // Save to local storage mock for persistence if wanted
    const existingDraftsString = localStorage.getItem('erp_employees_submitted');
    const existing = existingDraftsString ? JSON.parse(existingDraftsString) : [];
    existing.push(data);
    localStorage.setItem('erp_employees_submitted', JSON.stringify(existing));
    
    // Remove the draft since it's successfully submitted
    localStorage.removeItem('erp_employee_onboarding_draft');

    return {
      success: true,
      data
    };
  }
};
