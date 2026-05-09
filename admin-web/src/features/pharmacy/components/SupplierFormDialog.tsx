import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SupplierFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const [form, setForm] = useState({ supplier_name: '', contact_name: '', phone: '', email: '', address: '', is_active: true });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ supplier_name: '', contact_name: '', phone: '', email: '', address: '', is_active: true });
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Building2 size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Vendor Management</span>
          </div>
          <DialogTitle className="text-xl font-black">{initialData ? 'Update Supplier' : 'Add New Supplier'}</DialogTitle>
          <DialogDescription className="text-blue-100">Manage pharmaceutical vendors and contact details.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Name</label><Input value={form.supplier_name} onChange={e => setForm({...form, supplier_name: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Person</label><Input value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          </div>
          
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Address</label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">Active Supplier</label>
          </div>
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button onClick={() => onSubmit(form, !!initialData)} disabled={!form.supplier_name} className="rounded-xl bg-blue-600 text-white font-bold px-8">Save Supplier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}