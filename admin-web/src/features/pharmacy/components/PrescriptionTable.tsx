import React from 'react';
import { Calendar } from 'lucide-react';
import Table, { Column } from '@/components/tables/Table';
import { ViewButton } from '@/components/common/ActionButtons';
import { PrescriptionUI } from '../types/pharmacy';
import { formatDateTime } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface Props {
  data: PrescriptionUI[];
  onViewDetails: (id: number) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

export default function PrescriptionTable({ data, onViewDetails, loading = false, pagination }: Props) {
  const columns: Column<PrescriptionUI>[] = [
    {
      key: 'prescriptionInfo',
      label: 'Mã đơn & Thời gian',
      className: 'w-[15%]',
      render: (rx) => (
        <div>
          <p className="text-[13px] font-medium text-slate-700 flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" />
            {formatDateTime(rx.createdAt)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            #RX-{String(rx.prescriptionId).padStart(5, '0')}
          </p>
        </div>
      ),
    },
    {
      key: 'patientInfo',
      label: 'Bệnh nhân & Chẩn đoán',
      className: 'w-[30%]',
      render: (rx) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
            {rx.patientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm leading-tight">{rx.patientName}</p>
            <p className="text-[12px] text-slate-500 mt-0.5 truncate max-w-[200px]" title={rx.diagnosis || 'Chưa có chẩn đoán'}>
              {rx.diagnosis || 'Chưa ghi nhận chẩn đoán'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'doctorInfo',
      label: 'Bác sĩ & Toa thuốc',
      className: 'w-[25%]',
      render: (rx) => (
        <div>
          <p className="font-medium text-slate-700 text-sm">{rx.doctorName}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">{rx.items?.length || 0} loại thuốc</span>
          </p>
        </div>
      ),
    },

    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[15%] text-left',
      render: (rx) => (
        <ViewButton onClick={() => onViewDetails(rx.prescriptionId)} />
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
