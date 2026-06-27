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
      className: 'w-[20%]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {item.appointmentDate ? (
              <>
                {formatDateTime(item.appointmentDate).split(' ')[0]} 
                {item.timeStart && <span className="ml-1 text-blue-600 font-bold">({item.timeStart.substring(0,5)} - {item.timeEnd?.substring(0,5)})</span>}
              </>
            ) : (
              formatDateTime(item.createdAt)
            )}
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
      className: 'w-[35%]',
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
      className: 'w-[18%] min-w-[130px]',
      render: (item) => (
        <div className="flex flex-col items-stretch gap-1.5 max-w-[120px] ml-auto">
          {item.status === 'ORDERED' ? (
            <>
              <InputResultButton
                onClick={() => onInputResult(item)}
                label="Kết quả"
                className="h-7 px-2 text-[11px] font-semibold w-full justify-center"
              />
              <CancelButton
                onClick={() => onReject(item)}
                label="Từ chối"
                className="h-7 px-2 text-[11px] font-semibold w-full justify-center"
              />
            </>
          ) : item.status === 'DONE' ? (
            <span className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
              <FileText size={11} />
              Đã nhập
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