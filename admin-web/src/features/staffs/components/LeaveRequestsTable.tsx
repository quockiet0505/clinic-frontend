import React from 'react';
import { Calendar, FileText, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import { LeaveRequest } from '../types/staff';

interface Props {
  data: LeaveRequest[];
  onAction: (req: LeaveRequest) => void;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
}

export default function LeaveRequestsTable({ data, onAction, pagination, loading = false }: Props) {
  const columns: Column<LeaveRequest>[] = [
    {
      key: 'fullName',
      label: 'Nhân viên',
      className: 'w-[25%]',
      render: (req) => (
        <div>
          <p className="font-bold text-slate-800 text-[14px] flex items-center gap-1.5">
            <User size={14} className="text-slate-400 shrink-0" />
            {req.fullName}
          </p>
          <p className="text-[10px] text-slate-500 font-bold tracking-wider mt-0.5">
            {req.staffType === 'DOCTOR' ? 'Bác sĩ' : req.staffType === 'RECEPTIONIST' ? 'Tiếp tân' : req.staffType === 'NURSE' ? 'Y tá' : req.staffType === 'LAB_TECH' ? 'Kỹ thuật viên' : 'Quản trị viên'} 
            {' • '} 
            {req.leaveType === 'SICK' ? 'Nghỉ ốm' : req.leaveType === 'ANNUAL' ? 'Nghỉ phép năm' : 'Nghỉ khác'}
          </p>
        </div>
      ),
    },
    {
      key: 'fromDate',
      label: 'Thời gian nghỉ',
      className: 'w-[20%]',
      render: (req) => (
        <div className="text-slate-600 font-medium text-sm flex items-start gap-1.5">
          <Calendar size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span>{req.fromDate}</span>
            <span className="text-slate-400 mx-1">đến</span>
            <span>{req.toDate}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      label: 'Lý do',
      className: 'w-[25%]',
      render: (req) => (
        <div className="text-slate-500 text-sm max-w-[250px] truncate flex items-center gap-1.5" title={req.reason}>
          <FileText size={14} className="text-slate-400 shrink-0" />
          <span>{req.reason}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[15%] text-left',
      render: (req) => <StatusBadge status={req.status} />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[15%] text-left',
      render: (req) => {
        if (req.status === 'PENDING') {
          return (
            <Button
              onClick={() => onAction(req)}
              variant="outline"
              size="sm"
              className="h-8 px-3 font-semibold rounded-[10px] text-blue-600 border-blue-200 hover:bg-blue-50 transition-all cursor-pointer flex items-center gap-1"
            >
              Duyệt đơn <ArrowRight size={12} />
            </Button>
          );
        }
        return (
          <span className="text-xs font-semibold text-slate-450">
            Duyệt bởi: {req.approvedBy || 'Hệ thống'}
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-auto">
        <Table
          data={data}
          columns={columns}
          loading={loading}
          emptyMessage="Không có đơn xin nghỉ nào."
          pagination={pagination}
          rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
        />
      </div>
    </div>
  );
}