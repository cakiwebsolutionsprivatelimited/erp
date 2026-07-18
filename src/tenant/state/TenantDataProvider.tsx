import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  demoApps,
  demoCrmAiInsights,
  demoCrmApprovals,
  demoCrmAuditLogs,
  demoCrmCampaigns,
  demoCompany,
  demoCrmCustomFields,
  demoCrmCommunications,
  demoCrmCompanies,
  demoCrmContacts,
  demoCrmDocuments,
  demoCrmIntegrations,
  demoCrmSegments,
  demoCrmSupportTickets,
  demoCrmWorkflows,
  demoCustomers,
  demoFollowUps,
  demoLeads,
  demoQuotations,
  demoSalesOrders,
  demoSalesProducts,
  demoSalesQuotations,
  demoSalesSubscriptions,
  demoSubscription,
  demoUsers,
} from '@/tenant/data/demoData';
import type { AppStatus, CompanyProfile, CrmAiInsight, CrmApprovalRequest, CrmAuditLog, CrmCampaign, CrmCommunication, CrmCompany, CrmContact, CrmCustomFieldDefinition, CrmDocument, CrmIntegration, CrmSegment, CrmSupportTicket, CrmWorkflow, Customer, FollowUp, Lead, LeadStage, SalesOrder, SalesQuotation, SalesQuotationStatus, SalesSubscription, Subscription, TenantApp, TenantUser } from '@/tenant/types';

interface LeadInput {
  name: string;
  company: string;
  industry: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  city?: string;
  state?: string;
  source: string;
  requirement?: string;
  assignedTo: string;
  expectedValue: number;
  probability: number;
  stage: LeadStage;
  nextFollowUpAt?: string;
  priority?: 'Low' | 'Medium' | 'High';
  tags?: string[];
  captureMethod?: string;
  sourceDetail?: string;
  campaign?: string;
  score?: number;
  rating?: 'Cold' | 'Warm' | 'Hot';
  duplicateRisk?: 'Low' | 'Medium' | 'High';
  routingReason?: string;
  qualificationStatus?: 'Unqualified' | 'Marketing Qualified' | 'Sales Qualified' | 'Proposal Ready' | 'Won' | 'Lost';
  budget?: string;
  ownerTeam?: string;
  territory?: string;
  customFields?: Record<string, string>;
  initialNote?: string;
}

