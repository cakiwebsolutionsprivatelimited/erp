import type {
  CustomerLedgerRow,
  Expense,
  FinanceAdvancedReport,
  FinanceAssetDisposal,
  FinanceAssetReport,
  FinanceAssetTransfer,
  FinanceAuditTrail,
  FinanceBankAccount,
  FinanceBankReconciliation,
  FinanceBankStatementLine,
  FinanceBillMatch,
  FinanceBudget,
  FinanceCashAccount,
  FinanceCategorizationRule,
  FinanceChartAccount,
  FinanceChequeInstrument,
  FinanceCostCenter,
  FinanceCopilotInsight,
  FinanceDepreciationSchedule,
  FinanceDocumentTemplate,
  FinanceFiscalPeriod,
  FinanceFixedAsset,
  FinanceGlobalSetting,
  FinanceIntegrationConnector,
  FinanceJournalEntry,
  FinanceCustomer,
  FinanceNumberingSeries,
  FinancePaymentMade,
  FinancePermissionPolicy,
  FinancePayrollJournal,
  FinanceProjectAccounting,
  FinancePurchaseApproval,
  FinanceReimbursement,
  FinanceRecurringBill,
  FinanceSecurityControl,
  FinanceStateShape,
  FinanceEInvoiceRecord,
  FinanceInputCreditReview,
  FinanceInvoiceCompliance,
  FinanceTaxReport,
  FinanceTaxReturn,
  FinanceTaxRule,
  FinanceTdsTcsRule,
  FinanceTransactionLock,
  FinanceVendorBill,
  FinanceVendorCredit,
  GSTSummary,
  Invoice,
  InvoiceDraft,
  InvoiceItem,
  InvoiceStatus,
  InvoiceTotals,
  Payment,
  PaymentDraft,
  SupplierLedgerRow,
} from '@/tenant/finance/types';

export const COMPANY_STATE = 'Odisha';
export const DEMO_TODAY = '2026-06-18';

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

export const isIntraStateSupply = (placeOfSupply: string, companyState = COMPANY_STATE) =>
  placeOfSupply.trim().toLowerCase() === companyState.trim().toLowerCase();

export const calculateInvoiceTotals = (
  items: InvoiceItem[],
  placeOfSupply: string,
  companyState = COMPANY_STATE,
  roundOff = 0
): InvoiceTotals => {
  const intraState = isIntraStateSupply(placeOfSupply, companyState);
  const lines = items.map((item) => {
    const subtotal = item.quantity * item.rate;
    const taxableValue = Math.max(0, subtotal - item.discount);
    const taxValue = (taxableValue * item.gstRate) / 100;
    const cgst = intraState ? taxValue / 2 : 0;
    const sgst = intraState ? taxValue / 2 : 0;
    const igst = intraState ? 0 : taxValue;

    return {
      itemId: item.id,
      taxableValue: roundCurrency(taxableValue),
      cgst: roundCurrency(cgst),
      sgst: roundCurrency(sgst),
      igst: roundCurrency(igst),
      lineTotal: roundCurrency(taxableValue + taxValue),
    };
  });

  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.quantity * item.rate, 0));
  const discountTotal = roundCurrency(items.reduce((sum, item) => sum + item.discount, 0));
  const taxableTotal = roundCurrency(lines.reduce((sum, line) => sum + line.taxableValue, 0));
  const cgst = roundCurrency(lines.reduce((sum, line) => sum + line.cgst, 0));
  const sgst = roundCurrency(lines.reduce((sum, line) => sum + line.sgst, 0));
  const igst = roundCurrency(lines.reduce((sum, line) => sum + line.igst, 0));
  const taxTotal = roundCurrency(cgst + sgst + igst);

  return {
    subtotal,
    discountTotal,
    taxableTotal,
    cgst,
    sgst,
    igst,
    taxTotal,
    roundOff,
    grandTotal: roundCurrency(taxableTotal + taxTotal + roundOff),
    lines,
  };
};

export const getInvoiceBalance = (invoice: Invoice) => {
  const total = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, COMPANY_STATE, invoice.roundOff).grandTotal;
  return Math.max(0, roundCurrency(total - invoice.paidAmount));
};

export const deriveInvoiceStatus = (invoice: Invoice): InvoiceStatus => {
  if (invoice.status === 'Cancelled') return invoice.status;

  const total = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, COMPANY_STATE, invoice.roundOff).grandTotal;
  const balance = Math.max(0, total - invoice.paidAmount);

  if (balance <= 1) return 'Paid';
  if (invoice.paidAmount > 0) return 'Partially Paid';
  if (invoice.status === 'Draft') return invoice.status;
  if (invoice.dueDate < DEMO_TODAY) return 'Overdue';
  return invoice.status === 'Overdue' ? 'Sent' : invoice.status;
};

export const createInvoiceNumber = (invoiceCount: number) => `INV-2026-${String(invoiceCount + 1).padStart(3, '0')}`;
export const createPaymentNumber = (paymentCount: number) => `PAY-2026-${String(paymentCount + 1).padStart(3, '0')}`;

const customers: FinanceCustomer[] = [
  {
    id: 'FC-1',
    name: 'Apollo Retail Odisha',
    phone: '+91 98765 62001',
    email: 'accounts@apolloretail.example',
    gstin: '21AARCA4589D1Z7',
    billingAddress: 'Plot 12, Jaydev Vihar, Bhubaneswar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    openingBalance: 15000,
  },
  {
    id: 'FC-2',
    name: 'Kolkata Fitness Hub',
    phone: '+91 98765 62002',
    email: 'billing@fitnesshub.example',
    gstin: '19AAECF7715K1Z2',
    billingAddress: 'Salt Lake Sector V, Kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    openingBalance: 0,
  },
  {
    id: 'FC-3',
    name: 'Pune Care Clinic',
    phone: '+91 98765 62003',
    email: 'finance@punecare.example',
    gstin: '27AAGCP2042G1Z5',
    billingAddress: 'Baner Road, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    openingBalance: 8500,
  },
  {
    id: 'FC-4',
    name: 'Bengaluru Smart Classes',
    phone: '+91 98765 62004',
    email: 'admin@smartclasses.example',
    gstin: '29AAPCB1103M1Z4',
    billingAddress: 'HSR Layout, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    openingBalance: 0,
  },
  {
    id: 'FC-5',
    name: 'Delhi Distributor Mart',
    phone: '+91 98765 62005',
    email: 'payables@ddmart.example',
    gstin: '07AAGCD4509A1Z9',
    billingAddress: 'Okhla Industrial Area, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    openingBalance: 22000,
  },
  {
    id: 'FC-6',
    name: 'Cuttack Dental Care',
    phone: '+91 98765 62006',
    email: 'owner@cuttackdental.example',
    gstin: '21AAJFC9364Q1Z6',
    billingAddress: 'Buxi Bazaar, Cuttack',
    city: 'Cuttack',
    state: 'Odisha',
    openingBalance: 4000,
  },
  {
    id: 'FC-7',
    name: 'Mumbai Service Desk',
    phone: '+91 98765 62007',
    email: 'billing@mumbaiservice.example',
    gstin: '27AAKCM2319L1Z1',
    billingAddress: 'Andheri East, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    openingBalance: 0,
  },
  {
    id: 'FC-8',
    name: 'Rourkela Hardware Point',
    phone: '+91 98765 62008',
    email: 'accounts@rklhardware.example',
    gstin: '21AAGFR1012H1Z8',
    billingAddress: 'Civil Township, Rourkela',
    city: 'Rourkela',
    state: 'Odisha',
    openingBalance: 12000,
  },
];

const invoiceItems: InvoiceItem[][] = [
  [
    { id: 'I-1-1', productName: 'CRM Starter Setup', hsnSac: '998313', quantity: 1, unit: 'Project', rate: 45000, discount: 2500, gstRate: 18 },
    { id: 'I-1-2', productName: 'Monthly Support Plan', hsnSac: '998314', quantity: 2, unit: 'Month', rate: 12000, discount: 0, gstRate: 18 },
  ],
  [{ id: 'I-2-1', productName: 'GST Billing Setup', hsnSac: '998313', quantity: 1, unit: 'Project', rate: 35000, discount: 0, gstRate: 18 }],
  [
    { id: 'I-3-1', productName: 'Inventory Lite Setup', hsnSac: '998313', quantity: 1, unit: 'Project', rate: 55000, discount: 5000, gstRate: 18 },
    { id: 'I-3-2', productName: 'Barcode Scanner', hsnSac: '847190', quantity: 2, unit: 'Piece', rate: 8500, discount: 0, gstRate: 18 },
  ],
  [{ id: 'I-4-1', productName: 'Lead Automation Sprint', hsnSac: '998313', quantity: 1, unit: 'Sprint', rate: 28000, discount: 1000, gstRate: 18 }],
  [{ id: 'I-5-1', productName: 'Accounts Lite Setup', hsnSac: '998313', quantity: 1, unit: 'Project', rate: 42000, discount: 0, gstRate: 18 }],
];

const invoicePlan = [
  ['FC-1', '2026-06-02', '2026-06-17', 'Odisha', 'Paid'],
  ['FC-2', '2026-06-03', '2026-06-18', 'West Bengal', 'Partially Paid'],
  ['FC-3', '2026-06-04', '2026-06-12', 'Maharashtra', 'Overdue'],
  ['FC-4', '2026-06-05', '2026-06-20', 'Karnataka', 'Sent'],
  ['FC-5', '2026-06-06', '2026-06-21', 'Delhi', 'Draft'],
  ['FC-6', '2026-06-07', '2026-06-22', 'Odisha', 'Paid'],
  ['FC-7', '2026-06-08', '2026-06-15', 'Maharashtra', 'Partially Paid'],
  ['FC-8', '2026-06-09', '2026-06-24', 'Odisha', 'Sent'],
  ['FC-1', '2026-06-10', '2026-06-25', 'Odisha', 'Sent'],
  ['FC-2', '2026-06-11', '2026-06-16', 'West Bengal', 'Overdue'],
  ['FC-3', '2026-06-12', '2026-06-27', 'Maharashtra', 'Paid'],
  ['FC-4', '2026-06-13', '2026-06-28', 'Karnataka', 'Draft'],
  ['FC-5', '2026-06-14', '2026-06-18', 'Delhi', 'Partially Paid'],
  ['FC-6', '2026-06-15', '2026-06-30', 'Odisha', 'Sent'],
  ['FC-8', '2026-06-16', '2026-07-01', 'Odisha', 'Cancelled'],
] as const;

const paidAmountForStatus = (status: InvoiceStatus, total: number, index: number) => {
  if (status === 'Paid') return total;
  if (status === 'Partially Paid') return roundCurrency(total * (index % 2 === 0 ? 0.45 : 0.62));
  if (status === 'Overdue' && index % 2 === 0) return roundCurrency(total * 0.2);
  return 0;
};

