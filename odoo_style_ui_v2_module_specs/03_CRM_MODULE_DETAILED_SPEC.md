# CRM Module Detailed UI Requirement

## Source Documents
- Complete_CRM_Blueprint.docx
- Enterprise_CRM_Module_Plan.docx

## Build Boundary
CRM is being upgraded as a static UI/demo module first. All screens must work with seeded local data and local UI state only. Do not add backend APIs, authentication changes, database work, real email/SMS/WhatsApp delivery, payment processing, or third-party integrations in this phase.

## Purpose
Create an enterprise SaaS CRM experience that supports lead-to-revenue workflows: lead capture, qualification, assignment, scoring, opportunities, activities, customer 360, quotations handoff, reports, automation previews, and admin configuration.

## Current UI Baseline
Already present:
- CRM Dashboard
- Leads list, lead create/edit form, lead detail
- Pipeline kanban
- Follow-up calendar
- Customers list and customer detail
- Activities timeline/list
- CRM quotations placeholder
- CRM reports placeholder
- CRM settings placeholder

Main gaps from the source documents:
- Separate Companies and Contacts experiences are missing.
- Lead scoring, duplicate detection, assignment routing, source/campaign attribution, and qualification depth are not yet visible.
- Pipeline is lead-based only; enterprise opportunities/deals need their own opportunity fields and forecasting context.
- Customer 360 tabs are mostly placeholders.
- Omnichannel communication, marketing, support, workflow automation, approvals, AI assistance, custom fields, roles, audit logs, API/webhook, and integration settings are not yet represented as rich UI.

## Target Sidebar
Phase 1 can keep the current sidebar, but the target CRM navigation should support:
- Dashboard
- Leads
- Companies
- Contacts
- Opportunities/Pipeline
- Activities
- Calendar/Follow-ups
- Communications
- Customers/Customer 360
- Quotations
- Campaigns
- Support
- Automation
- Reports
- CRM Settings

## Lead Lifecycle
Use this visible flow throughout the UI:
Lead -> Qualification -> Company/Contact -> Opportunity -> Activities -> Quotation -> Negotiation -> Sales Order -> Invoice -> Payment -> Customer -> Support -> Renewal/Upsell -> Referral

For the current CRM pipeline, keep the stage set:
New, Contacted, Interested, Quotation Sent, Negotiation, Won, Lost.

## Static Demo Data Additions
Extend local demo data and TypeScript types only when implementing the UI:
- Lead: capture source, source detail, campaign, score, rating, duplicate risk, routing reason, qualification status, budget, timeline count, last activity, owner team, territory, custom fields.
- Company: legal name, display name, industry, employee size, annual revenue band, GST/tax fields, addresses, parent/child relationship, owner, lifecycle status, tags.
- Contact: name, title, department, phone, email, company, decision role, preferred channel, consent flags, owner, tags.
- Opportunity: company/contact, stage, amount, probability, expected close date, forecast category, products, competitors, lost reason, next step.
- Activity: task, call, meeting, email, WhatsApp, SMS, note, owner, due date, status, outcome, related record.
- Campaign: channel, source, UTM fields, spend, leads, conversions, ROI.
- Support ticket: customer, priority, SLA, status, assignee, escalation state.
- Automation rule: trigger, conditions, actions, status, last run.

## Phase 1 - CRM Core Upgrade
Goal: make the existing CRM module feel enterprise-ready without adding backend APIs.

Screens to upgrade:
- Dashboard: add lead score distribution, pipeline by forecast category, source performance, overdue activities, conversion funnel, and top opportunities.
- Leads list: add score, rating, duplicate risk, campaign/source detail, owner team, tags, next activity, bulk assignment/change-stage/add-tag demo actions, and saved view tabs.
- Lead form: add capture method, campaign/source attribution, qualification fields, assignment/routing preview, score/rating preview, duplicate warning block, custom fields area, and attachment placeholder.
- Lead detail: add stage path, qualification panel, activity composer, communication timeline, duplicate match card, lead score explanation, conversion wizard preview, linked opportunities, and Sales quotation handoff.
- Pipeline: show opportunity-style cards with amount, weighted revenue, probability, age, next activity, owner, priority, and stage totals.
- Follow-ups/Calendar: support list/calendar switching, overdue grouping, reschedule modal UI, mark complete, activity outcome notes, and assigned-to-me filters.
- Customers: improve customer 360 overview with health, lifetime value, open opportunities, last contact, invoices placeholder, tickets placeholder, documents placeholder, and communication timeline preview.
- Reports: replace placeholder with static report panels for source conversion, stage conversion, owner performance, follow-up SLA, won/lost reasons, and forecast value.
- Settings: expand visible configuration for stages, sources, assignment rules, scoring rules, duplicate rules, custom fields, and notification templates.

