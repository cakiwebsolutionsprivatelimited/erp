import React, { useMemo, useState } from 'react';
import { ArrowRightCircle, Eye, PlusCircle, TestTube2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { SubmissionCaptureForm } from '@/tenant/website/WebsiteForms';
import { WebsiteStatusBadge } from '@/tenant/website/WebsiteStatusBadge';
import { useWebsiteData } from '@/tenant/website/WebsiteDataProvider';
import type { WebsiteSubmission } from '@/tenant/website/types';

const WebsiteSubmissionsPage: React.FC = () => {
  const website = useWebsiteData();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<WebsiteSubmission | null>(null);
  const filtered = useMemo(() => website.submissions.filter((submission) => {
    const matchesQuery = `${submission.formName} ${submission.visitorName} ${submission.phone} ${submission.email}`.toLowerCase().includes(query.toLowerCase());
    const conversionStatus = submission.convertedToLead ? 'Converted' : 'Not Converted';
    return matchesQuery && (status === 'All' || status === conversionStatus);
  }), [query, status, website.submissions]);

  const addSample = () => {
    const firstActiveForm = website.forms.find((form) => form.status === 'Active') || website.forms[0];
    if (firstActiveForm) website.addSampleSubmission(firstActiveForm.id);
  };

  return (
    <div>
      <PageHeader
        title="Submissions"
        description="Review enquiries from forms and convert qualified submissions into CRM leads."
        action={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={addSample}><TestTube2 className="h-4 w-4" />Add sample</Button><Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Add submission</Button></div>}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="w-full max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search submissions, visitors, phone, email" /></div>
        <select className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Converted</option><option>Not Converted</option></select>
      </div>
      <DataTable headers={['Form name', 'Visitor name', 'Phone', 'Email', 'Submitted date', 'Converted to lead', 'Actions']}>
        {filtered.map((submission) => (
          <tr key={submission.id}>
            <td className="px-4 py-3 font-medium text-slate-950">{submission.formName}</td>
            <td className="px-4 py-3 text-slate-600">{submission.visitorName}</td>
            <td className="px-4 py-3 text-slate-600">{submission.phone}</td>
            <td className="px-4 py-3 text-slate-600">{submission.email}</td>
            <td className="px-4 py-3 text-slate-600">{new Date(submission.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            <td className="px-4 py-3"><WebsiteStatusBadge status={submission.convertedToLead ? 'Converted' : 'Not Converted'} /></td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" title="View submission" onClick={() => setSelected(submission)}><Eye className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" title="Convert to CRM lead" disabled={submission.convertedToLead} onClick={() => website.convertSubmissionToLead(submission.id)}><ArrowRightCircle className="h-4 w-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Add submission</DialogTitle><DialogDescription>Capture a demo website enquiry for testing conversion to CRM.</DialogDescription></DialogHeader><SubmissionCaptureForm forms={website.forms} onSubmit={(draft) => { website.createSubmission(draft); setFormOpen(false); }} /></DialogContent></Dialog>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="sm:max-w-3xl">{selected && <SubmissionDetail submission={website.submissions.find((item) => item.id === selected.id) || selected} />}</DialogContent></Dialog>
    </div>
  );
};

const SubmissionDetail: React.FC<{ submission: WebsiteSubmission }> = ({ submission }) => (
  <>
    <DialogHeader><div className="flex items-center gap-2"><DialogTitle>{submission.visitorName}</DialogTitle><WebsiteStatusBadge status={submission.convertedToLead ? 'Converted' : 'Not Converted'} /></div><DialogDescription>{submission.formName} · {submission.sourcePage}</DialogDescription></DialogHeader>
    <div className="grid gap-3 sm:grid-cols-3">
      <Detail label="Phone" value={submission.phone} />
      <Detail label="Email" value={submission.email} />
      <Detail label="CRM Lead" value={submission.leadId || 'Not converted'} />
    </div>
    <div className="rounded-md border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-950">Submitted values</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {Object.entries(submission.values).map(([key, value]) => <Detail key={key} label={key} value={value} />)}
      </div>
    </div>
  </>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="rounded-sm border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-800">{value}</p></div>;

export default WebsiteSubmissionsPage;
