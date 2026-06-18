// features/dashboard/components/tabs/DoctorsTab.tsx
import React, { useState, useMemo } from 'react';
import { Stethoscope, Award, TrendingUp, Star } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import Table, { Column } from '@/components/tables/Table';
import DetailModal from '../common/DetailModal';
import { DoctorStat } from '../../types/dashboard';
import { getImageUrl } from '@/utils/image';

interface Props {
  data: DoctorStat[];
  loading?: boolean;
  searchTerm?: string;
}

export default function DoctorsTab({ data, loading = false, searchTerm = '' }: Props) {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorStat | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      item.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Reset về trang 1 khi dữ liệu lọc thay đổi
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length]);

  const totalDoctors = filteredData.length;
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  const avgCompletion = filteredData.length > 0
    ? Math.round(filteredData.reduce((sum, d) => sum + d.completionRate, 0) / filteredData.length)
    : 0;

  const columns: Column<DoctorStat>[] = [
    {
      key: 'doctorName',
      label: 'Bác sĩ',
      className: 'w-[25%] min-w-[180px]',
      render: (item: DoctorStat) => {
        const avatarUrl = getImageUrl(item.imageUrl);
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={item.doctorName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'text-sm font-bold';
                      fallback.textContent = item.doctorName.charAt(0).toUpperCase();
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="text-sm font-bold">{item.doctorName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="font-semibold text-slate-800 truncate" title={item.doctorName}>
              {item.doctorName}
            </span>
          </div>
        );
      },
    },
    { key: 'totalAppointments', label: 'Tổng ca', className: 'w-[12%] text-center' },
    { key: 'completedAppointments', label: 'Hoàn thành', className: 'w-[12%] text-center' },
    {
      key: 'completionRate',
      label: 'Tỉ lệ',
      className: 'w-[12%] text-center',
      render: (item: DoctorStat) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          item.completionRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
          item.completionRate >= 50 ? 'bg-amber-100 text-amber-700' :
          'bg-rose-100 text-rose-700'
        }`}>
          {item.completionRate}%
        </span>
      ),
    },
    {
      key: 'revenue',
      label: 'Doanh thu',
      className: 'w-[15%] text-right',
      render: (item: DoctorStat) => (
        <span className="font-medium text-slate-700">{item.revenue.toLocaleString()}đ</span>
      ),
    },
    {
      key: 'avgRating',
      label: 'Đánh giá',
      className: 'w-[14%] text-center',
      render: (item: DoctorStat) => (
        <span className="flex items-center justify-center gap-1 text-amber-500">
          <Star size={14} fill="currentColor" />
          {item.avgRating || 0}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<Stethoscope size={16} />} label="Tổng bác sĩ" value={totalDoctors} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <StatsCard icon={<TrendingUp size={16} />} label="Tổng doanh thu" value={totalRevenue.toLocaleString() + 'đ'} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
        <StatsCard icon={<Award size={16} />} label="Tỉ lệ hoàn thành TB" value={avgCompletion + '%'} bgColor="bg-purple-50" iconColor="text-purple-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={filteredData}
          columns={columns}
          onRowClick={(item) => setSelectedDoctor(item)}
          loading={false} // ✅ bỏ loading
          emptyMessage="Không có dữ liệu bác sĩ"
          maxHeight="500px"
          pagination={{
            page: currentPage,
            size: pageSize,
            total: filteredData.length,
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      <DetailModal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title={`Chi tiết bác sĩ: ${selectedDoctor?.doctorName}`}
      >
        {selectedDoctor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Tổng ca</p><p className="text-lg font-bold">{selectedDoctor.totalAppointments}</p></div>
              <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Hoàn thành</p><p className="text-lg font-bold">{selectedDoctor.completedAppointments}</p></div>
              <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Tỉ lệ</p><p className="text-lg font-bold">{selectedDoctor.completionRate}%</p></div>
              <div className="bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Doanh thu</p><p className="text-lg font-bold text-emerald-600">{selectedDoctor.revenue.toLocaleString()}đ</p></div>
              <div className="col-span-2 bg-slate-50 p-4 rounded-xl"><p className="text-xs text-slate-500">Đánh giá</p><p className="text-lg font-bold flex items-center gap-1 text-amber-500"><Star size={18} fill="currentColor" /> {selectedDoctor.avgRating || 0}</p></div>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}