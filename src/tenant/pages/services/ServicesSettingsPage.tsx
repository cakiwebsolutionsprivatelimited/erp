import React, { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/tenant/components/TenantUI';
import { useServicesData } from '@/tenant/services/ServicesDataProvider';

const ServicesSettingsPage: React.FC = () => {
  const services = useServicesData();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ defaultSla: 8, autoAssign: true, customerUpdates: true, signatureRequired: true, collectPayment: false });

  return (
    <div>
      <PageHeader title="Service Settings" description="Configure service defaults, customer communication, and field completion rules." />
      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-950">Helpdesk defaults</h2>
          <div className="mt-4 max-w-xs"><Label htmlFor="default-sla">Default SLA response hours</Label><Input id="default-sla" className="mt-1.5" type="number" min="1" value={settings.defaultSla} onChange={(event) => setSettings({ ...settings, defaultSla: Number(event.target.value) })} /></div>
          <div className="mt-5 space-y-4"><SettingRow label="Automatic ticket assignment" description="Route new tickets to the active service queue." checked={settings.autoAssign} onCheckedChange={(checked) => setSettings({ ...settings, autoAssign: checked })} /><SettingRow label="Customer status updates" description="Notify customers when ticket status changes." checked={settings.customerUpdates} onCheckedChange={(checked) => setSettings({ ...settings, customerUpdates: checked })} /></div>
        </section>
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-950">Field completion</h2>
          <div className="mt-5 space-y-4"><SettingRow label="Require customer signature" description="Require a sign-off before completing field visits." checked={settings.signatureRequired} onCheckedChange={(checked) => setSettings({ ...settings, signatureRequired: checked })} /><SettingRow label="Prompt for payment collection" description="Show a collection step on chargeable visits." checked={settings.collectPayment} onCheckedChange={(checked) => setSettings({ ...settings, collectPayment: checked })} /></div>
        </section>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3"><Button onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 1800); }}><Save className="h-4 w-4" />Save settings</Button><Button variant="outline" onClick={services.resetServicesData}><RotateCcw className="h-4 w-4" />Reset demo data</Button>{saved && <span className="text-sm font-medium text-emerald-700">Settings saved</span>}</div>
    </div>
  );
};

const SettingRow: React.FC<{ label: string; description: string; checked: boolean; onCheckedChange: (checked: boolean) => void }> = ({ label, description, checked, onCheckedChange }) => <div className="flex items-start justify-between gap-4 rounded-sm border border-slate-200 p-3"><div><p className="text-sm font-medium text-slate-800">{label}</p><p className="mt-0.5 text-xs text-slate-500">{description}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} /></div>;

export default ServicesSettingsPage;
