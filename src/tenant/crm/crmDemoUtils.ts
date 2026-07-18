import type { Customer, FollowUp, Lead, LeadStage } from '@/tenant/types';

export const CRM_TODAY = '2026-06-17';

export const leadStages: LeadStage[] = ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'];

export const qualificationOptions = ['Unqualified', 'Marketing Qualified', 'Sales Qualified', 'Proposal Ready', 'Won', 'Lost'] as const;
export const ratingOptions = ['Cold', 'Warm', 'Hot'] as const;
export const duplicateRiskOptions = ['Low', 'Medium', 'High'] as const;
export const captureMethods = ['Website form', 'Manual entry', 'Import', 'Email enquiry', 'WhatsApp', 'API lead'] as const;
export const ownerTeams = ['Inside Sales', 'Field Sales', 'Partner Sales', 'Customer Success'] as const;
export const territories = ['Bhubaneswar', 'Coastal Odisha', 'Western Odisha', 'North Odisha', 'Pan India'] as const;

export const campaignOptions = [
  'June Website Enquiries',
  'WhatsApp Retail Push',
  'Referral Partner Drive',
  'Google Ads ERP',
  'Clinic Automation Webinar',
  'Existing Customer Upsell',
] as const;

export const getLeadScore = (lead: Lead) => {
  if (typeof lead.score === 'number') return lead.score;
  const sourceBoost = ['Referral', 'Existing Customer', 'Website'].includes(lead.source) ? 16 : 8;
  const valueBoost = Math.min(24, Math.floor(lead.expectedValue / 25000));
  const activityBoost = lead.notes.length ? 10 : 4;
  return Math.min(98, 30 + sourceBoost + valueBoost + activityBoost + Math.floor(lead.probability / 4));
};

export const getLeadRating = (lead: Lead) => {
  if (lead.rating) return lead.rating;
  const score = getLeadScore(lead);
  if (score >= 78) return 'Hot';
  if (score >= 55) return 'Warm';
  return 'Cold';
};

export const getDuplicateRisk = (lead: Lead) => {
  if (lead.duplicateRisk) return lead.duplicateRisk;
  if (lead.phone.endsWith('0') || lead.email.includes('1@')) return 'High';
  if (lead.company.length % 3 === 0) return 'Medium';
  return 'Low';
};

export const getQualification = (lead: Lead) => {
  if (lead.qualificationStatus) return lead.qualificationStatus;
  if (lead.stage === 'Won') return 'Won';
  if (lead.stage === 'Lost') return 'Lost';
  if (['Quotation Sent', 'Negotiation'].includes(lead.stage)) return 'Proposal Ready';
  if (lead.probability >= 50) return 'Sales Qualified';
  if (lead.probability >= 30) return 'Marketing Qualified';
  return 'Unqualified';
};

export const getWeightedValue = (lead: Lead) => Math.round((lead.expectedValue * lead.probability) / 100);

export const getLeadAgeDays = (lead: Lead) => {
  const created = new Date(`${lead.createdAt}T00:00:00`);
  const today = new Date(`${CRM_TODAY}T00:00:00`);
  return Math.max(0, Math.round((today.getTime() - created.getTime()) / 86400000));
};

export const getLeadLastActivity = (lead: Lead, followUps: FollowUp[] = []) => {
  if (lead.lastActivityAt) return lead.lastActivityAt;
  const relatedFollowUps = followUps.filter((item) => item.leadId === lead.id).map((item) => item.date.slice(0, 10));
  return [lead.createdAt, ...lead.notes.map((note) => note.createdAt), ...relatedFollowUps].sort().at(-1) || lead.createdAt;
};

export const getNextActivity = (lead: Lead, followUps: FollowUp[] = []) => {
  const next = followUps
    .filter((item) => item.leadId === lead.id && !item.completed)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  return next ? `${next.title} · ${new Date(next.date).toLocaleDateString('en-IN')}` : `Follow-up · ${new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')}`;
};

export const scoreTone = (score: number) => {
  if (score >= 78) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 55) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export const ratingTone = (rating: string) => {
  if (rating === 'Hot') return 'bg-red-50 text-red-700 border-red-200';
  if (rating === 'Warm') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-blue-50 text-blue-700 border-blue-200';
};

export const riskTone = (risk: string) => {
  if (risk === 'High') return 'bg-red-50 text-red-700 border-red-200';
  if (risk === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

export const customerHealthTone = (customer: Customer) => {
  const score = customer.healthScore ?? 72;
  if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

export const countBy = <T extends string>(items: T[]) =>
  Object.entries(items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

export const sumBy = <T>(items: T[], getValue: (item: T) => number) =>
  items.reduce((sum, item) => sum + getValue(item), 0);

export const campaignMetrics = [
  { name: 'June Website Enquiries', channel: 'Website', leads: 86, conversion: 28, spend: 42000, revenue: 840000 },
  { name: 'WhatsApp Retail Push', channel: 'WhatsApp', leads: 44, conversion: 22, spend: 18000, revenue: 360000 },
  { name: 'Referral Partner Drive', channel: 'Referral', leads: 31, conversion: 39, spend: 12000, revenue: 510000 },
  { name: 'Google Ads ERP', channel: 'Google Ads', leads: 58, conversion: 18, spend: 65000, revenue: 620000 },
];

export const assignmentRules = [
  ['High-value ERP leads', 'Expected value above Rs 1,50,000', 'Route to Sales Manager'],
  ['WhatsApp enquiries', 'Source is WhatsApp', 'Route to Inside Sales within 15 minutes'],
  ['Existing customer upsell', 'Source is Existing Customer', 'Route to Customer Success'],
  ['Clinic or pharmacy leads', 'Industry matches healthcare retail', 'Route to Field Sales'],
];

export const scoringRules = [
  ['Referral source', '+18', 'Higher trust and close rate'],
  ['Budget above Rs 1,00,000', '+14', 'Enterprise buying intent'],
  ['Decision maker identified', '+12', 'Qualified stakeholder'],
  ['Follow-up overdue', '-10', 'Risk of cooling'],
];

export const duplicateRules = [
  ['Phone match', 'High', 'Exact mobile number already exists'],
  ['Email domain and company match', 'Medium', 'Likely duplicate account'],
  ['Same GST/tax identity', 'High', 'Block duplicate company conversion'],
];
