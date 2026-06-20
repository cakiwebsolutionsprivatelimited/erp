import type {
  InventoryProduct,
  InventoryStateShape,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus,
  StockLedgerEntry,
  StockStatus,
  StockTransfer,
  Warehouse,
} from '@/tenant/inventory/types';

export const INVENTORY_DEMO_TODAY = '2026-06-18';

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

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
  },
];

export const createInventoryInitialState = (): InventoryStateShape => ({
  products,
  suppliers,
  warehouses,
  purchaseOrders,
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

  return {
    totalProducts: state.products.length,
    lowStock: lowStockProducts.length,
    outOfStock: outOfStockProducts.length,
    stockValue: roundCurrency(stockValue),
    purchaseThisMonth: roundCurrency(purchaseThisMonth),
    pendingPurchaseOrders: pendingOrders.length,
    expiringBatches: 3,
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
