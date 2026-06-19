import React from 'react';
import { Activity, Stethoscope, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import { MedicalRecord } from '../types/medical';
import { formatDateTime } from '@/utils/formatters';

interface Props {
  data: MedicalRecord[];
  onConsult: (id: number) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

export default function ActiveVisitsTable({ data, onConsult, loading = false, pagination }: Props) {
  const columns: Column<MedicalRecord>[] = [
    {
      key: 'queueNumber',
      label: 'Số thứ tự',
      className: 'w-[10%]',
      render: (visit) => (
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
          {visit.queueNumber?.toString().padStart(2, '0') || '--'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày & Mã HSBA',
      className: 'w-[18%]',
      render: (visit) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {formatDateTime(visit.createdAt)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">#REC-{visit.recordId}</p>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      className: 'w-[20%]',
      render: (visit) => (
        <div>
          <p className="font-medium text-slate-800">{visit.patientName}</p>
          <p className="text-xs text-slate-500">Vào lúc: {visit.checkinTime || '—'}</p>
        </div>
      ),
    },
    {
      key: 'doctorName',
      label: 'Bác sĩ',
      className: 'w-[15%]',
      render: (visit) => (
        <div className="flex items-center gap-2">
          <Stethoscope size={14} className="text-blue-500" />
          <span className="text-slate-700">{visit.doctorName}</span>
        </div>
      ),
    },
    {
      key: 'vitalsTaken',
      label: 'Sinh hiệu',
      className: 'w-[12%]',
      render: (visit) =>
        visit.vitalsTaken ? (
          <Badge className="bg-emerald-100 text-emerald-700 border-0 px-2 py-0.5 text-xs font-medium">
            <Activity size={12} className="inline mr-1" /> Đã ghi
          </Badge>
        ) : (
          <Badge className="bg-rose-100 text-rose-700 border-0 px-2 py-0.5 text-xs font-medium">Chưa ghi</Badge>
        ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[12%]',
      render: (visit) => <StatusBadge status={visit.status} />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[13%]',
      render: (visit) => (
        <Button onClick={() => onConsult(visit.recordId)} size="sm" className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm">
          Khám <ArrowRight size={14} className="ml-1.5" />
        </Button>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có lượt khám đang chờ."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
