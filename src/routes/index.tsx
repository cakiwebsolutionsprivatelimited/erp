import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ErrorLayout from '@/layouts/ErrorLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Dashboard from '@/pages/dashboard/Dashboard';
import Profile from '@/pages/dashboard/Profile';
import Settings from '@/pages/settings/Settings';
import Invoice from '@/pages/billing/Invoice';
import Pricing from '@/pages/billing/Pricing';
import NotFound from '@/pages/error/NotFound';
import CRMLeadsPage from '@/pages/crm/LeadsPage';
import ProfileFormPage from '@/pages/settings/ProfileForm';
import ComponentShowcasePage from '@/pages/dev/ComponentShowcasePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'profile', element: <ProfileFormPage /> },
          { path: 'settings', element: <Settings /> },
          { path: 'invoices', element: <Invoice /> },
          { path: 'pricing', element: <Pricing /> },
          // Placeholder for other routes
          { path: 'crm', element: <CRMLeadsPage /> },
          { path: 'hrms', element: <div className="p-8">HRMS Module</div> },
          { path: 'inventory', element: <div className="p-8">Inventory Module</div> },
          { path: 'billing', element: <div className="p-8">Billing Module</div> },
          { path: 'dev/components', element: <ComponentShowcasePage /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },
  {
    element: <ErrorLayout />,
    children: [
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
