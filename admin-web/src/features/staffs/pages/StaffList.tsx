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
    try {
      const data = await staffApi.getAll();
      if (data && data.length > 0) {
        setStaffList(data);
      } else {
        setStaffList([
          { staffId: 101, fullName: 'BS. Lê Văn B', email: 'levanb@trustcare.vn', phone: '0901234567', staffType: 'DOCTOR', expertiseName: 'Nội khoa', isActive: true },
          { staffId: 102, fullName: 'Phạm Thị C', email: 'phamthic@trustcare.vn', phone: '0987654321', staffType: 'STAFF', expertiseName: 'Hành chính', isActive: true },
          { staffId: 103, fullName: 'Nguyễn Văn A', email: 'nguyenvana@trustcare.vn', phone: '0912345678', staffType: 'ADMIN', expertiseName: 'Hệ thống', isActive: false },
        ]);
      }
    } catch (e) {
      setStaffList([
        { staffId: 101, fullName: 'BS. Lê Văn B', email: 'levanb@trustcare.vn', phone: '0901234567', staffType: 'DOCTOR', expertiseName: 'Nội khoa', isActive: true },
        { staffId: 102, fullName: 'Phạm Thị C', email: 'phamthic@trustcare.vn', phone: '0987654321', staffType: 'STAFF', expertiseName: 'Hành chính', isActive: true },
      ]);
    }
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
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col relative">
      <PageHeader
        title="Danh sách Nhân viên"
        description="Quản lý nhân viên các phòng ban trong phòng khám."
        actionText="Thêm Nhân viên"
        onAction={() => { setSelectedStaff(null); setIsFormOpen(true); }}
      />
      <StaffFilterBar activeTab={activeTab} setActiveTab={setActiveTab} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách nhân viên...</div>
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
      }} title="Xóa Nhân viên" description={`Bạn có chắc chắn muốn xóa nhân viên ${deletingStaff?.fullName}?`} confirmText="Xác nhận xóa" />
    </div>
  );
}