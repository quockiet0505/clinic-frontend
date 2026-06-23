import React from 'react';
import { Stethoscope, Calendar } from 'lucide-react';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import { MedicalRecord } from '../types/medical';
import { formatDateTime } from '@/utils/formatters';
import { ViewButton } from '@/components/common/ActionButtons';

interface Props {
  data: MedicalRecord[];
  onViewDetail: (id: number) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

export default function MedicalRecordTable({ data, onViewDetail, loading = false, pagination }: Props) {
  const columns: Column<MedicalRecord>[] = [
    {
      key: 'createdAt',
      label: 'Ngày & Mã HSBA',
      className: 'w-[18%]',
      render: (rec) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {formatDateTime(rec.createdAt)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">#REC-{rec.recordId}</p>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      className: 'w-[20%]',
      render: (rec) => <p className="font-medium text-slate-800">{rec.patientName}</p>,
    },
    {
      key: 'diagnosis',
      label: 'Chẩn đoán & Bác sĩ',
      className: 'w-[35%]',
      render: (rec) => (
        <div>
          <p className="text-slate-800 font-medium">{rec.diagnosis}</p>
          <div className="flex items-center gap-2 mt-1">
            <Stethoscope size={12} className="text-blue-500" />
            <span className="text-xs text-slate-500">{rec.mainDoctorName || 'Chưa phân công'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[12%]',
      render: (rec) => <StatusBadge status={rec.status} />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[15%]',
      render: (rec) => <ViewButton onClick={() => onViewDetail(rec.recordId)} />,
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có hồ sơ bệnh án nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
