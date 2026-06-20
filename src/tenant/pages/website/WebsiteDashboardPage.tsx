import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, FormInput, MousePointerClick, PlusCircle, Send, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { WebsiteStatusBadge } from '@/tenant/website/WebsiteStatusBadge';
import { useWebsiteData } from '@/tenant/website/WebsiteDataProvider';
import { getFormConversionRows, getWebsiteMetrics } from '@/tenant/website/websiteDemoService';

const WebsiteDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const website = useWebsiteData();
  const metrics = getWebsiteMetrics(website);
  const formRows = getFormConversionRows(website);

  return (
    <div>
      <PageHeader
        title="Website Dashboard"
        description="Published pages, forms, enquiries, and CRM handoff status for the public website."
        action={<Button onClick={() => navigate('/website/pages')}><PlusCircle className="h-4 w-4" />Create page</Button>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Published pages" value={String(metrics.publishedPages)} hint="Live website pages" icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Draft pages" value={String(metrics.draftPages)} hint="Needs publishing" icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Form submissions" value={String(metrics.formSubmissions)} hint="All website forms" icon={<FormInput className="h-4 w-4" />} />
        <StatCard label="Leads captured" value={String(metrics.leadsCaptured)} hint="Converted to CRM" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Page views" value={metrics.pageViews.toLocaleString('en-IN')} hint="Demo analytics placeholder" icon={<MousePointerClick className="h-4 w-4" />} />
        <StatCard label="Conversion rate" value={`${metrics.conversionRate}%`} hint="Submissions / views" icon={<TrendingUp className="h-4 w-4" />} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Form conversion">
          {formRows.map((row) => <Bar key={row.form.id} label={row.form.name} value={`${row.converted}/${row.submissions}`} percent={row.conversionRate} />)}
        </ChartPanel>
        <ChartPanel title="Landing page activity">
          {website.landingPages.map((page) => (
            <Bar key={page.id} label={page.name} value={`${page.conversions} leads`} percent={(page.conversions / Math.max(page.views, 1)) * 1000} tone="bg-cyan-600" />
          ))}
        </ChartPanel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading title="Recent submissions" action={<Button size="sm" variant="outline" onClick={() => navigate('/website/submissions')}>View all</Button>} />
          <DataTable headers={['Form', 'Visitor', 'Email', 'Submitted', 'CRM']}>
            {website.submissions.slice(0, 5).map((submission) => (
              <tr key={submission.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{submission.formName}</td>
                <td className="px-4 py-3 text-slate-600">{submission.visitorName}</td>
                <td className="px-4 py-3 text-slate-600">{submission.email}</td>
                <td className="px-4 py-3 text-slate-600">{new Date(submission.submittedAt).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3"><WebsiteStatusBadge status={submission.convertedToLead ? 'Converted' : 'Not Converted'} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div className="min-w-0">
          <SectionHeading title="Live pages" action={<Button size="sm" variant="outline" onClick={() => navigate('/website/landing-pages')}>Open landing pages</Button>} />
          <DataTable headers={['Page', 'Slug', 'Views', 'Status', '']}>
            {website.pages.filter((page) => page.status === 'Published').map((page) => (
              <tr key={page.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{page.title}</td>
                <td className="px-4 py-3 text-indigo-700">{page.slug}</td>
                <td className="px-4 py-3 text-slate-600">{page.views.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3"><WebsiteStatusBadge status={page.status} /></td>
                <td className="px-4 py-3"><Send className="h-4 w-4 text-slate-400" /></td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>
    </div>
  );
};

const ChartPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-indigo-600" /><h2 className="font-semibold text-slate-950">{title}</h2></div>
    <div className="mt-4 space-y-3">{children}</div>
  </div>
);

const Bar: React.FC<{ label: string; value: string; percent: number; tone?: string }> = ({ label, value, percent, tone = 'bg-indigo-600' }) => (
  <div>
    <div className="flex items-center justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{label}</span><span className="shrink-0 text-slate-500">{value}</span></div>
    <div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.max(4, Math.min(100, percent))}%` }} /></div>
  </div>
);

const SectionHeading: React.FC<{ title: string; action: React.ReactNode }> = ({ title, action }) => (
  <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-semibold text-slate-950">{title}</h2>{action}</div>
);

export default WebsiteDashboardPage;
