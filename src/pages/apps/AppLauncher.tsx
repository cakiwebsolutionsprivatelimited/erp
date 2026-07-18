import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  CircleDot,
  Clock3,
  Compass,
  Lock,
  Plus,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageContainer } from '@/components/common/PageLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { resetSearchQuery } from '@/store/features/searchSlice';
import { cn } from '@/utils';

type AppStatus = 'installed' | 'available' | 'locked' | 'upgrade' | 'soon';

type Category =
  | 'Sales'
  | 'Finance'
  | 'Inventory'
  | 'HRMS'
  | 'Services'
  | 'Marketing'
  | 'Website'
  | 'Productivity';

interface BusinessApp {
  id: string;
  name: string;
  category: Category;
  description: string;
  status: AppStatus;
  plan: string;
  route?: string;
  stats?: string;
  accent: string;
  glyph: 'pulse' | 'grid' | 'stack' | 'beam' | 'orbit';
}

const categories = ['All', 'Sales', 'Finance', 'Inventory', 'HRMS', 'Services', 'Marketing', 'Website', 'Productivity'] as const;

const initialApps: BusinessApp[] = [
  {
    id: 'crm',
    name: 'CRM',
    category: 'Sales',
    description: 'Track leads, follow-ups, and deal momentum from one workspace.',
    status: 'installed',
    plan: 'Starter+',
    route: '/crm',
    stats: '148 active leads',
    accent: 'from-[#18A999] to-[#137C8B]',
    glyph: 'orbit',
  },
  {
    id: 'sales',
    name: 'Sales',
    category: 'Sales',
    description: 'Manage quotes, approvals, order history, and revenue checkpoints.',
    status: 'available',
    plan: 'Starter+',
    stats: 'Demo ready',
    accent: 'from-[#F59E0B] to-[#EF6C35]',
    glyph: 'beam',
  },
  {
    id: 'billing',
    name: 'Billing',
    category: 'Finance',
    description: 'Create invoices, review payment status, and reconcile client balances.',
    status: 'installed',
    plan: 'Starter+',
    route: '/invoices',
    stats: '$42.8K outstanding',
    accent: 'from-[#4F46E5] to-[#2563EB]',
    glyph: 'stack',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    category: 'Inventory',
    description: 'Monitor stock, product movement, reorder points, and warehouse health.',
    status: 'installed',
    plan: 'Growth',
    route: '/inventory',
    stats: '27 low-stock SKUs',
    accent: 'from-[#16A34A] to-[#0F766E]',
    glyph: 'grid',
  },
  {
    id: 'purchase',
    name: 'Purchase',
    category: 'Inventory',
    description: 'Coordinate vendors, purchase orders, and approval queues.',
    status: 'available',
    plan: 'Growth',
    stats: '3 sample vendors',
    accent: 'from-[#06B6D4] to-[#0284C7]',
    glyph: 'pulse',
  },
  {
    id: 'accounts',
    name: 'Accounts',
    category: 'Finance',
    description: 'Review ledgers, cash flow, expenses, and accounting period status.',
    status: 'upgrade',
    plan: 'Scale',
    stats: 'Advanced reports',
    accent: 'from-[#7C3AED] to-[#BE185D]',
    glyph: 'orbit',
  },
  {
    id: 'hrms',
    name: 'HRMS',
    category: 'HRMS',
    description: 'Run employee records, onboarding, documents, and attendance workflows.',
    status: 'installed',
    plan: 'Growth',
    route: '/hrms',
    stats: '86 employees',
    accent: 'from-[#EA580C] to-[#D946EF]',
    glyph: 'beam',
  },
  {
    id: 'payroll',
    name: 'Payroll',
    category: 'HRMS',
    description: 'Prepare salary cycles, deductions, reimbursements, and payslips.',
    status: 'locked',
    plan: 'Scale',
    stats: 'Compliance pack',
    accent: 'from-[#DC2626] to-[#F97316]',
    glyph: 'stack',
  },
  {
    id: 'projects',
    name: 'Projects',
    category: 'Productivity',
    description: 'Plan work, assign owners, watch milestones, and unblock delivery.',
    status: 'available',
    plan: 'Starter+',
    stats: '6 templates',
    accent: 'from-[#0891B2] to-[#4338CA]',
    glyph: 'grid',
  },
  {
    id: 'helpdesk',
    name: 'Helpdesk',
    category: 'Services',
    description: 'Route tickets, measure response times, and keep service promises visible.',
    status: 'available',
    plan: 'Growth',
    stats: 'SLA view',
    accent: 'from-[#0D9488] to-[#65A30D]',
    glyph: 'pulse',
  },
  {
    id: 'field-service',
    name: 'Field Service',
    category: 'Services',
    description: 'Schedule site visits, assign technicians, and close field tasks quickly.',
    status: 'soon',
    plan: 'Roadmap',
    stats: 'Q3 preview',
    accent: 'from-[#334155] to-[#0F766E]',
    glyph: 'orbit',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    category: 'Marketing',
    description: 'Build campaigns, segment audiences, and compare channel performance.',
    status: 'available',
    plan: 'Growth',
    stats: '5 campaigns',
    accent: 'from-[#DB2777] to-[#9333EA]',
    glyph: 'beam',
  },
  {
    id: 'website',
    name: 'Website',
    category: 'Website',
    description: 'Publish pages, product stories, forms, and customer-facing updates.',
    status: 'soon',
    plan: 'Roadmap',
    stats: 'Builder beta',
    accent: 'from-[#2563EB] to-[#14B8A6]',
    glyph: 'grid',
  },
  {
    id: 'reports',
    name: 'Reports',
    category: 'Productivity',
    description: 'Collect operational signals into shareable executive snapshots.',
    status: 'installed',
    plan: 'Growth',
    route: '/',
    stats: '18 live widgets',
    accent: 'from-[#CA8A04] to-[#84CC16]',
    glyph: 'stack',
  },
  {
    id: 'studio',
    name: 'Studio',
    category: 'Productivity',
    description: 'Prototype fields, layouts, and internal workflows before release.',
    status: 'locked',
    plan: 'Scale',
    stats: 'No-code lab',
    accent: 'from-[#64748B] to-[#7C3AED]',
    glyph: 'pulse',
  },
];

