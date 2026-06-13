import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ServiceCatalogTable from '../components/ServiceCatalogTable';
import ServiceFormDialog from '../components/ServiceFormDialog';
import { Service } from '../types/settings';
import { settingsApi } from '../api/settingsApi';

export default function ServiceCatalog() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getServices();
      setData(res || []);
    } catch (e) {
      console.error(e);
      setData([]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <PageHeader 
        title="Danh mục Dịch vụ" 
        description="Quản lý toàn bộ các dịch vụ lâm sàng và giá cả." 
        actionText="Thêm Dịch vụ"
        onAction={() => setEditing({ serviceId: 0, serviceName: '', serviceType: 'EXAM', originalPrice: 0 })}
      />
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm tên dịch vụ..." />
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh mục dịch vụ...</div>
      ) : (
        <ServiceCatalogTable 
          data={data.filter(s => s.serviceName.toLowerCase().includes(search.toLowerCase()))} 
          onEdit={setEditing} 
          onDelete={setDeleting} 
        />
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