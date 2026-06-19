import React from 'react';
import { Mail, SmartphoneNfc, Calendar } from 'lucide-react';
import Table, { Column } from '@/components/tables/Table';
import { AppNotification } from '../types/crm';
import { formatDateTime } from '@/utils/formatters';

interface Props {
  data?: AppNotification[];
  loading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function NotificationTable({
  data = [],
  loading = false,
  pagination,
}: Props) {
  const columns: Column<AppNotification>[] = [
    {
      key: 'sentAt',
      label: 'Ngày gửi',
      className: 'w-[20%]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" /> {formatDateTime(item.sentAt)}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">#NOTIF-{item.notificationId}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Loại',
      className: 'w-[15%]',
      render: (item) =>
        item.type === 'EMAIL' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 font-semibold text-xs uppercase rounded-lg border border-amber-200">
            <Mail size={12} /> Email
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 font-semibold text-xs uppercase rounded-lg border border-indigo-200">
            <SmartphoneNfc size={12} /> Hệ thống
          </span>
        ),
    },
    {
      key: 'accountName',
      label: 'Người nhận',
      className: 'w-[25%]',
      render: (item) => <span className="font-semibold text-slate-800 text-sm">{item.accountName || 'Unknown'}</span>,
    },
    {
      key: 'content',
      label: 'Nội dung thông báo',
      className: 'w-[40%]',
      render: (item) => (
        <span className="text-sm font-medium text-slate-600 truncate block" title={item.content}>
          {item.content}
        </span>
      ),
    },
  ];

  return (
    <div className="h-full w-full">
      <Table
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="Không có thông báo nào."
        pagination={pagination}
        rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
      />
    </div>
  );
}