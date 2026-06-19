import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyStat } from '../../types/dashboard';

interface Props {
  data: MonthlyStat[];
}

const COLORS = {
  completed: '#3b82f6', // blue-500
  cancelled: '#ef4444', // red-500
};

export default function AppointmentStatisticsChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-slate-400">Không có dữ liệu thống kê</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            formatter={(value: any, name: any) => {
              const labels: Record<string, string> = { completed: 'Hoàn thành', cancelled: 'Hủy' };
              return [value, labels[name] || name];
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} formatter={(value: string) => {
            const labels: Record<string, string> = { completed: 'Hoàn thành', cancelled: 'Hủy' };
            return labels[value] || value;
          }} />
          <Bar dataKey="completed" name="completed" fill={COLORS.completed} radius={[4, 4, 0, 0]} barSize={28} />
          <Bar dataKey="cancelled" name="cancelled" fill={COLORS.cancelled} radius={[4, 4, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}