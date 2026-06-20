import React, { useMemo, useState } from 'react';
import { Download, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeader } from '@/tenant/components/TenantUI';
import { DateRangeFilter } from '@/tenant/finance/components/DateRangeFilter';
import { ExpenseForm } from '@/tenant/finance/components/ExpenseForm';
import { ExpenseTable } from '@/tenant/finance/components/ExpenseTable';
import type { Expense, ExpenseCategory } from '@/tenant/finance/types';
import { useFinanceData } from '@/tenant/finance/state/FinanceDataProvider';

const categories: Array<'All' | ExpenseCategory> = ['All', 'Office Rent', 'Salary', 'Travel', 'Marketing', 'Software', 'Utilities', 'Purchase', 'Miscellaneous'];

const ExpensesPage: React.FC = () => {
  const finance = useFinanceData();
  const [category, setCategory] = useState<'All' | ExpenseCategory>('All');
  const [fromDate, setFromDate] = useState('2026-06-01');
  const [toDate, setToDate] = useState('2026-06-30');
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const expenses = useMemo(() => finance.expenses.filter((expense) => {
    const categoryMatch = category === 'All' || expense.category === category;
    const dateMatch = expense.date >= fromDate && expense.date <= toDate;
    return categoryMatch && dateMatch;
  }), [category, finance.expenses, fromDate, toDate]);

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track vendor spends, GST input credit, payment mode, status, and attachment placeholders."
        action={<Button onClick={() => setFormOpen(true)}><PlusCircle className="h-4 w-4" />Add Expense</Button>}
      />

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[220px_280px_1fr]">
          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-500">Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <DateRangeFilter from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
          <div className="flex items-end justify-end gap-2">
            <Button variant="outline"><Download className="h-3.5 w-3.5" />Export</Button>
            <Button variant="outline" onClick={() => setFormOpen(true)}>Add expense</Button>
          </div>
        </div>
      </section>

      <ExpenseTable expenses={expenses} onEdit={setEditingExpense} onDelete={finance.deleteExpense} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
            <DialogDescription>Create a local demo expense entry.</DialogDescription>
          </DialogHeader>
          <ExpenseForm onSubmit={(expense) => { finance.addExpense(expense); setFormOpen(false); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
            <DialogDescription>Update local expense data and GST amount.</DialogDescription>
          </DialogHeader>
          {editingExpense && <ExpenseForm initialExpense={editingExpense} onSubmit={(expense) => { finance.updateExpense(editingExpense.id, expense); setEditingExpense(null); }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensesPage;
