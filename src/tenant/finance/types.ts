export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';
export type PaymentStatus = 'Received' | 'Pending' | 'Failed';
export type FinanceAccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
export type FinanceAccountStatus = 'Active' | 'Inactive';
export type FinanceJournalStatus = 'Draft' | 'Posted' | 'Reversed';
export type FinancePeriodStatus = 'Open' | 'Locked' | 'Closed';
export type FinanceLockStatus = 'Active' | 'Scheduled' | 'Released';
export type FinanceAuditSeverity = 'Info' | 'Warning' | 'Critical';
export type VendorBillStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
export type RecurringBillStatus = 'Active' | 'Paused' | 'Draft';
export type VendorCreditStatus = 'Open' | 'Applied' | 'Refunded';
export type PurchaseApprovalStatus = 'Requested' | 'Approved' | 'Rejected' | 'Escalated';
export type BillMatchStatus = 'Matched' | 'Variance' | 'Pending Review';
export type PaymentMadeStatus = 'Scheduled' | 'Paid' | 'Failed' | 'Reconciled';
export type BankAccountStatus = 'Connected' | 'Manual' | 'Needs Review' | 'Inactive';
export type BankStatementStatus = 'Imported' | 'Mapped' | 'Needs Review';
export type BankRuleStatus = 'Active' | 'Draft' | 'Paused';
export type BankReconciliationStatus = 'Reconciled' | 'In Progress' | 'Needs Review';
export type ChequeStatus = 'Issued' | 'Cleared' | 'Deposited' | 'Stopped' | 'Void';
export type TaxRuleStatus = 'Active' | 'Draft' | 'Archived';
export type EInvoiceStatus = 'Generated' | 'Pending' | 'Failed' | 'Not Required';
export type EWayBillStatus = 'Generated' | 'Pending' | 'Expired' | 'Not Required';
export type ComplianceStatus = 'Compliant' | 'Needs Review' | 'Blocked' | 'Pending';
export type TdsTcsStatus = 'Active' | 'Review' | 'Paused';
export type TaxReturnStatus = 'Ready' | 'In Progress' | 'Filed' | 'Overdue';
export type InputCreditStatus = 'Matched' | 'Mismatch' | 'Blocked' | 'Pending';
export type TaxReportStatus = 'Ready' | 'Scheduled' | 'Needs Review';
export type FinanceBudgetStatus = 'On Track' | 'Watch' | 'Over Budget' | 'Closed';
export type FinanceProjectStatus = 'Active' | 'At Risk' | 'Completed' | 'Paused';
export type PayrollJournalStatus = 'Draft' | 'Approved' | 'Posted' | 'Reversed';
export type ReimbursementStatus = 'Submitted' | 'Approved' | 'Paid' | 'Rejected';
export type FixedAssetStatus = 'In Use' | 'Transferred' | 'Disposed' | 'Under Maintenance';
export type DepreciationStatus = 'Scheduled' | 'Posted' | 'Skipped';
export type AssetTransferStatus = 'Requested' | 'Approved' | 'Completed';
export type AssetDisposalStatus = 'Draft' | 'Approved' | 'Posted';
export type AssetReportStatus = 'Ready' | 'Scheduled' | 'Needs Review';
export type FinanceAdvancedReportStatus = 'Ready' | 'Scheduled' | 'Needs Review' | 'Draft';
export type FinanceTemplateStatus = 'Active' | 'Draft' | 'Archived';
export type FinanceNumberingStatus = 'Active' | 'Paused' | 'Needs Review';
export type FinancePermissionStatus = 'Enabled' | 'Restricted' | 'Review';
export type FinanceSecurityStatus = 'Enabled' | 'Warning' | 'Disabled';
export type FinanceIntegrationStatus = 'Connected' | 'Sandbox' | 'Not Connected' | 'Needs Review';
export type FinanceGlobalSettingStatus = 'Active' | 'Draft' | 'Review';
export type FinanceCopilotStatus = 'Ready' | 'Learning' | 'Needs Review';
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

export interface FinanceChartAccount {
  id: string;
  code: string;
  name: string;
  type: FinanceAccountType;
  group: string;
  parentCode?: string;
  balance: number;
  status: FinanceAccountStatus;
  linkedModule: string;
}

