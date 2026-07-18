import React from 'react';
import { DataTable } from '@/tenant/components/TenantUI';
import type { CustomerLedgerRow, SupplierLedgerRow } from '@/tenant/finance/types';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { FinanceStatusBadge } from '@/tenant/finance/components/FinanceStatusBadge';

interface CustomerLedgerTableProps {
  type: 'customer';
  rows: CustomerLedgerRow[];
}

interface SupplierLedgerTableProps {
  type: 'supplier';
  rows: SupplierLedgerRow[];
}

type LedgerTableProps = CustomerLedgerTableProps | SupplierLedgerTableProps;

export const LedgerTable: React.FC<LedgerTableProps> = (props) => {
  if (props.type === 'customer') {
    return (
      <DataTable headers={['Customer', 'Opening balance', 'Invoice amount', 'Paid amount', 'Outstanding', 'Last payment', 'Status']}>
        {props.rows.map((row) => (
          <tr key={row.customerId}>
            <td className="px-4 py-3 font-medium text-slate-950">{row.customer}</td>
            <td className="px-4 py-3"><AmountDisplay value={row.openingBalance} /></td>
            <td className="px-4 py-3"><AmountDisplay value={row.invoiceAmount} /></td>
            <td className="px-4 py-3"><AmountDisplay value={row.paidAmount} tone="success" /></td>
            <td className="px-4 py-3"><AmountDisplay value={row.outstanding} tone={row.outstanding > 0 ? 'warning' : 'success'} /></td>
            <td className="px-4 py-3 text-slate-600">{row.lastPaymentDate || '-'}</td>
            <td className="px-4 py-3"><FinanceStatusBadge status={row.status} /></td>
          </tr>
        ))}
      </DataTable>
    );
  }

  return (
    <DataTable headers={['Supplier', 'Opening balance', 'Purchase amount', 'Paid amount', 'Outstanding', 'Last payment', 'Status']}>
      {props.rows.map((row) => (
        <tr key={row.id}>
          <td className="px-4 py-3 font-medium text-slate-950">{row.supplier}</td>
          <td className="px-4 py-3"><AmountDisplay value={row.openingBalance} /></td>
          <td className="px-4 py-3"><AmountDisplay value={row.purchaseAmount} /></td>
          <td className="px-4 py-3"><AmountDisplay value={row.paidAmount} tone="success" /></td>
          <td className="px-4 py-3"><AmountDisplay value={row.outstanding} tone={row.outstanding > 0 ? 'warning' : 'success'} /></td>
          <td className="px-4 py-3 text-slate-600">{row.lastPaymentDate}</td>
          <td className="px-4 py-3"><FinanceStatusBadge status={row.status} /></td>
        </tr>
      ))}
    </DataTable>
  );
};
