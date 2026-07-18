# Sales, Quotations and Subscriptions Module Detailed UI Requirement

## Source Documents
- Complete_CRM_Blueprint.docx
- Enterprise_CRM_Module_Plan.docx

## Build Boundary
Sales is being upgraded as a static UI/demo module first. Use seeded local data and local UI state only. Do not add backend APIs, database work, accounting sync, inventory reservation, payment gateway logic, PDF generation services, or real approval notifications in this phase.

## Purpose
Create the Sales/CPQ side of the lead-to-revenue journey: products, price books, quotations, approvals, sales orders, invoices/payment visibility, subscriptions, renewals, reporting, and CRM handoff.

## Current UI Baseline
Already present:
- Sales Dashboard
- Quotations list
- Quotation create/edit form with local GST calculation
- Quotation preview
- Duplicate/send/status/accept/reject/convert demo actions
- Sales orders table
- Products/services table
- Subscriptions table and create demo action
- Sales reports
- Sales settings

Main gaps from the source documents:
- Price books, product bundles, inventory availability indicators, quote approvals, CPQ guidance, discount/margin controls, invoice/payment tracking, and renewal/upsell flows are not yet rich UI.
- Sales orders lack detail pages and fulfillment/accounting context.
- Subscriptions are table-based only; renewal and billing schedule tabs need expansion.
- CRM handoff should be more explicit from lead/customer/opportunity to quotation and from quotation to order/invoice/payment.

## Target Sidebar
Phase 1 can keep the current sidebar, but the target Sales navigation should support:
- Dashboard
- Products/Services
- Price Books
- Quotations
- Approvals
- Sales Orders
- Invoices
- Payments
- Customers
- Subscriptions
- Renewals/Upsells
- Reports
- Sales Settings

## Revenue Workflow
Use this visible flow throughout the UI:
CRM Lead/Opportunity -> Quotation -> Approval if required -> Customer Acceptance -> Sales Order -> Invoice -> Payment -> Subscription/Renewal/Upsell

## Static Demo Data Additions
Extend local demo data and TypeScript types only when implementing the UI:
- Product/service: SKU, category, unit, tax, status, stock/availability label, recurring eligibility, bundle membership.
- Price book: name, currency, region, customer segment, effective date, product prices.
- Quotation: source lead/opportunity/customer, price book, approval status, discount reason, margin indicator, version, activity status, accepted date.
- Approval: requester, approver, amount, discount, reason, status, comments, timestamp.
- Sales order: linked quote, fulfillment state, delivery date, inventory status label, invoice status, payment status.
- Invoice/payment preview: invoice number, due date, amount, paid amount, balance, status.
- Subscription: plan, billing cycle, renewal date, MRR/ARR, renewal risk, owner, invoice schedule.

## Phase 1 - CPQ and Quotation Upgrade
Goal: turn the current quotation screens into a stronger static CPQ experience.

Screens to upgrade:
- Sales Dashboard: add quote pipeline value, approval queue, conversion funnel, revenue forecast, renewal risk, and top products.
- Quotations list: add filters for status, owner, customer, amount range, approval state, expiry, source CRM record, and saved view tabs.
- Quotation form: add price book selector, customer/source CRM panel, product search, bundle/service rows, optional recurring line flag, discount reason, margin/availability indicators, approval requirement preview, terms templates, and attachment placeholder.
- Quotation preview: improve proposal layout, show version/status timeline, approval block, acceptance block, tax summary, terms, and related CRM record.
- Quotation actions: support local demo flows for send, viewed, accepted/rejected, duplicate, request approval, approve/reject approval, convert to order.

Acceptance criteria:
- GST/tax totals still calculate locally.
- Quote status changes and conversions continue to update local state.
- Approval is a UI/demo workflow only.
- No PDF service, email service, or backend endpoint is added.

## Phase 2 - Order, Invoice and Payment Visibility
Goal: make quote-to-cash understandable in UI without building Finance backend.

Build:
- Sales order detail page with linked quotation, customer, delivery date, amount, fulfillment status, invoice status, payment status, and activity timeline.
- Order list filters for status, owner, delivery window, amount, invoice status, and payment status.
- Invoice preview table/page with invoice number, due date, tax amount, paid/balance amount, and status.
- Payment tracking panel showing due/partial/paid/overdue demo states.
- Convert quotation to order wizard that summarizes quote, customer, items, totals, delivery, and invoice placeholder.

Acceptance criteria:
- Sales owns the quote/order UI, while Finance/Billing remains placeholder-only.
- Invoice and payment states are visual/demo only.

## Phase 3 - Products, Price Books and Subscriptions
Goal: represent enterprise product catalog and recurring revenue needs.

Build:
- Product/service detail page with overview, pricing, tax, availability, quote history, and notes.
- Price Books page with customer segment, currency, effective date, and product price rows.
- Product bundle UI for grouped services/products.
- Subscription detail tabs: Overview, Billing Schedule, Invoices placeholder, Customer Notes, Activity Timeline, Renewal/Upsell.
- Renewal dashboard with renewal due, at-risk subscriptions, expansion opportunities, and owner.
- Subscription create/edit modal or page using local demo state.

Acceptance criteria:
- Subscription and renewal pages look complete even when invoice/billing integration is a placeholder.
- Product and price book data are clearly reusable from quotation creation.

## Phase 4 - Reports, Settings and Enterprise Controls
Goal: complete the enterprise Sales UI surfaces from the documents.

Build:
- Reports: quotation conversion, order summary, sales forecast, product/service sales, salesperson performance, renewal report, discount/margin report.
- Approval settings: thresholds by amount, discount, product family, role, and customer segment.
- Numbering settings: quotation, order, invoice, subscription prefixes and reset examples.
- Tax/terms settings: GST defaults, terms templates, payment terms, validity days.
- Integration placeholders: CRM, Inventory, Accounting, Payment Gateway, API, Webhooks.
- Role visibility notes for Business Owner, Sales Manager, Sales Executive, Read Only, Partner/Dealer/Distributor.

Acceptance criteria:
- Settings screens communicate future configurability without requiring backend persistence.
- Reports are useful with seeded local data and can include static chart/table summaries.

## Cross-Module CRM Handoff
- Quotation creation should be reachable from CRM Lead Detail, Customer Detail, and future Opportunity pages.
- Quotation records should show linked CRM lead/opportunity/customer context.
- Sales order, invoice, payment, subscription, and renewal summaries should be visible from Customer 360 as read-only/demo related records.

## UI Quality Standards
- Use the current app design language and components.
- Keep Sales screens dense, operational, and easy to scan.
- Use icons for compact actions and tooltips where needed.
- Keep cards at 8px radius or less.
- Do not add marketing-style landing sections inside the module.
- Tables must remain usable at tablet and mobile widths through overflow or card-like stacked views.

## Recommended Next Implementation Step
After CRM Phase 1 Core Upgrade, implement Sales Phase 1 CPQ and Quotation Upgrade so the CRM-to-quotation handoff feels complete.