const createInvoiceFromPlan = (plan: typeof invoicePlan[number], index: number): Invoice => {
  const customer = customers.find((item) => item.id === plan[0]) ?? customers[0];
  const items = invoiceItems[index % invoiceItems.length].map((item, itemIndex) => ({
    ...item,
    id: `I-${index + 1}-${itemIndex + 1}`,
  }));
  const status = plan[4] as InvoiceStatus;
  const baseInvoice: Invoice = {
    id: `FI-${index + 1}`,
    number: `INV-2026-${String(index + 1).padStart(3, '0')}`,
    invoiceDate: plan[1],
    dueDate: plan[2],
    placeOfSupply: plan[3],
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    customerEmail: customer.email,
    customerGstin: customer.gstin,
    billingAddress: customer.billingAddress,
    shippingAddress: customer.billingAddress,
    items,
    paymentTerms: 'Payment due within 15 days from invoice date.',
    notes: 'Thank you for your business. This is local demo invoice data.',
    status,
    paidAmount: 0,
    roundOff: 0,
    createdAt: plan[1],
  };
  const total = calculateInvoiceTotals(items, baseInvoice.placeOfSupply, COMPANY_STATE, baseInvoice.roundOff).grandTotal;
  return {
    ...baseInvoice,
    paidAmount: paidAmountForStatus(status, total, index),
  };
};

const demoInvoices = invoicePlan.map(createInvoiceFromPlan);

const demoPayments: Payment[] = demoInvoices
  .filter((invoice) => invoice.paidAmount > 0)
  .slice(0, 10)
  .map((invoice, index) => ({
    id: `FP-${index + 1}`,
    number: `PAY-2026-${String(index + 1).padStart(3, '0')}`,
    customerId: invoice.customerId,
    customerName: invoice.customerName,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    paymentDate: `2026-06-${String(8 + index).padStart(2, '0')}`,
    amount: invoice.paidAmount,
    mode: (['UPI', 'Bank Transfer', 'Cash', 'Cheque', 'Card'] as const)[index % 5],
    referenceNumber: `REF${String(24680 + index * 73)}`,
    status: 'Received',
    notes: 'Demo payment captured locally.',
  }));

const demoExpenses: Expense[] = [
  ['2026-06-01', 'Office Rent', 'Infocity Workspace', 55000, 9900, 'Bank Transfer', 'Paid'],
  ['2026-06-02', 'Software', 'CloudDesk Apps', 18000, 3240, 'Card', 'Paid'],
  ['2026-06-04', 'Marketing', 'Odisha Digital Ads', 26000, 4680, 'UPI', 'Paid'],
  ['2026-06-05', 'Travel', 'City Cab Services', 8500, 425, 'UPI', 'Pending'],
  ['2026-06-07', 'Utilities', 'TP Central Odisha', 11200, 2016, 'Bank Transfer', 'Paid'],
  ['2026-06-08', 'Purchase', 'Scanner World', 34000, 6120, 'Cheque', 'Pending'],
  ['2026-06-10', 'Salary', 'Payroll Batch', 185000, 0, 'Bank Transfer', 'Paid'],
  ['2026-06-11', 'Miscellaneous', 'Office Supplies Co.', 7200, 1296, 'Cash', 'Paid'],
  ['2026-06-12', 'Software', 'Design Tool Pro', 9500, 1710, 'Card', 'Paid'],
  ['2026-06-14', 'Marketing', 'Event Stall Vendor', 42000, 7560, 'Bank Transfer', 'Draft'],
  ['2026-06-15', 'Travel', 'Railway Bookings', 12800, 640, 'UPI', 'Paid'],
  ['2026-06-16', 'Utilities', 'Internet Provider', 6800, 1224, 'Card', 'Paid'],
].map(([date, category, vendor, amount, gstAmount, paymentMode, status], index) => ({
  id: `FE-${index + 1}`,
  date: String(date),
  category: category as Expense['category'],
  vendor: String(vendor),
  amount: Number(amount),
  gstAmount: Number(gstAmount),
  paymentMode: paymentMode as Expense['paymentMode'],
  status: status as Expense['status'],
  notes: 'Demo finance expense entry.',
  attachmentName: index % 3 === 0 ? `expense-${index + 1}.pdf` : undefined,
}));

const demoSuppliers: SupplierLedgerRow[] = [
  { id: 'SL-1', supplier: 'CloudDesk Apps', openingBalance: 0, purchaseAmount: 68000, paidAmount: 52000, outstanding: 16000, lastPaymentDate: '2026-06-13', status: 'Outstanding' },
  { id: 'SL-2', supplier: 'Scanner World', openingBalance: 10000, purchaseAmount: 94000, paidAmount: 42000, outstanding: 62000, lastPaymentDate: '2026-06-08', status: 'Outstanding' },
  { id: 'SL-3', supplier: 'Infocity Workspace', openingBalance: 0, purchaseAmount: 55000, paidAmount: 55000, outstanding: 0, lastPaymentDate: '2026-06-01', status: 'Clear' },
  { id: 'SL-4', supplier: 'Odisha Digital Ads', openingBalance: 4500, purchaseAmount: 64000, paidAmount: 52000, outstanding: 16500, lastPaymentDate: '2026-06-09', status: 'Outstanding' },
  { id: 'SL-5', supplier: 'Office Supplies Co.', openingBalance: 0, purchaseAmount: 18500, paidAmount: 18500, outstanding: 0, lastPaymentDate: '2026-06-11', status: 'Clear' },
];

const totalReceivables = demoInvoices
  .filter((invoice) => invoice.status !== 'Cancelled')
  .reduce((sum, invoice) => sum + getInvoiceBalance(invoice), 0);
const totalPayables = demoSuppliers.reduce((sum, supplier) => sum + supplier.outstanding, 0);
const firstInvoiceTotals = calculateInvoiceTotals(demoInvoices[0].items, demoInvoices[0].placeOfSupply, COMPANY_STATE, demoInvoices[0].roundOff);

const demoChartAccounts: FinanceChartAccount[] = [
  { id: 'FA-1', code: '1010', name: 'Cash on Hand', type: 'Asset', group: 'Cash and Bank', balance: 43800, status: 'Active', linkedModule: 'Payments' },
  { id: 'FA-2', code: '1020', name: 'Primary Bank Account', type: 'Asset', group: 'Cash and Bank', balance: 412650, status: 'Active', linkedModule: 'Banking' },
  { id: 'FA-3', code: '1100', name: 'Accounts Receivable', type: 'Asset', group: 'Current Assets', balance: roundCurrency(totalReceivables), status: 'Active', linkedModule: 'Invoices' },
  { id: 'FA-4', code: '1410', name: 'Input GST Credit', type: 'Asset', group: 'Tax Assets', balance: demoExpenses.filter((expense) => expense.status === 'Paid').reduce((sum, expense) => sum + expense.gstAmount, 0), status: 'Active', linkedModule: 'Expenses' },
  { id: 'FA-5', code: '1500', name: 'Inventory Valuation', type: 'Asset', group: 'Inventory', balance: 287000, status: 'Active', linkedModule: 'Inventory' },
  { id: 'FA-6', code: '1700', name: 'Office Equipment', type: 'Asset', group: 'Fixed Assets', balance: 320000, status: 'Active', linkedModule: 'Assets' },
  { id: 'FA-7', code: '2100', name: 'Accounts Payable', type: 'Liability', group: 'Current Liabilities', balance: roundCurrency(totalPayables), status: 'Active', linkedModule: 'Payables' },
  { id: 'FA-8', code: '2200', name: 'Output GST Payable', type: 'Liability', group: 'Tax Liabilities', balance: 87540, status: 'Active', linkedModule: 'GST' },
  { id: 'FA-9', code: '3100', name: 'Owner Capital', type: 'Equity', group: 'Equity', balance: 640000, status: 'Active', linkedModule: 'Opening Balances' },
  { id: 'FA-10', code: '4100', name: 'Service Revenue', type: 'Income', group: 'Revenue', balance: 684000, status: 'Active', linkedModule: 'Invoices' },
  { id: 'FA-11', code: '5100', name: 'Purchases and COGS', type: 'Expense', group: 'Direct Costs', balance: 128500, status: 'Active', linkedModule: 'Inventory' },
  { id: 'FA-12', code: '5200', name: 'Payroll Expense', type: 'Expense', group: 'Operating Expenses', balance: 185000, status: 'Active', linkedModule: 'HR Payroll' },
  { id: 'FA-13', code: '5300', name: 'Office Rent', type: 'Expense', group: 'Operating Expenses', balance: 55000, status: 'Active', linkedModule: 'Expenses' },
  { id: 'FA-14', code: '9999', name: 'Suspense Account', type: 'Liability', group: 'Control Accounts', balance: 0, status: 'Inactive', linkedModule: 'Manual Journals' },
];

