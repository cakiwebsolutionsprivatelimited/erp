import type {
  InventoryAdvancedReport,
  InventoryAuditEvent,
  InventoryCompositeItem,
  InventoryBackorder,
  InventoryAutomationRule,
  InventoryCustomFunction,
  InventoryDeliveryChallan,
  InventoryDocumentTemplate,
  InventoryDropshipment,
  InventoryFulfillmentOrder,
  InventoryIntegration,
  InventoryItemGroup,
  InventoryPackage,
  InventoryPortalPreview,
  InventoryPriceList,
  InventoryProduct,
  InventoryReportingTag,
  InventorySalesReturn,
  InventoryStateShape,
  InventoryWebhook,
  InventoryWebTab,
  PickList,
  PurchaseReceive,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus,
  StockLedgerEntry,
  StockStatus,
  StockTransfer,
  VendorBill,
  VendorPayment,
  Warehouse,
  WarehouseBin,
  WarehouseRestriction,
} from '@/tenant/inventory/types';

export const INVENTORY_DEMO_TODAY = '2026-06-18';

const roundCurrency = (value: number) => Math.round(value * 100) / 100;
const formatReportMetric = (value: number) => `Rs ${Math.round(value).toLocaleString('en-IN')}`;
const stockMovementCountPreview = () => products.length + 3;

export const getStockStatus = (product: InventoryProduct): StockStatus => {
  if (product.currentStock <= 0) return 'Out of Stock';
  if (product.currentStock <= product.reorderLevel) return 'Low Stock';
  return 'In Stock';
};

export const createProductNumber = (count: number) => `PRD-${String(count + 1).padStart(4, '0')}`;
export const createPurchaseOrderNumber = (count: number) => `PO-2026-${String(count + 1).padStart(3, '0')}`;
export const createTransferNumber = (count: number) => `ST-2026-${String(count + 1).padStart(3, '0')}`;

export const calculatePurchaseOrderTotals = (items: PurchaseOrderItem[]) => {
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.quantity * item.rate, 0));
  const tax = roundCurrency(items.reduce((sum, item) => sum + (item.quantity * item.rate * item.gstRate) / 100, 0));
  return { subtotal, tax, total: roundCurrency(subtotal + tax) };
};

export const getPurchaseOrderTotal = (order: PurchaseOrder) => calculatePurchaseOrderTotals(order.items).total;

const warehouses: Warehouse[] = [
  {
    id: 'WH-1',
    name: 'Bhubaneswar Main Warehouse',
    code: 'BBSR-MAIN',
    address: 'Plot 42, Infocity Road, Patia, Bhubaneswar',
    manager: 'Priya Mishra',
    status: 'Active',
  },
  {
    id: 'WH-2',
    name: 'Cuttack Retail Store',
    code: 'CTC-STORE',
    address: 'Buxi Bazaar, Cuttack',
    manager: 'Rakesh Sahoo',
    status: 'Active',
  },
  {
    id: 'WH-3',
    name: 'Rourkela Service Stock',
    code: 'RKL-SVC',
    address: 'Civil Township, Rourkela',
    manager: 'Anita Das',
    status: 'Active',
  },
];

const warehouseBins: WarehouseBin[] = [
  { id: 'BIN-1', warehouseId: 'WH-1', warehouseName: 'Bhubaneswar Main Warehouse', code: 'BBSR-A1-B04', zone: 'Fast Pick', aisle: 'Aisle 1', capacityUtilization: 72, currentSkuCount: 14, pickSequence: 10, assignedTo: 'Debasis Rout', status: 'Available' },
  { id: 'BIN-2', warehouseId: 'WH-1', warehouseName: 'Bhubaneswar Main Warehouse', code: 'BBSR-A1-C02', zone: 'Fast Pick', aisle: 'Aisle 1', capacityUtilization: 88, currentSkuCount: 11, pickSequence: 20, assignedTo: 'Debasis Rout', status: 'High Utilization' },
  { id: 'BIN-3', warehouseId: 'WH-1', warehouseName: 'Bhubaneswar Main Warehouse', code: 'BBSR-A3-L02', zone: 'Label Rack', aisle: 'Aisle 3', capacityUtilization: 64, currentSkuCount: 8, pickSequence: 30, assignedTo: 'Madhab Nayak', status: 'Available' },
  { id: 'BIN-4', warehouseId: 'WH-1', warehouseName: 'Bhubaneswar Main Warehouse', code: 'BBSR-CAGE-A', zone: 'Secure Cage', aisle: 'Cage A', capacityUtilization: 46, currentSkuCount: 5, pickSequence: 40, assignedTo: 'Priya Mishra', status: 'Restricted' },
  { id: 'BIN-5', warehouseId: 'WH-2', warehouseName: 'Cuttack Retail Store', code: 'CTC-STORE-F1', zone: 'Front Store', aisle: 'Floor 1', capacityUtilization: 81, currentSkuCount: 18, pickSequence: 10, assignedTo: 'Rakesh Sahoo', status: 'High Utilization' },
  { id: 'BIN-6', warehouseId: 'WH-2', warehouseName: 'Cuttack Retail Store', code: 'CTC-BACK-R2', zone: 'Back Room', aisle: 'Rack 2', capacityUtilization: 55, currentSkuCount: 9, pickSequence: 20, assignedTo: 'Sonal Das', status: 'Available' },
  { id: 'BIN-7', warehouseId: 'WH-3', warehouseName: 'Rourkela Service Stock', code: 'RKL-SVC-S1', zone: 'Service Shelf', aisle: 'Shelf 1', capacityUtilization: 68, currentSkuCount: 12, pickSequence: 10, assignedTo: 'Anita Das', status: 'Available' },
  { id: 'BIN-8', warehouseId: 'WH-3', warehouseName: 'Rourkela Service Stock', code: 'RKL-QA-HOLD', zone: 'QA Hold', aisle: 'Inspection', capacityUtilization: 32, currentSkuCount: 4, pickSequence: 90, assignedTo: 'Arjun Behera', status: 'Maintenance' },
];

const warehouseRestrictions: WarehouseRestriction[] = [
  { id: 'WR-1', role: 'Inventory Manager', warehouseIds: ['WH-1', 'WH-2', 'WH-3'], warehouseNames: ['All warehouses'], permissions: ['View', 'Receive', 'Pick', 'Transfer', 'Adjust'], status: 'Active' },
  { id: 'WR-2', role: 'Sales Executive', warehouseIds: ['WH-1', 'WH-2'], warehouseNames: ['Bhubaneswar Main Warehouse', 'Cuttack Retail Store'], permissions: ['View availability', 'Reserve preview'], status: 'Active' },
  { id: 'WR-3', role: 'Support Staff', warehouseIds: ['WH-3'], warehouseNames: ['Rourkela Service Stock'], permissions: ['View', 'Pick service parts'], status: 'Active' },
  { id: 'WR-4', role: 'Accountant', warehouseIds: ['WH-1'], warehouseNames: ['Bhubaneswar Main Warehouse'], permissions: ['View valuation', 'View audit'], status: 'Draft' },
];

