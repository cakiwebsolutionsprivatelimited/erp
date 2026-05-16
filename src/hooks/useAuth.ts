import { useAppDispatch, useAppSelector } from '@/store';
import { logout, setCredentials, setLoading } from '@/store/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/services/notificationService';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    notify.success('Logged out successfully');
    navigate('/login');
  };

  const login = async (credentials: any) => {
    dispatch(setLoading(true));
    try {
      // In a real app: const { data } = await api.post('/auth/login', credentials);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockResponse = {
        user: { id: '1', email: credentials.email, name: 'Admin User', role: 'admin' as const },
        token: 'mock-jwt-token',
        rememberMe: credentials.rememberMe
      };

      dispatch(setCredentials(mockResponse));
      notify.success(`Welcome back, ${mockResponse.user.name}!`);
      navigate('/');
    } catch (error: any) {
      notify.error('Login Failed', error.message || 'Invalid credentials');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: handleLogout,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin',
  };
};
