import type {
  LandingPage,
  WebsiteForm,
  WebsiteFormField,
  WebsiteFormStatus,
  WebsitePage,
  WebsitePageStatus,
  WebsiteStateShape,
  WebsiteSubmission,
} from '@/tenant/website/types';

export const WEBSITE_DEMO_TODAY = '2026-06-18';
export const WEBSITE_FIELD_TYPES: WebsiteFormField['type'][] = ['Text', 'Phone', 'Email', 'Select', 'Textarea', 'Date', 'File'];
export const WEBSITE_PAGE_STATUSES: WebsitePageStatus[] = ['Published', 'Draft'];
export const WEBSITE_FORM_STATUSES: WebsiteFormStatus[] = ['Active', 'Draft', 'Paused'];

const leadFields: WebsiteFormField[] = [
  { id: 'field-name', label: 'Visitor Name', type: 'Text', required: true },
  { id: 'field-phone', label: 'Phone', type: 'Phone', required: true },
  { id: 'field-email', label: 'Email', type: 'Email', required: true },
  { id: 'field-requirement', label: 'Requirement', type: 'Textarea', required: true },
  { id: 'field-business-type', label: 'Business Type', type: 'Select', required: false, options: ['Clinic', 'Gym', 'Distributor', 'Service Company', 'Pharmacy'] },
];

const demoForms: WebsiteForm[] = [
  {
    id: 'WF-1',
    name: 'Website Enquiry Form',
    fields: leadFields,
    requiredFields: ['Visitor Name', 'Phone', 'Email', 'Requirement'],
    submitAction: 'Create CRM Lead',
    crmLeadMapping: {
      visitorNameField: 'Visitor Name',
      phoneField: 'Phone',
      emailField: 'Email',
      requirementField: 'Requirement',
    },
    status: 'Active',
    createdBy: 'Bibhudutta Dash',
    lastUpdated: '2026-06-16',
    submissionsCount: 6,
  },
  {
    id: 'WF-2',
    name: 'Demo Booking Form',
    fields: [
      { id: 'field-demo-name', label: 'Full Name', type: 'Text', required: true },
      { id: 'field-demo-phone', label: 'Phone', type: 'Phone', required: true },
      { id: 'field-demo-email', label: 'Work Email', type: 'Email', required: true },
      { id: 'field-demo-date', label: 'Preferred Demo Date', type: 'Date', required: false },
      { id: 'field-demo-notes', label: 'Notes', type: 'Textarea', required: false },
    ],
    requiredFields: ['Full Name', 'Phone', 'Work Email'],
    submitAction: 'Create CRM Lead',
    crmLeadMapping: {
      visitorNameField: 'Full Name',
      phoneField: 'Phone',
      emailField: 'Work Email',
      requirementField: 'Notes',
    },
    status: 'Active',
    createdBy: 'Anita Das',
    lastUpdated: '2026-06-14',
    submissionsCount: 4,
  },
  {
    id: 'WF-3',
    name: 'Partner Interest Form',
    fields: [
      { id: 'field-partner-name', label: 'Partner Name', type: 'Text', required: true },
      { id: 'field-partner-phone', label: 'Phone', type: 'Phone', required: true },
      { id: 'field-partner-email', label: 'Email', type: 'Email', required: true },
      { id: 'field-partner-city', label: 'City', type: 'Text', required: false },
      { id: 'field-partner-file', label: 'Business Proof', type: 'File', required: false },
    ],
    requiredFields: ['Partner Name', 'Phone', 'Email'],
    submitAction: 'Email Notification',
    crmLeadMapping: {
      visitorNameField: 'Partner Name',
      phoneField: 'Phone',
      emailField: 'Email',
      requirementField: 'City',
    },
    status: 'Draft',
    createdBy: 'Priya Mishra',
    lastUpdated: '2026-06-11',
    submissionsCount: 0,
  },
];