Acceptance criteria:
- All Phase 1 screens are navigable from the CRM sidebar or existing CRM actions.
- Demo actions update local state where the current data provider supports it.
- Unsupported actions should still have polished UI states such as modal previews, disabled integration labels, or local-only toasts.
- No backend/API code is introduced.
- Mobile/tablet layouts must collapse dense tables into scrollable or card-friendly layouts without broken text.

## Phase 2 - Companies, Contacts and Customer 360
Goal: split account management into enterprise CRM objects while keeping the demo static.

Build:
- Companies list with filters for industry, owner, lifecycle status, region, tags, and last activity.
- Company detail with tabs: Overview, Contacts, Opportunities, Activities, Quotations, Orders/Invoices placeholder, Tickets, Documents, Notes, Timeline.
- Contacts list with company, role, title, channel, consent, owner, last activity, tags.
- Contact detail with relationship context, communication preferences, related deals, activity history, and notes.
- Relationship map UI showing company hierarchy and key stakeholders.
- Customer 360 page combining account health, revenue, opportunities, support, documents, communication, and renewal/upsell indicators.

Acceptance criteria:
- A lead can visually convert into company/contact/customer records through a UI flow.
- Customer detail no longer relies on placeholders for the main 360 overview.
- Relationship and timeline content can be mocked but must look product-ready.

## Phase 3 - Activities, Omnichannel, Marketing and Support
Goal: represent the wider CRM modules from the documents as static but credible UI.

Build:
- Activities workspace with tasks, calls, meetings, calendar, recurring follow-ups, reminders, outcome logging, and owner filters.
- Communications page with unified email, WhatsApp, SMS, call log, templates, and consent/status indicators.
- Campaigns and marketing page with lists, landing-form leads, UTM source tracking, spend, conversions, and ROI.
- Support page with tickets, SLA state, escalation indicators, knowledge base preview, and customer portal placeholder.
- Documents and notes experience for CRM records.
- Tags and segmentation manager.

Acceptance criteria:
- Every major CRM module named in the source documents has at least a rich static UI surface.
- Communication actions clearly show demo/local status and do not imply real delivery.

## Phase 4 - Enterprise Admin, Automation, Analytics and AI
Goal: add enterprise configuration surfaces and advanced CRM previews.

Build:
- Workflow automation builder with Trigger, Conditions, Actions, status, last run, and rule preview.
- Approval engine UI for high-value quotations, discounts, and special workflows.
- Roles and permissions matrix for Business Owner, CRM Admin, Sales Manager, Sales Executive, Marketing Executive, Support Executive, Read Only, External Customer, and Partner/Dealer/Distributor.
- Custom fields/layout builder using static schema examples.
- Audit logs and login history views.
- API, webhooks, and integration settings pages with disabled/demo connection states.
- Advanced analytics dashboard with forecasting, conversion funnel, activity leaderboard, SLA breach report, and export controls.
- AI assistant placeholders for lead scoring explanation, email generator, meeting summary, and sentiment analysis.

Acceptance criteria:
- Admin screens make it clear what is configurable in the future system.
- AI and integration features are visibly marked as demo previews.
- No tenant isolation, JWT, PostgreSQL, Redis, or API work is implemented during the UI phase.

## Cross-Module CRM and Sales Handoff
- CRM Lead Detail should provide Create Quotation and linked quotation visibility.
- Opportunity/Customer pages should show quotation, sales order, invoice, payment, subscription, and renewal placeholders where appropriate.
- Sales module owns full quotation/order/subscription UI. CRM may link or summarize those records.

## UI Quality Standards
- Use the current application design language and components.
- Keep dense SaaS screens quiet, structured, and scannable.
- Use icons for actions where available.
- Keep cards at 8px radius or less.
- Avoid marketing-style hero layouts inside the app.
- Tables must include clear empty states, loading-like demo states if useful, and mobile-safe overflow behavior.

## Recommended Next Implementation Step
Implement Phase 1 CRM Core Upgrade first, because it builds directly on the existing CRM pages and unlocks the most visible enterprise value before adding new Companies/Contacts pages.
