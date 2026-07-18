import React from 'react';
import type { GSTSummary } from '@/tenant/finance/types';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';

interface GSTSummaryCardProps {
  summary: GSTSummary;
}

export const GSTSummaryCard: React.FC<GSTSummaryCardProps> = ({ summary }) => (
  <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="font-semibold text-slate-950">GST Summary</h2>
        <p className="mt-1 text-sm text-slate-500">Output GST minus eligible input GST.</p>
      </div>
      <AmountDisplay value={summary.payableEstimate} tone={summary.payableEstimate > 0 ? 'warning' : 'success'} />
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <MiniMetric label="Taxable sales" value={summary.taxableSales} />
      <MiniMetric label="Input GST" value={summary.inputGst} />
      <MiniMetric label="CGST collected" value={summary.cgstCollected} />
      <MiniMetric label="SGST collected" value={summary.sgstCollected} />
      <MiniMetric label="IGST collected" value={summary.igstCollected} />
      <MiniMetric label="Payable estimate" value={summary.payableEstimate} strong />
    </div>
  </section>
);

const MiniMetric: React.FC<{ label: string; value: number; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="rounded-md bg-slate-50 px-3 py-2">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <AmountDisplay value={value} className={strong ? 'mt-1 block text-base' : 'mt-1 block'} />
  </div>
);
