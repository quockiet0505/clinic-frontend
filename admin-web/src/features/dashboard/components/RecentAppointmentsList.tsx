// features/dashboard/components/RecentAppointmentsList.tsx
import React from 'react';
import { RecentAppointment } from '../types/dashboard';

interface Props {
  appointments: RecentAppointment[];
}

const STATUS_CONFIG: Record<string, { label: string; dotColor: string; badgeBg: string; badgeText: string }> = {
  PENDING:     { label: 'Chờ xác nhận', dotColor: 'bg-amber-400',   badgeBg: 'bg-amber-50',   badgeText: 'text-amber-700' },
  CONFIRMED:   { label: 'Đã xác nhận',  dotColor: 'bg-sky-400',     badgeBg: 'bg-sky-50',     badgeText: 'text-sky-700' },
  CHECKED_IN:  { label: 'Đã đến',       dotColor: 'bg-indigo-400',  badgeBg: 'bg-indigo-50',  badgeText: 'text-indigo-700' },
  IN_PROGRESS: { label: 'Đang khám',    dotColor: 'bg-violet-400',  badgeBg: 'bg-violet-50',  badgeText: 'text-violet-700' },
  COMPLETED:   { label: 'Hoàn thành',   dotColor: 'bg-sky-500',     badgeBg: 'bg-sky-50',     badgeText: 'text-sky-700' },
  CANCELLED:   { label: 'Đã hủy',       dotColor: 'bg-rose-400',    badgeBg: 'bg-rose-50',    badgeText: 'text-rose-700' },
  NO_SHOW:     { label: 'Vắng',         dotColor: 'bg-slate-400',   badgeBg: 'bg-slate-100',  badgeText: 'text-slate-600' },
};

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // Cố gắng parse "YYYY-MM-DD" format
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const parsed = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return parsed.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
      return dateStr;
    }
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 2) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[parts.length - 1][0] + parts[0][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  'from-sky-500 to-blue-600',
  'from-violet-500 to-indigo-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-cyan-500 to-sky-600',
  'from-fuchsia-500 to-purple-600',
];

export default function RecentAppointmentsList({ appointments }: Props) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-sm font-medium text-slate-400">Không có lịch hẹn nào</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-100" />

      <div className="space-y-0">
        {appointments.map((apt, idx) => {
          const config = STATUS_CONFIG[apt.status] || STATUS_CONFIG.PENDING;
          const avatarColor = 'from-sky-400 to-sky-600';

          return (
            <div key={apt.id} className="relative flex items-start gap-3 py-3 group">
              {/* Timeline dot */}
              <div className={`relative z-10 shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-[11px] font-black shadow-sm ring-2 ring-white`}>
                {apt.avatarUrl
                  ? <img src={apt.avatarUrl} alt={apt.patientName} className="w-full h-full rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  : getInitials(apt.patientName)
                }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800 truncate leading-snug group-hover:text-sky-600 transition-colors">
                    {apt.patientName}
                  </p>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md ${config.badgeBg} ${config.badgeText}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                  {formatRelativeTime(apt.time)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
