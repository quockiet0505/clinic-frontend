// features/appointments/components/AppointmentStats.tsx
import React from 'react';

interface StatsData {
  total: number;
  pending: number;
  checkedIn: number;
  inProgress: number;
  completed: number;
  absent: number;
}

interface AppointmentStatsProps {
  data: StatsData;
  className?: string;
}

const StatCard = ({ label, value, color, icon }: { label: string; value: number; color: string; icon?: React.ReactNode }) => (
  <div className="flex flex-col items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200/80 hover:shadow-md transition-all min-w-[80px] group">
    {icon && <div className="text-slate-400 group-hover:text-slate-600 transition-colors">{icon}</div>}
    <span className="text-2xl font-bold" style={{ color }}>{value}</span>
    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
  </div>
);

export const AppointmentStats: React.FC<AppointmentStatsProps> = ({ data, className }) => {
  return (
    <div className={`grid grid-cols-3 sm:grid-cols-6 gap-3 ${className}`}>
      <StatCard label="Tổng" value={data.total} color="#3b82f6" />
      <StatCard label="Chờ" value={data.pending} color="#f59e0b" />
      <StatCard label="Check-in" value={data.checkedIn} color="#8b5cf6" />
      <StatCard label="Đang khám" value={data.inProgress} color="#ec4899" />
      <StatCard label="Hoàn thành" value={data.completed} color="#10b981" />
      <StatCard label="Vắng mặt" value={data.absent} color="#ef4444" />
    </div>
  );
};