const products: InventoryProduct[] = [
  {
    id: 'IP-1',
    name: 'Barcode Scanner',
    sku: 'HW-SCAN-USB',
    barcode: '8901234500011',
    category: 'Hardware',
    subcategory: 'POS Devices',
    unit: 'Piece',
    hsnCode: '847190',
    gstRate: 18,
    salePrice: 8500,
    purchasePrice: 6200,
    openingStock: 28,
    currentStock: 26,
    reorderLevel: 8,
    description: 'USB barcode scanner for retail counters and warehouse inward desks.',
    status: 'Active',
    imageLabel: 'Scanner',
    monthlySales: 18,
  },
  {
    id: 'IP-2',
    name: 'Thermal Invoice Printer',
    sku: 'HW-PRINT-80',
    barcode: '8901234500028',
    category: 'Hardware',
    subcategory: 'Printers',
    unit: 'Piece',
    hsnCode: '844332',
    gstRate: 18,
    salePrice: 11500,
    purchasePrice: 8200,
    openingStock: 15,
    currentStock: 5,
    reorderLevel: 6,
    description: '80mm thermal printer for GST invoice counters.',
    status: 'Active',
    imageLabel: 'Printer',
    monthlySales: 12,
  },
  {
    id: 'IP-3',
    name: 'RFID Shelf Label Pack',
    sku: 'INV-RFID-100',
    barcode: '8901234500035',
    category: 'Inventory Supplies',
    subcategory: 'Labels',
    unit: 'Pack',
    hsnCode: '852352',
    gstRate: 18,
    salePrice: 2400,
    purchasePrice: 1650,
    openingStock: 80,
    currentStock: 64,
    reorderLevel: 20,
    description: 'Pack of 100 RFID-ready shelf labels for bin and product tagging.',
    status: 'Active',
    imageLabel: 'RFID',
    monthlySales: 42,
  },
  {
    id: 'IP-4',
    name: 'Counter Cash Drawer',
    sku: 'HW-CASH-DRW',
    barcode: '8901234500042',
    category: 'Hardware',
    subcategory: 'POS Devices',
    unit: 'Piece',
    hsnCode: '847290',
    gstRate: 18,
    salePrice: 6900,
    purchasePrice: 4750,
    openingStock: 10,
    currentStock: 0,
    reorderLevel: 4,
    description: 'Metal cash drawer with RJ11 printer trigger.',
    status: 'Active',
    imageLabel: 'Drawer',
    monthlySales: 7,
  },
  {
    id: 'IP-5',
    name: 'CloudDesk Inventory Licence',
    sku: 'SW-INV-LIC',
    barcode: '8901234500059',
    category: 'Software',
    subcategory: 'Licences',
    unit: 'Year',
    hsnCode: '997331',
    gstRate: 18,
    salePrice: 18000,
    purchasePrice: 12500,
    openingStock: 50,
    currentStock: 44,
    reorderLevel: 10,
    description: 'Annual inventory module licence bundled with onboarding support.',
    status: 'Active',
    imageLabel: 'Licence',
    monthlySales: 23,
  },
  {
    id: 'IP-6',
    name: 'ERP Starter Kit',
    sku: 'KIT-ERP-START',
    barcode: '8901234500066',
    category: 'Bundle',
    subcategory: 'Implementation Kit',
    unit: 'Kit',
    hsnCode: '998313',
    gstRate: 18,
    salePrice: 55000,
    purchasePrice: 36500,
    openingStock: 8,
    currentStock: 7,
    reorderLevel: 3,
    description: 'Hardware, setup, and initial configuration bundle for small retailers.',
    status: 'Active',
    imageLabel: 'Kit',
    monthlySales: 5,
  },
  {
    id: 'IP-7',
    name: 'Pharmacy Batch Label Roll',
    sku: 'LBL-PHARMA-B',
    barcode: '8901234500073',
    category: 'Inventory Supplies',
    subcategory: 'Labels',
    unit: 'Roll',
    hsnCode: '482110',
    gstRate: 12,
    salePrice: 950,
    purchasePrice: 610,
    openingStock: 120,
    currentStock: 34,
    reorderLevel: 30,
    description: 'Adhesive label roll for batch, expiry, and rack information.',
    status: 'Active',
    imageLabel: 'Labels',
    monthlySales: 55,
  },
  {
    id: 'IP-8',
    name: 'Retail Weighing Scale',
    sku: 'HW-SCALE-30KG',
    barcode: '8901234500080',
    category: 'Hardware',
    subcategory: 'Scales',
    unit: 'Piece',
    hsnCode: '842381',
    gstRate: 18,
    salePrice: 14500,
    purchasePrice: 10400,
    openingStock: 9,
    currentStock: 3,
    reorderLevel: 4,
    description: '30kg counter scale with serial output for POS integration.',
    status: 'Active',
    imageLabel: 'Scale',
    monthlySales: 8,
  },
  {
    id: 'IP-9',
    name: 'Warehouse Bin Set',
    sku: 'WH-BIN-SET',
    barcode: '8901234500097',
    category: 'Warehouse',
    subcategory: 'Storage',
    unit: 'Set',
    hsnCode: '392310',
    gstRate: 18,
    salePrice: 4200,
    purchasePrice: 2800,
    openingStock: 60,
    currentStock: 51,
    reorderLevel: 18,
    description: 'Stackable bins for spare parts and fast-moving inventory.',
    status: 'Active',
    imageLabel: 'Bins',
    monthlySales: 20,
  },
  {
    id: 'IP-10',
    name: 'Handheld Stock Terminal',
    sku: 'HW-HHT-4G',
    barcode: '8901234500103',
    category: 'Hardware',
    subcategory: 'Warehouse Devices',
    unit: 'Piece',
    hsnCode: '847130',
    gstRate: 18,
    salePrice: 28500,
    purchasePrice: 21400,
    openingStock: 6,
    currentStock: 2,
    reorderLevel: 3,
    description: 'Android handheld terminal for stock count and barcode receiving.',
    status: 'Active',
    imageLabel: 'Terminal',
    monthlySales: 4,
  },
  {
    id: 'IP-11',
    name: 'Network Patch Cable Box',
    sku: 'NET-CAT6-BOX',
    barcode: '8901234500110',
    category: 'Networking',
    subcategory: 'Cables',
    unit: 'Box',
    hsnCode: '854442',
    gstRate: 18,
    salePrice: 3600,
    purchasePrice: 2400,
    openingStock: 36,
    currentStock: 28,
    reorderLevel: 10,
    description: 'Box of short Cat6 patch cables for counter and rack installs.',
    status: 'Active',
    imageLabel: 'Cable',
    monthlySales: 14,
  },
  {
    id: 'IP-12',
    name: 'Legacy Receipt Paper',
    sku: 'PAPER-OLD-57',
    barcode: '8901234500127',
    category: 'Inventory Supplies',
    subcategory: 'Paper',
    unit: 'Roll',
    hsnCode: '480256',
    gstRate: 12,
    salePrice: 90,
    purchasePrice: 58,
    openingStock: 140,
    currentStock: 112,
    reorderLevel: 35,
    description: 'Older 57mm receipt paper roll, kept for legacy counters.',
    status: 'Inactive',
    imageLabel: 'Paper',
    monthlySales: 2,
  },
];

const productTrackingProfiles: Record<string, Partial<InventoryProduct>> = {
  'HW-SCAN-USB': {
    itemGroupId: 'IG-1',
    itemGroupName: 'POS Hardware',
    trackingType: 'Serial',
    serialNumbers: ['SCN-USB-2601', 'SCN-USB-2602', 'SCN-USB-2603', 'SCN-USB-2604'],
    warehouseLocation: 'Aisle 1, Bin B-04',
  },
  'HW-PRINT-80': {
    itemGroupId: 'IG-1',
    itemGroupName: 'POS Hardware',
    trackingType: 'Serial',
    serialNumbers: ['TPR-8026-010', 'TPR-8026-011', 'TPR-8026-012'],
    warehouseLocation: 'Aisle 1, Bin C-02',
  },
  'INV-RFID-100': {
    itemGroupId: 'IG-2',
    itemGroupName: 'Labels and Consumables',
    trackingType: 'Batch',
    batchNumber: 'BAT-2026-RFID-05',
    expiryDate: '2028-05-31',
    warehouseLocation: 'Aisle 3, Rack L-08',
  },
  'HW-CASH-DRW': {
    itemGroupId: 'IG-1',
    itemGroupName: 'POS Hardware',
    trackingType: 'Serial',
    serialNumbers: ['CDR-2606-001', 'CDR-2606-002'],
    warehouseLocation: 'Aisle 1, Bin C-06',
  },
  'SW-INV-LIC': {
    itemGroupId: 'IG-3',
    itemGroupName: 'Software Licences',
    trackingType: 'None',
    warehouseLocation: 'Digital fulfilment',
  },
  'KIT-ERP-START': {
    itemGroupId: 'IG-4',
    itemGroupName: 'Implementation Bundles',
    trackingType: 'Serial + Batch',
    serialNumbers: ['KIT-ERP-2601', 'KIT-ERP-2602'],
    batchNumber: 'KIT-JUN-2026',
    warehouseLocation: 'Assembly bay 2',
  },
  'LBL-PHARMA-B': {
    itemGroupId: 'IG-2',
    itemGroupName: 'Labels and Consumables',
    trackingType: 'Batch',
    batchNumber: 'PH-LBL-2026-06',
    expiryDate: '2027-06-30',
    warehouseLocation: 'Aisle 3, Rack L-02',
  },
  'HW-SCALE-30KG': {
    itemGroupId: 'IG-1',
    itemGroupName: 'POS Hardware',
    trackingType: 'Serial',
    serialNumbers: ['SCL-30KG-0601', 'SCL-30KG-0602'],
    warehouseLocation: 'Aisle 2, Bin S-01',
  },
  'WH-BIN-SET': {
    itemGroupId: 'IG-5',
    itemGroupName: 'Warehouse Supplies',
    trackingType: 'Batch',
    batchNumber: 'WH-BIN-JUN26',
    warehouseLocation: 'Bulk zone 4',
  },
  'HW-HHT-4G': {
    itemGroupId: 'IG-1',
    itemGroupName: 'POS Hardware',
    trackingType: 'Serial',
    serialNumbers: ['HHT-4G-2601', 'HHT-4G-2602'],
    warehouseLocation: 'Secure cage A',
  },
  'NET-CAT6-BOX': {
    itemGroupId: 'IG-5',
    itemGroupName: 'Warehouse Supplies',
    trackingType: 'Batch',
    batchNumber: 'NET-CAT6-2026-04',
    warehouseLocation: 'Aisle 5, Cable bay',
  },
  'PAPER-OLD-57': {
    itemGroupId: 'IG-2',
    itemGroupName: 'Labels and Consumables',
    trackingType: 'Batch',
    batchNumber: 'PAPER-57-2025-11',
    expiryDate: '2027-11-30',
    warehouseLocation: 'Legacy shelf P-01',
  },
};

