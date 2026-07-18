# Finance, Billing, GST Invoicing, Accounts and Expenses Module Detailed UI Requirement

## Purpose
Handle GST billing, invoices, payments, expenses, accounts lite, ledgers, and financial reports.

## Sidebar
Dashboard, Invoices, GST Invoicing, Payments, Expenses, Customers Ledger, Suppliers Ledger, Accounting, Payables, Banking, Tax & Compliance, Planning & Assets, Advanced Admin, Reports, Finance Settings.

## Finance Dashboard
Widgets:
Total invoiced, Payments received, Outstanding amount, Overdue invoices, Expenses this month, Net revenue, GST payable estimate.

Charts:
Revenue vs expenses, Payment collection trend, Outstanding by customer, GST summary.

## Invoice List
Columns:
Invoice number, Customer, Invoice date, Due date, Amount, GST, Total, Paid amount, Balance, Status, Actions.

Statuses:
Draft, Sent, Partially Paid, Paid, Overdue, Cancelled.

Actions:
Create invoice, Record payment, Send invoice demo, Download PDF, Duplicate, Cancel.

## GST Invoice Form
Sections:
Business/GST details, Customer billing details, Invoice items, Tax summary, Payment terms, Notes.

Fields:
Invoice number, Invoice date, Due date, Place of supply, Customer GSTIN, Product/service, HSN/SAC, Quantity, Unit, Rate, Discount, CGST, SGST, IGST, Total, Round off, Grand total.

## Payment Collection
Fields:
Customer, Invoice, Payment date, Amount, Mode Cash/UPI/Bank Transfer/Cheque/Card, Reference number, Notes.

## Expenses
Columns:
Date, Category, Vendor, Amount, GST, Payment mode, Status, Attachment.

Categories:
Office rent, Salary, Travel, Marketing, Software, Utilities, Purchase, Miscellaneous.

## Accounts Lite
Screens:
Customer ledger, Supplier ledger, Accounting Foundation, Payables, Banking, Cash book, Bank book, Day book, Profit & loss placeholder.

## Accounting Foundation
Screens:
Chart of accounts, General ledger, Journal entries, Opening balances, Fiscal years and periods, Cost centers, Transaction locking, Audit trail.

Chart of accounts columns:
Code, Account, Type, Group, Balance, Linked module, Status.

Journal entry fields:
Journal number, Date, Source, Reference, Description, Posted by, Status, Debit lines, Credit lines, Cost center, Narration.

Fiscal controls:
Fiscal year, Period range, Period status, Locked modules, Close checklist, Lock scope, Lock owner, Lock reason.

## Payables
Screens:
Vendor bills, recurring bills, vendor credits, purchase approvals, bill matching, payments made.

Vendor bill columns:
Bill number, Vendor, Bill date, Due date, Purchase order, Subtotal, Tax, Total, Paid, Balance, Approval owner, Match status, Status.

Bill matching columns:
Match number, Bill, Purchase order, Receipt, Vendor, PO amount, Bill amount, Variance, Owner, Status.

## Banking
Screens:
Bank accounts, cash accounts, statement import, categorization rules, bank reconciliation, cheque management.

Bank account columns:
Account, Bank, Type, Last 4 digits, Statement balance, Book balance, Difference, Last sync, Status.

Reconciliation columns:
Period, Bank account, Statement balance, Book balance, Difference, Matched items, Unmatched items, Reviewer, Status.

## Tax and Compliance
Screens:
Tax rules, invoice compliance, e-invoicing and e-way bill previews, TDS/TCS, returns checklist, input credit review, tax reports.

Tax rule columns:
Rule, Tax type, Rate, Supply type, Applies to, Place of supply, Account, Status.

Invoice compliance columns:
Invoice, Customer, Invoice date, Taxable value, Tax amount, GSTIN status, Tax calculation status, IRN status, E-way bill status, Owner.

Return checklist columns:
Period, Return type, Due date, Output tax, Input credit, Payable, Owner, Status, Checklist.

## Planning and Assets
Screens:
Budgets, project accounting, payroll journals, reimbursements, fixed assets, depreciation, transfers and disposals, asset reports.

Budget columns:
Budget, Department, Owner, Fiscal year, Approved amount, Actual amount, Committed amount, Variance, Used percentage, Status.

Project accounting columns:
Project, Customer, Manager, Budget, Revenue, Cost, Billed, Unbilled, Margin, Status.

Payroll and reimbursement columns:
Payroll journal, Period, Employees, Gross pay, Deductions, Employer cost, Net pay, Posting date, Status.
Claim, Employee, Department, Submitted date, Category, Claimed amount, Approved amount, Paid date, Status.

