// features/dashboard/components/charts/AppointmentStatusDonutChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStats } from '../../types/dashboard';

interface Props {
  stats: DashboardStats;
}

const STATUS_CONFIG = [
  { key: 'completedAppointments', label: 'Hoàn thành', color: '#0284c7' },
  { key: 'pendingAppointments',   label: 'Đang chờ',   color: '#f59e0b' },
  { key: 'cancelledAppointments', label: 'Đã hủy',     color: '#e11d48' },
  { key: 'noShowAppointments',    label: 'Vắng',       color: '#94a3b8' },
] as const;

export default function AppointmentStatusDonutChart({ stats }: Props) {
  const rawData = STATUS_CONFIG.map(s => ({
    ...s,
    value: (stats[s.key as keyof DashboardStats] as number) || 0,
  }));

  const total = rawData.reduce((acc, d) => acc + d.value, 0);

  if (total === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-sm text-slate-400 font-medium">Chưa có lịch hẹn hôm nay</p>
      </div>
    );
  }

  const data = rawData.filter(d => d.value > 0).map(d => ({
    ...d,
    pct: Math.round((d.value / total) * 100),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xl p-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
          <span className="font-semibold text-slate-700">{item.label}</span>
        </div>
        <p className="mt-1 text-slate-500 ml-[18px]">{item.value} ca ({item.pct}%)</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Donut */}
      <div className="relative flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-800 leading-none">{total}</span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">Ca hôm nay</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3 border-t border-slate-100">
        {data.map(item => (
          <div key={item.key} className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: item.color }} />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate leading-none">{item.label}</p>
              <p className="text-xs font-semibold text-slate-700 leading-tight">
                {item.value}
                <span className="text-[10px] font-medium text-slate-400 ml-1">({item.pct}%)</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
