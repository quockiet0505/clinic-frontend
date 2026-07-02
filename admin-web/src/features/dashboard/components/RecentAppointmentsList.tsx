import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';
import { RecentAppointment } from '../types/dashboard';

interface Props {
  appointments: RecentAppointment[];
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: 'Chờ xác nhận',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: <Clock size={12} className="text-amber-500" />,
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <CheckCircle size={12} className="text-blue-500" />,
  },
  CHECKED_IN: {
    label: 'Đã đến',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    icon: <User size={12} className="text-indigo-500" />,
  },
  IN_PROGRESS: {
    label: 'Đang khám',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: <Clock size={12} className="text-purple-500" />,
  },
  COMPLETED: {
    label: 'Hoàn thành',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: <CheckCircle size={12} className="text-emerald-500" />,
  },
  CANCELLED: {
    label: 'Đã hủy',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    icon: <XCircle size={12} className="text-rose-500" />,
  },
  NO_SHOW: {
    label: 'Không đến',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    icon: <AlertCircle size={12} className="text-slate-500" />,
  },
};

export default function RecentAppointmentsList({ appointments }: Props) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-10 text-sm font-medium text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        Không có lịch hẹn nào
      </div>
    );
  }

  return (
    <div className="">
      {appointments.slice(0, 6).map((apt) => {
        const status = statusConfig[apt.status] || statusConfig.PENDING;
        const timeDisplay = new Date(apt.time).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        return (
          <div
            key={apt.id}
            className="group flex items-center gap-3 py-3.5 px-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors rounded-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {apt.patientName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {apt.patientName}
              </p>
              <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5 tracking-wide uppercase">
                {timeDisplay}
              </p>
            </div>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-bold tracking-wide ${status.bg} ${status.text} shrink-0`}
            >
              {status.icon}
              {status.label}
            </div>
          </div>
        );
      })}
      {appointments.length > 6 && (
        <div className="text-center text-xs text-blue-600 font-medium mt-2">
          +{appointments.length - 6} lịch hẹn khác
        </div>
      )}
    </div>
  );
}
