// features/staff/pages/MySchedule.tsx
import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const data = await staffApi.getLeaveRequests();
      setLeaves(data);
    } catch (error) {
      console.error('Lỗi tải đơn nghỉ:', error);
      toast.error('Không thể tải danh sách nghỉ phép');
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const filteredLeaves = leaves.filter(l => {
    // Lọc theo search
    const matchSearch = l.reason?.toLowerCase().includes(search.toLowerCase()) ||
                        l.fromDate?.includes(search) ||
                        l.toDate?.includes(search);
    // Lọc theo status
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    // Lọc theo loại nghỉ phép
    const matchLeaveType = leaveTypeFilter === 'ALL' || l.leaveType === leaveTypeFilter;
    // Lọc theo date range
    const matchFrom = !fromDate || l.fromDate >= fromDate;
    const matchTo = !toDate || l.toDate <= toDate;
    // Lọc theo tab
    let matchTab = true;
    if (activeTab === 'tomorrow') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      matchTab = l.fromDate <= tomorrowStr && l.toDate >= tomorrowStr;
    }
    return matchSearch && matchStatus && matchLeaveType && matchFrom && matchTo && matchTab;
  });

  // Chỉ hiển thị 1 stats: Tổng đơn nghỉ
  const totalLeaves = leaves.length;

  const handleCancel = async () => {
    if (cancelId) {
      try {
        await staffApi.cancelLeaveRequest(cancelId);
        toast.success('Đã hủy đơn nghỉ phép');
        await fetchLeaveRequests();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Hủy đơn thất bại');
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
        <PageHeader 
          title="Nghỉ Phép Của Tôi" 
          description="Quản lý đơn xin nghỉ phép và lịch sử nghỉ phép." 
        />
        <div className="flex flex-wrap items-center gap-3">
          {/* Stats card: Tổng đơn nghỉ */}
          <StatsCard icon={<FileText size={16} />} label="Tổng đơn nghỉ" value={totalLeaves} />
          {/* Nút nộp đơn */}
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách nghỉ phép...</div>
      ) : (
        <MyScheduleTable 
          data={filteredLeaves} 
          onCancelRequest={(id) => setCancelId(id)} 
        />
      )}

      <LeaveApplicationDialog 
        isOpen={isApplyOpen} 
        onClose={() => setIsApplyOpen(false)} 
        onSubmit={handleSubmitLeave} 
      />

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