# HR Module UI Development Plan - Recruitment Added

Source document: `/Users/bibhu007/Downloads/HR_Module_Development_Plan_Recruitment_Added.docx`

## Objective

Expand the existing tenant HR module into a fuller HRMS workspace for business owners, HR admins, managers, and staff. The UI should keep the current dense SaaS/ERP shell, but add stronger configuration, employee lifecycle, recruitment, payroll, approvals, reporting, and self-service surfaces.

## Current Repo State

- Active tenant HR routes exist under `/hr`: dashboard, employees, attendance, leave, payroll, departments, documents, reports, and settings.
- HR state is currently local demo state in `src/tenant/hr/HrDataProvider.tsx`, backed by types and seed data in `src/tenant/hr/types.ts` and `src/tenant/hr/hrDemoService.ts`.
- App launcher had individual HR submodule cards, but no top-level HR workspace card. Add/fix a top-level `HR` app launcher entry that routes to `/hr/dashboard`.
- Legacy HRMS files exist in `src/pages/hrms` and `src/components/hrms`, but they are not mounted in the active tenant router. Treat them as reference material only unless we intentionally migrate pieces into the tenant HR module.

## Recommended HR Navigation

Keep the current HR sidebar but grow it in stages. The final sidebar should be:

| Group | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/hr/dashboard` | Owner/HR KPIs, exceptions, approvals, quick actions |
| Employees | `/hr/employees` | Employee master, profile tabs, employment history |
| Recruitment | `/hr/recruitment` | Jobs, candidates, interviews, offers, talent pool |
| Onboarding | `/hr/onboarding` | New-hire checklist, owners, due dates |
| Attendance | `/hr/attendance` | Daily/monthly attendance, corrections, late/overtime flags |
| Shifts & Roster | `/hr/shifts` | Shift groups, rosters, branch/site assignment |
| Leave | `/hr/leave` | Applications, balances, holidays, approvals |
| Payroll | `/hr/payroll` | Salary structures, runs, payslips, releases, advances |
| Performance | `/hr/performance` | Goals, appraisal cycles, ratings, feedback |
| Documents | `/hr/documents` | Employee files, generated letters, template library |
| Assets | `/hr/assets` | Laptop/phone/ID/vehicle/tool assignment and return |
| Reports | `/hr/reports` | Attendance, leave, payroll, headcount, joining/separation |
| Settings | `/hr/settings` | Company HR setup, roles, permissions, policies, audit rules |

## Phase 1 - Navigation and Foundation Cleanup

Goal: make the existing HR module discoverable and structurally ready for expansion.

UI tasks:
- Add top-level HR app launcher card to `/hr/dashboard`.
- Keep existing cards for Employees, Attendance, Leave, and Payroll as shortcuts.
- Add `hr` to placeholder redirects so `/placeholder/hr` and old launcher flows resolve to `/hr/dashboard`.
- Decide whether to migrate useful legacy HRMS components from `src/components/hrms` into `src/tenant/hr`.
- Split very dense HR TSX pages into smaller local components where future edits will be risky.

Acceptance:
- HR dashboard opens from app launcher.
- All existing HR sidebar links resolve.
- Lint and production build pass.

## Phase 2 - HR Admin Setup

Goal: turn HR settings from simple toggles into the tenant configuration surface described in the document.

Pages and sections:
- Company HR Profile: logo, legal details, HR contact, fiscal year, payroll calendar.
- Branches/Sites: branch name, location, admin, working days, holiday calendar.
- Departments & Designations: hierarchy, department heads, reporting structure.
- Roles & Permissions: Owner, HR Admin, Manager, Staff; menu/action-level permissions.
- Leave Policies: CL, SL, EL, unpaid, maternity/paternity, comp off, carry-forward, expiry, encashment.
- Holidays: public, optional, branch-wise, special working days.
- Shift Groups: shift name, start/end, grace minutes, overtime eligibility.

Data additions:
- `Branch`, `Designation`, `RolePermission`, `LeavePolicy`, `Holiday`, `ShiftGroup`, `ApprovalChain`, `AuditLog`.

## Phase 3 - Employee Lifecycle

Goal: make employee records complete enough for HRMS operations.

Employee profile tabs:
- Overview: code, department, designation, manager, branch, employment type, status.
- Personal: DOB, gender, address, emergency contacts, government IDs.
- Bank & Payroll: bank details, salary basis, structure, revision history.
- Documents: uploads, verification status, expiry.
- Attendance: summary, monthly calendar, correction history.
- Leave: balances, applications, approvals.
- Performance: goals, reviews, manager feedback.
- Assets: assigned devices/tools and return status.
- Timeline: audit trail and lifecycle events.

New flows:
- Add employee with onboarding checklist.
- Probation confirmation workflow.
- Employee transfer/promotion/salary revision.
- Exit/offboarding workflow with clearance and final settlement.

## Phase 4 - Attendance, Leave, and Payroll Operations

Goal: deepen the existing attendance/leave/payroll pages from demo lists into operational workbenches.

Attendance:
- Daily attendance board with exception filters: absent, late, early out, overtime, correction pending.
- Manual correction dialog with old/new value, reason, approver, audit trail.
- Monthly employee attendance matrix with export action.
- Shift-aware attendance calculation.

Leave:
- Leave balance cards per employee.
- Leave application detail drawer with approval history and comments.
- Holiday/weekend exclusion display.
- Bulk approve/reject for HR.
- Delegation when approver is absent.

Payroll:
- Salary structure builder: earnings, deductions, formula placeholders, statutory components.
- Payroll run dashboard: draft, reviewed, approved, released, locked.
- Salary slip preview/download.
- Salary release register with payment mode: bank, cash, net banking, UPI.
- Advances, emergency advances, reimbursements, repayments.
- Arrears and retro adjustment placeholders.

## Phase 5 - Recruitment and Talent Acquisition

Goal: add the recruitment pipeline requested in the document without mixing candidates into employee records.

Routes:
- `/hr/recruitment`
- `/hr/recruitment/jobs`
- `/hr/recruitment/candidates`
- `/hr/recruitment/interviews`
- `/hr/recruitment/offers`
- `/hr/recruitment/talent-pool`

Dashboard widgets:
- Open requisitions
- Active job posts
- Candidates by stage
- Interviews this week
- Offers pending approval
- Accepted candidates awaiting onboarding

Core UI surfaces:
- Job Requisitions: role, department, branch, headcount, budget, experience, approval status.
- Job Postings: internal/public visibility, career page status, application count.
- Candidate Pipeline: applied, screened, shortlisted, interview, offer, accepted, rejected.
- Candidate Profile: resume placeholder, source, tags, notes, duplicate warning, status history.
- Interview Scheduler: round, panel members, date/time, scorecard, feedback notes.
- Offer Workflow: offer details, approval step, send status, accepted/rejected status, joining date.
- Background Checks: reference check, document collection, verification status.
- Onboarding Handoff: accepted candidate creates onboarding checklist and draft employee record.
- Talent Pool: reusable candidate cards for future openings.

Data additions:
- `JobRequisition`, `JobPosting`, `Candidate`, `CandidateStage`, `InterviewRound`, `InterviewFeedback`, `Offer`, `BackgroundCheck`, `OnboardingTask`, `TalentPoolEntry`.

## Phase 6 - Staff and Manager Self-Service

Goal: separate owner/admin HR operations from employee-facing views.

Staff portal pages:
- My Profile
- My Attendance
- My Leave
- My Payroll Slips
- My Documents
- My Performance
- Advance Salary Request

Manager pages:
- Team Dashboard
- Team Attendance Exceptions
- Team Leave Approvals
- Team Performance Reviews
- Hiring Interview Assignments

UI rule:
- Staff sees only own records.
- Manager sees assigned team/department records.
- HR Admin and Owner see tenant-wide records according to permissions.

## Phase 7 - Reports, Audit, and SaaS Premium Features

Reports:
- Headcount by branch, department, designation, status.
- Attendance summary: late, absent, overtime, shift adherence.
- Leave balance and usage.
- Payroll summary: gross, deductions, net, unpaid leave, advances.
- Salary release register.
- Joining and separation report.
- Document expiry report.
- Recruitment funnel and hiring source report.
- Manager dashboard exceptions.
- Owner dashboard KPIs.

Security/audit:
- Mask salary, bank, and ID fields based on role.
- Add audit timeline for attendance edits, payroll changes, leave approvals, document generation.
- Add export/download actions as permission-controlled UI affordances.

Premium-ready UI:
- Biometric integration settings placeholder.
- Mobile attendance/geolocation settings.
- Advanced reports and BI dashboard card.
- Automation rules and notification center.
- AI analytics placeholders for absence trends, payroll variance, and attrition risk.

## Implementation Order

1. App launcher and route cleanup.
2. HR settings foundation: branches, roles, permissions, policies, holidays, shifts.
3. Employee profile expansion and onboarding/offboarding skeleton.
4. Attendance correction and shift-aware leave/payroll UI.
5. Recruitment module with jobs, candidates, interviews, offers, and onboarding handoff.
6. Staff/manager self-service routes.
7. Reports, audit trail, masking, exports, and premium placeholders.

## Quality Gates

- Every new route is reachable from sidebar or a contextual action.
- App launcher has a top-level HR entry and shortcut cards only where useful.
- Tables stay horizontally scrollable inside their own containers on mobile.
- Dialog forms use accessible labels and native controls.
- Demo actions persist through `HrDataProvider` and do not hard-code business rules directly in TSX page components.
- `npm run lint` and `npm run build` pass before handoff.
