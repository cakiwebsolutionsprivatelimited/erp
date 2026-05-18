# Life of a Request: Flow Explanation Guide

This document breaks down the step-by-step lifecycles of key interactions in this application. It traces exactly which files are triggered, how state changes, and how data moves across the systems.

---

## 1. App Startup Flow (Bootstrapping)
What happens when a user types our URL (e.g., `http://localhost:5173/`) into their browser?

```
[Browser Request] ──> [index.html] ──> [src/main.tsx] ──> [src/App.tsx] ──> [src/routes/index.tsx] ──> [ProtectedRoute / AuthLayout]
```

### Detailed Steps:
1.  **Server Serves Index**: The browser receives [index.html](file:///c:/Users/kumar/Desktop/erp/index.html), which contains a single empty div: `<div id="root"></div>` and points to the main entry file: `<script type="module" src="/src/main.tsx"></script>`.
2.  **Vite bundles entry**: The browser executes [src/main.tsx](file:///c:/Users/kumar/Desktop/erp/src/main.tsx). This file loads React and uses `createRoot` to mount our main [App.tsx](file:///c:/Users/kumar/Desktop/erp/src/App.tsx) inside the `#root` element.
3.  **App Setup**: [App.tsx](file:///c:/Users/kumar/Desktop/erp/src/App.tsx) wraps the application inside the global infrastructure:
    *   `<Provider store={store}>`: Integrates the Redux Global Store.
    *   `<AppRouter />`: Mounts the routing system.
    *   `<ModalProvider />`: Mounts the dynamic popup dialog renderer.
    *   `<Toaster />`: Configures the UI notification system (Sonner).
4.  **Route Match**: [routes/index.tsx](file:///c:/Users/kumar/Desktop/erp/src/routes/index.tsx) checks the path:
    *   If path is `/`, it runs [ProtectedRoute.tsx](file:///c:/Users/kumar/Desktop/erp/src/routes/ProtectedRoute.tsx).
    *   `ProtectedRoute` checks the Redux `authSlice` to see if a token exists in `localStorage`.
    *   *If no token*: Redirects to `/login`.
    *   *If token exists*: Renders the [layouts/DashboardLayout.tsx](file:///c:/Users/kumar/Desktop/erp/src/layouts/DashboardLayout.tsx) layout and mounts the [pages/dashboard/Dashboard.tsx](file:///c:/Users/kumar/Desktop/erp/src/pages/dashboard/Dashboard.tsx) component.

---

## 2. Login Flow (Authentication)
What happens when a user fills out the login form and clicks "Sign In"?

```
[User Click] ──> [Login.tsx] ──> [useAuth.ts: login()] ──> [authSlice: setCredentials] ──> [localStorage] ──> [Redirect to /]
```

### Detailed Steps:
1.  **Form Input**: The user enters their email and password inside [pages/auth/Login.tsx](file:///c:/Users/kumar/Desktop/erp/src/pages/auth/Login.tsx).
2.  **Submit Trigger**: The form is wrapped with `<FormWrapper>` using a validation schema `loginSchema` built with Zod. When the user clicks "Sign In", Zod validates the inputs locally. If the email is invalid or the password is under 6 characters, the form highlights the fields and blocks submission.
3.  **Auth Hook Call**: If inputs are valid, the form invokes `onSubmit`, which calls the `login()` function from [hooks/useAuth.ts](file:///c:/Users/kumar/Desktop/erp/src/hooks/useAuth.ts).
4.  **Simulated API Interaction**: 
    *   `login()` dispatches `setLoading(true)` to display spinning loaders on the button.
    *   It triggers an async timeout of 1 second to simulate backend network traffic.
    *   It creates a mock response object representing a successful authentication token and user data:
        ```typescript
        const mockResponse = {
          user: { id: '1', email: credentials.email, name: 'Admin User', role: 'admin' },
          token: 'mock-jwt-token',
          rememberMe: credentials.rememberMe
        };
        ```
5.  **Global Store Update**: The hook dispatches `setCredentials(mockResponse)` to the Redux store [store/features/authSlice.ts](file:///c:/Users/kumar/Desktop/erp/src/store/features/authSlice.ts).
6.  **Local Persistence**: The `authSlice` reducer catches this action. It updates the state in RAM and, if "Remember Me" is checked, saves the user profile and token into the browser's persistent `localStorage`.
7.  **Notification & Navigation**:
    *   A success banner pops up: *"Welcome back, Admin User!"* using the `notify.success` method inside [services/notificationService.ts](file:///c:/Users/kumar/Desktop/erp/src/services/notificationService.ts).
    *   The router redirects the browser back to the homepage `/`.

---

## 3. Dashboard Loading Flow
What happens when the dashboard mounts and displays analytics?

```
[Dashboard.tsx Mounts] ──> [StatCards.tsx] & [RevenueCharts.tsx] & [RecentSales.tsx] & [ActivityFeed.tsx]
```

### Detailed Steps:
1.  **Layout Assembly**: The routing engine mounts [pages/dashboard/Dashboard.tsx](file:///c:/Users/kumar/Desktop/erp/src/pages/dashboard/Dashboard.tsx) inside the `<DashboardLayout />`.
2.  **Sidebar Rendering**: [components/navigation/Sidebar.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/navigation/Sidebar.tsx) reads the routing paths to highlight the active menu selection.
3.  **Widgets Initialization**: The dashboard loads multiple visual components in parallel:
    *   [StatCards.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/dashboard/StatCards.tsx): Draws key cards (Total Revenue, Active Users, CRM Deals, etc.) with custom hover glow animations.
    *   [RevenueCharts.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/dashboard/RevenueCharts.tsx): Uses `recharts` to render a responsive dual-tone area chart representing financial metrics.
    *   [RecentSales.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/dashboard/RecentSales.tsx) and [ActivityFeed.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/dashboard/ActivityFeed.tsx): Render structured feeds of mock event triggers.

---

## 4. Modal Dialog Trigger Flow (System Modals)
How do user actions trigger confirmation overlays (like a deletion dialog)?

```
[User Action] ──> [useModals Hook] ──> [modalSlice: openModal] ──> [ModalProvider.tsx] ──> [BaseModal.tsx overlay]
```

### Detailed Steps:
1.  **User Initiates**: A user clicks a delete action button inside a list or page.
2.  **Hook Trigger**: The component calls the `openConfirm` or `openDelete` helper functions from [hooks/useModals.ts](file:///c:/Users/kumar/Desktop/erp/src/hooks/useModals.ts).
3.  **Redux Dispatch**: The hook dispatches `openModal` action to [store/features/modalSlice.ts](file:///c:/Users/kumar/Desktop/erp/src/store/features/modalSlice.ts) specifying:
    *   The type of modal (e.g., `delete` or `confirmation`).
    *   Custom titles, messages, and the specific event to call when approved.
4.  **Provider Renders**: [components/modals/ModalProvider.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/modals/ModalProvider.tsx) (which is always mounted at the root level of our app) detects that the modal state has changed in the Redux store.
5.  **Modal Displayed**: The provider mounts [components/modals/DeleteModal.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/modals/DeleteModal.tsx), wrapping it inside the universal structural container [components/modals/BaseModal.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/modals/BaseModal.tsx). The screen goes dark and a focus-trapped animation presents the dialog to the user.
