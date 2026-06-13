import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ExpertiseTable from '../components/ExpertiseTable';
import ExpertiseFormDialog from '../components/ExpertiseFormDialog';
import { Expertise } from '../types/settings';
import { settingsApi } from '../api/settingsApi';

export default function ExpertiseSettings() {
  const [data, setData] = useState<Expertise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Expertise | null>(null);
  const [deleting, setDeleting] = useState<Expertise | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getExpertises();
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

  const filtered = data.filter(e => e.expertiseName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <PageHeader 
        title="Chuyên khoa" 
        description="Quản lý các phòng ban và danh mục chuyên khoa của phòng khám." 
        actionText="Thêm Chuyên khoa"
        onAction={() => setEditing({ expertiseId: 0, expertiseName: '', description: '', doctorCount: 0, status: 'Active' })}
      />

      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0">
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm tên chuyên khoa..." />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải chuyên khoa...</div>
      ) : (
        <ExpertiseTable 
          data={filtered} 
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