interface TenantDataState {
  company: CompanyProfile;
  apps: TenantApp[];
  users: TenantUser[];
  subscription: Subscription;
  leads: Lead[];
  followUps: FollowUp[];
  customers: Customer[];
  crmCompanies: CrmCompany[];
  crmContacts: CrmContact[];
  crmCommunications: CrmCommunication[];
  crmCampaigns: CrmCampaign[];
  crmSupportTickets: CrmSupportTicket[];
  crmDocuments: CrmDocument[];
  crmSegments: CrmSegment[];
  crmWorkflows: CrmWorkflow[];
  crmApprovals: CrmApprovalRequest[];
  crmCustomFields: CrmCustomFieldDefinition[];
  crmAuditLogs: CrmAuditLog[];
  crmIntegrations: CrmIntegration[];
  crmAiInsights: CrmAiInsight[];
  quotations: typeof demoQuotations;
  salesProducts: typeof demoSalesProducts;
  salesQuotations: SalesQuotation[];
  salesOrders: SalesOrder[];
  salesSubscriptions: SalesSubscription[];
  recentAppSlugs: string[];
  roles: string[];
  recordAppOpen: (slug: string) => void;
  installApp: (slug: string) => void;
  updateCompany: (company: CompanyProfile) => void;
  toggleUserStatus: (id: string) => void;
  changeUserRole: (id: string, role: string) => void;
  addLead: (lead: LeadInput) => string;
  updateLead: (id: string, lead: LeadInput) => void;
  deleteLead: (id: string) => void;
  changeLeadStage: (id: string, stage: LeadStage) => void;
  addNote: (leadId: string, body: string) => void;
  addFollowUp: (leadId: string, title: string, date: string) => void;
  completeFollowUp: (id: string) => void;
  convertLeadToCustomer: (id: string) => void;
  createSalesQuotation: (quotation: Omit<SalesQuotation, 'id' | 'number' | 'createdAt'>) => string;
  updateSalesQuotation: (id: string, quotation: Omit<SalesQuotation, 'id' | 'number' | 'createdAt'>) => void;
  changeSalesQuotationStatus: (id: string, status: SalesQuotationStatus) => void;
  duplicateSalesQuotation: (id: string) => void;
  convertQuotationToSalesOrder: (id: string) => void;
  createSalesSubscription: (subscription: Omit<SalesSubscription, 'id' | 'subscriptionNumber'>) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'tenant-demo-state-v1';
const roles = ['Owner', 'Admin', 'Sales Manager', 'Sales Executive', 'Accountant', 'Inventory Manager', 'HR Manager', 'Support Staff'];

type StoredState = Pick<TenantDataState, 'company' | 'apps' | 'users' | 'subscription' | 'leads' | 'followUps' | 'customers' | 'crmCompanies' | 'crmContacts' | 'crmCommunications' | 'crmCampaigns' | 'crmSupportTickets' | 'crmDocuments' | 'crmSegments' | 'crmWorkflows' | 'crmApprovals' | 'crmCustomFields' | 'crmAuditLogs' | 'crmIntegrations' | 'crmAiInsights' | 'quotations' | 'salesProducts' | 'salesQuotations' | 'salesOrders' | 'salesSubscriptions' | 'recentAppSlugs'>;

const initialState: StoredState = {
  company: demoCompany,
  apps: demoApps,
  users: demoUsers,
  subscription: demoSubscription,
  leads: demoLeads,
  followUps: demoFollowUps,
  customers: demoCustomers,
  crmCompanies: demoCrmCompanies,
  crmContacts: demoCrmContacts,
  crmCommunications: demoCrmCommunications,
  crmCampaigns: demoCrmCampaigns,
  crmSupportTickets: demoCrmSupportTickets,
  crmDocuments: demoCrmDocuments,
  crmSegments: demoCrmSegments,
  crmWorkflows: demoCrmWorkflows,
  crmApprovals: demoCrmApprovals,
  crmCustomFields: demoCrmCustomFields,
  crmAuditLogs: demoCrmAuditLogs,
  crmIntegrations: demoCrmIntegrations,
  crmAiInsights: demoCrmAiInsights,
  quotations: demoQuotations,
  salesProducts: demoSalesProducts,
  salesQuotations: demoSalesQuotations,
  salesOrders: demoSalesOrders,
  salesSubscriptions: demoSalesSubscriptions,
  recentAppSlugs: ['crm', 'sales', 'billing'],
};

const mergeCurrentAppDefinitions = (apps: TenantApp[]) =>
  demoApps.map((currentApp) => {
    const storedApp = apps.find((app) => app.slug === currentApp.slug);
    const hasCompletedTenantRoute = (currentApp.category === 'HR' && currentApp.route?.startsWith('/hr/')) ||
      (currentApp.category === 'Inventory' && currentApp.route?.startsWith('/inventory/')) ||
      (currentApp.category === 'Finance' && currentApp.route?.startsWith('/finance/'));
    const status = hasCompletedTenantRoute
      ? storedApp?.status === 'installed' || currentApp.status === 'installed'
        ? 'installed'
        : currentApp.status
      : storedApp?.status ?? currentApp.status;
    return storedApp
      ? {
          ...currentApp,
          status,
          metric: storedApp.metric ?? currentApp.metric,
        }
      : currentApp;
  });

const readInitialState = (): StoredState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState;

    const parsed = { ...initialState, ...JSON.parse(stored) } as StoredState;
    return {
      ...parsed,
      apps: mergeCurrentAppDefinitions(parsed.apps),
    };
  } catch {
    return initialState;
  }
};

const TenantDataContext = createContext<TenantDataState | null>(null);

