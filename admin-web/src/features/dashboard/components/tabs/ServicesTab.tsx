import React, { useState, useEffect, useCallback } from 'react';
import { Package, TrendingUp, Award } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import Table, { Column } from '@/components/tables/Table';
import EntityAvatar from '@/components/common/EntityAvatar';
import DetailModal from '../common/DetailModal';
import { ServiceStat } from '../../types/dashboard';
import { dashboardApi } from '../../api/dashboardApi';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

interface Props {
  month: number;
  year: number;
  searchTerm?: string;
}

export default function ServicesTab({ month, year, searchTerm = '' }: Props) {
  const [selectedService, setSelectedService] = useState<ServiceStat | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<ServiceStat[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [summary, setSummary] = useState({ totalServices: 0, totalOrders: 0, totalRevenue: 0 });
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    try {
      const res = await dashboardApi.getServiceStatsPaged({
        month, year, search: searchTerm || undefined,
        page: currentPage - 1, size: pageSize, sortBy: 'completionRate', sortDir: 'DESC',
      });
      setData(res.content);
      setTotalElements(res.totalElements);
      setSummary({ totalServices: res.totalServices, totalOrders: res.totalOrders, totalRevenue: res.totalRevenue });
    } catch {
      // giữ dữ liệu cũ
    }
  }, [month, year, searchTerm, currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, month, year]);

  const columns: Column<ServiceStat>[] = [
    {
      key: 'serviceName',
      label: 'Dịch vụ',
      className: 'w-[34%] text-left',
      noTruncate: true,
      render: (item) => (
        <div className="flex items-center gap-3 min-w-0">
          <EntityAvatar name={item.serviceName} imageUrl={item.imageUrl} size="md" />
          <span className="font-semibold text-slate-800 truncate" title={item.serviceName}>{item.serviceName}</span>
        </div>
      ),
    },
    { key: 'totalOrders', label: 'Lượt chỉ định', className: 'w-[18%] text-center' },
    { key: 'completedOrders', label: 'Hoàn thành', className: 'w-[18%] text-center' },
    {
      key: 'completionRate',
      label: 'Tỉ lệ',
      className: 'w-[14%] text-center',
      render: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          item.completionRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
          item.completionRate >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
        }`}>{item.completionRate}%</span>
      ),
    },
    {
      key: 'revenue',
      label: 'Doanh thu',
      className: 'w-[15%] text-left',
      render: (item) => <span className="font-medium text-slate-700">{item.revenue.toLocaleString()}đ</span>,
    },
  ];

  const chartData = [...data]
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 6)
    .map(s => ({
      name: s.serviceName.length > 15 ? s.serviceName.slice(0, 15) + '…' : s.serviceName,
      fullName: s.serviceName,
      orders: s.totalOrders,
      rate: s.completionRate,
    }));

  const SvcTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xl p-3 text-xs">
        <p className="font-semibold text-slate-700 mb-2">{payload[0].payload.fullName}</p>
        <p className="text-slate-500 mb-1">Lượt chỉ định: <span className="font-bold text-slate-800">{payload[0].value}</span></p>
        {payload[1] && <p className="text-slate-500">Tỉ lệ hoàn thành: <span className="font-bold text-slate-800">{payload[1].value}%</span></p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<Package size={18} />} label="Tổng dịch vụ" value={summary.totalServices} bgColor="from-sky-500 to-sky-700 shadow-sky-200" />
        <StatsCard icon={<TrendingUp size={18} />} label="Tổng lượt chỉ định" value={summary.totalOrders} bgColor="from-purple-500 to-purple-700 shadow-purple-200" />
        <StatsCard icon={<Award size={18} />} label="Tổng doanh thu" value={summary.totalRevenue.toLocaleString() + 'đ'} bgColor="from-emerald-500 to-emerald-700 shadow-emerald-200" />
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-4">Lượt chỉ định & Tỉ lệ hoàn thành</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: -25, bottom: 0 }} barSize={26}>
                <defs>
                  <linearGradient id="svcBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={8} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<SvcTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.4 }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(v) => <span className="text-slate-500 font-medium">{v === 'orders' ? 'Lượt chỉ định' : 'Tỉ lệ hoàn thành'}</span>} />
                <Bar yAxisId="left" dataKey="orders" fill="url(#svcBarGrad)" radius={[6, 6, 0, 0]} label={{ position: 'top', fill: '#94a3b8', fontSize: 10 }} />
                <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#818cf8" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={data}
          columns={columns}
          onRowClick={setSelectedService}
          emptyMessage="Không có dữ liệu dịch vụ"
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <DetailModal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={`Chi tiết dịch vụ: ${selectedService?.serviceName}`}>
        {selectedService && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Lượt chỉ định</p><p className="text-lg font-bold">{selectedService.totalOrders}</p></div>
            <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Hoàn thành</p><p className="text-lg font-bold">{selectedService.completedOrders}</p></div>
            <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Tỉ lệ</p><p className="text-lg font-bold">{selectedService.completionRate}%</p></div>
            <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Doanh thu</p><p className="text-lg font-bold text-emerald-600">{selectedService.revenue.toLocaleString()}đ</p></div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}
