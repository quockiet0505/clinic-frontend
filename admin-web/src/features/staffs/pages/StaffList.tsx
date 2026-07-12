// features/staffs/pages/StaffList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { StaffFilterBar } from '../components/StaffFilterBar';
import StaffTable from '../components/StaffTable';
import StaffFormDialog from '../components/StaffFormDialog';
import GradientButton from '@/components/common/GradientButton';
import { Staff } from '../types/staff';
import { staffApi } from '../api/staffApi';
import { patientApi } from '@/features/patients/api/patientApi';

export default function StaffList() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.getAllPaged({
        search: searchTerm || undefined,
        staffType: activeTab === 'ALL' ? undefined : activeTab,
        minRating: ratingFilter === 'ALL' ? undefined : parseInt(ratingFilter),
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'fullName',
        sortDir: 'ASC',
      });
      setStaffList(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setStaffList([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [searchTerm, activeTab, ratingFilter, currentPage]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, ratingFilter]);

  const handleFormSubmit = async (formData: Record<string, unknown>, isEdit: boolean) => {
    try {
      if (isEdit) await staffApi.update(selectedStaff!.staffId, formData);
      else await staffApi.create(formData as Omit<Staff, 'staffId'>);
      await fetchStaff();
      setIsFormOpen(false);
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleToggleStatus = async (accountId: number, newStatus: number) => {
    try {
      await patientApi.updateAccountStatus(accountId, newStatus);
      await fetchStaff();
    } catch {
      /* toast: axios interceptor */
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Danh sách Nhân viên" description="Quản lý nhân viên các phòng ban trong phòng khám." />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng nhân viên</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalElements}</p>
            </div>
          </div>
          <GradientButton onClick={() => { setSelectedStaff(null); setIsFormOpen(true); }} className="w-full sm:w-auto">
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

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <StaffTable
          data={staffList}
          loading={loading}
          onEdit={(s) => { setSelectedStaff(s); setIsFormOpen(true); }}
          onDelete={setDeletingStaff}
          onToggleStatus={handleToggleStatus}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <StaffFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedStaff} />

      <ConfirmDialog
        isOpen={!!deletingStaff}
        onClose={() => setDeletingStaff(null)}
        onConfirm={async () => {
          if (deletingStaff) {
            try {
              await staffApi.delete(deletingStaff.staffId);
              await fetchStaff();
            } catch {
              /* toast: axios interceptor */
            }
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