const inventoryProducts: InventoryProduct[] = products.map((product) => ({
  ...product,
  trackingType: 'None',
  warehouseLocation: 'Bhubaneswar Main Warehouse',
  ...productTrackingProfiles[product.sku],
}));

const itemGroups: InventoryItemGroup[] = [
  { id: 'IG-1', name: 'POS Hardware', attributes: ['Device type', 'Connectivity', 'Warranty'], defaultUnit: 'Piece', gstRate: 18, variants: 14, activeItems: 5, status: 'Active' },
  { id: 'IG-2', name: 'Labels and Consumables', attributes: ['Material', 'Roll size', 'Expiry control'], defaultUnit: 'Roll', gstRate: 12, variants: 9, activeItems: 3, status: 'Active' },
  { id: 'IG-3', name: 'Software Licences', attributes: ['Plan', 'Duration', 'Support tier'], defaultUnit: 'Year', gstRate: 18, variants: 6, activeItems: 1, status: 'Active' },
  { id: 'IG-4', name: 'Implementation Bundles', attributes: ['Bundle tier', 'Hardware pack', 'Service hours'], defaultUnit: 'Kit', gstRate: 18, variants: 4, activeItems: 1, status: 'Active' },
  { id: 'IG-5', name: 'Warehouse Supplies', attributes: ['Storage type', 'Pack size', 'Material'], defaultUnit: 'Set', gstRate: 18, variants: 7, activeItems: 2, status: 'Active' },
];

const compositeItems: InventoryCompositeItem[] = [
  {
    id: 'CI-1',
    name: 'Retail Counter Starter Bundle',
    sku: 'BND-RET-COUNTER',
    salePrice: 73500,
    costPrice: 51450,
    currentStock: 5,
    status: 'Active',
    components: [
      { productId: 'IP-1', productName: 'Barcode Scanner', quantity: 1, unit: 'Piece' },
      { productId: 'IP-2', productName: 'Thermal Invoice Printer', quantity: 1, unit: 'Piece' },
      { productId: 'IP-4', productName: 'Counter Cash Drawer', quantity: 1, unit: 'Piece' },
      { productId: 'IP-5', productName: 'CloudDesk Inventory Licence', quantity: 1, unit: 'Year' },
    ],
  },
  {
    id: 'CI-2',
    name: 'Warehouse Scanning Kit',
    sku: 'BND-WH-SCAN',
    salePrice: 42500,
    costPrice: 30400,
    currentStock: 2,
    status: 'Active',
    components: [
      { productId: 'IP-10', productName: 'Handheld Stock Terminal', quantity: 1, unit: 'Piece' },
      { productId: 'IP-3', productName: 'RFID Shelf Label Pack', quantity: 2, unit: 'Pack' },
      { productId: 'IP-9', productName: 'Warehouse Bin Set', quantity: 1, unit: 'Set' },
    ],
  },
  {
    id: 'CI-3',
    name: 'Pharmacy Labelling Pack',
    sku: 'BND-PHARMA-LABEL',
    salePrice: 6400,
    costPrice: 4020,
    currentStock: 18,
    status: 'Active',
    components: [
      { productId: 'IP-7', productName: 'Pharmacy Batch Label Roll', quantity: 4, unit: 'Roll' },
      { productId: 'IP-3', productName: 'RFID Shelf Label Pack', quantity: 1, unit: 'Pack' },
    ],
  },
];

const priceLists: InventoryPriceList[] = [
  { id: 'PL-1', name: 'Retail Starter Customers', type: 'Customer', adjustmentType: 'Discount', adjustmentValue: 8, currency: 'INR', appliesTo: 'POS Hardware, Bundles', status: 'Active' },
  { id: 'PL-2', name: 'Eastern Vendor Rate Card', type: 'Vendor', adjustmentType: 'Fixed', adjustmentValue: 0, currency: 'INR', appliesTo: 'Thermal printers and cash drawers', status: 'Active' },
  { id: 'PL-3', name: 'Odisha Region Promo', type: 'Region', adjustmentType: 'Discount', adjustmentValue: 5, currency: 'INR', appliesTo: 'Inventory Supplies', status: 'Active' },
  { id: 'PL-4', name: 'Urgent Replenishment Markup', type: 'Customer', adjustmentType: 'Markup', adjustmentValue: 12, currency: 'INR', appliesTo: 'Low stock hardware', status: 'Inactive' },
];

const suppliers = [
  {
    id: 'IS-1',
    name: 'Scanner World India',
    contactPerson: 'Neeraj Jain',
    phone: '+91 98765 71001',
    email: 'orders@scannerworld.example',
    gstNumber: '21ABFCS9431Q1Z3',
    address: 'Mancheswar Industrial Estate, Bhubaneswar',
    paymentTerms: '30 days credit',
    status: 'Active',
  },
  {
    id: 'IS-2',
    name: 'Eastern Office Hardware',
    contactPerson: 'Sushmita Roy',
    phone: '+91 98765 71002',
    email: 'sales@easternhardware.example',
    gstNumber: '19AADCE5528M1Z8',
    address: 'Salt Lake Sector V, Kolkata',
    paymentTerms: '50% advance, balance on delivery',
    status: 'Active',
  },
  {
    id: 'IS-3',
    name: 'CloudDesk Apps Pvt. Ltd.',
    contactPerson: 'Amit Kulkarni',
    phone: '+91 98765 71003',
    email: 'billing@clouddesk.example',
    gstNumber: '27AAGCC1189D1Z6',
    address: 'Baner Road, Pune',
    paymentTerms: 'Annual prepaid',
    status: 'Active',
  },
  {
    id: 'IS-4',
    name: 'Odisha Packaging Mart',
    contactPerson: 'Lopa Mohanty',
    phone: '+91 98765 71004',
    email: 'support@opmart.example',
    gstNumber: '21AAEFO3401P1Z2',
    address: 'Cuttack Road, Bhubaneswar',
    paymentTerms: '15 days credit',
    status: 'Active',
  },
  {
    id: 'IS-5',
    name: 'Old Paper Depot',
    contactPerson: 'Manoj Das',
    phone: '+91 98765 71005',
    email: 'hello@oldpaper.example',
    gstNumber: '21AAPFO7731H1Z9',
    address: 'Madhupatna, Cuttack',
    paymentTerms: 'Cash on delivery',
    status: 'Inactive',
  },
] satisfies InventoryStateShape['suppliers'];

