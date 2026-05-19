import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store';
import { setLastSaved, setIsAutoSaving, addTimelineEvent } from '@/store/features/employeeOnboardingSlice';
import { DRAFT_STORAGE_KEY } from './useEmployeeDraft';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEmployeeAutoSave = (watch: any, isDirty: boolean) => {
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Watch all fields
  const formValues = watch();

  useEffect(() => {
    // Only set up auto-save interval if there are dirty/unsaved changes
    if (!isDirty) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Auto-save every 10 seconds if form is dirty
    timerRef.current = setInterval(() => {
      dispatch(setIsAutoSaving(true));
      
      setTimeout(() => {
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formValues));
          const timeStr = new Date().toLocaleTimeString();
          dispatch(setLastSaved(timeStr));
          dispatch(addTimelineEvent({ message: 'Auto-saved draft successfully.', type: 'info' }));
        } catch (e) {
          console.error('Auto-save failed', e);
        } finally {
          dispatch(setIsAutoSaving(false));
        }
      }, 800); // Small delay to simulate background write operation nicely
    }, 10000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [formValues, isDirty, dispatch]);
};