export interface FinanceJournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  costCenter?: string;
  narration: string;
}

export interface FinanceJournalEntry {
  id: string;
  number: string;
  date: string;
  source: string;
  reference: string;
  description: string;
  status: FinanceJournalStatus;
  postedBy: string;
  lines: FinanceJournalLine[];
}

export interface FinanceFiscalPeriod {
  id: string;
  name: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  status: FinancePeriodStatus;
  lockedModules: string[];
  closeChecklist: string[];
}

export interface FinanceCostCenter {
  id: string;
  code: string;
  name: string;
  owner: string;
  budget: number;
  actual: number;
  status: FinanceAccountStatus;
}

export interface FinanceTransactionLock {
  id: string;
  scope: string;
  module: string;
  fromDate: string;
  toDate: string;
  status: FinanceLockStatus;
  owner: string;
  reason: string;
}

export interface FinanceAuditTrail {
  id: string;
  occurredAt: string;
  actor: string;
  action: string;
  recordType: string;
  recordName: string;
  severity: FinanceAuditSeverity;
  ipAddress: string;
}

export interface FinanceVendorBill {
  id: string;
  billNumber: string;
  vendor: string;
  billDate: string;
  dueDate: string;
  purchaseOrderNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  status: VendorBillStatus;
  approvalOwner: string;
  matchStatus: BillMatchStatus;
}

export interface FinanceRecurringBill {
  id: string;
  vendor: string;
  schedule: string;
  nextRun: string;
  amount: number;
  accountName: string;
  status: RecurringBillStatus;
}

export interface FinanceVendorCredit {
  id: string;
  creditNumber: string;
  vendor: string;
  date: string;
  amount: number;
  availableAmount: number;
  status: VendorCreditStatus;
  reason: string;
}

export interface FinancePurchaseApproval {
  id: string;
  requestNumber: string;
  vendor: string;
  requestedBy: string;
  amount: number;
  dueDate: string;
  status: PurchaseApprovalStatus;
  approver: string;
  policy: string;
}

export interface FinanceBillMatch {
  id: string;
  matchNumber: string;
  billNumber: string;
  purchaseOrderNumber: string;
  receiptNumber: string;
  vendor: string;
  purchaseOrderAmount: number;
  billAmount: number;
  variance: number;
  status: BillMatchStatus;
  owner: string;
}

export interface FinancePaymentMade {
  id: string;
  paymentNumber: string;
  vendor: string;
  billNumber: string;
  paymentDate: string;
  amount: number;
  mode: PaymentMode;
  referenceNumber: string;
  status: PaymentMadeStatus;
}

export interface FinanceBankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountType: string;
  accountNumberLast4: string;
  balance: number;
  bookBalance: number;
  status: BankAccountStatus;
  lastSyncAt: string;
}

export interface FinanceCashAccount {
  id: string;
  accountName: string;
  custodian: string;
  location: string;
  balance: number;
  lastCountAt: string;
  status: BankAccountStatus;
}

export interface FinanceBankStatementLine {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit';
  bankAccount: string;
  category: string;
  matchedRecord: string;
  status: BankStatementStatus;
}

export interface FinanceCategorizationRule {
  id: string;
  name: string;
  condition: string;
  category: string;
  accountCode: string;
  confidence: number;
  status: BankRuleStatus;
}

export interface FinanceBankReconciliation {
  id: string;
  period: string;
  bankAccount: string;
  statementBalance: number;
  bookBalance: number;
  difference: number;
  matchedItems: number;
  unmatchedItems: number;
  status: BankReconciliationStatus;
  reviewer: string;
}

export interface FinanceChequeInstrument {
  id: string;
  chequeNumber: string;
  bankAccount: string;
  party: string;
  issueDate: string;
  amount: number;
  status: ChequeStatus;
  purpose: string;
}

export interface FinanceTaxRule {
  id: string;
  name: string;
  taxType: 'GST' | 'VAT' | 'TDS' | 'TCS';
  rate: number;
  supplyType: string;
  appliesTo: string;
  placeOfSupply: string;
  accountCode: string;
  status: TaxRuleStatus;
}