const statusCopy: Record<AppStatus, { label: string; className: string; icon: React.ElementType }> = {
  installed: { label: 'Installed', className: 'bg-[#E8F7F1] text-[#0B6B52] border-[#A8E4D0]', icon: Check },
  available: { label: 'Available', className: 'bg-[#EDF4FF] text-[#1D4ED8] border-[#BFD7FF]', icon: Plus },
  locked: { label: 'Locked', className: 'bg-[#F7EEF8] text-[#9D174D] border-[#E9B8D6]', icon: Lock },
  upgrade: { label: 'Upgrade Required', className: 'bg-[#FFF4DE] text-[#9A5B00] border-[#F6D48B]', icon: Star },
  soon: { label: 'Coming Soon', className: 'bg-[#EEF2F6] text-[#465668] border-[#CED8E3]', icon: Clock3 },
};

const actionCopy: Record<AppStatus, string> = {
  installed: 'Open',
  available: 'Install demo',
  locked: 'View plan',
  upgrade: 'Upgrade',
  soon: 'Preview',
};

const AppGlyph: React.FC<Pick<BusinessApp, 'accent' | 'glyph' | 'name'>> = ({ accent, glyph, name }) => (
  <div className={cn('relative flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br shadow-sm', accent)}>
    <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.55),transparent_28%)]" />
    {glyph === 'pulse' && (
      <span className="relative flex items-end gap-1">
        <span className="h-4 w-1.5 rounded-full bg-white/75" />
        <span className="h-7 w-1.5 rounded-full bg-white" />
        <span className="h-5 w-1.5 rounded-full bg-white/80" />
      </span>
    )}
    {glyph === 'grid' && (
      <span className="relative grid grid-cols-2 gap-1">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className="h-3.5 w-3.5 rounded-[4px] bg-white/85" />
        ))}
      </span>
    )}
    {glyph === 'stack' && (
      <span className="relative space-y-1">
        <span className="block h-2.5 w-7 rounded-full bg-white/85" />
        <span className="block h-2.5 w-7 rounded-full bg-white/65" />
        <span className="block h-2.5 w-7 rounded-full bg-white/90" />
      </span>
    )}
    {glyph === 'beam' && (
      <span className="relative h-8 w-8 rotate-45 rounded-[8px] border-2 border-white/75">
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </span>
    )}
    {glyph === 'orbit' && (
      <span className="relative h-8 w-8 rounded-full border-2 border-white/75">
        <span className="absolute -right-1 top-1 h-2.5 w-2.5 rounded-full bg-white" />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
      </span>
    )}
    <span className="sr-only">{name} icon</span>
  </div>
);

