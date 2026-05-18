# Project Overview: Enterprise ERP Portal

Welcome to the **Enterprise ERP Portal**! This document is designed by a Senior Software Architect to guide you, a developer new to this project, through the high-level understanding of what this application does, why it exists, and how it is structured.

---

## 1. What is an ERP? (The Core Business Domain)
**ERP** stands for **Enterprise Resource Planning**. 

Think of a large company like an orchestra. You have different sections:
*   **CRM (Customer Relationship Management)**: The sales team talking to customers and tracking leads.
*   **HRMS (Human Resource Management System)**: The department handling employees, attendance, and roles.
*   **Inventory**: The warehouse tracking what products are in stock.
*   **Billing/Finance**: The department keeping track of money, invoices, and prices.

Without an ERP, each of these sections would use different, disconnected software. The sales team wouldn't know if a product is in stock, and the finance team wouldn't know when to bill a customer. 

An **ERP acts as the central brain** that connects all these systems into a single, unified database and user interface. 

---

## 2. What Does THIS Particular Project Do?
This project is the **Frontend Control Panel (User Interface)** for an advanced, modern Enterprise ERP. It is a highly interactive, responsive web application designed for business administrators, managers, and employees to:
1.  **Monitor Business Health (Dashboard)**: View charts, recent activities, and key performance statistics (metrics).
2.  **Manage Leads (CRM)**: Track potential customers, their contact info, lead status (Hot, Warm, Cold), and value.
3.  **Manage Users (HRMS/Admin)**: Add, edit, or remove users, assign them roles (Admin, Manager, User), and monitor their status.
4.  **View Invoices and Pricing**: Check billing records and tier subscriptions.
5.  **Configure System Settings**: Adjust profile forms, theme values, and other system-wide preferences.

---

## 3. High-Level Architecture
This application is designed as a **Single Page Application (SPA)** built with **React**, **TypeScript**, and **Vite**.

Let's unpack what these words mean using simple analogies:

### A. The Single Page Application (SPA) Model
In traditional websites, every time you click a link, the browser makes a request to the server, the screen goes white for a second, and a completely new HTML page loads. 

In a **SPA (Single Page Application)**:
*   The browser loads **only one** HTML file (`index.html`) **once**.
*   When you navigate between pages (e.g., from Dashboard to CRM), JavaScript intercepts your click, clears the screen, and draws the new page **instantly** without reloading the browser.
*   It feels like a desktop application—fluid, fast, and continuous.

```
Traditional Website:
[User Click] ──(Request to Server)──> [Server Generates Page] ──(Returns Full Page)──> [Browser Reloads Screen]

Single Page Application (SPA):
[User Click] ──(JS Intercepts)──> [JS Fetches ONLY Raw Data (JSON)] ──> [React Re-renders Component Instantly]
```

### B. Client-Side State Management (The Global Brain)
Because the app never reloads, it needs a way to remember information across different screens. For example:
*   *Who is currently logged in?*
*   *Are we in dark mode or light mode?*
*   *Is a popup modal currently open?*

To handle this, we use **Redux Toolkit** as our **Global State Store**. 
*   **Analogy**: Redux is like a central bank. Individual components (like pages or buttons) cannot keep money in their own private registers. Instead, they must ask the bank (dispatch actions) to update their accounts, and they all read from the same central vault (the store).

### C. Frontend-Backend Separation (API-Driven)
This project is **100% frontend-only code**. It does not run a backend server or a physical database. Instead, it is configured as an **API-driven client**.
*   It is equipped with an HTTP client (**Axios**) that is ready to communicate with a backend API (by default configured to speak to `http://localhost:5000/api`).
*   For development, the code uses **mocked services**. This means that when you "login" or "create a lead," the frontend pretends to call a backend and generates local mock data. This is fantastic for development because you can build and test the interface before the backend database is even ready!

---

## 4. Key User Roles
The ERP defines three levels of user authorization, controlled via the frontend:
1.  **Admin (Super User)**: Has complete access to all panels, can delete data, change settings, and manage roles.
2.  **Manager (Power User)**: Can view dashboard metrics, CRM leads, and make structural additions, but has restricted administrative control.
3.  **User (Standard Employee)**: Has read-only or restricted access to specific operational modules (like updating their own profile or viewing invoices).

---

## 5. Main Technology Stack
Here is the core recipe of our technical stack:
*   **Vite**: The lightning-fast build tool that bundles our code and serves it during development.
*   **React 19**: The UI library that renders the visual components and manages their local states.
*   **TypeScript**: A typed extension of JavaScript that prevents bugs by forcing us to define the "shape" of our variables, forms, and data.
*   **Redux Toolkit**: The state manager that synchronizes authentication and system modals across all screens.
*   **React Router v7**: The navigation engine that handles URLs and mounts the correct page.
*   **Tailwind CSS + shadcn/ui**: The styling architecture. It uses utility classes and Radix UI primitives to create beautiful, consistent, and fully responsive visual elements.
*   **Zod + React Hook Form**: The form handling and validation system. It ensures that users cannot submit broken or empty data.
*   **Recharts**: The library used to draw gorgeous, fluid interactive charts on the dashboard.
