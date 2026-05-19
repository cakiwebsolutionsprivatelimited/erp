export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceHistoryLog {
  id: string;
  action: string;
  timestamp: string;
}

export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

export interface Invoice {
  id: string; // e.g. "INV-2026-081"
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientAddress: string;
  amount: number; // Subtotal
  taxRate: number; // e.g. 18 for GST
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  paymentMethod: string;
  items: InvoiceItem[];
  qrCodeData: string; // Mock payment QR code payload
  history: InvoiceHistoryLog[];
}
