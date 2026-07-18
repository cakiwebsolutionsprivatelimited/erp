import type { CompanyProfile, CrmAiInsight, CrmApprovalRequest, CrmAuditLog, CrmCampaign, CrmCommunication, CrmCompany, CrmContact, CrmCustomFieldDefinition, CrmDocument, CrmIntegration, CrmSegment, CrmSupportTicket, CrmWorkflow, Customer, FollowUp, Lead, Quotation, SalesOrder, SalesProduct, SalesQuotation, SalesSubscription, Subscription, TenantApp, TenantUser } from '@/tenant/types';
import { campaignOptions, captureMethods, duplicateRiskOptions, ownerTeams, qualificationOptions, ratingOptions, territories } from '@/tenant/crm/crmDemoUtils';

export const demoCompany: CompanyProfile = {
  name: 'VumTech Solutions Pvt. Ltd.',
  businessType: 'IT Services and Business Automation',
  gstNumber: '21ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  phone: '+91 674 401 2233',
  email: 'hello@vumtech.example',
  website: 'https://vumtech.example',
  address: 'Plot 42, Infocity Road, Patia',
  city: 'Bhubaneswar',
  state: 'Odisha',
  country: 'India',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
};

export const demoApps: TenantApp[] = [
  { slug: 'crm', name: 'CRM', category: 'Sales', status: 'installed', plan: 'Starter', route: '/crm/dashboard', metric: '30 leads', description: 'Manage leads, follow-ups, customers, and pipeline.' },
  { slug: 'sales', name: 'Sales', category: 'Sales', status: 'installed', plan: 'Starter', route: '/sales/dashboard', metric: '12 orders', description: 'Create proposals, sales orders, and customer commitments.' },
  { slug: 'quotations', name: 'Quotations', category: 'Sales', status: 'available', plan: 'Starter', route: '/sales/quotations', description: 'Prepare branded estimates and approval-ready quotes.' },
  { slug: 'subscriptions', name: 'Subscriptions', category: 'Sales', status: 'locked', plan: 'Business', route: '/sales/subscriptions', description: 'Manage recurring contracts, renewals, and billing cycles.' },
  { slug: 'billing', name: 'Billing', category: 'Finance', status: 'installed', plan: 'Starter', route: '/finance/invoices', metric: '15 invoices', description: 'Create invoices, receipts, and payment reminders.' },
  { slug: 'gst-invoicing', name: 'GST Invoicing', category: 'Finance', status: 'installed', plan: 'Starter', route: '/finance/invoices/new', metric: 'GST ready', description: 'Generate GST-ready invoices for Indian SMEs.' },
  { slug: 'accounts', name: 'Accounts', category: 'Finance', status: 'installed', plan: 'Business', route: '/finance/accounting', metric: '5 journals', description: 'Track chart of accounts, journals, ledgers, and finance reports.' },
  { slug: 'expenses', name: 'Expenses', category: 'Finance', status: 'installed', plan: 'Starter', route: '/finance/expenses', metric: '12 entries', description: 'Record reimbursements, vendor spends, and approvals.' },
  { slug: 'products', name: 'Products', category: 'Inventory', status: 'available', plan: 'Starter', route: '/inventory/products', description: 'Maintain product catalogues, rates, taxes, and units.' },
  { slug: 'stock', name: 'Stock', category: 'Inventory', status: 'available', plan: 'Business', route: '/inventory/stock', description: 'Track item movement, availability, and reorder points.' },
  { slug: 'purchase', name: 'Purchase', category: 'Inventory', status: 'available', plan: 'Starter', route: '/inventory/purchase', description: 'Create purchase orders and manage supplier pipelines.' },
  { slug: 'warehouse', name: 'Warehouse', category: 'Inventory', status: 'available', plan: 'Business', route: '/inventory/warehouses', description: 'Manage warehouses, bins, transfers, and fulfilment.' },
  { slug: 'projects', name: 'Projects', category: 'Services', status: 'available', plan: 'Starter', route: '/services/projects', description: 'Plan client projects, milestones, and delivery tasks.' },
  { slug: 'tasks', name: 'Tasks', category: 'Services', status: 'available', plan: 'Starter', route: '/services/tasks', description: 'Assign work, monitor progress, and clear blockers.' },
  { slug: 'helpdesk', name: 'Helpdesk', category: 'Services', status: 'available', plan: 'Starter', route: '/services/helpdesk', description: 'Manage tickets, complaints, and service requests.' },
  { slug: 'field-service', name: 'Field Service', category: 'Services', status: 'available', plan: 'Business', route: '/services/field-service', description: 'Schedule visits, technicians, and customer sign-offs.' },
  { slug: 'hr', name: 'HR', category: 'HR', status: 'installed', plan: 'Starter', route: '/hr/dashboard', metric: '8 employees', description: 'Open the HR workspace for employees, attendance, leave, payroll, and reports.' },
  { slug: 'employees', name: 'Employees', category: 'HR', status: 'available', plan: 'Starter', route: '/hr/employees', description: 'Maintain employee records, documents, and teams.' },
  { slug: 'recruitment', name: 'Recruitment', category: 'HR', status: 'available', plan: 'Business', route: '/hr/recruitment', description: 'Manage job requisitions, candidates, interviews, offers, and hiring handoff.' },
  { slug: 'onboarding', name: 'Onboarding', category: 'HR', status: 'available', plan: 'Starter', route: '/hr/onboarding', description: 'Track joining tasks, probation confirmations, and offboarding clearances.' },
  { slug: 'attendance', name: 'Attendance', category: 'HR', status: 'available', plan: 'Starter', route: '/hr/attendance', description: 'Track attendance, shifts, and late marks.' },
  { slug: 'hr-shifts', name: 'Shifts & Roster', category: 'HR', status: 'available', plan: 'Starter', route: '/hr/shifts', description: 'Manage shift groups, branch rosters, grace rules, and coverage.' },
  { slug: 'leave', name: 'Leave', category: 'HR', status: 'available', plan: 'Starter', route: '/hr/leave', description: 'Manage leave requests, balances, and approvals.' },
  { slug: 'payroll', name: 'Payroll', category: 'HR', status: 'available', plan: 'Business', route: '/hr/payroll', description: 'Prepare salaries, deductions, payslips, and statutory reports.' },
  { slug: 'performance', name: 'Performance', category: 'HR', status: 'available', plan: 'Business', route: '/hr/performance', description: 'Run goals, reviews, ratings, feedback, and team performance checks.' },
  { slug: 'self-service', name: 'Self Service', category: 'HR', status: 'available', plan: 'Starter', route: '/hr/self-service', description: 'Employee leave, attendance corrections, payslips, documents, and manager approvals.' },
  { slug: 'hr-departments', name: 'HR Departments', category: 'HR', status: 'available', plan: 'Starter', route: '/hr/departments', description: 'Review departments, designations, locations, headcount, and budgets.' },
  { slug: 'hr-documents', name: 'HR Documents', category: 'HR', status: 'available', plan: 'Starter', route: '/hr/documents', description: 'Manage employee files, generated letters, requests, and expiry review.' },
  { slug: 'assets', name: 'Assets', category: 'HR', status: 'available', plan: 'Business', route: '/hr/assets', description: 'Track laptops, phones, ID cards, field kits, assignments, and returns.' },
  { slug: 'hr-reports', name: 'HR Reports', category: 'HR', status: 'available', plan: 'Business', route: '/hr/reports', description: 'Analyze headcount, attendance, leave, payroll, and branch distribution.' },
  { slug: 'hr-settings', name: 'HR Settings', category: 'HR', status: 'available', plan: 'Business', route: '/hr/settings', description: 'Configure company HR setup, policies, payroll calendar, roles, and audit logs.' },
  { slug: 'website-builder', name: 'Website Builder', category: 'Website', status: 'available', plan: 'Starter', route: '/website/pages', description: 'Build customer pages and enquiry capture flows.' },
  { slug: 'landing-pages', name: 'Landing Pages', category: 'Website', status: 'available', plan: 'Starter', route: '/website/landing-pages', description: 'Launch campaign pages for offers and services.' },
  { slug: 'forms', name: 'Forms', category: 'Website', status: 'available', plan: 'Starter', route: '/website/forms', description: 'Capture leads, requests, and customer feedback.' },
  { slug: 'email', name: 'Email', category: 'Marketing', status: 'available', plan: 'Starter', route: '/crm/communications', description: 'Send targeted email campaigns and nurture sequences.' },
  { slug: 'whatsapp', name: 'WhatsApp', category: 'Marketing', status: 'available', plan: 'Business', route: '/crm/communications', description: 'Run approved WhatsApp updates and reminders.' },
  { slug: 'sms', name: 'SMS', category: 'Marketing', status: 'available', plan: 'Starter', route: '/crm/communications', description: 'Send transactional SMS alerts and campaign nudges.' },
  { slug: 'campaigns', name: 'Campaigns', category: 'Marketing', status: 'available', plan: 'Starter', route: '/crm/campaigns', description: 'Plan multi-channel promotions and measure response.' },
  { slug: 'notes', name: 'Notes', category: 'Productivity', status: 'available', plan: 'Starter', route: '/crm/documents', description: 'Capture internal notes, meeting minutes, and ideas.' },
  { slug: 'documents', name: 'Documents', category: 'Productivity', status: 'available', plan: 'Starter', route: '/crm/documents', description: 'Store client files, contracts, and operational documents.' },
  { slug: 'approvals', name: 'Approvals', category: 'Productivity', status: 'available', plan: 'Business', route: '/crm/approvals', description: 'Route approvals for discounts, expenses, and changes.' },
  { slug: 'chat', name: 'Chat', category: 'Productivity', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/chat', description: 'Collaborate across teams and app records.' },
  { slug: 'custom-fields', name: 'Custom Fields', category: 'Customization', status: 'available', plan: 'Business', route: '/crm/admin', description: 'Adapt records to your industry vocabulary.' },
  { slug: 'workflows', name: 'Workflows', category: 'Customization', status: 'available', plan: 'Business', route: '/crm/automation', description: 'Automate handoffs, alerts, and status changes.' },
  { slug: 'form-builder', name: 'Form Builder', category: 'Customization', status: 'available', plan: 'Business', route: '/crm/admin', description: 'Create internal forms without backend work.' },
  { slug: 'pharmacy', name: 'Pharmacy', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/pharmacy', description: 'Industry pack for pharmacy stock and sales workflows.' },
  { slug: 'gym', name: 'Gym', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/gym', description: 'Track memberships, leads, renewals, and attendance.' },
  { slug: 'clinic', name: 'Clinic', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/clinic', description: 'Manage enquiries, appointments, and patient follow-up.' },
  { slug: 'distributor', name: 'Distributor', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/distributor', description: 'Support dealer orders, inventory, and field sales.' },
  { slug: 'service-company', name: 'Service Company', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/service-company', description: 'Run service requests, project work, and renewals.' },
  { slug: 'apps', name: 'Apps', category: 'System', status: 'installed', plan: 'Starter', route: '/apps', metric: '53 modules', description: 'Manage available, installed, and plan-gated modules.' },
  { slug: 'settings', name: 'Settings', category: 'System', status: 'installed', plan: 'Starter', route: '/settings/company', metric: '5 sections', description: 'Manage company profile, users, roles, apps, and plan.' },
  { slug: 'reports', name: 'Reports', category: 'System', status: 'installed', plan: 'Starter', route: '/crm/reports', metric: '8 widgets', description: 'Review operational reports across enabled modules.' },
];

export const demoUsers: TenantUser[] = [
  { id: 'u1', name: 'Bibhudutta Dash', email: 'owner@vumtech.example', phone: '+91 94370 10001', role: 'Owner', status: 'active', lastActive: 'Today, 10:45 AM' },
  { id: 'u2', name: 'Anita Das', email: 'anita@vumtech.example', phone: '+91 94370 10002', role: 'Sales Manager', status: 'active', lastActive: 'Today, 09:18 AM' },
  { id: 'u3', name: 'Rakesh Sahoo', email: 'rakesh@vumtech.example', phone: '+91 94370 10003', role: 'Sales Executive', status: 'active', lastActive: 'Yesterday, 06:04 PM' },
  { id: 'u4', name: 'Priya Mishra', email: 'priya@vumtech.example', phone: '+91 94370 10004', role: 'Admin', status: 'active', lastActive: 'Today, 11:02 AM' },
  { id: 'u5', name: 'Sameer Patnaik', email: 'sameer@vumtech.example', phone: '+91 94370 10005', role: 'Accountant', status: 'inactive', lastActive: 'Jun 8, 2026' },
];

export const demoSubscription: Subscription = {
  plan: 'Business Trial',
  renewalDate: '2026-07-11',
  usersLimit: 10,
  usersUsed: 5,
  storageUsedMb: 840,
  storageLimitMb: 5120,
  leadsUsed: 30,
  leadsLimit: 500,
  invoicesUsed: 42,
  invoicesLimit: 1000,
};

const names = [
  ['Apollo Pharmacy Franchise', 'Apollo Retail', 'Pharmacy'],
  ['Fitness Hub Gym', 'Fitness Hub', 'Gym'],
  ['Shree Distributor ERP', 'Shree Traders', 'Distributor'],
  ['Mayurbhanj Clinic', 'Care Clinic', 'Clinic'],
  ['Dream Homes CRM', 'Dream Homes', 'Real Estate'],
  ['Smart Coaching Leads', 'Smart Classes', 'Coaching Center'],
  ['Odisha Service Desk', 'Odisha Services', 'Service Business'],
  ['Kalinga IT Automation', 'Kalinga Soft', 'IT Company'],
  ['City Dental Clinic', 'City Dental', 'Clinic'],
  ['Sai Medical Counter', 'Sai Medicals', 'Pharmacy'],
];
const stages = ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'] as const;
const sources = ['Website', 'WhatsApp', 'Referral', 'Facebook', 'Google Ads', 'Walk-in', 'Telecalling', 'Existing Customer'];
const owners = ['Anita Das', 'Rakesh Sahoo', 'Priya Mishra'];
const sourceDetails = ['Pricing page', 'Demo form', 'Partner referral', 'Retail campaign', 'Search ad', 'Front desk enquiry', 'Outbound list', 'Support upsell'];
const budgets = ['Under Rs 50,000', 'Rs 50,000 - Rs 1,00,000', 'Rs 1,00,000 - Rs 2,50,000', 'Above Rs 2,50,000'];

export const demoLeads: Lead[] = Array.from({ length: 30 }, (_, index) => {
  const seed = names[index % names.length];
  const stage = stages[index % stages.length];
  return {
    id: `L-${101 + index}`,
    name: `${seed[0]} ${index > 9 ? index + 1 : ''}`.trim(),
    company: seed[1],
    industry: seed[2],
    phone: `+91 98765 ${String(43000 + index).slice(0, 5)}`,
    alternatePhone: index % 3 === 0 ? `+91 91234 ${String(55000 + index).slice(0, 5)}` : undefined,
    email: `lead${index + 1}@example.in`,
    city: ['Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela', 'Sambalpur'][index % 5],
    state: 'Odisha',
    source: sources[index % sources.length],
    requirement: ['CRM setup', 'GST billing', 'Inventory control', 'Lead automation', 'Service workflow'][index % 5],
    status: stage === 'Won' ? 'won' : stage === 'Lost' ? 'lost' : 'open',
    stage,
    assignedTo: owners[index % owners.length],
    nextFollowUpAt: `2026-06-${String(12 + (index % 14)).padStart(2, '0')}T10:30:00`,
    expectedValue: 35000 + index * 7500,
    probability: Math.min(95, 15 + (index % 7) * 12),
    priority: (['Low', 'Medium', 'High'] as const)[index % 3],
    tags: [seed[2], sources[index % sources.length]].slice(0, index % 2 === 0 ? 2 : 1),
    captureMethod: captureMethods[index % captureMethods.length],
    sourceDetail: sourceDetails[index % sourceDetails.length],
    campaign: campaignOptions[index % campaignOptions.length],
    score: Math.min(98, 38 + ((index * 7) % 58)),
    rating: ratingOptions[index % ratingOptions.length],
    duplicateRisk: duplicateRiskOptions[index % duplicateRiskOptions.length],
    routingReason: ['Territory match', 'Industry expertise', 'High-value lead', 'Round-robin balance'][index % 4],
    qualificationStatus: stage === 'Won' ? 'Won' : stage === 'Lost' ? 'Lost' : qualificationOptions[index % 4],
    budget: budgets[index % budgets.length],
    ownerTeam: ownerTeams[index % ownerTeams.length],
    territory: territories[index % territories.length],
    lastActivityAt: `2026-06-${String(8 + (index % 9)).padStart(2, '0')}`,
    customFields: {
      'Existing system': ['Excel', 'Tally', 'Zoho', 'Manual register'][index % 4],
      'Decision role': ['Owner', 'Manager', 'Director', 'Operations Head'][index % 4],
    },
    notes: index < 10 ? [{ id: `N-${index}`, body: 'Discussed current process and shared a short demo plan.', author: owners[index % owners.length], createdAt: '2026-06-10' }] : [],
    createdAt: `2026-05-${String(10 + (index % 18)).padStart(2, '0')}`,
  };
});

export const demoFollowUps: FollowUp[] = Array.from({ length: 20 }, (_, index) => ({
  id: `F-${201 + index}`,
  leadId: demoLeads[index % demoLeads.length].id,
  title: ['Call decision maker', 'Send brochure', 'Schedule demo', 'Share quotation'][index % 4],
  date: `2026-06-${String(12 + (index % 12)).padStart(2, '0')}T${String(10 + (index % 7)).padStart(2, '0')}:00:00`,
  owner: owners[index % owners.length],
  completed: index % 4 === 0,
  channel: (['Call', 'Email', 'Meeting', 'WhatsApp', 'Task'] as const)[index % 5],
  priority: (['Low', 'Medium', 'High'] as const)[index % 3],
  outcome: index % 4 === 0 ? 'Customer confirmed requirement and asked for next-step summary.' : undefined,
}));

export const demoCustomers: Customer[] = demoLeads
  .filter((lead) => lead.stage === 'Won')
  .slice(0, 8)
  .map((lead, index) => ({
    id: `C-${301 + index}`,
    name: lead.name,
    company: lead.company,
    phone: lead.phone,
    email: lead.email,
    city: lead.city,
    industry: lead.industry,
    value: lead.expectedValue,
    since: '2026-06-01',
    lastContactAt: lead.nextFollowUpAt.slice(0, 10),
    owner: lead.assignedTo,
    status: 'active',
    healthScore: 68 + index * 6,
    openOpportunities: 1 + (index % 3),
    renewalDate: `2026-0${8 + index}-15`,
    lifecycleStage: ['New Customer', 'Implementation', 'Adoption', 'Renewal'][index % 4],
    accountHealth: (['Watch', 'Healthy', 'Healthy', 'At Risk'] as const)[index % 4],
    ticketsOpen: index % 3,
    documentsCount: 2 + index,
    communicationCount: 5 + index * 2,
  }));

export const demoCrmCompanies: CrmCompany[] = names.map((seed, index) => {
  const lead = demoLeads.find((item) => item.company === seed[1]) || demoLeads[index];
  const customer = demoCustomers.find((item) => item.company === seed[1]);
  const lifecycleStatus = customer ? 'Customer' : index % 4 === 0 ? 'Partner' : index % 3 === 0 ? 'Prospect' : 'Lead';
  const companyLeads = demoLeads.filter((item) => item.company === seed[1]);
  return {
    id: `CO-${801 + index}`,
    name: seed[1],
    legalName: `${seed[1]} Pvt. Ltd.`,
    displayName: seed[1],
    industry: seed[2],
    employeeSize: ['1-10', '11-50', '51-200', '201-500'][index % 4],
    annualRevenueBand: ['Under Rs 25L', 'Rs 25L - Rs 1Cr', 'Rs 1Cr - Rs 5Cr', 'Above Rs 5Cr'][index % 4],
    gstNumber: index % 2 === 0 ? `21CRM${String(1000 + index)}F1Z${index % 9}` : undefined,
    phone: lead.phone,
    email: `hello@${seed[1].toLowerCase().replace(/\s+/g, '')}.example`,
    website: `https://${seed[1].toLowerCase().replace(/\s+/g, '')}.example`,
    address: `${12 + index}, Demo Business Road`,
    city: lead.city || 'Bhubaneswar',
    state: lead.state || 'Odisha',
    owner: lead.assignedTo,
    lifecycleStatus,
    healthScore: customer?.healthScore || 58 + (index % 5) * 8,
    accountHealth: customer?.accountHealth || (index % 4 === 0 ? 'At Risk' : index % 3 === 0 ? 'Watch' : 'Healthy'),
    tags: [seed[2], lifecycleStatus],
    parentCompanyId: index > 0 && index % 5 === 0 ? 'CO-801' : undefined,
    lastActivityAt: lead.lastActivityAt || lead.nextFollowUpAt.slice(0, 10),
    openOpportunities: companyLeads.filter((item) => item.status === 'open').length,
    totalPipelineValue: companyLeads.reduce((sum, item) => sum + item.expectedValue, 0),
    customerId: customer?.id,
  };
});

export const demoCrmContacts: CrmContact[] = demoCrmCompanies.flatMap((company, index) => {
  const lead = demoLeads.find((item) => item.company === company.name) || demoLeads[index];
  const primaryName = demoCustomers.find((item) => item.company === company.name)?.name || lead.name;
  return [
    {
      id: `CT-${901 + index}`,
      companyId: company.id,
      customerId: company.customerId,
      name: primaryName,
      title: ['Founder', 'Operations Head', 'Clinic Manager', 'Store Owner'][index % 4],
      department: ['Management', 'Operations', 'Finance', 'Sales'][index % 4],
      phone: lead.phone,
      email: lead.email,
      decisionRole: (['Decision Maker', 'Influencer', 'Evaluator', 'Finance', 'User'] as const)[index % 5],
      preferredChannel: (['WhatsApp', 'Phone', 'Email', 'Meeting'] as const)[index % 4],
      emailConsent: index % 5 !== 0,
      whatsappConsent: index % 4 !== 0,
      smsConsent: index % 3 !== 0,
      owner: company.owner,
      lifecycleStatus: 'Active',
      lastActivityAt: company.lastActivityAt,
      tags: [company.industry, 'Primary'],
      isPrimary: true,
    },
    {
      id: `CT-${951 + index}`,
      companyId: company.id,
      customerId: company.customerId,
      name: ['Nisha Rao', 'Amit Pradhan', 'Kiran Das', 'Sonal Mohanty'][index % 4],
      title: ['Finance Contact', 'Implementation Lead', 'Branch Manager', 'Procurement Contact'][index % 4],
      department: ['Finance', 'Operations', 'Branch', 'Procurement'][index % 4],
      phone: `+91 88990 ${String(22000 + index).slice(0, 5)}`,
      email: `contact${index + 1}@${company.name.toLowerCase().replace(/\s+/g, '')}.example`,
      decisionRole: (['Finance', 'Evaluator', 'Influencer', 'User'] as const)[index % 4],
      preferredChannel: (['Email', 'Meeting', 'Phone', 'WhatsApp'] as const)[index % 4],
      emailConsent: true,
      whatsappConsent: index % 2 === 0,
      smsConsent: index % 2 !== 0,
      owner: company.owner,
      lifecycleStatus: index % 3 === 0 ? 'Nurture' : 'Active',
      lastActivityAt: `2026-06-${String(9 + (index % 8)).padStart(2, '0')}`,
      tags: [company.industry, 'Secondary'],
      isPrimary: false,
    },
  ];
});

export const demoCrmSegments: CrmSegment[] = [
  {
    id: 'SEG-1001',
    name: 'Hot healthcare leads',
    objectType: 'Lead',
    description: 'High-scoring pharmacy, clinic, and dental opportunities ready for fast follow-up.',
    criteria: ['Industry is Clinic or Pharmacy', 'Lead score above 70', 'Status is open'],
    recordCount: demoLeads.filter((lead) => ['Clinic', 'Pharmacy'].includes(lead.industry) && (lead.score || 0) > 70).length,
    owner: 'Anita Das',
    tags: ['Healthcare', 'Hot'],
    lastRefreshedAt: '2026-06-17',
  },
  {
    id: 'SEG-1002',
    name: 'Renewal and upsell accounts',
    objectType: 'Customer',
    description: 'Customers with active health scores and renewal dates in the next quarter.',
    criteria: ['Lifecycle is Renewal or Adoption', 'Account health is Healthy or Watch'],
    recordCount: demoCustomers.filter((customer) => ['Renewal', 'Adoption'].includes(customer.lifecycleStage || '')).length,
    owner: 'Priya Mishra',
    tags: ['Customer Success', 'Renewal'],
    lastRefreshedAt: '2026-06-17',
  },
  {
    id: 'SEG-1003',
    name: 'WhatsApp consent contacts',
    objectType: 'Contact',
    description: 'Contacts who can receive WhatsApp updates and follow-up reminders.',
    criteria: ['WhatsApp consent is true', 'Lifecycle status is Active'],
    recordCount: demoCrmContacts.filter((contact) => contact.whatsappConsent && contact.lifecycleStatus === 'Active').length,
    owner: 'Rakesh Sahoo',
    tags: ['WhatsApp', 'Consent'],
    lastRefreshedAt: '2026-06-16',
  },
  {
    id: 'SEG-1004',
    name: 'At-risk accounts',
    objectType: 'Company',
    description: 'Companies with lower health scores, support tickets, or stalled opportunities.',
    criteria: ['Account health is At Risk or Watch', 'Last activity older than 7 days'],
    recordCount: demoCrmCompanies.filter((company) => company.accountHealth !== 'Healthy').length,
    owner: 'Anita Das',
    tags: ['Risk', 'Manager Review'],
    lastRefreshedAt: '2026-06-15',
  },
];

export const demoCrmCampaigns: CrmCampaign[] = campaignOptions.map((name, index) => {
  const channels = ['Website', 'WhatsApp', 'Referral', 'Google Ads', 'Email', 'Landing Page'] as const;
  const leadsCount = 24 + index * 9;
  const conversions = 4 + index * 2;
  return {
    id: `CMP-${1101 + index}`,
    name,
    channel: channels[index % channels.length],
    status: (['Running', 'Scheduled', 'Completed', 'Paused', 'Draft', 'Running'] as const)[index % 6],
    owner: owners[index % owners.length],
    startDate: `2026-06-${String(1 + index).padStart(2, '0')}`,
    endDate: `2026-06-${String(20 + index).padStart(2, '0')}`,
    budget: 18000 + index * 9000,
    spend: 12000 + index * 6500,
    leads: leadsCount,
    conversions,
    revenue: conversions * (65000 + index * 12000),
    utmSource: channels[index % channels.length].toLowerCase().replace(/\s+/g, '-'),
    utmMedium: index % 2 === 0 ? 'paid' : 'organic',
    landingPage: `/landing/${name.toLowerCase().replace(/\s+/g, '-')}`,
    segmentId: demoCrmSegments[index % demoCrmSegments.length].id,
  };
});

export const demoCrmCommunications: CrmCommunication[] = Array.from({ length: 28 }, (_, index) => {
  const contact = demoCrmContacts[index % demoCrmContacts.length];
  const company = demoCrmCompanies.find((item) => item.id === contact.companyId);
  const lead = demoLeads.find((item) => item.company === company?.name);
  const channel = (['Email', 'WhatsApp', 'SMS', 'Call', 'Meeting'] as const)[index % 5];
  return {
    id: `COM-${1201 + index}`,
    channel,
    direction: index % 4 === 0 ? 'Inbound' : 'Outbound',
    subject: [
      'Demo follow-up summary',
      'Quotation reminder preview',
      'Implementation readiness check',
      'Renewal discussion',
      'Support handoff note',
    ][index % 5],
    preview: 'Static communication preview from local CRM demo data.',
    status: (['Sent', 'Delivered', 'Opened', 'Logged', 'Queued', 'Draft', 'Failed'] as const)[index % 7],
    owner: contact.owner,
    sentAt: `2026-06-${String(7 + (index % 10)).padStart(2, '0')}T${String(9 + (index % 8)).padStart(2, '0')}:30:00`,
    relatedLeadId: lead?.id,
    relatedCompanyId: company?.id,
    relatedContactId: contact.id,
    relatedCustomerId: contact.customerId,
    templateName: index % 3 === 0 ? 'Lead nurture sequence' : index % 3 === 1 ? 'Quote follow-up' : undefined,
    consentStatus: channel === 'Call' || channel === 'Meeting'
      ? 'Not Required'
      : channel === 'WhatsApp'
        ? contact.whatsappConsent ? 'Allowed' : 'Missing'
        : channel === 'Email'
          ? contact.emailConsent ? 'Allowed' : 'Missing'
          : contact.smsConsent ? 'Allowed' : 'Missing',
  };
});

export const demoCrmSupportTickets: CrmSupportTicket[] = demoCustomers.flatMap((customer, index) => {
  const company = demoCrmCompanies.find((item) => item.customerId === customer.id || item.name === customer.company);
  const contact = demoCrmContacts.find((item) => item.customerId === customer.id || item.companyId === company?.id);
  return Array.from({ length: Math.max(1, customer.ticketsOpen || 0) }, (_, ticketIndex) => ({
    id: `TCK-${1301 + index * 3 + ticketIndex}`,
    subject: ['Onboarding checklist question', 'Invoice copy request', 'Workflow configuration help'][ticketIndex % 3],
    customerId: customer.id,
    companyId: company?.id,
    contactId: contact?.id,
    priority: (['Low', 'Medium', 'High', 'Urgent'] as const)[(index + ticketIndex) % 4],
    status: (['New', 'Open', 'Waiting on Customer', 'Escalated', 'Resolved'] as const)[(index + ticketIndex) % 5],
    slaStatus: (['On Track', 'At Risk', 'Breached'] as const)[(index + ticketIndex) % 3],
    assignee: ['Support Executive', 'Anita Das', 'Rakesh Sahoo'][ticketIndex % 3],
    category: ['Onboarding', 'Billing', 'Configuration'][ticketIndex % 3],
    source: (['Email', 'Phone', 'WhatsApp', 'Portal'] as const)[(index + ticketIndex) % 4],
    createdAt: `2026-06-${String(9 + ticketIndex + index).padStart(2, '0')}`,
    dueAt: `2026-06-${String(14 + ticketIndex + index).padStart(2, '0')}`,
    escalationLevel: (['None', 'Manager', 'Leadership'] as const)[(index + ticketIndex) % 3],
  }));
});

export const demoCrmDocuments: CrmDocument[] = [
  ...demoCrmCompanies.slice(0, 8).map((company, index) => ({
    id: `DOC-${1401 + index}`,
    name: ['Company profile', 'GST document placeholder', 'Implementation checklist', 'Signed proposal placeholder'][index % 4],
    type: (['KYC', 'KYC', 'Checklist', 'Proposal'] as const)[index % 4],
    relatedType: 'Company' as const,
    relatedCompanyId: company.id,
    owner: company.owner,
    updatedAt: `2026-06-${String(10 + index).padStart(2, '0')}`,
    status: (['Shared', 'Draft', 'Signed', 'Archived'] as const)[index % 4],
    source: (['Uploaded', 'Generated', 'Imported'] as const)[index % 3],
  })),
  ...demoLeads.slice(0, 6).map((lead, index) => ({
    id: `DOC-${1451 + index}`,
    name: ['Discovery note', 'Requirements summary', 'Demo checklist'][index % 3],
    type: (['Note', 'Attachment', 'Checklist'] as const)[index % 3],
    relatedType: 'Lead' as const,
    relatedLeadId: lead.id,
    owner: lead.assignedTo,
    updatedAt: `2026-06-${String(8 + index).padStart(2, '0')}`,
    status: (['Draft', 'Shared', 'Archived'] as const)[index % 3],
    source: (['Generated', 'Uploaded', 'Imported'] as const)[index % 3],
  })),
];

export const demoQuotations: Quotation[] = demoLeads.slice(3, 8).map((lead, index) => ({
  id: `Q-${401 + index}`,
  leadId: lead.id,
  customerName: lead.company,
  amount: lead.expectedValue,
  status: ['Draft', 'Sent', 'Accepted', 'Follow-up'][index % 4],
  createdAt: '2026-06-09',
}));

export const demoSalesProducts: SalesProduct[] = [
  { id: 'SP-1', name: 'CRM Starter Setup', type: 'Service', sku: 'CRM-SETUP', category: 'Implementation', unit: 'Project', price: 45000, gstRate: 18, description: 'Lead pipeline, users, stages, and onboarding setup.', status: 'active' },
  { id: 'SP-2', name: 'GST Billing Setup', type: 'Service', sku: 'GST-BILL', category: 'Finance', unit: 'Project', price: 35000, gstRate: 18, description: 'GST invoice template, tax rules, and billing workflow.', status: 'active' },
  { id: 'SP-3', name: 'Inventory Lite Setup', type: 'Service', sku: 'INV-LITE', category: 'Inventory', unit: 'Project', price: 55000, gstRate: 18, description: 'Product catalogue, opening stock, and reorder setup.', status: 'active' },
  { id: 'SP-4', name: 'Monthly Support Plan', type: 'Service', sku: 'SUP-MONTH', category: 'Support', unit: 'Month', price: 12000, gstRate: 18, description: 'Priority support and minor configuration changes.', status: 'active' },
  { id: 'SP-5', name: 'Barcode Scanner', type: 'Product', sku: 'HW-SCAN', category: 'Hardware', unit: 'Piece', price: 8500, gstRate: 18, description: 'USB barcode scanner for retail counters.', status: 'active' },
];

export const calculateQuotationTotals = (items: SalesQuotation['items']) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice - item.discount, 0);
  const tax = items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice - item.discount) * item.gstRate) / 100, 0);
  return { subtotal, tax, total: subtotal + tax };
};

export const demoSalesQuotations: SalesQuotation[] = demoCustomers.slice(0, 5).map((customer, index) => {
  const product = demoSalesProducts[index % demoSalesProducts.length];
  return {
    id: `SQ-${501 + index}`,
    number: `QT-2026-${String(index + 1).padStart(3, '0')}`,
    customerId: customer.id,
    customerName: customer.company,
    date: `2026-06-${String(10 + index).padStart(2, '0')}`,
    expiryDate: `2026-06-${String(20 + index).padStart(2, '0')}`,
    salesperson: customer.owner || owners[index % owners.length],
    items: [
      {
        id: `SQI-${index}`,
        productId: product.id,
        productName: product.name,
        quantity: index + 1,
        unitPrice: product.price,
        discount: index % 2 === 0 ? 2500 : 0,
        gstRate: product.gstRate,
      },
    ],
    terms: '50% advance, balance on delivery. Quote valid until expiry date.',
    notes: 'Demo quotation generated from local sales data.',
    status: (['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected'] as const)[index % 5],
    createdAt: `2026-06-${String(10 + index).padStart(2, '0')}`,
  };
});

export const demoSalesOrders: SalesOrder[] = demoSalesQuotations.slice(0, 2).map((quotation, index) => ({
  id: `SO-${601 + index}`,
  orderNumber: `SO-2026-${String(index + 1).padStart(3, '0')}`,
  customerName: quotation.customerName,
  quotationNumber: quotation.number,
  orderDate: '2026-06-15',
  deliveryDate: '2026-06-25',
  amount: calculateQuotationTotals(quotation.items).total,
  status: (['Confirmed', 'Processing'] as const)[index],
}));

export const demoSalesSubscriptions: SalesSubscription[] = demoCustomers.slice(0, 4).map((customer, index) => ({
  id: `SS-${701 + index}`,
  subscriptionNumber: `SUB-2026-${String(index + 1).padStart(3, '0')}`,
  customerName: customer.company,
  planName: ['Monthly Support Plan', 'CRM Success Plan', 'Billing Support Plan', 'Inventory Care Plan'][index],
  startDate: '2026-06-01',
  renewalDate: `2026-0${7 + index}-01`,
  billingCycle: (['Monthly', 'Quarterly', 'Yearly'] as const)[index % 3],
  amount: [12000, 24000, 36000, 18000][index],
  status: (['Trial', 'Active', 'Renewal Due', 'Expired'] as const)[index],
}));

export const demoCrmWorkflows: CrmWorkflow[] = [
  {
    id: 'WF-1501',
    name: 'High-score lead routing',
    status: 'Active',
    trigger: 'Lead created or score updated',
    conditions: ['Lead score >= 78', 'Status is open', 'Owner team is Inside Sales'],
    actions: ['Assign to Sales Manager', 'Create follow-up in 15 minutes', 'Send internal alert'],
    owner: 'Priya Mishra',
    lastRunAt: '2026-06-17T10:20:00',
    runs: 42,
    successRate: 98,
  },
  {
    id: 'WF-1502',
    name: 'Quotation sent follow-up',
    status: 'Active',
    trigger: 'Lead stage becomes Quotation Sent',
    conditions: ['No open follow-up within 2 days', 'Duplicate risk is not High'],
    actions: ['Create follow-up after 2 days', 'Queue quote reminder email preview'],
    owner: 'Anita Das',
    lastRunAt: '2026-06-17T09:40:00',
    runs: 31,
    successRate: 94,
  },
  {
    id: 'WF-1503',
    name: 'At-risk account escalation',
    status: 'Paused',
    trigger: 'Customer health score drops below 60',
    conditions: ['Open ticket exists', 'Renewal within 90 days'],
    actions: ['Create manager review task', 'Add account to At-risk segment'],
    owner: 'Rakesh Sahoo',
    lastRunAt: '2026-06-15T15:10:00',
    runs: 12,
    successRate: 89,
  },
  {
    id: 'WF-1504',
    name: 'Duplicate risk review',
    status: 'Draft',
    trigger: 'Lead duplicate risk becomes High',
    conditions: ['Phone or email match exists'],
    actions: ['Create CRM Admin review', 'Block conversion until reviewed'],
    owner: 'Priya Mishra',
    lastRunAt: 'Not run',
    runs: 0,
    successRate: 0,
  },
];

export const demoCrmApprovals: CrmApprovalRequest[] = demoSalesQuotations.slice(0, 5).map((quotation, index) => ({
  id: `APR-${1601 + index}`,
  title: `${quotation.number} approval`,
  type: (['High Value Quote', 'Discount', 'Custom Workflow', 'Stage Change'] as const)[index % 4],
  amount: calculateQuotationTotals(quotation.items).total,
  requester: quotation.salesperson,
  approver: index % 2 === 0 ? 'Anita Das' : 'Bibhudutta Dash',
  status: (['Pending', 'Approved', 'Escalated', 'Rejected'] as const)[index % 4],
  priority: (['High', 'Medium', 'High', 'Low'] as const)[index % 4],
  relatedQuotationNumber: quotation.number,
  submittedAt: `2026-06-${String(12 + index).padStart(2, '0')}`,
  dueAt: `2026-06-${String(16 + index).padStart(2, '0')}`,
  reason: index % 2 === 0 ? 'High-value quote requires manager review.' : 'Discount exceeds demo approval threshold.',
  comments: ['Static approval workflow preview', 'No notification is sent in UI phase'],
}));

export const demoCrmCustomFields: CrmCustomFieldDefinition[] = [
  { id: 'CF-1701', objectType: 'Lead', label: 'Existing system', fieldType: 'Select', status: 'Active', required: false, visibleInList: true, usedInScoring: true, options: ['Excel', 'Tally', 'Zoho', 'Manual register'] },
  { id: 'CF-1702', objectType: 'Lead', label: 'Decision role', fieldType: 'Select', status: 'Active', required: true, visibleInList: false, usedInScoring: true, options: ['Owner', 'Manager', 'Director', 'Operations Head'] },
  { id: 'CF-1703', objectType: 'Company', label: 'Annual revenue band', fieldType: 'Select', status: 'Active', required: false, visibleInList: true, usedInScoring: false, options: ['Under Rs 25L', 'Rs 25L - Rs 1Cr', 'Rs 1Cr - Rs 5Cr', 'Above Rs 5Cr'] },
  { id: 'CF-1704', objectType: 'Customer', label: 'Health score', fieldType: 'Number', status: 'Active', required: false, visibleInList: true, usedInScoring: true },
  { id: 'CF-1705', objectType: 'Opportunity', label: 'Competitor', fieldType: 'Text', status: 'Draft', required: false, visibleInList: false, usedInScoring: false },
  { id: 'CF-1706', objectType: 'Contact', label: 'WhatsApp consent source', fieldType: 'Text', status: 'Hidden', required: false, visibleInList: false, usedInScoring: false },
];

export const demoCrmAuditLogs: CrmAuditLog[] = [
  { id: 'AUD-1801', actor: 'Priya Mishra', action: 'Updated workflow rule', objectType: 'Workflow', objectName: 'High-score lead routing', severity: 'Info', ipAddress: '103.21.44.10', occurredAt: '2026-06-17T10:31:00' },
  { id: 'AUD-1802', actor: 'Anita Das', action: 'Approved quote request', objectType: 'Approval', objectName: 'QT-2026-001 approval', severity: 'Info', ipAddress: '103.21.44.11', occurredAt: '2026-06-17T09:50:00' },
  { id: 'AUD-1803', actor: 'Bibhudutta Dash', action: 'Changed role permissions preview', objectType: 'Settings', objectName: 'CRM Admin', severity: 'Warning', ipAddress: '103.21.44.12', occurredAt: '2026-06-16T18:12:00' },
  { id: 'AUD-1804', actor: 'System', action: 'Webhook test blocked in UI mode', objectType: 'Integration', objectName: 'Accounting webhook', severity: 'Info', ipAddress: '127.0.0.1', occurredAt: '2026-06-16T15:22:00' },
  { id: 'AUD-1805', actor: 'Rakesh Sahoo', action: 'Viewed high-risk duplicate lead', objectType: 'Lead', objectName: 'Apollo Pharmacy Franchise', severity: 'Critical', ipAddress: '103.21.44.13', occurredAt: '2026-06-15T12:05:00' },
];

export const demoCrmIntegrations: CrmIntegration[] = [
  { id: 'INT-1901', name: 'Business email sync', category: 'Email', status: 'Preview', description: 'Email inbox and campaign delivery connection.', lastSyncAt: '2026-06-17T09:30:00', authMode: 'OAuth', scopes: ['Read mail metadata', 'Send transactional email'], direction: 'Bidirectional' },
  { id: 'INT-1902', name: 'WhatsApp Business', category: 'WhatsApp', status: 'Needs Auth', description: 'Approved templates and customer messaging.', authMode: 'API Key', scopes: ['Template send', 'Delivery status'], direction: 'Outbound' },
  { id: 'INT-1903', name: 'Telephony connector', category: 'Telephony', status: 'Disabled', description: 'Call logging, recording references, click-to-call.', authMode: 'API Key', scopes: ['Call log import'], direction: 'Inbound' },
  { id: 'INT-1904', name: 'Accounting sync', category: 'Accounting', status: 'Preview', description: 'Quote/order/invoice handoff to Finance.', lastSyncAt: '2026-06-15T17:00:00', authMode: 'OAuth', scopes: ['Customer sync', 'Invoice sync'], direction: 'Bidirectional' },
  { id: 'INT-1905', name: 'Lead capture webhook', category: 'Webhook', status: 'Preview', description: 'Website/API lead capture endpoint preview.', authMode: 'Webhook Secret', scopes: ['Lead create'], direction: 'Inbound' },
  { id: 'INT-1906', name: 'Public CRM API', category: 'API', status: 'Disabled', description: 'REST API and webhook subscription settings.', authMode: 'API Key', scopes: ['Leads', 'Companies', 'Contacts', 'Activities'], direction: 'Bidirectional' },
];

export const demoCrmAiInsights: CrmAiInsight[] = [
  {
    id: 'AI-2001',
    type: 'Lead Scoring',
    title: 'Why Apollo Pharmacy scored hot',
    recordName: 'Apollo Pharmacy Franchise',
    confidence: 92,
    status: 'Ready',
    summary: 'Referral source, high expected value, and clear retail workflow need increased lead priority.',
    recommendation: 'Assign manager follow-up and prepare pharmacy starter proposal.',
    owner: 'Anita Das',
    createdAt: '2026-06-17T10:00:00',
  },
  {
    id: 'AI-2002',
    type: 'Email Generator',
    title: 'Quote follow-up email draft',
    recordName: 'QT-2026-002',
    confidence: 84,
    status: 'Draft',
    summary: 'Draft email thanks the buyer, summarizes quote value, and asks for decision timeline.',
    recommendation: 'Review pricing paragraph before sending. Delivery is disabled in UI mode.',
    owner: 'Rakesh Sahoo',
    createdAt: '2026-06-17T09:30:00',
  },
  {
    id: 'AI-2003',
    type: 'Meeting Summary',
    title: 'Implementation discussion summary',
    recordName: 'Dream Homes',
    confidence: 78,
    status: 'Review Needed',
    summary: 'Buyer asked for lead capture, quotation approval, and WhatsApp reminder workflow.',
    recommendation: 'Create follow-up task and add workflow automation demo to next call.',
    owner: 'Priya Mishra',
    createdAt: '2026-06-16T16:45:00',
  },
  {
    id: 'AI-2004',
    type: 'Sentiment Analysis',
    title: 'Support thread sentiment',
    recordName: 'Care Clinic',
    confidence: 81,
    status: 'Ready',
    summary: 'Customer tone is neutral but urgency is increasing due to unresolved onboarding question.',
    recommendation: 'Escalate to support owner and schedule a 15-minute resolution call.',
    owner: 'Support Executive',
    createdAt: '2026-06-16T12:20:00',
  },
];
