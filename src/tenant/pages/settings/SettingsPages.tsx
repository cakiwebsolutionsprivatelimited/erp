import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatINR, PageHeader, PermissionMatrix, StatCard, StatusBadge } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';

export const CompanySettingsPage: React.FC = () => {
  const { company, updateCompany } = useTenantData();
  const [draft, setDraft] = useState(company);

  return (
    <div>
      <PageHeader title="Company Profile" description="Tenant profile used across invoices, CRM records, and user workspace identity." />
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(draft).map(([key, value]) => (
            <label key={key} className="grid gap-1.5">
              <span className="text-sm font-medium capitalize text-slate-700">{key.replace(/([A-Z])/g, ' $1')}</span>
              <input value={value} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            </label>
          ))}
        </div>
        <Button className="mt-5" onClick={() => updateCompany(draft)}>Save company profile</Button>
      </section>
    </div>
  );
};

export const UsersSettingsPage: React.FC = () => {
  const { users, roles, toggleUserStatus, changeUserRole } = useTenantData();
  return (
    <div>
      <PageHeader title="Users" description="Manage demo tenant users, status, and role assignments." action={<Button>Invite user</Button>} />
      <DataTable headers={['User', 'Phone', 'Role', 'Status', 'Last Active', 'Actions']}>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-4 py-3"><p className="font-medium text-slate-950">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></td>
            <td className="px-4 py-3 text-slate-600">{user.phone}</td>
            <td className="px-4 py-3">
              <select value={user.role} onChange={(event) => changeUserRole(user.id, event.target.value)} className="h-8 rounded-md border border-slate-200 px-2 text-sm">
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
            </td>
            <td className="px-4 py-3"><Badge className={user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}>{user.status}</Badge></td>
            <td className="px-4 py-3 text-slate-600">{user.lastActive}</td>
            <td className="px-4 py-3"><Button variant="outline" size="sm" onClick={() => toggleUserStatus(user.id)}>{user.status === 'active' ? 'Deactivate' : 'Activate'}</Button></td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export const RolesSettingsPage: React.FC = () => {
  const { roles } = useTenantData();
  return (
    <div>
      <PageHeader title="Roles & Permissions" description="Default role matrix for CRM, Sales, Billing, Inventory, HRMS, and Settings." />
      <PermissionMatrix roles={roles} />
    </div>
  );
};

export const ActiveAppsSettingsPage: React.FC = () => {
  const { apps, installApp } = useTenantData();
  return (
    <div>
      <PageHeader title="Active Apps" description="Review installed apps and enable demo-ready available apps." />
      <DataTable headers={['App', 'Category', 'Status', 'Plan', 'Action']}>
        {apps.map((app) => (
          <tr key={app.slug}>
            <td className="px-4 py-3"><p className="font-medium text-slate-950">{app.name}</p><p className="text-xs text-slate-500">{app.description}</p></td>
            <td className="px-4 py-3 text-slate-600">{app.category}</td>
            <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
            <td className="px-4 py-3 text-slate-600">{app.plan}</td>
            <td className="px-4 py-3"><Button size="sm" variant="outline" disabled={app.status !== 'available'} onClick={() => installApp(app.slug)}>Install demo</Button></td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export const PlanUsageSettingsPage: React.FC = () => {
  const { subscription, apps } = useTenantData();
  return (
    <div>
      <PageHeader title="Plan & Usage" description="Demo subscription limits and current tenant usage." action={<Button>Upgrade plan</Button>} />
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Current plan" value={subscription.plan} hint={`Renews ${subscription.renewalDate}`} />
        <StatCard label="Users" value={`${subscription.usersUsed}/${subscription.usersLimit}`} hint="Seats used" />
        <StatCard label="Storage" value={`${subscription.storageUsedMb} MB`} hint={`${subscription.storageLimitMb} MB limit`} />
        <StatCard label="Active apps" value={String(apps.filter((app) => app.status === 'installed').length)} hint="Installed modules" />
      </section>
      <section className="mt-5 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">Usage snapshot</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Usage label="Leads" used={subscription.leadsUsed} total={subscription.leadsLimit} />
          <Usage label="Invoices" used={subscription.invoicesUsed} total={subscription.invoicesLimit} />
          <Usage label="Storage value" used={subscription.storageUsedMb} total={subscription.storageLimitMb} suffix=" MB" />
          <Usage label="Pipeline value" used={420000} total={1000000} formatter={formatINR} />
        </div>
      </section>
    </div>
  );
};

const Usage: React.FC<{ label: string; used: number; total: number; suffix?: string; formatter?: (value: number) => string }> = ({ label, used, total, suffix = '', formatter }) => {
  const pct = Math.round((used / total) * 100);
  const display = formatter ? `${formatter(used)} / ${formatter(total)}` : `${used}${suffix} / ${total}${suffix}`;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{display}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
};
