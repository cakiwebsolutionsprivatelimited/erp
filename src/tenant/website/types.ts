export type WebsitePageStatus = 'Published' | 'Draft';
export type LandingPageStatus = 'Published' | 'Draft' | 'Paused' | 'Archived';
export type WebsiteFormStatus = 'Active' | 'Draft' | 'Paused';
export type WebsiteSubmitAction = 'Create CRM Lead' | 'Email Notification' | 'Save Submission';
export type WebsiteFieldType = 'Text' | 'Phone' | 'Email' | 'Select' | 'Textarea' | 'Date' | 'File';

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  sections: string[];
  status: WebsitePageStatus;
  createdBy: string;
  lastUpdated: string;
  views: number;
}

export type WebsitePageDraft = Pick<WebsitePage, 'title' | 'slug' | 'metaTitle' | 'metaDescription' | 'sections' | 'status'>;

export interface LandingPage {
  id: string;
  name: string;
  campaign: string;
  slug: string;
  heroTitle: string;
  ctaButton: string;
  formId: string;
  formName: string;
  status: LandingPageStatus;
  lastUpdated: string;
  views: number;
  conversions: number;
}

export type LandingPageDraft = Pick<LandingPage, 'name' | 'campaign' | 'slug' | 'heroTitle' | 'ctaButton' | 'formId' | 'status'>;

export interface WebsiteFormField {
  id: string;
  label: string;
  type: WebsiteFieldType;
  required: boolean;
  options?: string[];
}

export interface WebsiteLeadMapping {
  visitorNameField: string;
  phoneField: string;
  emailField: string;
  requirementField: string;
}

export interface WebsiteForm {
  id: string;
  name: string;
  fields: WebsiteFormField[];
  requiredFields: string[];
  submitAction: WebsiteSubmitAction;
  crmLeadMapping: WebsiteLeadMapping;
  status: WebsiteFormStatus;
  createdBy: string;
  lastUpdated: string;
  submissionsCount: number;
}

export type WebsiteFormDraft = Pick<WebsiteForm, 'name' | 'fields' | 'submitAction' | 'crmLeadMapping' | 'status'>;

export interface WebsiteSubmission {
  id: string;
  formId: string;
  formName: string;
  visitorName: string;
  phone: string;
  email: string;
  submittedAt: string;
  convertedToLead: boolean;
  leadId?: string;
  sourcePage: string;
  values: Record<string, string>;
}

export type WebsiteSubmissionDraft = Pick<WebsiteSubmission, 'formId' | 'visitorName' | 'phone' | 'email' | 'sourcePage' | 'values'>;

export interface WebsiteTheme {
  id: string;
  name: string;
  palette: string;
  primaryColor: string;
  buttonStyle: string;
  status: 'Active' | 'Available';
}

export interface WebsiteSeoSettings {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  canonicalDomain: string;
  robotsIndex: boolean;
  sitemapEnabled: boolean;
}

export interface WebsiteSettings {
  domain: string;
  sslStatus: 'Verified' | 'Pending';
  contactEmail: string;
  analyticsPlaceholder: string;
  cookieBannerEnabled: boolean;
}

export interface WebsiteStateShape {
  pages: WebsitePage[];
  landingPages: LandingPage[];
  forms: WebsiteForm[];
  submissions: WebsiteSubmission[];
  themes: WebsiteTheme[];
  seoSettings: WebsiteSeoSettings;
  websiteSettings: WebsiteSettings;
}
