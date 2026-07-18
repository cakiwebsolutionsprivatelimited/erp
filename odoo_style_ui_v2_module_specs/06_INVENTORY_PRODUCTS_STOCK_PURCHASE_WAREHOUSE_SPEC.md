# Inventory, Products, Stock, Purchase and Warehouse Module Detailed UI Requirement

## Purpose
Manage product catalog, stock, purchases, suppliers, warehouses, transfers, and inventory reports.

## Sidebar
Dashboard, Products, Catalog Setup, Tracking, Stock, Purchase, Purchase Ops, Suppliers, Warehouses, Warehouse Ops, Fulfillment, Stock Transfers, Reports, Insights & Admin, Inventory Settings.

## Inventory Dashboard
Widgets:
Total products, Low stock products, Out of stock products, Stock value, Purchase this month, Pending purchase orders, Expiring batches placeholder.

Charts:
Stock value trend, Fast moving products, Product category distribution, Purchase trend.

## Product List
Columns:
Product name, SKU, Barcode, Category, Unit, GST rate, Sale price, Purchase price, Current stock, Status.

## Product Form
Fields:
Product name, SKU, Barcode, Category, Subcategory, Unit, HSN code, GST rate, Sale price, Purchase price, Opening stock, Reorder level, Product image placeholder, Description, Status.

## Stock
Views:
Current stock, Stock ledger, Stock adjustment, Low stock, Dead stock.

Stock adjustment fields:
Product, Warehouse, Adjustment type Add/Reduce, Quantity, Reason, Date, Notes.

## Purchase
PO columns:
PO number, Supplier, Date, Expected delivery, Amount, Status.

Statuses:
Draft, Sent, Received, Partially Received, Cancelled.

Purchase form:
Supplier, Date, Products, Quantity, Rate, GST, Total, Notes.

## Suppliers
Fields:
Supplier name, Contact person, Phone, Email, GST number, Address, Payment terms, Status.

## Warehouses
Fields:
Warehouse name, Code, Address, Manager, Status.

## Stock Transfer
Fields:
From warehouse, To warehouse, Product, Quantity, Transfer date, Status, Notes.

## Reports
Stock ledger, Product-wise profit placeholder, Fast moving products, Dead stock analysis, Purchase report, Supplier purchase report.

## Demo Functionality
Create/edit product, stock adjustment, create purchase order, mark purchase received, add supplier, add warehouse, transfer stock demo.

## Static UI Development Rule
Inventory is being upgraded as a static UI/demo module first. Use seeded local data and local UI state only. Do not add backend APIs, database work, accounting sync, marketplace sync, shipping label generation, live barcode scanner integrations, live e-way bill generation, payment gateway logic, or portal authentication in these phases.

## Blueprint Coverage Upgrade
The Inventory Management System Blueprint expands the MVP into these feature groups:
- Inventory catalog: Items, item groups, composite items, inventory adjustments, price lists, serial number tracking, batch/expiry tracking, barcode generation and scanning.
- Warehousing: Multi-location management, transfer orders, warehouse restrictions, pick lists.
- Order management: Sales orders, custom statuses, order filtering, multichannel sales placeholders, packages, package geometry, sales returns, dropshipment, backorders, invoices, delivery challans, GST settings, e-way bills.
- Purchase: Purchase orders, purchase status, vendor bills, purchase receives, payments made.
- Integrations: Shipping/tracking, marketplaces, accounting, EDI, SMS, online payments, ecosystem connections.
- Reports: Inventory, sales, receivables, purchase, activity, payments received, payables, advanced analytics.
- Other handy features: Users and roles, templates, reporting tags, automation, connections, web tabs, customer portal, vendor portal, mobile app preview, email/field updates, custom functions, webhooks.

## Implementation Phases

### Phase 0 - Spec and App Launcher Alignment
Status: Approved for implementation.

Scope:
- Update this module specification with the blueprint-based roadmap.
- Fix stale app launcher state so completed Inventory routes no longer appear as upgrade-only cards after older local demo state is loaded.
- Keep Products, Stock, Purchase, and Warehouse linked to their active Inventory routes.

### Phase 1 - Advanced Inventory Catalog
Status: Approved for implementation.

