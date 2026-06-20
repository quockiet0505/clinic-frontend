import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { LeaveRequest } from '../types/staff';
import { PaginationProps } from '@/components/tables/Table';

interface Props {
  data: LeaveRequest[];
  onAction: (req: LeaveRequest) => void;
  pagination?: PaginationProps;
}

export default function LeaveRequestsTable({ data, onAction, pagination }: Props) {
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.size) : 1;
  const start = pagination ? (pagination.page - 1) * pagination.size : 0;
  const end = pagination ? start + data.length : data.length;

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-6 h-12">Nhân viên</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Thời gian nghỉ</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Lý do</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-left">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-left w-[15%]">Thao tác</TableHead>
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
              <TableCell className="">
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
      {pagination && totalPages > 1 && (
        <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50/50">
          <div className="text-sm text-slate-500">
            Hiển thị <span className="font-medium text-slate-700">{start + 1}</span> –{' '}
            <span className="font-medium text-slate-700">{Math.min(end, pagination.total)}</span> /{' '}
            <span className="font-medium text-slate-700">{pagination.total}</span> kết quả
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-lg border border-slate-200 bg-white text-slate-500 transition-all ${
                pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:text-slate-700 cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-slate-700">
              {pagination.page} / {totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className={`p-2 rounded-lg border border-slate-200 bg-white text-slate-500 transition-all ${
                pagination.page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:text-slate-700 cursor-pointer'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}