import React, { useState } from 'react';
import { CheckCircle2, Globe2, Palette, SearchCheck, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/tenant/components/TenantUI';
import { WebsiteStatusBadge } from '@/tenant/website/WebsiteStatusBadge';
import { useWebsiteData } from '@/tenant/website/WebsiteDataProvider';
import type { WebsiteSeoSettings, WebsiteSettings } from '@/tenant/website/types';

const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>
);

export const WebsiteThemesPage: React.FC = () => {
  const website = useWebsiteData();
  return (
    <div>
      <PageHeader title="Themes" description="Select a website theme and review its palette, color, and button treatment." />
      <div className="grid gap-4 md:grid-cols-3">
        {website.themes.map((theme) => (
          <article key={theme.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-sm border border-slate-200" style={{ backgroundColor: theme.primaryColor }}><Palette className="h-4 w-4 text-white" /></span><div><h2 className="font-semibold text-slate-950">{theme.name}</h2><p className="text-xs text-slate-500">{theme.palette}</p></div></div>
              <WebsiteStatusBadge status={theme.status} />
            </div>
            <div className="mt-4 rounded-sm border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">Button style: {theme.buttonStyle}</div>
            <Button className="mt-4 w-full" variant={theme.status === 'Active' ? 'outline' : 'default'} disabled={theme.status === 'Active'} onClick={() => website.setActiveTheme(theme.id)}>{theme.status === 'Active' ? 'Current theme' : 'Use theme'}</Button>
          </article>
        ))}
      </div>
    </div>
  );
};

export const SeoSettingsPage: React.FC = () => {
  const website = useWebsiteData();
  const [settings, setSettings] = useState<WebsiteSeoSettings>(website.seoSettings);
  return (
    <div>
      <PageHeader title="SEO Settings" description="Default metadata, canonical domain, robots, and sitemap controls." action={<Button onClick={() => website.updateSeoSettings(settings)}><SearchCheck className="h-4 w-4" />Save SEO</Button>} />
      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
          <Field label="Default meta title" className="sm:col-span-2"><Input value={settings.defaultMetaTitle} onChange={(event) => setSettings({ ...settings, defaultMetaTitle: event.target.value })} /></Field>
          <Field label="Default meta description" className="sm:col-span-2"><Textarea value={settings.defaultMetaDescription} onChange={(event) => setSettings({ ...settings, defaultMetaDescription: event.target.value })} /></Field>
          <Field label="Canonical domain"><Input value={settings.canonicalDomain} onChange={(event) => setSettings({ ...settings, canonicalDomain: event.target.value })} /></Field>
          <Label className="flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"><Checkbox checked={settings.robotsIndex} onCheckedChange={(checked) => setSettings({ ...settings, robotsIndex: Boolean(checked) })} />Allow search indexing</Label>
          <Label className="flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"><Checkbox checked={settings.sitemapEnabled} onCheckedChange={(checked) => setSettings({ ...settings, sitemapEnabled: Boolean(checked) })} />Generate sitemap</Label>
        </form>
        <aside className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><h2 className="font-semibold text-slate-950">SEO checks</h2></div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <CheckRow label="Default meta title configured" done={Boolean(settings.defaultMetaTitle)} />
            <CheckRow label="Meta description configured" done={Boolean(settings.defaultMetaDescription)} />
            <CheckRow label="Canonical domain configured" done={Boolean(settings.canonicalDomain)} />
            <CheckRow label="Sitemap enabled" done={settings.sitemapEnabled} />
          </div>
        </aside>
      </section>
    </div>
  );
};

export const WebsiteSettingsPage: React.FC = () => {
  const website = useWebsiteData();
  const [settings, setSettings] = useState<WebsiteSettings>(website.websiteSettings);
  return (
    <div>
      <PageHeader title="Website Settings" description="Domain, SSL, contact, analytics, and public website preferences." action={<Button onClick={() => website.updateWebsiteSettings(settings)}><Settings2 className="h-4 w-4" />Save settings</Button>} />
      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
          <Field label="Domain"><Input value={settings.domain} onChange={(event) => setSettings({ ...settings, domain: event.target.value })} /></Field>
          <Field label="Contact email"><Input type="email" value={settings.contactEmail} onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })} /></Field>
          <Field label="SSL status"><select className="flex h-10 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400" value={settings.sslStatus} onChange={(event) => setSettings({ ...settings, sslStatus: event.target.value as WebsiteSettings['sslStatus'] })}><option>Verified</option><option>Pending</option></select></Field>
          <Field label="Analytics placeholder"><Input value={settings.analyticsPlaceholder} onChange={(event) => setSettings({ ...settings, analyticsPlaceholder: event.target.value })} /></Field>
          <Label className="flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 sm:col-span-2"><Checkbox checked={settings.cookieBannerEnabled} onCheckedChange={(checked) => setSettings({ ...settings, cookieBannerEnabled: Boolean(checked) })} />Cookie banner enabled</Label>
        </form>
        <aside className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-indigo-600" /><h2 className="font-semibold text-slate-950">Public website</h2></div>
          <div className="mt-4 space-y-3">
            <SettingRow label="Domain" value={settings.domain} />
            <SettingRow label="SSL" value={settings.sslStatus} />
            <SettingRow label="Analytics" value={settings.analyticsPlaceholder} />
            <SettingRow label="Cookie banner" value={settings.cookieBannerEnabled ? 'Enabled' : 'Disabled'} />
          </div>
        </aside>
      </section>
    </div>
  );
};

const CheckRow: React.FC<{ label: string; done: boolean }> = ({ label, done }) => <div className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2"><span>{label}</span><WebsiteStatusBadge status={done ? 'Verified' : 'Pending'} /></div>;
const SettingRow: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="rounded-sm border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-800">{value}</p></div>;