Asset columns:
Asset tag, Name, Category, Location, Custodian, Acquisition date, Acquisition cost, Accumulated depreciation, Book value, Status.

Depreciation and disposal columns:
Asset, Period, Method, Depreciation amount, Accumulated depreciation, Book value after posting, Status.
Disposal, Asset, Date, Book value, Proceeds, Gain/loss, Status, Reason.

## Advanced Finance Admin
Screens:
Custom reports, document templates, numbering series, permissions, security controls, integrations, global settings, AI/copilot insights.

Custom report columns:
Report, Category, Source modules, Owner, Frequency, Last run, Export format, Status.

Template and numbering columns:
Template, Document type, Layout, Default terms, Last updated, Status.
Series, Document type, Prefix, Next number, Reset cycle, Branch, Status.

Permissions and security columns:
Role, Scope, Access level, Approval limit, Sensitive actions, Status.
Control, Category, Coverage, Last review, Owner, Status.

Integration and global setting columns:
Connector, Category, Connected module, Mode, Last sync, Next action, Status.
Setting, Category, Value, Scope, Owner, Status.

AI/copilot columns:
Insight, Area, Impact, Recommendation, Confidence, Status.

## Reports
Invoice report, Payment report, Outstanding report, Expense report, GST summary, Customer ledger, Profit/loss lite.

## Demo Functionality
Create invoice locally, add GST invoice items, auto-calculate CGST/SGST/IGST, record payment, mark invoice paid/partial, add expense, filter reports.

## Static UI Development Rule
Finance is being upgraded as a static UI/demo module first. Use seeded local data and local UI state only. Do not add backend APIs, database work, live bank feeds, payment gateway processing, GST return filing, e-invoice/e-way bill submission, Tally sync, BI sync, payroll posting, portal authentication, or live audit/security services in these phases.

## Accounting Blueprint Coverage Upgrade
The Accounting Management System Blueprint expands the current Finance MVP into these feature groups:
- Financial foundation: Chart of accounts, general ledger, journal entries, opening balances, fiscal years, accounting periods, multi-branch placeholders, cost centers, budgets, transaction locking, and audit trail.
- Receivables: Customers, quotes, sales orders, invoices, recurring invoices, credit notes, progress billing, payment links, online payments, collections, customer portal, and ageing reports.
- Payables: Vendors, purchase orders, vendor bills, recurring bills, vendor credits, expenses, receipt scanning, approvals, bill matching, payment processing, vendor portal, and payables reports.
- Banking: Bank accounts, feeds, statement import, auto-categorization rules, bank reconciliation, cash accounts, and cheque management.
- Tax and compliance: GST/VAT, tax rules, e-invoicing, e-way bill, TDS/TCS, tax returns, invoice management, and multi-tax previews.
- Inventory, payroll, and project accounting: Items, stock valuation, COGS, salary journals, employee advances, reimbursements, project budgets, timesheets, billing, and profitability.
- Fixed assets and reporting: Asset register, depreciation, transfers, disposals, P&L, balance sheet, cash flow, trial balance, ledgers, ageing, tax reports, custom reports, and exports.
- Customization, security, integrations, mobile and global: Custom fields/forms/templates, numbering, webhooks, REST API placeholders, roles, 2FA preview, backups, CRM/Inventory/HR/payment/bank/Tally/BI connections, multi-currency, multi-language, and localization.

## Implementation Phases

### Phase 0 - Spec and App Launcher Alignment
Status: Completed.

Scope:
- Update this module specification with the accounting blueprint roadmap.
- Fix stale app launcher state so completed Finance routes no longer appear as available-only cards after older local demo state is loaded.
- Keep Billing, GST Invoicing, Accounts, and Expenses linked to active Finance routes.

Implemented static UI:
- Finance launcher defaults changed to installed for completed Finance app cards.
- Stored launcher state now rehydrates completed Finance routes using current route definitions.
- Accounts launcher route now opens the Accounting Foundation workspace.

### Phase 1 - Accounting Foundation
Status: Completed.

Scope:
- Add Accounting Foundation page for chart of accounts, general ledger, journal entries, opening/fiscal periods, cost centers, transaction locks, and audit trail.
- Add static seeded data models for accounts, journal entries, fiscal periods, cost centers, locks, and audit events.
- Link Accounting from Finance sidebar and dashboard.

Implemented static UI:
- Accounting Foundation page with Chart of Accounts, General Ledger, Journal Entries, Periods & Locks, Cost Centers, and Audit Trail views.
- Chart of accounts model with account code, type, group, balance, status, and linked module.
- Journal entry model with debit/credit lines, source references, cost centers, posted-by user, and status.
- Fiscal period and transaction lock previews for close controls and edit restrictions.
- Cost center budget vs actual preview.
- Audit trail for accounting actions, locked-period blocks, and configuration changes.
- Finance dashboard upgraded with Accounting action and journal-entry metric.

