import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLastSaved, setClonedData, addTimelineEvent } from '@/store/features/employeeOnboardingSlice';
import { type UseFormReset } from 'react-hook-form';
import { type EmployeeFormData } from '../types/employee.types';
import { notify } from '@/services/notificationService';

export const DRAFT_STORAGE_KEY = 'erp_employee_onboarding_draft';

export const useEmployeeDraft = (reset: UseFormReset<EmployeeFormData>) => {
  const dispatch = useAppDispatch();
  const clonedData = useAppSelector((state) => state.employeeOnboarding.clonedData);

  // 1. Check for draft or cloned template on mount
  useEffect(() => {
    // Priority 1: Cloned Template (Cloning / Rehiring workflow)
    if (clonedData) {
      reset(clonedData);
      dispatch(setLastSaved(new Date().toLocaleTimeString()));
      dispatch(setClonedData(null)); // clear after pre-filling
      notify.success('Template Loaded', 'Employee template loaded successfully into the wizard.');
      return;
    }

    // Priority 2: Unsaved Draft in Local Storage
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // We will expose a restore capability or just auto-load but prompt
        // Let's do a toast notification with an action to restore
        notify.info(
          'Unsaved Draft Found',
          'We found an unsaved draft from your last session. Click Restore Draft in the top header.'
        );
      } catch (err) {
        console.error('Failed to parse draft', err);
      }
    }
  }, [clonedData, reset, dispatch]);

  /**
   * Restores draft from local storage.
   */
  const restoreDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        reset(parsed);
        dispatch(setLastSaved(new Date().toLocaleTimeString()));
        dispatch(addTimelineEvent({ message: 'Unsaved draft restored successfully.', type: 'info' }));
        notify.success('Draft Restored', 'Restored draft from last session.');
      } catch (e) {
        notify.error('Restore Failed', 'Failed to restore unsaved draft.');
      }
    } else {
      notify.warning('No Draft Found', 'There is no draft saved in this browser.');
    }
  };

  /**
   * Manually saves form values as a draft.
   */
  const saveDraft = (values: EmployeeFormData) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
      const timeString = new Date().toLocaleTimeString();
      dispatch(setLastSaved(timeString));
      dispatch(addTimelineEvent({ message: 'Draft saved manually by user.', type: 'success' }));
      notify.success('Draft Saved', `Employee onboarding draft saved successfully at ${timeString}`);
    } catch (err) {
      notify.error('Draft Save Failed', 'Unable to persist draft data.');
    }
  };

  /**
   * Cleans the active draft from storage.
   */
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    dispatch(setLastSaved(null));
  };

  return {
    restoreDraft,
    saveDraft,
    clearDraft,
    hasDraftInStorage: !!localStorage.getItem(DRAFT_STORAGE_KEY)
  };
};
