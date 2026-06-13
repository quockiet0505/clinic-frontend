import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function StaffFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', staffType: 'STAFF', isActive: true });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ fullName: '', email: '', phone: '', staffType: 'STAFF', isActive: true });
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Users size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Dữ liệu nhân sự</span>
          </div>
          <DialogTitle className="text-xl font-black">{initialData ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên Mới'}</DialogTitle>
          <DialogDescription className="text-blue-100">Quản lý thông tin chi tiết và quyền truy cập.</DialogDescription>
        </div>
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Họ và Tên</label><Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="h-11 rounded-xl" /></div>
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Địa chỉ Email</label><Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-11 rounded-xl" /></div>
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Vai trò</label>
            <select value={formData.staffType} onChange={(e) => setFormData({...formData, staffType: e.target.value})} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold cursor-pointer">
              <option value="DOCTOR">Bác sĩ</option>
              <option value="STAFF">Nhân viên</option>
              <option value="LAB_TECH">Kỹ thuật viên</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>
        </div>
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="outline" onClick={onClose} className="border-[#DCE3EC] bg-white text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-bold cursor-pointer transition-all">Hủy</Button>
          <Button onClick={() => onSubmit(formData, !!initialData)} className="rounded-xl bg-blue-600 text-white font-bold px-6 cursor-pointer">Lưu Nhân viên</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}