### Phase 2 - Payables and Banking
Status: Completed.

Scope:
- Add vendor bill workflow, recurring bills, vendor credits, purchase approvals, bill matching, payments made, bank accounts, cash accounts, statement import preview, categorization rules, cheque management, and reconciliation UI.

Implemented static UI:
- Payables page with Vendor Bills, Recurring Bills, Vendor Credits, Approvals, Bill Matching, and Payments Made views.
- Vendor bill model with bill dates, due dates, PO references, subtotal/tax/total, paid amount, approval owner, match status, and lifecycle status.
- Recurring bill, vendor credit, purchase approval, bill matching, and payment-made models with seeded local data.
- Banking page with Bank Accounts, Cash Accounts, Statement Import, Categorization Rules, Reconciliation, and Cheque Management views.
- Bank account and cash account models with statement/book balances, sync/count timing, status, and review indicators.
- Statement import, categorization rule, reconciliation, and cheque instrument models with static operational status.
- Finance dashboard and sidebar linked to Payables and Banking, with open payable and bank-review metrics.

### Phase 3 - Tax and Compliance
Status: Completed.

Scope:
- Add GST/VAT rules, e-invoicing preview, e-way bill placeholder, TDS/TCS, return checklist, invoice compliance status, input credit review, and tax reporting UI.

Implemented static UI:
- Tax & Compliance page with Tax Rules, Invoice Compliance, E-Invoice & E-Way, TDS/TCS, Returns Checklist, Input Credit, and Tax Reports views.
- Tax rule model for GST, VAT, TDS, and TCS rules with rate, supply type, applicability, place of supply, account code, and status.
- Invoice compliance model with GSTIN, tax calculation, IRN, and e-way bill statuses.
- E-invoice and e-way bill preview model with acknowledgement/status placeholders, transporter, distance, and update timing.
- TDS/TCS model with section, party type, rate, threshold, deducted/collected value, payable amount, due date, and review status.
- Tax return model for GSTR and withholding returns with output tax, input credit, payable, owner, status, and checklist items.
- Input credit review model with vendor GSTIN, input GST, eligible amount, mismatch reason, and review status.
- Finance dashboard and sidebar linked to Tax & Compliance with compliance-issue metrics.

### Phase 4 - Assets, Budgets, Projects, and Payroll Accounting
Status: Completed.

Scope:
- Add budget vs actual, project profitability, payroll journals, reimbursements, fixed asset register, depreciation, transfers, disposals, and asset reports.

Implemented static UI:
- Planning & Assets page with Budgets, Project Accounting, Payroll Journals, Reimbursements, Fixed Assets, Depreciation, Transfers & Disposals, and Asset Reports views.
- Budget model with fiscal year, owner, department, approved budget, actual amount, committed amount, variance, usage progress, and status.
- Project accounting model with project code, customer, manager, budget, revenue, cost, billed/unbilled values, margin, and delivery status.
- Payroll journal and reimbursement models for static HR-to-finance accounting previews without backend payroll posting.
- Fixed asset register with asset tag, category, location, custodian, acquisition cost, accumulated depreciation, book value, and lifecycle status.
- Depreciation schedule, asset transfer, asset disposal, and asset report models with seeded local data.
- Finance dashboard and sidebar linked to Planning & Assets with asset book value and budget-alert metrics.

### Phase 5 - Advanced Finance Admin and Integrations
Status: Completed.

Scope:
- Add advanced/custom reports, templates, document numbering, permissions preview, audit/security controls, webhooks, CRM/Inventory/HR/payment gateway/bank/Tally/BI connector previews, mobile/global settings, and AI/copilot placeholders.

Implemented static UI:
- Advanced Finance Admin page with Custom Reports, Templates, Numbering, Permissions, Security, Integrations, Global Settings, and AI Copilot views.
- Advanced report model with source modules, owner, frequency, last run, export format, and report status.
- Document template and numbering series models for invoices, credit notes, vendor bills, payment advice, proforma layouts, branches, prefixes, next numbers, and reset cycles.
- Permission policy model for role scope, access level, approval limit, sensitive actions, and review status.
- Security control model for identity, exports, locked-period approvals, backup preview, and integration security controls.
- Integration connector model for CRM, Inventory, HR payroll, payment gateway, bank feed, Tally export, and BI warehouse placeholders.
- Global settings model for currency, localization, mobile approvals, regional tax profile, and webhook event catalog previews.
- AI/copilot insight model for receivables, budgets, banking, assets, and compliance recommendations using static confidence indicators.
- Finance dashboard and sidebar linked to Advanced Admin with admin-review metrics.
