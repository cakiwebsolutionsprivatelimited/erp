# Frontend Architecture

## Recommended Repo
Use one frontend repo.

```txt
saas-frontend/
  app/
  components/
  modules/
  lib/
  data/
  stores/
  types/
  config/
  docs/
```

## Next.js App Router Structure

```txt
app/
  (auth)/
    login/
    forgot-password/
  (tenant)/
    apps/
    dashboard/
    crm/
      dashboard/
      leads/
      leads/[id]/
      pipeline/
      follow-ups/
      customers/
      quotations/
      reports/
    settings/
      company/
      users/
      roles/
      apps/
      plan-usage/
```

## Component Structure

```txt
components/
  layout/
    AppShell.tsx
    Topbar.tsx
    Sidebar.tsx
    AppSwitcher.tsx
    Breadcrumbs.tsx
  ui/
    Button.tsx
    Card.tsx
    Badge.tsx
    Table.tsx
    Modal.tsx
    Drawer.tsx
  business/
    AppCard.tsx
    StatCard.tsx
    ActivityTimeline.tsx
    KanbanBoard.tsx
    DataTable.tsx
```

## Demo Data
All data should come from `data/demo/` JSON/TS files.

## State
Use Zustand or React Context to simulate current user, selected app, installed apps, lead status changes, kanban updates, and notification counts.
