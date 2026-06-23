import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyStat } from '../../types/dashboard';

interface Props {
  data: MonthlyStat[];
}

const COLORS = {
  completed: 'url(#colorCompleted)',
  cancelled: 'url(#colorCancelled)',
};

export default function AppointmentStatisticsChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-slate-400">Không có dữ liệu thống kê</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
              <stop offset="100%" stopColor="#4338ca" stopOpacity={1}/>
            </linearGradient>
            <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe4e6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#fb7185" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: '#f8fafc', opacity: 0.4 }}
            contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontSize: '13px', padding: '12px 16px' }}
            formatter={(value: any, name: any) => {
              const labels: Record<string, string> = { completed: 'Hoàn thành', cancelled: 'Đã hủy' };
              return [value, labels[name] || name];
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} formatter={(value: string) => {
            const labels: Record<string, string> = { completed: 'Hoàn thành', cancelled: 'Đã hủy' };
            return <span className="text-slate-600 font-medium ml-1">{labels[value] || value}</span>;
          }} />
          <Bar dataKey="completed" name="completed" fill={COLORS.completed} radius={[6, 6, 0, 0]} barSize={24} />
          <Bar dataKey="cancelled" name="cancelled" fill={COLORS.cancelled} radius={[6, 6, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}