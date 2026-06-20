import React, { useMemo, useState } from 'react';
import { Eye, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { LandingPageForm } from '@/tenant/website/WebsiteForms';
import { WebsiteStatusBadge } from '@/tenant/website/WebsiteStatusBadge';
import { useWebsiteData } from '@/tenant/website/WebsiteDataProvider';
import type { LandingPage, LandingPageStatus } from '@/tenant/website/types';

const selectClass = 'h-9 rounded-sm border border-slate-200 bg-white px-2 text-xs outline-none focus:border-indigo-400';

const LandingPagesPage: React.FC = () => {
  const website = useWebsiteData();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<LandingPage | null>(null);
  const filtered = useMemo(() => website.landingPages.filter((page) => `${page.name} ${page.campaign} ${page.slug} ${page.heroTitle}`.toLowerCase().includes(query.toLowerCase())), [query, website.landingPages]);

  return (
    <div>
      <PageHeader title="Landing Pages" description="Campaign-specific pages with hero copy, CTA, attached forms, and conversion tracking." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Create landing page</Button>} />
      <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search landing pages or campaigns" /></div>
      <DataTable headers={['Landing page', 'Campaign', 'URL slug', 'Hero title', 'CTA button', 'Form attached', 'Status', 'Actions']}>
        {filtered.map((page) => (
          <tr key={page.id}>
            <td className="px-4 py-3 font-medium text-slate-950">{page.name}</td>
            <td className="px-4 py-3 text-slate-600">{page.campaign}</td>
            <td className="px-4 py-3 text-indigo-700">{page.slug}</td>
            <td className="max-w-72 truncate px-4 py-3 text-slate-600">{page.heroTitle}</td>
            <td className="px-4 py-3 text-slate-600">{page.ctaButton}</td>
            <td className="px-4 py-3 text-slate-600">{page.formName}</td>
            <td className="px-4 py-3"><WebsiteStatusBadge status={page.status} /></td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <select aria-label={`Status for ${page.name}`} className={selectClass} value={page.status} onChange={(event) => website.updateLandingPageStatus(page.id, event.target.value as LandingPageStatus)}>{['Published', 'Draft', 'Paused', 'Archived'].map((status) => <option key={status}>{status}</option>)}</select>
                <Button size="icon" variant="ghost" title="View landing page" onClick={() => setSelected(page)}><Eye className="h-4 w-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Create landing page</DialogTitle><DialogDescription>Attach a form and publish a campaign-specific page.</DialogDescription></DialogHeader><LandingPageForm forms={website.forms} onSubmit={(draft) => { website.createLandingPage(draft); setFormOpen(false); }} /></DialogContent></Dialog>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="sm:max-w-2xl">{selected && <LandingDetail page={selected} />}</DialogContent></Dialog>
    </div>
  );
};

const LandingDetail: React.FC<{ page: LandingPage }> = ({ page }) => (
  <>
    <DialogHeader><div className="flex items-center gap-2"><DialogTitle>{page.name}</DialogTitle><WebsiteStatusBadge status={page.status} /></div><DialogDescription>{page.campaign} · {page.slug}</DialogDescription></DialogHeader>
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">Hero title</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{page.heroTitle}</p>
      <p className="mt-3 text-sm text-slate-600">CTA: {page.ctaButton}</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      <Detail label="Form" value={page.formName} />
      <Detail label="Views" value={page.views.toLocaleString('en-IN')} />
      <Detail label="Conversions" value={String(page.conversions)} />
    </div>
  </>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="rounded-sm border border-slate-200 bg-white p-3"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-800">{value}</p></div>;

export default LandingPagesPage;
