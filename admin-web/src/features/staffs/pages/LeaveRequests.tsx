import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import CustomSelect from '@/components/common/CustomSelect';
import LeaveRequestsFilterBar from '../components/LeaveRequestsFilterBar';
import LeaveRequestsTable from '../components/LeaveRequestsTable';
import { LeaveRequest } from '../types/staff';
import { staffApi } from '../api/staffApi';

const TODAY = new Date().toISOString().split('T')[0];

export default function LeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    staffApi.getLeaveRequests().then(data => {
      setRequests(data);
      setLoading(false);
    });
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('TODAY');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [filterDate, setFilterDate] = useState(TODAY); 
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const handleProcessLeave = (action: string, reason: string) => {
    setRequests(requests.map(req => req.leaveId === selectedRequest?.leaveId ? { ...req, status: action as any, approvedBy: 'System Admin', rejectionReason: reason } : req));
    setSelectedRequest(null);
  };

  const filteredData = requests.filter(req => {
    const matchSearch = req.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'ALL' || req.staffType === roleFilter;
    let matchView = false;
    let matchDate = true;

    if (activeView === 'TODAY') matchView = req.status === 'APPROVED' && req.fromDate <= TODAY && req.toDate >= TODAY;
    else if (activeView === 'PENDING') { matchView = req.status === 'PENDING'; if (filterDate) matchDate = req.toDate >= filterDate; }
    else if (activeView === 'PROCESSED') { matchView = req.status !== 'PENDING'; if (filterDate) matchDate = req.toDate >= filterDate; }

    return matchSearch && matchRole && matchView && matchDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Nghỉ phép & Điểm danh" description="Quản lý đơn xin nghỉ phép của nhân viên." />
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <CustomSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-11 sm:w-48">
            <option value="ALL">Tất cả vai trò</option><option value="DOCTOR">Bác sĩ</option><option value="STAFF">Nhân viên</option><option value="LAB_TECH">Kỹ thuật viên</option>
          </CustomSelect>
          {activeView !== 'TODAY' && (
            <div className="flex items-center gap-2 bg-white rounded-[16px] border border-input px-3 h-11 shadow-sm focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all duration-200 ease-out">
              <CalendarDays size={16} className="text-slate-400" /><span className="text-sm font-medium text-slate-700">Từ ngày:</span>
              <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="h-8 border-0 bg-transparent p-0 font-medium text-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer" />
            </div>
          )}
        </div>
      </div>

      <LeaveRequestsFilterBar activeView={activeView} setActiveView={setActiveView} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách...</div>
      ) : (
        <LeaveRequestsTable data={filteredData} onAction={setSelectedRequest} />
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