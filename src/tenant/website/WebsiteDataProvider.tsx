import React, { createContext, useContext, useMemo, useState } from 'react';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import {
  WEBSITE_DEMO_TODAY,
  createSampleSubmissionValues,
  createWebsiteInitialState,
  normalizeSlug,
} from '@/tenant/website/websiteDemoService';
import type {
  LandingPage,
  LandingPageDraft,
  LandingPageStatus,
  WebsiteForm,
  WebsiteFormDraft,
  WebsiteFormStatus,
  WebsitePage,
  WebsitePageDraft,
  WebsitePageStatus,
  WebsiteSeoSettings,
  WebsiteSettings,
  WebsiteStateShape,
  WebsiteSubmission,
  WebsiteSubmissionDraft,
} from '@/tenant/website/types';

interface WebsiteDataState extends WebsiteStateShape {
  createPage: (draft: WebsitePageDraft) => string;
  updatePageStatus: (id: string, status: WebsitePageStatus) => void;
  createLandingPage: (draft: LandingPageDraft) => string;
  updateLandingPageStatus: (id: string, status: LandingPageStatus) => void;
  createForm: (draft: WebsiteFormDraft) => string;
  updateFormStatus: (id: string, status: WebsiteFormStatus) => void;
  createSubmission: (draft: WebsiteSubmissionDraft) => string;
  addSampleSubmission: (formId: string) => string;
  convertSubmissionToLead: (id: string) => string;
  setActiveTheme: (id: string) => void;
  updateSeoSettings: (settings: WebsiteSeoSettings) => void;
  updateWebsiteSettings: (settings: WebsiteSettings) => void;
  resetWebsiteData: () => void;
}

const STORAGE_KEY = 'website-demo-state-v1';
const initialState = createWebsiteInitialState();

const readInitialState = (): WebsiteStateShape => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialState, ...JSON.parse(stored) } : initialState;
  } catch {
    return initialState;
  }
};

