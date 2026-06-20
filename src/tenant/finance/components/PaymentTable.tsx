import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/tenant/components/TenantUI';
import type { Payment } from '@/tenant/finance/types';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { FinanceStatusBadge } from '@/tenant/finance/components/FinanceStatusBadge';

interface PaymentTableProps {
  payments: Payment[];
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ payments }) => (
  <DataTable headers={['Payment', 'Customer', 'Invoice', 'Payment date', 'Amount', 'Mode', 'Reference', 'Status', 'Actions']}>
    {payments.map((payment) => (
      <tr key={payment.id}>
        <td className="px-4 py-3 font-medium text-indigo-700">{payment.number}</td>
        <td className="px-4 py-3">{payment.customerName}</td>
        <td className="px-4 py-3 text-slate-600">{payment.invoiceNumber}</td>
        <td className="px-4 py-3 text-slate-600">{payment.paymentDate}</td>
        <td className="px-4 py-3"><AmountDisplay value={payment.amount} tone="success" /></td>
        <td className="px-4 py-3 text-slate-600">{payment.mode}</td>
        <td className="px-4 py-3 text-slate-600">{payment.referenceNumber}</td>
        <td className="px-4 py-3"><FinanceStatusBadge status={payment.status} /></td>
        <td className="px-4 py-3"><Button size="sm" variant="outline">Receipt</Button></td>
      </tr>
    ))}
  </DataTable>
);
