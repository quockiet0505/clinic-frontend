import React, { useState } from 'react';
import { Stethoscope, Award, TrendingUp, Star } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import DataTable from '../common/DataTable';
import DetailModal from '../common/DetailModal';
import { DoctorStat } from '../../types/dashboard';

interface Props {
  data: DoctorStat[];
  loading?: boolean;
}

export default function DoctorsTab({ data, loading = false }: Props) {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorStat | null>(null);

  const totalDoctors = data.length;
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const avgCompletion = data.length > 0
    ? Math.round(data.reduce((sum, d) => sum + d.completionRate, 0) / data.length)
    : 0;

  const columns = [
    { key: 'index', label: '#', render: (_: any, __: any, index: number) => index + 1 },
    { key: 'doctorName', label: 'Bác sĩ' },
    { key: 'totalAppointments', label: 'Tổng ca' },
    { key: 'completedAppointments', label: 'Hoàn thành' },
    {
      key: 'completionRate',
      label: 'Tỉ lệ',
      render: (item: DoctorStat) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            item.completionRate >= 80
              ? 'bg-emerald-100 text-emerald-700'
              : item.completionRate >= 50
              ? 'bg-amber-100 text-amber-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {item.completionRate}%
        </span>
      ),
    },
    {
      key: 'revenue',
      label: 'Doanh thu',
      render: (item: DoctorStat) => (
        <span className="font-medium text-slate-700">{item.revenue.toLocaleString()}đ</span>
      ),
    },
    {
      key: 'avgRating',
      label: 'Đánh giá',
      render: (item: DoctorStat) => (
        <span className="flex items-center gap-1 text-amber-500">
          <Star size={14} fill="currentColor" />
          {item.avgRating || 0}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center py-8 text-slate-400">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tổng hợp nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={<Stethoscope size={16} />}
          label="Tổng bác sĩ"
          value={totalDoctors}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={<TrendingUp size={16} />}
          label="Tổng doanh thu"
          value={totalRevenue.toLocaleString() + 'đ'}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard
          icon={<Award size={16} />}
          label="Tỉ lệ hoàn thành TB"
          value={avgCompletion + '%'}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Bảng */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(item) => setSelectedDoctor(item)}
          emptyMessage="Không có dữ liệu bác sĩ"
        />
      </div>

      {/* Modal chi tiết */}
      <DetailModal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title={`Chi tiết bác sĩ: ${selectedDoctor?.doctorName}`}
      >
        {selectedDoctor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Tổng ca</p>
                <p className="text-lg font-bold">{selectedDoctor.totalAppointments}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Hoàn thành</p>
                <p className="text-lg font-bold">{selectedDoctor.completedAppointments}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Tỉ lệ</p>
                <p className="text-lg font-bold">{selectedDoctor.completionRate}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Doanh thu</p>
                <p className="text-lg font-bold text-emerald-600">
                  {selectedDoctor.revenue.toLocaleString()}đ
                </p>
              </div>
              <div className="col-span-2 bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Đánh giá</p>
                <p className="text-lg font-bold flex items-center gap-1 text-amber-500">
                  <Star size={18} fill="currentColor" /> {selectedDoctor.avgRating || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}