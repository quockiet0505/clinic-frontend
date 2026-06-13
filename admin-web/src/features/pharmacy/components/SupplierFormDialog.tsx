import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SupplierFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const [form, setForm] = useState({ supplierName: '', contactName: '', phone: '', email: '', address: '', isActive: true });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ supplierName: '', contactName: '', phone: '', email: '', address: '', isActive: true });
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
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Company Name</label><Input value={form.supplierName} onChange={e => setForm({...form, supplierName: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Person</label><Input value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Số điện thoại</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
            <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          </div>
          
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Địa chỉ</label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
            <label htmlFor="isActive" className="block mb-3 text-sm font-bold text-slate-700 cursor-pointer">Active Supplier</label>
          </div>
        </div>
        
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
          <Button onClick={() => onSubmit(form, !!initialData)} disabled={!form.supplierName} className="rounded-xl bg-blue-600 text-white font-bold px-8 cursor-pointer">Save Supplier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}