const demoPages: WebsitePage[] = [
  {
    id: 'WP-1',
    title: 'Home',
    slug: '/',
    metaTitle: 'VumTech ERP for Growing Indian SMEs',
    metaDescription: 'CRM, billing, inventory, services, and HR workflows for small businesses.',
    sections: ['Hero with industry promise', 'Featured modules', 'Customer proof', 'Contact enquiry form'],
    status: 'Published',
    createdBy: 'Bibhudutta Dash',
    lastUpdated: '2026-06-15',
    views: 2850,
  },
  {
    id: 'WP-2',
    title: 'CRM for Service Companies',
    slug: '/crm-for-service-companies',
    metaTitle: 'CRM Software for Service Companies',
    metaDescription: 'Capture leads, manage service requests, and keep follow-ups on track.',
    sections: ['Problem statement', 'Pipeline screenshots', 'Field service CTA', 'FAQ'],
    status: 'Published',
    createdBy: 'Anita Das',
    lastUpdated: '2026-06-13',
    views: 980,
  },
  {
    id: 'WP-3',
    title: 'Pharmacy ERP Pack',
    slug: '/pharmacy-erp-pack',
    metaTitle: 'Pharmacy ERP Pack',
    metaDescription: 'Retail pharmacy stock, billing, and expiry tracking workflows.',
    sections: ['Industry hero', 'Inventory workflow', 'GST billing', 'Demo form'],
    status: 'Draft',
    createdBy: 'Priya Mishra',
    lastUpdated: '2026-06-17',
    views: 120,
  },
  {
    id: 'WP-4',
    title: 'Pricing',
    slug: '/pricing',
    metaTitle: 'VumTech ERP Pricing',
    metaDescription: 'Simple pricing for CRM, sales, finance, inventory, services, and HR modules.',
    sections: ['Plan comparison', 'Module add-ons', 'FAQ', 'Talk to sales'],
    status: 'Draft',
    createdBy: 'Bibhudutta Dash',
    lastUpdated: '2026-06-18',
    views: 0,
  },
];

const demoLandingPages: LandingPage[] = [
  {
    id: 'LP-1',
    name: 'June CRM Demo Campaign',
    campaign: 'Google Search - CRM Odisha',
    slug: '/lp/crm-demo-odisha',
    heroTitle: 'Book a CRM demo for your service team',
    ctaButton: 'Book free demo',
    formId: 'WF-2',
    formName: 'Demo Booking Form',
    status: 'Published',
    lastUpdated: '2026-06-16',
    views: 1260,
    conversions: 42,
  },
  {
    id: 'LP-2',
    name: 'Pharmacy ERP Offer',
    campaign: 'Facebook Pharmacy Pack',
    slug: '/lp/pharmacy-erp-offer',
    heroTitle: 'Control stock, billing, and expiry in one workspace',
    ctaButton: 'Get pharmacy setup quote',
    formId: 'WF-1',
    formName: 'Website Enquiry Form',
    status: 'Draft',
    lastUpdated: '2026-06-14',
    views: 430,
    conversions: 9,
  },
  {
    id: 'LP-3',
    name: 'Partner Launch Page',
    campaign: 'Channel Partner Pilot',
    slug: '/lp/partner-program',
    heroTitle: 'Become a VumTech implementation partner',
    ctaButton: 'Apply as partner',
    formId: 'WF-3',
    formName: 'Partner Interest Form',
    status: 'Paused',
    lastUpdated: '2026-06-10',
    views: 320,
    conversions: 0,
  },
];

const demoSubmissions: WebsiteSubmission[] = [
  {
    id: 'WS-1',
    formId: 'WF-1',
    formName: 'Website Enquiry Form',
    visitorName: 'Satyajit Medicals',
    phone: '+91 98765 42109',
    email: 'owner@satyajitmedicals.example',
    submittedAt: '2026-06-18T09:42:00',
    convertedToLead: false,
    sourcePage: '/pharmacy-erp-pack',
    values: { 'Visitor Name': 'Satyajit Medicals', Phone: '+91 98765 42109', Email: 'owner@satyajitmedicals.example', Requirement: 'Need pharmacy stock and expiry alerts', 'Business Type': 'Pharmacy' },
  },
  {
    id: 'WS-2',
    formId: 'WF-2',
    formName: 'Demo Booking Form',
    visitorName: 'Kalinga Fitness Studio',
    phone: '+91 98765 42110',
    email: 'admin@kalingafitness.example',
    submittedAt: '2026-06-18T08:20:00',
    convertedToLead: true,
    leadId: 'L-113',
    sourcePage: '/lp/crm-demo-odisha',
    values: { 'Full Name': 'Kalinga Fitness Studio', Phone: '+91 98765 42110', 'Work Email': 'admin@kalingafitness.example', 'Preferred Demo Date': '2026-06-21', Notes: 'Gym enquiry workflow and renewals' },
  },
  {
    id: 'WS-3',
    formId: 'WF-1',
    formName: 'Website Enquiry Form',
    visitorName: 'Rourkela Distributors',
    phone: '+91 98765 42111',
    email: 'ops@rourkeladistributors.example',
    submittedAt: '2026-06-17T18:05:00',
    convertedToLead: false,
    sourcePage: '/',
    values: { 'Visitor Name': 'Rourkela Distributors', Phone: '+91 98765 42111', Email: 'ops@rourkeladistributors.example', Requirement: 'Need inventory and purchase workflow', 'Business Type': 'Distributor' },
  },
  {
    id: 'WS-4',
    formId: 'WF-2',
    formName: 'Demo Booking Form',
    visitorName: 'CarePlus Clinic',
    phone: '+91 98765 42112',
    email: 'frontdesk@careplus.example',
    submittedAt: '2026-06-17T11:30:00',
    convertedToLead: true,
    leadId: 'L-118',
    sourcePage: '/lp/crm-demo-odisha',
    values: { 'Full Name': 'CarePlus Clinic', Phone: '+91 98765 42112', 'Work Email': 'frontdesk@careplus.example', 'Preferred Demo Date': '2026-06-20', Notes: 'Clinic enquiries and appointments' },
  },
];