const WebsiteDataContext = createContext<WebsiteDataState | null>(null);

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WebsiteStateShape>(readInitialState);
  const { addLead } = useTenantData();

  const persist = (next: WebsiteStateShape) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<WebsiteDataState>(() => ({
    ...state,
    createPage: (draft) => {
      const id = `WP-${Date.now()}`;
      const page: WebsitePage = {
        ...draft,
        id,
        slug: normalizeSlug(draft.slug),
        createdBy: 'Demo User',
        lastUpdated: WEBSITE_DEMO_TODAY,
        views: draft.status === 'Published' ? 0 : 0,
      };
      persist({ ...state, pages: [page, ...state.pages] });
      return id;
    },
    updatePageStatus: (id, status) => persist({
      ...state,
      pages: state.pages.map((page) => page.id === id ? { ...page, status, lastUpdated: WEBSITE_DEMO_TODAY } : page),
    }),
    createLandingPage: (draft) => {
      const form = state.forms.find((item) => item.id === draft.formId);
      const id = `LP-${Date.now()}`;
      const page: LandingPage = {
        ...draft,
        id,
        slug: normalizeSlug(draft.slug),
        formName: form?.name || 'No form attached',
        lastUpdated: WEBSITE_DEMO_TODAY,
        views: 0,
        conversions: 0,
      };
      persist({ ...state, landingPages: [page, ...state.landingPages] });
      return id;
    },
    updateLandingPageStatus: (id, status) => persist({
      ...state,
      landingPages: state.landingPages.map((page) => page.id === id ? { ...page, status, lastUpdated: WEBSITE_DEMO_TODAY } : page),
    }),
    createForm: (draft) => {
      const id = `WF-${Date.now()}`;
      const form: WebsiteForm = {
        ...draft,
        id,
        requiredFields: draft.fields.filter((field) => field.required).map((field) => field.label),
        createdBy: 'Demo User',
        lastUpdated: WEBSITE_DEMO_TODAY,
        submissionsCount: 0,
      };
      persist({ ...state, forms: [form, ...state.forms] });
      return id;
    },
    updateFormStatus: (id, status) => persist({
      ...state,
      forms: state.forms.map((form) => form.id === id ? { ...form, status, lastUpdated: WEBSITE_DEMO_TODAY } : form),
    }),
    createSubmission: (draft) => {
      const form = state.forms.find((item) => item.id === draft.formId);
      const id = `WS-${Date.now()}`;
      const submission: WebsiteSubmission = {
        ...draft,
        id,
        formName: form?.name || 'Unknown form',
        submittedAt: new Date().toISOString(),
        convertedToLead: false,
      };
      persist({
        ...state,
        forms: state.forms.map((item) => item.id === draft.formId ? { ...item, submissionsCount: item.submissionsCount + 1 } : item),
        submissions: [submission, ...state.submissions],
      });
      return id;
    },
    addSampleSubmission: (formId) => {
      const form = state.forms.find((item) => item.id === formId);
      if (!form) return '';
      const values = createSampleSubmissionValues(form);
      const name = values[form.crmLeadMapping.visitorNameField] || values[form.fields.find((field) => field.label.toLowerCase().includes('name'))?.label || ''] || 'Website Visitor';
      const phone = values[form.crmLeadMapping.phoneField] || values[form.fields.find((field) => field.type === 'Phone')?.label || ''] || '+91 98765 00000';
      const email = values[form.crmLeadMapping.emailField] || values[form.fields.find((field) => field.type === 'Email')?.label || ''] || 'visitor@example.in';
      const id = `WS-${Date.now()}`;
      const submission: WebsiteSubmission = {
        id,
        formId,
        formName: form.name,
        visitorName: name,
        phone,
        email,
        submittedAt: new Date().toISOString(),
        convertedToLead: false,
        sourcePage: '/preview/demo-form',
        values,
      };
      persist({
        ...state,
        forms: state.forms.map((item) => item.id === formId ? { ...item, submissionsCount: item.submissionsCount + 1 } : item),
        submissions: [submission, ...state.submissions],
      });
      return id;
    },
    convertSubmissionToLead: (id) => {
      const submission = state.submissions.find((item) => item.id === id);
      if (!submission) return '';
      if (submission.convertedToLead) return submission.leadId || '';
      const form = state.forms.find((item) => item.id === submission.formId);
      const mapping = form?.crmLeadMapping;
      const requirement = mapping ? submission.values[mapping.requirementField] : undefined;
      const leadId = addLead({
        name: submission.visitorName,
        company: submission.visitorName,
        industry: submission.values['Business Type'] || 'Website Enquiry',
        phone: submission.phone,
        email: submission.email,
        city: 'Bhubaneswar',
        state: 'Odisha',
        source: 'Website Form',
        requirement: requirement || `Submitted ${submission.formName} from ${submission.sourcePage}`,
        assignedTo: 'Anita Das',
        expectedValue: 45000,
        probability: 25,
        stage: 'New',
        nextFollowUpAt: `${WEBSITE_DEMO_TODAY}T16:00:00`,
        priority: 'Medium',
        tags: ['Website', submission.formName],
        initialNote: `Converted from website submission ${submission.id}. Source page: ${submission.sourcePage}.`,
      });
      persist({
        ...state,
        submissions: state.submissions.map((item) => item.id === id ? { ...item, convertedToLead: true, leadId } : item),
        landingPages: state.landingPages.map((page) => page.slug === submission.sourcePage ? { ...page, conversions: page.conversions + 1 } : page),
      });
      return leadId;
    },
    setActiveTheme: (id) => persist({
      ...state,
      themes: state.themes.map((theme) => ({ ...theme, status: theme.id === id ? 'Active' : 'Available' })),
    }),
    updateSeoSettings: (settings) => persist({ ...state, seoSettings: settings }),
    updateWebsiteSettings: (settings) => persist({ ...state, websiteSettings: settings }),
    resetWebsiteData: () => persist(createWebsiteInitialState()),
  }), [addLead, state]);

  return <WebsiteDataContext.Provider value={value}>{children}</WebsiteDataContext.Provider>;
};

export const useWebsiteData = () => {
  const context = useContext(WebsiteDataContext);
  if (!context) throw new Error('useWebsiteData must be used within WebsiteDataProvider');
  return context;
};
