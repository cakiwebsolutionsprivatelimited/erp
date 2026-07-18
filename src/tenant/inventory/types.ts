export type ProductStatus = 'Active' | 'Inactive';
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type SupplierStatus = 'Active' | 'Inactive';
export type WarehouseStatus = 'Active' | 'Inactive';
export type StockAdjustmentType = 'Add' | 'Reduce';
export type StockLedgerType = 'Opening' | 'Adjustment' | 'Purchase Receipt' | 'Transfer In' | 'Transfer Out';
export type PurchaseOrderStatus = 'Draft' | 'Sent' | 'Received' | 'Partially Received' | 'Cancelled';
export type StockTransferStatus = 'Draft' | 'In Transit' | 'Completed' | 'Cancelled';
export type InventoryTrackingType = 'None' | 'Serial' | 'Batch' | 'Serial + Batch';
export type InventoryPriceListType = 'Customer' | 'Vendor' | 'Region';
export type InventoryPriceAdjustmentType = 'Markup' | 'Discount' | 'Fixed';
export type WarehouseBinStatus = 'Available' | 'High Utilization' | 'Maintenance' | 'Restricted';
export type WarehouseRestrictionStatus = 'Active' | 'Draft';
export type PickListStatus = 'Draft' | 'Picking' | 'Packed' | 'Hold' | 'Completed';
export type PickListPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type PickListItemStatus = 'Pending' | 'Picked' | 'Short';
export type InventoryFulfillmentStatus = 'Pending Pick' | 'Picking' | 'Packed' | 'Shipped' | 'Delivered' | 'On Hold';
export type InventoryPackageStatus = 'Draft' | 'Packed' | 'Ready to Ship' | 'Shipped' | 'Delivered';
export type DeliveryChallanStatus = 'Draft' | 'Issued' | 'Delivered' | 'Returned';
export type InventoryReturnStatus = 'Requested' | 'Approved' | 'Received' | 'Refund Pending' | 'Closed';
export type InventoryBackorderStatus = 'Open' | 'Allocated' | 'Ready to Fulfil' | 'Closed';
export type InventoryDropshipmentStatus = 'Requested' | 'PO Sent' | 'Shipped' | 'Delivered';
export type PurchaseReceiveStatus = 'Draft' | 'Received' | 'Partially Received' | 'Quality Hold';
export type VendorBillStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Paid' | 'Overdue' | 'Cancelled';
export type VendorPaymentStatus = 'Scheduled' | 'Paid' | 'Failed' | 'Reconciled';
export type InventoryReportStatus = 'Ready' | 'Scheduled' | 'Needs Review';
export type InventoryIntegrationStatus = 'Connected' | 'Needs Auth' | 'Preview' | 'Disabled';
export type InventoryAutomationStatus = 'Active' | 'Paused' | 'Draft';
export type InventoryTemplateStatus = 'Active' | 'Draft' | 'Archived';
export type InventoryPortalStatus = 'Preview' | 'Enabled' | 'Disabled';
export type InventoryAuditSeverity = 'Info' | 'Warning' | 'Critical';
export type InventoryWebhookStatus = 'Healthy' | 'Failing' | 'Paused' | 'Preview';

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
  itemGroupId?: string;
  itemGroupName?: string;
  trackingType?: InventoryTrackingType;
  serialNumbers?: string[];
  batchNumber?: string;
  expiryDate?: string;
  warehouseLocation?: string;
}

export interface InventoryItemGroup {
  id: string;
  name: string;
  attributes: string[];
  defaultUnit: string;
  gstRate: number;
  variants: number;
  activeItems: number;
  status: ProductStatus;
}