const demoJournalEntries: FinanceJournalEntry[] = [
  {
    id: 'FJ-1',
    number: 'JRN-2026-001',
    date: '2026-06-02',
    source: 'GST Invoice',
    reference: 'INV-2026-001',
    description: 'Post customer invoice with output GST split.',
    status: 'Posted',
    postedBy: 'Priya Mishra',
    lines: [
      { id: 'FJL-1-1', accountCode: '1100', accountName: 'Accounts Receivable', debit: firstInvoiceTotals.grandTotal, credit: 0, costCenter: 'SALES', narration: 'Customer invoice receivable' },
      { id: 'FJL-1-2', accountCode: '4100', accountName: 'Service Revenue', debit: 0, credit: firstInvoiceTotals.taxableTotal, costCenter: 'SALES', narration: 'Service revenue booked' },
      { id: 'FJL-1-3', accountCode: '2200', accountName: 'Output GST Payable', debit: 0, credit: firstInvoiceTotals.taxTotal, costCenter: 'ADMIN', narration: 'GST output liability' },
    ],
  },
  {
    id: 'FJ-2',
    number: 'JRN-2026-002',
    date: '2026-06-08',
    source: 'Payment Receipt',
    reference: 'PAY-2026-001',
    description: 'Customer payment received into primary bank account.',
    status: 'Posted',
    postedBy: 'Accounts Team',
    lines: [
      { id: 'FJL-2-1', accountCode: '1020', accountName: 'Primary Bank Account', debit: demoPayments[0].amount, credit: 0, costCenter: 'ADMIN', narration: 'Bank receipt' },
      { id: 'FJL-2-2', accountCode: '1100', accountName: 'Accounts Receivable', debit: 0, credit: demoPayments[0].amount, costCenter: 'SALES', narration: 'Receivable cleared' },
    ],
  },
  {
    id: 'FJ-3',
    number: 'JRN-2026-003',
    date: '2026-06-01',
    source: 'Expense',
    reference: 'FE-1',
    description: 'Office rent expense with eligible input GST.',
    status: 'Posted',
    postedBy: 'Sameer Patnaik',
    lines: [
      { id: 'FJL-3-1', accountCode: '5300', accountName: 'Office Rent', debit: 55000, credit: 0, costCenter: 'ADMIN', narration: 'Monthly office rent' },
      { id: 'FJL-3-2', accountCode: '1410', accountName: 'Input GST Credit', debit: 9900, credit: 0, costCenter: 'ADMIN', narration: 'Input GST on rent' },
      { id: 'FJL-3-3', accountCode: '1020', accountName: 'Primary Bank Account', debit: 0, credit: 64900, costCenter: 'ADMIN', narration: 'Rent paid through bank' },
    ],
  },
  {
    id: 'FJ-4',
    number: 'JRN-2026-004',
    date: '2026-06-10',
    source: 'Payroll',
    reference: 'PAYROLL-JUN-01',
    description: 'Payroll journal imported from HR as a static preview.',
    status: 'Draft',
    postedBy: 'HR Finance',
    lines: [
      { id: 'FJL-4-1', accountCode: '5200', accountName: 'Payroll Expense', debit: 185000, credit: 0, costCenter: 'OPS', narration: 'June payroll expense' },
      { id: 'FJL-4-2', accountCode: '2100', accountName: 'Accounts Payable', debit: 0, credit: 185000, costCenter: 'OPS', narration: 'Salary payable preview' },
    ],
  },
  {
    id: 'FJ-5',
    number: 'JRN-2026-005',
    date: '2026-04-01',
    source: 'Opening Balance',
    reference: 'FY-2026-OPEN',
    description: 'Opening balance migration for cash, inventory, and capital.',
    status: 'Posted',
    postedBy: 'Admin',
    lines: [
      { id: 'FJL-5-1', accountCode: '1020', accountName: 'Primary Bank Account', debit: 250000, credit: 0, costCenter: 'ADMIN', narration: 'Opening bank balance' },
      { id: 'FJL-5-2', accountCode: '1500', accountName: 'Inventory Valuation', debit: 210000, credit: 0, costCenter: 'OPS', narration: 'Opening inventory valuation' },
      { id: 'FJL-5-3', accountCode: '3100', accountName: 'Owner Capital', debit: 0, credit: 460000, costCenter: 'ADMIN', narration: 'Owner capital opening entry' },
    ],
  },
];

