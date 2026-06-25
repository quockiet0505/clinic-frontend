import React from 'react';
import { Phone, History, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import { FollowUp } from '../types/appointment';

interface Props {
  data: FollowUp[];
  onLogCall: (fu: FollowUp) => void;
  onSendReminder: (fu: FollowUp) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

export default function FollowUpTable({ data, onLogCall, onSendReminder, loading = false, pagination }: Props) {
  const columns: Column<FollowUp>[] = [
    {
      key: 'patientName',
      label: 'Thông tin bệnh nhân',
      className: 'w-[28%] min-w-[200px]',
      render: (item) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase">
            {item.patientName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-800 truncate" title={item.patientName}>
              {item.patientName}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <Phone size={12} className="text-blue-500 shrink-0" />
              <span className="truncate">{item.phone || '—'}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'note',
      label: 'Chi tiết nhắc nhở',
      className: 'w-[35%]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700">{item.note.split('|')[0]}</p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
            <History size={12} />
            <span>Đến hạn: {item.scheduledDatetime}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[15%]',
      render: (item) => (
        <div>
          <StatusBadge status={item.status} />
          {item.note.includes('| Log:') && (
            <p className="text-xs text-slate-500 mt-1 truncate max-w-[180px]" title={item.note.split('| Log:')[1]}>
              {item.note.split('| Log:')[1]}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[22%] min-w-[160px]',
      render: (item) =>
        item.status === 'PENDING' ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onSendReminder(item)}
              variant="outline"
              title="Gửi thông báo nhắc tái khám"
              className="h-8 w-8 p-0 shrink-0 rounded-lg border-amber-200 text-amber-600 bg-amber-50/50 hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300 focus-visible:ring-amber-200"
            >
              <BellRing size={15} />
            </Button>
            <Button
              onClick={() => onLogCall(item)}
              title="Ghi nhận cuộc gọi"
              className="h-8 px-3 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
            >
              <Phone size={14} className="mr-1.5 shrink-0" />
              Ghi nhận gọi
            </Button>
          </div>
        ) : item.status === 'CONFIRMED' ? (
          <span className="text-xs text-emerald-600 font-medium">Đã xác nhận — chờ đặt lịch</span>
        ) : null,
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có lịch tái khám nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
