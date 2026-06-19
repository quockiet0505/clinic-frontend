// features/staffs/pages/MySchedule.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { StatsCard } from '@/components/common/StatsCard';
import GradientButton from '@/components/common/GradientButton';
import { MyScheduleFilterBar } from '../components/MyScheduleFilterBar';
import MyScheduleTable from '../components/MyScheduleTable';
import LeaveApplicationDialog from '../components/LeaveApplicationDialog';
import { staffApi } from '../api/staffApi';
import { toast } from 'react-hot-toast';

export default function MySchedule() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    try {
      let effectiveFromDate = fromDate || undefined;
      let effectiveToDate = toDate || undefined;
      if (activeTab === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().slice(0, 10);
        effectiveFromDate = tomorrowStr;
        effectiveToDate = tomorrowStr;
      }
      const res = await staffApi.getLeaveRequestsPaged({
        search: search || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        leaveType: leaveTypeFilter === 'ALL' ? undefined : leaveTypeFilter,
        fromDate: effectiveFromDate,
        toDate: effectiveToDate,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'fromDate',
        sortDir: 'DESC',
      });
      setLeaves(res.content);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.error('Lỗi tải đơn nghỉ:', error);
      toast.error('Không thể tải danh sách nghỉ phép');
      setLeaves([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, leaveTypeFilter, activeTab, fromDate, toDate, currentPage]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, leaveTypeFilter, activeTab, fromDate, toDate]);

  const handleCancel = async () => {
    if (cancelId) {
      try {
        await staffApi.cancelLeaveRequest(cancelId);
        toast.success('Đã hủy đơn nghỉ phép');
        await fetchLeaveRequests();
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Hủy đơn thất bại');
      } finally {
        setCancelId(null);
      }
    }
  };

  const handleSubmitLeave = () => {
    fetchLeaveRequests();
    setIsApplyOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Nghỉ Phép Của Tôi" description="Quản lý đơn xin nghỉ phép và lịch sử nghỉ phép." />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<FileText size={16} />} label="Tổng đơn nghỉ" value={totalElements} />
          <GradientButton onClick={() => setIsApplyOpen(true)} className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" /> Nộp Đơn Xin Nghỉ
          </GradientButton>
        </div>
      </div>

      <MyScheduleFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        leaveTypeFilter={leaveTypeFilter}
        onLeaveTypeChange={setLeaveTypeFilter}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <MyScheduleTable
          data={leaves}
          loading={loading}
          onCancelRequest={(id) => setCancelId(id)}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <LeaveApplicationDialog isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} onSubmit={handleSubmitLeave} />

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Hủy Đơn Xin Nghỉ"
        description="Bạn có chắc chắn muốn hủy đơn xin nghỉ này không?"
        confirmText="Xác nhận hủy"
      />
    </div>
  );
}