const demoFiscalPeriods: FinanceFiscalPeriod[] = [
  { id: 'FPER-1', name: 'FY 2025-26', fiscalYear: '2025-26', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Closed', lockedModules: ['Invoices', 'Expenses', 'Journals'], closeChecklist: ['Trial balance reviewed', 'GST returns filed', 'Owner approval recorded'] },
  { id: 'FPER-2', name: 'April 2026', fiscalYear: '2026-27', startDate: '2026-04-01', endDate: '2026-04-30', status: 'Locked', lockedModules: ['Invoices', 'Expenses'], closeChecklist: ['Bank reconciliation pending', 'Expense audit complete'] },
  { id: 'FPER-3', name: 'May 2026', fiscalYear: '2026-27', startDate: '2026-05-01', endDate: '2026-05-31', status: 'Closed', lockedModules: ['Invoices', 'Expenses', 'Payments'], closeChecklist: ['GST input verified', 'Customer ageing reviewed'] },
  { id: 'FPER-4', name: 'June 2026', fiscalYear: '2026-27', startDate: '2026-06-01', endDate: '2026-06-30', status: 'Open', lockedModules: ['Opening Balances'], closeChecklist: ['Post payroll journal', 'Review payable ageing', 'Approve adjustment entries'] },
  { id: 'FPER-5', name: 'July 2026', fiscalYear: '2026-27', startDate: '2026-07-01', endDate: '2026-07-31', status: 'Open', lockedModules: [], closeChecklist: ['Configure tax calendar', 'Import July bank statement'] },
];

const demoCostCenters: FinanceCostCenter[] = [
  { id: 'FCC-1', code: 'ADMIN', name: 'Administration', owner: 'Priya Mishra', budget: 320000, actual: 184500, status: 'Active' },
  { id: 'FCC-2', code: 'SALES', name: 'Sales and CRM', owner: 'Anita Das', budget: 420000, actual: 268000, status: 'Active' },
  { id: 'FCC-3', code: 'OPS', name: 'Operations Delivery', owner: 'Rakesh Sahoo', budget: 510000, actual: 392000, status: 'Active' },
  { id: 'FCC-4', code: 'SUPPORT', name: 'Customer Support', owner: 'Sonal Das', budget: 210000, actual: 132000, status: 'Active' },
  { id: 'FCC-5', code: 'ARCHIVE', name: 'Legacy Projects', owner: 'Admin', budget: 0, actual: 0, status: 'Inactive' },
];

const demoTransactionLocks: FinanceTransactionLock[] = [
  { id: 'FTL-1', scope: 'April 2026 close', module: 'Invoices and Expenses', fromDate: '2026-04-01', toDate: '2026-04-30', status: 'Active', owner: 'Accounts Team', reason: 'Month close completed; edits require approval.' },
  { id: 'FTL-2', scope: 'FY 2025-26 statutory archive', module: 'All finance records', fromDate: '2025-04-01', toDate: '2026-03-31', status: 'Active', owner: 'Owner', reason: 'Prior fiscal year locked after return filing.' },
  { id: 'FTL-3', scope: 'June payroll review', module: 'Payroll Journals', fromDate: '2026-06-01', toDate: '2026-06-30', status: 'Scheduled', owner: 'HR Finance', reason: 'Prevent edits after payroll journal approval.' },
  { id: 'FTL-4', scope: 'May statement import', module: 'Banking', fromDate: '2026-05-01', toDate: '2026-05-31', status: 'Released', owner: 'Admin', reason: 'Bank statement review reopened for correction.' },
];

const demoAuditTrail: FinanceAuditTrail[] = [
  { id: 'FAT-1', occurredAt: '2026-06-18 17:40', actor: 'Priya Mishra', action: 'Posted journal entry', recordType: 'Journal', recordName: 'JRN-2026-003', severity: 'Info', ipAddress: '10.0.1.44' },
  { id: 'FAT-2', occurredAt: '2026-06-18 15:25', actor: 'Accounts Team', action: 'Updated chart account mapping', recordType: 'Account', recordName: 'Output GST Payable', severity: 'Warning', ipAddress: '10.0.8.21' },
  { id: 'FAT-3', occurredAt: '2026-06-18 12:10', actor: 'System', action: 'Detected unposted payroll journal', recordType: 'Journal', recordName: 'JRN-2026-004', severity: 'Warning', ipAddress: '127.0.0.1' },
  { id: 'FAT-4', occurredAt: '2026-06-17 18:05', actor: 'Admin', action: 'Locked fiscal period', recordType: 'Fiscal Period', recordName: 'May 2026', severity: 'Info', ipAddress: '10.0.1.10' },
  { id: 'FAT-5', occurredAt: '2026-06-17 11:45', actor: 'System', action: 'Blocked edit in locked period', recordType: 'Invoice', recordName: 'INV-2026-002', severity: 'Critical', ipAddress: '127.0.0.1' },
  { id: 'FAT-6', occurredAt: '2026-06-16 09:30', actor: 'Sameer Patnaik', action: 'Created opening balance entry', recordType: 'Journal', recordName: 'JRN-2026-005', severity: 'Info', ipAddress: '10.0.5.18' },
];

const demoVendorBills: FinanceVendorBill[] = [
  { id: 'FVB-1', billNumber: 'VB-2026-001', vendor: 'CloudDesk Apps', billDate: '2026-06-02', dueDate: '2026-06-17', purchaseOrderNumber: 'PO-2026-014', subtotal: 68000, tax: 12240, total: 80240, paidAmount: 52000, status: 'Partially Paid', approvalOwner: 'Sameer Patnaik', matchStatus: 'Matched' },
  { id: 'FVB-2', billNumber: 'VB-2026-002', vendor: 'Scanner World', billDate: '2026-06-08', dueDate: '2026-06-23', purchaseOrderNumber: 'PO-2026-018', subtotal: 94000, tax: 16920, total: 110920, paidAmount: 42000, status: 'Pending Approval', approvalOwner: 'Priya Mishra', matchStatus: 'Variance' },
  { id: 'FVB-3', billNumber: 'VB-2026-003', vendor: 'Infocity Workspace', billDate: '2026-06-01', dueDate: '2026-06-05', purchaseOrderNumber: 'RENT-JUN-2026', subtotal: 55000, tax: 9900, total: 64900, paidAmount: 64900, status: 'Paid', approvalOwner: 'Accounts Team', matchStatus: 'Matched' },
  { id: 'FVB-4', billNumber: 'VB-2026-004', vendor: 'Odisha Digital Ads', billDate: '2026-06-14', dueDate: '2026-06-24', purchaseOrderNumber: 'PO-2026-021', subtotal: 42000, tax: 7560, total: 49560, paidAmount: 0, status: 'Approved', approvalOwner: 'Anita Das', matchStatus: 'Pending Review' },
  { id: 'FVB-5', billNumber: 'VB-2026-005', vendor: 'Office Supplies Co.', billDate: '2026-06-11', dueDate: '2026-06-16', purchaseOrderNumber: 'PO-2026-019', subtotal: 18500, tax: 3330, total: 21830, paidAmount: 21830, status: 'Paid', approvalOwner: 'Accounts Team', matchStatus: 'Matched' },
  { id: 'FVB-6', billNumber: 'VB-2026-006', vendor: 'City Cab Services', billDate: '2026-06-05', dueDate: '2026-06-12', purchaseOrderNumber: 'EXP-TRAVEL-006', subtotal: 8500, tax: 425, total: 8925, paidAmount: 0, status: 'Overdue', approvalOwner: 'Rakesh Sahoo', matchStatus: 'Pending Review' },
];

const demoRecurringBills: FinanceRecurringBill[] = [
  { id: 'FRB-1', vendor: 'Infocity Workspace', schedule: 'Monthly on 1st', nextRun: '2026-07-01', amount: 64900, accountName: 'Office Rent', status: 'Active' },
  { id: 'FRB-2', vendor: 'CloudDesk Apps', schedule: 'Monthly on 5th', nextRun: '2026-07-05', amount: 21240, accountName: 'Software', status: 'Active' },
  { id: 'FRB-3', vendor: 'Internet Provider', schedule: 'Monthly on 16th', nextRun: '2026-07-16', amount: 8024, accountName: 'Utilities', status: 'Paused' },
  { id: 'FRB-4', vendor: 'Design Tool Pro', schedule: 'Annual', nextRun: '2027-06-12', amount: 11210, accountName: 'Software', status: 'Draft' },
];

const demoVendorCredits: FinanceVendorCredit[] = [
  { id: 'FVC-1', creditNumber: 'VC-2026-001', vendor: 'Scanner World', date: '2026-06-12', amount: 6200, availableAmount: 6200, status: 'Open', reason: 'Damaged scanner replacement credit.' },
  { id: 'FVC-2', creditNumber: 'VC-2026-002', vendor: 'CloudDesk Apps', date: '2026-06-15', amount: 3500, availableAmount: 0, status: 'Applied', reason: 'SLA service credit applied to June bill.' },
  { id: 'FVC-3', creditNumber: 'VC-2026-003', vendor: 'Office Supplies Co.', date: '2026-06-18', amount: 1200, availableAmount: 1200, status: 'Open', reason: 'Returned duplicate stationery pack.' },
];

const demoPurchaseApprovals: FinancePurchaseApproval[] = [
  { id: 'FPA-1', requestNumber: 'APR-2026-001', vendor: 'Scanner World', requestedBy: 'Inventory Manager', amount: 110920, dueDate: '2026-06-20', status: 'Escalated', approver: 'Owner', policy: 'Bills above Rs 1,00,000 need owner approval.' },
  { id: 'FPA-2', requestNumber: 'APR-2026-002', vendor: 'Odisha Digital Ads', requestedBy: 'Anita Das', amount: 49560, dueDate: '2026-06-19', status: 'Approved', approver: 'Priya Mishra', policy: 'Marketing bills require finance review.' },
  { id: 'FPA-3', requestNumber: 'APR-2026-003', vendor: 'City Cab Services', requestedBy: 'Rakesh Sahoo', amount: 8925, dueDate: '2026-06-13', status: 'Requested', approver: 'Sameer Patnaik', policy: 'Travel expenses require manager approval.' },
  { id: 'FPA-4', requestNumber: 'APR-2026-004', vendor: 'Design Tool Pro', requestedBy: 'Support Staff', amount: 11210, dueDate: '2026-06-16', status: 'Rejected', approver: 'Priya Mishra', policy: 'Duplicate software subscription detected.' },
];

const demoBillMatches: FinanceBillMatch[] = [
  { id: 'FBM-1', matchNumber: 'MATCH-2026-001', billNumber: 'VB-2026-001', purchaseOrderNumber: 'PO-2026-014', receiptNumber: 'GRN-2026-009', vendor: 'CloudDesk Apps', purchaseOrderAmount: 80240, billAmount: 80240, variance: 0, status: 'Matched', owner: 'Accounts Team' },
  { id: 'FBM-2', matchNumber: 'MATCH-2026-002', billNumber: 'VB-2026-002', purchaseOrderNumber: 'PO-2026-018', receiptNumber: 'GRN-2026-011', vendor: 'Scanner World', purchaseOrderAmount: 106200, billAmount: 110920, variance: 4720, status: 'Variance', owner: 'Priya Mishra' },
  { id: 'FBM-3', matchNumber: 'MATCH-2026-003', billNumber: 'VB-2026-004', purchaseOrderNumber: 'PO-2026-021', receiptNumber: 'Pending', vendor: 'Odisha Digital Ads', purchaseOrderAmount: 49560, billAmount: 49560, variance: 0, status: 'Pending Review', owner: 'Anita Das' },
  { id: 'FBM-4', matchNumber: 'MATCH-2026-004', billNumber: 'VB-2026-005', purchaseOrderNumber: 'PO-2026-019', receiptNumber: 'GRN-2026-010', vendor: 'Office Supplies Co.', purchaseOrderAmount: 21830, billAmount: 21830, variance: 0, status: 'Matched', owner: 'Accounts Team' },
];

const demoPaymentsMade: FinancePaymentMade[] = [
  { id: 'FPM-1', paymentNumber: 'PMT-2026-001', vendor: 'Infocity Workspace', billNumber: 'VB-2026-003', paymentDate: '2026-06-01', amount: 64900, mode: 'Bank Transfer', referenceNumber: 'UTR-RENT-0626', status: 'Reconciled' },
  { id: 'FPM-2', paymentNumber: 'PMT-2026-002', vendor: 'CloudDesk Apps', billNumber: 'VB-2026-001', paymentDate: '2026-06-13', amount: 52000, mode: 'Bank Transfer', referenceNumber: 'UTR-CLD-0613', status: 'Paid' },
  { id: 'FPM-3', paymentNumber: 'PMT-2026-003', vendor: 'Scanner World', billNumber: 'VB-2026-002', paymentDate: '2026-06-22', amount: 40000, mode: 'Cheque', referenceNumber: 'CHQ-884201', status: 'Scheduled' },
  { id: 'FPM-4', paymentNumber: 'PMT-2026-004', vendor: 'Office Supplies Co.', billNumber: 'VB-2026-005', paymentDate: '2026-06-11', amount: 21830, mode: 'UPI', referenceNumber: 'UPI-OFF-0611', status: 'Reconciled' },
];

const demoBankAccounts: FinanceBankAccount[] = [
  { id: 'FBA-1', accountName: 'Primary Current Account', bankName: 'HDFC Bank', accountType: 'Current', accountNumberLast4: '4421', balance: 412650, bookBalance: 408420, status: 'Connected', lastSyncAt: '2026-06-18 18:05' },
  { id: 'FBA-2', accountName: 'Tax Payment Account', bankName: 'ICICI Bank', accountType: 'Current', accountNumberLast4: '8840', balance: 128400, bookBalance: 128400, status: 'Manual', lastSyncAt: 'Statement import only' },
  { id: 'FBA-3', accountName: 'Collections Virtual Account', bankName: 'RazorpayX', accountType: 'Virtual', accountNumberLast4: '0198', balance: 94320, bookBalance: 91870, status: 'Needs Review', lastSyncAt: '2026-06-18 16:10' },
  { id: 'FBA-4', accountName: 'Old Salary Account', bankName: 'Axis Bank', accountType: 'Current', accountNumberLast4: '6612', balance: 0, bookBalance: 0, status: 'Inactive', lastSyncAt: '2026-03-31 18:00' },
];

const demoCashAccounts: FinanceCashAccount[] = [
  { id: 'FCA-1', accountName: 'Bhubaneswar petty cash', custodian: 'Sameer Patnaik', location: 'Bhubaneswar HQ', balance: 43800, lastCountAt: '2026-06-18 17:00', status: 'Manual' },
  { id: 'FCA-2', accountName: 'Cuttack service cash', custodian: 'Sonal Das', location: 'Cuttack Branch', balance: 12650, lastCountAt: '2026-06-17 19:15', status: 'Needs Review' },
  { id: 'FCA-3', accountName: 'Field advance float', custodian: 'Rakesh Sahoo', location: 'Field Team', balance: 22000, lastCountAt: '2026-06-16 10:30', status: 'Manual' },
];

const demoBankStatementLines: FinanceBankStatementLine[] = [
  { id: 'FSL-1', date: '2026-06-18', description: 'NEFT Apollo Retail Odisha', amount: 64210, type: 'Credit', bankAccount: 'Primary Current Account', category: 'Customer Receipt', matchedRecord: 'PAY-2026-009', status: 'Mapped' },
  { id: 'FSL-2', date: '2026-06-17', description: 'UPI Office Supplies Co.', amount: 21830, type: 'Debit', bankAccount: 'Primary Current Account', category: 'Vendor Payment', matchedRecord: 'PMT-2026-004', status: 'Mapped' },
  { id: 'FSL-3', date: '2026-06-16', description: 'BANK CHARGES MAY', amount: 590, type: 'Debit', bankAccount: 'Primary Current Account', category: 'Bank Charges', matchedRecord: 'Auto journal draft', status: 'Imported' },
  { id: 'FSL-4', date: '2026-06-15', description: 'RAZORPAY SETTLEMENT 1842', amount: 45320, type: 'Credit', bankAccount: 'Collections Virtual Account', category: 'Payment Gateway', matchedRecord: 'Needs split', status: 'Needs Review' },
  { id: 'FSL-5', date: '2026-06-13', description: 'NEFT CloudDesk Apps', amount: 52000, type: 'Debit', bankAccount: 'Primary Current Account', category: 'Vendor Payment', matchedRecord: 'PMT-2026-002', status: 'Mapped' },
  { id: 'FSL-6', date: '2026-06-12', description: 'GST CHALLAN PMT', amount: 68400, type: 'Debit', bankAccount: 'Tax Payment Account', category: 'Tax Payment', matchedRecord: 'GST-JUN-PREVIEW', status: 'Imported' },
];

const demoCategorizationRules: FinanceCategorizationRule[] = [
  { id: 'FCR-1', name: 'Vendor NEFT payments', condition: 'Description starts with NEFT and party is vendor', category: 'Vendor Payment', accountCode: '2100', confidence: 94, status: 'Active' },
  { id: 'FCR-2', name: 'Razorpay settlement', condition: 'Description contains RAZORPAY SETTLEMENT', category: 'Payment Gateway', accountCode: '1100', confidence: 86, status: 'Active' },
  { id: 'FCR-3', name: 'Bank charges auto journal', condition: 'Description contains BANK CHARGES', category: 'Bank Charges', accountCode: '5400', confidence: 78, status: 'Draft' },
  { id: 'FCR-4', name: 'GST challan payment', condition: 'Description contains GST CHALLAN', category: 'Tax Payment', accountCode: '2200', confidence: 91, status: 'Paused' },
];

const demoBankReconciliations: FinanceBankReconciliation[] = [
  { id: 'FBR-1', period: 'June 2026', bankAccount: 'Primary Current Account', statementBalance: 412650, bookBalance: 408420, difference: 4230, matchedItems: 28, unmatchedItems: 3, status: 'In Progress', reviewer: 'Priya Mishra' },
  { id: 'FBR-2', period: 'June 2026', bankAccount: 'Tax Payment Account', statementBalance: 128400, bookBalance: 128400, difference: 0, matchedItems: 8, unmatchedItems: 0, status: 'Reconciled', reviewer: 'Accounts Team' },
  { id: 'FBR-3', period: 'June 2026', bankAccount: 'Collections Virtual Account', statementBalance: 94320, bookBalance: 91870, difference: 2450, matchedItems: 18, unmatchedItems: 4, status: 'Needs Review', reviewer: 'Sameer Patnaik' },
  { id: 'FBR-4', period: 'May 2026', bankAccount: 'Primary Current Account', statementBalance: 386100, bookBalance: 386100, difference: 0, matchedItems: 41, unmatchedItems: 0, status: 'Reconciled', reviewer: 'Priya Mishra' },
];

const demoChequeInstruments: FinanceChequeInstrument[] = [
  { id: 'FCQ-1', chequeNumber: '884201', bankAccount: 'Primary Current Account', party: 'Scanner World', issueDate: '2026-06-22', amount: 40000, status: 'Issued', purpose: 'Partial payment for vendor bill VB-2026-002.' },
  { id: 'FCQ-2', chequeNumber: '884202', bankAccount: 'Primary Current Account', party: 'Odisha Digital Ads', issueDate: '2026-06-24', amount: 49560, status: 'Stopped', purpose: 'Held until campaign proof is attached.' },
  { id: 'FCQ-3', chequeNumber: '884180', bankAccount: 'Primary Current Account', party: 'Infocity Workspace', issueDate: '2026-06-01', amount: 64900, status: 'Cleared', purpose: 'Office rent payment.' },
  { id: 'FCQ-4', chequeNumber: '884155', bankAccount: 'Old Salary Account', party: 'Payroll Batch', issueDate: '2026-05-31', amount: 185000, status: 'Void', purpose: 'Migrated payroll account closure.' },
];

const complianceInvoices = demoInvoices.filter((invoice) => !['Draft', 'Cancelled'].includes(invoice.status));
const juneOutputTax = roundCurrency(
  complianceInvoices.reduce((sum, invoice) => sum + calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, COMPANY_STATE, invoice.roundOff).taxTotal, 0)
);
const juneInputCredit = roundCurrency(demoExpenses.filter((expense) => expense.status === 'Paid').reduce((sum, expense) => sum + expense.gstAmount, 0));

