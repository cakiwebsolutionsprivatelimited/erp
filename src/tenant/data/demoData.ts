import type { CompanyProfile, Customer, FollowUp, Lead, Quotation, SalesOrder, SalesProduct, SalesQuotation, SalesSubscription, Subscription, TenantApp, TenantUser } from '@/tenant/types';

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
  { slug: 'billing', name: 'Billing', category: 'Finance', status: 'available', plan: 'Starter', route: '/placeholder/billing', description: 'Create invoices, receipts, and payment reminders.' },
  { slug: 'gst-invoicing', name: 'GST Invoicing', category: 'Finance', status: 'available', plan: 'Starter', route: '/placeholder/gst-invoicing', description: 'Generate GST-ready invoices for Indian SMEs.' },
  { slug: 'accounts', name: 'Accounts', category: 'Finance', status: 'locked', plan: 'Business', route: '/placeholder/accounts', description: 'Track ledgers, cash flow, and finance reports.' },
  { slug: 'expenses', name: 'Expenses', category: 'Finance', status: 'available', plan: 'Starter', route: '/placeholder/expenses', description: 'Record reimbursements, vendor spends, and approvals.' },
  { slug: 'products', name: 'Products', category: 'Inventory', status: 'available', plan: 'Starter', route: '/placeholder/products', description: 'Maintain product catalogues, rates, taxes, and units.' },
  { slug: 'stock', name: 'Stock', category: 'Inventory', status: 'upgrade_required', plan: 'Business', route: '/placeholder/stock', description: 'Track item movement, availability, and reorder points.' },
  { slug: 'purchase', name: 'Purchase', category: 'Inventory', status: 'available', plan: 'Starter', route: '/placeholder/purchase', description: 'Create purchase orders and manage supplier pipelines.' },
  { slug: 'warehouse', name: 'Warehouse', category: 'Inventory', status: 'upgrade_required', plan: 'Business', route: '/placeholder/warehouse', description: 'Manage warehouses, bins, transfers, and fulfilment.' },
  { slug: 'projects', name: 'Projects', category: 'Services', status: 'available', plan: 'Starter', route: '/placeholder/projects', description: 'Plan client projects, milestones, and delivery tasks.' },
  { slug: 'tasks', name: 'Tasks', category: 'Services', status: 'available', plan: 'Starter', route: '/placeholder/tasks', description: 'Assign work, monitor progress, and clear blockers.' },
  { slug: 'helpdesk', name: 'Helpdesk', category: 'Services', status: 'available', plan: 'Starter', route: '/placeholder/helpdesk', description: 'Manage tickets, complaints, and service requests.' },
  { slug: 'field-service', name: 'Field Service', category: 'Services', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/field-service', description: 'Schedule visits, technicians, and customer sign-offs.' },
  { slug: 'employees', name: 'Employees', category: 'HR', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/employees', description: 'Maintain employee records, documents, and teams.' },
  { slug: 'attendance', name: 'Attendance', category: 'HR', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/attendance', description: 'Track attendance, shifts, and late marks.' },
  { slug: 'leave', name: 'Leave', category: 'HR', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/leave', description: 'Manage leave requests, balances, and approvals.' },
  { slug: 'payroll', name: 'Payroll', category: 'HR', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/payroll', description: 'Prepare salaries, deductions, payslips, and statutory reports.' },
  { slug: 'website-builder', name: 'Website Builder', category: 'Website', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/website-builder', description: 'Build customer pages and enquiry capture flows.' },
  { slug: 'landing-pages', name: 'Landing Pages', category: 'Website', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/landing-pages', description: 'Launch campaign pages for offers and services.' },
  { slug: 'forms', name: 'Forms', category: 'Website', status: 'available', plan: 'Starter', route: '/placeholder/forms', description: 'Capture leads, requests, and customer feedback.' },
  { slug: 'email', name: 'Email', category: 'Marketing', status: 'available', plan: 'Starter', route: '/placeholder/email', description: 'Send targeted email campaigns and nurture sequences.' },
  { slug: 'whatsapp', name: 'WhatsApp', category: 'Marketing', status: 'locked', plan: 'Business', route: '/placeholder/whatsapp', description: 'Run approved WhatsApp updates and reminders.' },
  { slug: 'sms', name: 'SMS', category: 'Marketing', status: 'available', plan: 'Starter', route: '/placeholder/sms', description: 'Send transactional SMS alerts and campaign nudges.' },
  { slug: 'campaigns', name: 'Campaigns', category: 'Marketing', status: 'available', plan: 'Starter', route: '/placeholder/campaigns', description: 'Plan multi-channel promotions and measure response.' },
  { slug: 'notes', name: 'Notes', category: 'Productivity', status: 'available', plan: 'Starter', route: '/placeholder/notes', description: 'Capture internal notes, meeting minutes, and ideas.' },
  { slug: 'documents', name: 'Documents', category: 'Productivity', status: 'available', plan: 'Starter', route: '/placeholder/documents', description: 'Store client files, contracts, and operational documents.' },
  { slug: 'approvals', name: 'Approvals', category: 'Productivity', status: 'locked', plan: 'Business', route: '/placeholder/approvals', description: 'Route approvals for discounts, expenses, and changes.' },
  { slug: 'chat', name: 'Chat', category: 'Productivity', status: 'coming_soon', plan: 'Roadmap', route: '/placeholder/chat', description: 'Collaborate across teams and app records.' },
  { slug: 'custom-fields', name: 'Custom Fields', category: 'Customization', status: 'locked', plan: 'Business', route: '/placeholder/custom-fields', description: 'Adapt records to your industry vocabulary.' },
  { slug: 'workflows', name: 'Workflows', category: 'Customization', status: 'locked', plan: 'Business', route: '/placeholder/workflows', description: 'Automate handoffs, alerts, and status changes.' },
  { slug: 'form-builder', name: 'Form Builder', category: 'Customization', status: 'locked', plan: 'Business', route: '/placeholder/form-builder', description: 'Create internal forms without backend work.' },
  { slug: 'pharmacy', name: 'Pharmacy', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/pharmacy', description: 'Industry pack for pharmacy stock and sales workflows.' },
  { slug: 'gym', name: 'Gym', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/gym', description: 'Track memberships, leads, renewals, and attendance.' },
  { slug: 'clinic', name: 'Clinic', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/clinic', description: 'Manage enquiries, appointments, and patient follow-up.' },
  { slug: 'distributor', name: 'Distributor', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/distributor', description: 'Support dealer orders, inventory, and field sales.' },
  { slug: 'service-company', name: 'Service Company', category: 'Industries', status: 'available', plan: 'Starter', route: '/placeholder/service-company', description: 'Run service requests, project work, and renewals.' },
  { slug: 'apps', name: 'Apps', category: 'System', status: 'installed', plan: 'Starter', route: '/apps', metric: '40 modules', description: 'Manage available, installed, and plan-gated modules.' },
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
  }));

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