const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-1',
    number: 'PO-2026-001',
    supplierId: 'IS-1',
    supplierName: 'Scanner World India',
    date: '2026-06-01',
    expectedDelivery: '2026-06-08',
    status: 'Received',
    notes: 'Restock barcode scanner and terminal devices.',
    items: [
      { id: 'POI-1-1', productId: 'IP-1', productName: 'Barcode Scanner', quantity: 12, rate: 6200, gstRate: 18 },
      { id: 'POI-1-2', productId: 'IP-10', productName: 'Handheld Stock Terminal', quantity: 2, rate: 21400, gstRate: 18 },
    ],
  },
  {
    id: 'PO-2',
    number: 'PO-2026-002',
    supplierId: 'IS-2',
    supplierName: 'Eastern Office Hardware',
    date: '2026-06-05',
    expectedDelivery: '2026-06-14',
    status: 'Sent',
    notes: 'Printer and cash drawer purchase for retail clients.',
    items: [
      { id: 'POI-2-1', productId: 'IP-2', productName: 'Thermal Invoice Printer', quantity: 10, rate: 8200, gstRate: 18 },
      { id: 'POI-2-2', productId: 'IP-4', productName: 'Counter Cash Drawer', quantity: 8, rate: 4750, gstRate: 18 },
    ],
  },
  {
    id: 'PO-3',
    number: 'PO-2026-003',
    supplierId: 'IS-3',
    supplierName: 'CloudDesk Apps Pvt. Ltd.',
    date: '2026-06-10',
    expectedDelivery: '2026-06-18',
    status: 'Partially Received',
    notes: 'Licence block for new onboarding customers.',
    items: [
      { id: 'POI-3-1', productId: 'IP-5', productName: 'CloudDesk Inventory Licence', quantity: 25, rate: 12500, gstRate: 18 },
    ],
  },
  {
    id: 'PO-4',
    number: 'PO-2026-004',
    supplierId: 'IS-4',
    supplierName: 'Odisha Packaging Mart',
    date: '2026-06-16',
    expectedDelivery: '2026-06-24',
    status: 'Draft',
    notes: 'Label and bin replenishment draft.',
    items: [
      { id: 'POI-4-1', productId: 'IP-7', productName: 'Pharmacy Batch Label Roll', quantity: 50, rate: 610, gstRate: 12 },
      { id: 'POI-4-2', productId: 'IP-9', productName: 'Warehouse Bin Set', quantity: 20, rate: 2800, gstRate: 18 },
    ],
  },
];

const purchaseReceives: PurchaseReceive[] = [
  {
    id: 'PRC-1',
    receiveNumber: 'GRN-2026-001',
    purchaseOrderId: 'PO-1',
    purchaseOrderNumber: 'PO-2026-001',
    supplierName: 'Scanner World India',
    receiveDate: '2026-06-08',
    warehouseId: 'WH-1',
    warehouseName: 'Bhubaneswar Main Warehouse',
    receivedBy: 'Priya Mishra',
    status: 'Received',
    inspectionNote: 'All scanner and terminal units accepted after serial verification.',
    items: [
      { id: 'PRCI-1-1', productId: 'IP-1', productName: 'Barcode Scanner', orderedQuantity: 12, receivedQuantity: 12, acceptedQuantity: 12, rejectedQuantity: 0, warehouseBinCode: 'BBSR-A1-B04' },
      { id: 'PRCI-1-2', productId: 'IP-10', productName: 'Handheld Stock Terminal', orderedQuantity: 2, receivedQuantity: 2, acceptedQuantity: 2, rejectedQuantity: 0, warehouseBinCode: 'BBSR-CAGE-A' },
    ],
  },
  {
    id: 'PRC-2',
    receiveNumber: 'GRN-2026-002',
    purchaseOrderId: 'PO-3',
    purchaseOrderNumber: 'PO-2026-003',
    supplierName: 'CloudDesk Apps Pvt. Ltd.',
    receiveDate: '2026-06-17',
    warehouseId: 'WH-1',
    warehouseName: 'Bhubaneswar Main Warehouse',
    receivedBy: 'Madhab Nayak',
    status: 'Partially Received',
    inspectionNote: 'Licence batch received, activation list pending from vendor.',
    items: [
      { id: 'PRCI-2-1', productId: 'IP-5', productName: 'CloudDesk Inventory Licence', orderedQuantity: 25, receivedQuantity: 15, acceptedQuantity: 15, rejectedQuantity: 0, warehouseBinCode: 'Digital fulfilment' },
    ],
  },
  {
    id: 'PRC-3',
    receiveNumber: 'GRN-2026-003',
    purchaseOrderId: 'PO-2',
    purchaseOrderNumber: 'PO-2026-002',
    supplierName: 'Eastern Office Hardware',
    receiveDate: '2026-06-18',
    warehouseId: 'WH-1',
    warehouseName: 'Bhubaneswar Main Warehouse',
    receivedBy: 'Debasis Rout',
    status: 'Quality Hold',
    inspectionNote: 'Two cash drawers held for latch inspection before stock acceptance.',
    items: [
      { id: 'PRCI-3-1', productId: 'IP-2', productName: 'Thermal Invoice Printer', orderedQuantity: 10, receivedQuantity: 6, acceptedQuantity: 6, rejectedQuantity: 0, warehouseBinCode: 'BBSR-A1-C02' },
      { id: 'PRCI-3-2', productId: 'IP-4', productName: 'Counter Cash Drawer', orderedQuantity: 8, receivedQuantity: 4, acceptedQuantity: 2, rejectedQuantity: 2, warehouseBinCode: 'BBSR-QA-HOLD' },
    ],
  },
];

const vendorBills: VendorBill[] = purchaseOrders.map((order, index) => {
  const totals = calculatePurchaseOrderTotals(order.items);
  const receivedAmount = purchaseReceives
    .filter((receive) => receive.purchaseOrderId === order.id)
    .reduce((sum, receive) => {
      const acceptedValue = receive.items.reduce((itemSum, item) => {
        const orderItem = order.items.find((row) => row.productId === item.productId);
        return itemSum + item.acceptedQuantity * (orderItem?.rate || 0) * (1 + (orderItem?.gstRate || 0) / 100);
      }, 0);
      return sum + acceptedValue;
    }, 0);
  return {
    id: `VB-${index + 1}`,
    billNumber: `BILL-2026-${String(index + 1).padStart(3, '0')}`,
    purchaseOrderId: order.id,
    purchaseOrderNumber: order.number,
    supplierId: order.supplierId,
    supplierName: order.supplierName,
    billDate: ['2026-06-09', '2026-06-18', '2026-06-18', '2026-06-20'][index],
    dueDate: ['2026-07-09', '2026-07-03', '2026-06-25', '2026-07-05'][index],
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    receivedAmount: roundCurrency(receivedAmount),
    status: (['Paid', 'Pending Approval', 'Approved', 'Draft'] as const)[index],
  };
});

const vendorPayments: VendorPayment[] = [
  { id: 'VP-1', paymentNumber: 'PAY-2026-001', vendorBillId: 'VB-1', billNumber: 'BILL-2026-001', supplierName: 'Scanner World India', paymentDate: '2026-06-12', amount: vendorBills[0].total, mode: 'Bank Transfer', reference: 'UTR-6218-SCN', status: 'Reconciled' },
  { id: 'VP-2', paymentNumber: 'PAY-2026-002', vendorBillId: 'VB-2', billNumber: 'BILL-2026-002', supplierName: 'Eastern Office Hardware', paymentDate: '2026-06-24', amount: 60000, mode: 'Cheque', reference: 'CHQ-884201', status: 'Scheduled' },
  { id: 'VP-3', paymentNumber: 'PAY-2026-003', vendorBillId: 'VB-3', billNumber: 'BILL-2026-003', supplierName: 'CloudDesk Apps Pvt. Ltd.', paymentDate: '2026-06-19', amount: 147500, mode: 'UPI', reference: 'UPI-CD-20260619', status: 'Paid' },
];

