import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function StaffFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', staff_type: 'STAFF', is_active: true });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ full_name: '', email: '', phone: '', staff_type: 'STAFF', is_active: true });
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Users size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Personnel Data</span>
          </div>
          <DialogTitle className="text-xl font-black">{initialData ? 'Edit Staff Member' : 'Add New Staff'}</DialogTitle>
          <DialogDescription className="text-blue-100">Manage employee details and system access.</DialogDescription>
        </div>
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label><Input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="h-11 rounded-xl" /></div>
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label><Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-11 rounded-xl" /></div>
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</label>
            <select value={formData.staff_type} onChange={(e) => setFormData({...formData, staff_type: e.target.value})} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold">
              <option value="DOCTOR">Doctor</option>
              <option value="STAFF">Clinic Staff</option>
              <option value="LAB_TECH">Lab Technician</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </div>
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">Cancel</Button>
          <Button onClick={() => onSubmit(formData, !!initialData)} className="rounded-xl bg-blue-600 text-white font-bold px-6">Save Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}