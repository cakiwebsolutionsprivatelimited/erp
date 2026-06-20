import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/tenant/components/TenantUI';
import type { Expense } from '@/tenant/finance/types';
import { AmountDisplay } from '@/tenant/finance/components/AmountDisplay';
import { FinanceStatusBadge } from '@/tenant/finance/components/FinanceStatusBadge';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => (
  <DataTable headers={['Date', 'Category', 'Vendor', 'Amount', 'GST', 'Payment mode', 'Status', 'Attachment', 'Actions']}>
    {expenses.map((expense) => (
      <tr key={expense.id}>
        <td className="px-4 py-3 text-slate-600">{expense.date}</td>
        <td className="px-4 py-3 font-medium text-slate-900">{expense.category}</td>
        <td className="px-4 py-3 text-slate-600">{expense.vendor}</td>
        <td className="px-4 py-3"><AmountDisplay value={expense.amount} /></td>
        <td className="px-4 py-3"><AmountDisplay value={expense.gstAmount} /></td>
        <td className="px-4 py-3 text-slate-600">{expense.paymentMode}</td>
        <td className="px-4 py-3"><FinanceStatusBadge status={expense.status} /></td>
        <td className="px-4 py-3 text-slate-600">{expense.attachmentName || 'Attachment placeholder'}</td>
        <td className="px-4 py-3">
          <div className="flex gap-1">
            <Button variant="outline" size="icon-sm" onClick={() => onEdit(expense)}><Edit className="h-3.5 w-3.5" /></Button>
            <Button variant="destructive" size="icon-sm" onClick={() => onDelete(expense.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
        </td>
      </tr>
    ))}
  </DataTable>
);
