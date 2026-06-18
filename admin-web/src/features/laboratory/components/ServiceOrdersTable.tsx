// features/laboratory/components/ServiceOrdersTable.tsx
import React from 'react';
import { Calendar, TestTube2, FileText } from 'lucide-react';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import { ServiceOrder } from '../types/laboratory';
import { formatDateTime } from '@/utils/formatters';
import { InputResultButton, CancelButton } from '@/components/common/ActionButtons';

interface Props {
  data: ServiceOrder[];
  onInputResult: (order: ServiceOrder) => void;
  onReject: (order: ServiceOrder) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function ServiceOrdersTable({ data, onInputResult, onReject, loading = false, pagination }: Props) {
  const columns: Column<ServiceOrder>[] = [
    {
      key: 'orderId',
      label: 'Order ID & Ngày',
      className: 'w-[18%]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {formatDateTime(item.createdAt)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">#ORD-{item.orderId}</p>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân / Bác sĩ',
      className: 'w-[20%]',
      render: (item) => (
        <div>
          <p className="font-medium text-slate-800">{item.patientName}</p>
          <p className="text-xs text-slate-500">
            {item.doctorName?.startsWith('BS.') ? item.doctorName : `${item.doctorName}`}
          </p>
        </div>
      ),
    },
    {
      key: 'serviceName',
      label: 'Xét nghiệm',
      className: 'w-[32%]',
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <TestTube2 size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-700 truncate max-w-[280px]" title={item.serviceName}>
              {item.serviceName}
            </span>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-1">HSBA: #{item.recordId}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[15%]',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[25%] text-right',
      render: (item) => (
        <div className="flex justify-end gap-2">
          {item.status === 'ORDERED' ? (
            <>
              <InputResultButton onClick={() => onInputResult(item)} />
              <CancelButton onClick={() => onReject(item)} label="Từ chối" />
            </>
          ) : item.status === 'DONE' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              <FileText size={12} className="text-slate-500" />
              Đã nhập kết quả
            </span>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-hidden">
      <Table
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="Không có đơn xét nghiệm nào."
        maxHeight="100%"
        pagination={pagination}
        rowClassName="hover:bg-slate-50 border-b border-slate-100"
      />
    </div>
  );
}