const demoTaxRules: FinanceTaxRule[] = [
  { id: 'FTR-1', name: 'Odisha intra-state GST 18%', taxType: 'GST', rate: 18, supplyType: 'Intra-state', appliesTo: 'Services and taxable goods', placeOfSupply: 'Odisha', accountCode: '2200', status: 'Active' },
  { id: 'FTR-2', name: 'Inter-state IGST 18%', taxType: 'GST', rate: 18, supplyType: 'Inter-state', appliesTo: 'Services and taxable goods', placeOfSupply: 'All India', accountCode: '2200', status: 'Active' },
  { id: 'FTR-3', name: 'Low-rate goods GST 5%', taxType: 'GST', rate: 5, supplyType: 'Goods', appliesTo: 'Eligible goods and consumables', placeOfSupply: 'All India', accountCode: '2200', status: 'Draft' },
  { id: 'FTR-4', name: 'Professional fees TDS', taxType: 'TDS', rate: 10, supplyType: 'Vendor withholding', appliesTo: 'Professional services', placeOfSupply: 'India', accountCode: '2300', status: 'Active' },
  { id: 'FTR-5', name: 'Sales collection TCS review', taxType: 'TCS', rate: 0.1, supplyType: 'Collection at source', appliesTo: 'Threshold-based sales', placeOfSupply: 'India', accountCode: '2400', status: 'Archived' },
];

const demoInvoiceCompliance: FinanceInvoiceCompliance[] = complianceInvoices.slice(0, 8).map((invoice, index) => {
  const totals = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, COMPANY_STATE, invoice.roundOff);
  return {
    id: `FIC-${index + 1}`,
    invoiceNumber: invoice.number,
    customer: invoice.customerName,
    invoiceDate: invoice.invoiceDate,
    taxableValue: totals.taxableTotal,
    taxAmount: totals.taxTotal,
    gstinStatus: (['Compliant', 'Compliant', 'Needs Review', 'Compliant', 'Pending', 'Compliant', 'Blocked', 'Compliant'] as const)[index],
    taxStatus: (['Compliant', 'Compliant', 'Needs Review', 'Compliant', 'Pending', 'Compliant', 'Needs Review', 'Compliant'] as const)[index],
    eInvoiceStatus: (['Generated', 'Pending', 'Generated', 'Not Required', 'Pending', 'Generated', 'Failed', 'Not Required'] as const)[index],
    eWayBillStatus: (['Generated', 'Pending', 'Not Required', 'Not Required', 'Pending', 'Generated', 'Expired', 'Not Required'] as const)[index],
    owner: (['Accounts Team', 'Priya Mishra', 'Sameer Patnaik', 'Accounts Team'] as const)[index % 4],
  };
});

const demoEInvoiceRecords: FinanceEInvoiceRecord[] = [
  { id: 'FEI-1', invoiceNumber: 'INV-2026-001', customer: 'Apollo Retail Odisha', irnStatus: 'Generated', ackNumber: 'ACK-21-2026-0001', eWayBillStatus: 'Generated', transporter: 'BlueDart', distanceKm: 18, lastUpdated: '2026-06-02 18:10' },
  { id: 'FEI-2', invoiceNumber: 'INV-2026-002', customer: 'Kolkata Fitness Hub', irnStatus: 'Pending', ackNumber: 'Pending', eWayBillStatus: 'Pending', transporter: 'Delhivery', distanceKm: 440, lastUpdated: '2026-06-03 16:45' },
  { id: 'FEI-3', invoiceNumber: 'INV-2026-003', customer: 'Pune Care Clinic', irnStatus: 'Generated', ackNumber: 'ACK-27-2026-0003', eWayBillStatus: 'Not Required', transporter: 'Digital delivery', distanceKm: 0, lastUpdated: '2026-06-04 11:30' },
  { id: 'FEI-4', invoiceNumber: 'INV-2026-007', customer: 'Mumbai Service Desk', irnStatus: 'Failed', ackNumber: 'GSTIN validation failed', eWayBillStatus: 'Expired', transporter: 'Manual courier', distanceKm: 1580, lastUpdated: '2026-06-08 15:20' },
  { id: 'FEI-5', invoiceNumber: 'INV-2026-011', customer: 'Pune Care Clinic', irnStatus: 'Generated', ackNumber: 'ACK-27-2026-0011', eWayBillStatus: 'Generated', transporter: 'DTDC', distanceKm: 1320, lastUpdated: '2026-06-12 19:00' },
];

const demoTdsTcsRules: FinanceTdsTcsRule[] = [
  { id: 'FTDS-1', section: '194J', partyType: 'Professional services', rate: 10, threshold: 30000, deductedOrCollected: 14800, payable: 9200, nextDueDate: '2026-07-07', status: 'Active' },
  { id: 'FTDS-2', section: '194C', partyType: 'Contractor payments', rate: 2, threshold: 30000, deductedOrCollected: 3800, payable: 1400, nextDueDate: '2026-07-07', status: 'Active' },
  { id: 'FTDS-3', section: '194I', partyType: 'Rent', rate: 10, threshold: 240000, deductedOrCollected: 0, payable: 0, nextDueDate: '2026-07-07', status: 'Review' },
  { id: 'FTDS-4', section: '206C(1H)', partyType: 'Sales TCS', rate: 0.1, threshold: 5000000, deductedOrCollected: 0, payable: 0, nextDueDate: '2026-07-07', status: 'Paused' },
];

const demoTaxReturns: FinanceTaxReturn[] = [
  { id: 'FRET-1', period: 'June 2026', returnType: 'GSTR-1', dueDate: '2026-07-11', outputTax: juneOutputTax, inputCredit: 0, payable: 0, owner: 'Accounts Team', status: 'In Progress', checklist: ['B2B invoices reviewed', 'Credit notes pending', 'E-invoice exceptions open'] },
  { id: 'FRET-2', period: 'June 2026', returnType: 'GSTR-3B', dueDate: '2026-07-20', outputTax: juneOutputTax, inputCredit: juneInputCredit, payable: Math.max(0, juneOutputTax - juneInputCredit), owner: 'Priya Mishra', status: 'Ready', checklist: ['Input credit matched', 'Cash ledger preview ready', 'Payment challan pending'] },
  { id: 'FRET-3', period: 'Q1 2026-27', returnType: 'TDS Return 26Q', dueDate: '2026-07-31', outputTax: 0, inputCredit: 0, payable: 10600, owner: 'Sameer Patnaik', status: 'In Progress', checklist: ['PAN validation', 'Challan mapping', 'Deductee review'] },
  { id: 'FRET-4', period: 'May 2026', returnType: 'GSTR-3B', dueDate: '2026-06-20', outputTax: 68400, inputCredit: 21940, payable: 46460, owner: 'Accounts Team', status: 'Filed', checklist: ['Filed acknowledgement stored', 'Payment challan linked'] },
  { id: 'FRET-5', period: 'April 2026', returnType: 'GSTR-1', dueDate: '2026-05-11', outputTax: 51200, inputCredit: 0, payable: 0, owner: 'Accounts Team', status: 'Overdue', checklist: ['Late fee review', 'Invoice amendment review'] },
];

const demoInputCreditReviews: FinanceInputCreditReview[] = [
  { id: 'FICR-1', billNumber: 'VB-2026-001', vendor: 'CloudDesk Apps', vendorGstin: '21AACCC4501D1Z4', billDate: '2026-06-02', inputGst: 12240, eligibleAmount: 12240, mismatchReason: 'None', status: 'Matched' },
  { id: 'FICR-2', billNumber: 'VB-2026-002', vendor: 'Scanner World', vendorGstin: '21AAECS9912L1Z3', billDate: '2026-06-08', inputGst: 16920, eligibleAmount: 12200, mismatchReason: 'Supplier GSTR-2B value lower than bill.', status: 'Mismatch' },
  { id: 'FICR-3', billNumber: 'VB-2026-003', vendor: 'Infocity Workspace', vendorGstin: '21AABCI9812K1Z8', billDate: '2026-06-01', inputGst: 9900, eligibleAmount: 9900, mismatchReason: 'None', status: 'Matched' },
  { id: 'FICR-4', billNumber: 'VB-2026-004', vendor: 'Odisha Digital Ads', vendorGstin: '21AAGCO4509N1Z6', billDate: '2026-06-14', inputGst: 7560, eligibleAmount: 0, mismatchReason: 'Campaign proof and vendor filing pending.', status: 'Pending' },
  { id: 'FICR-5', billNumber: 'EXP-TRAVEL-006', vendor: 'City Cab Services', vendorGstin: '21AAHCC7712B1Z2', billDate: '2026-06-05', inputGst: 425, eligibleAmount: 0, mismatchReason: 'Blocked credit category for local travel.', status: 'Blocked' },
];

const demoTaxReports: FinanceTaxReport[] = [
  { id: 'FTRPT-1', name: 'GST Liability Summary', category: 'GST', period: 'June 2026', metric: `Output ${roundCurrency(juneOutputTax).toLocaleString('en-IN')}`, owner: 'Priya Mishra', status: 'Ready' },
  { id: 'FTRPT-2', name: 'Input Credit Reconciliation', category: 'GST', period: 'June 2026', metric: `${demoInputCreditReviews.filter((item) => item.status === 'Mismatch').length} mismatches`, owner: 'Accounts Team', status: 'Needs Review' },
  { id: 'FTRPT-3', name: 'TDS/TCS Payable', category: 'Withholding', period: 'June 2026', metric: `Rs ${demoTdsTcsRules.reduce((sum, rule) => sum + rule.payable, 0).toLocaleString('en-IN')}`, owner: 'Sameer Patnaik', status: 'Scheduled' },
  { id: 'FTRPT-4', name: 'E-Invoice Exceptions', category: 'E-Invoice', period: 'June 2026', metric: `${demoEInvoiceRecords.filter((item) => item.irnStatus === 'Failed' || item.irnStatus === 'Pending').length} open`, owner: 'Accounts Team', status: 'Needs Review' },
  { id: 'FTRPT-5', name: 'Compliance Calendar', category: 'Returns', period: 'Q1 2026-27', metric: `${demoTaxReturns.filter((item) => item.status !== 'Filed').length} tasks`, owner: 'Owner', status: 'Ready' },
];