export const TenantDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoredState>(readInitialState);

  const persist = (next: StoredState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<TenantDataState>(() => ({
    ...state,
    roles,
    recordAppOpen: (slug) => {
      persist({
        ...state,
        recentAppSlugs: [slug, ...state.recentAppSlugs.filter((item) => item !== slug)].slice(0, 6),
      });
    },
    installApp: (slug) => {
      persist({
        ...state,
        apps: state.apps.map((app) =>
          app.slug === slug ? { ...app, status: 'installed' as AppStatus, route: app.route ?? `/placeholder/${app.slug}` } : app
        ),
        recentAppSlugs: [slug, ...state.recentAppSlugs.filter((item) => item !== slug)].slice(0, 6),
      });
    },
    updateCompany: (company) => persist({ ...state, company }),
    toggleUserStatus: (id) => {
      persist({
        ...state,
        users: state.users.map((user) =>
          user.id === id ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
        ),
      });
    },
    changeUserRole: (id, role) => {
      persist({ ...state, users: state.users.map((user) => (user.id === id ? { ...user, role } : user)) });
    },
    addLead: (leadInput) => {
      const id = `L-${Date.now()}`;
      const newLead: Lead = {
        ...leadInput,
        id,
        status: leadInput.stage === 'Won' ? 'won' : leadInput.stage === 'Lost' ? 'lost' : 'open',
        nextFollowUpAt: leadInput.nextFollowUpAt || new Date().toISOString(),
        notes: leadInput.initialNote
          ? [{ id: `N-${Date.now()}`, body: leadInput.initialNote, author: 'Demo User', createdAt: new Date().toISOString().slice(0, 10) }]
          : [],
        createdAt: new Date().toISOString().slice(0, 10),
      };
      persist({ ...state, leads: [newLead, ...state.leads] });
      return id;
    },
    updateLead: (id, leadInput) => {
      persist({
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                ...leadInput,
                status: leadInput.stage === 'Won' ? 'won' : leadInput.stage === 'Lost' ? 'lost' : 'open',
              }
            : lead
        ),
      });
    },
    deleteLead: (id) => {
      persist({
        ...state,
        leads: state.leads.filter((lead) => lead.id !== id),
        followUps: state.followUps.filter((followUp) => followUp.leadId !== id),
      });
    },
    changeLeadStage: (id, stage) => {
      persist({
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === id ? { ...lead, stage, status: stage === 'Won' ? 'won' : stage === 'Lost' ? 'lost' : 'open' } : lead
        ),
      });
    },
    addNote: (leadId, body) => {
      persist({
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                notes: [
                  { id: `N-${Date.now()}`, body, author: 'Demo User', createdAt: new Date().toISOString().slice(0, 10) },
                  ...lead.notes,
                ],
              }
            : lead
        ),
      });
    },
    addFollowUp: (leadId, title, date) => {
      persist({
        ...state,
        followUps: [
          { id: `F-${Date.now()}`, leadId, title, date, owner: 'Demo User', completed: false },
          ...state.followUps,
        ],
      });
    },
    completeFollowUp: (id) => {
      persist({
        ...state,
        followUps: state.followUps.map((followUp) =>
          followUp.id === id ? { ...followUp, completed: true } : followUp
        ),
      });
    },
    convertLeadToCustomer: (id) => {
      const lead = state.leads.find((item) => item.id === id);
      if (!lead) return;
      const today = new Date().toISOString().slice(0, 10);
      const existingCustomer = state.customers.find((customer) => customer.email === lead.email || customer.company === lead.company);
      const existingCompany = state.crmCompanies.find((company) => company.name === lead.company || company.email === lead.email);
      const companyId = existingCompany?.id || `CO-${Date.now()}`;
      const customerId = existingCustomer?.id || `C-${Date.now()}`;
      const hasContact = state.crmContacts.some((contact) => contact.email === lead.email || contact.phone === lead.phone);
      const nextCompanies = existingCompany
        ? state.crmCompanies.map((company) =>
            company.id === existingCompany.id
              ? {
                  ...company,
                  lifecycleStatus: 'Customer' as const,
                  customerId,
                  lastActivityAt: today,
                  totalPipelineValue: Math.max(company.totalPipelineValue, lead.expectedValue),
                  openOpportunities: Math.max(company.openOpportunities, 1),
                }
              : company
          )
        : [
            {
              id: companyId,
              name: lead.company,
              legalName: `${lead.company} Pvt. Ltd.`,
              displayName: lead.company,
              industry: lead.industry,
              employeeSize: '11-50',
              annualRevenueBand: lead.budget || 'Rs 25L - Rs 1Cr',
              phone: lead.phone,
              email: lead.email,
              website: `https://${lead.company.toLowerCase().replace(/\s+/g, '')}.example`,
              address: `${lead.city || 'Bhubaneswar'} business address`,
              city: lead.city || 'Bhubaneswar',
              state: lead.state || 'Odisha',
              owner: lead.assignedTo,
              lifecycleStatus: 'Customer' as const,
              healthScore: 72,
              accountHealth: 'Healthy' as const,
              tags: [lead.industry, 'Converted'],
              lastActivityAt: today,
              openOpportunities: 1,
              totalPipelineValue: lead.expectedValue,
              customerId,
            },
            ...state.crmCompanies,
          ];
      const nextContacts = hasContact
        ? state.crmContacts
        : [
            {
              id: `CT-${Date.now()}`,
              companyId,
              customerId,
              name: lead.name,
              title: lead.customFields?.['Decision role'] || 'Primary contact',
              department: 'Management',
              phone: lead.phone,
              email: lead.email,
              decisionRole: 'Decision Maker' as const,
              preferredChannel: lead.source === 'WhatsApp' ? 'WhatsApp' as const : 'Phone' as const,
              emailConsent: true,
              whatsappConsent: lead.source === 'WhatsApp',
              smsConsent: false,
              owner: lead.assignedTo,
              lifecycleStatus: 'Active' as const,
              lastActivityAt: today,
              tags: [lead.industry, 'Converted'],
              isPrimary: true,
            },
            ...state.crmContacts,
          ];

      persist({
        ...state,
        leads: state.leads.map((item) => (item.id === id ? { ...item, stage: 'Won', status: 'won' } : item)),
        crmCompanies: nextCompanies,
        crmContacts: nextContacts,
        customers: existingCustomer
          ? state.customers.map((customer) =>
              customer.id === existingCustomer.id
                ? { ...customer, value: Math.max(customer.value, lead.expectedValue), lastContactAt: today, status: 'active' }
                : customer
            )
          : [
              {
                id: customerId,
                name: lead.name,
                company: lead.company,
                phone: lead.phone,
                email: lead.email,
                city: lead.city,
                industry: lead.industry,
                value: lead.expectedValue,
                since: today,
                lastContactAt: today,
                owner: lead.assignedTo,
                status: 'active',
                healthScore: 72,
                openOpportunities: 1,
                renewalDate: '2026-09-15',
                lifecycleStage: 'New Customer',
                accountHealth: 'Healthy',
                ticketsOpen: 0,
                documentsCount: 1,
                communicationCount: 1,
              },
              ...state.customers,
            ],
      });
    },
    createSalesQuotation: (quotation) => {
      const id = `SQ-${Date.now()}`;
      const number = `QT-2026-${String(state.salesQuotations.length + 1).padStart(3, '0')}`;
      persist({
        ...state,
        salesQuotations: [{ ...quotation, id, number, createdAt: new Date().toISOString().slice(0, 10) }, ...state.salesQuotations],
      });
      return id;
    },
    updateSalesQuotation: (id, quotation) => {
      persist({
        ...state,
        salesQuotations: state.salesQuotations.map((item) =>
          item.id === id ? { ...item, ...quotation } : item
        ),
      });
    },
    changeSalesQuotationStatus: (id, status) => {
      persist({
        ...state,
        salesQuotations: state.salesQuotations.map((item) => item.id === id ? { ...item, status } : item),
      });
    },
    duplicateSalesQuotation: (id) => {
      const quotation = state.salesQuotations.find((item) => item.id === id);
      if (!quotation) return;
      const nextId = `SQ-${Date.now()}`;
      persist({
        ...state,
        salesQuotations: [
          {
            ...quotation,
            id: nextId,
            number: `QT-2026-${String(state.salesQuotations.length + 1).padStart(3, '0')}`,
            status: 'Draft',
            createdAt: new Date().toISOString().slice(0, 10),
          },
          ...state.salesQuotations,
        ],
      });
    },
    convertQuotationToSalesOrder: (id) => {
      const quotation = state.salesQuotations.find((item) => item.id === id);
      if (!quotation || state.salesOrders.some((order) => order.quotationNumber === quotation.number)) return;
      const amount = quotation.items.reduce((sum, item) => {
        const line = item.quantity * item.unitPrice - item.discount;
        return sum + line + (line * item.gstRate) / 100;
      }, 0);
      persist({
        ...state,
        salesQuotations: state.salesQuotations.map((item) => item.id === id ? { ...item, status: 'Converted to Order' } : item),
        salesOrders: [
          {
            id: `SO-${Date.now()}`,
            orderNumber: `SO-2026-${String(state.salesOrders.length + 1).padStart(3, '0')}`,
            customerName: quotation.customerName,
            quotationNumber: quotation.number,
            orderDate: new Date().toISOString().slice(0, 10),
            deliveryDate: '2026-06-30',
            amount,
            status: 'Confirmed',
          },
          ...state.salesOrders,
        ],
      });
    },
    createSalesSubscription: (subscription) => {
      persist({
        ...state,
        salesSubscriptions: [
          {
            ...subscription,
            id: `SS-${Date.now()}`,
            subscriptionNumber: `SUB-2026-${String(state.salesSubscriptions.length + 1).padStart(3, '0')}`,
          },
          ...state.salesSubscriptions,
        ],
      });
    },
    resetDemoData: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    },
  }), [state]);

  return <TenantDataContext.Provider value={value}>{children}</TenantDataContext.Provider>;
};

export const useTenantData = () => {
  const context = useContext(TenantDataContext);
  if (!context) {
    throw new Error('useTenantData must be used inside TenantDataProvider');
  }
  return context;
};
