import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Grid3X3, Layers3, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AppCard, AppTopbar, StatusBadge } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import type { TenantApp } from '@/tenant/types';

const categories = ['Sales', 'Finance', 'Inventory', 'Services', 'HR', 'Website', 'Marketing', 'Productivity', 'Customization', 'Industries', 'System'];

const AppLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { apps, company, subscription, installApp, recordAppOpen, resetDemoData } = useTenantData();
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<TenantApp | null>(null);

  const filteredApps = useMemo(() => {
    const query = search.toLowerCase().trim();
    return apps.filter((app) => !query || [app.name, app.category, app.description, app.status].join(' ').toLowerCase().includes(query));
  }, [apps, search]);

  const groupedApps = categories
    .map((item) => ({ category: item, apps: filteredApps.filter((app) => app.category === item) }))
    .filter((group) => group.apps.length > 0);

  const openApp = (app: TenantApp) => {
    recordAppOpen(app.slug);
    navigate(app.route || `/placeholder/${app.slug}`);
  };

  const handleAction = (app: TenantApp) => {
    if (app.status === 'installed') {
      openApp(app);
      return;
    }

    if (app.status === 'available') {
      installApp(app.slug);
      navigate(app.route || `/placeholder/${app.slug}`);
      return;
    }

    setSelectedApp(app);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopbar search={search} onSearch={setSearch} />
      <main className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <section className="mb-4 rounded-sm border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-sm border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <Grid3X3 className="h-3.5 w-3.5" />
                  App Launcher
                </span>
                <label className="flex min-w-72 items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  <select
                    className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none"
                    defaultValue={company.name}
                    aria-label="Company switcher placeholder"
                  >
                    <option>{company.name}</option>
                    <option disabled>Switch company coming soon</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => navigate('/settings/company')}>
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button variant="outline" onClick={() => navigate('/settings/apps')}>
                  <Layers3 className="h-4 w-4" />
                  Manage Apps
                </Button>
                <Button variant="outline" onClick={resetDemoData}>Reset demo data</Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-sm border border-slate-200 bg-slate-50 px-4 py-2.5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Installed</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{apps.filter((app) => app.status === 'installed').length}</p>
              </div>
              <div className="rounded-sm border border-slate-200 bg-slate-50 px-4 py-2.5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Available</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{apps.filter((app) => app.status === 'available').length}</p>
              </div>
              <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-2.5">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Plan</p>
                <p className="mt-1 text-sm font-semibold text-amber-900">{subscription.plan} · {subscription.usersUsed}/{subscription.usersLimit} users</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {groupedApps.map((group) => (
            <div key={group.category} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950">{group.category}</h2>
                <span className="text-sm text-slate-500">{group.apps.length} apps</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {group.apps.map((app) => <AppCard key={app.slug} app={app} onAction={handleAction} />)}
              </div>
            </div>
          ))}
          {filteredApps.length === 0 && (
            <div className="rounded-sm border border-dashed border-slate-300 bg-white p-8 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-3 text-lg font-semibold text-slate-950">No apps match this search</h2>
              <p className="mt-1 text-sm text-slate-500">Try clearing the search text.</p>
              <Button className="mt-4" variant="outline" onClick={() => setSearch('')}>Clear search</Button>
            </div>
          )}
        </section>
      </main>

      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedApp?.name}</DialogTitle>
            <DialogDescription>{selectedApp?.description}</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
              <StatusBadge status={selectedApp.status} />
              <p className="mt-3 text-sm text-slate-600">This app is on the {selectedApp.plan} plan. You can keep reviewing the placeholder while backend services are planned.</p>
            </div>
          )}
          <DialogFooter showCloseButton>
            {selectedApp && <Button onClick={() => openApp(selectedApp)}>Open placeholder</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppLauncherPage;