export interface CompositeItemComponent {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface InventoryCompositeItem {
  id: string;
  name: string;
  sku: string;
  components: CompositeItemComponent[];
  salePrice: number;
  costPrice: number;
  currentStock: number;
  status: ProductStatus;
}

export interface InventoryPriceList {
  id: string;
  name: string;
  type: InventoryPriceListType;
  adjustmentType: InventoryPriceAdjustmentType;
  adjustmentValue: number;
  currency: string;
  appliesTo: string;
  status: ProductStatus;
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

export interface WarehouseBin {
  id: string;
  warehouseId: string;
  warehouseName: string;
  code: string;
  zone: string;
  aisle: string;
  capacityUtilization: number;
  currentSkuCount: number;
  pickSequence: number;
  assignedTo: string;
  status: WarehouseBinStatus;
}

export interface WarehouseRestriction {
  id: string;
  role: string;
  warehouseIds: string[];
  warehouseNames: string[];
  permissions: string[];
  status: WarehouseRestrictionStatus;
}

export interface PickListItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  pickedQuantity: number;
  binCode: string;
  status: PickListItemStatus;
}

export interface PickList {
  id: string;
  number: string;
  salesOrderNumber: string;
  customerName: string;
  warehouseId: string;
  warehouseName: string;
  assignedTo: string;
  dueDate: string;
  priority: PickListPriority;
  status: PickListStatus;
  items: PickListItem[];
}

export interface InventoryFulfillmentItem {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  allocatedQuantity: number;
  packedQuantity: number;
  warehouseBinCode: string;
}

export interface InventoryFulfillmentOrder {
  id: string;
  salesOrderId: string;
  salesOrderNumber: string;
  customerName: string;
  orderDate: string;
  promisedDate: string;
  warehouseId: string;
  warehouseName: string;
  channel: string;
  amount: number;
  fulfillmentStatus: InventoryFulfillmentStatus;
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  pickListNumber?: string;
  packageNumber?: string;
  challanNumber?: string;
  items: InventoryFulfillmentItem[];
}

export interface InventoryPackage {
  id: string;
  packageNumber: string;
  salesOrderNumber: string;
  customerName: string;
  warehouseName: string;
  packedBy: string;
  packageDate: string;
  dimensions: string;
  weightKg: number;
  itemCount: number;
  carrier: string;
  trackingNumber: string;
  status: InventoryPackageStatus;
}

export interface InventoryDeliveryChallan {
  id: string;
  challanNumber: string;
  salesOrderNumber: string;
  customerName: string;
  issueDate: string;
  transporter: string;
  vehicleNumber: string;
  placeOfSupply: string;
  eWayBillNumber?: string;
  status: DeliveryChallanStatus;
}

export interface InventorySalesReturn {
  id: string;
  returnNumber: string;
  salesOrderNumber: string;
  customerName: string;
  returnDate: string;
  productName: string;
  quantity: number;
  reason: string;
  inspectionStatus: 'Pending' | 'Accepted' | 'Rejected';
  refundStatus: 'Not Started' | 'Pending' | 'Processed';
  status: InventoryReturnStatus;
}

export interface InventoryBackorder {
  id: string;
  salesOrderNumber: string;
  customerName: string;
  productName: string;
  orderedQuantity: number;
  availableQuantity: number;
  backorderedQuantity: number;
  replenishmentSource: string;
  expectedDate: string;
  status: InventoryBackorderStatus;
}

export interface InventoryDropshipment {
  id: string;
  dropshipNumber: string;
  salesOrderNumber: string;
  customerName: string;
  supplierName: string;
  productName: string;
  purchaseOrderNumber: string;
  shipToCity: string;
  carrier: string;
  trackingNumber: string;
  status: InventoryDropshipmentStatus;
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

export interface PurchaseReceiveItem {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  warehouseBinCode: string;
}

export interface PurchaseReceive {
  id: string;
  receiveNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  supplierName: string;
  receiveDate: string;
  warehouseId: string;
  warehouseName: string;
  receivedBy: string;
  status: PurchaseReceiveStatus;
  inspectionNote: string;
  items: PurchaseReceiveItem[];
}

export interface VendorBill {
  id: string;
  billNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  supplierId: string;
  supplierName: string;
  billDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  receivedAmount: number;
  status: VendorBillStatus;
}

export interface VendorPayment {
  id: string;
  paymentNumber: string;
  vendorBillId: string;
  billNumber: string;
  supplierName: string;
  paymentDate: string;
  amount: number;
  mode: 'Bank Transfer' | 'UPI' | 'Cheque' | 'Cash';
  reference: string;
  status: VendorPaymentStatus;
}

export interface InventoryAdvancedReport {
  id: string;
  name: string;
  category: 'Inventory' | 'Sales' | 'Purchase' | 'Receivables' | 'Payables' | 'Activity' | 'Analytics';
  metric: string;
  owner: string;
  lastRunAt: string;
  status: InventoryReportStatus;
  description: string;
}

export interface InventoryIntegration {
  id: string;
  name: string;
  category: 'Shipping' | 'Marketplace' | 'Accounting' | 'EDI' | 'SMS' | 'Payment' | 'Ecosystem' | 'API';
  mode: 'OAuth' | 'API Key' | 'Webhook' | 'Manual';
  direction: 'Inbound' | 'Outbound' | 'Bidirectional';
  lastSyncAt: string;
  owner: string;
  status: InventoryIntegrationStatus;
  description: string;
}

export interface InventoryAutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  runs: number;
  lastRunAt: string;
  status: InventoryAutomationStatus;
}

export interface InventoryDocumentTemplate {
  id: string;
  name: string;
  type: 'Purchase Order' | 'Delivery Challan' | 'Packing Slip' | 'Invoice Email' | 'Return Note' | 'Vendor Portal';
  locale: string;
  lastUpdated: string;
  status: InventoryTemplateStatus;
}

export interface InventoryReportingTag {
  id: string;
  name: string;
  appliesTo: string[];
  color: string;
  records: number;
}

export interface InventoryPortalPreview {
  id: string;
  name: string;
  audience: 'Customer' | 'Vendor';
  enabledModules: string[];
  records: number;
  lastActivityAt: string;
  status: InventoryPortalStatus;
}

export interface InventoryWebTab {
  id: string;
  name: string;
  url: string;
  owner: string;
  status: InventoryPortalStatus;
}

export interface InventoryCustomFunction {
  id: string;
  name: string;
  language: 'JavaScript' | 'Python' | 'Formula';
  trigger: string;
  lastTestAt: string;
  status: InventoryAutomationStatus;
}

export interface InventoryWebhook {
  id: string;
  name: string;
  event: string;
  target: string;
  lastDeliveryAt: string;
  successRate: number;
  status: InventoryWebhookStatus;
}

export interface InventoryAuditEvent {
  id: string;
  actor: string;
  action: string;
  objectType: string;
  objectName: string;
  severity: InventoryAuditSeverity;
  occurredAt: string;
  ipAddress: string;
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
  sourceBinCode?: string;
  destinationBinCode?: string;
  expectedArrival?: string;
  requestedBy?: string;
  carrier?: string;
  priority?: PickListPriority;
}

export interface InventoryStateShape {
  products: InventoryProduct[];
  itemGroups: InventoryItemGroup[];
  compositeItems: InventoryCompositeItem[];
  priceLists: InventoryPriceList[];
  suppliers: InventorySupplier[];
  warehouses: Warehouse[];
  warehouseBins: WarehouseBin[];
  warehouseRestrictions: WarehouseRestriction[];
  pickLists: PickList[];
  fulfillmentOrders: InventoryFulfillmentOrder[];
  packages: InventoryPackage[];
  deliveryChallans: InventoryDeliveryChallan[];
  salesReturns: InventorySalesReturn[];
  backorders: InventoryBackorder[];
  dropshipments: InventoryDropshipment[];
  purchaseOrders: PurchaseOrder[];
  purchaseReceives: PurchaseReceive[];
  vendorBills: VendorBill[];
  vendorPayments: VendorPayment[];
  advancedReports: InventoryAdvancedReport[];
  integrations: InventoryIntegration[];
  automationRules: InventoryAutomationRule[];
  documentTemplates: InventoryDocumentTemplate[];
  reportingTags: InventoryReportingTag[];
  portalPreviews: InventoryPortalPreview[];
  webTabs: InventoryWebTab[];
  customFunctions: InventoryCustomFunction[];
  webhooks: InventoryWebhook[];
  auditEvents: InventoryAuditEvent[];
  stockLedger: StockLedgerEntry[];
  transfers: StockTransfer[];
}

export type ProductDraft = Omit<InventoryProduct, 'id' | 'currentStock'> & { currentStock?: number };
export type SupplierDraft = Omit<InventorySupplier, 'id'>;
export type WarehouseDraft = Omit<Warehouse, 'id'>;
export type PurchaseOrderDraft = Omit<PurchaseOrder, 'id' | 'number' | 'supplierName'>;
export type StockTransferDraft = Omit<StockTransfer, 'id' | 'number' | 'fromWarehouseName' | 'toWarehouseName' | 'productName'>;
