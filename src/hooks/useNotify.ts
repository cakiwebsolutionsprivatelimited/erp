import { notify } from '@/services/notificationService';

/**
 * Hook wrapper for notifications (optional, as notify is global)
 */
export const useNotify = () => {
  return notify;
};
