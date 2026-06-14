import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Thg 1', completed: 400, cancelled: 24, rescheduled: 45 },
  { name: 'Thg 2', completed: 300, cancelled: 13, rescheduled: 32 },
  { name: 'Thg 3', completed: 520, cancelled: 45, rescheduled: 60 },
  { name: 'Thg 4', completed: 450, cancelled: 30, rescheduled: 40 },
  { name: 'Thg 5', completed: 600, cancelled: 50, rescheduled: 75 },
  { name: 'Thg 6', completed: 750, cancelled: 40, rescheduled: 80 },
];

export default function AppointmentStatisticsChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
            }}
            formatter={(value: any, name: string) => {
              const labels: Record<string, string> = {
                completed: 'Hoàn thành',
                cancelled: 'Hủy',
                rescheduled: 'Dời lịch',
              };
              return [value, labels[name] || name];
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                completed: 'Hoàn thành',
                cancelled: 'Hủy',
                rescheduled: 'Dời lịch',
              };
              return labels[value] || value;
            }}
          />
          <Bar
            dataKey="completed"
            name="completed"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Bar
            dataKey="rescheduled"
            name="rescheduled"
            fill="#0ea5e9"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Bar
            dataKey="cancelled"
            name="cancelled"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}