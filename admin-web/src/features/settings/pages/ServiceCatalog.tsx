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
import { isHiddenServiceType } from '@/constants/serviceTypes';

export default function ServiceCatalog() {
  const [data, setData] = useState<Service[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [sort, setSort] = useState('name_asc');
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const sortBy = sort.startsWith('price') ? 'originalPrice' : 'serviceName';
      const sortDir = sort.endsWith('desc') ? 'DESC' : 'ASC';
      const res = await settingsApi.getServicesPaged({
        search: search || undefined,
        serviceType: type === 'ALL' ? undefined : type,
        page: currentPage - 1,
        size: pageSize,
        sortBy,
        sortDir,
      });
      setData(res.content.filter((s) => !isHiddenServiceType(s.serviceType)));
      setTotalElements(res.totalElements);
    } catch (e) {
      console.error(e);
      setData([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, type, sort, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, type, sort]);

  const filteredData = data;

  const totalServices = totalElements;
  const labServices = filteredData.filter((s) => s.serviceType === 'LAB_TEST').length;
  const imagingServices = filteredData.filter((s) =>
    ['X_RAY', 'ULTRASOUND', 'CT_SCAN', 'MRI', 'ENDOSCOPY'].includes(s.serviceType)
  ).length;

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader
          title="Danh mục Dịch vụ"
          description="Quản lý toàn bộ các dịch vụ lâm sàng và giá cả."
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<Package size={16} />} label="Tổng dịch vụ" value={totalServices} compact />
          <StatsCard icon={<Package size={16} />} label="Xét nghiệm" value={labServices} bgColor="bg-purple-50" iconColor="text-purple-600" compact />
          <StatsCard icon={<Package size={16} />} label="Chẩn đoán hình ảnh" value={imagingServices} bgColor="bg-emerald-50" iconColor="text-emerald-600" compact />

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

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ServiceCatalogTable
          data={filteredData}
          loading={loading}
          onEdit={setEditing}
          onDelete={setDeleting}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <ServiceFormDialog
        service={editing}
        onClose={() => setEditing(null)}
        onSave={async (id: number, updated: any) => {
          try {
            if (id === 0) {
              await settingsApi.createService(updated);
            } else {
              await settingsApi.updateService(id, updated);
            }
            await fetchData();
            setEditing(null);
          } catch {
            /* toast: axios interceptor */
          }
        }}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) {
            try {
              await settingsApi.deleteService(deleting.serviceId);
              await fetchData();
            } catch {
              /* toast: axios interceptor */
            }
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