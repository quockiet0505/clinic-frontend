import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import CustomSelect from '@/components/common/CustomSelect';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MyScheduleTable from '../components/MyScheduleTable';
import LeaveApplicationDialog from '../components/LeaveApplicationDialog';
import { staffApi } from '../api/staffApi';

export default function MySchedule() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    staffApi.getLeaveRequests().then(data => setLeaves(data));
  }, []);

  const filteredLeaves = leaves.filter(l => 
    (statusFilter === 'ALL' || l.status === statusFilter) &&
    (!fromDate || l.fromDate >= fromDate) &&
    (!toDate || l.toDate <= toDate)
  );

  const handleCancel = () => {
    if (cancelId) {
      setLeaves(leaves.filter(l => l.leaveId !== cancelId));
      // Gọi API hủy (nếu có)
      // staffApi.cancelLeaveRequest(cancelId);
      setCancelId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader 
        title="Nghỉ Phép Của Tôi" 
        description="Quản lý đơn xin nghỉ phép và lịch sử nghỉ phép." 
        actionText="Nộp Đơn Xin Nghỉ" 
        onAction={() => setIsApplyOpen(true)} 
      />

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <DateRangeFilter 
          from={fromDate} 
          to={toDate} 
          onChangeFrom={setFromDate} 
          onChangeTo={setToDate} 
        />
        <CustomSelect 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="h-11 sm:w-40 rounded-xl border-slate-200"
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </CustomSelect>
      </div>

      <MyScheduleTable 
        data={filteredLeaves} 
        onCancelRequest={(id) => setCancelId(id)} 
      />

      <LeaveApplicationDialog 
        isOpen={isApplyOpen} 
        onClose={() => setIsApplyOpen(false)} 
        onSubmit={() => setIsApplyOpen(false)} 
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