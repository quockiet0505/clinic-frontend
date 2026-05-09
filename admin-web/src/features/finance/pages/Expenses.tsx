import React, { useState } from 'react';
import { Plus, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExpenseFilterBar from '../components/ExpenseFilterBar';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseFormDialog from '../components/ExpenseFormDialog';
import { ClinicExpense } from '../types/finance';

const TODAY = new Date().toISOString().split('T')[0];

const MOCK_EXPENSES: ClinicExpense[] = [
  { expense_id: 1, category_id: 2, category_name: 'Utilities', amount: 150.00, expense_date: TODAY, payment_method: 'TRANSFER', description: 'Monthly Electricity', created_by_name: 'Admin' },
  { expense_id: 2, category_id: 1, category_name: 'Payroll', amount: 4500.00, expense_date: '2026-04-01', payment_method: 'TRANSFER', description: 'March Staff Salaries', created_by_name: 'Admin' },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState(TODAY);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);

  const filteredData = expenses.filter(exp => 
    (category === 'ALL' || exp.category_name === category) &&
    exp.description.toLowerCase().includes(search.toLowerCase()) &&
    exp.expense_date >= fromDate && exp.expense_date <= toDate
  );

  const totalExpenses = filteredData.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const handleSave = (data: any) => {
    if (data.expense_id) {
      setExpenses(expenses.map(e => e.expense_id === data.expense_id ? { ...data, category_name: data.category_id === 1 ? 'Payroll' : 'Utilities' } : e));
    } else {
      setExpenses([{ ...data, expense_id: Date.now(), category_name: data.category_id === 1 ? 'Payroll' : 'Utilities', created_by_name: 'Admin' }, ...expenses]);
    }
    setEditingExpense(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expense Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor operational costs and clinic expenditures.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="bg-rose-50 text-rose-700 px-5 py-2.5 rounded-2xl border border-rose-100 flex items-center gap-3">
            <TrendingDown size={20} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Period Outflow</p>
              <p className="text-lg font-black leading-none mt-0.5">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
          <Button onClick={() => setEditingExpense({})} className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 shadow-sm">
            <Plus size={18} className="mr-2"/> Add Expense
          </Button>
        </div>
      </div>

      <ExpenseFilterBar search={search} setSearch={setSearch} category={category} setCategory={setCategory} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />

      <ExpenseTable data={filteredData} onRowClick={setEditingExpense} />

      <ExpenseFormDialog expense={editingExpense} onClose={() => setEditingExpense(null)} onSave={handleSave} />
    </div>
  );
}