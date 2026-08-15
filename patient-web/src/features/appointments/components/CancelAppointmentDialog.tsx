/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { XCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { appointmentApi } from '../api/appointmentApi';
import { useToast } from '@/hooks/useToast';
import type { AppointmentHistoryItem } from '../types/appointment';

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentHistoryItem;
  onSuccess: () => void;
}

export const CancelAppointmentDialog: React.FC<CancelAppointmentDialogProps> = ({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setReason('');
  }, [open]);

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập lý do hủy lịch', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await appointmentApi.cancelAppointment(appointment.id, reason);
      toast({ title: 'Thành công', description: 'Đã hủy lịch khám thành công' });
      onSuccess();
      onOpenChange(false);
      setReason('');
    } catch {
      /* toast: axios interceptor */
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white rounded-3xl p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-rose-50 via-white to-primary-50/40 px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 shadow-sm">
                <XCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-[#003B5C] leading-tight">
                  Hủy lịch khám
                </DialogTitle>
                <DialogDescription className="text-[13px] text-slate-500 mt-0.5">
                  Mã #{appointment.id.padStart(6, '0')}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex flex-col gap-3">
            <label className="text-[14px] font-bold text-[#003B5C]">
              Lý do hủy lịch <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vui lòng nhập lý do hủy lịch (VD: Bận việc đột xuất...)"
              rows={3}
              className="rounded-xl border-slate-200 text-sm min-h-[96px] resize-none focus-visible:ring-[#00b5f1]/20"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Quay lại
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading || !reason.trim()}
              className="flex-1 px-4 py-3 bg-rose-500 text-white font-bold rounded-2xl text-sm hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Xác nhận hủy
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};