const demoBudgets: FinanceBudget[] = [
  { id: 'FBUD-1', name: 'Administration Operating Budget', fiscalYear: '2026-27', owner: 'Priya Mishra', department: 'Administration', budgetAmount: 420000, actualAmount: 224500, committedAmount: 82000, variance: 113500, status: 'On Track' },
  { id: 'FBUD-2', name: 'Sales and CRM Growth Budget', fiscalYear: '2026-27', owner: 'Anita Das', department: 'Sales and CRM', budgetAmount: 560000, actualAmount: 338000, committedAmount: 174000, variance: 48000, status: 'Watch' },
  { id: 'FBUD-3', name: 'Operations Delivery Budget', fiscalYear: '2026-27', owner: 'Rakesh Sahoo', department: 'Operations Delivery', budgetAmount: 640000, actualAmount: 412000, committedAmount: 188000, variance: 40000, status: 'Watch' },
  { id: 'FBUD-4', name: 'Customer Support Budget', fiscalYear: '2026-27', owner: 'Sonal Das', department: 'Customer Support', budgetAmount: 260000, actualAmount: 148000, committedAmount: 49000, variance: 63000, status: 'On Track' },
  { id: 'FBUD-5', name: 'Marketing Experiments Budget', fiscalYear: '2026-27', owner: 'Owner', department: 'Marketing', budgetAmount: 180000, actualAmount: 146000, committedAmount: 52000, variance: -18000, status: 'Over Budget' },
];

const demoProjectAccounting: FinanceProjectAccounting[] = [
  { id: 'FPROJ-1', projectCode: 'PRJ-CRM-102', projectName: 'Apollo Retail ERP Rollout', customer: 'Apollo Retail Odisha', manager: 'Rakesh Sahoo', budget: 240000, revenue: 312000, cost: 184000, billed: 226000, unbilled: 86000, margin: 128000, status: 'Active' },
  { id: 'FPROJ-2', projectCode: 'PRJ-ACC-088', projectName: 'Pune Care Clinic Migration', customer: 'Pune Care Clinic', manager: 'Priya Mishra', budget: 180000, revenue: 210000, cost: 171000, billed: 156000, unbilled: 54000, margin: 39000, status: 'At Risk' },
  { id: 'FPROJ-3', projectCode: 'PRJ-GST-041', projectName: 'GST Billing Setup', customer: 'Kolkata Fitness Hub', manager: 'Sameer Patnaik', budget: 78000, revenue: 98000, cost: 52000, billed: 98000, unbilled: 0, margin: 46000, status: 'Completed' },
  { id: 'FPROJ-4', projectCode: 'PRJ-SUP-220', projectName: 'Support Retainer Q1', customer: 'Mumbai Service Desk', manager: 'Sonal Das', budget: 96000, revenue: 132000, cost: 74000, billed: 88000, unbilled: 44000, margin: 58000, status: 'Active' },
  { id: 'FPROJ-5', projectCode: 'PRJ-INV-119', projectName: 'Inventory Upgrade Sprint', customer: 'Rourkela Hardware Point', manager: 'Rakesh Sahoo', budget: 140000, revenue: 154000, cost: 118000, billed: 72000, unbilled: 82000, margin: 36000, status: 'Paused' },
];

const demoPayrollJournals: FinancePayrollJournal[] = [
  { id: 'FPJ-1', journalNumber: 'PAY-JRN-2026-06', payrollPeriod: 'June 2026', employeeCount: 18, grossPay: 476000, deductions: 48200, employerContribution: 26400, netPay: 427800, postingDate: '2026-06-30', status: 'Approved' },
  { id: 'FPJ-2', journalNumber: 'PAY-JRN-2026-05', payrollPeriod: 'May 2026', employeeCount: 17, grossPay: 451000, deductions: 45800, employerContribution: 25200, netPay: 405200, postingDate: '2026-05-31', status: 'Posted' },
  { id: 'FPJ-3', journalNumber: 'PAY-JRN-2026-04', payrollPeriod: 'April 2026', employeeCount: 16, grossPay: 438000, deductions: 42600, employerContribution: 24400, netPay: 395400, postingDate: '2026-04-30', status: 'Posted' },
  { id: 'FPJ-4', journalNumber: 'PAY-JRN-2026-07-DRAFT', payrollPeriod: 'July 2026', employeeCount: 18, grossPay: 482000, deductions: 0, employerContribution: 0, netPay: 482000, postingDate: '2026-07-31', status: 'Draft' },
];

const demoReimbursements: FinanceReimbursement[] = [
  { id: 'FREIM-1', claimNumber: 'CLM-2026-001', employee: 'Rakesh Sahoo', department: 'Operations Delivery', submittedDate: '2026-06-10', category: 'Client travel', amount: 12800, approvedAmount: 12800, paidDate: '2026-06-16', status: 'Paid' },
  { id: 'FREIM-2', claimNumber: 'CLM-2026-002', employee: 'Sonal Das', department: 'Customer Support', submittedDate: '2026-06-12', category: 'Internet allowance', amount: 2200, approvedAmount: 2200, paidDate: 'Pending', status: 'Approved' },
  { id: 'FREIM-3', claimNumber: 'CLM-2026-003', employee: 'Anita Das', department: 'Sales and CRM', submittedDate: '2026-06-14', category: 'Event booth supplies', amount: 9200, approvedAmount: 0, paidDate: 'Pending', status: 'Submitted' },
  { id: 'FREIM-4', claimNumber: 'CLM-2026-004', employee: 'Sameer Patnaik', department: 'Administration', submittedDate: '2026-06-08', category: 'Software renewal', amount: 6500, approvedAmount: 5200, paidDate: '2026-06-15', status: 'Paid' },
  { id: 'FREIM-5', claimNumber: 'CLM-2026-005', employee: 'Field Technician', department: 'Operations Delivery', submittedDate: '2026-06-18', category: 'Fuel advance', amount: 3800, approvedAmount: 0, paidDate: 'Pending', status: 'Rejected' },
];

const demoFixedAssets: FinanceFixedAsset[] = [
  { id: 'FAS-1', assetTag: 'AST-LAP-001', name: 'MacBook Pro 14 Finance', category: 'Laptop', location: 'Bhubaneswar HQ', custodian: 'Priya Mishra', acquisitionDate: '2025-11-18', acquisitionCost: 185000, accumulatedDepreciation: 46250, bookValue: 138750, status: 'In Use' },
  { id: 'FAS-2', assetTag: 'AST-PRN-014', name: 'Barcode Label Printer', category: 'Printer', location: 'Warehouse A', custodian: 'Inventory Manager', acquisitionDate: '2026-01-10', acquisitionCost: 68000, accumulatedDepreciation: 8500, bookValue: 59500, status: 'Transferred' },
  { id: 'FAS-3', assetTag: 'AST-SCN-022', name: 'Handheld Scanner Pack', category: 'Scanner', location: 'Warehouse A', custodian: 'Rakesh Sahoo', acquisitionDate: '2026-02-04', acquisitionCost: 92000, accumulatedDepreciation: 9200, bookValue: 82800, status: 'In Use' },
  { id: 'FAS-4', assetTag: 'AST-FUR-006', name: 'Conference Room Furniture', category: 'Furniture', location: 'Bhubaneswar HQ', custodian: 'Admin', acquisitionDate: '2024-08-20', acquisitionCost: 124000, accumulatedDepreciation: 62000, bookValue: 62000, status: 'In Use' },
  { id: 'FAS-5', assetTag: 'AST-NET-011', name: 'Branch Network Router', category: 'Network', location: 'Cuttack Branch', custodian: 'Sonal Das', acquisitionDate: '2025-04-12', acquisitionCost: 42000, accumulatedDepreciation: 25200, bookValue: 16800, status: 'Under Maintenance' },
  { id: 'FAS-6', assetTag: 'AST-LAP-OLD', name: 'Legacy Support Laptop', category: 'Laptop', location: 'Disposed', custodian: 'Unassigned', acquisitionDate: '2022-05-02', acquisitionCost: 72000, accumulatedDepreciation: 72000, bookValue: 0, status: 'Disposed' },
];

const demoDepreciationSchedules: FinanceDepreciationSchedule[] = [
  { id: 'FDEP-1', assetTag: 'AST-LAP-001', assetName: 'MacBook Pro 14 Finance', period: 'June 2026', method: 'Straight line', depreciationAmount: 7700, accumulatedDepreciation: 46250, bookValueAfter: 138750, status: 'Posted' },
  { id: 'FDEP-2', assetTag: 'AST-PRN-014', assetName: 'Barcode Label Printer', period: 'June 2026', method: 'Straight line', depreciationAmount: 2800, accumulatedDepreciation: 8500, bookValueAfter: 59500, status: 'Posted' },
  { id: 'FDEP-3', assetTag: 'AST-SCN-022', assetName: 'Handheld Scanner Pack', period: 'June 2026', method: 'Straight line', depreciationAmount: 4600, accumulatedDepreciation: 9200, bookValueAfter: 82800, status: 'Scheduled' },
  { id: 'FDEP-4', assetTag: 'AST-FUR-006', assetName: 'Conference Room Furniture', period: 'June 2026', method: 'Written down value', depreciationAmount: 3100, accumulatedDepreciation: 62000, bookValueAfter: 62000, status: 'Scheduled' },
  { id: 'FDEP-5', assetTag: 'AST-NET-011', assetName: 'Branch Network Router', period: 'June 2026', method: 'Straight line', depreciationAmount: 1750, accumulatedDepreciation: 25200, bookValueAfter: 16800, status: 'Skipped' },
];

const demoAssetTransfers: FinanceAssetTransfer[] = [
  { id: 'FTRN-1', transferNumber: 'TRF-2026-001', assetTag: 'AST-PRN-014', assetName: 'Barcode Label Printer', fromLocation: 'Bhubaneswar HQ', toLocation: 'Warehouse A', requestedBy: 'Inventory Manager', transferDate: '2026-06-05', status: 'Completed' },
  { id: 'FTRN-2', transferNumber: 'TRF-2026-002', assetTag: 'AST-SCN-022', assetName: 'Handheld Scanner Pack', fromLocation: 'Warehouse A', toLocation: 'Field Team', requestedBy: 'Rakesh Sahoo', transferDate: '2026-06-20', status: 'Approved' },
  { id: 'FTRN-3', transferNumber: 'TRF-2026-003', assetTag: 'AST-NET-011', assetName: 'Branch Network Router', fromLocation: 'Cuttack Branch', toLocation: 'Repair Vendor', requestedBy: 'Sonal Das', transferDate: '2026-06-18', status: 'Requested' },
];