Scope:
- Add Catalog Setup page for item groups, composite items, and price lists.
- Add Serial, Batch and Barcode page for serial numbers, batch/expiry tracking, barcode lookup, and warehouse/bin location visibility.
- Extend product model and product form with item group, tracking type, serial numbers, batch number, expiry date, and warehouse/bin location.
- Surface catalog/tracking shortcuts in Inventory navigation and dashboard.

### Phase 2 - Warehouse Operations
Status: Completed.

Scope:
- Add bins/locations, warehouse restrictions, pick lists, transfer order stages, and in-transit stock view.
- Improve warehouse pages with role/access previews and operational queues.

Implemented static UI:
- Warehouse Operations page with Bins & Locations, Pick Lists, Restrictions, and In Transit views.
- Warehouse bin model with zone, aisle, capacity utilization, SKU count, pick sequence, assignee, and operational status.
- Warehouse restriction model with role, warehouse coverage, permissions, and status.
- Pick list model with sales order reference, customer, warehouse, assignee, due date, priority, item-level bin/picked/short status, and progress display.
- Transfer order UI upgraded with source/destination bins, expected arrival, requester, carrier, priority, and in-transit metrics.
- Warehouses page upgraded with bin counts, average utilization, access roles, and Warehouse Ops shortcut.

### Phase 3 - Order Fulfillment UI
Status: Completed.

Scope:
- Add inventory-facing sales orders, packages, packing slips, package geometry, delivery challans, returns, backorders, and dropshipment views.
- Link to Sales module records as static references only.

Implemented static UI:
- Order Fulfillment page with Sales Orders, Packages, Delivery Challans, Returns, Backorders, and Dropshipment views.
- Inventory fulfillment order model with Sales module order references, customer/channel, warehouse, promised date, amount, payment status, linked pick list/package/challan, and item allocation/packing progress.
- Package model with dimensions, weight, item count, carrier, tracking number, packed-by user, and package status.
- Delivery challan model with transporter, vehicle number, place of supply, e-way bill placeholder, and challan status.
- Return model with product, quantity, reason, inspection status, refund status, and return lifecycle.
- Backorder model with ordered/available/backordered quantities, replenishment source, expected date, and status.
- Dropshipment model with supplier, linked PO, ship-to city, carrier, tracking number, and supplier-direct status.

### Phase 4 - Purchase Expansion
Status: Completed.

Scope:
- Add purchase receives, vendor bills, payments made, and PO lifecycle boards for ordered, received, billed, and paid stages.
- Keep billing/accounting effects as static placeholders until backend/API phases.

Implemented static UI:
- Purchase Operations page with Lifecycle, Receives, Vendor Bills, and Payments Made views.
- Purchase receive model with GRN number, PO reference, warehouse, receiver, inspection note, accepted/rejected quantities, and bin code.
- Vendor bill model with PO reference, bill/due date, subtotal, tax, total, received value, and bill approval/payment status.
- Vendor payment model with bill reference, payment date, amount, mode, reference number, and payment reconciliation status.
- PO lifecycle board grouped by Ordered, Received, Billed, and Paid.
- Purchase page upgraded with receive count, open bill value, paid value, and Purchase Ops shortcut.

### Phase 5 - Reports, Settings and Integrations
Status: Completed.

Scope:
- Add stock valuation, inventory movement, FIFO, product inventory, purchase/vendor analysis, payables/receivables placeholders, audit/activity logs, templates, reporting tags, automation rules, connections, web tabs, customer/vendor portal previews, custom functions, and webhooks.

Implemented static UI:
- Inventory Insights & Admin page with Advanced Reports, Integrations, Automation, Templates & Tags, Portals & Web Tabs, and Webhooks & Audit views.
- Advanced report previews for stock valuation, inventory movement, FIFO ageing, product inventory, purchase/vendor analysis, payables, receivables, payment, and activity reporting.
- Integration readiness previews for shipping/tracking, marketplace, accounting, EDI, SMS, payments, and ecosystem connectors with sync status only.
- Automation rule and custom function tables for reorder review, expiry watch, vendor bill follow-up, stock adjustment approval, and fulfillment notifications.
- Document template and reporting tag management previews for purchase orders, delivery challans, barcode labels, stock valuation, and cycle count reports.
- Customer/vendor portal, mobile app, and embedded web tab previews without authentication or live external connections.
- Webhook delivery health and audit/activity log tables for static governance visibility.
- Dashboard, sidebar, Reports, and Settings pages linked to the new Insights & Admin route.
