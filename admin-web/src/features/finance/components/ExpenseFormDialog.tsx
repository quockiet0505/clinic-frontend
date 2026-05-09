import React, { useState, useEffect } from 'react';
import { ReceiptText } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExpenseFormDialog({ expense, onClose, onSave }: any) {
  const [form, setForm] = useState({ category_id: 1, amount: '', expense_date: '', payment_method: 'CASH', description: '' });

  useEffect(() => {
    if (expense && Object.keys(expense).length > 0) setForm(expense);
    else setForm({ category_id: 1, amount: '', expense_date: new Date().toISOString().split('T')[0], payment_method: 'CASH', description: '' });
  }, [expense]);

  if (!expense) return null;

  return (
    <Dialog open={!!expense} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <ReceiptText size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Finance</span>
          </div>
          <DialogTitle className="text-xl font-black">{expense.expense_id ? 'Update Expense' : 'Log New Expense'}</DialogTitle>
          <DialogDescription className="text-blue-100">Record clinic operational costs.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select value={form.category_id} onChange={(e) => setForm({...form, category_id: Number(e.target.value)})} className="h-11 w-full rounded-xl border border-slate-200 px-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600">
                <option value={1}>Payroll</option><option value={2}>Utilities</option><option value={3}>Equipment</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
              <Input type="date" value={form.expense_date} onChange={(e) => setForm({...form, expense_date: e.target.value})} className="h-11 rounded-xl font-bold bg-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount ($)</label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="h-11 rounded-xl font-bold bg-white" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Method</label>
              <select value={form.payment_method} onChange={(e) => setForm({...form, payment_method: e.target.value as any})} className="h-11 w-full rounded-xl border border-slate-200 px-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600">
                <option value="CASH">Cash</option><option value="TRANSFER">Transfer</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full rounded-xl border border-slate-200 p-3 font-medium focus:ring-2 focus:ring-blue-600 outline-none resize-none h-20 bg-white" placeholder="What was this expense for?" />
          </div>
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.amount || !form.description} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-sm">Save Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}