import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpRight, BarChart3, Clock3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState, PageHeader, StatCard, StatusBadge } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

const PlaceholderAppPage: React.FC = () => {
  const { appSlug } = useParams();
  const { apps, installApp } = useTenantData();
  const app = apps.find((item) => item.slug === appSlug);

  if (!app) {
    return <EmptyState title="App not found" description="This module is not registered in the demo app catalogue." />;
  }

  const cta =
    app.status === 'upgrade_required'
      ? 'Upgrade'
      : app.status === 'coming_soon'
        ? 'Coming Soon'
        : app.status === 'locked'
          ? 'Request Setup'
          : 'Open Demo';

  return (
    <div>
      <PageHeader
        title={app.name}
        description={`${app.category} module placeholder. Backend-ready screens will plug into this route later.`}
        action={<StatusBadge status={app.status} />}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Demo records" value={app.status === 'coming_soon' ? 'Preview' : '24'} hint="Sample workspace data" icon={<BarChart3 className="h-4 w-4" />} />
        <StatCard label="Category" value={app.category} hint={app.plan} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Setup status" value={app.status.replace(/_/g, ' ')} hint="Local prototype only" icon={<Clock3 className="h-4 w-4" />} />
      </section>

      <section className="mt-5 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{app.name} workspace</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{app.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {['Overview widgets', 'Record list', 'Workflow actions'].map((label) => (
                <div key={label} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="mt-1 text-xs text-slate-500">Prepared as UI placeholder.</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4">
            <h3 className="font-semibold text-indigo-950">Next step</h3>
            <p className="mt-2 text-sm leading-6 text-indigo-800">This page keeps navigation complete while CRM receives full demo functionality first.</p>
            <Button className="mt-4 w-full" disabled={app.status === 'coming_soon'} onClick={() => installApp(app.slug)}>
              {cta}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaceholderAppPage;