const integrations: InventoryIntegration[] = [
  { id: 'INT-1', name: 'BlueDart Shipping', category: 'Shipping', mode: 'API Key', direction: 'Outbound', lastSyncAt: '2026-06-18 17:50', owner: 'Logistics', status: 'Preview', description: 'Rates, label generation, and tracking are UI previews only.' },
  { id: 'INT-2', name: 'Amazon Marketplace', category: 'Marketplace', mode: 'OAuth', direction: 'Inbound', lastSyncAt: 'Not connected', owner: 'Sales Ops', status: 'Needs Auth', description: 'Marketplace order import placeholder.' },
  { id: 'INT-3', name: 'Tally Accounting', category: 'Accounting', mode: 'Manual', direction: 'Outbound', lastSyncAt: '2026-06-17 19:00', owner: 'Accounts Team', status: 'Preview', description: 'Vendor bills, payments, and stock valuation export preview.' },
  { id: 'INT-4', name: '3PL EDI Gateway', category: 'EDI', mode: 'Webhook', direction: 'Bidirectional', lastSyncAt: '2026-06-18 10:15', owner: 'Warehouse Ops', status: 'Disabled', description: 'ASN, shipment, and receipt message preview.' },
  { id: 'INT-5', name: 'SMS Shipment Alerts', category: 'SMS', mode: 'API Key', direction: 'Outbound', lastSyncAt: '2026-06-18 12:05', owner: 'Support Staff', status: 'Connected', description: 'Customer notification template preview.' },
  { id: 'INT-6', name: 'Razorpay Collections', category: 'Payment', mode: 'OAuth', direction: 'Inbound', lastSyncAt: 'Not connected', owner: 'Accounts Team', status: 'Needs Auth', description: 'Customer payment callback placeholder.' },
  { id: 'INT-7', name: 'CRM Inventory Handoff', category: 'Ecosystem', mode: 'Manual', direction: 'Bidirectional', lastSyncAt: '2026-06-18 16:00', owner: 'CRM Admin', status: 'Preview', description: 'Quote/order inventory availability handoff preview.' },
];

const automationRules: InventoryAutomationRule[] = [
  { id: 'AR-1', name: 'Low stock reorder alert', trigger: 'Stock reaches reorder level', conditions: ['Product is Active', 'Supplier is Active'], actions: ['Create PO draft', 'Notify Inventory Manager'], runs: 38, lastRunAt: '2026-06-18 09:20', status: 'Active' },
  { id: 'AR-2', name: 'Batch expiry warning', trigger: 'Expiry within 90 days', conditions: ['Batch tracked item', 'Stock on hand > 0'], actions: ['Add expiry tag', 'Notify warehouse owner'], runs: 12, lastRunAt: '2026-06-17 18:10', status: 'Active' },
  { id: 'AR-3', name: 'Vendor bill approval route', trigger: 'Vendor bill above Rs 1,00,000', conditions: ['Bill status Pending Approval'], actions: ['Assign Accounts Manager', 'Send approval notification'], runs: 5, lastRunAt: '2026-06-18 14:35', status: 'Draft' },
  { id: 'AR-4', name: 'Failed webhook retry', trigger: 'Webhook delivery fails', conditions: ['Retry count < 3'], actions: ['Retry in 15 minutes', 'Log audit warning'], runs: 7, lastRunAt: '2026-06-18 11:45', status: 'Paused' },
];

const documentTemplates: InventoryDocumentTemplate[] = [
  { id: 'TPL-1', name: 'GST Purchase Order', type: 'Purchase Order', locale: 'en-IN', lastUpdated: '2026-06-15', status: 'Active' },
  { id: 'TPL-2', name: 'Delivery Challan - Odisha', type: 'Delivery Challan', locale: 'en-IN', lastUpdated: '2026-06-12', status: 'Active' },
  { id: 'TPL-3', name: 'Warehouse Packing Slip', type: 'Packing Slip', locale: 'en-IN', lastUpdated: '2026-06-10', status: 'Active' },
  { id: 'TPL-4', name: 'Vendor Portal PO View', type: 'Vendor Portal', locale: 'en-IN', lastUpdated: '2026-06-09', status: 'Draft' },
  { id: 'TPL-5', name: 'Return Acceptance Note', type: 'Return Note', locale: 'en-IN', lastUpdated: '2026-06-06', status: 'Archived' },
];

const reportingTags: InventoryReportingTag[] = [
  { id: 'TAG-1', name: 'Fast Moving', appliesTo: ['Products', 'Reports'], color: 'Emerald', records: 5 },
  { id: 'TAG-2', name: 'Quality Hold', appliesTo: ['Receives', 'Warehouses'], color: 'Amber', records: 3 },
  { id: 'TAG-3', name: 'Dropship', appliesTo: ['Orders', 'Suppliers'], color: 'Blue', records: 4 },
  { id: 'TAG-4', name: 'Expiry Sensitive', appliesTo: ['Products', 'Batches'], color: 'Rose', records: 2 },
  { id: 'TAG-5', name: 'Owner Review', appliesTo: ['Bills', 'Automation'], color: 'Violet', records: 6 },
];

const portalPreviews: InventoryPortalPreview[] = [
  { id: 'PORT-1', name: 'Customer shipment portal', audience: 'Customer', enabledModules: ['Orders', 'Packages', 'Delivery Challans', 'Returns'], records: 18, lastActivityAt: '2026-06-18 16:35', status: 'Preview' },
  { id: 'PORT-2', name: 'Vendor purchase portal', audience: 'Vendor', enabledModules: ['Purchase Orders', 'Receives', 'Bills', 'Payments'], records: 11, lastActivityAt: '2026-06-18 13:50', status: 'Preview' },
  { id: 'PORT-3', name: 'Retail self-service inventory', audience: 'Customer', enabledModules: ['Availability', 'Backorders', 'Returns'], records: 7, lastActivityAt: '2026-06-17 18:25', status: 'Disabled' },
];

const webTabs: InventoryWebTab[] = [
  { id: 'WT-1', name: 'Carrier Tracking Console', url: 'https://tracking.example.local', owner: 'Logistics', status: 'Preview' },
  { id: 'WT-2', name: '3PL Warehouse Portal', url: 'https://3pl.example.local', owner: 'Warehouse Ops', status: 'Disabled' },
  { id: 'WT-3', name: 'Vendor Rate Card', url: 'https://vendors.example.local/rates', owner: 'Purchase Team', status: 'Preview' },
];

const customFunctions: InventoryCustomFunction[] = [
  { id: 'CF-1', name: 'Calculate reorder quantity', language: 'Formula', trigger: 'Low stock alert', lastTestAt: '2026-06-18 09:10', status: 'Active' },
  { id: 'CF-2', name: 'Validate e-way bill threshold', language: 'JavaScript', trigger: 'Delivery challan issued', lastTestAt: '2026-06-17 17:30', status: 'Draft' },
  { id: 'CF-3', name: 'Vendor bill variance check', language: 'Python', trigger: 'Vendor bill submitted', lastTestAt: '2026-06-18 14:20', status: 'Active' },
];

const webhooks: InventoryWebhook[] = [
  { id: 'WHK-1', name: 'inventory.stock.low', event: 'Stock Low', target: 'https://hooks.example.local/inventory/low-stock', lastDeliveryAt: '2026-06-18 09:20', successRate: 98, status: 'Healthy' },
  { id: 'WHK-2', name: 'purchase.bill.approved', event: 'Vendor Bill Approved', target: 'https://hooks.example.local/accounts/bill', lastDeliveryAt: '2026-06-18 14:36', successRate: 91, status: 'Preview' },
  { id: 'WHK-3', name: 'shipment.status.updated', event: 'Shipment Updated', target: 'https://hooks.example.local/customer/shipment', lastDeliveryAt: '2026-06-18 11:45', successRate: 62, status: 'Failing' },
  { id: 'WHK-4', name: 'warehouse.pick.completed', event: 'Pick Completed', target: 'https://hooks.example.local/warehouse/pick', lastDeliveryAt: 'Paused', successRate: 0, status: 'Paused' },
];

