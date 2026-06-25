// features/settings/pages/ExpertiseSettings.tsx
import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ExpertiseFilterBar } from '../components/ExpertiseFilterBar';
import ExpertiseTable from '../components/ExpertiseTable';
import ExpertiseFormDialog from '../components/ExpertiseFormDialog';
import { StatsCard } from '@/components/common/StatsCard';
import GradientButton from '@/components/common/GradientButton';
import { Expertise } from '../types/settings';
import { settingsApi } from '../api/settingsApi';
export default function ExpertiseSettings() {
  const [data, setData] = useState<Expertise[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name_asc');
  const [editing, setEditing] = useState<Expertise | null>(null);
  const [deleting, setDeleting] = useState<Expertise | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const sortBy = sort.startsWith('doctor') ? 'expertiseName' : 'expertiseName';
      const sortDir = sort.endsWith('desc') ? 'DESC' : 'ASC';
      const res = await settingsApi.getExpertisesPaged({
        search: search || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy,
        sortDir,
      });
      setData(res.content);
      setTotalElements(res.totalElements);
    } catch (e) {
      console.error(e);
      setData([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, sort, currentPage]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, sort]);

  const filteredAndSorted = [...data].sort((a, b) => {
    if (sort === 'doctor_asc') return (a.doctorCount || 0) - (b.doctorCount || 0);
    if (sort === 'doctor_desc') return (b.doctorCount || 0) - (a.doctorCount || 0);
    return 0;
  });

  const totalExpertise = totalElements;

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader 
          title="Chuyên khoa" 
          description="Quản lý các phòng ban và danh mục chuyên khoa của phòng khám." 
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<Users size={16} />} label="Tổng chuyên khoa" value={totalExpertise} />
          <GradientButton
            onClick={() => setEditing({ expertiseId: 0, expertiseName: '' })}
            className="w-full sm:w-auto"
          >
            <Plus size={18} className="mr-2" /> Thêm Chuyên khoa
          </GradientButton>
        </div>
      </div>

      <ExpertiseFilterBar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ExpertiseTable
          data={filteredAndSorted}
          loading={loading}
          onEdit={setEditing}
          onDelete={(id) => setDeleting(data.find((e) => e.expertiseId === id) || null)}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>
      
      <ExpertiseFormDialog 
        expertise={editing} 
        onClose={() => setEditing(null)} 
        onSave={async (id: number, updated: any) => {
          try {
            if (id === 0) {
              await settingsApi.createExpertise(updated);
            } else {
              await settingsApi.updateExpertise(id, updated);
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
              await settingsApi.deleteExpertise(deleting.expertiseId);
              await fetchData();
            } catch {
              /* toast: axios interceptor */
            }
          }
          setDeleting(null);
        }} 
        title="Xóa Chuyên khoa" 
        description={`Bạn có chắc chắn muốn xóa chuyên khoa "${deleting?.expertiseName}"?`} 
        confirmText="Xác nhận xóa"
      />
    </div>
  );
}