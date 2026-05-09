import React, { useState, useEffect } from 'react';
import { UserRound } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PatientFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const [formData, setFormData] = useState({ full_name: '', gender: 'Male', date_of_birth: '', phone: '', address: '' });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ full_name: '', gender: 'Male', date_of_birth: '', phone: '', address: '' });
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <UserRound size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Patient Records</span>
          </div>
          <DialogTitle className="text-xl font-black">{initialData ? 'Update Patient Info' : 'Register New Patient'}</DialogTitle>
          <DialogDescription className="text-blue-100">Ensure all contact and demographic details are accurate.</DialogDescription>
        </div>
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label><Input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="h-11 rounded-xl" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold">
                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date of Birth</label><Input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="h-11 rounded-xl" /></div>
          </div>

          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</label><Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="h-11 rounded-xl" /></div>
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Address</label><Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="h-11 rounded-xl" /></div>
        </div>
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button onClick={() => onSubmit(formData, !!initialData)} className="rounded-xl bg-blue-600 text-white font-bold px-6">Save Patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}