import { createHashRouter, Navigate, RouterProvider, useParams } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import ErrorLayout from '@/layouts/ErrorLayout';
import ProtectedRoute from './ProtectedRoute';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import NotFound from '@/pages/error/NotFound';
import AppLauncherPage from '@/tenant/pages/AppLauncherPage';
import PlaceholderAppPage from '@/tenant/pages/PlaceholderAppPage';
import { AppShell } from '@/tenant/components/TenantUI';
import CrmDashboardPage from '@/tenant/pages/crm/CrmDashboardPage';
import LeadsListPage from '@/tenant/pages/crm/LeadsListPage';
import LeadFormPage from '@/tenant/pages/crm/LeadFormPage';
import LeadDetailPage from '@/tenant/pages/crm/LeadDetailPage';
import PipelinePage from '@/tenant/pages/crm/PipelinePage';
import FollowUpsPage from '@/tenant/pages/crm/FollowUpsPage';
import CustomersPage from '@/tenant/pages/crm/CustomersPage';
import CustomerDetailPage from '@/tenant/pages/crm/CustomerDetailPage';
import { CrmQuotationsPage, CrmReportsPage } from '@/tenant/pages/crm/CrmPlaceholderPages';
import CrmActivitiesPage from '@/tenant/pages/crm/CrmActivitiesPage';
import CrmSettingsPage from '@/tenant/pages/crm/CrmSettingsPage';
import {
  SalesDashboardPage,
  SalesOrdersPage,
  SalesProductsPage,
  SalesQuotationFormPage,
  SalesQuotationPreviewPage,
  SalesQuotationsPage,
  SalesReportsPage,
  SalesSettingsPage,
  SalesSubscriptionsPage,
} from '@/tenant/pages/sales/SalesPages';
import {
  ActiveAppsSettingsPage,
  CompanySettingsPage,
  PlanUsageSettingsPage,
  RolesSettingsPage,
  UsersSettingsPage,
} from '@/tenant/pages/settings/SettingsPages';

const LegacyAppRedirect = () => {
  const { appSlug } = useParams();
  return <Navigate to={`/placeholder/${appSlug}`} replace />;
};

const PlaceholderRedirect = () => {
  const { appSlug } = useParams();
  const salesRoutes: Record<string, string> = {
    sales: '/sales/dashboard',
    quotations: '/sales/quotations',
    subscriptions: '/sales/subscriptions',
  };

  if (appSlug && salesRoutes[appSlug]) {
    return <Navigate to={salesRoutes[appSlug]} replace />;
  }

  return <PlaceholderAppPage />;
};

const router = createHashRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/apps" replace /> },
      { path: 'apps', element: <AppLauncherPage /> },
      {
        path: 'crm',
        element: <AppShell section="crm" />,
        children: [
          { index: true, element: <Navigate to="/crm/dashboard" replace /> },
          { path: 'dashboard', element: <CrmDashboardPage /> },
          { path: 'leads', element: <LeadsListPage /> },
          { path: 'leads/new', element: <LeadFormPage /> },
          { path: 'leads/:id', element: <LeadDetailPage /> },
          { path: 'leads/:id/edit', element: <LeadFormPage /> },
          { path: 'pipeline', element: <PipelinePage /> },
          { path: 'follow-ups', element: <FollowUpsPage /> },
          { path: 'customers', element: <CustomersPage /> },
          { path: 'customers/:id', element: <CustomerDetailPage /> },
          { path: 'activities', element: <CrmActivitiesPage /> },
          { path: 'quotations', element: <CrmQuotationsPage /> },
          { path: 'reports', element: <CrmReportsPage /> },
          { path: 'settings', element: <CrmSettingsPage /> },
        ],
      },
      {
        path: 'sales',
        element: <AppShell section="sales" />,
        children: [
          { index: true, element: <Navigate to="/sales/dashboard" replace /> },
          { path: 'dashboard', element: <SalesDashboardPage /> },
          { path: 'quotations', element: <SalesQuotationsPage /> },
          { path: 'quotations/new', element: <SalesQuotationFormPage /> },
          { path: 'quotations/:id', element: <SalesQuotationPreviewPage /> },
          { path: 'quotations/:id/edit', element: <SalesQuotationFormPage /> },
          { path: 'orders', element: <SalesOrdersPage /> },
          { path: 'products-services', element: <SalesProductsPage /> },
          { path: 'customers', element: <CustomersPage /> },
          { path: 'subscriptions', element: <SalesSubscriptionsPage /> },
          { path: 'reports', element: <SalesReportsPage /> },
          { path: 'settings', element: <SalesSettingsPage /> },
        ],
      },
      {
        path: 'settings',
        element: <AppShell section="settings" />,
        children: [
          { index: true, element: <Navigate to="/settings/company" replace /> },
          { path: 'company', element: <CompanySettingsPage /> },
          { path: 'users', element: <UsersSettingsPage /> },
          { path: 'roles', element: <RolesSettingsPage /> },
          { path: 'apps', element: <ActiveAppsSettingsPage /> },
          { path: 'plan-usage', element: <PlanUsageSettingsPage /> },
        ],
      },
      {
        path: 'placeholder',
        element: <AppShell section="placeholder" />,
        children: [
          { path: ':appSlug', element: <PlaceholderRedirect /> },
        ],
      },
      { path: 'app/:appSlug', element: <LegacyAppRedirect /> },
    ],
  },
  {
    path: '*',
    element: <ErrorLayout />,
    children: [
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
