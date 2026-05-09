import React, { useState, useEffect } from 'react';
import { Tags } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExpenseCategoryFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const [form, setForm] = useState({ category_name: '', description: '' });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ category_name: '', description: '' });
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category Name</label>
            <Input 
              value={form.category_name} 
              onChange={e => setForm({...form, category_name: e.target.value})} 
              className="h-11 rounded-xl bg-white font-bold shadow-sm" 
              placeholder="e.g. Marketing, Payroll..." 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="w-full rounded-xl border border-slate-200 bg-white p-4 font-medium focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24 shadow-sm" 
              placeholder="Briefly describe what this expense covers..." 
            />
          </div>
        </div>
        
        {/* FOOTER */}
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button 
            onClick={() => onSubmit(form, !!initialData)} 
            disabled={!form.category_name} 
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-sm"
          >
            Save Category
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}