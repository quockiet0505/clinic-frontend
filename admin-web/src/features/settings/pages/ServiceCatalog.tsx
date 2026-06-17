// features/settings/pages/ServiceCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Package, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ServiceCatalogFilterBar } from '../components/ServiceCatalogFilterBar';
import ServiceCatalogTable from '../components/ServiceCatalogTable';
import ServiceFormDialog from '../components/ServiceFormDialog';
import { StatsCard } from '@/components/common/StatsCard';
import GradientButton from '@/components/common/GradientButton';
import { Service } from '../types/settings';
import { settingsApi } from '../api/settingsApi';

export default function ServiceCatalog() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [sort, setSort] = useState('name_asc');
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getServices();
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort data
  const filteredData = data
    .filter(item => {
      const matchSearch = item.serviceName.toLowerCase().includes(search.toLowerCase());
      const matchType = type === 'ALL' || item.serviceType === type;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'name_asc': return a.serviceName.localeCompare(b.serviceName);
        case 'name_desc': return b.serviceName.localeCompare(a.serviceName);
        case 'price_asc': return (a.originalPrice || 0) - (b.originalPrice || 0);
        case 'price_desc': return (b.originalPrice || 0) - (a.originalPrice || 0);
        default: return 0;
      }
    });

  const totalServices = data.length;
  const examServices = data.filter(s => s.serviceType === 'EXAM').length;
  const labServices = data.filter(s => s.serviceType === 'LAB_TEST').length;
  const imagingServices = data.filter(s => s.serviceType === 'IMAGING').length;

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader
          title="Danh mục Dịch vụ"
          description="Quản lý toàn bộ các dịch vụ lâm sàng và giá cả."
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<Package size={16} />} label="Tổng dịch vụ" value={totalServices} />
          <StatsCard icon={<Package size={16} />} label="Khám bệnh" value={examServices} bgColor="bg-blue-50" iconColor="text-blue-600" />
          <StatsCard icon={<Package size={16} />} label="Xét nghiệm" value={labServices} bgColor="bg-purple-50" iconColor="text-purple-600" />
          <StatsCard icon={<Package size={16} />} label="Chẩn đoán hình ảnh" value={imagingServices} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
          <GradientButton
            onClick={() => setEditing({ serviceId: 0, serviceName: '', serviceType: 'LAB_TEST', originalPrice: 0 })}
            className="w-full sm:w-auto"
          >
            <Plus size={18} className="mr-2" /> Thêm Dịch vụ
          </GradientButton>
        </div>
      </div>

      <ServiceCatalogFilterBar
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        sort={sort}
        onSortChange={setSort}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh mục dịch vụ...</div>
      ) : (
        <div className="flex-1 min-h-0">
          <ServiceCatalogTable data={filteredData} onEdit={setEditing} onDelete={setDeleting} />
        </div>
      )}

      <ServiceFormDialog
        service={editing}
        onClose={() => setEditing(null)}
        onSave={async (id: number, updated: any) => {
          if (id === 0) {
            await settingsApi.createService(updated);
          } else {
            await settingsApi.updateService(id, updated);
          }
          await fetchData();
          setEditing(null);
        }}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) {
            await settingsApi.deleteService(deleting.serviceId);
            await fetchData();
          }
          setDeleting(null);
        }}
        title="Xóa Dịch vụ"
        description={`Bạn có chắc chắn muốn xóa dịch vụ ${deleting?.serviceName}?`}
        confirmText="Xác nhận xóa"
      />
    </div>
  );
}