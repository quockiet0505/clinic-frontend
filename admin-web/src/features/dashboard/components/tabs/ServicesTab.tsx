import React, { useState } from 'react';
import { Package, TrendingUp, Award } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import DataTable from '../common/DataTable';
import DetailModal from '../common/DetailModal';
import { ServiceStat } from '../../types/dashboard';

interface Props {
  data: ServiceStat[];
  loading?: boolean;
}

export default function ServicesTab({ data, loading = false }: Props) {
  const [selectedService, setSelectedService] = useState<ServiceStat | null>(null);

  const totalServices = data.length;
  const totalOrders = data.reduce((sum, s) => sum + s.totalOrders, 0);
  const totalRevenue = data.reduce((sum, s) => sum + s.revenue, 0);

  const columns = [
    { key: 'index', label: '#', render: (_: any, __: any, index: number) => index + 1 },
    { key: 'serviceName', label: 'Dịch vụ' },
    { key: 'totalOrders', label: 'Lượt chỉ định' },
    { key: 'completedOrders', label: 'Hoàn thành' },
    {
      key: 'completionRate',
      label: 'Tỉ lệ',
      render: (item: ServiceStat) => (
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
      render: (item: ServiceStat) => (
        <span className="font-medium text-slate-700">{item.revenue.toLocaleString()}đ</span>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center py-8 text-slate-400">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={<Package size={16} />}
          label="Tổng dịch vụ"
          value={totalServices}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={<TrendingUp size={16} />}
          label="Tổng lượt chỉ định"
          value={totalOrders}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          icon={<Award size={16} />}
          label="Tổng doanh thu"
          value={totalRevenue.toLocaleString() + 'đ'}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(item) => setSelectedService(item)}
          emptyMessage="Không có dữ liệu dịch vụ"
        />
      </div>

      <DetailModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={`Chi tiết dịch vụ: ${selectedService?.serviceName}`}
      >
        {selectedService && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500">Lượt chỉ định</p>
              <p className="text-lg font-bold">{selectedService.totalOrders}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500">Hoàn thành</p>
              <p className="text-lg font-bold">{selectedService.completedOrders}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500">Tỉ lệ</p>
              <p className="text-lg font-bold">{selectedService.completionRate}%</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500">Doanh thu</p>
              <p className="text-lg font-bold text-emerald-600">
                {selectedService.revenue.toLocaleString()}đ
              </p>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}