import { toast } from 'sonner';

/**
 * Reusable notification service using Sonner
 */
export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  
  /**
   * Promise toast for loading states
   */
  promise: <T>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Action completed!',
      error = 'Something went wrong',
    }: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((err: unknown) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
  
  /**
   * Custom toast helper
   */
  custom: toast,
};
