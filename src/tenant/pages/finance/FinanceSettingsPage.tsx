import React from 'react';
import { FileText, Landmark, Percent, ReceiptText, Settings2, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/tenant/components/TenantUI';

const settings = [
  {
    title: 'Invoice numbering',
    icon: ReceiptText,
    rows: ['Prefix: INV-2026', 'Next number: Auto generated', 'Reset cycle: Financial year'],
  },
  {
    title: 'GST settings',
    icon: Percent,
    rows: ['Company state: Odisha', 'Intra-state: CGST + SGST', 'Inter-state: IGST'],
  },
  {
    title: 'Payment modes',
    icon: WalletCards,
    rows: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'],
  },
  {
    title: 'Tax rates',
    icon: Landmark,
    rows: ['0%', '5%', '12%', '18%', '28%'],
  },
  {
    title: 'Terms and conditions',
    icon: FileText,
    rows: ['Default due date: 15 days', 'Payment terms editable per invoice', 'Notes shown on invoice preview'],
  },
  {
    title: 'Invoice template',
    icon: Settings2,
    rows: ['Logo placeholder', 'GST invoice layout', 'PDF download placeholder'],
  },
];

const FinanceSettingsPage: React.FC = () => (
  <div>
    <PageHeader title="Finance Settings" description="Demo finance configuration for billing, GST, payments, and invoice templates." action={<Button>Save settings demo</Button>} />
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {settings.map((section) => (
        <article key={section.title} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-sm bg-indigo-50 p-2 text-indigo-700">
              <section.icon className="h-4 w-4" />
            </span>
            <h2 className="font-semibold text-slate-950">{section.title}</h2>
          </div>
          <div className="mt-4 space-y-2">
            {section.rows.map((row) => (
              <div key={row} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">{row}</div>
            ))}
          </div>
        </article>
      ))}
    </section>
  </div>
);

export default FinanceSettingsPage;
