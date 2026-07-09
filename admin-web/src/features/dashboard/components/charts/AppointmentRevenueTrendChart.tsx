// features/dashboard/components/charts/AppointmentRevenueTrendChart.tsx
import React from 'react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { MonthlyStat, RevenueMonthlyTrend } from '../../types/dashboard';

interface Props {
  monthlyData: MonthlyStat[];
  revenueTrend: RevenueMonthlyTrend[];
}

function mergeData(monthlyData: MonthlyStat[], revenueTrend: RevenueMonthlyTrend[]) {
  return monthlyData.map((m, i) => ({
    name: m.name,
    completed: m.completed,
    cancelled: m.cancelled,
    revenue: revenueTrend[i]?.revenue ?? 0,
  }));
}

const formatRevenue = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
            {entry.dataKey === 'completed' ? 'Hoàn thành' : entry.dataKey === 'revenue' ? 'Doanh thu' : 'Đã hủy'}
          </span>
          <span className="font-semibold text-slate-800">
            {entry.dataKey === 'revenue' ? `${Number(entry.value).toLocaleString('vi-VN')}đ` : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AppointmentRevenueTrendChart({ monthlyData, revenueTrend }: Props) {
  const data = mergeData(monthlyData, revenueTrend);
  const hasRevenue = revenueTrend.some(r => r.revenue > 0);

  if (!data.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
        Chưa có dữ liệu thống kê
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: hasRevenue ? 50 : 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="aptGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            dy={8}
          />

          {/* Trục Y trái – số lịch hẹn */}
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            width={30}
          />

          {/* Trục Y phải – doanh thu */}
          {hasRevenue && (
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={formatRevenue}
              domain={[0, maxRevenue * 1.2]}
              width={45}
            />
          )}

          <Tooltip content={<CustomTooltip />} />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
            formatter={(value: string) => {
              const map: Record<string, string> = { completed: 'Hoàn thành', revenue: 'Doanh thu', cancelled: 'Đã hủy' };
              return <span className="text-slate-500 font-medium ml-1">{map[value] || value}</span>;
            }}
          />

          {/* Area: lịch hẹn hoàn thành */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="completed"
            name="completed"
            stroke="#0284c7"
            strokeWidth={2.5}
            fill="url(#aptGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#0284c7', strokeWidth: 0 }}
          />

          {/* Line: doanh thu */}
          {hasRevenue && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="#818cf8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: '#818cf8', strokeWidth: 0 }}
              strokeDasharray="0"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
