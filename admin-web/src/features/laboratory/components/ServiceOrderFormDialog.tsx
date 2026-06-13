import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ServiceOrderFormDialog({ isOpen, onClose, onSubmit }: any) {
  const [form, setForm] = useState({ patientName: '', serviceName: 'Complete Blood Count', doctorName: '' });

  const handleSubmit = () => {
    onSubmit({ ...form, serviceId: Math.floor(Math.random() * 10) + 1 });
    setForm({ patientName: '', serviceName: 'Complete Blood Count', doctorName: '' });
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
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Name / Record ID</label>
            <Input 
              value={form.patientName} onChange={(e) => setForm({...form, patientName: e.target.value})} 
              className="h-11 rounded-xl font-bold bg-white" placeholder="Tìm kiếm bệnh nhân..." 
            />
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Select Lab Test</label>
            <select 
              value={form.serviceName} onChange={(e) => setForm({...form, serviceName: e.target.value})} 
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold outline-none cursor-pointer"
            >
              <option value="Complete Blood Count">Complete Blood Count (CBC)</option>
              <option value="Lipid Panel">Lipid Panel</option>
              <option value="Urinalysis">Urinalysis</option>
              <option value="Chest X-Ray">Chest X-Ray</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Requested By (Doctor)</label>
            <Input 
              value={form.doctorName} onChange={(e) => setForm({...form, doctorName: e.target.value})} 
              className="h-11 rounded-xl font-medium bg-white" placeholder="e.g. Dr. Sarah Smith" 
            />
          </div>
        </div>
        
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
          <Button onClick={handleSubmit} disabled={!form.patientName} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-8 shadow-sm cursor-pointer">
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}