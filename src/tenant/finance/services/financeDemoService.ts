import type {
  CustomerLedgerRow,
  Expense,
  FinanceCustomer,
  FinanceStateShape,
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

export const createFinanceInitialState = (): FinanceStateShape => ({
  customers,
  invoices: demoInvoices.map((invoice) => ({ ...invoice, status: deriveInvoiceStatus(invoice) })),
  payments: demoPayments,
  expenses: demoExpenses,
  suppliers: demoSuppliers,
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
