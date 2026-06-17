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
