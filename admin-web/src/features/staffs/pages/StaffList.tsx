// features/staff/pages/StaffList.tsx
import React, { useState } from 'react';
import { Users, UserPlus, Star } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { StaffFilterBar } from '../components/StaffFilterBar';
import StaffTable from '../components/StaffTable';
import StaffFormDialog from '../components/StaffFormDialog';
import GradientButton from '@/components/common/GradientButton';
import { Staff } from '../types/staff';
import { staffApi } from '../api/staffApi';

export default function StaffList() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

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
          { staffId: 101, fullName: 'BS. Lê Văn B', email: 'levanb@trustcare.vn', phone: '0901234567', staffType: 'DOCTOR', expertiseName: 'Nội khoa', isActive: true, rating: 4.5 },
          { staffId: 102, fullName: 'Phạm Thị C', email: 'phamthic@trustcare.vn', phone: '0987654321', staffType: 'STAFF', expertiseName: 'Hành chính', isActive: true, rating: 3.0 },
          { staffId: 103, fullName: 'Nguyễn Văn A', email: 'nguyenvana@trustcare.vn', phone: '0912345678', staffType: 'ADMIN', expertiseName: 'Hệ thống', isActive: false, rating: 5.0 },
        ]);
      }
    } catch (e) {
      setStaffList([
        { staffId: 101, fullName: 'BS. Lê Văn B', email: 'levanb@trustcare.vn', phone: '0901234567', staffType: 'DOCTOR', expertiseName: 'Nội khoa', isActive: true, rating: 4.0 },
        { staffId: 102, fullName: 'Phạm Thị C', email: 'phamthic@trustcare.vn', phone: '0987654321', staffType: 'STAFF', expertiseName: 'Hành chính', isActive: true, rating: 3.5 },
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
    let matchRating = true;
    if (ratingFilter !== 'ALL') {
      const minRating = parseInt(ratingFilter);
      matchRating = (s.rating || 0) >= minRating;
    }
    return matchSearch && matchTab && matchRating;
  });

  const total = staffList.length;
  const doctors = staffList.filter(s => s.staffType === 'DOCTOR').length;
  const staff = staffList.filter(s => s.staffType === 'STAFF').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader 
          title="Danh sách Nhân viên" 
          description="Quản lý nhân viên các phòng ban trong phòng khám." 
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng nhân viên</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{total}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Bác sĩ</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{doctors}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Nhân viên</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{staff}</p>
            </div>
          </div>
          <GradientButton 
            onClick={() => { setSelectedStaff(null); setIsFormOpen(true); }}
            className="w-full sm:w-auto"
          >
            <UserPlus size={18} className="mr-2" /> Thêm nhân viên
          </GradientButton>
        </div>
      </div>

      <StaffFilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách nhân viên...</div>
      ) : (
        <StaffTable data={filteredStaff} onEdit={(s) => { setSelectedStaff(s); setIsFormOpen(true); }} onDelete={setDeletingStaff} />
      )}

      <StaffFormDialog 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={selectedStaff} 
      />

      <ConfirmDialog 
        isOpen={!!deletingStaff} 
        onClose={() => setDeletingStaff(null)} 
        onConfirm={async () => {
          if (deletingStaff) {
            await staffApi.delete(deletingStaff.staffId);
            await fetchStaff();
          }
          setDeletingStaff(null);
        }} 
        title="Xóa Nhân viên" 
        description={`Bạn có chắc chắn muốn xóa nhân viên ${deletingStaff?.fullName}?`} 
        confirmText="Xác nhận xóa" 
      />
    </div>
  );
}