import React from 'react';
import type { InvoiceTotals } from '@/tenant/finance/types';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';

interface TaxSummaryProps {
  totals: InvoiceTotals;
  compact?: boolean;
}

export const TaxSummary: React.FC<TaxSummaryProps> = ({ totals, compact = false }) => (
  <div className={compact ? 'space-y-2 text-sm' : 'rounded-md border border-slate-200 bg-white p-4 shadow-sm'}>
    {!compact && <h3 className="font-semibold text-slate-950">Tax Summary</h3>}
    <div className={compact ? 'space-y-2' : 'mt-3 space-y-2'}>
      <SummaryRow label="Subtotal" value={totals.subtotal} />
      <SummaryRow label="Discount" value={totals.discountTotal} tone="muted" />
      <SummaryRow label="Taxable value" value={totals.taxableTotal} />
      <SummaryRow label="CGST" value={totals.cgst} />
      <SummaryRow label="SGST" value={totals.sgst} />
      <SummaryRow label="IGST" value={totals.igst} />
      <SummaryRow label="Tax total" value={totals.taxTotal} />
      <SummaryRow label="Round off" value={totals.roundOff} tone="muted" />
      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="font-semibold text-slate-950">Grand total</span>
        <AmountDisplay value={totals.grandTotal} className="text-lg" />
      </div>
    </div>
  </div>
);

const SummaryRow: React.FC<{ label: string; value: number; tone?: 'default' | 'muted' }> = ({
  label,
  value,
  tone = 'default',
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-slate-500">{label}</span>
    <AmountDisplay value={value} tone={tone} />
  </div>
);
