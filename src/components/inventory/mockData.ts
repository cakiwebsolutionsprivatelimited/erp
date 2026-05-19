import type { InventoryItem } from "./types";

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "PROD001",
    name: "Optic Core Transceiver 10G",
    sku: "OCT-10G-LR",
    category: "Networking",
    quantity: 145,
    minQuantity: 20,
    unit: "units",
    status: "in_stock",
    barcode: "840192837461",
    gstRate: 18,
    batchNumber: "BAT-2026-05A",
    warehouseLocation: "Aisle 3, Bin B-12",
    supplier: {
      name: "Nexus Supply Chain",
      email: "logistics@nexus.com",
      phone: "+1 (555) 123-4567"
    },
    price: {
      purchase: 45.0,
      selling: 89.0
    },
    margin: 49.4,
    thumbnail: "bg-blue-500/10 text-blue-500",
    salesVelocity: "high",
    monthlySalesCount: 410,
    stockHistory: [100, 110, 120, 135, 140, 145]
  },
  {
    id: "PROD002",
    name: "Heavy Copper Busbar 400A",
    sku: "HCB-400A-CU",
    category: "Electrical",
    quantity: 12,
    minQuantity: 15,
    status: "low_stock",
    unit: "pcs",
    barcode: "840192837462",
    gstRate: 18,
    batchNumber: "BAT-2026-04C",
    warehouseLocation: "Aisle 1, Bin D-04",
    expiryDate: "2029-12-31",
    supplier: {
      name: "Apex Metal Alloys",
      email: "sales@apexmetal.com",
      phone: "+1 (555) 987-6543"
    },
    price: {
      purchase: 120.0,
      selling: 185.0
    },
    margin: 35.1,
    thumbnail: "bg-amber-500/10 text-amber-500",
    salesVelocity: "medium",
    monthlySalesCount: 85,
    stockHistory: [45, 38, 30, 25, 18, 12]
  },
  {
    id: "PROD003",
    name: "Quantum Server Chassis 2U",
    sku: "QSC-2U-PRO",
    category: "Hardware",
    quantity: 0,
    minQuantity: 5,
    status: "out_of_stock",
    unit: "units",
    barcode: "840192837463",
    gstRate: 12,
    batchNumber: "BAT-2026-02F",
    warehouseLocation: "Aisle 5, Bin A-01",
    supplier: {
      name: "Summit Rack Systems",
      email: "support@summitrack.com",
      phone: "+1 (555) 456-7890"
    },
    price: {
      purchase: 350.0,
      selling: 599.0
    },
    margin: 41.5,
    thumbnail: "bg-rose-500/10 text-rose-500",
    salesVelocity: "low",
    monthlySalesCount: 14,
    stockHistory: [15, 12, 8, 4, 1, 0]
  },
  {
    id: "PROD004",
    name: "Cat6a Shielded Patch Panel",
    sku: "CPP-24P-ST",
    category: "Networking",
    quantity: 85,
    minQuantity: 10,
    status: "in_stock",
    unit: "units",
    barcode: "840192837464",
    gstRate: 18,
    batchNumber: "BAT-2026-05B",
    warehouseLocation: "Aisle 3, Bin C-02",
    supplier: {
      name: "Nexus Supply Chain",
      email: "logistics@nexus.com",
      phone: "+1 (555) 123-4567"
    },
    price: {
      purchase: 28.0,
      selling: 55.0
    },
    margin: 49.1,
    thumbnail: "bg-emerald-500/10 text-emerald-500",
    salesVelocity: "high",
    monthlySalesCount: 180,
    stockHistory: [70, 75, 78, 80, 82, 85]
  },
  {
    id: "PROD005",
    name: "Industrial UPS Battery Bank",
    sku: "IUB-48V-100AH",
    category: "Electrical",
    quantity: 4,
    minQuantity: 8,
    status: "low_stock",
    unit: "packs",
    barcode: "840192837465",
    gstRate: 28,
    batchNumber: "BAT-2025-11X",
    warehouseLocation: "Aisle 2, Bin A-09",
    expiryDate: "2027-06-30",
    supplier: {
      name: "Volt Cell Power LLC",
      email: "b2b@voltcell.com",
      phone: "+1 (555) 832-1099"
    },
    price: {
      purchase: 650.0,
      selling: 920.0
    },
    margin: 29.3,
    thumbnail: "bg-amber-500/10 text-amber-500",
    salesVelocity: "low",
    monthlySalesCount: 9,
    stockHistory: [18, 15, 12, 10, 6, 4]
  },
  {
    id: "PROD006",
    name: "Smart Rack Cooling Fan 120mm",
    sku: "SCF-120-PWM",
    category: "Hardware",
    quantity: 210,
    minQuantity: 30,
    status: "in_stock",
    unit: "pcs",
    barcode: "840192837466",
    gstRate: 18,
    batchNumber: "BAT-2026-03E",
    warehouseLocation: "Aisle 5, Bin E-11",
    supplier: {
      name: "Summit Rack Systems",
      email: "support@summitrack.com",
      phone: "+1 (555) 456-7890"
    },
    price: {
      purchase: 8.5,
      selling: 18.0
    },
    margin: 52.8,
    thumbnail: "bg-blue-500/10 text-blue-500",
    salesVelocity: "high",
    monthlySalesCount: 320,
    stockHistory: [180, 190, 200, 205, 208, 210]
  }
];