const AppLauncher: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.search.query);
  const [apps, setApps] = useState(initialApps);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');
  const [selectedApp, setSelectedApp] = useState<BusinessApp | null>(null);
  const [dialogMode, setDialogMode] = useState<'locked' | 'upgrade' | 'soon' | null>(null);

  useEffect(() => {
    return () => {
      dispatch(resetSearchQuery());
    };
  }, [dispatch]);

  const filteredApps = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return apps.filter((app) => {
      const categoryMatch = activeCategory === 'All' || app.category === activeCategory;
      const searchMatch =
        !query ||
        app.name.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.plan.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, apps, searchQuery]);

  const installedCount = apps.filter((app) => app.status === 'installed').length;
  const availableCount = apps.filter((app) => app.status === 'available').length;

  const handleAction = (app: BusinessApp) => {
    if (app.status === 'installed' && app.route) {
      navigate(app.route);
      return;
    }

    if (app.status === 'available') {
      setApps((currentApps) =>
        currentApps.map((currentApp) =>
          currentApp.id === app.id
            ? { ...currentApp, status: 'installed', route: currentApp.route ?? '/' }
            : currentApp
        )
      );
      return;
    }

    setSelectedApp(app);
    setDialogMode(app.status === 'locked' ? 'locked' : app.status === 'upgrade' ? 'upgrade' : 'soon');
  };

  const dialogTitle =
    dialogMode === 'locked'
      ? 'Plan access needed'
      : dialogMode === 'upgrade'
        ? 'Upgrade required'
        : 'Roadmap preview';

  const dialogDescription =
    dialogMode === 'locked'
      ? `${selectedApp?.name} is part of the Scale workspace. Upgrade to unlock advanced teams, automation, and governance controls.`
      : dialogMode === 'upgrade'
        ? `${selectedApp?.name} needs a higher workspace plan before it can be enabled for this company.`
        : `${selectedApp?.name} is being prepared for a future release. You can keep it visible in this launcher as a planning signal.`;

  return (
    <PageContainer className="bg-[#F7F8F5]" showBreadcrumb={false}>
      <section className="overflow-hidden rounded-lg border border-[#DCE4DC] bg-[#FCFDF9] shadow-sm">
        <div className="grid gap-6 p-5 md:grid-cols-[1.5fr_0.9fr] md:p-7">
          <div className="space-y-5">
            <Badge className="border-[#BFD8BE] bg-[#EEF7E9] text-[#335B3E] hover:bg-[#EEF7E9]">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              PulseSuite app launcher
            </Badge>
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-[#18251D] md:text-4xl">
                Pick the business module your team needs next.
              </h1>
              <p className="text-base leading-7 text-[#59685E]">
                A modular ERP home for installed apps, demo-ready modules, plan-gated tools, and upcoming workspace additions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate('/crm')} className="bg-[#1F5E49] text-white hover:bg-[#184C3B]">
                Open CRM
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-[#CAD8CB] bg-white text-[#25362B] hover:bg-[#EEF7E9]">
                Configure workspace
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            <div className="rounded-lg border border-[#DCE4DC] bg-white p-4">
              <p className="text-sm text-[#637268]">Installed apps</p>
              <p className="mt-2 text-3xl font-bold text-[#18251D]">{installedCount}</p>
            </div>
            <div className="rounded-lg border border-[#DCE4DC] bg-white p-4">
              <p className="text-sm text-[#637268]">Ready to install</p>
              <p className="mt-2 text-3xl font-bold text-[#18251D]">{availableCount}</p>
            </div>
            <div className="rounded-lg border border-[#DCE4DC] bg-white p-4">
              <p className="text-sm text-[#637268]">Workspace health</p>
              <p className="mt-2 flex items-center gap-2 text-3xl font-bold text-[#1F5E49]">
                <Zap className="h-6 w-6" />
                92%
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#18251D]">Module library</h2>
            <p className="text-sm text-[#637268]">Filter by function, then open or enable modules from the card actions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  activeCategory === category
                    ? 'border-[#1F5E49] bg-[#1F5E49] text-white'
                    : 'border-[#D4DED4] bg-white text-[#536257] hover:bg-[#EEF7E9]'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredApps.map((app) => {
            const StatusIcon = statusCopy[app.status].icon;

            return (
              <article
                key={app.id}
                className="group flex min-h-[230px] flex-col rounded-lg border border-[#DCE4DC] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#BFD8BE] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <AppGlyph accent={app.accent} glyph={app.glyph} name={app.name} />
                  <Badge className={cn('gap-1 border text-[11px] hover:bg-inherit', statusCopy[app.status].className)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusCopy[app.status].label}
                  </Badge>
                </div>

                <div className="mt-4 flex-1 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#829084]">{app.category}</p>
                    <h3 className="mt-1 text-lg font-semibold text-[#18251D]">{app.name}</h3>
                  </div>
                  <p className="text-sm leading-6 text-[#5D6B62]">{app.description}</p>
                </div>

                <div className="mt-4 grid gap-3 border-t border-[#E5EBE5] pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-1.5 text-[#637268]">
                      <CircleDot className="h-3.5 w-3.5 text-[#1F5E49]" />
                      {app.plan}
                    </span>
                    {app.stats && <span className="font-medium text-[#26382D]">{app.stats}</span>}
                  </div>
                  <Button
                    onClick={() => handleAction(app)}
                    variant={app.status === 'installed' ? 'default' : 'outline'}
                    className={cn(
                      'w-full',
                      app.status === 'installed'
                        ? 'bg-[#1F5E49] text-white hover:bg-[#184C3B]'
                        : 'border-[#CAD8CB] bg-[#FCFDF9] text-[#25362B] hover:bg-[#EEF7E9]'
                    )}
                  >
                    {actionCopy[app.status]}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#BFD8BE] bg-white p-8 text-center">
            <Compass className="mx-auto h-10 w-10 text-[#829084]" />
            <h3 className="mt-3 text-lg font-semibold text-[#18251D]">No modules found</h3>
            <p className="mt-1 text-sm text-[#637268]">Try a different category or search term.</p>
          </div>
        )}
      </section>

      <Dialog open={!!dialogMode} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="border-[#DCE4DC] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-[#DCE4DC] bg-[#F7F8F5] p-4">
            <p className="text-sm font-semibold text-[#18251D]">{selectedApp?.name}</p>
            <p className="mt-1 text-sm text-[#637268]">Plan: {selectedApp?.plan}</p>
          </div>
          <DialogFooter showCloseButton>
            {dialogMode !== 'soon' && (
              <Button className="bg-[#1F5E49] text-white hover:bg-[#184C3B]">Review plans</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default AppLauncher;
