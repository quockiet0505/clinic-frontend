import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StaffFilterBar from '../components/StaffFilterBar';
import StaffTable from '../components/StaffTable';
import StaffFormDialog from '../components/StaffFormDialog';
import { Staff } from '../types/staff';
import { staffApi } from '../api/staffApi';

export default function StaffList() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    const data = await staffApi.getAll();
    setStaffList(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const handleFormSubmit = async (formData: any, isEdit: boolean) => {
    if (isEdit) await staffApi.update(selectedStaff!.staffId, formData);
    else await staffApi.create(formData);
    await fetchStaff();
    setIsFormOpen(false);
  };

  const filteredStaff = staffList.filter(s => {
    const matchSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'ALL' || s.staffType === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <PageHeader title="Danh sách Nhân sự" description="Quản lý nhân sự các phòng ban trong phòng khám." actionText="Thêm Nhân sự" onAction={() => { setSelectedStaff(null); setIsFormOpen(true); }} />
      <StaffFilterBar activeTab={activeTab} setActiveTab={setActiveTab} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách nhân sự...</div>
      ) : (
        <StaffTable data={filteredStaff} onEdit={(s) => { setSelectedStaff(s); setIsFormOpen(true); }} onDelete={setDeletingStaff} />
      )}
      <StaffFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedStaff} />
      <ConfirmDialog isOpen={!!deletingStaff} onClose={() => setDeletingStaff(null)} onConfirm={async () => { 
        if (deletingStaff) {
          await staffApi.delete(deletingStaff.staffId);
          await fetchStaff();
        }
        setDeletingStaff(null); 
      }} title="Xóa Nhân Sự" description={`Bạn có chắc chắn muốn xóa nhân sự ${deletingStaff?.fullName}?`} />
    </div>
  );
}