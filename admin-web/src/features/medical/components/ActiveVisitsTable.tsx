import React from 'react';
import { Activity, Stethoscope, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import QueueNumberCell from '@/components/common/QueueNumberCell';
import { MedicalRecord } from '../types/medical';
import { formatDateTime } from '@/utils/formatters';

interface Props {
  data: MedicalRecord[];
  onConsult?: (id: number) => void;
  onTriage?: (id: number) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

export default function ActiveVisitsTable({ data, onConsult, onTriage, loading = false, pagination }: Props) {
  const columns: Column<MedicalRecord>[] = [
    {
      key: 'queueNumber',
      label: 'STT',
      className: 'w-[12%]',
      render: (visit) => <QueueNumberCell queueNumber={visit.queueNumber} />,
    },
    {
      key: 'createdAt',
      label: 'Ngày & Mã HSBA',
      className: 'w-[20%]',
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
      key: 'patientInfo',
      label: 'Thông tin khám',
      className: 'w-[23%]',
      render: (visit) => (
        <div className="flex flex-col gap-1.5">
          <p className="font-bold text-slate-800 text-[14px]">{visit.patientName}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
              <Stethoscope size={12} className="text-blue-600 shrink-0" />
              <span className="truncate">{visit.mainDoctorName || 'Chưa phân công'}</span>
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'vitalsTaken',
      label: 'Sinh hiệu',
      className: 'w-[14%]',
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
      className: 'w-[14%]',
      render: (visit) => <StatusBadge status={visit.status} />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[17%]',
      render: (visit) => {
        if (onTriage) {
          const isVitalsTaken = visit.vitalsTaken;
          return (
            <Button
              onClick={() => onTriage(visit.recordId)}
              disabled={isVitalsTaken}
              size="sm"
              className={`h-9 px-4 rounded-xl text-white font-medium text-sm transition-all ${
                isVitalsTaken
                  ? 'bg-slate-150 text-slate-450 border-slate-200 pointer-events-none'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isVitalsTaken ? 'Đã đo sinh hiệu' : 'Đo hiệu sinh'}
              {!isVitalsTaken && <ArrowRight size={14} className="ml-1.5" />}
            </Button>
          );
        }
        if (onConsult) {
          return (
            <Button
              onClick={() => onConsult(visit.recordId)}
              size="sm"
              className="h-9 px-4 rounded-xl font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              Khám <ArrowRight size={14} className="ml-1.5" />
            </Button>
          );
        }
        return null;
      },
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
