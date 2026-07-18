# Full Build Order for Codex

## Current Completed
- Login exists
- App Launcher exists
- CRM baseline demo exists
- Sales/Quotations baseline demo exists
- HR static UI baseline exists; remaining polish is tracked separately

## Active Product Rule
Build UI/static demo features first. Backend API, database, authentication expansion, integrations, real communication delivery, payments, and automation execution must wait until the UI is finalized and approved.

## Next Build Order
1. CRM Phase 1 Core Upgrade from the CRM blueprint documents
2. Sales Phase 1 CPQ and Quotation Upgrade
3. CRM Phase 2 Companies, Contacts, and Customer 360
4. Sales Phase 2 Order, Invoice, and Payment Visibility
5. CRM Phase 3 Activities, Communications, Marketing, and Support
6. Sales Phase 3 Products, Price Books, Subscriptions, and Renewals
7. CRM/Sales Phase 4 Automation, Approvals, Reports, Settings, AI placeholders, and integration placeholders
8. Finance + Billing + GST UI
9. Inventory UI
10. Services UI
11. HR remaining UI polish
12. Website UI
13. Marketing UI
14. Productivity UI
15. Customization / Studio UI
16. Industry Packs UI
17. Cross-module search
18. Cross-module activity timeline
19. Demo reset and seed controls

## CRM/Sales Source Documents
- Complete_CRM_Blueprint.docx
- Enterprise_CRM_Module_Plan.docx

## Immediate Recommended Codex Run
Start with CRM Phase 1 Core Upgrade:
- Upgrade CRM dashboard metrics and panels.
- Extend lead list/form/detail for scoring, routing, duplicate risk, campaign attribution, qualification, communication timeline, and quote handoff.
- Improve pipeline cards and stage summaries.
- Upgrade follow-ups, customers, reports, and settings from baseline/demo placeholders to enterprise static UI.

Then move to Sales Phase 1 CPQ and Quotation Upgrade:
- Price book selector, product search, approval preview, margin/availability indicators, quote timeline, proposal preview, and local approval demo.

## Important Instruction
Do not build all modules in one Codex run. Build phase by phase and module by module.

Recommended Codex run:
- One phase per prompt.
- Review output.
- Test UI.
- Fix issues.
- Move to next phase.

## Why
The product is large. Phase-wise prompts create deeper, more connected UI than broad module prompts, especially for CRM/Sales where the documents describe many enterprise surfaces.
