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
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState<DoctorPricing | null>(null);
  const [deletingPrice, setDeletingPrice] = useState<DoctorPricing | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await settingsApi.getDoctorPrices();
      setPrices(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setPrices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = prices
    .filter(p => (p.doctorName || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sort) {
        case 'doctor_asc': return (a.doctorName || '').localeCompare(b.doctorName || '');
        case 'doctor_desc': return (b.doctorName || '').localeCompare(a.doctorName || '');
        case 'price_asc': return (a.price || 0) - (b.price || 0);
        case 'price_desc': return (b.price || 0) - (a.price || 0);
        default: return 0;
      }
    });

  const totalPrices = prices.length;
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải...</div>
      ) : (
        <div className="flex-1 min-h-0">
          <DoctorPricingTable doctors={filteredData} onEdit={setEditingPrice} onDelete={setDeletingPrice} />
        </div>
      )}

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