# Codex Master Prompt

You are a senior frontend architect and SaaS UI engineer.

Build a fully functional UI prototype for an Odoo-style modular SaaS business platform for Indian SMEs.

Important:
Do not copy Odoo exactly. Do not copy its exact UI, colors, icons, wording, brand identity, or layout pixel-for-pixel. Use Odoo only as inspiration for the modular app launcher, installed app experience, common business-app shell, and view patterns such as list, form, kanban, calendar, and dashboard.

Tech stack:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Lucide-style icons
- Zustand or React Context
- Demo data from local JSON/TS files
- No real backend integration yet

Product:
A modular SaaS platform for Indian SMEs with apps such as CRM, Sales, Billing, Inventory, Accounts, HRMS, Payroll, Projects, Helpdesk, Field Service, Marketing, Website, Reports, and Studio.

Current goal:
Build the tenant product UI first. It must work fully with demo data.

Build these screens:
1. Login
2. App Launcher
3. Tenant Dashboard
4. CRM Dashboard
5. CRM Leads List
6. Lead Create/Edit Form
7. Lead Detail Page
8. CRM Pipeline Kanban
9. Follow-up Calendar
10. Customers List and Detail
11. Quotations Placeholder
12. Reports Placeholder
13. Company Settings
14. Users
15. Roles and Permissions
16. Active Apps
17. Plan and Usage

Functional demo requirements:
- User can login with demo credentials.
- App launcher shows installed, available, locked, upgrade required, and coming soon apps.
- User can open CRM.
- User can view leads.
- User can add/edit/delete leads locally.
- User can drag leads between kanban stages.
- User can add notes and follow-ups to a lead.
- User can mark follow-ups complete.
- User can convert lead to customer locally.
- User can view users, roles, permissions, company settings, plan usage, and active apps.
- State should persist during browser session using local state/localStorage.

Architecture:
Create clean folders: app/, components/, modules/, data/, stores/, types/, lib/, config/.

Use reusable components:
AppShell, Topbar, Sidebar, AppSwitcher, AppCard, DataTable, KanbanBoard, StatCard, ActivityTimeline, PermissionMatrix, EmptyState, LoadingState, UpgradeModal.

Design:
Create original premium SaaS UI. Use a professional color palette. Make it clean, spacious, responsive, and easy for Indian SME users. The app should feel like a real business platform, not a static landing page.

Data:
Create realistic demo data for Indian SMEs: leads, customers, followups, activities, users, roles, apps, subscription, company.

Backend readiness:
Create a service layer so local demo data can later be replaced by Laravel APIs. Do not hard-code data directly inside UI components.

Acceptance criteria:
- Project runs successfully.
- No backend required.
- All navigation works.
- Demo data is visible.
- CRUD-like demo interactions work locally.
- Code is clean and maintainable.
- UI is responsive.
- No Odoo assets or branding copied.
