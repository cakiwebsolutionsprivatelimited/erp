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
import FinanceDashboardPage from '@/tenant/pages/finance/FinanceDashboardPage';
import InvoiceListPage from '@/tenant/pages/finance/InvoiceListPage';
import InvoiceFormPage from '@/tenant/pages/finance/InvoiceFormPage';
import InvoicePreviewPage from '@/tenant/pages/finance/InvoicePreviewPage';
import PaymentsPage from '@/tenant/pages/finance/PaymentsPage';
import ExpensesPage from '@/tenant/pages/finance/ExpensesPage';
import { CustomerLedgerPage, SupplierLedgerPage } from '@/tenant/pages/finance/LedgerPages';
import FinanceReportsPage from '@/tenant/pages/finance/FinanceReportsPage';
import FinanceSettingsPage from '@/tenant/pages/finance/FinanceSettingsPage';
import InventoryDashboardPage from '@/tenant/pages/inventory/InventoryDashboardPage';
import ProductsPage from '@/tenant/pages/inventory/ProductsPage';
import ProductFormPage from '@/tenant/pages/inventory/ProductFormPage';
import StockPage from '@/tenant/pages/inventory/StockPage';
import PurchasePage from '@/tenant/pages/inventory/PurchasePage';
import PurchaseOrderFormPage from '@/tenant/pages/inventory/PurchaseOrderFormPage';
import SuppliersPage from '@/tenant/pages/inventory/SuppliersPage';
import WarehousesPage from '@/tenant/pages/inventory/WarehousesPage';
import TransfersPage from '@/tenant/pages/inventory/TransfersPage';
import InventoryReportsPage from '@/tenant/pages/inventory/InventoryReportsPage';
import InventorySettingsPage from '@/tenant/pages/inventory/InventorySettingsPage';
import ServicesDashboardPage from '@/tenant/pages/services/ServicesDashboardPage';
import ProjectsPage from '@/tenant/pages/services/ProjectsPage';
import TasksPage from '@/tenant/pages/services/TasksPage';
import HelpdeskPage from '@/tenant/pages/services/HelpdeskPage';
import FieldServicePage from '@/tenant/pages/services/FieldServicePage';
import WorkOrdersPage from '@/tenant/pages/services/WorkOrdersPage';
import ServiceCalendarPage from '@/tenant/pages/services/ServiceCalendarPage';
import ServicesReportsPage from '@/tenant/pages/services/ServicesReportsPage';
import ServicesSettingsPage from '@/tenant/pages/services/ServicesSettingsPage';
import HrDashboardPage from '@/tenant/pages/hr/HrDashboardPage';
import EmployeesPage from '@/tenant/pages/hr/EmployeesPage';
import AttendancePage from '@/tenant/pages/hr/AttendancePage';
import LeavePage from '@/tenant/pages/hr/LeavePage';
import PayrollPage from '@/tenant/pages/hr/PayrollPage';
import { DepartmentsPage, HrDocumentsPage, HrReportsPage, HrSettingsPage } from '@/tenant/pages/hr/HrUtilityPages';
import WebsiteDashboardPage from '@/tenant/pages/website/WebsiteDashboardPage';
import WebsitePagesPage from '@/tenant/pages/website/WebsitePagesPage';
import LandingPagesPage from '@/tenant/pages/website/LandingPagesPage';
import WebsiteFormsPage from '@/tenant/pages/website/WebsiteFormsPage';
import WebsiteSubmissionsPage from '@/tenant/pages/website/WebsiteSubmissionsPage';
import { SeoSettingsPage, WebsiteSettingsPage, WebsiteThemesPage } from '@/tenant/pages/website/WebsiteUtilityPages';
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
    billing: '/finance/invoices',
    'gst-invoicing': '/finance/invoices/new',
    accounts: '/finance/customer-ledger',
    expenses: '/finance/expenses',
    products: '/inventory/products',
    stock: '/inventory/stock',
    purchase: '/inventory/purchase',
    warehouse: '/inventory/warehouses',
    projects: '/services/projects',
    tasks: '/services/tasks',
    helpdesk: '/services/helpdesk',
    'field-service': '/services/field-service',
    employees: '/hr/employees',
    attendance: '/hr/attendance',
    leave: '/hr/leave',
    payroll: '/hr/payroll',
    'website-builder': '/website/pages',
    'landing-pages': '/website/landing-pages',
    forms: '/website/forms',
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
        path: 'finance',
        element: <AppShell section="finance" />,
        children: [
          { index: true, element: <Navigate to="/finance/dashboard" replace /> },
          { path: 'dashboard', element: <FinanceDashboardPage /> },
          { path: 'invoices', element: <InvoiceListPage /> },
          { path: 'invoices/new', element: <InvoiceFormPage /> },
          { path: 'invoices/:id', element: <InvoicePreviewPage /> },
          { path: 'invoices/:id/edit', element: <InvoiceFormPage /> },
          { path: 'payments', element: <PaymentsPage /> },
          { path: 'expenses', element: <ExpensesPage /> },
          { path: 'customer-ledger', element: <CustomerLedgerPage /> },
          { path: 'supplier-ledger', element: <SupplierLedgerPage /> },
          { path: 'reports', element: <FinanceReportsPage /> },
          { path: 'settings', element: <FinanceSettingsPage /> },
        ],
      },
      {
        path: 'inventory',
        element: <AppShell section="inventory" />,
        children: [
          { index: true, element: <Navigate to="/inventory/dashboard" replace /> },
          { path: 'dashboard', element: <InventoryDashboardPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'products/new', element: <ProductFormPage /> },
          { path: 'products/:id/edit', element: <ProductFormPage /> },
          { path: 'stock', element: <StockPage /> },
          { path: 'purchase', element: <PurchasePage /> },
          { path: 'purchase/new', element: <PurchaseOrderFormPage /> },
          { path: 'suppliers', element: <SuppliersPage /> },
          { path: 'warehouses', element: <WarehousesPage /> },
          { path: 'transfers', element: <TransfersPage /> },
          { path: 'reports', element: <InventoryReportsPage /> },
          { path: 'settings', element: <InventorySettingsPage /> },
        ],
      },
      {
        path: 'services',
        element: <AppShell section="services" />,
        children: [
          { index: true, element: <Navigate to="/services/dashboard" replace /> },
          { path: 'dashboard', element: <ServicesDashboardPage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'helpdesk', element: <HelpdeskPage /> },
          { path: 'field-service', element: <FieldServicePage /> },
          { path: 'work-orders', element: <WorkOrdersPage /> },
          { path: 'calendar', element: <ServiceCalendarPage /> },
          { path: 'reports', element: <ServicesReportsPage /> },
          { path: 'settings', element: <ServicesSettingsPage /> },
        ],
      },
      {
        path: 'hr',
        element: <AppShell section="hr" />,
        children: [
          { index: true, element: <Navigate to="/hr/dashboard" replace /> },
          { path: 'dashboard', element: <HrDashboardPage /> },
          { path: 'employees', element: <EmployeesPage /> },
          { path: 'attendance', element: <AttendancePage /> },
          { path: 'leave', element: <LeavePage /> },
          { path: 'payroll', element: <PayrollPage /> },
          { path: 'departments', element: <DepartmentsPage /> },
          { path: 'documents', element: <HrDocumentsPage /> },
          { path: 'reports', element: <HrReportsPage /> },
          { path: 'settings', element: <HrSettingsPage /> },
        ],
      },
      {
        path: 'website',
        element: <AppShell section="website" />,
        children: [
          { index: true, element: <Navigate to="/website/dashboard" replace /> },
          { path: 'dashboard', element: <WebsiteDashboardPage /> },
          { path: 'pages', element: <WebsitePagesPage /> },
          { path: 'landing-pages', element: <LandingPagesPage /> },
          { path: 'forms', element: <WebsiteFormsPage /> },
          { path: 'submissions', element: <WebsiteSubmissionsPage /> },
          { path: 'themes', element: <WebsiteThemesPage /> },
          { path: 'seo-settings', element: <SeoSettingsPage /> },
          { path: 'settings', element: <WebsiteSettingsPage /> },
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
