// features/laboratory/components/LabResultsTable.tsx
import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Table, { Column } from '@/components/tables/Table';
import { ServiceResult } from '../types/laboratory';
import { formatDateTime } from '@/utils/formatters';
import { ViewResultButton } from '@/components/common/ActionButtons';

interface Props {
  data: ServiceResult[];
  onViewResult: (result: ServiceResult) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

const formatDoctorName = (name: string) => {
  if (!name) return '';
  return name.startsWith('BS.') ? name : `${name}`;
};

export default function LabResultsTable({ data, onViewResult, loading = false, pagination }: Props) {
  const columns: Column<ServiceResult>[] = [
    {
      key: 'resultId',
      label: 'Kết quả ID & Ngày',
      className: 'w-[18%]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {formatDateTime(item.enteredAt)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">#RES-{item.resultId}</p>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân / Bác sĩ',
      className: 'w-[25%]',
      render: (item) => (
        <div>
          <p className="font-medium text-slate-800">{item.patientName}</p>
          <p className="text-xs text-slate-500">BS: {formatDoctorName(item.doctorName)}</p>
          {item.enteredByName && <p className="text-xs text-primary-600 mt-0.5 font-medium">KTV: {item.enteredByName}</p>}
        </div>
      ),
    },
    {
      key: 'serviceName',
      label: 'Xét nghiệm & Kết luận',
      className: 'w-[38%]',
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-700 truncate" title={item.serviceName}>{item.serviceName}</span>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className={`border-0 px-2 py-0.5 text-xs font-semibold ${item.conclusion.toLowerCase().includes('bất thường') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
              {item.conclusion}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[15%] text-right',
      render: (item) => <ViewResultButton onClick={() => onViewResult(item)} />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-hidden">
      <Table
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="Không có kết quả xét nghiệm nào."
        maxHeight="100%"
        pagination={pagination}
        rowClassName="hover:bg-slate-50 border-b border-slate-100"
      />
    </div>
  );
}