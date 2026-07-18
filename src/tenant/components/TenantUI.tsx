import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppWindow,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Gauge,
  Grid3X3,
  Laptop,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Percent,
  PlusCircle,
  Search,
  Sparkles,
  ShoppingCart,
  Target,
  Trophy,
  UserCircle,
  Users,
  History,
  SlidersHorizontal,
  ReceiptText,
  PackageCheck,
  Repeat,
  Landmark,
  WalletCards,
  BriefcaseBusiness,
  FolderKanban,
  Headphones,
  Wrench,
  MapPinned,
  Megaphone,
  MessageCircle,
  Globe2,
  FormInput,
  Inbox,
  Palette,
  SearchCheck,
  ShieldCheck,
  Tags,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import { HrRestrictedState, getHrMenuForPath, useHrAccess } from '@/tenant/hr/HrAccess';
import type { AppStatus, FollowUp, Lead, LeadStage, TenantApp } from '@/tenant/types';
import { cn } from '@/utils';

type ModuleSection = 'crm' | 'sales' | 'finance' | 'inventory' | 'services' | 'hr' | 'website' | 'settings' | 'placeholder';

const moduleMeta: Record<ModuleSection, {
  name: string;
  label: string;
  description: string;
  accent: string;
  softAccent: string;
  textAccent: string;
  icon: React.ElementType;
}> = {
  crm: {
    name: 'CRM',
    label: 'CRM Module',
    description: 'Leads, pipeline, follow-ups, customers',
    accent: 'from-indigo-600 to-blue-500',
    softAccent: 'bg-indigo-50 border-indigo-100',
    textAccent: 'text-indigo-700',
    icon: Target,
  },
  sales: {
    name: 'Sales',
    label: 'Sales Module',
    description: 'Quotations, orders, subscriptions',
    accent: 'from-teal-600 to-emerald-500',
    softAccent: 'bg-teal-50 border-teal-100',
    textAccent: 'text-teal-700',
    icon: ShoppingCart,
  },
  finance: {
    name: 'Finance',
    label: 'Finance Module',
    description: 'Billing, GST, payments, expenses',
    accent: 'from-cyan-700 to-blue-500',
    softAccent: 'bg-cyan-50 border-cyan-100',
    textAccent: 'text-cyan-700',
    icon: Landmark,
  },
  inventory: {
    name: 'Inventory',
    label: 'Inventory Module',
    description: 'Products, stock, purchase, warehouses',
    accent: 'from-emerald-700 to-teal-500',
    softAccent: 'bg-emerald-50 border-emerald-100',
    textAccent: 'text-emerald-700',
    icon: PackageCheck,
  },
  services: {
    name: 'Services',
    label: 'Services Module',
    description: 'Projects, support, visits, work orders',
    accent: 'from-violet-700 to-indigo-500',
    softAccent: 'bg-violet-50 border-violet-100',
    textAccent: 'text-violet-700',
    icon: BriefcaseBusiness,
  },
  hr: {
    name: 'HR',
    label: 'HR Module',
    description: 'Employees, attendance, leave, payroll',
    accent: 'from-rose-700 to-orange-500',
    softAccent: 'bg-rose-50 border-rose-100',
    textAccent: 'text-rose-700',
    icon: Users,
  },
  website: {
    name: 'Website',
    label: 'Website Module',
    description: 'Pages, landing pages, forms, enquiries',
    accent: 'from-blue-700 to-cyan-500',
    softAccent: 'bg-blue-50 border-blue-100',
    textAccent: 'text-blue-700',
    icon: Globe2,
  },
  settings: {
    name: 'Settings',
    label: 'Tenant Settings',
    description: 'Company, users, roles, apps, plan',
    accent: 'from-slate-700 to-slate-500',
    softAccent: 'bg-slate-100 border-slate-200',
    textAccent: 'text-slate-700',
    icon: SlidersHorizontal,
  },
  placeholder: {
    name: 'Module',
    label: 'Module Preview',
    description: 'Placeholder workspace',
    accent: 'from-violet-600 to-fuchsia-500',
    softAccent: 'bg-violet-50 border-violet-100',
    textAccent: 'text-violet-700',
    icon: Grid3X3,
  },
};

