export type ProductStatus = 'Active' | 'Inactive';
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type SupplierStatus = 'Active' | 'Inactive';
export type WarehouseStatus = 'Active' | 'Inactive';
export type StockAdjustmentType = 'Add' | 'Reduce';
export type StockLedgerType = 'Opening' | 'Adjustment' | 'Purchase Receipt' | 'Transfer In' | 'Transfer Out';
export type PurchaseOrderStatus = 'Draft' | 'Sent' | 'Received' | 'Partially Received' | 'Cancelled';
export type StockTransferStatus = 'Draft' | 'In Transit' | 'Completed' | 'Cancelled';

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  subcategory: string;
  unit: string;
  hsnCode: string;
  gstRate: number;
  salePrice: number;
  purchasePrice: number;
  openingStock: number;
  currentStock: number;
  reorderLevel: number;
  description: string;
  status: ProductStatus;
  imageLabel: string;
  monthlySales: number;
}

export interface InventorySupplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
  paymentTerms: string;
  status: SupplierStatus;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  status: WarehouseStatus;
}

export interface StockLedgerEntry {
  id: string;
  date: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  type: StockLedgerType;
  quantityIn: number;
  quantityOut: number;
  balanceAfter: number;
  reference: string;
  notes: string;
}

export interface StockAdjustmentDraft {
  productId: string;
  warehouseId: string;
  adjustmentType: StockAdjustmentType;
  quantity: number;
  reason: string;
  date: string;
  notes: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  gstRate: number;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDelivery: string;
  items: PurchaseOrderItem[];
  notes: string;
  status: PurchaseOrderStatus;
}

export interface StockTransfer {
  id: string;
  number: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
  transferDate: string;
  status: StockTransferStatus;
  notes: string;
}

export interface InventoryStateShape {
  products: InventoryProduct[];
  suppliers: InventorySupplier[];
  warehouses: Warehouse[];
  purchaseOrders: PurchaseOrder[];
  stockLedger: StockLedgerEntry[];
  transfers: StockTransfer[];
}

export type ProductDraft = Omit<InventoryProduct, 'id' | 'currentStock'> & { currentStock?: number };
export type SupplierDraft = Omit<InventorySupplier, 'id'>;
export type WarehouseDraft = Omit<Warehouse, 'id'>;
export type PurchaseOrderDraft = Omit<PurchaseOrder, 'id' | 'number' | 'supplierName'>;
export type StockTransferDraft = Omit<StockTransfer, 'id' | 'number' | 'fromWarehouseName' | 'toWarehouseName' | 'productName'>;
