import React, { createContext, useContext, useMemo, useState } from 'react';
import type {
  InventoryProduct,
  InventoryStateShape,
  ProductDraft,
  PurchaseOrder,
  PurchaseOrderDraft,
  StockAdjustmentDraft,
  StockLedgerEntry,
  StockTransfer,
  StockTransferDraft,
  SupplierDraft,
  WarehouseDraft,
} from '@/tenant/inventory/types';
import {
  INVENTORY_DEMO_TODAY,
  createInventoryInitialState,
  createProductNumber,
  createPurchaseOrderNumber,
  createTransferNumber,
} from '@/tenant/inventory/services/inventoryDemoService';

interface InventoryDataState extends InventoryStateShape {
  createProduct: (product: ProductDraft) => string;
  updateProduct: (id: string, product: ProductDraft) => void;
  adjustStock: (adjustment: StockAdjustmentDraft) => void;
  createPurchaseOrder: (order: PurchaseOrderDraft) => string;
  markPurchaseReceived: (id: string) => void;
  addSupplier: (supplier: SupplierDraft) => string;
  addWarehouse: (warehouse: WarehouseDraft) => string;
  createTransfer: (transfer: StockTransferDraft) => string;
  completeTransfer: (id: string) => void;
  resetInventoryData: () => void;
}

const STORAGE_KEY = 'inventory-demo-state-v1';
const initialState = createInventoryInitialState();

const readInitialState = (): InventoryStateShape => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialState, ...JSON.parse(stored) } : initialState;
  } catch {
    return initialState;
  }
};

const InventoryDataContext = createContext<InventoryDataState | null>(null);

const findWarehouse = (state: InventoryStateShape, warehouseId: string) =>
  state.warehouses.find((warehouse) => warehouse.id === warehouseId) ?? state.warehouses[0];

const createLedgerEntry = (
  state: InventoryStateShape,
  product: InventoryProduct,
  warehouseId: string,
  type: StockLedgerEntry['type'],
  quantityIn: number,
  quantityOut: number,
  balanceAfter: number,
  reference: string,
  notes: string,
  date = INVENTORY_DEMO_TODAY
): StockLedgerEntry => {
  const warehouse = findWarehouse(state, warehouseId);
  return {
    id: `SL-${Date.now()}-${state.stockLedger.length}`,
    date,
    productId: product.id,
    productName: product.name,
    warehouseId: warehouse.id,
    warehouseName: warehouse.name,
    type,
    quantityIn,
    quantityOut,
    balanceAfter,
    reference,
    notes,
  };
};

const applyCompletedTransferLedger = (state: InventoryStateShape, transfer: StockTransfer) => {
  const product = state.products.find((item) => item.id === transfer.productId);
  if (!product) return state.stockLedger;

  return [
    createLedgerEntry(
      state,
      product,
      transfer.fromWarehouseId,
      'Transfer Out',
      0,
      transfer.quantity,
      product.currentStock,
      transfer.number,
      transfer.notes,
      transfer.transferDate
    ),
    createLedgerEntry(
      state,
      product,
      transfer.toWarehouseId,
      'Transfer In',
      transfer.quantity,
      0,
      product.currentStock,
      transfer.number,
      transfer.notes,
      transfer.transferDate
    ),
    ...state.stockLedger,
  ];
};

