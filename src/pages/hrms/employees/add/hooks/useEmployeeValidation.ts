import { useAppDispatch } from '@/store';
import { markTabComplete, addTimelineEvent } from '@/store/features/employeeOnboardingSlice';
import { TAB_VALIDATION_FIELDS } from '../schemas/employee.schema';
import { type UseFormTrigger } from 'react-hook-form';
import { type EmployeeFormData } from '../types/employee.types';

export const useEmployeeValidation = (
  trigger: UseFormTrigger<EmployeeFormData>
) => {
  const dispatch = useAppDispatch();

  /**
   * Validates the active tab before transitioning to the next tab.
   * Marks the tab complete/incomplete in the Redux state.
   */
  const validateTab = async (tabName: string): Promise<boolean> => {
    const fieldsToValidate = TAB_VALIDATION_FIELDS[tabName];
    
    // Review tab doesn't have local fields
    if (!fieldsToValidate || fieldsToValidate.length === 0) {
      dispatch(markTabComplete({ tabName, complete: true }));
      return true;
    }

    // Trigger validation for all fields in this specific tab
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await trigger(fieldsToValidate as any);
    
    dispatch(markTabComplete({ tabName, complete: isValid }));
    
    if (isValid) {
      dispatch(
        addTimelineEvent({
          message: `Section "${tabName}" completed successfully.`,
          type: 'success',
        })
      );
    } else {
      dispatch(
        addTimelineEvent({
          message: `Validation failed in "${tabName}".`,
          type: 'warning',
        })
      );
    }
    
    return isValid;
  };

  /**
   * Computes the overall onboarding completion percentage.
   * Formula: (validated tabs / total form tabs) * 100
   */
  const getCompletionPercentage = (tabCompletions: Record<string, boolean>): number => {
    const tabsToCount = Object.keys(TAB_VALIDATION_FIELDS).filter(tab => tab !== 'Review & Submit');
    if (tabsToCount.length === 0) return 0;
    
    let completedCount = 0;
    tabsToCount.forEach(tab => {
      if (tabCompletions[tab]) {
        completedCount++;
      }
    });

    return Math.round((completedCount / tabsToCount.length) * 100);
  };

  /**
   * Scans current errors and form values to compile a list of validation alerts.
   */
  const getMissingFieldsChecklist = (
    values: Partial<EmployeeFormData>,
    tabCompletions: Record<string, boolean>
  ) => {
    const checklist: { tab: string; missing: string[] }[] = [];

    Object.entries(TAB_VALIDATION_FIELDS).forEach(([tabName, fields]) => {
      if (tabName === 'Review & Submit') return;

      const missingInTab: string[] = [];

      fields.forEach((fieldName) => {
        // Address specific parsing
        if (fieldName === 'presentAddress') {
          const addr = values.presentAddress;
          if (!addr?.street || !addr?.city || !addr?.state || !addr?.district || !addr?.pin) {
            missingInTab.push('Present Address details');
          }
        } else if (fieldName === 'permanentAddress') {
          if (!values.sameAsPresent) {
            const addr = values.permanentAddress;
            if (!addr?.street || !addr?.city || !addr?.state || !addr?.district || !addr?.pin) {
              missingInTab.push('Permanent Address details');
            }
          }
        } else if (fieldName === 'education') {
          if (!values.education || values.education.length === 0) {
            missingInTab.push('Add at least one educational qualification');
          }
        } else if (fieldName === 'skills') {
          if (!values.skills || values.skills.length === 0) {
            missingInTab.push('Enter at least one skill tag');
          }
        } else if (fieldName === 'panFileUrl') {
          if (!values.panFileUrl) missingInTab.push('PAN Card Attachment');
        } else if (fieldName === 'aadhaarFileUrl') {
          if (!values.aadhaarFileUrl) missingInTab.push('Aadhaar Card Attachment');
        } else {
          // General fields
          const val = values[fieldName as keyof EmployeeFormData];
          if (val === undefined || val === null || val === '') {
            // Human friendly name
            const friendlyName = fieldName
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());
            missingInTab.push(friendlyName);
          }
        }
      });

      // If tab is marked incomplete in state or has missing items
      if (!tabCompletions[tabName] || missingInTab.length > 0) {
        checklist.push({
          tab: tabName,
          missing: missingInTab,
        });
      }
    });

    return checklist;
  };

  return {
    validateTab,
    getCompletionPercentage,
    getMissingFieldsChecklist,
  };
};
