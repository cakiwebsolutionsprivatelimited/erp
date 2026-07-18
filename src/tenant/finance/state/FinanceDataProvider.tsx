import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Expense, ExpenseDraft, FinanceStateShape, Invoice, InvoiceDraft, PaymentDraft } from '@/tenant/finance/types';
import {
  applyPaymentToInvoice,
  createFinanceInitialState,
  createInvoiceNumber,
  normalizeInvoiceStatus,
  toInvoiceFromDraft,
  toPaymentFromDraft,
} from '@/tenant/finance/services/financeDemoService';

interface FinanceDataState extends FinanceStateShape {
  createInvoice: (invoice: InvoiceDraft) => string;
  updateInvoice: (id: string, invoice: InvoiceDraft) => void;
  duplicateInvoice: (id: string) => string | null;
  sendInvoice: (id: string) => void;
  cancelInvoice: (id: string) => void;
  recordPayment: (payment: PaymentDraft) => string | null;
  addExpense: (expense: ExpenseDraft) => string;
  updateExpense: (id: string, expense: ExpenseDraft) => void;
  deleteExpense: (id: string) => void;
  resetFinanceData: () => void;
}

const STORAGE_KEY = 'finance-demo-state-v1';
const initialState = createFinanceInitialState();

const readInitialState = (): FinanceStateShape => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState;
    const parsed = { ...initialState, ...JSON.parse(stored) } as FinanceStateShape;
    return {
      ...parsed,
      invoices: parsed.invoices.map(normalizeInvoiceStatus),
    };
  } catch {
    return initialState;
  }
};

const FinanceDataContext = createContext<FinanceDataState | null>(null);

export const FinanceDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinanceStateShape>(readInitialState);

  const persist = (next: FinanceStateShape) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<FinanceDataState>(() => ({
    ...state,
    createInvoice: (invoiceDraft) => {
      const id = `FI-${Date.now()}`;
      const invoice = toInvoiceFromDraft(
        {
          ...invoiceDraft,
          number: invoiceDraft.number || createInvoiceNumber(state.invoices.length),
        },
        id,
        new Date().toISOString().slice(0, 10)
      );
      persist({ ...state, invoices: [invoice, ...state.invoices] });
      return id;
    },
    updateInvoice: (id, invoiceDraft) => {
      persist({
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === id
            ? normalizeInvoiceStatus({ ...invoice, ...invoiceDraft, id, createdAt: invoice.createdAt })
            : invoice
        ),
      });
    },
    duplicateInvoice: (id) => {
      const invoice = state.invoices.find((item) => item.id === id);
      if (!invoice) return null;

      const nextId = `FI-${Date.now()}`;
      const duplicated: Invoice = normalizeInvoiceStatus({
        ...invoice,
        id: nextId,
        number: createInvoiceNumber(state.invoices.length),
        invoiceDate: new Date().toISOString().slice(0, 10),
        dueDate: '2026-07-05',
        paidAmount: 0,
        status: 'Draft',
        createdAt: new Date().toISOString().slice(0, 10),
        items: invoice.items.map((item, index) => ({ ...item, id: `FIT-${Date.now()}-${index}` })),
      });
      persist({ ...state, invoices: [duplicated, ...state.invoices] });
      return nextId;
    },
    sendInvoice: (id) => {
      persist({
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === id && invoice.status === 'Draft'
            ? normalizeInvoiceStatus({ ...invoice, status: 'Sent' })
            : invoice
        ),
      });
    },
    cancelInvoice: (id) => {
      persist({
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === id ? { ...invoice, status: 'Cancelled' } : invoice
        ),
      });
    },
    recordPayment: (paymentDraft) => {
      const invoice = state.invoices.find((item) => item.id === paymentDraft.invoiceId);
      if (!invoice) return null;

      const payment = toPaymentFromDraft(paymentDraft, invoice, state.payments.length);
      persist({
        ...state,
        payments: [payment, ...state.payments],
        invoices: state.invoices.map((item) =>
          item.id === invoice.id ? applyPaymentToInvoice(item, payment.amount) : item
        ),
      });
      return payment.id;
    },
    addExpense: (expenseDraft) => {
      const id = `FE-${Date.now()}`;
      const expense: Expense = { ...expenseDraft, id };
      persist({ ...state, expenses: [expense, ...state.expenses] });
      return id;
    },
    updateExpense: (id, expenseDraft) => {
      persist({
        ...state,
        expenses: state.expenses.map((expense) => (expense.id === id ? { ...expenseDraft, id } : expense)),
      });
    },
    deleteExpense: (id) => {
      persist({ ...state, expenses: state.expenses.filter((expense) => expense.id !== id) });
    },
    resetFinanceData: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    },
  }), [state]);

  return <FinanceDataContext.Provider value={value}>{children}</FinanceDataContext.Provider>;
};

export const useFinanceData = () => {
  const context = useContext(FinanceDataContext);
  if (!context) {
    throw new Error('useFinanceData must be used inside FinanceDataProvider');
  }
  return context;
};
