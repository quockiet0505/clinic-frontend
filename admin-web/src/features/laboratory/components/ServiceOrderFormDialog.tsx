import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ServiceOrderFormDialog({ isOpen, onClose, onSubmit }: any) {
  const [form, setForm] = useState({ patient_name: '', service_name: 'Complete Blood Count', doctor_name: '' });

  const handleSubmit = () => {
    onSubmit({ ...form, service_id: Math.floor(Math.random() * 10) + 1 });
    setForm({ patient_name: '', service_name: 'Complete Blood Count', doctor_name: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <FlaskConical size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Lab Request</span>
          </div>
          <DialogTitle className="text-xl font-black">Create Service Order</DialogTitle>
          <DialogDescription className="text-blue-100">Assign a new laboratory test to a patient.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Name / Record ID</label>
            <Input 
              value={form.patient_name} onChange={(e) => setForm({...form, patient_name: e.target.value})} 
              className="h-11 rounded-xl font-bold bg-white" placeholder="Search patient..." 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Lab Test</label>
            <select 
              value={form.service_name} onChange={(e) => setForm({...form, service_name: e.target.value})} 
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
            >
              <option value="Complete Blood Count">Complete Blood Count (CBC)</option>
              <option value="Lipid Panel">Lipid Panel</option>
              <option value="Urinalysis">Urinalysis</option>
              <option value="Chest X-Ray">Chest X-Ray</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Requested By (Doctor)</label>
            <Input 
              value={form.doctor_name} onChange={(e) => setForm({...form, doctor_name: e.target.value})} 
              className="h-11 rounded-xl font-medium bg-white" placeholder="e.g. Dr. Sarah Smith" 
            />
          </div>
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.patient_name} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-sm">
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}