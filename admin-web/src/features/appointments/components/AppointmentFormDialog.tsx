import React, { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AppointmentFormDialog({ isOpen, onClose, onBook }: any) {
  const [form, setForm] = useState({ patientId: '', main_doctor_id: '', appointmentDate: '', timeStart: '' });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <CalendarPlus size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Lịch hẹn</span>
          </div>
          <DialogTitle className="text-xl font-black">Đặt Lịch Trực Tiếp</DialogTitle>
          <DialogDescription className="text-blue-100">Tạo lịch hẹn mới cho bệnh nhân tại phòng khám.</DialogDescription>
        </div>
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">ID Bệnh nhân</label>
            <Input value={form.patientId} onChange={(e) => setForm({...form, patientId: e.target.value})} className="h-11 rounded-xl font-bold" placeholder="Nhập ID Bệnh nhân" />
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Bác sĩ phụ trách (ID Nhân viên)</label>
            <Input value={form.main_doctor_id} onChange={(e) => setForm({...form, main_doctor_id: e.target.value})} className="h-11 rounded-xl font-bold" placeholder="Nhập ID Bác sĩ" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày khám</label>
              <Input type="date" value={form.appointmentDate} onChange={(e) => setForm({...form, appointmentDate: e.target.value})} className="h-11 rounded-xl font-medium cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Giờ bắt đầu</label>
              <Input type="time" value={form.timeStart} onChange={(e) => setForm({...form, timeStart: e.target.value})} className="h-11 rounded-xl font-medium cursor-pointer" />
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="outline" onClick={onClose} className="border-[#DCE3EC] bg-white text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-bold cursor-pointer transition-all">Hủy</Button>
          <Button onClick={() => { onBook(form); setForm({ patientId: '', main_doctor_id: '', appointmentDate: '', timeStart: '' }); }} className="rounded-xl bg-blue-600 text-white font-bold px-6 shadow-sm cursor-pointer">Xác Nhận Đặt Lịch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}