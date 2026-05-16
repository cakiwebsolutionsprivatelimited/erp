import { notify } from '@/services/notificationService';
import { AxiosError } from 'axios';

/**
 * Global API error handler
 */
export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 400:
        notify.error('Bad Request', message);
        break;
      case 401:
        notify.error('Unauthorized', 'Your session has expired. Please login again.');
        // Potentially trigger a logout here
        break;
      case 403:
        notify.error('Forbidden', "You don't have permission to perform this action.");
        break;
      case 404:
        notify.error('Not Found', 'The requested resource was not found.');
        break;
      case 500:
        notify.error('Server Error', 'An internal server error occurred. Please try again later.');
        break;
      default:
        notify.error('Error', message || 'Something went wrong');
    }
    return;
  }

  if (error instanceof Error) {
    notify.error('Error', error.message);
    return;
  }

  notify.error('Unknown Error', 'An unexpected error occurred.');
};
