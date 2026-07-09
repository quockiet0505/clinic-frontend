// features/dashboard/components/charts/TopServicesBarChart.tsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { ServiceStat } from '../../types/dashboard';

interface Props {
  data: ServiceStat[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{data.fullName}</p>
      <p className="text-slate-500">
        Lượt chỉ định: <span className="font-bold text-slate-800">{payload[0].value}</span>
      </p>
    </div>
  );
};

export default function TopServicesBarChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">
        Chưa có dữ liệu dịch vụ
      </div>
    );
  }

  const chartData = data.map((s, index) => ({
    name: `DV ${index + 1}`,
    fullName: s.serviceName,
    value: s.totalOrders,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Biểu đồ cột rút gọn trục X (DV1, DV2...) */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -10, bottom: 10 }}
            barSize={32}
          >
            <defs>
              <linearGradient id="topSvcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                <stop offset="100%" stopColor="#0284c7" stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              dy={6}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.4 }} />

            <Bar
              dataKey="value"
              fill="url(#topSvcGrad)"
              radius={[6, 6, 0, 0]}
              label={{ position: 'top', fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng giải thích chi tiết tên dịch vụ ở dưới */}
      <div className="border-t border-slate-100 pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {chartData.map((d, index) => (
          <div key={d.name} className="flex items-start gap-2 text-xs text-slate-600">
            <span className="shrink-0 px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px] uppercase leading-none mt-0.5 border border-sky-100">
              DV {index + 1}
            </span>
            <span className="truncate font-medium text-slate-600" title={d.fullName}>
              {d.fullName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
