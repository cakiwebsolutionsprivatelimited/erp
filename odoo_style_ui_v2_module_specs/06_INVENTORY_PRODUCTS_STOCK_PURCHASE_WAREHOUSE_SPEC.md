# Inventory, Products, Stock, Purchase and Warehouse Module Detailed UI Requirement

## Purpose
Manage product catalog, stock, purchases, suppliers, warehouses, transfers, and inventory reports.

## Sidebar
Dashboard, Products, Stock, Purchase, Suppliers, Warehouses, Stock Transfers, Reports, Inventory Settings.

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
