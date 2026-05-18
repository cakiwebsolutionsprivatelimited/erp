# Technical Architecture Guide: Enterprise ERP

This document explains the technical architecture of the ERP frontend. It is written from the perspective of a Senior Software Architect, using visual diagrams and simple analogies to explain the "why" and "how" of our technical choices.

---

## 1. Architectural Style: Single Page Application (SPA)
As detailed in the overview, this application is a **Client-Side SPA**.

### The Decoupled Client-Server Concept
This architecture is entirely decoupled from the backend. The frontend handles **only** user interactions, layout rendering, visual transitions, state caching, and input validation. 

```
                                  +---------------------------+
                                  |     Vite Dev Server       |
                                  |   (Serves JS/CSS/HTML)    |
                                  +-------------+-------------+
                                                |
                                                v
+------------------+              +-------------+-------------+
|                  |              |                           |
|   User Browser   | <==========> |    React SPA running in   |
|                  |              |      Client's Memory      |
|                  |              |                           |
+--------+---------+              +-------------+-------------+
         ^                                      |
         |                                      v  [API Requests via Axios]
         |                               +------+------+
         | (Local State updates          |             |
         +------------------------------ |  Mock APIs  |  (Eventually real backend
            re-render visual elements)   |             |   at localhost:5000/api)
                                         +-------------+
```

---

## 2. Core Architectural Pillars

The application is built on **Four Pillars**:

```
+-----------------------------------------------------------------------------------+
|                                   React SPA UI                                    |
+---------------------+-----------------------+------------------+------------------+
|      Pillar 1:      |       Pillar 2:       |    Pillar 3:     |    Pillar 4:     |
|   Routing Engine    |   Global State Store  | Modular Form &   |  Advanced Table  |
|  (React Router v7)  |   (Redux Toolkit)     | Validation (Zod) | (TanStack Table) |
+---------------------+-----------------------+------------------+------------------+
```

### Pillar 1: Routing Engine (React Router v7)
*   **File Location**: [routes/index.tsx](file:///c:/Users/kumar/Desktop/erp/src/routes/index.tsx) and [routes/ProtectedRoute.tsx](file:///c:/Users/kumar/Desktop/erp/src/routes/ProtectedRoute.tsx)
*   **Purpose**: To match the URL in the browser address bar with the correct page layout and components.
*   **Guards**: It uses a `ProtectedRoute` component to intercept navigation. If a user tries to access `/settings` or `/crm` without being logged in, they are redirected back to `/login` automatically.

### Pillar 2: Global State Store (Redux Toolkit)
*   **File Location**: [store/index.ts](file:///c:/Users/kumar/Desktop/erp/src/store/index.ts)
*   **Purpose**: The "global database" in the browser's RAM memory.
*   **Slices**:
    1.  **authSlice**: Tracks if the user is authenticated, their token, user profile data (email, name, role), and handles writing credentials to `localStorage` (so they don't have to log in again after reloading the browser).
    2.  **modalSlice**: Tracks which modal popups are open, what data is passed to them, and when to close them.

### Pillar 3: Modular Form & Validation System (Zod & React Hook Form)
*   **File Location**: [components/forms/FormWrapper.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/forms/FormWrapper.tsx) and [components/forms/FormComponents.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/forms/FormComponents.tsx)
*   **Purpose**: Forms are the main way users talk to an ERP. If they input bad data (like an invalid email or short password), the server will fail. We use **Zod** to validate data *before* it leaves the client's screen.
*   **Wrapper Pattern**: Instead of writing validation logic and error visual markers on every input, we built a generic `FormWrapper` that wraps standard fields. It automatically grabs validation schemas, intercepts submits, and displays error labels cleanly.

### Pillar 4: Advanced Table Architecture (TanStack Table)
*   **File Location**: [components/tables/DataTable.tsx](file:///c:/Users/kumar/Desktop/erp/src/components/tables/DataTable.tsx)
*   **Purpose**: ERP apps display large amounts of grid-like data. We use **TanStack Table** to build a highly interactive data grid that provides:
    *   Faceted filtering (filtering by categories like roles or status).
    *   Column sorting (alphabetical or date-based).
    *   Pagination (showing 10 rows at a time).
    *   Row selections.

---

## 3. Communication & Middleware Flow

### Axios HTTP Client & Interceptors
*   **File Location**: [services/api.ts](file:///c:/Users/kumar/Desktop/erp/src/services/api.ts)
*   **The Secret Guard**: In a secure enterprise app, we cannot send API requests without a secret key (JWT token). 
*   **Request Interceptor**: The Axios interceptor automatically grabs the token from the Redux store or local storage and attaches it as an `Authorization: Bearer <token>` header to every single HTTP request. Developers do not need to do this manually!
*   **Response Interceptor**: If the backend tells us our token has expired (HTTP `401 Unauthorized`), the response interceptor automatically dispatches the `logout` action, wipes the stale credentials, and sends the user back to the login screen.

---

## 4. Design & Styling System (Tailwind v4)
The styling of this app is built on a custom design system inside `src/index.css` using modern Tailwind CSS variables.
*   **Glassmorphism & Shadows**: High-fidelity gradients, smooth blur backdrops, and soft card styling.
*   **Variables for Theme Colors**:
    *   `--primary`: The signature corporate brand color.
    *   `--background` / `--foreground`: Base colors for light/dark ratios.
    *   `--muted` / `--muted-foreground`: Understated texts and disabled states.
    *   `--destructive`: Standard color for delete actions, errors, and warning buttons.
