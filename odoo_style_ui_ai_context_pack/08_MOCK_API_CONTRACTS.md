# Mock API Contracts for Future Backend

The frontend should be coded with a service layer so demo data can later be replaced by Laravel API calls.

## Auth
POST /api/v1/auth/login
GET /api/v1/auth/me
POST /api/v1/auth/logout

## Tenant
GET /api/v1/tenant/dashboard
GET /api/v1/tenant/apps
GET /api/v1/tenant/company
PUT /api/v1/tenant/company
GET /api/v1/tenant/subscription
GET /api/v1/tenant/usage

## CRM
GET /api/v1/crm/leads
POST /api/v1/crm/leads
GET /api/v1/crm/leads/:id
PUT /api/v1/crm/leads/:id
DELETE /api/v1/crm/leads/:id
POST /api/v1/crm/leads/:id/notes
POST /api/v1/crm/leads/:id/followups
POST /api/v1/crm/leads/:id/change-stage
POST /api/v1/crm/leads/:id/convert-customer

## Settings
GET /api/v1/tenant/users
POST /api/v1/tenant/users/invite
PUT /api/v1/tenant/users/:id
GET /api/v1/tenant/roles
PUT /api/v1/tenant/roles/:id/permissions
