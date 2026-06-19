// features/settings/pages/DoctorPricing.tsx
import React, { useState, useEffect } from 'react';
import { DollarSign, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DoctorPricingTable from '../components/DoctorPricingTable';
import DoctorPricingFormDialog from '../components/DoctorPricingFormDialog';
import { StatsCard } from '@/components/common/StatsCard';
import GradientButton from '@/components/common/GradientButton';
import { DoctorPricingFilterBar } from '../components/DoctorPricingFilterBar';
import type { DoctorPricing } from '../types/settings';
import { settingsApi } from '../api/settingsApi';

export default function DoctorPricing() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('doctor_asc');
  const [prices, setPrices] = useState<DoctorPricing[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState<DoctorPricing | null>(null);
  const [deletingPrice, setDeletingPrice] = useState<DoctorPricing | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const sortBy = sort.startsWith('price') ? 'price' : 'staff.fullName';
      const sortDir = sort.endsWith('desc') ? 'DESC' : 'ASC';
      const res = await settingsApi.getDoctorPricesPaged({
        search: search || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy,
        sortDir,
      });
      setPrices(res.content);
      setTotalElements(res.totalElements);
    } catch (e) {
      console.error(e);
      setPrices([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, sort, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort]);

  const filteredData = prices;
  const totalPrices = totalElements;
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((sum, p) => sum + (p.price || 0), 0) / prices.length) : 0;

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader
          title="Phí khám bệnh"
          description="Ghi đè giá dịch vụ mặc định cho từng bác sĩ cụ thể."
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<DollarSign size={16} />} label="Tổng cấu hình" value={totalPrices} />
          <StatsCard icon={<DollarSign size={16} />} label="Giá trung bình" value={avgPrice} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
          <GradientButton
            onClick={() => setEditingPrice({ id: 0, staffId: 0, doctorName: '', serviceId: 0, serviceName: '', price: 0, originalPrice: 0, discountPrice: 0 })}
            className="w-full sm:w-auto"
          >
            <Plus size={18} className="mr-2" /> Thêm Phí khám mới
          </GradientButton>
        </div>
      </div>

      <DoctorPricingFilterBar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <DoctorPricingTable
          doctors={filteredData}
          loading={loading}
          onEdit={setEditingPrice}
          onDelete={setDeletingPrice}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <DoctorPricingFormDialog
        doctor={editingPrice}
        onClose={() => setEditingPrice(null)}
        onSave={async (id: number, data: any) => {
          await settingsApi.createOrUpdateDoctorPrice(data);
          await fetchData();
          setEditingPrice(null);
        }}
      />

      <ConfirmDialog
        isOpen={!!deletingPrice}
        title="Xóa Phí khám"
        description={`Bạn có chắc chắn muốn xóa mức phí riêng của bác sĩ ${deletingPrice?.doctorName}? Hệ thống sẽ hoàn về giá dịch vụ mặc định.`}
        confirmText="Xác nhận xóa"
        onClose={() => setDeletingPrice(null)}
        onConfirm={async () => {
          if (deletingPrice) {
            await settingsApi.deleteDoctorPrice(deletingPrice.id);
            await fetchData();
          }
          setDeletingPrice(null);
        }}
      />
    </div>
  );
}