export interface Supplier {
  name: string;
  email: string;
  phone: string;
}

export interface ProductPrice {
  purchase: number;
  selling: number;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type SalesVelocity = "high" | "medium" | "low";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  status: StockStatus;
  barcode: string;
  gstRate: number; // percentage (e.g. 18)
  batchNumber: string;
  warehouseLocation: string;
  expiryDate?: string; // YYYY-MM-DD
  supplier: Supplier;
  price: ProductPrice;
  margin: number; // percentage profit margin
  thumbnail: string; // fallback icon/color class or placeholder
  salesVelocity: SalesVelocity;
  monthlySalesCount: number;
  stockHistory: number[]; // history of stock levels for charts
}
