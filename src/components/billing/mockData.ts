import type { Invoice } from "./types";

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-2026-001",
    clientName: "Eleanor Vance",
    clientEmail: "vance.e@nexustech.io",
    clientCompany: "Nexus Tech Solutions",
    clientAddress: "Suite 404, Silicon Towers, Austin, TX",
    amount: 4500.0,
    taxRate: 18,
    taxAmount: 810.0,
    totalAmount: 5310.0,
    status: "paid",
    issueDate: "2026-05-01",
    dueDate: "2026-05-15",
    paymentMethod: "ACH Transfer",
    items: [
      { id: "ITEM1", description: "ERP CRM Custom Integration & API Hookups", quantity: 1, unitPrice: 3000.0, total: 3000.0 },
      { id: "ITEM2", description: "Cloud Infrastructure Setup & VPC Routing", quantity: 15, unitPrice: 100.0, total: 1500.0 }
    ],
    qrCodeData: "https://pay.nexus.com/INV-2026-001",
    history: [
      { id: "H1", action: "Invoice created by system", timestamp: "2026-05-01 09:00 AM" },
      { id: "H2", action: "Sent to client (vance.e@nexustech.io)", timestamp: "2026-05-01 10:15 AM" },
      { id: "H3", action: "Payment reconciled via ACH", timestamp: "2026-05-14 04:30 PM" }
    ]
  },
  {
    id: "INV-2026-002",
    clientName: "Preston Mercer",
    clientEmail: "mercer@globex.org",
    clientCompany: "Globex Corporation Ltd",
    clientAddress: "Building 12, Industrial Boulevard, Chicago, IL",
    amount: 18000.0,
    taxRate: 18,
    taxAmount: 3240.0,
    totalAmount: 21240.0,
    status: "pending",
    issueDate: "2026-05-10",
    dueDate: "2026-06-10",
    paymentMethod: "Bank Wire",
    items: [
      { id: "ITEM3", description: "Quarterly Platform Subscription (Enterprise Enterprise Tier)", quantity: 3, unitPrice: 5000.0, total: 15000.0 },
      { id: "ITEM4", description: "Dedicated High-Speed Database Node Allocation", quantity: 1, unitPrice: 3000.0, total: 3000.0 }
    ],
    qrCodeData: "https://pay.globex.org/INV-2026-002",
    history: [
      { id: "H4", action: "Invoice created by system", timestamp: "2026-05-10 08:30 AM" },
      { id: "H5", action: "Sent to client (mercer@globex.org)", timestamp: "2026-05-10 09:12 AM" }
    ]
  },
  {
    id: "INV-2026-003",
    clientName: "Siddharth Roy",
    clientEmail: "sid.roy@auroradigital.co",
    clientCompany: "Aurora Digital Systems",
    clientAddress: "Plot 89, Phase 2, Whitefield, Bangalore, KA",
    amount: 2500.0,
    taxRate: 18,
    taxAmount: 450.0,
    totalAmount: 2950.0,
    status: "overdue",
    issueDate: "2026-04-12",
    dueDate: "2026-05-12",
    paymentMethod: "Credit Card / Stripe",
    items: [
      { id: "ITEM5", description: "Advanced HRMS Portal Implementation & Setup", quantity: 1, unitPrice: 2000.0, total: 2000.0 },
      { id: "ITEM6", description: "Custom UI Branding Theme Package", quantity: 10, unitPrice: 50.0, total: 500.0 }
    ],
    qrCodeData: "https://pay.aurora.co/INV-2026-003",
    history: [
      { id: "H6", action: "Invoice created by system", timestamp: "2026-04-12 11:00 AM" },
      { id: "H7", action: "Sent to client (sid.roy@auroradigital.co)", timestamp: "2026-04-12 11:45 AM" },
      { id: "H8", action: "Overdue alert email sent by system", timestamp: "2026-05-13 09:00 AM" }
    ]
  },
  {
    id: "INV-2026-004",
    clientName: "Miriam Vance",
    clientEmail: "miriam@umbra.net",
    clientCompany: "Umbrella Logistics Inc",
    clientAddress: "72 Racoon Drive, Sector 4, Boston, MA",
    amount: 900.0,
    taxRate: 12,
    taxAmount: 108.0,
    totalAmount: 1008.0,
    status: "draft",
    issueDate: "2026-05-18",
    dueDate: "2026-06-18",
    paymentMethod: "UPI Transfer",
    items: [
      { id: "ITEM7", description: "Minor API Patching & Custom PDF Layout Hooks", quantity: 6, unitPrice: 150.0, total: 900.0 }
    ],
    qrCodeData: "https://pay.umbra.net/INV-2026-004",
    history: [
      { id: "H9", action: "Draft invoice saved", timestamp: "2026-05-18 03:00 PM" }
    ]
  },
  {
    id: "INV-2026-005",
    clientName: "Donald Chen",
    clientEmail: "donald.c@hightower.hk",
    clientCompany: "Hightower Assets HK",
    clientAddress: "Floor 91, Tower A, Victoria Harbour, Hong Kong",
    amount: 14500.0,
    taxRate: 18,
    taxAmount: 2610.0,
    totalAmount: 17110.0,
    status: "paid",
    issueDate: "2026-05-02",
    dueDate: "2026-05-20",
    paymentMethod: "Bank Wire",
    items: [
      { id: "ITEM8", description: "B2B SaaS Procurement Portal Development", quantity: 1, unitPrice: 12000.0, total: 12000.0 },
      { id: "ITEM9", description: "Support & SLA Retention (Premium Core 24/7)", quantity: 1, unitPrice: 2500.0, total: 2500.0 }
    ],
    qrCodeData: "https://pay.hightower.hk/INV-2026-005",
    history: [
      { id: "H10", action: "Invoice created by system", timestamp: "2026-05-02 01:20 PM" },
      { id: "H11", action: "Sent to client (donald.c@hightower.hk)", timestamp: "2026-05-02 02:40 PM" },
      { id: "H12", action: "Payment reconciled via Bank Wire", timestamp: "2026-05-19 10:15 AM" }
    ]
  }
];