const auditEvents: InventoryAuditEvent[] = [
  { id: 'IA-1', actor: 'Priya Mishra', action: 'Marked purchase receive as Quality Hold', objectType: 'Purchase Receive', objectName: 'GRN-2026-003', severity: 'Warning', occurredAt: '2026-06-18 12:40', ipAddress: '10.0.4.12' },
  { id: 'IA-2', actor: 'System', action: 'Triggered low stock reorder alert', objectType: 'Automation', objectName: 'Low stock reorder alert', severity: 'Info', occurredAt: '2026-06-18 09:20', ipAddress: '127.0.0.1' },
  { id: 'IA-3', actor: 'Accounts Team', action: 'Approved vendor bill', objectType: 'Vendor Bill', objectName: 'BILL-2026-003', severity: 'Info', occurredAt: '2026-06-18 14:36', ipAddress: '10.0.8.32' },
  { id: 'IA-4', actor: 'System', action: 'Webhook delivery failed', objectType: 'Webhook', objectName: 'shipment.status.updated', severity: 'Critical', occurredAt: '2026-06-18 11:45', ipAddress: '127.0.0.1' },
  { id: 'IA-5', actor: 'Debasis Rout', action: 'Created package preview', objectType: 'Package', objectName: 'PKG-2026-001', severity: 'Info', occurredAt: '2026-06-18 10:15', ipAddress: '10.0.6.18' },
  { id: 'IA-6', actor: 'Admin', action: 'Edited delivery challan template', objectType: 'Template', objectName: 'Delivery Challan - Odisha', severity: 'Info', occurredAt: '2026-06-17 18:10', ipAddress: '10.0.1.44' },
];

const stockLedger: StockLedgerEntry[] = products.map<StockLedgerEntry>((product, index) => ({
  id: `SL-${index + 1}`,
  date: '2026-06-01',
  productId: product.id,
  productName: product.name,
  warehouseId: warehouses[index % warehouses.length].id,
  warehouseName: warehouses[index % warehouses.length].name,
  type: 'Opening',
  quantityIn: product.openingStock,
  quantityOut: 0,
  balanceAfter: product.openingStock,
  reference: 'Opening stock',
  notes: 'Demo opening balance imported for inventory module.',
})).concat([
  {
    id: 'SL-50',
    date: '2026-06-08',
    productId: 'IP-1',
    productName: 'Barcode Scanner',
    warehouseId: 'WH-1',
    warehouseName: 'Bhubaneswar Main Warehouse',
    type: 'Purchase Receipt',
    quantityIn: 12,
    quantityOut: 0,
    balanceAfter: 28,
    reference: 'PO-2026-001',
    notes: 'Received against purchase order.',
  },
  {
    id: 'SL-51',
    date: '2026-06-11',
    productId: 'IP-2',
    productName: 'Thermal Invoice Printer',
    warehouseId: 'WH-2',
    warehouseName: 'Cuttack Retail Store',
    type: 'Adjustment',
    quantityIn: 0,
    quantityOut: 4,
    balanceAfter: 5,
    reference: 'Physical count correction',
    notes: 'Reduced after counter installation issue reconciliation.',
  },
  {
    id: 'SL-52',
    date: '2026-06-13',
    productId: 'IP-7',
    productName: 'Pharmacy Batch Label Roll',
    warehouseId: 'WH-1',
    warehouseName: 'Bhubaneswar Main Warehouse',
    type: 'Transfer Out',
    quantityIn: 0,
    quantityOut: 30,
    balanceAfter: 34,
    reference: 'ST-2026-001',
    notes: 'Moved labels to Cuttack store.',
  },
]);

const transfers: StockTransfer[] = [
  {
    id: 'TR-1',
    number: 'ST-2026-001',
    fromWarehouseId: 'WH-1',
    fromWarehouseName: 'Bhubaneswar Main Warehouse',
    toWarehouseId: 'WH-2',
    toWarehouseName: 'Cuttack Retail Store',
    productId: 'IP-7',
    productName: 'Pharmacy Batch Label Roll',
    quantity: 30,
    transferDate: '2026-06-13',
    status: 'Completed',
    notes: 'Store replenishment for pharmacy counter labels.',
    sourceBinCode: 'BBSR-A3-L02',
    destinationBinCode: 'CTC-BACK-R2',
    expectedArrival: '2026-06-13',
    requestedBy: 'Rakesh Sahoo',
    carrier: 'Internal van',
    priority: 'Medium',
  },
  {
    id: 'TR-2',
    number: 'ST-2026-002',
    fromWarehouseId: 'WH-1',
    fromWarehouseName: 'Bhubaneswar Main Warehouse',
    toWarehouseId: 'WH-3',
    toWarehouseName: 'Rourkela Service Stock',
    productId: 'IP-1',
    productName: 'Barcode Scanner',
    quantity: 4,
    transferDate: '2026-06-18',
    status: 'In Transit',
    notes: 'Devices requested by field service team.',
    sourceBinCode: 'BBSR-A1-B04',
    destinationBinCode: 'RKL-SVC-S1',
    expectedArrival: '2026-06-19',
    requestedBy: 'Anita Das',
    carrier: 'BlueDart surface',
    priority: 'High',
  },
  {
    id: 'TR-3',
    number: 'ST-2026-003',
    fromWarehouseId: 'WH-2',
    fromWarehouseName: 'Cuttack Retail Store',
    toWarehouseId: 'WH-1',
    toWarehouseName: 'Bhubaneswar Main Warehouse',
    productId: 'IP-8',
    productName: 'Retail Weighing Scale',
    quantity: 2,
    transferDate: '2026-06-19',
    status: 'Draft',
    notes: 'Return excess weighing scales before stock count.',
    sourceBinCode: 'CTC-STORE-F1',
    destinationBinCode: 'BBSR-A1-C02',
    expectedArrival: '2026-06-20',
    requestedBy: 'Priya Mishra',
    carrier: 'Internal van',
    priority: 'Low',
  },
];

const pickLists: PickList[] = [
  {
    id: 'PK-1',
    number: 'PICK-2026-001',
    salesOrderNumber: 'SO-2026-118',
    customerName: 'Kalinga Retail Mart',
    warehouseId: 'WH-1',
    warehouseName: 'Bhubaneswar Main Warehouse',
    assignedTo: 'Debasis Rout',
    dueDate: '2026-06-18',
    priority: 'High',
    status: 'Picking',
    items: [
      { id: 'PKI-1-1', productId: 'IP-1', productName: 'Barcode Scanner', quantity: 2, pickedQuantity: 2, binCode: 'BBSR-A1-B04', status: 'Picked' },
      { id: 'PKI-1-2', productId: 'IP-2', productName: 'Thermal Invoice Printer', quantity: 1, pickedQuantity: 0, binCode: 'BBSR-A1-C02', status: 'Pending' },
      { id: 'PKI-1-3', productId: 'IP-4', productName: 'Counter Cash Drawer', quantity: 1, pickedQuantity: 0, binCode: 'BBSR-A1-C06', status: 'Short' },
    ],
  },
  {
    id: 'PK-2',
    number: 'PICK-2026-002',
    salesOrderNumber: 'SO-2026-121',
    customerName: 'Shree Pharma',
    warehouseId: 'WH-2',
    warehouseName: 'Cuttack Retail Store',
    assignedTo: 'Sonal Das',
    dueDate: '2026-06-19',
    priority: 'Medium',
    status: 'Packed',
    items: [
      { id: 'PKI-2-1', productId: 'IP-7', productName: 'Pharmacy Batch Label Roll', quantity: 12, pickedQuantity: 12, binCode: 'CTC-BACK-R2', status: 'Picked' },
      { id: 'PKI-2-2', productId: 'IP-3', productName: 'RFID Shelf Label Pack', quantity: 3, pickedQuantity: 3, binCode: 'CTC-BACK-R2', status: 'Picked' },
    ],
  },
  {
    id: 'PK-3',
    number: 'PICK-2026-003',
    salesOrderNumber: 'SO-2026-124',
    customerName: 'Rourkela Distributors',
    warehouseId: 'WH-3',
    warehouseName: 'Rourkela Service Stock',
    assignedTo: 'Arjun Behera',
    dueDate: '2026-06-20',
    priority: 'Urgent',
    status: 'Hold',
    items: [
      { id: 'PKI-3-1', productId: 'IP-10', productName: 'Handheld Stock Terminal', quantity: 1, pickedQuantity: 0, binCode: 'RKL-QA-HOLD', status: 'Pending' },
      { id: 'PKI-3-2', productId: 'IP-1', productName: 'Barcode Scanner', quantity: 4, pickedQuantity: 0, binCode: 'RKL-SVC-S1', status: 'Pending' },
    ],
  },
];