export interface FinanceInvoiceCompliance {
  id: string;
  invoiceNumber: string;
  customer: string;
  invoiceDate: string;
  taxableValue: number;
  taxAmount: number;
  gstinStatus: ComplianceStatus;
  taxStatus: ComplianceStatus;
  eInvoiceStatus: EInvoiceStatus;
  eWayBillStatus: EWayBillStatus;
  owner: string;
}

export interface FinanceEInvoiceRecord {
  id: string;
  invoiceNumber: string;
  customer: string;
  irnStatus: EInvoiceStatus;
  ackNumber: string;
  eWayBillStatus: EWayBillStatus;
  transporter: string;
  distanceKm: number;
  lastUpdated: string;
}

export interface FinanceTdsTcsRule {
  id: string;
  section: string;
  partyType: string;
  rate: number;
  threshold: number;
  deductedOrCollected: number;
  payable: number;
  nextDueDate: string;
  status: TdsTcsStatus;
}

export interface FinanceTaxReturn {
  id: string;
  period: string;
  returnType: string;
  dueDate: string;
  outputTax: number;
  inputCredit: number;
  payable: number;
  owner: string;
  status: TaxReturnStatus;
  checklist: string[];
}

export interface FinanceInputCreditReview {
  id: string;
  billNumber: string;
  vendor: string;
  vendorGstin: string;
  billDate: string;
  inputGst: number;
  eligibleAmount: number;
  mismatchReason: string;
  status: InputCreditStatus;
}

export interface FinanceTaxReport {
  id: string;
  name: string;
  category: string;
  period: string;
  metric: string;
  owner: string;
  status: TaxReportStatus;
}

export interface FinanceBudget {
  id: string;
  name: string;
  fiscalYear: string;
  owner: string;
  department: string;
  budgetAmount: number;
  actualAmount: number;
  committedAmount: number;
  variance: number;
  status: FinanceBudgetStatus;
}

export interface FinanceProjectAccounting {
  id: string;
  projectCode: string;
  projectName: string;
  customer: string;
  manager: string;
  budget: number;
  revenue: number;
  cost: number;
  billed: number;
  unbilled: number;
  margin: number;
  status: FinanceProjectStatus;
}

export interface FinancePayrollJournal {
  id: string;
  journalNumber: string;
  payrollPeriod: string;
  employeeCount: number;
  grossPay: number;
  deductions: number;
  employerContribution: number;
  netPay: number;
  postingDate: string;
  status: PayrollJournalStatus;
}

export interface FinanceReimbursement {
  id: string;
  claimNumber: string;
  employee: string;
  department: string;
  submittedDate: string;
  category: string;
  amount: number;
  approvedAmount: number;
  paidDate: string;
  status: ReimbursementStatus;
}

export interface FinanceFixedAsset {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  location: string;
  custodian: string;
  acquisitionDate: string;
  acquisitionCost: number;
  accumulatedDepreciation: number;
  bookValue: number;
  status: FixedAssetStatus;
}

export interface FinanceDepreciationSchedule {
  id: string;
  assetTag: string;
  assetName: string;
  period: string;
  method: string;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValueAfter: number;
  status: DepreciationStatus;
}

export interface FinanceAssetTransfer {
  id: string;
  transferNumber: string;
  assetTag: string;
  assetName: string;
  fromLocation: string;
  toLocation: string;
  requestedBy: string;
  transferDate: string;
  status: AssetTransferStatus;
}

export interface FinanceAssetDisposal {
  id: string;
  disposalNumber: string;
  assetTag: string;
  assetName: string;
  disposalDate: string;
  bookValue: number;
  proceeds: number;
  gainLoss: number;
  status: AssetDisposalStatus;
  reason: string;
}

export interface FinanceAssetReport {
  id: string;
  name: string;
  category: string;
  period: string;
  metric: string;
  owner: string;
  status: AssetReportStatus;
}

export interface FinanceAdvancedReport {
  id: string;
  name: string;
  category: string;
  sourceModules: string[];
  owner: string;
  frequency: string;
  lastRun: string;
  exportFormat: string;
  status: FinanceAdvancedReportStatus;
}

