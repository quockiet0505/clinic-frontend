import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { LeaveRequest } from '../types/staff';

interface Props {
  data: LeaveRequest[];
  onAction: (req: LeaveRequest) => void;
}

export default function LeaveRequestsTable({ data, onAction }: Props) {
  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex-1">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-6 h-12">Nhân viên</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Thời gian nghỉ</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Lý do</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-6">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((req) => (
            <TableRow key={req.leaveId} className="hover:bg-slate-50/50">
              <TableCell className="px-6 py-4">
                <p className="font-bold text-slate-900">{req.fullName}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{req.staffType === 'DOCTOR' ? 'Bác sĩ' : req.staffType === 'STAFF' ? 'Nhân viên' : req.staffType === 'LAB_TECH' ? 'Kỹ thuật viên' : 'Quản trị viên'} • {req.leaveType === 'SICK' ? 'Nghỉ ốm' : req.leaveType === 'ANNUAL' ? 'Nghỉ phép năm' : 'Nghỉ khác'}</p>
              </TableCell>
              <TableCell className="font-medium text-slate-600 text-sm">
                {req.fromDate} <br/> <span className="text-slate-400">đến</span> {req.toDate}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-slate-500 text-sm">{req.reason}</TableCell>
              <TableCell className="text-center"><StatusBadge status={req.status} /></TableCell>
              <TableCell className="text-right pr-6">
                {req.status === 'PENDING' ? (
                  <Button onClick={() => onAction(req)} variant="outline" size="sm" className="h-8 px-3 font-semibold rounded-[10px] text-blue-600 border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">Duyệt đơn</Button>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Người duyệt: {req.approvedBy}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}