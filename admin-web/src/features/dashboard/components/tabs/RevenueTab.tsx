// features/dashboard/components/tabs/RevenueTab.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { RevenueStatsSummary } from '../../types/dashboard';
import { DollarSign, Stethoscope, Package } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
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

  // Area chart data
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
  const formatYAxis = (value: number) => {
    if (value === 0) return '0';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value.toString();
  };

  // Pie chart: consultation vs service revenue
  const consultation = safeData.consultationRevenue || 0;
  const service = safeData.serviceRevenue || 0;
  const totalForPie = consultation + service;
  const pieData = totalForPie > 0 ? [
    { name: 'Khám bệnh', value: consultation, pct: Math.round(consultation / totalForPie * 100), color: '#0284c7' },
    { name: 'Dịch vụ', value: service, pct: Math.round(service / totalForPie * 100), color: '#818cf8' },
  ] : [];

  const RevTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xl p-3 text-xs">
        <p className="font-semibold text-slate-700 mb-1">Tháng {label}</p>
        <p className="text-slate-500">Doanh thu: <span className="font-bold text-slate-800">{Number(payload[0]?.value ?? 0).toLocaleString('vi-VN')} VNĐ</span></p>
      </div>
    );
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xl p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
          <span className="font-semibold text-slate-700">{d.name}</span>
        </div>
        <p className="mt-1 ml-4 text-slate-500">{d.value.toLocaleString('vi-VN')}đ ({d.pct}%)</p>
      </div>
    );
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
            <div className="h-full rounded-full" style={{ width: `${Math.min(item.percentage, 100)}%`, background: 'linear-gradient(to right, #38bdf8, #0284c7)' }} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<DollarSign size={18} />} label="Tổng doanh thu" value={safeData.totalRevenue.toLocaleString() + 'đ'} bgColor="from-sky-500 to-sky-700 shadow-sky-200" />
        <StatsCard icon={<Stethoscope size={18} />} label="Tiền khám" value={(safeData.consultationRevenue || 0).toLocaleString() + 'đ'} bgColor="from-sky-400 to-sky-600 shadow-sky-100" />
        <StatsCard icon={<Package size={18} />} label="Tiền dịch vụ" value={(safeData.serviceRevenue || 0).toLocaleString() + 'đ'} bgColor="from-purple-500 to-purple-700 shadow-purple-200" />
      </div>

      {/* Grid: AreaChart (2/3) & Pie (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* AreaChart – 2/3 */}
        {chartData.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-semibold text-slate-600">Xu hướng doanh thu theo tháng</h3>
              <span className="text-xs text-slate-400">Đơn vị: VNĐ</span>
            </div>
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="shortName" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} interval={0} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, maxRevenue * 1.15]} tickFormatter={formatYAxis} width={55} />
                  <Tooltip content={<RevTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={2.5}
                    fill="url(#revAreaGrad)" dot={false} activeDot={{ r: 5, fill: '#0284c7', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pie – 1/3: phân bổ loại doanh thu */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-4">Phân bổ loại doanh thu</h3>
            {pieData.length > 0 ? (
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius="50%" outerRadius="70%"
                      startAngle={90} endAngle={-270} paddingAngle={4} dataKey="value" strokeWidth={0}>
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-black text-slate-800">{formatYAxis(totalForPie)}</span>
                  <span className="text-[10px] text-slate-400">Tổng</span>
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">📊</div>
                <p className="text-xs text-slate-400 font-medium">Chưa có dữ liệu phân bổ</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 mt-4 border-t border-slate-100 pt-4">
            {pieData.length > 0 ? (
              pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{d.name}</span>
                    <span className="text-xs font-bold text-slate-700">{d.pct}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[10px] text-slate-400 text-center py-2">Không có doanh thu phát sinh</div>
            )}
          </div>
        </div>
      </div>

      {/* Table – Chiếm trọn 100% hết hàng */}
      <div className="flex flex-col w-full">
        <h3 className="text-sm font-semibold text-slate-600 mb-4 shrink-0">Doanh thu theo dịch vụ</h3>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
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
