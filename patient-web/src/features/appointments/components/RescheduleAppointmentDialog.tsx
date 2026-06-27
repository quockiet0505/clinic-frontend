import React, { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { appointmentApi } from '../api/appointmentApi';
import { RescheduleDatePicker, buildRescheduleDates } from './RescheduleDatePicker';
import type { AppointmentHistoryItem, TimeSlot } from '../types/appointment';

interface RescheduleAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentHistoryItem;
  onSuccess: () => void;
}

export const RescheduleAppointmentDialog: React.FC<RescheduleAppointmentDialogProps> = ({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}) => {
  const rescheduleDates = useMemo(() => buildRescheduleDates(7), []);
  const defaultDate = rescheduleDates[0]?.dateString || appointment.appointmentDate;

  const [date, setDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setDate(defaultDate);
    setSelectedSlot(null);
    setReason('');
  }, [open, defaultDate]);

  useEffect(() => {
    if (!open || !date) {
      setAvailableSlots([]);
      return;
    }
    const loadSlots = async () => {
      setLoadingSlots(true);
      try {
        const slots = await appointmentApi.getTimeSlots(date, {
          doctorId: appointment.mainDoctorId,
          serviceId: appointment.serviceId,
        });
        setAvailableSlots(slots.filter((s) => s.isAvailable));
        setSelectedSlot(null);
      } catch {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    loadSlots();
  }, [date, open, appointment.mainDoctorId, appointment.serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !selectedSlot) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng chọn giờ khám và nhập lý do dời lịch',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await appointmentApi.update(appointment.id, {
        appointmentDate: date,
        timeStart: selectedSlot.timeStart,
        timeEnd: selectedSlot.timeEnd,
        mainDoctorId: appointment.mainDoctorId,
        rescheduleReason: reason,
      });

      toast({ title: 'Thành công', description: 'Đã dời lịch hẹn thành công' });
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không thể dời lịch hẹn';
      toast({ title: 'Lỗi', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const remainCount = 2 - (appointment.rescheduleCount || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white rounded-3xl p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-amber-50 via-white to-primary-50/40 px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 shadow-sm">
                <CalendarClock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-[#003B5C] leading-tight">
                  Dời lịch khám
                </DialogTitle>
                <DialogDescription className="text-[13px] text-slate-500 mt-0.5">
                  Mã #{appointment.id.padStart(6, '0')} · Còn {remainCount} lần dời lịch
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          <RescheduleDatePicker value={date} onChange={setDate} maxDaysAhead={7} />

          <div className="flex flex-col gap-3">
            <label className="text-[14px] font-bold text-[#003B5C]">
              Giờ khám mới <span className="text-red-500">*</span>
            </label>
            {!date ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-[14px] text-slate-500">
                Vui lòng chọn ngày khám trước
              </div>
            ) : loadingSlots ? (
              <div className="flex items-center justify-center py-10 rounded-2xl bg-slate-50 border border-slate-100">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-[14px] font-bold text-slate-500">Không có giờ trống cho ngày này</p>
                <p className="text-[12px] text-slate-400 mt-1">Vui lòng chọn ngày khác trong 7 ngày tới</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot?.timeStart === slot.timeStart;
                  return (
                    <button
                      key={slot.timeStart}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-2 rounded-xl border text-[13px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#00b5f1] border-[#00b5f1] text-white shadow-md shadow-[#00b5f1]/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-[#00b5f1] hover:text-[#00b5f1]'
                      }`}
                    >
                      {slot.displayTime || slot.timeStart.substring(0, 5)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[14px] font-bold text-[#003B5C]">
              Lý do dời lịch <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vui lòng nhập lý do (VD: Bận việc đột xuất...)"
              rows={3}
              className="rounded-xl border-slate-200 text-sm min-h-[96px] resize-none focus-visible:ring-[#00b5f1]/20"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl text-sm hover:bg-slate-50 transition-colors"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim() || !selectedSlot}
              className="flex-1 px-4 py-3 bg-amber-500 text-white font-bold rounded-2xl text-sm hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Xác nhận dời
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