export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const statusStyles: Record<AppStatus, string> = {
  installed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  available: 'border-blue-200 bg-blue-50 text-blue-700',
  locked: 'border-slate-200 bg-slate-100 text-slate-700',
  upgrade_required: 'border-amber-200 bg-amber-50 text-amber-700',
  coming_soon: 'border-violet-200 bg-violet-50 text-violet-700',
};

const statusLabels: Record<AppStatus, string> = {
  installed: 'Installed',
  available: 'Available',
  locked: 'Locked',
  upgrade_required: 'Upgrade Required',
  coming_soon: 'Coming Soon',
};

export const StatusBadge: React.FC<{ status: AppStatus; className?: string }> = ({ status, className }) => (
  <Badge className={cn('border text-[11px] hover:bg-inherit', statusStyles[status], className)}>
    {statusLabels[status]}
  </Badge>
);

export const SearchBar: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({
  value,
  onChange,
  placeholder = 'Search',
}) => (
  <label className="relative block">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
    />
  </label>
);

export const AppTopbar: React.FC<{ search?: string; onSearch?: (value: string) => void; compact?: boolean }> = ({
  search = '',
  onSearch,
  compact = false,
}) => {
  const { company, subscription } = useTenantData();
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className={cn('flex min-h-16 items-center gap-4 px-4', compact ? 'lg:px-5' : 'lg:px-8')}>
        <Link to="/apps" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-to-br from-indigo-600 to-teal-500 text-white shadow-sm">
            <AppWindow className="h-5 w-5" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-slate-950">{company.name}</span>
            <span className="block text-xs text-slate-500">Business workspace</span>
          </span>
        </Link>

        {onSearch && <div className="hidden flex-1 md:block"><SearchBar value={search} onChange={onSearch} placeholder="Search apps, leads, customers..." /></div>}

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 lg:block">
            {subscription.plan} ends {subscription.renewalDate}
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="hidden gap-2 rounded-full sm:flex">
            <UserCircle className="h-4 w-4" />
            {user?.name || 'Demo User'}
          </Button>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export const AppCard: React.FC<{ app: TenantApp; onAction: (app: TenantApp) => void }> = ({ app, onAction }) => {
  const iconColors = ['from-indigo-600 to-blue-500', 'from-teal-600 to-emerald-500', 'from-violet-600 to-fuchsia-500', 'from-amber-500 to-orange-500'];
  const color = iconColors[app.slug.length % iconColors.length];
  const Icon = app.icon ?? Grid3X3;
  const action = app.status === 'installed' ? 'Open' : app.status === 'available' ? 'Open Demo' : app.status === 'upgrade_required' ? 'Upgrade' : app.status === 'coming_soon' ? 'Coming Soon' : 'Request Setup';

  return (
    <article className="flex min-h-[158px] flex-col rounded-md border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-sm', color)}>
          <Icon className="h-5 w-5" />
        </span>
        <StatusBadge status={app.status} />
      </div>
      <div className="mt-4 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{app.category}</p>
        <h3 className="mt-1 text-base font-semibold text-slate-950">{app.name}</h3>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-500">{app.metric || app.plan}</span>
        <Button size="sm" variant={app.status === 'installed' ? 'default' : 'outline'} onClick={() => onAction(app)}>
          {action}
        </Button>
      </div>
    </article>
  );
};

const crmLinks = [
  { to: '/crm/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/crm/leads', label: 'Leads', icon: ClipboardList },
  { to: '/crm/companies', label: 'Companies', icon: Building2 },
  { to: '/crm/contacts', label: 'Contacts', icon: UserCircle },
  { to: '/crm/pipeline', label: 'Pipeline', icon: Gauge },
  { to: '/crm/follow-ups', label: 'Follow-ups', icon: CalendarDays },
  { to: '/crm/customers', label: 'Customers', icon: Users },
  { to: '/crm/activities', label: 'Activities', icon: History },
  { to: '/crm/communications', label: 'Communications', icon: MessageCircle },
  { to: '/crm/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/crm/support', label: 'Support', icon: Headphones },
  { to: '/crm/documents', label: 'Documents', icon: FileText },
  { to: '/crm/segments', label: 'Segments', icon: Tags },
  { to: '/crm/automation', label: 'Automation', icon: Sparkles },
  { to: '/crm/approvals', label: 'Approvals', icon: ShieldCheck },
  { to: '/crm/analytics', label: 'Analytics', icon: Gauge },
  { to: '/crm/admin', label: 'Admin', icon: Lock },
  { to: '/crm/ai-assistant', label: 'AI Assistant', icon: SearchCheck },
  { to: '/crm/quotations', label: 'Quotations', icon: FileText },
  { to: '/crm/reports', label: 'Reports', icon: CircleDollarSign },
  { to: '/crm/settings', label: 'CRM Settings', icon: SlidersHorizontal },
];

const settingsLinks = [
  { to: '/settings/company', label: 'Company', icon: Building2 },
  { to: '/settings/users', label: 'Users', icon: Users },
  { to: '/settings/roles', label: 'Roles', icon: Lock },
  { to: '/settings/apps', label: 'Active Apps', icon: Grid3X3 },
  { to: '/settings/plan-usage', label: 'Plan & Usage', icon: Sparkles },
];

const salesLinks = [
  { to: '/sales/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/sales/quotations', label: 'Quotations', icon: ReceiptText },
  { to: '/sales/orders', label: 'Sales Orders', icon: ShoppingCart },
  { to: '/sales/products-services', label: 'Products/Services', icon: PackageCheck },
  { to: '/sales/customers', label: 'Customers', icon: Users },
  { to: '/sales/subscriptions', label: 'Subscriptions', icon: Repeat },
  { to: '/sales/reports', label: 'Reports', icon: CircleDollarSign },
  { to: '/sales/settings', label: 'Sales Settings', icon: SlidersHorizontal },
];

const financeLinks = [
  { to: '/finance/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/finance/invoices', label: 'Invoices', icon: ReceiptText },
  { to: '/finance/invoices/new', label: 'GST Invoicing', icon: FileText },
  { to: '/finance/payments', label: 'Payments', icon: WalletCards },
  { to: '/finance/expenses', label: 'Expenses', icon: CircleDollarSign },
  { to: '/finance/customer-ledger', label: 'Customer Ledger', icon: Users },
  { to: '/finance/supplier-ledger', label: 'Supplier Ledger', icon: Landmark },
  { to: '/finance/accounting', label: 'Accounting', icon: BookOpen },
  { to: '/finance/payables', label: 'Payables', icon: ReceiptText },
  { to: '/finance/banking', label: 'Banking', icon: WalletCards },
  { to: '/finance/compliance', label: 'Tax & Compliance', icon: Percent },
  { to: '/finance/planning-assets', label: 'Planning & Assets', icon: BriefcaseBusiness },
  { to: '/finance/advanced-admin', label: 'Advanced Admin', icon: ShieldCheck },
  { to: '/finance/reports', label: 'Reports', icon: Gauge },
  { to: '/finance/settings', label: 'Finance Settings', icon: SlidersHorizontal },
];

const inventoryLinks = [
  { to: '/inventory/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory/products', label: 'Products', icon: PackageCheck },
  { to: '/inventory/catalog', label: 'Catalog Setup', icon: Tags },
  { to: '/inventory/tracking', label: 'Tracking', icon: SearchCheck },
  { to: '/inventory/stock', label: 'Stock', icon: Boxes },
  { to: '/inventory/purchase', label: 'Purchase', icon: ShoppingCart },
  { to: '/inventory/purchase-operations', label: 'Purchase Ops', icon: ReceiptText },
  { to: '/inventory/suppliers', label: 'Suppliers', icon: Users },
  { to: '/inventory/warehouses', label: 'Warehouses', icon: Building2 },
  { to: '/inventory/warehouse-operations', label: 'Warehouse Ops', icon: MapPinned },
  { to: '/inventory/fulfillment', label: 'Fulfillment', icon: ClipboardList },
  { to: '/inventory/transfers', label: 'Stock Transfers', icon: Repeat },
  { to: '/inventory/reports', label: 'Reports', icon: Gauge },
  { to: '/inventory/insights', label: 'Insights & Admin', icon: Sparkles },
  { to: '/inventory/settings', label: 'Inventory Settings', icon: SlidersHorizontal },
];

const servicesLinks = [
  { to: '/services/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/services/projects', label: 'Projects', icon: FolderKanban },
  { to: '/services/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/services/helpdesk', label: 'Helpdesk Tickets', icon: Headphones },
  { to: '/services/field-service', label: 'Field Service', icon: MapPinned },
  { to: '/services/work-orders', label: 'Work Orders', icon: Wrench },
  { to: '/services/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/services/reports', label: 'Reports', icon: Gauge },
  { to: '/services/settings', label: 'Service Settings', icon: SlidersHorizontal },
];

const hrLinks = [
  { to: '/hr/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/hr/employees', label: 'Employees', icon: Users },
  { to: '/hr/recruitment', label: 'Recruitment', icon: BriefcaseBusiness },
  { to: '/hr/onboarding', label: 'Onboarding', icon: ClipboardList },
  { to: '/hr/attendance', label: 'Attendance', icon: CalendarDays },
  { to: '/hr/shifts', label: 'Shifts & Roster', icon: Clock3 },
  { to: '/hr/leave', label: 'Leave', icon: History },
  { to: '/hr/payroll', label: 'Payroll', icon: WalletCards },
  { to: '/hr/performance', label: 'Performance', icon: Trophy },
  { to: '/hr/self-service', label: 'Self Service', icon: UserCircle },
  { to: '/hr/departments', label: 'Departments', icon: Building2 },
  { to: '/hr/documents', label: 'Documents', icon: FileText },
  { to: '/hr/assets', label: 'Assets', icon: Laptop },
  { to: '/hr/reports', label: 'Reports', icon: Gauge },
  { to: '/hr/settings', label: 'HR Settings', icon: SlidersHorizontal },
];

const websiteLinks = [
  { to: '/website/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/website/pages', label: 'Pages', icon: FileText },
  { to: '/website/landing-pages', label: 'Landing Pages', icon: Globe2 },
  { to: '/website/forms', label: 'Forms', icon: FormInput },
  { to: '/website/submissions', label: 'Submissions', icon: Inbox },
  { to: '/website/themes', label: 'Themes', icon: Palette },
  { to: '/website/seo-settings', label: 'SEO Settings', icon: SearchCheck },
  { to: '/website/settings', label: 'Website Settings', icon: SlidersHorizontal },
];

const getSectionLinks = (section: ModuleSection) => section === 'settings'
  ? settingsLinks
  : section === 'sales'
    ? salesLinks
    : section === 'finance'
      ? financeLinks
      : section === 'inventory'
        ? inventoryLinks
        : section === 'services'
          ? servicesLinks
          : section === 'hr'
            ? hrLinks
            : section === 'website'
              ? websiteLinks
              : crmLinks;

export const ModuleSidebar: React.FC<{ section?: ModuleSection }> = ({ section = 'crm' }) => {
  const hrAccess = useHrAccess();
  const links = getSectionLinks(section);
  const visibleLinks = section === 'hr' ? links.filter((item) => hrAccess.canAccessMenu(item.label)) : links;
  const meta = moduleMeta[section];
  const ModuleIcon = meta.icon;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="border-b border-slate-200 p-4">
        <Link to="/apps" className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-900">
          <ChevronLeft className="h-3.5 w-3.5" />
          App Launcher
        </Link>
        <div className={cn('rounded-md border p-3', meta.softAccent)}>
          <div className="flex items-center gap-3">
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-to-br text-white shadow-sm', meta.accent)}>
              <ModuleIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className={cn('truncate text-sm font-semibold', meta.textAccent)}>{meta.label}</p>
            </div>
          </div>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {visibleLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export const AppShell: React.FC<{ section?: ModuleSection }> = ({ section = 'crm' }) => {
  const location = useLocation();
  const hrAccess = useHrAccess();
  const meta = moduleMeta[section];
  const ModuleIcon = meta.icon;
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts[1]?.replace(/-/g, ' ') || 'dashboard';
  const hasHrAccess = section !== 'hr' || hrAccess.canAccessPath(location.pathname);
  const currentHrMenu = getHrMenuForPath(location.pathname);
  const mobileLinks = getSectionLinks(section).filter((item) => section !== 'hr' || hrAccess.canAccessMenu(item.label));

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopbar compact />
      <div className="flex">
        <ModuleSidebar section={section} />
        <main className="min-w-0 flex-1">
          <div className={cn('border-b px-4 py-4 md:px-6', meta.softAccent)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className={cn('flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-sm', meta.accent)}>
                  <ModuleIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current module</p>
                  <h1 className="text-xl font-semibold text-slate-950">{meta.name}</h1>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {section === 'hr' && (
                  <label className="flex items-center gap-2 rounded-md border border-white/70 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-rose-700" />
                    <select className="bg-transparent outline-none" value={hrAccess.activeRole} onChange={(event) => hrAccess.setActiveRole(event.target.value as typeof hrAccess.activeRole)} aria-label="Active HR role">
                      {hrAccess.roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </label>
                )}
                <div className="rounded-md border border-white/70 bg-white/80 px-3 py-1.5 text-sm font-medium capitalize text-slate-600 shadow-sm">
                  {meta.name} / {currentPage}
                </div>
              </div>
            </div>
          </div>
          <nav className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden" aria-label={`${meta.name} module navigation`}>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {mobileLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex h-10 shrink-0 items-center gap-2 rounded-sm border px-3 text-sm font-medium transition',
                      isActive ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
          <div className="p-4 md:p-6">
            {hasHrAccess ? <Outlet /> : <HrRestrictedState menu={currentHrMenu} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export const PageHeader: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    {action}
  </div>
);

export const StatCard: React.FC<{ label: string; value: string; hint?: string; icon?: React.ReactNode }> = ({ label, value, hint, icon }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      </div>
      {icon && <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700">{icon}</span>}
    </div>
    {hint && <p className="mt-3 text-xs text-slate-500">{hint}</p>}
  </div>
);

export const EmptyState: React.FC<{ title: string; description: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
    <Sparkles className="mx-auto h-10 w-10 text-slate-300" />
    <h3 className="mt-3 text-lg font-semibold text-slate-950">{title}</h3>
    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const LoadingState: React.FC = () => (
  <div className="grid gap-3">
    {[0, 1, 2].map((item) => <div key={item} className="h-20 animate-pulse rounded-md bg-slate-100" />)}
  </div>
);

export const DataTable: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
  <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  </div>
);

export const KanbanBoard: React.FC<{ leads: Lead[]; stages: LeadStage[]; onDropLead: (id: string, stage: LeadStage) => void }> = ({ leads, stages, onDropLead }) => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {stages.map((stage) => {
      const items = leads.filter((lead) => lead.stage === stage);
      return (
        <section
          key={stage}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => onDropLead(event.dataTransfer.getData('leadId'), stage)}
          className="min-h-[560px] w-72 shrink-0 rounded-md border border-slate-200 bg-slate-100/70 p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">{stage}</h2>
            <Badge variant="secondary">{items.length}</Badge>
          </div>
          <div className="space-y-3">
            {items.map((lead) => (
              <Link
                key={lead.id}
                to={`/crm/leads/${lead.id}`}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('leadId', lead.id)}
                className="block rounded-md border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-200 hover:shadow"
              >
                <p className="font-medium text-slate-950">{lead.name}</p>
                <p className="mt-1 text-xs text-slate-500">{lead.company}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge className={lead.priority === 'High' ? 'bg-red-50 text-red-700' : lead.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}>
                    {lead.priority || 'Medium'}
                  </Badge>
                  {(lead.tags || []).slice(0, 1).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{lead.assignedTo}</span>
                  <span className="font-semibold text-slate-800">{formatINR(lead.expectedValue)}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{lead.probability}% · {new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </section>
      );
    })}
  </div>
);

export const ActivityTimeline: React.FC<{ lead: Lead; followUps: FollowUp[] }> = ({ lead, followUps }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="font-semibold text-slate-950">Activity Timeline</h3>
    <div className="mt-4 space-y-4">
      <div className="flex gap-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
        <p className="text-sm text-slate-600">Lead created on {lead.createdAt} from {lead.source}.</p>
      </div>
      {lead.notes.map((note) => (
        <div key={note.id} className="flex gap-3">
          <FileText className="mt-0.5 h-4 w-4 text-indigo-600" />
          <p className="text-sm text-slate-600">{note.body} <span className="text-slate-400">by {note.author}</span></p>
        </div>
      ))}
      {followUps.map((followUp) => (
        <div key={followUp.id} className="flex gap-3">
          <CalendarDays className="mt-0.5 h-4 w-4 text-amber-600" />
          <p className="text-sm text-slate-600">{followUp.title} on {new Date(followUp.date).toLocaleString('en-IN')}.</p>
        </div>
      ))}
    </div>
  </div>
);

export const FollowUpCalendar: React.FC<{ followUps: FollowUp[]; leads: Lead[]; onComplete: (id: string) => void }> = ({ followUps, leads, onComplete }) => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {followUps.map((followUp) => {
      const lead = leads.find((item) => item.id === followUp.leadId);
      return (
        <div key={followUp.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">{followUp.title}</p>
              <p className="mt-1 text-xs text-slate-500">{lead?.name || 'Lead'} · {followUp.owner}</p>
            </div>
            <Badge className={followUp.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>
              {followUp.completed ? 'Done' : 'Open'}
            </Badge>
          </div>
          <p className="mt-4 text-sm text-slate-600">{new Date(followUp.date).toLocaleString('en-IN')}</p>
          {!followUp.completed && <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => onComplete(followUp.id)}>Mark complete</Button>}
        </div>
      );
    })}
  </div>
);

export const PermissionMatrix: React.FC<{ roles: string[] }> = ({ roles }) => {
  const modules = ['CRM', 'Sales', 'Billing', 'Inventory', 'HRMS', 'Settings'];
  return (
    <DataTable headers={['Role', ...modules]}>
      {roles.map((role) => (
        <tr key={role}>
          <td className="px-4 py-3 font-medium text-slate-950">{role}</td>
          {modules.map((module) => (
            <td key={module} className="px-4 py-3">
              <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                {role === 'Owner' || role === 'Admin' || module !== 'Settings' ? 'Allowed' : 'Limited'}
              </span>
            </td>
          ))}
        </tr>
      ))}
    </DataTable>
  );
};

export const MobileModuleHint: React.FC = () => (
  <div className="mb-4 flex items-center gap-2 rounded-sm border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-800 lg:hidden">
    <Menu className="h-4 w-4" />
    Module navigation is available from the app launcher shortcuts on smaller screens.
  </div>
);

export const FloatingCreateButton: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(to)}>
      <PlusCircle className="h-4 w-4" />
      {label}
    </Button>
  );
};