export const createWebsiteInitialState = (): WebsiteStateShape => ({
  pages: demoPages,
  landingPages: demoLandingPages,
  forms: demoForms,
  submissions: demoSubmissions,
  themes: [
    { id: 'WT-1', name: 'Clean SaaS', palette: 'Indigo, teal, slate', primaryColor: '#4f46e5', buttonStyle: 'Solid rounded-sm', status: 'Active' },
    { id: 'WT-2', name: 'Healthcare Local', palette: 'Emerald, blue, white', primaryColor: '#059669', buttonStyle: 'Soft pill', status: 'Available' },
    { id: 'WT-3', name: 'Retail Starter', palette: 'Cyan, amber, charcoal', primaryColor: '#0891b2', buttonStyle: 'High contrast', status: 'Available' },
  ],
  seoSettings: {
    defaultMetaTitle: 'VumTech ERP - CRM, Billing, Inventory and Services',
    defaultMetaDescription: 'A practical ERP workspace for Indian SMEs to run sales, finance, stock, service, HR, and customer workflows.',
    canonicalDomain: 'https://vumtech.example',
    robotsIndex: true,
    sitemapEnabled: true,
  },
  websiteSettings: {
    domain: 'vumtech.example',
    sslStatus: 'Verified',
    contactEmail: 'hello@vumtech.example',
    analyticsPlaceholder: 'GA4 placeholder connected',
    cookieBannerEnabled: true,
  },
});

export const normalizeSlug = (slug: string) => {
  const cleaned = slug.trim().toLowerCase().replace(/[^a-z0-9/-]+/g, '-').replace(/-+/g, '-').replace(/\/+/g, '/');
  if (!cleaned || cleaned === '-') return '/untitled-page';
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
};

export const getWebsiteMetrics = (state: WebsiteStateShape) => {
  const pageViews = state.pages.reduce((sum, page) => sum + page.views, 0) + state.landingPages.reduce((sum, page) => sum + page.views, 0);
  const leadsCaptured = state.submissions.filter((submission) => submission.convertedToLead).length;
  return {
    publishedPages: state.pages.filter((page) => page.status === 'Published').length,
    draftPages: state.pages.filter((page) => page.status === 'Draft').length,
    formSubmissions: state.submissions.length,
    leadsCaptured,
    pageViews,
    conversionRate: pageViews ? Math.round((state.submissions.length / pageViews) * 10000) / 100 : 0,
  };
};

export const getFormConversionRows = (state: WebsiteStateShape) => state.forms.map((form) => {
  const submissions = state.submissions.filter((submission) => submission.formId === form.id);
  const converted = submissions.filter((submission) => submission.convertedToLead).length;
  return {
    form,
    submissions: submissions.length,
    converted,
    conversionRate: submissions.length ? Math.round((converted / submissions.length) * 100) : 0,
  };
});

export const createSampleSubmissionValues = (form: WebsiteForm) => {
  const seed = Date.now().toString().slice(-4);
  const values = form.fields.reduce<Record<string, string>>((acc, field) => {
    if (field.type === 'Phone') acc[field.label] = `+91 98765 ${seed.padStart(5, '0').slice(0, 5)}`;
    else if (field.type === 'Email') acc[field.label] = `visitor${seed}@example.in`;
    else if (field.type === 'Date') acc[field.label] = '2026-06-24';
    else if (field.type === 'Select') acc[field.label] = field.options?.[0] || 'General';
    else if (field.type === 'File') acc[field.label] = 'attachment-placeholder.pdf';
    else if (field.label.toLowerCase().includes('name')) acc[field.label] = `Website Visitor ${seed}`;
    else acc[field.label] = 'Interested in ERP demo and module pricing.';
    return acc;
  }, {});
  return values;
};
