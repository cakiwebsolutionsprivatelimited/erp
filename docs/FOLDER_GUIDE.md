# Folder Structure Reference Guide

This document is your map of the codebase. It details why each folder exists, which files are crucial, and which files you should never modify without careful planning.

---

## 1. Project Directory Tree

```
erp/
├── docs/                      # Technical documentation & guides
├── public/                    # Static files (favicons, images, public assets)
├── src/                       # Primary application code
│   ├── assets/                # Images, fonts, and global assets
│   ├── components/            # Reusable UI blocks and layouts
│   │   ├── alerts/            # Custom warning and alert displays
│   │   ├── auth/              # Authenticational form wrapper items
│   │   ├── calendar/          # Standard schedule grids
│   │   ├── cards/             # Visual information cards
│   │   ├── charts/            # Financial and numerical charts
│   │   ├── common/            # Shared containers (e.g., PageLayout)
│   │   ├── dashboard/         # StatCards, ActivityFeed, QuickActions
│   │   ├── editors/           # Interactive text/input editors
│   │   ├── errors/            # Error state visual fallbacks
│   │   ├── forms/             # FormWrapper, FormInput, FormCheckbox
│   │   ├── invoice/           # Invoice tables and styling components
│   │   ├── loaders/           # Page and button spinner animations
│   │   ├── modals/            # BaseModal, ModalProvider, confirmation dialogs
│   │   ├── navigation/        # Navbar, Sidebar, Breadcrumb components
│   │   ├── pricing/           # Subscription tiers UI elements
│   │   ├── profile/           # Profile layout and metadata sub-views
│   │   ├── settings/          # System preferences configurations
│   │   ├── tables/            # DataTable, Pagination, column headers
│   │   │   ├── leads/         # CRM specific Leads lists & schemas
│   │   │   └── users/         # HRMS specific Users lists & schemas
│   │   └── ui/                # shadcn primitives (button, dialog, select)
│   ├── features/              # Modular application business logic splits
│   ├── hooks/                 # Custom React hooks (useAuth, useModals, etc.)
│   ├── layouts/               # High-level layouts (Dashboard, Auth, Error)
│   ├── lib/                   # External utility integrations (e.g., shadcn utils)
│   ├── pages/                 # Full screen views (Dashboard, CRM, Settings)
│   ├── routes/                # Client-side route matching (index, guards)
│   ├── services/              # External communication (Axios client, Sonner)
│   ├── store/                 # Redux Toolkit global store configuration
│   ├── types/                 # Custom TypeScript structural models
│   ├── utils/                 # General helpers (validations, tables, errors)
│   ├── App.tsx                # Main entry React component (global wraps)
│   ├── index.css              # Signature stylesheet & tailwind utilities
│   └── main.tsx               # Bootstrap code that binds React to index.html
├── components.json            # Configuration file for shadcn CLI
├── eslint.config.js           # Linting rules for checking syntax errors
├── index.html                 # The single HTML page loaded by the browser
├── package.json               # Package and build dependencies configuration
├── tsconfig.json              # TypeScript engine configurations
└── vite.config.ts             # Vite build pipeline and path alias configurations
```

---

## 2. Directory Breakdowns & Classifications

### A. The Core Core (Entry Points)
> [!IMPORTANT]
> These files are the bootstrap mechanism of the entire project. Touching these could cause the entire application to crash before it even boots.

*   [index.html](file:///c:/Users/kumar/Desktop/erp/index.html): The physical container of the website.
*   [src/main.tsx](file:///c:/Users/kumar/Desktop/erp/src/main.tsx): Imports React and binds our app to the HTML `#root` node.
*   [src/App.tsx](file:///c:/Users/kumar/Desktop/erp/src/App.tsx): Imports stylesheets, defines Redux providers, alert wrappers, and mounts the route config.

### B. Routing Folder (`src/routes`)
*   **Why it exists**: To navigate between pages.
*   **Key Files**:
    *   [routes/index.tsx](file:///c:/Users/kumar/Desktop/erp/src/routes/index.tsx): Defines the URL catalog (e.g. `/crm` runs the CRM Page, `/settings` runs Settings Page).
    *   [routes/ProtectedRoute.tsx](file:///c:/Users/kumar/Desktop/erp/src/routes/ProtectedRoute.tsx): The firewall. Restricts all pages under the dashboard category to authenticated users only.

### C. State & Services Folders (`src/store` & `src/services`)
*   **Why they exist**: To manage client state and external communications.
*   **Key Files**:
    *   [store/index.ts](file:///c:/Users/kumar/Desktop/erp/src/store/index.ts): Combines and exposes the Redux slices.
    *   [store/features/authSlice.ts](file:///c:/Users/kumar/Desktop/erp/src/store/features/authSlice.ts): Controls credential persistence.
    *   [services/api.ts](file:///c:/Users/kumar/Desktop/erp/src/services/api.ts): Outlines the Axios network configuration with automatic bearer headers.
    *   [services/notificationService.ts](file:///c:/Users/kumar/Desktop/erp/src/services/notificationService.ts): Controls beautiful toasts.

### D. Component Hierarchy (`src/components` vs `src/pages`)
*   **Analogy**: Think of a Lego set.
    *   `src/components/ui/` are single Lego bricks (Buttons, Checkboxes, Inputs). You should almost never modify these directly, as they are generated by `shadcn`.
    *   `src/components/` are combined Lego structures (a Sidebar, a Chart Widget, a Leads Table).
    *   `src/pages/` are the final sets (a full Dashboard page containing charts, recent sales feeds, and metrics widgets).
*   **Key Folders**:
    *   `src/components/tables/`: Contains our TanStack-driven grid structure. **DataTable.tsx** is the main engine used across all tables.
    *   `src/components/forms/`: Holds form inputs and wrappers, securing Zod validation integration.

### E. Configuration Files (Project Root)
*   [vite.config.ts](file:///c:/Users/kumar/Desktop/erp/vite.config.ts): Sets up path aliases like `@/components` pointing directly to `src/components`.
*   [tsconfig.json](file:///c:/Users/kumar/Desktop/erp/tsconfig.json): Dictates strict rules to the compiler.
*   [package.json](file:///c:/Users/kumar/Desktop/erp/package.json): Lists the libraries and versions used by the program.
