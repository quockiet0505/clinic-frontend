import React from 'react';
import { Clock, Globe, UserRound, Calendar } from 'lucide-react';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import { Appointment } from '../types/appointment';
import { formatDateTime } from '@/utils/formatters';
import { CheckInButton, CancelButton } from '@/components/common/ActionButtons';

interface Props {
  data: Appointment[];
  onCheckIn: (id: number) => void;
  onCancel: (apt: Appointment) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function AppointmentTable({ data, onCheckIn, onCancel, loading = false, pagination }: Props) {
  const columns: Column<Appointment>[] = [
    {
      key: 'appointmentType',
      label: 'Nguồn',
      className: 'w-[8%]',
      render: (item) =>
        item.appointmentType === 'ONLINE' ? (
          <Globe size={20} className="text-indigo-600" />
        ) : (
          <UserRound size={20} className="text-slate-400" />
        ),
    },
    {
      key: 'appointmentDate',
      label: 'Ngày & ID',
      className: 'w-[18%]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {formatDateTime(item.appointmentDate)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">#APT-{item.appointmentId}</p>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      className: 'w-[20%]',
      render: (item) => (
        <div>
          <p className="font-medium text-slate-800">{item.patientName}</p>
          <p className="text-xs text-slate-500 mt-0.5">ID: PAT-{item.patientId}</p>
        </div>
      ),
    },
    {
      key: 'timeStart',
      label: 'Lịch khám & Bác sĩ',
      className: 'w-[25%]',
      render: (item) => (
        <div>
          <div className="flex items-center gap-1 text-sm text-slate-700">
            <Clock size={14} className="text-blue-500" />
            <span>
              {item.appointmentDate} • {item.timeStart?.substring(0, 5)}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">{item.doctorName}</p>
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
          {item.status === 'CANCELLED' && item.cancelReason && (
            <p className="text-xs text-rose-500 mt-1 truncate max-w-[150px]" title={item.cancelReason}>
              {item.cancelReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[20%]',
      render: (item) => (
        <div className="flex gap-2">
          {['PENDING', 'CONFIRMED'].includes(item.status) && (
            <CheckInButton onClick={() => onCheckIn(item.appointmentId)} />
          )}
          {!['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(item.status) && (
            <CancelButton onClick={() => onCancel(item)} />
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có lịch hẹn nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}