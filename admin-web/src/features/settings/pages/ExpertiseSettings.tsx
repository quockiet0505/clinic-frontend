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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name_asc');
  const [editing, setEditing] = useState<Expertise | null>(null);
  const [deleting, setDeleting] = useState<Expertise | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getExpertises();
      // Giả định backend trả về list có field doctorCount (đã thêm ở phần trước)
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

  const filteredAndSorted = data
    .filter(e => e.expertiseName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sort) {
        case 'name_asc': return (a.expertiseName || '').localeCompare(b.expertiseName || '');
        case 'name_desc': return (b.expertiseName || '').localeCompare(a.expertiseName || '');
        case 'doctor_asc': return (a.doctorCount || 0) - (b.doctorCount || 0);
        case 'doctor_desc': return (b.doctorCount || 0) - (a.doctorCount || 0);
        default: return 0;
      }
    });

  const totalExpertise = data.length;

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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải chuyên khoa...</div>
      ) : (
        <ExpertiseTable 
          data={filteredAndSorted} 
          onEdit={setEditing} 
          onDelete={(id) => setDeleting(data.find(e => e.expertiseId === id) || null)} 
        />
      )}
      
      <ExpertiseFormDialog 
        expertise={editing} 
        onClose={() => setEditing(null)} 
        onSave={async (id: number, updated: any) => {
          if (id === 0) {
            await settingsApi.createExpertise(updated);
          } else {
            await settingsApi.updateExpertise(id, updated);
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
            await settingsApi.deleteExpertise(deleting.expertiseId);
            await fetchData();
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