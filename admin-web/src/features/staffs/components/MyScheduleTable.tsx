import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/badge';

interface LeaveRow {
  leaveId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
  status: string;
}

interface MyScheduleTableProps {
  data: LeaveRow[];
  onCancelRequest: (id: number) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

const getLeaveTypeLabel = (type: string) => {
  if (type === 'SICK') return 'Nghỉ ốm';
  if (type === 'ANNUAL') return 'Nghỉ phép năm';
  if (type === 'UNPAID') return 'Nghỉ không lương';
  return 'Nghỉ khác';
};

export default function MyScheduleTable({ data, onCancelRequest, loading = false, pagination }: MyScheduleTableProps) {
  const columns: Column<LeaveRow>[] = [
    {
      key: 'leaveType',
      label: 'Loại nghỉ',
      className: 'w-[18%]',
      render: (leave) => (
        <Badge
          variant="outline"
          className="inline-flex items-center font-semibold px-2 py-0.5 rounded-md border text-[11px] whitespace-nowrap bg-slate-50 text-slate-700 border-slate-200"
        >
          {getLeaveTypeLabel(leave.leaveType)}
        </Badge>
      ),
    },

    {
      key: 'fromDate',
      label: 'Thời gian nghỉ',
      className: 'w-[20%]',
      render: (leave) => (
        <div>
          <p className="text-sm font-medium text-slate-800">{leave.fromDate}</p>
          <p className="text-xs text-slate-400 mt-0.5">Đến: {leave.toDate}</p>
        </div>
      ),
    },
    {
      key: 'reason',
      label: 'Lý do',
      className: 'w-[32%]',
      render: (leave) => (
        <p className="text-sm text-slate-600 truncate max-w-[280px]" title={leave.reason}>
          {leave.reason || '—'}
        </p>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[15%]',
      render: (leave) => <StatusBadge status={leave.status} />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[15%]',
      render: (leave) =>
        leave.status === 'PENDING' ? (
          <Button
            onClick={() => onCancelRequest(leave.leaveId)}
            variant="outline"
            className="h-8 px-3 rounded-lg text-xs font-medium border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={14} className="mr-1.5" /> Hủy đơn
          </Button>
        ) : null,
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có đơn xin nghỉ nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
