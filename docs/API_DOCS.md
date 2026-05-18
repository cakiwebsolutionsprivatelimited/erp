# Simulated API Reference Documentation

This document describes the structure of the API endpoints that our frontend communicates with (and simulates using local mock states). Once the backend is fully built, it must conform to this exact specification.

---

## 1. Global API Configuration
*   **Base URL**: `http://localhost:5000/api` (or configured via the environment variable `VITE_API_URL`)
*   **Default Headers**:
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <JWT_TOKEN>` (for protected endpoints)

---

## 2. Authentication API Endpoints

### POST `/api/auth/login`
*   **Description**: Logs a user in and returns a bearer JWT token.
*   **Auth Required**: No (Public)
*   **Request Payload Structure**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "rememberMe": true
    }
    ```
*   **Response Structure (200 OK)**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "1",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "admin"
      }
    }
    ```

### POST `/api/auth/signup`
*   **Description**: Registers a new corporate user account.
*   **Auth Required**: No (Public)
*   **Request Payload Structure**:
    ```json
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "password": "strongPassword123"
    }
    ```
*   **Response Structure (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Account created successfully"
    }
    ```

---

## 3. CRM & Leads API Endpoints (Simulated)

### GET `/api/leads`
*   **Description**: Retrieves a filtered, paginated catalog of all sales leads.
*   **Auth Required**: Yes (Manager or Admin)
*   **QueryParams**:
    *   `searchKey`: Filter leads by name string (e.g. `?searchKey=Acme`)
    *   `status`: Filter by `Hot`, `Warm`, or `Cold`
*   **Response Structure (200 OK)**:
    ```json
    [
      {
        "id": "lead_01",
        "name": "Acme Corp Deal",
        "email": "contact@acme.com",
        "value": "$45,000",
        "status": "Hot",
        "company": "Acme Corporation"
      }
    ]
    ```

### POST `/api/leads`
*   **Description**: Adds a new sales lead to the system.
*   **Auth Required**: Yes (Manager or Admin)
*   **Request Payload Structure**:
    ```json
    {
      "name": "TechInc Alliance",
      "email": "bizdev@techinc.com",
      "value": "$25,000",
      "status": "Warm",
      "company": "TechInc Labs"
    }
    ```
*   **Response Structure (201 Created)**:
    ```json
    {
      "id": "lead_02",
      "name": "TechInc Alliance",
      "email": "bizdev@techinc.com",
      "value": "$25,000",
      "status": "Warm",
      "company": "TechInc Labs"
    }
    ```

---

## 4. Users & HRMS API Endpoints (Simulated)

### GET `/api/users`
*   **Description**: Returns lists of all registered employees and staff accounts.
*   **Auth Required**: Yes (Admin Only)
*   **Response Structure (200 OK)**:
    ```json
    [
      {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Admin",
        "status": "Active",
        "lastLogin": "2026-05-16"
      }
    ]
    ```

### PUT `/api/users/:id`
*   **Description**: Updates user profile parameters or administrative roles.
*   **Auth Required**: Yes (Admin Only)
*   **Request Payload Structure**:
    ```json
    {
      "name": "Johnathan Doe",
      "role": "Admin",
      "status": "Active"
    }
    ```
*   **Response Structure (200 OK)**:
    ```json
    {
      "id": "1",
      "name": "Johnathan Doe",
      "email": "john@example.com",
      "role": "Admin",
      "status": "Active",
      "lastLogin": "2026-05-16"
    }
    ```
