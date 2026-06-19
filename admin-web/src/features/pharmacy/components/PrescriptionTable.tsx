import React from 'react';
import { Eye, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Table, { Column } from '@/components/tables/Table';
import { PrescriptionUI } from '../types/pharmacy';
import { formatDateTime } from '@/utils/formatters';

interface Props {
  data: PrescriptionUI[];
  onViewDetails: (id: number) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

export default function PrescriptionTable({ data, onViewDetails, loading = false, pagination }: Props) {
  const columns: Column<PrescriptionUI>[] = [
    {
      key: 'prescriptionId',
      label: 'Mã Đơn',
      className: 'w-[15%]',
      render: (rx) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {formatDateTime(rx.createdAt)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">#RX-{rx.prescriptionId}</p>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      className: 'w-[25%]',
      render: (rx) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
            {rx.patientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{rx.patientName}</p>
            <p className="text-xs text-slate-500 mt-0.5">BA: #{rx.recordId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'doctorName',
      label: 'Bác sĩ kê đơn',
      className: 'w-[25%]',
      render: (rx) => <p className="font-medium text-slate-700 text-sm">BS. {rx.doctorName}</p>,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[15%]',
      render: (rx) =>
        rx.status === 'PENDING' ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock size={12} /> Chờ phát thuốc
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={12} /> Đã phát
          </span>
        ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[20%]',
      render: (rx) => (
        <Button onClick={() => onViewDetails(rx.prescriptionId)} variant="outline" className="h-8 px-4 rounded-xl text-xs font-semibold border-blue-200 text-blue-600 hover:bg-blue-50">
          <Eye size={14} className="mr-1.5" /> Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có đơn thuốc nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