const demoAssetDisposals: FinanceAssetDisposal[] = [
  { id: 'FDSP-1', disposalNumber: 'DSP-2026-001', assetTag: 'AST-LAP-OLD', assetName: 'Legacy Support Laptop', disposalDate: '2026-06-12', bookValue: 0, proceeds: 8500, gainLoss: 8500, status: 'Posted', reason: 'Sold after replacement cycle.' },
  { id: 'FDSP-2', disposalNumber: 'DSP-2026-002', assetTag: 'AST-FUR-OLD', assetName: 'Old visitor chairs', disposalDate: '2026-06-25', bookValue: 4200, proceeds: 2500, gainLoss: -1700, status: 'Approved', reason: 'Office refresh and damaged upholstery.' },
  { id: 'FDSP-3', disposalNumber: 'DSP-2026-003', assetTag: 'AST-MON-009', assetName: 'Damaged monitor', disposalDate: '2026-07-02', bookValue: 3600, proceeds: 0, gainLoss: -3600, status: 'Draft', reason: 'Repair cost exceeds residual value.' },
];

const demoAssetReports: FinanceAssetReport[] = [
  { id: 'FARPT-1', name: 'Fixed Asset Register', category: 'Assets', period: 'June 2026', metric: `${demoFixedAssets.filter((asset) => asset.status !== 'Disposed').length} active assets`, owner: 'Priya Mishra', status: 'Ready' },
  { id: 'FARPT-2', name: 'Depreciation Posting Summary', category: 'Depreciation', period: 'June 2026', metric: `Rs ${demoDepreciationSchedules.reduce((sum, schedule) => sum + schedule.depreciationAmount, 0).toLocaleString('en-IN')}`, owner: 'Accounts Team', status: 'Needs Review' },
  { id: 'FARPT-3', name: 'Asset Transfer Register', category: 'Transfers', period: 'June 2026', metric: `${demoAssetTransfers.filter((transfer) => transfer.status !== 'Completed').length} open`, owner: 'Admin', status: 'Scheduled' },
  { id: 'FARPT-4', name: 'Disposal Gain/Loss Report', category: 'Disposals', period: 'Q1 2026-27', metric: `Rs ${demoAssetDisposals.reduce((sum, disposal) => sum + disposal.gainLoss, 0).toLocaleString('en-IN')}`, owner: 'Owner', status: 'Ready' },
  { id: 'FARPT-5', name: 'Budget vs Actual Summary', category: 'Budgets', period: 'FY 2026-27', metric: `${demoBudgets.filter((budget) => budget.status !== 'On Track').length} watch items`, owner: 'Priya Mishra', status: 'Ready' },
];

const demoAdvancedReports: FinanceAdvancedReport[] = [
  { id: 'FADV-1', name: 'Management MIS Pack', category: 'Executive', sourceModules: ['Invoices', 'Expenses', 'Banking', 'Assets'], owner: 'Owner', frequency: 'Monthly', lastRun: '2026-06-18 18:20', exportFormat: 'PDF + XLSX', status: 'Ready' },
  { id: 'FADV-2', name: 'Trial Balance with Cost Centers', category: 'Accounting', sourceModules: ['Chart of Accounts', 'Journals', 'Cost Centers'], owner: 'Priya Mishra', frequency: 'Weekly', lastRun: '2026-06-17 09:00', exportFormat: 'XLSX', status: 'Scheduled' },
  { id: 'FADV-3', name: 'Cash Flow Forecast', category: 'Treasury', sourceModules: ['Receivables', 'Payables', 'Banking'], owner: 'Accounts Team', frequency: 'Daily', lastRun: '2026-06-18 08:30', exportFormat: 'Dashboard', status: 'Needs Review' },
  { id: 'FADV-4', name: 'GST Audit Workbook', category: 'Compliance', sourceModules: ['Invoices', 'Tax Returns', 'Input Credit'], owner: 'Sameer Patnaik', frequency: 'Monthly', lastRun: 'Draft only', exportFormat: 'XLSX', status: 'Draft' },
  { id: 'FADV-5', name: 'Project Profitability Board', category: 'Projects', sourceModules: ['Projects', 'Timesheets', 'Invoices', 'Expenses'], owner: 'Rakesh Sahoo', frequency: 'Fortnightly', lastRun: '2026-06-16 16:45', exportFormat: 'Dashboard', status: 'Ready' },
];

const demoDocumentTemplates: FinanceDocumentTemplate[] = [
  { id: 'FTPL-1', name: 'GST Invoice Standard', documentType: 'Invoice', layout: 'Logo, GSTIN, item tax split, payment QR', defaultTerms: 'Due within 15 days', lastUpdated: '2026-06-15', status: 'Active' },
  { id: 'FTPL-2', name: 'Service Proforma Invoice', documentType: 'Proforma', layout: 'Service summary with milestone footer', defaultTerms: 'Advance 50 percent before kickoff', lastUpdated: '2026-06-12', status: 'Draft' },
  { id: 'FTPL-3', name: 'Vendor Payment Advice', documentType: 'Payment Advice', layout: 'Bank UTR, bill references, deduction notes', defaultTerms: 'Generated after payment approval', lastUpdated: '2026-06-10', status: 'Active' },
  { id: 'FTPL-4', name: 'Credit Note Classic', documentType: 'Credit Note', layout: 'Original invoice reference and tax reversal', defaultTerms: 'Adjust against open invoices', lastUpdated: '2026-05-30', status: 'Active' },
  { id: 'FTPL-5', name: 'Legacy Plain Invoice', documentType: 'Invoice', layout: 'Simple table layout', defaultTerms: 'Deprecated demo template', lastUpdated: '2026-04-01', status: 'Archived' },
];

const demoNumberingSeries: FinanceNumberingSeries[] = [
  { id: 'FNUM-1', seriesName: 'FY Invoice Series', documentType: 'Invoice', prefix: 'INV-2026-', nextNumber: '016', resetCycle: 'Financial year', branch: 'All branches', status: 'Active' },
  { id: 'FNUM-2', seriesName: 'GST Credit Notes', documentType: 'Credit Note', prefix: 'CN-2026-', nextNumber: '004', resetCycle: 'Financial year', branch: 'All branches', status: 'Active' },
  { id: 'FNUM-3', seriesName: 'Vendor Bills', documentType: 'Vendor Bill', prefix: 'VB-2026-', nextNumber: '007', resetCycle: 'Financial year', branch: 'All branches', status: 'Active' },
  { id: 'FNUM-4', seriesName: 'Asset Transfers', documentType: 'Asset Transfer', prefix: 'TRF-2026-', nextNumber: '004', resetCycle: 'Calendar year', branch: 'Operations', status: 'Needs Review' },
  { id: 'FNUM-5', seriesName: 'Old Receipt Series', documentType: 'Receipt', prefix: 'RCT-OLD-', nextNumber: '112', resetCycle: 'Manual', branch: 'Archived', status: 'Paused' },
];

const demoPermissionPolicies: FinancePermissionPolicy[] = [
  { id: 'FPOL-1', role: 'Finance Admin', scope: 'All finance records', accessLevel: 'Full access', approvalLimit: 500000, sensitiveActions: ['Post journals', 'Lock periods', 'Edit numbering'], status: 'Enabled' },
  { id: 'FPOL-2', role: 'Accounts Executive', scope: 'Invoices, payments, expenses', accessLevel: 'Create and edit', approvalLimit: 75000, sensitiveActions: ['Create invoice', 'Record payment', 'Export reports'], status: 'Enabled' },
  { id: 'FPOL-3', role: 'Department Manager', scope: 'Budgets and reimbursements', accessLevel: 'Review and approve', approvalLimit: 50000, sensitiveActions: ['Approve claim', 'View budget variance'], status: 'Restricted' },
  { id: 'FPOL-4', role: 'External Auditor', scope: 'Reports and audit trail', accessLevel: 'Read only', approvalLimit: 0, sensitiveActions: ['Download reports', 'View locked periods'], status: 'Review' },
  { id: 'FPOL-5', role: 'Sales User', scope: 'Customer invoices', accessLevel: 'Limited create', approvalLimit: 25000, sensitiveActions: ['Draft proforma', 'View customer balance'], status: 'Restricted' },
];

const demoSecurityControls: FinanceSecurityControl[] = [
  { id: 'FSEC-1', control: '2FA for finance admins', category: 'Identity', coverage: '4 of 4 admins enrolled', lastReview: '2026-06-18', owner: 'Security Admin', status: 'Enabled' },
  { id: 'FSEC-2', control: 'Sensitive export watermark', category: 'Data protection', coverage: 'Reports, ledgers, tax exports', lastReview: '2026-06-12', owner: 'Priya Mishra', status: 'Enabled' },
  { id: 'FSEC-3', control: 'Locked period edit approval', category: 'Accounting control', coverage: 'April and FY 2025-26 locks', lastReview: '2026-06-17', owner: 'Accounts Team', status: 'Enabled' },
  { id: 'FSEC-4', control: 'Backup status preview', category: 'Continuity', coverage: 'Last backup simulated at 02:00', lastReview: '2026-06-18', owner: 'Admin', status: 'Warning' },
  { id: 'FSEC-5', control: 'Legacy API key cleanup', category: 'Integration security', coverage: '2 old keys detected in demo inventory', lastReview: '2026-06-09', owner: 'Owner', status: 'Disabled' },
];

const demoIntegrationConnectors: FinanceIntegrationConnector[] = [
  { id: 'FINT-1', name: 'CRM customer sync', category: 'Internal module', connectedModule: 'CRM', mode: 'Local demo mapping', lastSync: '2026-06-18 17:45', nextAction: 'Review duplicate GSTIN rule', status: 'Connected' },
  { id: 'FINT-2', name: 'Inventory valuation sync', category: 'Internal module', connectedModule: 'Inventory', mode: 'Static valuation preview', lastSync: '2026-06-18 15:20', nextAction: 'Map COGS account', status: 'Connected' },
  { id: 'FINT-3', name: 'HR payroll journal handoff', category: 'Internal module', connectedModule: 'HR Payroll', mode: 'Draft journal preview', lastSync: '2026-06-17 20:00', nextAction: 'Approve June payroll journal', status: 'Needs Review' },
  { id: 'FINT-4', name: 'Payment gateway connector', category: 'Payments', connectedModule: 'Razorpay', mode: 'Sandbox placeholder', lastSync: 'Not connected', nextAction: 'Configure merchant credentials later', status: 'Sandbox' },
  { id: 'FINT-5', name: 'Bank feed connector', category: 'Banking', connectedModule: 'HDFC Bank', mode: 'Statement import placeholder', lastSync: 'Manual import only', nextAction: 'Enable real feed during backend phase', status: 'Not Connected' },
  { id: 'FINT-6', name: 'Tally export bridge', category: 'Accounting export', connectedModule: 'Tally', mode: 'XML export preview', lastSync: 'Draft only', nextAction: 'Finalize ledger mapping', status: 'Sandbox' },
  { id: 'FINT-7', name: 'BI warehouse feed', category: 'Analytics', connectedModule: 'Power BI', mode: 'Dashboard placeholder', lastSync: 'Not connected', nextAction: 'Define export schema', status: 'Not Connected' },
];

