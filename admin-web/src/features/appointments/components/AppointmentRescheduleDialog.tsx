import React, { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Appointment } from '../types/appointment';
import { appointmentApi } from '../api/appointmentApi';
import RescheduleDatePicker, { buildRescheduleDates } from './RescheduleDatePicker';
import { toast } from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onRescheduled: () => void;
}

interface SlotItem {
  timeStart: string;
  timeEnd?: string;
  isAvailable?: boolean;
  available?: boolean;
}

export default function AppointmentRescheduleDialog({ isOpen, onClose, appointment, onRescheduled }: Props) {
  const rescheduleDates = useMemo(() => buildRescheduleDates(7), []);
  const defaultDate = rescheduleDates[0]?.dateString || '';

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null);
  const [availableSlots, setAvailableSlots] = useState<SlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !appointment) return;
    const initial = rescheduleDates.some((d) => d.dateString === appointment.appointmentDate)
      ? appointment.appointmentDate
      : defaultDate;
    setSelectedDate(initial || defaultDate);
    setSelectedSlot(null);
    setReason('');
  }, [isOpen, appointment, defaultDate, rescheduleDates]);

  useEffect(() => {
    if (!isOpen || !selectedDate || !appointment) {
      setAvailableSlots([]);
      return;
    }
    const loadSlots = async () => {
      setLoadingSlots(true);
      try {
        const slots = await appointmentApi.getTimeSlots(selectedDate, {
          doctorId: appointment.mainDoctorId,
          serviceId: appointment.serviceId,
        });
        setAvailableSlots(
          (slots || []).filter((s: SlotItem) => s.isAvailable ?? s.available)
        );
        setSelectedSlot(null);
      } catch {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    loadSlots();
  }, [selectedDate, appointment, isOpen]);

  const handleSubmit = async () => {
    if (!appointment) return;
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do dời lịch');
      return;
    }
    if (!selectedSlot) {
      toast.error('Vui lòng chọn giờ khám mới');
      return;
    }
    try {
      setLoading(true);
      await appointmentApi.update(appointment.appointmentId, {
        appointmentDate: selectedDate,
        timeStart: selectedSlot.timeStart,
        timeEnd: selectedSlot.timeEnd || selectedSlot.timeStart,
        mainDoctorId: appointment.mainDoctorId,
        rescheduleReason: reason.trim(),
      });
      toast.success('Dời lịch hẹn thành công!');
      onRescheduled();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Lỗi khi dời lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-[24px] border-0 shadow-2xl">
        <div className="bg-primary-50 border-b border-primary-100 px-6 pt-6 pb-4">
          <DialogHeader className="text-left space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-primary-100 flex items-center justify-center shrink-0 shadow-sm">
                <CalendarClock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-900 leading-tight">
                  Dời lịch hẹn #{appointment.appointmentId}
                </DialogTitle>
                <DialogDescription className="text-sm text-primary-700/80 mt-0.5 font-medium">
                  {appointment.patientName} · {appointment.expertiseName || appointment.serviceName || 'Khám bệnh'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">
          <RescheduleDatePicker value={selectedDate} onChange={setSelectedDate} maxDaysAhead={7} />

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700">
              Giờ khám mới <span className="text-red-500">*</span>
            </label>
            {loadingSlots ? (
              <div className="flex justify-center items-center py-10 rounded-2xl bg-slate-50 border border-slate-100">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-sm font-medium text-slate-500">Không có giờ trống cho ngày này</p>
                <p className="text-xs text-slate-400 mt-1">Chọn ngày khác trong 7 ngày tới</p>
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
                          ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-primary-500 hover:text-primary-600'
                      }`}
                    >
                      {slot.timeStart.substring(0, 5)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700">
              Lý do dời lịch <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do dời lịch..."
              rows={3}
              className="rounded-xl border-slate-200 text-sm min-h-[96px] resize-none focus-visible:ring-primary-500/20"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex gap-3 sm:justify-end rounded-b-[24px]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl font-bold border-slate-300"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !reason.trim() || !selectedSlot}
            className="rounded-xl font-bold bg-primary hover:bg-primary-600 min-w-[140px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận dời lịch'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
