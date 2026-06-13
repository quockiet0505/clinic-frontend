import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import CustomSelect from '@/components/common/CustomSelect';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { LeaveRequest } from '../types/staff';
import LeaveApplicationDialog from '../components/LeaveApplicationDialog';
import { staffApi } from '../api/staffApi';

const TODAY = new Date().toISOString().split('T')[0];

export default function MySchedule() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  
  useEffect(() => {
    staffApi.getLeaveRequests().then(data => setLeaves(data));
  }, []);
  
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredLeaves = leaves.filter(l => 
    (statusFilter === 'ALL' || l.status === statusFilter) &&
    (!fromDate || l.fromDate >= fromDate) &&
    (!toDate || l.toDate <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Nghỉ Phép Của Tôi" description="Quản lý đơn xin nghỉ phép và lịch sử nghỉ phép." actionText="Nộp Đơn Xin Nghỉ" onAction={() => setIsApplyOpen(true)} />
      
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm shrink-0">
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
        <CustomSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 sm:w-40">
          <option value="ALL">Tất cả</option><option value="PENDING">Chờ duyệt</option><option value="APPROVED">Đã duyệt</option><option value="REJECTED">Từ chối</option>
        </CustomSelect>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="h-14">
              <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Loại nghỉ & Thời gian</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Lý do</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaves.map((leave) => (
              <TableRow key={leave.leaveId} className="hover:bg-slate-50/50">
                <TableCell className="px-8 py-4">
                  <p className="font-bold text-slate-900">{leave.leaveType === 'SICK' ? 'Nghỉ ốm' : leave.leaveType === 'ANNUAL' ? 'Nghỉ phép năm' : 'Nghỉ khác'}</p>
                  <p className="text-xs font-medium text-slate-500">{leave.fromDate} đến {leave.toDate}</p>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-600 max-w-xs truncate">{leave.reason}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`font-medium px-2.5 py-1 border-0 ${leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : leave.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {leave.status === 'APPROVED' ? 'Đã duyệt' : leave.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-8">
                  {leave.status === 'PENDING' && (
                    <Button onClick={() => setCancelId(leave.leaveId)} variant="outline" size="sm" className="h-9 px-3 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50 cursor-pointer gap-2">
                      <Trash2 size={16}/> Hủy đơn
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LeaveApplicationDialog isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} onSubmit={() => setIsApplyOpen(false)} />
      <ConfirmDialog isOpen={!!cancelId} onClose={() => setCancelId(null)} onConfirm={() => { setLeaves(leaves.filter(l => l.leaveId !== cancelId)); setCancelId(null); }} title="Hủy Đơn Xin Nghỉ" description="Bạn có chắc chắn muốn hủy đơn xin nghỉ này không?" confirmText="Xác nhận hủy" />
    </div>
  );
}