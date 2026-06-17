// features/dashboard/components/tabs/RevenueTab.tsx
import React from 'react';
import { RevenueStatsSummary } from '../../types/dashboard';
import { DollarSign, TrendingUp, Stethoscope, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatsCard } from '@/components/common/StatsCard';

interface Props {
  data: RevenueStatsSummary | null;
  loading?: boolean;
}

export default function RevenueTab({ data, loading = false }: Props) {
  if (loading) {
    return <div className="text-center py-8 text-slate-400">Đang tải dữ liệu...</div>;
  }

  const safeData: RevenueStatsSummary = data || {
    totalRevenue: 0,
    consultationRevenue: 0,
    serviceRevenue: 0,
    monthlyTrend: [],
    byService: [],
  };

  const chartData = safeData.monthlyTrend.map(item => ({
    name: item.name,
    revenue: item.revenue || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={<DollarSign size={16} />}
          label="Tổng doanh thu"
          value={safeData.totalRevenue.toLocaleString() + 'đ'}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={<Stethoscope size={16} />}
          label="Tiền khám"
          value={(safeData.consultationRevenue || 0).toLocaleString() + 'đ'}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard
          icon={<Package size={16} />}
          label="Tiền dịch vụ"
          value={(safeData.serviceRevenue || 0).toLocaleString() + 'đ'}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Biểu đồ */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-4">Doanh thu theo tháng</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bảng doanh thu theo dịch vụ - luôn hiển thị container, có empty state */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-4">Doanh thu theo dịch vụ</h3>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {safeData.byService.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Không có dữ liệu doanh thu
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600">Dịch vụ</th>
                    <th className="px-6 py-3 text-right font-semibold text-slate-600">Doanh thu</th>
                    <th className="px-6 py-3 text-right font-semibold text-slate-600">Tỉ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {safeData.byService.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-800">{item.serviceName}</td>
                      <td className="px-6 py-3 text-right font-medium text-slate-700">
                        {item.revenue.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-3 text-right text-sm text-slate-500">
                        {item.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}