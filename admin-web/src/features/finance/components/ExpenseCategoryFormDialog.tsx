import React, { useState, useEffect } from 'react';
import { Tags } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExpenseCategoryFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const [form, setForm] = useState({ categoryName: '', description: '' });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ categoryName: '', description: '' });
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        
        {/* HEADER */}
        <div className="bg-blue-600 p-6 text-white shrink-0">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Tags size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Finance Settings</span>
          </div>
          <DialogTitle className="text-xl font-black">{initialData ? 'Update Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription className="text-blue-100">Define classification tags for clinic expenses.</DialogDescription>
        </div>
        
        {/* BODY */}
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Category Name</label>
            <Input 
              value={form.categoryName} 
              onChange={e => setForm({...form, categoryName: e.target.value})} 
              className="h-11 rounded-xl bg-white font-bold shadow-sm" 
              placeholder="e.g. Marketing, Payroll..." 
            />
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Mô tả</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="w-full rounded-xl border border-slate-200 bg-white p-4 font-medium outline-none resize-none h-24 shadow-sm" 
              placeholder="Briefly describe what this expense covers..." 
            />
          </div>
        </div>
        
        {/* FOOTER */}
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
          <Button 
            onClick={() => onSubmit(form, !!initialData)} 
            disabled={!form.categoryName} 
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-8 shadow-sm"
          >
            Save Category
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}