export const InventoryDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<InventoryStateShape>(readInitialState);

  const persist = (next: InventoryStateShape) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<InventoryDataState>(() => ({
    ...state,
    createProduct: (productDraft) => {
      const id = `IP-${Date.now()}`;
      const openingStock = Number(productDraft.openingStock) || 0;
      const product: InventoryProduct = {
        ...productDraft,
        id,
        sku: productDraft.sku || createProductNumber(state.products.length),
        openingStock,
        currentStock: typeof productDraft.currentStock === 'number' ? productDraft.currentStock : openingStock,
      };
      const ledger = product.currentStock > 0
        ? [createLedgerEntry(state, product, state.warehouses[0]?.id || 'WH-1', 'Opening', product.currentStock, 0, product.currentStock, 'Opening stock', 'Created from product form.', INVENTORY_DEMO_TODAY)]
        : [];
      persist({ ...state, products: [product, ...state.products], stockLedger: [...ledger, ...state.stockLedger] });
      return id;
    },
    updateProduct: (id, productDraft) => {
      persist({
        ...state,
        products: state.products.map((product) =>
          product.id === id
            ? {
                ...product,
                ...productDraft,
                id,
                currentStock: typeof productDraft.currentStock === 'number' ? productDraft.currentStock : product.currentStock,
              }
            : product
        ),
      });
    },
    adjustStock: (adjustment) => {
      const product = state.products.find((item) => item.id === adjustment.productId);
      if (!product) return;

      const quantity = Math.max(0, Number(adjustment.quantity) || 0);
      const nextStock = adjustment.adjustmentType === 'Add'
        ? product.currentStock + quantity
        : Math.max(0, product.currentStock - quantity);
      const updatedProduct = { ...product, currentStock: nextStock };
      const ledger = createLedgerEntry(
        state,
        updatedProduct,
        adjustment.warehouseId,
        'Adjustment',
        adjustment.adjustmentType === 'Add' ? quantity : 0,
        adjustment.adjustmentType === 'Reduce' ? Math.min(product.currentStock, quantity) : 0,
        nextStock,
        adjustment.reason,
        adjustment.notes,
        adjustment.date
      );

      persist({
        ...state,
        products: state.products.map((item) => (item.id === product.id ? updatedProduct : item)),
        stockLedger: [ledger, ...state.stockLedger],
      });
    },
    createPurchaseOrder: (orderDraft) => {
      const supplier = state.suppliers.find((item) => item.id === orderDraft.supplierId) ?? state.suppliers[0];
      const id = `PO-${Date.now()}`;
      const order: PurchaseOrder = {
        ...orderDraft,
        id,
        number: createPurchaseOrderNumber(state.purchaseOrders.length),
        supplierName: supplier?.name || 'Supplier',
      };
      persist({ ...state, purchaseOrders: [order, ...state.purchaseOrders] });
      return id;
    },
    markPurchaseReceived: (id) => {
      const order = state.purchaseOrders.find((item) => item.id === id);
      if (!order || order.status === 'Received' || order.status === 'Cancelled') return;

      const nextProducts = state.products.map((product) => {
        const item = order.items.find((orderItem) => orderItem.productId === product.id);
        return item ? { ...product, currentStock: product.currentStock + item.quantity } : product;
      });

      const receivedLedger = order.items.flatMap((item) => {
        const updatedProduct = nextProducts.find((product) => product.id === item.productId);
        return updatedProduct
          ? [createLedgerEntry(state, updatedProduct, state.warehouses[0]?.id || 'WH-1', 'Purchase Receipt', item.quantity, 0, updatedProduct.currentStock, order.number, 'Received against purchase order.', INVENTORY_DEMO_TODAY)]
          : [];
      });

      persist({
        ...state,
        products: nextProducts,
        purchaseOrders: state.purchaseOrders.map((item) => (item.id === id ? { ...item, status: 'Received' } : item)),
        stockLedger: [...receivedLedger, ...state.stockLedger],
      });
    },
    addSupplier: (supplierDraft) => {
      const id = `IS-${Date.now()}`;
      persist({ ...state, suppliers: [{ ...supplierDraft, id }, ...state.suppliers] });
      return id;
    },
    addWarehouse: (warehouseDraft) => {
      const id = `WH-${Date.now()}`;
      persist({ ...state, warehouses: [{ ...warehouseDraft, id }, ...state.warehouses] });
      return id;
    },
    createTransfer: (transferDraft) => {
      const product = state.products.find((item) => item.id === transferDraft.productId);
      const fromWarehouse = findWarehouse(state, transferDraft.fromWarehouseId);
      const toWarehouse = findWarehouse(state, transferDraft.toWarehouseId);
      const transfer: StockTransfer = {
        ...transferDraft,
        id: `TR-${Date.now()}`,
        number: createTransferNumber(state.transfers.length),
        productName: product?.name || 'Product',
        fromWarehouseName: fromWarehouse.name,
        toWarehouseName: toWarehouse.name,
      };
      const nextState = { ...state, transfers: [transfer, ...state.transfers] };
      persist({
        ...nextState,
        stockLedger: transfer.status === 'Completed' ? applyCompletedTransferLedger(nextState, transfer) : nextState.stockLedger,
      });
      return transfer.id;
    },
    completeTransfer: (id) => {
      const transfer = state.transfers.find((item) => item.id === id);
      if (!transfer || transfer.status === 'Completed' || transfer.status === 'Cancelled') return;

      const completed = { ...transfer, status: 'Completed' as const };
      const nextState = {
        ...state,
        transfers: state.transfers.map((item) => (item.id === id ? completed : item)),
      };
      persist({
        ...nextState,
        stockLedger: applyCompletedTransferLedger(nextState, completed),
      });
    },
    resetInventoryData: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    },
  }), [state]);

  return <InventoryDataContext.Provider value={value}>{children}</InventoryDataContext.Provider>;
};

export const useInventoryData = () => {
  const context = useContext(InventoryDataContext);
  if (!context) {
    throw new Error('useInventoryData must be used inside InventoryDataProvider');
  }
  return context;
};
