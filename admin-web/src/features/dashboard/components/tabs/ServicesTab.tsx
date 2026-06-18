// features/dashboard/components/tabs/ServicesTab.tsx
import React, { useState, useMemo } from 'react';
import { Package, TrendingUp, Award } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import Table, { Column } from '@/components/tables/Table';
import DetailModal from '../common/DetailModal';
import { ServiceStat } from '../../types/dashboard';
import { getImageUrl } from '@/utils/image';

interface Props {
  data: ServiceStat[];
  loading?: boolean;
  searchTerm?: string;
}

export default function ServicesTab({ data, loading = false, searchTerm = '' }: Props) {
  const [selectedService, setSelectedService] = useState<ServiceStat | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      item.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length]);

  const totalServices = filteredData.length;
  const totalOrders = filteredData.reduce((sum, s) => sum + s.totalOrders, 0);
  const totalRevenue = filteredData.reduce((sum, s) => sum + s.revenue, 0);

  const columns: Column<ServiceStat>[] = [
    {
      key: 'serviceName',
      label: 'Dịch vụ',
      className: 'w-[30%] min-w-[180px]',
      render: (item: ServiceStat) => {
        const avatarUrl = getImageUrl(item.imageUrl);
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={item.serviceName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'text-sm font-bold';
                      fallback.textContent = item.serviceName.charAt(0).toUpperCase();
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="text-sm font-bold">{item.serviceName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="font-semibold text-slate-800 truncate" title={item.serviceName}>
              {item.serviceName}
            </span>
          </div>
        );
      },
    },
    { key: 'totalOrders', label: 'Lượt chỉ định', className: 'w-[15%] text-center' },
    { key: 'completedOrders', label: 'Hoàn thành', className: 'w-[15%] text-center' },
    {
      key: 'completionRate',
      label: 'Tỉ lệ',
      className: 'w-[12%] text-center',
      render: (item: ServiceStat) => (
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
      className: 'w-[18%] text-right',
      render: (item: ServiceStat) => (
        <span className="font-medium text-slate-700">{item.revenue.toLocaleString()}đ</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<Package size={16} />} label="Tổng dịch vụ" value={totalServices} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <StatsCard icon={<TrendingUp size={16} />} label="Tổng lượt chỉ định" value={totalOrders} bgColor="bg-purple-50" iconColor="text-purple-600" />
        <StatsCard icon={<Award size={16} />} label="Tổng doanh thu" value={totalRevenue.toLocaleString() + 'đ'} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={filteredData}
          columns={columns}
          onRowClick={(item) => setSelectedService(item)}
          loading={false}
          emptyMessage="Không có dữ liệu dịch vụ"
          maxHeight="500px"
          pagination={{
            page: currentPage,
            size: pageSize,
            total: filteredData.length,
            onPageChange: setCurrentPage,
          }}
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