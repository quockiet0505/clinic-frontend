import React, { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AppointmentFormDialog({ isOpen, onClose, onBook }: any) {
  const [form, setForm] = useState({ patient_id: '', main_doctor_id: '', appointment_date: '', time_start: '' });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <CalendarPlus size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Scheduling</span>
          </div>
          <DialogTitle className="text-xl font-black">Walk-in Booking</DialogTitle>
          <DialogDescription className="text-blue-100">Create an appointment for a patient at the clinic.</DialogDescription>
        </div>
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Patient ID</label>
            <Input value={form.patient_id} onChange={(e) => setForm({...form, patient_id: e.target.value})} className="h-11 rounded-xl font-bold" placeholder="Enter Patient ID" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assign Doctor (Staff ID)</label>
            <Input value={form.main_doctor_id} onChange={(e) => setForm({...form, main_doctor_id: e.target.value})} className="h-11 rounded-xl font-bold" placeholder="Enter Doctor ID" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
              <Input type="date" value={form.appointment_date} onChange={(e) => setForm({...form, appointment_date: e.target.value})} className="h-11 rounded-xl font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Start</label>
              <Input type="time" value={form.time_start} onChange={(e) => setForm({...form, time_start: e.target.value})} className="h-11 rounded-xl font-medium" />
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button onClick={() => { onBook(form); setForm({ patient_id: '', main_doctor_id: '', appointment_date: '', time_start: '' }); }} className="rounded-xl bg-blue-600 text-white font-bold px-6 shadow-sm">Confirm Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}