export interface FinanceDocumentTemplate {
  id: string;
  name: string;
  documentType: string;
  layout: string;
  defaultTerms: string;
  lastUpdated: string;
  status: FinanceTemplateStatus;
}

export interface FinanceNumberingSeries {
  id: string;
  seriesName: string;
  documentType: string;
  prefix: string;
  nextNumber: string;
  resetCycle: string;
  branch: string;
  status: FinanceNumberingStatus;
}

export interface FinancePermissionPolicy {
  id: string;
  role: string;
  scope: string;
  accessLevel: string;
  approvalLimit: number;
  sensitiveActions: string[];
  status: FinancePermissionStatus;
}

export interface FinanceSecurityControl {
  id: string;
  control: string;
  category: string;
  coverage: string;
  lastReview: string;
  owner: string;
  status: FinanceSecurityStatus;
}

export interface FinanceIntegrationConnector {
  id: string;
  name: string;
  category: string;
  connectedModule: string;
  mode: string;
  lastSync: string;
  nextAction: string;
  status: FinanceIntegrationStatus;
}

export interface FinanceGlobalSetting {
  id: string;
  name: string;
  category: string;
  value: string;
  scope: string;
  owner: string;
  status: FinanceGlobalSettingStatus;
}

export interface FinanceCopilotInsight {
  id: string;
  title: string;
  area: string;
  impact: string;
  recommendation: string;
  confidence: number;
  status: FinanceCopilotStatus;
}

export interface FinanceStateShape {
  customers: FinanceCustomer[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  suppliers: SupplierLedgerRow[];
  chartAccounts: FinanceChartAccount[];
  journalEntries: FinanceJournalEntry[];
  fiscalPeriods: FinanceFiscalPeriod[];
  costCenters: FinanceCostCenter[];
  transactionLocks: FinanceTransactionLock[];
  auditTrail: FinanceAuditTrail[];
  vendorBills: FinanceVendorBill[];
  recurringBills: FinanceRecurringBill[];
  vendorCredits: FinanceVendorCredit[];
  purchaseApprovals: FinancePurchaseApproval[];
  billMatches: FinanceBillMatch[];
  paymentsMade: FinancePaymentMade[];
  bankAccounts: FinanceBankAccount[];
  cashAccounts: FinanceCashAccount[];
  bankStatementLines: FinanceBankStatementLine[];
  categorizationRules: FinanceCategorizationRule[];
  bankReconciliations: FinanceBankReconciliation[];
  chequeInstruments: FinanceChequeInstrument[];
  taxRules: FinanceTaxRule[];
  invoiceCompliance: FinanceInvoiceCompliance[];
  eInvoiceRecords: FinanceEInvoiceRecord[];
  tdsTcsRules: FinanceTdsTcsRule[];
  taxReturns: FinanceTaxReturn[];
  inputCreditReviews: FinanceInputCreditReview[];
  taxReports: FinanceTaxReport[];
  budgets: FinanceBudget[];
  projectAccounting: FinanceProjectAccounting[];
  payrollJournals: FinancePayrollJournal[];
  reimbursements: FinanceReimbursement[];
  fixedAssets: FinanceFixedAsset[];
  depreciationSchedules: FinanceDepreciationSchedule[];
  assetTransfers: FinanceAssetTransfer[];
  assetDisposals: FinanceAssetDisposal[];
  assetReports: FinanceAssetReport[];
  advancedReports: FinanceAdvancedReport[];
  documentTemplates: FinanceDocumentTemplate[];
  numberingSeries: FinanceNumberingSeries[];
  permissionPolicies: FinancePermissionPolicy[];
  securityControls: FinanceSecurityControl[];
  integrationConnectors: FinanceIntegrationConnector[];
  globalSettings: FinanceGlobalSetting[];
  copilotInsights: FinanceCopilotInsight[];
}

export type InvoiceDraft = Omit<Invoice, 'id' | 'createdAt'>;
export type PaymentDraft = Omit<Payment, 'id' | 'number' | 'customerName' | 'invoiceNumber' | 'status'>;
export type ExpenseDraft = Omit<Expense, 'id'>;
