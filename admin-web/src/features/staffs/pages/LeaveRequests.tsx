import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import CustomSelect from '@/components/common/CustomSelect';
import LeaveRequestsFilterBar from '../components/LeaveRequestsFilterBar';
import LeaveRequestsTable from '../components/LeaveRequestsTable';
import { LeaveRequest } from '../types/staff';
import { staffApi } from '../api/staffApi';
import toast from 'react-hot-toast';

const TODAY = new Date().toISOString().split('T')[0];

const viewToTab: Record<string, string> = {
  TODAY: 'today',
  PENDING: 'pending',
  PROCESSED: 'processed',
};

export default function LeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('TODAY');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [filterDate, setFilterDate] = useState(TODAY);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.getLeaveRequestsPaged({
        search: searchTerm || undefined,
        staffType: roleFilter === 'ALL' ? undefined : roleFilter,
        tab: viewToTab[activeView],
        fromDate: activeView !== 'TODAY' ? filterDate : undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'fromDate',
        sortDir: 'DESC',
      });
      setRequests(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setRequests([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeView, roleFilter, filterDate, currentPage]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeView, roleFilter, filterDate]);

  const handleProcessLeave = async (action: string, reason: string) => {
    if (!selectedRequest) return;
    try {
      await staffApi.reviewLeaveRequest(
        selectedRequest.leaveId,
        action as 'APPROVED' | 'REJECTED',
        reason || undefined
      );
      fetchRequests();
    } catch {
      // toast is already handled inside axios or handle error here if needed
    }
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Nghỉ phép & Điểm danh" description="Quản lý đơn xin nghỉ phép của nhân viên." />
      </div>

      <LeaveRequestsFilterBar
        activeView={activeView}
        setActiveView={setActiveView}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
      />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách...</div>
      ) : (
        <LeaveRequestsTable
          data={requests}
          onAction={setSelectedRequest}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      )}

      <ActionReasonDialog
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onConfirm={handleProcessLeave}
        title="Duyệt Đơn Xin Nghỉ"
        description={`Kiểm tra đơn xin nghỉ của ${selectedRequest?.fullName}.`}
        actorLabel="Quyết định"
        actorOptions={[{ label: 'Duyệt đơn', value: 'APPROVED' }, { label: 'Từ chối đơn', value: 'REJECTED' }]}
        reasonLabel="Ghi chú của Quản trị viên"
        confirmColor="blue"
        confirmText="Lưu quyết định"
      />
    </div>
  );
}
