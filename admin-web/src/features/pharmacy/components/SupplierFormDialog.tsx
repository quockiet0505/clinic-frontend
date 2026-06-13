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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[24px] shadow-2xl">
        <div className="bg-primary-50 p-6 border-b border-primary-100 text-primary-900 rounded-t-[24px]">
          <div className="flex items-center gap-2 mb-2 text-primary-600">
            <Building2 size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Nhà Cung Cấp</span>
          </div>
          <DialogTitle className="text-2xl font-semibold">{initialData ? 'Cập Nhật Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp'}</DialogTitle>
          <DialogDescription className="text-sm text-primary-600/80 font-medium">Quản lý đối tác cung cấp thuốc và chi tiết liên hệ.</DialogDescription>
        </div>
        
        <div className="p-6 bg-white space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2"><label className="block mb-2 text-sm font-medium text-slate-700">Tên công ty</label><Input value={form.supplierName} onChange={e => setForm({...form, supplierName: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" /></div>
          <div className="space-y-2"><label className="block mb-2 text-sm font-medium text-slate-700">Người liên hệ</label><Input value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="block mb-2 text-sm font-medium text-slate-700">Số điện thoại</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" /></div>
            <div className="space-y-2"><label className="block mb-2 text-sm font-medium text-slate-700">Email</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" /></div>
          </div>
          
          <div className="space-y-2"><label className="block mb-2 text-sm font-medium text-slate-700">Địa chỉ</label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" /></div>
          
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-primary cursor-pointer" />
            <label htmlFor="isActive" className="block text-sm font-medium text-slate-700 cursor-pointer">Đang hoạt động</label>
          </div>
        </div>
        
        <DialogFooter className="p-6 pb-8 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end rounded-b-[24px]">
          <Button variant="outline" onClick={onClose} className="h-11 px-6 rounded-[14px] font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 cursor-pointer">Hủy</Button>
          <Button onClick={() => onSubmit(form, !!initialData)} disabled={!form.supplierName} className="h-11 px-6 rounded-[14px] bg-primary hover:bg-primary-600 shadow-sm text-white font-bold transition-all duration-200 cursor-pointer">Lưu Nhà Cung Cấp</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}