const fulfillmentOrders: InventoryFulfillmentOrder[] = [
  {
    id: 'IFO-1',
    salesOrderId: 'SO-601',
    salesOrderNumber: 'SO-2026-001',
    customerName: 'Kalinga IT Automation',
    orderDate: '2026-06-15',
    promisedDate: '2026-06-25',
    warehouseId: 'WH-1',
    warehouseName: 'Bhubaneswar Main Warehouse',
    channel: 'Direct Sales',
    amount: 138650,
    fulfillmentStatus: 'Picking',
    paymentStatus: 'Partially Paid',
    pickListNumber: 'PICK-2026-001',
    packageNumber: 'PKG-2026-001',
    challanNumber: 'DC-2026-001',
    items: [
      { id: 'IFOI-1-1', productId: 'IP-1', productName: 'Barcode Scanner', orderedQuantity: 2, allocatedQuantity: 2, packedQuantity: 2, warehouseBinCode: 'BBSR-A1-B04' },
      { id: 'IFOI-1-2', productId: 'IP-2', productName: 'Thermal Invoice Printer', orderedQuantity: 1, allocatedQuantity: 1, packedQuantity: 0, warehouseBinCode: 'BBSR-A1-C02' },
      { id: 'IFOI-1-3', productId: 'IP-4', productName: 'Counter Cash Drawer', orderedQuantity: 1, allocatedQuantity: 0, packedQuantity: 0, warehouseBinCode: 'BBSR-A1-C06' },
    ],
  },
  {
    id: 'IFO-2',
    salesOrderId: 'SO-602',
    salesOrderNumber: 'SO-2026-002',
    customerName: 'Odisha Foods Pvt. Ltd.',
    orderDate: '2026-06-15',
    promisedDate: '2026-06-25',
    warehouseId: 'WH-2',
    warehouseName: 'Cuttack Retail Store',
    channel: 'Retail Counter',
    amount: 86570,
    fulfillmentStatus: 'Packed',
    paymentStatus: 'Paid',
    pickListNumber: 'PICK-2026-002',
    packageNumber: 'PKG-2026-002',
    challanNumber: 'DC-2026-002',
    items: [
      { id: 'IFOI-2-1', productId: 'IP-7', productName: 'Pharmacy Batch Label Roll', orderedQuantity: 12, allocatedQuantity: 12, packedQuantity: 12, warehouseBinCode: 'CTC-BACK-R2' },
      { id: 'IFOI-2-2', productId: 'IP-3', productName: 'RFID Shelf Label Pack', orderedQuantity: 3, allocatedQuantity: 3, packedQuantity: 3, warehouseBinCode: 'CTC-BACK-R2' },
    ],
  },
  {
    id: 'IFO-3',
    salesOrderId: 'SO-2026-124',
    salesOrderNumber: 'SO-2026-124',
    customerName: 'Rourkela Distributors',
    orderDate: '2026-06-17',
    promisedDate: '2026-06-22',
    warehouseId: 'WH-3',
    warehouseName: 'Rourkela Service Stock',
    channel: 'Distributor Portal',
    amount: 212400,
    fulfillmentStatus: 'On Hold',
    paymentStatus: 'Unpaid',
    pickListNumber: 'PICK-2026-003',
    items: [
      { id: 'IFOI-3-1', productId: 'IP-10', productName: 'Handheld Stock Terminal', orderedQuantity: 1, allocatedQuantity: 0, packedQuantity: 0, warehouseBinCode: 'RKL-QA-HOLD' },
      { id: 'IFOI-3-2', productId: 'IP-1', productName: 'Barcode Scanner', orderedQuantity: 4, allocatedQuantity: 0, packedQuantity: 0, warehouseBinCode: 'RKL-SVC-S1' },
    ],
  },
  {
    id: 'IFO-4',
    salesOrderId: 'SO-2026-127',
    salesOrderNumber: 'SO-2026-127',
    customerName: 'Shree Pharma',
    orderDate: '2026-06-18',
    promisedDate: '2026-06-28',
    warehouseId: 'WH-1',
    warehouseName: 'Bhubaneswar Main Warehouse',
    channel: 'Dropship',
    amount: 178000,
    fulfillmentStatus: 'Shipped',
    paymentStatus: 'Partially Paid',
    packageNumber: 'DS-2026-001',
    challanNumber: 'DC-2026-003',
    items: [
      { id: 'IFOI-4-1', productId: 'IP-8', productName: 'Retail Weighing Scale', orderedQuantity: 4, allocatedQuantity: 0, packedQuantity: 0, warehouseBinCode: 'Supplier direct' },
    ],
  },
];

const advancedReports: InventoryAdvancedReport[] = [
  { id: 'IR-1', name: 'Stock Valuation Summary', category: 'Inventory', metric: formatReportMetric(inventoryProducts.reduce((sum, product) => sum + product.currentStock * product.purchasePrice, 0)), owner: 'Priya Mishra', lastRunAt: '2026-06-18 18:00', status: 'Ready', description: 'Current stock value by warehouse, category, and item group.' },
  { id: 'IR-2', name: 'Inventory Movement and FIFO', category: 'Inventory', metric: `${stockMovementCountPreview()} movements`, owner: 'Inventory Manager', lastRunAt: '2026-06-18 17:35', status: 'Scheduled', description: 'Opening, adjustment, transfer, receipt, and FIFO layer preview.' },
  { id: 'IR-3', name: 'Product Inventory Snapshot', category: 'Inventory', metric: `${inventoryProducts.length} SKUs`, owner: 'Madhab Nayak', lastRunAt: '2026-06-18 16:20', status: 'Ready', description: 'On hand, reorder level, committed quantity, and available stock by SKU.' },
  { id: 'IR-4', name: 'Purchase and Vendor Analysis', category: 'Purchase', metric: formatReportMetric(purchaseOrders.reduce((sum, order) => sum + getPurchaseOrderTotal(order), 0)), owner: 'Accounts Team', lastRunAt: '2026-06-18 15:45', status: 'Needs Review', description: 'PO value, received value, bill value, and supplier concentration.' },
  { id: 'IR-5', name: 'Payables Ageing', category: 'Payables', metric: formatReportMetric(vendorBills.filter((bill) => bill.status !== 'Paid').reduce((sum, bill) => sum + bill.total, 0)), owner: 'Accounts Team', lastRunAt: '2026-06-18 15:10', status: 'Ready', description: 'Vendor bill ageing and scheduled payment exposure.' },
  { id: 'IR-6', name: 'Receivables Placeholder', category: 'Receivables', metric: formatReportMetric(fulfillmentOrders.filter((order) => order.paymentStatus !== 'Paid').reduce((sum, order) => sum + order.amount, 0)), owner: 'Sales Ops', lastRunAt: '2026-06-18 14:40', status: 'Ready', description: 'Customer payment exposure for inventory-linked fulfillment orders.' },
  { id: 'IR-7', name: 'Activity and Audit Trail', category: 'Activity', metric: '9 events', owner: 'Admin', lastRunAt: '2026-06-18 13:00', status: 'Ready', description: 'Sensitive stock actions, integration attempts, and configuration changes.' },
  { id: 'IR-8', name: 'Advanced Analytics Workspace', category: 'Analytics', metric: '6 widgets', owner: 'Business Owner', lastRunAt: '2026-06-18 12:30', status: 'Scheduled', description: 'Demand forecast, dead stock risk, vendor lead-time, and warehouse utilization preview.' },
];

const packages: InventoryPackage[] = [
  { id: 'PKG-1', packageNumber: 'PKG-2026-001', salesOrderNumber: 'SO-2026-001', customerName: 'Kalinga IT Automation', warehouseName: 'Bhubaneswar Main Warehouse', packedBy: 'Debasis Rout', packageDate: '2026-06-18', dimensions: '45 x 32 x 26 cm', weightKg: 8.4, itemCount: 2, carrier: 'Internal van', trackingNumber: 'INT-BBSR-001', status: 'Packed' },
  { id: 'PKG-2', packageNumber: 'PKG-2026-002', salesOrderNumber: 'SO-2026-002', customerName: 'Odisha Foods Pvt. Ltd.', warehouseName: 'Cuttack Retail Store', packedBy: 'Sonal Das', packageDate: '2026-06-18', dimensions: '38 x 28 x 22 cm', weightKg: 5.1, itemCount: 15, carrier: 'BlueDart surface', trackingNumber: 'BD-ODF-1182', status: 'Ready to Ship' },
  { id: 'PKG-3', packageNumber: 'PKG-2026-003', salesOrderNumber: 'SO-2026-120', customerName: 'Fitness Hub', warehouseName: 'Bhubaneswar Main Warehouse', packedBy: 'Madhab Nayak', packageDate: '2026-06-16', dimensions: '60 x 40 x 35 cm', weightKg: 14.8, itemCount: 6, carrier: 'Delhivery', trackingNumber: 'DLV-FIT-5002', status: 'Delivered' },
];

