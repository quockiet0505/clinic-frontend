// features/dashboard/components/tabs/RevenueTab.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { RevenueStatsSummary } from '../../types/dashboard';
import { DollarSign, Stethoscope, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatsCard } from '@/components/common/StatsCard';
import Table from '@/components/tables/Table';
import { dashboardApi } from '../../api/dashboardApi';

interface Props {
  month: number;
  year: number;
  searchTerm?: string;
}

export default function RevenueTab({ month, year, searchTerm = '' }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<RevenueStatsSummary | null>(null);
  const [byServiceTotal, setByServiceTotal] = useState(0);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    try {
      const res = await dashboardApi.getRevenueStatsPaged({
        month, year, search: searchTerm || undefined,
        page: currentPage - 1, size: pageSize,
      });
      setData(res);
      setByServiceTotal(res.byServiceTotal);
    } catch {
      setData(null);
      setByServiceTotal(0);
    }
  }, [month, year, searchTerm, currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, month, year]);

  const safeData: RevenueStatsSummary = data || {
    totalRevenue: 0, consultationRevenue: 0, serviceRevenue: 0, monthlyTrend: [], byService: [],
  };

  const chartData = safeData.monthlyTrend.map((item) => {
    let shortName = item.name;
    if (item.name && item.name.length > 6) {
      const parts = item.name.split(' ');
      if (parts.length === 2) {
        const monthMap: Record<string, string> = {
          JANUARY: '01', FEBRUARY: '02', MARCH: '03', APRIL: '04', MAY: '05', JUNE: '06',
          JULY: '07', AUGUST: '08', SEPTEMBER: '09', OCTOBER: '10', NOVEMBER: '11', DECEMBER: '12',
        };
        const m = monthMap[parts[0].toUpperCase()];
        const y = parts[1].slice(2);
        if (m && y) shortName = `${m}/${y}`;
      }
    }
    return { ...item, shortName, revenue: item.revenue || 0 };
  });

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const yTicks = (() => {
    const ticks: number[] = [];
    let step = 250000;
    if (maxRevenue > 2_000_000) step = 500000;
    if (maxRevenue > 5_000_000) step = 1_000_000;
    for (let i = 0; i <= maxRevenue + step; i += step) ticks.push(i);
    return ticks;
  })();

  const formatYAxis = (value: number) => {
    if (value === 0) return '0';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value.toString();
  };

  const columns = [
    { key: 'serviceName', label: 'Dịch vụ', className: 'w-[40%] text-left' },
    {
      key: 'revenue',
      label: 'Doanh thu',
      className: 'w-[30%] text-right',
      render: (item: { revenue: number }) => <span className="font-medium text-slate-700">{item.revenue.toLocaleString()}đ</span>,
    },
    {
      key: 'percentage',
      label: 'Tỉ lệ',
      className: 'w-[30%] text-right',
      render: (item: { percentage: number }) => (
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-slate-500 w-12 text-right">{item.percentage}%</span>
          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(item.percentage, 100)}%` }} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<DollarSign size={16} />} label="Tổng doanh thu" value={safeData.totalRevenue.toLocaleString() + 'đ'} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <StatsCard icon={<Stethoscope size={16} />} label="Tiền khám" value={(safeData.consultationRevenue || 0).toLocaleString() + 'đ'} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
        <StatsCard icon={<Package size={16} />} label="Tiền dịch vụ" value={(safeData.serviceRevenue || 0).toLocaleString() + 'đ'} bgColor="bg-purple-50" iconColor="text-purple-600" />
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600">Doanh thu theo tháng</h3>
            <span className="text-xs text-slate-400">Đơn vị: VNĐ</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="shortName" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, maxRevenue * 1.15]} ticks={yTicks} tickFormatter={formatYAxis} width={60} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} formatter={(value) => [`${Number(value ?? 0).toLocaleString('vi-VN')} VNĐ`, 'Doanh thu']} labelFormatter={(label) => `Tháng ${label}`} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={44} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-4">Doanh thu theo dịch vụ</h3>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table
            data={safeData.byService}
            columns={columns}
            emptyMessage="Không có dữ liệu doanh thu"
            pagination={{ page: currentPage, size: pageSize, total: byServiceTotal, onPageChange: setCurrentPage }}
          />
        </div>
      </div>
    </div>
  );
}
