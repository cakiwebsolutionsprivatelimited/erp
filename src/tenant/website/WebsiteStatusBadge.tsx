import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { LandingPageStatus, WebsiteFormStatus, WebsitePageStatus } from '@/tenant/website/types';

type WebsiteStatus = LandingPageStatus | WebsiteFormStatus | WebsitePageStatus | 'Converted' | 'Not Converted' | 'Verified' | 'Pending' | 'Active' | 'Available';

const tones: Record<string, string> = {
  Published: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Converted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Verified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Draft: 'border-amber-200 bg-amber-50 text-amber-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  Paused: 'border-orange-200 bg-orange-50 text-orange-700',
  Archived: 'border-slate-200 bg-slate-100 text-slate-600',
  Available: 'border-blue-200 bg-blue-50 text-blue-700',
  'Not Converted': 'border-slate-200 bg-slate-50 text-slate-600',
};

export const WebsiteStatusBadge: React.FC<{ status: WebsiteStatus }> = ({ status }) => (
  <Badge className={`border text-[11px] hover:bg-inherit ${tones[status] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>{status}</Badge>
);
