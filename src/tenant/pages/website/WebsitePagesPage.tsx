import React, { useMemo, useState } from 'react';
import { Eye, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { WebsitePageForm } from '@/tenant/website/WebsiteForms';
import { WebsiteStatusBadge } from '@/tenant/website/WebsiteStatusBadge';
import { useWebsiteData } from '@/tenant/website/WebsiteDataProvider';
import type { WebsitePage, WebsitePageStatus } from '@/tenant/website/types';

const selectClass = 'h-9 rounded-sm border border-slate-200 bg-white px-2 text-xs outline-none focus:border-indigo-400';

const WebsitePagesPage: React.FC = () => {
  const website = useWebsiteData();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<WebsitePage | null>(null);
  const filtered = useMemo(() => website.pages.filter((page) => {
    const matchesQuery = `${page.title} ${page.slug} ${page.createdBy}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'All' || page.status === status);
  }), [query, status, website.pages]);

  return (
    <div>
      <PageHeader title="Pages" description="Create content pages, manage metadata, sections, and publish state." action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Create page</Button>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="w-full max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search pages, slugs, or owners" /></div>
        <select className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Published</option><option>Draft</option></select>
      </div>
      <DataTable headers={['Page title', 'URL slug', 'Status', 'Last updated', 'Created by', 'Actions']}>
        {filtered.map((page) => (
          <tr key={page.id}>
            <td className="px-4 py-3 font-medium text-slate-950">{page.title}</td>
            <td className="px-4 py-3 text-indigo-700">{page.slug}</td>
            <td className="px-4 py-3"><WebsiteStatusBadge status={page.status} /></td>
            <td className="px-4 py-3 text-slate-600">{page.lastUpdated}</td>
            <td className="px-4 py-3 text-slate-600">{page.createdBy}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <select aria-label={`Publish status for ${page.title}`} className={selectClass} value={page.status} onChange={(event) => website.updatePageStatus(page.id, event.target.value as WebsitePageStatus)}><option>Published</option><option>Draft</option></select>
                <Button size="icon" variant="ghost" title="View page" onClick={() => setSelected(page)}><Eye className="h-4 w-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Create page</DialogTitle><DialogDescription>Add a content page with SEO metadata and structured sections.</DialogDescription></DialogHeader><WebsitePageForm onSubmit={(draft) => { website.createPage(draft); setFormOpen(false); }} /></DialogContent></Dialog>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="sm:max-w-3xl">{selected && <PageDetail page={selected} />}</DialogContent></Dialog>
    </div>
  );
};

const PageDetail: React.FC<{ page: WebsitePage }> = ({ page }) => (
  <>
    <DialogHeader><div className="flex items-center gap-2"><DialogTitle>{page.title}</DialogTitle><WebsiteStatusBadge status={page.status} /></div><DialogDescription>{page.slug} · last updated {page.lastUpdated}</DialogDescription></DialogHeader>
    <div className="grid gap-3 sm:grid-cols-2">
      <Detail label="Meta title" value={page.metaTitle} className="sm:col-span-2" />
      <Detail label="Meta description" value={page.metaDescription} className="sm:col-span-2" />
      <Detail label="Views" value={page.views.toLocaleString('en-IN')} />
      <Detail label="Created by" value={page.createdBy} />
    </div>
    <div className="rounded-md border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-950">Page sections</h3>
      <div className="mt-3 grid gap-2">{page.sections.map((section) => <div key={section} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{section}</div>)}</div>
    </div>
  </>
);

const Detail: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => <div className={`rounded-sm border border-slate-200 bg-slate-50 p-3 ${className || ''}`}><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-800">{value}</p></div>;

export default WebsitePagesPage;
