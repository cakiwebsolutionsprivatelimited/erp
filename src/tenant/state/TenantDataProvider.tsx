import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  demoApps,
  demoCompany,
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
import type { AppStatus, CompanyProfile, Customer, FollowUp, Lead, LeadStage, SalesOrder, SalesQuotation, SalesQuotationStatus, SalesSubscription, Subscription, TenantApp, TenantUser } from '@/tenant/types';

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

type StoredState = Pick<TenantDataState, 'company' | 'apps' | 'users' | 'subscription' | 'leads' | 'followUps' | 'customers' | 'quotations' | 'salesProducts' | 'salesQuotations' | 'salesOrders' | 'salesSubscriptions' | 'recentAppSlugs'>;

const initialState: StoredState = {
  company: demoCompany,
  apps: demoApps,
  users: demoUsers,
  subscription: demoSubscription,
  leads: demoLeads,
  followUps: demoFollowUps,
  customers: demoCustomers,
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
    return storedApp
      ? {
          ...currentApp,
          status: storedApp.status,
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
      if (!lead || state.customers.some((customer) => customer.email === lead.email)) return;

      persist({
        ...state,
        leads: state.leads.map((item) => (item.id === id ? { ...item, stage: 'Won', status: 'won' } : item)),
        customers: [
          {
            id: `C-${Date.now()}`,
            name: lead.name,
            company: lead.company,
            phone: lead.phone,
            email: lead.email,
            city: lead.city,
            industry: lead.industry,
            value: lead.expectedValue,
            since: new Date().toISOString().slice(0, 10),
            lastContactAt: new Date().toISOString().slice(0, 10),
            owner: lead.assignedTo,
            status: 'active',
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
