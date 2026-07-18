import type { LucideIcon } from 'lucide-react';

export type AppStatus = 'installed' | 'available' | 'locked' | 'upgrade_required' | 'coming_soon';
export type LeadStage = 'New' | 'Contacted' | 'Interested' | 'Quotation Sent' | 'Negotiation' | 'Won' | 'Lost';

export interface TenantApp {
  slug: string;
  name: string;
  category: string;
  description: string;
  status: AppStatus;
  plan: string;
  icon?: LucideIcon;
  route?: string;
  metric?: string;
}

export interface CompanyProfile {
  name: string;
  businessType: string;
  gstNumber: string;
  panNumber: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  currency: string;
}

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface Subscription {
  plan: string;
  renewalDate: string;
  usersLimit: number;
  usersUsed: number;
  storageUsedMb: number;
  storageLimitMb: number;
  leadsUsed: number;
  leadsLimit: number;
  invoicesUsed: number;
  invoicesLimit: number;
}

export interface LeadNote {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  title: string;
  date: string;
  owner: string;
  completed: boolean;
  note?: string;
  channel?: 'Call' | 'Email' | 'Meeting' | 'WhatsApp' | 'Task';
  priority?: 'Low' | 'Medium' | 'High';
  outcome?: string;
}

export interface Lead {
  id: string;
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
  status: 'open' | 'won' | 'lost';
  stage: LeadStage;
  assignedTo: string;
  nextFollowUpAt: string;
  expectedValue: number;
  probability: number;
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
  lastActivityAt?: string;
  customFields?: Record<string, string>;
  notes: LeadNote[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  city?: string;
  industry: string;
  value: number;
  since: string;
  lastContactAt?: string;
  owner?: string;
  status?: 'active' | 'inactive';
  healthScore?: number;
  openOpportunities?: number;
  renewalDate?: string;
  lifecycleStage?: string;
  accountHealth?: 'Healthy' | 'Watch' | 'At Risk';
  ticketsOpen?: number;
  documentsCount?: number;
  communicationCount?: number;
}

export type CrmCompanyLifecycle = 'Lead' | 'Prospect' | 'Customer' | 'Partner' | 'Inactive';
export type CrmContactChannel = 'Email' | 'Phone' | 'WhatsApp' | 'Meeting';

export interface CrmCompany {
  id: string;
  name: string;
  legalName: string;
  displayName: string;
  industry: string;
  employeeSize: string;
  annualRevenueBand: string;
  gstNumber?: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  owner: string;
  lifecycleStatus: CrmCompanyLifecycle;
  healthScore: number;
  accountHealth: 'Healthy' | 'Watch' | 'At Risk';
  tags: string[];
  parentCompanyId?: string;
  lastActivityAt: string;
  openOpportunities: number;
  totalPipelineValue: number;
  customerId?: string;
}

export interface CrmContact {
  id: string;
  companyId: string;
  customerId?: string;
  name: string;
  title: string;
  department: string;
  phone: string;
  email: string;
  decisionRole: 'Decision Maker' | 'Influencer' | 'Evaluator' | 'Finance' | 'User';
  preferredChannel: CrmContactChannel;
  emailConsent: boolean;
  whatsappConsent: boolean;
  smsConsent: boolean;
  owner: string;
  lifecycleStatus: 'Active' | 'Nurture' | 'Inactive';
  lastActivityAt: string;
  tags: string[];
  isPrimary: boolean;
}

export type CrmCommunicationChannel = 'Email' | 'WhatsApp' | 'SMS' | 'Call' | 'Meeting';
export type CrmCommunicationStatus = 'Draft' | 'Queued' | 'Sent' | 'Delivered' | 'Opened' | 'Failed' | 'Logged';

export interface CrmCommunication {
  id: string;
  channel: CrmCommunicationChannel;
  direction: 'Inbound' | 'Outbound';
  subject: string;
  preview: string;
  status: CrmCommunicationStatus;
  owner: string;
  sentAt: string;
  relatedLeadId?: string;
  relatedCompanyId?: string;
  relatedContactId?: string;
  relatedCustomerId?: string;
  templateName?: string;
  consentStatus: 'Allowed' | 'Missing' | 'Not Required';
}

export type CrmCampaignChannel = 'Website' | 'Email' | 'WhatsApp' | 'SMS' | 'Google Ads' | 'Referral' | 'Landing Page';
export type CrmCampaignStatus = 'Draft' | 'Scheduled' | 'Running' | 'Paused' | 'Completed';

export interface CrmCampaign {
  id: string;
  name: string;
  channel: CrmCampaignChannel;
  status: CrmCampaignStatus;
  owner: string;
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  leads: number;
  conversions: number;
  revenue: number;
  utmSource: string;
  utmMedium: string;
  landingPage: string;
  segmentId?: string;
}

export interface CrmSupportTicket {
  id: string;
  subject: string;
  customerId?: string;
  companyId?: string;
  contactId?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'New' | 'Open' | 'Waiting on Customer' | 'Escalated' | 'Resolved';
  slaStatus: 'On Track' | 'At Risk' | 'Breached';
  assignee: string;
  category: string;
  source: 'Email' | 'Phone' | 'WhatsApp' | 'Portal';
  createdAt: string;
  dueAt: string;
  escalationLevel: 'None' | 'Manager' | 'Leadership';
}

export interface CrmDocument {
  id: string;
  name: string;
  type: 'Proposal' | 'Contract' | 'KYC' | 'Note' | 'Checklist' | 'Attachment';
  relatedType: 'Lead' | 'Company' | 'Contact' | 'Customer';
  relatedLeadId?: string;
  relatedCompanyId?: string;
  relatedContactId?: string;
  relatedCustomerId?: string;
  owner: string;
  updatedAt: string;
  status: 'Draft' | 'Shared' | 'Signed' | 'Archived';
  source: 'Uploaded' | 'Generated' | 'Imported';
}

export interface CrmSegment {
  id: string;
  name: string;
  objectType: 'Lead' | 'Company' | 'Contact' | 'Customer';
  description: string;
  criteria: string[];
  recordCount: number;
  owner: string;
  tags: string[];
  lastRefreshedAt: string;
}

export interface CrmWorkflow {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Paused';
  trigger: string;
  conditions: string[];
  actions: string[];
  owner: string;
  lastRunAt: string;
  runs: number;
  successRate: number;
}

export interface CrmApprovalRequest {
  id: string;
  title: string;
  type: 'Discount' | 'High Value Quote' | 'Stage Change' | 'Custom Workflow';
  amount: number;
  requester: string;
  approver: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Escalated';
  priority: 'Low' | 'Medium' | 'High';
  relatedLeadId?: string;
  relatedQuotationNumber?: string;
  submittedAt: string;
  dueAt: string;
  reason: string;
  comments: string[];
}

export interface CrmCustomFieldDefinition {
  id: string;
  objectType: 'Lead' | 'Company' | 'Contact' | 'Customer' | 'Opportunity';
  label: string;
  fieldType: 'Text' | 'Number' | 'Select' | 'Date' | 'Currency' | 'Checkbox';
  status: 'Active' | 'Draft' | 'Hidden';
  required: boolean;
  visibleInList: boolean;
  usedInScoring: boolean;
  options?: string[];
}

export interface CrmAuditLog {
  id: string;
  actor: string;
  action: string;
  objectType: 'Lead' | 'Company' | 'Contact' | 'Workflow' | 'Approval' | 'Settings' | 'Integration';
  objectName: string;
  severity: 'Info' | 'Warning' | 'Critical';
  ipAddress: string;
  occurredAt: string;
}

export interface CrmIntegration {
  id: string;
  name: string;
  category: 'Email' | 'Telephony' | 'WhatsApp' | 'Accounting' | 'Payment' | 'API' | 'Webhook';
  status: 'Connected' | 'Needs Auth' | 'Disabled' | 'Preview';
  description: string;
  lastSyncAt?: string;
  authMode: 'OAuth' | 'API Key' | 'Webhook Secret' | 'Manual';
  scopes: string[];
  direction: 'Inbound' | 'Outbound' | 'Bidirectional';
}

export interface CrmAiInsight {
  id: string;
  type: 'Lead Scoring' | 'Email Generator' | 'Meeting Summary' | 'Sentiment Analysis';
  title: string;
  recordName: string;
  confidence: number;
  status: 'Ready' | 'Review Needed' | 'Draft';
  summary: string;
  recommendation: string;
  owner: string;
  createdAt: string;
}

export interface Quotation {
  id: string;
  leadId: string;
  customerName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export type SalesQuotationStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted to Order';
export type SalesOrderStatus = 'Confirmed' | 'Processing' | 'Delivered' | 'Cancelled';
export type SalesSubscriptionStatus = 'Trial' | 'Active' | 'Renewal Due' | 'Expired' | 'Cancelled';

export interface SalesProduct {
  id: string;
  name: string;
  type: 'Product' | 'Service';
  sku?: string;
  category: string;
  unit: string;
  price: number;
  gstRate: number;
  description: string;
  status: 'active' | 'inactive';
}

export interface SalesQuotationItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  gstRate: number;
}

export interface SalesQuotation {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  expiryDate: string;
  salesperson: string;
  items: SalesQuotationItem[];
  terms: string;
  notes: string;
  status: SalesQuotationStatus;
  createdAt: string;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  quotationNumber: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  status: SalesOrderStatus;
}

export interface SalesSubscription {
  id: string;
  subscriptionNumber: string;
  customerName: string;
  planName: string;
  startDate: string;
  renewalDate: string;
  billingCycle: 'Monthly' | 'Quarterly' | 'Yearly';
  amount: number;
  status: SalesSubscriptionStatus;
}