const demoGlobalSettings: FinanceGlobalSetting[] = [
  { id: 'FGLB-1', name: 'Base currency', category: 'Localization', value: 'INR', scope: 'Tenant', owner: 'Owner', status: 'Active' },
  { id: 'FGLB-2', name: 'Secondary currency preview', category: 'Multi-currency', value: 'USD display only', scope: 'Reports', owner: 'Priya Mishra', status: 'Draft' },
  { id: 'FGLB-3', name: 'Default language', category: 'Localization', value: 'English', scope: 'Finance workspace', owner: 'Admin', status: 'Active' },
  { id: 'FGLB-4', name: 'Mobile approval queue', category: 'Mobile', value: 'Bills, reimbursements, journals', scope: 'Managers', owner: 'Accounts Team', status: 'Review' },
  { id: 'FGLB-5', name: 'Regional tax profile', category: 'Localization', value: 'India GST with Odisha company state', scope: 'Tax engine preview', owner: 'Sameer Patnaik', status: 'Active' },
  { id: 'FGLB-6', name: 'Webhook event catalog', category: 'Automation', value: 'Invoice created, payment recorded, journal posted', scope: 'Developer preview', owner: 'Admin', status: 'Draft' },
];

const demoCopilotInsights: FinanceCopilotInsight[] = [
  { id: 'FAI-1', title: 'Prioritize overdue collections', area: 'Receivables', impact: 'Rs 1.2L open across 3 customers', recommendation: 'Start with invoices due before June 18 and customers with partial payments.', confidence: 88, status: 'Ready' },
  { id: 'FAI-2', title: 'Review marketing budget overspend', area: 'Budgets', impact: 'Rs 18,000 over plan after committed spend', recommendation: 'Hold new campaign spend until owner approval is captured.', confidence: 82, status: 'Needs Review' },
  { id: 'FAI-3', title: 'Map pending bank statement split', area: 'Banking', impact: 'Razorpay settlement has unmatched split lines', recommendation: 'Split settlement into gateway fee and customer receipt categories.', confidence: 76, status: 'Learning' },
  { id: 'FAI-4', title: 'Post scheduled depreciation', area: 'Assets', impact: '3 depreciation schedules not posted', recommendation: 'Review maintenance asset before posting June depreciation batch.', confidence: 84, status: 'Ready' },
  { id: 'FAI-5', title: 'Prepare GST return checklist', area: 'Compliance', impact: '2 e-invoice exceptions block return readiness', recommendation: 'Resolve failed IRN and pending e-way bill before GSTR-1 finalization.', confidence: 91, status: 'Ready' },
];

export const createFinanceInitialState = (): FinanceStateShape => ({
  customers,
  invoices: demoInvoices.map((invoice) => ({ ...invoice, status: deriveInvoiceStatus(invoice) })),
  payments: demoPayments,
  expenses: demoExpenses,
  suppliers: demoSuppliers,
  chartAccounts: demoChartAccounts,
  journalEntries: demoJournalEntries,
  fiscalPeriods: demoFiscalPeriods,
  costCenters: demoCostCenters,
  transactionLocks: demoTransactionLocks,
  auditTrail: demoAuditTrail,
  vendorBills: demoVendorBills,
  recurringBills: demoRecurringBills,
  vendorCredits: demoVendorCredits,
  purchaseApprovals: demoPurchaseApprovals,
  billMatches: demoBillMatches,
  paymentsMade: demoPaymentsMade,
  bankAccounts: demoBankAccounts,
  cashAccounts: demoCashAccounts,
  bankStatementLines: demoBankStatementLines,
  categorizationRules: demoCategorizationRules,
  bankReconciliations: demoBankReconciliations,
  chequeInstruments: demoChequeInstruments,
  taxRules: demoTaxRules,
  invoiceCompliance: demoInvoiceCompliance,
  eInvoiceRecords: demoEInvoiceRecords,
  tdsTcsRules: demoTdsTcsRules,
  taxReturns: demoTaxReturns,
  inputCreditReviews: demoInputCreditReviews,
  taxReports: demoTaxReports,
  budgets: demoBudgets,
  projectAccounting: demoProjectAccounting,
  payrollJournals: demoPayrollJournals,
  reimbursements: demoReimbursements,
  fixedAssets: demoFixedAssets,
  depreciationSchedules: demoDepreciationSchedules,
  assetTransfers: demoAssetTransfers,
  assetDisposals: demoAssetDisposals,
  assetReports: demoAssetReports,
  advancedReports: demoAdvancedReports,
  documentTemplates: demoDocumentTemplates,
  numberingSeries: demoNumberingSeries,
  permissionPolicies: demoPermissionPolicies,
  securityControls: demoSecurityControls,
  integrationConnectors: demoIntegrationConnectors,
  globalSettings: demoGlobalSettings,
  copilotInsights: demoCopilotInsights,
});

export const normalizeInvoiceStatus = (invoice: Invoice): Invoice => ({
  ...invoice,
  status: deriveInvoiceStatus(invoice),
});

export const applyPaymentToInvoice = (invoice: Invoice, amount: number): Invoice => {
  const total = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, COMPANY_STATE, invoice.roundOff).grandTotal;
  const paidAmount = Math.min(total, roundCurrency(invoice.paidAmount + amount));
  return normalizeInvoiceStatus({ ...invoice, paidAmount });
};

export const toInvoiceFromDraft = (draft: InvoiceDraft, id: string, createdAt: string): Invoice =>
  normalizeInvoiceStatus({ ...draft, id, createdAt });

export const toPaymentFromDraft = (
  draft: PaymentDraft,
  invoice: Invoice,
  paymentCount: number
): Payment => ({
  ...draft,
  id: `FP-${Date.now()}`,
  number: createPaymentNumber(paymentCount),
  customerName: invoice.customerName,
  invoiceNumber: invoice.number,
  status: 'Received',
});

export const buildCustomerLedgers = (state: FinanceStateShape): CustomerLedgerRow[] =>
  state.customers.map((customer) => {
    const customerInvoices = state.invoices.filter((invoice) => invoice.customerId === customer.id && invoice.status !== 'Cancelled');
    const invoiceAmount = roundCurrency(
      customerInvoices.reduce(
        (sum, invoice) => sum + calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, COMPANY_STATE, invoice.roundOff).grandTotal,
        0
      )
    );
    const paidAmount = roundCurrency(customerInvoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0));
    const outstanding = roundCurrency(customer.openingBalance + invoiceAmount - paidAmount);
    const lastPaymentDate = state.payments
      .filter((payment) => payment.customerId === customer.id && payment.status === 'Received')
      .sort((a, b) => b.paymentDate.localeCompare(a.paymentDate))[0]?.paymentDate;
    const hasOverdue = customerInvoices.some((invoice) => deriveInvoiceStatus(invoice) === 'Overdue');

    return {
      customerId: customer.id,
      customer: customer.name,
      openingBalance: customer.openingBalance,
      invoiceAmount,
      paidAmount,
      outstanding,
      lastPaymentDate,
      status: outstanding <= 1 ? 'Clear' : hasOverdue ? 'Overdue' : 'Outstanding',
    };
  });

export const calculateGSTSummary = (state: FinanceStateShape): GSTSummary => {
  const invoiceSummary = state.invoices
    .filter((invoice) => invoice.status !== 'Cancelled' && invoice.status !== 'Draft')
    .reduce(
      (summary, invoice) => {
        const totals = calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, COMPANY_STATE, invoice.roundOff);
        return {
          taxableSales: summary.taxableSales + totals.taxableTotal,
          cgstCollected: summary.cgstCollected + totals.cgst,
          sgstCollected: summary.sgstCollected + totals.sgst,
          igstCollected: summary.igstCollected + totals.igst,
        };
      },
      { taxableSales: 0, cgstCollected: 0, sgstCollected: 0, igstCollected: 0 }
    );
  const inputGst = state.expenses.filter((expense) => expense.status === 'Paid').reduce((sum, expense) => sum + expense.gstAmount, 0);
  const outputGst = invoiceSummary.cgstCollected + invoiceSummary.sgstCollected + invoiceSummary.igstCollected;

  return {
    taxableSales: roundCurrency(invoiceSummary.taxableSales),
    cgstCollected: roundCurrency(invoiceSummary.cgstCollected),
    sgstCollected: roundCurrency(invoiceSummary.sgstCollected),
    igstCollected: roundCurrency(invoiceSummary.igstCollected),
    inputGst: roundCurrency(inputGst),
    payableEstimate: roundCurrency(Math.max(0, outputGst - inputGst)),
  };
};

export const getFinanceMetrics = (state: FinanceStateShape) => {
  const activeInvoices = state.invoices.filter((invoice) => invoice.status !== 'Cancelled');
  const totalInvoiced = activeInvoices.reduce(
    (sum, invoice) => sum + calculateInvoiceTotals(invoice.items, invoice.placeOfSupply, COMPANY_STATE, invoice.roundOff).grandTotal,
    0
  );
  const paymentsReceived = state.payments
    .filter((payment) => payment.status === 'Received')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const expensesThisMonth = state.expenses
    .filter((expense) => expense.date.startsWith('2026-06') && expense.status !== 'Rejected')
    .reduce((sum, expense) => sum + expense.amount + expense.gstAmount, 0);
  const outstandingAmount = activeInvoices.reduce((sum, invoice) => sum + getInvoiceBalance(invoice), 0);
  const overdueInvoices = activeInvoices.filter((invoice) => deriveInvoiceStatus(invoice) === 'Overdue');
  const gst = calculateGSTSummary(state);

  return {
    totalInvoiced: roundCurrency(totalInvoiced),
    paymentsReceived: roundCurrency(paymentsReceived),
    outstandingAmount: roundCurrency(outstandingAmount),
    overdueCount: overdueInvoices.length,
    expensesThisMonth: roundCurrency(expensesThisMonth),
    netRevenue: roundCurrency(paymentsReceived - expensesThisMonth),
    gstPayableEstimate: gst.payableEstimate,
  };
};
