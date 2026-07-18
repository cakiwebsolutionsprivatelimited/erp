# CRM Demo App Requirements

## Goal
CRM and Sales should feel like a working enterprise SaaS demo using local seeded data only. Backend API, database, real communication delivery, payment processing, and third-party integrations come later.

## Source Scope
The UI roadmap is based on:
- Complete_CRM_Blueprint.docx
- Enterprise_CRM_Module_Plan.docx

## Current Implemented CRM Views
- Dashboard
- Leads List
- Lead Create/Edit Form
- Lead Detail
- Pipeline Kanban
- Follow-up Calendar
- Customers
- Customer Detail
- Activities
- Quotations placeholder
- Reports placeholder
- CRM Settings placeholder

## Current Implemented Sales Views
- Sales Dashboard
- Quotations
- Quotation Create/Edit
- Quotation Preview
- Sales Orders
- Products/Services
- Subscriptions
- Reports
- Settings

## Lead Workflow
New -> Contacted -> Interested -> Quotation Sent -> Negotiation -> Won / Lost

## Enterprise Lifecycle
Lead -> Qualification -> Company/Contact -> Opportunity -> Activities -> Quotation -> Negotiation -> Sales Order -> Invoice -> Payment -> Customer -> Support -> Renewal/Upsell -> Referral

## Phase 1 Demo Priority
Upgrade existing CRM screens before creating every new enterprise module:
- Dashboard with conversion funnel, forecast, source performance, overdue work, score distribution, and top opportunities.
- Leads list with score, rating, duplicate risk, campaign/source detail, owner team, tags, next activity, saved views, and richer bulk actions.
- Lead form with capture/source/campaign fields, qualification fields, assignment routing preview, score/rating preview, duplicate warning, custom fields, and attachment placeholder.
- Lead detail with stage path, qualification panel, activity composer, communication timeline, duplicate match card, score explanation, linked quote summary, and conversion wizard preview.
- Pipeline with opportunity-style cards, weighted revenue, stage totals, age, next activity, and owner.
- Follow-ups with today/week/month/overdue/assigned views, reschedule UI, completion, and outcome notes.
- Customers/Customer 360 with health, lifetime value, open opportunities, communication, tickets placeholder, invoices placeholder, documents placeholder, and renewal signals.
- Reports and settings upgraded from placeholders to static enterprise panels.

## Phase 2 Demo Priority
Add Companies and Contacts:
- Companies list/detail
- Contacts list/detail
- Relationship map
- Customer 360 improvements
- Lead conversion into company/contact/customer UI flow

## Phase 3 Demo Priority
Add broad CRM module surfaces:
- Activities workspace
- Unified Communications
- Campaigns/Marketing
- Support/Tickets/SLA
- Documents and notes
- Tags and segments

## Phase 4 Demo Priority
Add enterprise admin and intelligence previews:
- Workflow automation builder
- Approval engine
- Roles and permissions matrix
- Custom fields/layout builder
- Audit logs/login history
- API/webhook/integration settings placeholders
- Forecasting, SLA, leaderboard, and exportable report screens
- AI placeholders for lead scoring, email generator, meeting summary, and sentiment analysis

## Demo Actions
Actions that should update local state when supported:
- Add lead
- Edit lead
- Delete lead
- Change lead stage
- Drag lead in kanban
- Add note
- Add follow-up
- Mark follow-up complete
- Convert lead to customer
- Create/edit quotation
- Change quotation status
- Duplicate quotation
- Convert quotation to sales order
- Create subscription demo

Actions that may be polished UI-only until backend work:
- Import/export
- Email/SMS/WhatsApp send
- Approval notifications
- PDF generation
- Invoice/payment processing
- Inventory/accounting sync
- API/webhook test calls

## Implementation Rule
Complete UI with static/demo behavior first. Do not start backend API development until CRM and Sales UI phases are reviewed and accepted.
