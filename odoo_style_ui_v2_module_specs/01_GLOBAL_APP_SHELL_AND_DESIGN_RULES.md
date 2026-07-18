# Global App Shell and Design Rules

## Goal
Every app must feel part of the same modular SaaS platform.

## Shared App Layout
When user opens an app from App Launcher, show:
- Topbar with company name, search, notifications, user menu
- App-specific sidebar
- Breadcrumb
- Page title
- Primary action button
- Filter/search toolbar
- Main content area
- Empty/loading/error states
- Right drawer for quick details where useful

## Common Views
Each module should reuse:
- Dashboard view
- List/table view
- Create/edit form view
- Detail view
- Kanban view where workflow exists
- Calendar view where scheduling exists
- Reports view
- Settings/configuration view

## Shared Components
Create or reuse:
- AppShell
- ModuleSidebar
- PageHeader
- DataTable
- FilterBar
- FormSection
- StatusBadge
- StatCard
- KanbanBoard
- CalendarView
- ActivityTimeline
- NotesPanel
- AttachmentPanel
- EmptyState
- ConfirmDialog
- ImportExportActions
- QuickCreateDrawer

## UI Quality Rules
- Desktop-first but responsive
- Clean spacing
- Large readable tables
- Clear form grouping
- Use badges for statuses
- Use drawers for quick actions
- Use tabs on detail pages
- Use realistic Indian SME demo data
- Use local demo state/localStorage initially
- No backend integration yet