const deliveryChallans: InventoryDeliveryChallan[] = [
  { id: 'DC-1', challanNumber: 'DC-2026-001', salesOrderNumber: 'SO-2026-001', customerName: 'Kalinga IT Automation', issueDate: '2026-06-18', transporter: 'Internal van', vehicleNumber: 'OD-02-AB-4412', placeOfSupply: 'Odisha', eWayBillNumber: 'EWB-2026-4412', status: 'Issued' },
  { id: 'DC-2', challanNumber: 'DC-2026-002', salesOrderNumber: 'SO-2026-002', customerName: 'Odisha Foods Pvt. Ltd.', issueDate: '2026-06-18', transporter: 'BlueDart surface', vehicleNumber: 'OD-05-BD-9821', placeOfSupply: 'Odisha', eWayBillNumber: 'EWB-2026-9821', status: 'Draft' },
  { id: 'DC-3', challanNumber: 'DC-2026-003', salesOrderNumber: 'SO-2026-127', customerName: 'Shree Pharma', issueDate: '2026-06-19', transporter: 'Supplier direct', vehicleNumber: 'Supplier managed', placeOfSupply: 'Odisha', status: 'Delivered' },
];

const salesReturns: InventorySalesReturn[] = [
  { id: 'RET-1', returnNumber: 'RET-2026-001', salesOrderNumber: 'SO-2026-120', customerName: 'Fitness Hub', returnDate: '2026-06-17', productName: 'Thermal Invoice Printer', quantity: 1, reason: 'Print head issue reported during installation', inspectionStatus: 'Accepted', refundStatus: 'Pending', status: 'Received' },
  { id: 'RET-2', returnNumber: 'RET-2026-002', salesOrderNumber: 'SO-2026-118', customerName: 'Kalinga Retail Mart', returnDate: '2026-06-18', productName: 'Counter Cash Drawer', quantity: 1, reason: 'Wrong drawer size ordered', inspectionStatus: 'Pending', refundStatus: 'Not Started', status: 'Requested' },
  { id: 'RET-3', returnNumber: 'RET-2026-003', salesOrderNumber: 'SO-2026-099', customerName: 'Old Town Books', returnDate: '2026-06-11', productName: 'Legacy Receipt Paper', quantity: 10, reason: 'Customer switched to 80mm printer', inspectionStatus: 'Accepted', refundStatus: 'Processed', status: 'Closed' },
];

const backorders: InventoryBackorder[] = [
  { id: 'BO-1', salesOrderNumber: 'SO-2026-001', customerName: 'Kalinga IT Automation', productName: 'Counter Cash Drawer', orderedQuantity: 1, availableQuantity: 0, backorderedQuantity: 1, replenishmentSource: 'PO-2026-002', expectedDate: '2026-06-24', status: 'Open' },
  { id: 'BO-2', salesOrderNumber: 'SO-2026-124', customerName: 'Rourkela Distributors', productName: 'Handheld Stock Terminal', orderedQuantity: 1, availableQuantity: 0, backorderedQuantity: 1, replenishmentSource: 'ST-2026-002', expectedDate: '2026-06-19', status: 'Allocated' },
  { id: 'BO-3', salesOrderNumber: 'SO-2026-131', customerName: 'Balasore Retail Co.', productName: 'Thermal Invoice Printer', orderedQuantity: 3, availableQuantity: 1, backorderedQuantity: 2, replenishmentSource: 'PO-2026-002', expectedDate: '2026-06-24', status: 'Ready to Fulfil' },
];

const dropshipments: InventoryDropshipment[] = [
  { id: 'DS-1', dropshipNumber: 'DS-2026-001', salesOrderNumber: 'SO-2026-127', customerName: 'Shree Pharma', supplierName: 'Eastern Office Hardware', productName: 'Retail Weighing Scale', purchaseOrderNumber: 'PO-DS-2026-001', shipToCity: 'Cuttack', carrier: 'Supplier Fleet', trackingNumber: 'SUP-EAST-7721', status: 'Shipped' },
  { id: 'DS-2', dropshipNumber: 'DS-2026-002', salesOrderNumber: 'SO-2026-133', customerName: 'Sambalpur Wholesale', supplierName: 'Scanner World India', productName: 'Handheld Stock Terminal', purchaseOrderNumber: 'PO-DS-2026-002', shipToCity: 'Sambalpur', carrier: 'BlueDart surface', trackingNumber: 'BD-SMB-4002', status: 'PO Sent' },
  { id: 'DS-3', dropshipNumber: 'DS-2026-003', salesOrderNumber: 'SO-2026-135', customerName: 'Puri Hospitality', supplierName: 'CloudDesk Apps Pvt. Ltd.', productName: 'CloudDesk Inventory Licence', purchaseOrderNumber: 'PO-DS-2026-003', shipToCity: 'Puri', carrier: 'Digital delivery', trackingNumber: 'EMAIL-LIC-2606', status: 'Delivered' },
];

export const createInventoryInitialState = (): InventoryStateShape => ({
  products: inventoryProducts,
  itemGroups,
  compositeItems,
  priceLists,
  suppliers,
  warehouses,
  warehouseBins,
  warehouseRestrictions,
  pickLists,
  fulfillmentOrders,
  packages,
  deliveryChallans,
  salesReturns,
  backorders,
  dropshipments,
  purchaseOrders,
  purchaseReceives,
  vendorBills,
  vendorPayments,
  advancedReports,
  integrations,
  automationRules,
  documentTemplates,
  reportingTags,
  portalPreviews,
  webTabs,
  customFunctions,
  webhooks,
  auditEvents,
  stockLedger,
  transfers,
});

export const getInventoryMetrics = (state: InventoryStateShape) => {
  const lowStockProducts = state.products.filter((product) => getStockStatus(product) === 'Low Stock');
  const outOfStockProducts = state.products.filter((product) => getStockStatus(product) === 'Out of Stock');
  const stockValue = state.products.reduce((sum, product) => sum + product.currentStock * product.purchasePrice, 0);
  const purchaseThisMonth = state.purchaseOrders
    .filter((order) => order.date.startsWith('2026-06') && order.status !== 'Cancelled')
    .reduce((sum, order) => sum + getPurchaseOrderTotal(order), 0);
  const pendingOrders = state.purchaseOrders.filter((order) => ['Draft', 'Sent', 'Partially Received'].includes(order.status));
  const expiringBatches = state.products.filter((product) => product.expiryDate && product.expiryDate <= '2027-12-31');

  return {
    totalProducts: state.products.length,
    lowStock: lowStockProducts.length,
    outOfStock: outOfStockProducts.length,
    stockValue: roundCurrency(stockValue),
    purchaseThisMonth: roundCurrency(purchaseThisMonth),
    pendingPurchaseOrders: pendingOrders.length,
    expiringBatches: expiringBatches.length,
  };
};

export const getCategoryDistribution = (productsList: InventoryProduct[]) =>
  productsList.reduce<Record<string, number>>((summary, product) => {
    summary[product.category] = (summary[product.category] || 0) + 1;
    return summary;
  }, {});

export const getFastMovingProducts = (productsList: InventoryProduct[]) =>
  [...productsList].sort((a, b) => b.monthlySales - a.monthlySales).slice(0, 5);

export const getDeadStockProducts = (productsList: InventoryProduct[]) =>
  productsList.filter((product) => product.currentStock > product.reorderLevel * 2 && product.monthlySales <= 3);

export const getStatusTone = (status: StockStatus | PurchaseOrderStatus) => {
  if (status === 'In Stock' || status === 'Received') return 'success';
  if (status === 'Low Stock' || status === 'Sent' || status === 'Partially Received') return 'warning';
  if (status === 'Out of Stock' || status === 'Cancelled') return 'danger';
  return 'default';
};
