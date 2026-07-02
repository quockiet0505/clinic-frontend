// features/dashboard/components/tabs/DoctorsTab.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Stethoscope, Award, TrendingUp, Star } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import Table, { Column } from '@/components/tables/Table';
import EntityAvatar from '@/components/common/EntityAvatar';
import DetailModal from '../common/DetailModal';
import { DoctorStat } from '../../types/dashboard';
import { dashboardApi } from '../../api/dashboardApi';

interface Props {
  month: number;
  year: number;
  searchTerm?: string;
}

export default function DoctorsTab({ month, year, searchTerm = '' }: Props) {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorStat | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<DoctorStat[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [summary, setSummary] = useState({ totalDoctors: 0, totalRevenue: 0, avgCompletion: 0 });
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    try {
      const res = await dashboardApi.getDoctorStatsPaged({
        month,
        year,
        search: searchTerm || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'completionRate',
        sortDir: 'DESC',
      });
      setData(res.content);
      setTotalElements(res.totalElements);
      setSummary({
        totalDoctors: res.totalDoctors,
        totalRevenue: res.totalRevenue,
        avgCompletion: Math.round(res.avgCompletionRate),
      });
    } catch {
      // giữ dữ liệu cũ, tránh nhảy layout
    }
  }, [month, year, searchTerm, currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, month, year]);

  const columns: Column<DoctorStat>[] = [
    {
      key: 'doctorName',
      label: 'Bác sĩ',
      className: 'w-[30%] text-left',
      noTruncate: true,
      render: (item) => (
        <div className="flex items-center gap-3 min-w-0">
          <EntityAvatar name={item.doctorName} imageUrl={item.imageUrl} size="md" />
          <span className="font-semibold text-slate-800 truncate" title={item.doctorName}>{item.doctorName}</span>
        </div>
      ),
    },
    { key: 'totalAppointments', label: 'Tổng ca', className: 'w-[13%] text-center' },
    { key: 'completedAppointments', label: 'Hoàn thành', className: 'w-[13%] text-center' },
    {
      key: 'completionRate',
      label: 'Tỉ lệ',
      className: 'w-[11%] text-center',
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
      className: 'w-[14%] text-left',
      render: (item) => <span className="font-medium text-slate-700">{item.revenue.toLocaleString()}đ</span>,
    },
    {
      key: 'avgRating',
      label: 'Đánh giá',
      className: 'w-[12%] text-center',
      render: (item) => (
        <span className="flex items-center justify-center gap-1 text-amber-500">
          <Star size={14} fill="currentColor" />{item.avgRating || 0}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<Stethoscope size={16} />} label="Tổng bác sĩ" value={summary.totalDoctors} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <StatsCard icon={<TrendingUp size={16} />} label="Tổng doanh thu" value={summary.totalRevenue.toLocaleString() + 'đ'} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
        <StatsCard icon={<Award size={16} />} label="Tỉ lệ hoàn thành TB" value={summary.avgCompletion + '%'} bgColor="bg-purple-50" iconColor="text-purple-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={data}
          columns={columns}
          onRowClick={setSelectedDoctor}
          emptyMessage="Không có dữ liệu bác sĩ"
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <DetailModal isOpen={!!selectedDoctor} onClose={() => setSelectedDoctor(null)} title={`Chi tiết bác sĩ: ${selectedDoctor?.doctorName}`}>
        {selectedDoctor && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Tổng ca</p><p className="text-lg font-bold">{selectedDoctor.totalAppointments}</p></div>
            <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Hoàn thành</p><p className="text-lg font-bold">{selectedDoctor.completedAppointments}</p></div>
            <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Tỉ lệ</p><p className="text-lg font-bold">{selectedDoctor.completionRate}%</p></div>
            <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Doanh thu</p><p className="text-lg font-bold text-emerald-600">{selectedDoctor.revenue.toLocaleString()}đ</p></div>
            <div className="col-span-2 bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Đánh giá</p><p className="text-lg font-bold flex items-center gap-1 text-amber-500"><Star size={18} fill="currentColor" /> {selectedDoctor.avgRating || 0}</p></div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}
