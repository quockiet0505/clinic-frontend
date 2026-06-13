import React, { useState, useEffect } from 'react';
import { ReceiptText } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExpenseFormDialog({ expense, onClose, onSave }: any) {
  const [form, setForm] = useState({ categoryId: 1, amount: '', expenseDate: '', paymentMethod: 'CASH', description: '' });

  useEffect(() => {
    if (expense && Object.keys(expense).length > 0) setForm(expense);
    else setForm({ categoryId: 1, amount: '', expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'CASH', description: '' });
  }, [expense]);

  if (!expense) return null;

  return (
    <Dialog open={!!expense} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <ReceiptText size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Finance</span>
          </div>
          <DialogTitle className="text-xl font-black">{expense.expenseId ? 'Update Expense' : 'Log New Expense'}</DialogTitle>
          <DialogDescription className="text-blue-100">Record clinic operational costs.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select value={form.categoryId} onChange={(e) => setForm({...form, categoryId: Number(e.target.value)})} className="h-11 w-full rounded-xl border border-slate-200 px-3 font-bold text-slate-700 outline-none">
                <option value={1}>Payroll</option><option value={2}>Utilities</option><option value={3}>Equipment</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày</label>
              <Input type="date" value={form.expenseDate} onChange={(e) => setForm({...form, expenseDate: e.target.value})} className="h-11 rounded-xl font-bold bg-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount ($)</label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="h-11 rounded-xl font-bold bg-white" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Method</label>
              <select value={form.paymentMethod} onChange={(e) => setForm({...form, paymentMethod: e.target.value as any})} className="h-11 w-full rounded-xl border border-slate-200 px-3 font-bold text-slate-700 outline-none">
                <option value="CASH">Cash</option><option value="TRANSFER">Transfer</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full rounded-xl border border-slate-200 p-3 font-medium outline-none resize-none h-20 bg-white" placeholder="What was this expense for?" />
          </div>
        </div>
        
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
          <Button onClick={() => onSave(form)} disabled={!form.amount || !form.description} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-8 shadow-sm">Save Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}