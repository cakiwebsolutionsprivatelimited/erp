export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';
export type PaymentStatus = 'Received' | 'Pending' | 'Failed';
export type ExpenseCategory =
  | 'Office Rent'
  | 'Salary'
  | 'Travel'
  | 'Marketing'
  | 'Software'
  | 'Utilities'
  | 'Purchase'
  | 'Miscellaneous';
export type ExpenseStatus = 'Draft' | 'Pending' | 'Paid' | 'Rejected';

export interface FinanceCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gstin: string;
  billingAddress: string;
  city: string;
  state: string;
  openingBalance: number;
}

export interface InvoiceItem {
  id: string;
  productName: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  gstRate: number;
}

export interface Invoice {
  id: string;
  number: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupply: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerGstin: string;
  billingAddress: string;
  shippingAddress?: string;
  items: InvoiceItem[];
  paymentTerms: string;
  notes: string;
  status: InvoiceStatus;
  paidAmount: number;
  roundOff: number;
  createdAt: string;
}

export interface InvoiceLineTotal {
  itemId: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  lineTotal: number;
}

export interface InvoiceTotals {
  subtotal: number;
  discountTotal: number;
  taxableTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  roundOff: number;
  grandTotal: number;
  lines: InvoiceLineTotal[];
}

export interface Payment {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  paymentDate: string;
  amount: number;
  mode: PaymentMode;
  referenceNumber: string;
  status: PaymentStatus;
  notes: string;
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  vendor: string;
  amount: number;
  gstAmount: number;
  paymentMode: PaymentMode;
  status: ExpenseStatus;
  notes: string;
  attachmentName?: string;
}

export interface CustomerLedgerRow {
  customerId: string;
  customer: string;
  openingBalance: number;
  invoiceAmount: number;
  paidAmount: number;
  outstanding: number;
  lastPaymentDate?: string;
  status: 'Clear' | 'Outstanding' | 'Overdue';
}

export interface SupplierLedgerRow {
  id: string;
  supplier: string;
  openingBalance: number;
  purchaseAmount: number;
  paidAmount: number;
  outstanding: number;
  lastPaymentDate: string;
  status: 'Clear' | 'Outstanding';
}

export interface GSTSummary {
  taxableSales: number;
  cgstCollected: number;
  sgstCollected: number;
  igstCollected: number;
  inputGst: number;
  payableEstimate: number;
}

export interface FinanceStateShape {
  customers: FinanceCustomer[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  suppliers: SupplierLedgerRow[];
}

export type InvoiceDraft = Omit<Invoice, 'id' | 'createdAt'>;
export type PaymentDraft = Omit<Payment, 'id' | 'number' | 'customerName' | 'invoiceNumber' | 'status'>;
export type ExpenseDraft = Omit<Expense, 'id'>;
