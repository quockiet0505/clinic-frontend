import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import PricingTable from '../components/PricingTable';
import PricingFormDialog from '../components/PricingFormDialog';
import type { DoctorPricing } from '../types/settings';
import { settingsApi } from '../api/settingsApi';

export default function DoctorPricing() {
  const [search, setSearch] = useState('');
  const [prices, setPrices] = useState<DoctorPricing[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingPrice, setEditingPrice] = useState<DoctorPricing | null>(null);
  const [deletingPrice, setDeletingPrice] = useState<DoctorPricing | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await settingsApi.getDoctorPrices();
      setPrices(data || []);
    } catch (e) {
      console.error(e);
      setPrices([]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const filteredData = prices.filter(p =>
    (p.doctorName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <PageHeader
        title="Phí khám bệnh"
        description="Ghi đè giá dịch vụ mặc định cho từng bác sĩ cụ thể."
        actionText="Thêm Phí khám mới"
        onAction={() => setEditingPrice({ id: 0, staffId: 0, doctorName: '', serviceId: 0, serviceName: '', price: 0 })}
      />

      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm kiếm theo tên bác sĩ..."
        />
      </div>

      <PricingTable
        doctors={filteredData}
        onEdit={setEditingPrice}
        onDelete={setDeletingPrice}
      />

      {/* Form Thêm/Sửa chuẩn Blue-600 */}
      <PricingFormDialog
        doctor={editingPrice}
        onClose={() => setEditingPrice(null)}
        onSave={async (id: number, data: any) => {
          await settingsApi.createOrUpdateDoctorPrice(data);
          await fetchData();
          setEditingPrice(null);
        }}
      />

      {/* Dialog Xóa chuẩn Rose-600 từ Common */}
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