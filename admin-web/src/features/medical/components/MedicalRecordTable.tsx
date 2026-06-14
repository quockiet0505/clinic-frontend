import React from 'react';
import { Eye, Stethoscope, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { MedicalRecord } from '../types/medical';
import { formatDateTime } from '@/utils/formatters';
import { ViewButton } from '@/components/common/ActionButtons';

interface Props {
  data: MedicalRecord[];
  onViewDetail: (id: number) => void;
}

export default function MedicalRecordTable({ data, onViewDetail }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có hồ sơ bệnh án nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[18%]">Ngày & Mã HSBA</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Bệnh nhân</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[35%]">Chẩn đoán & Bác sĩ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[12%]">Trạng thái</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((rec) => (
            <TableRow key={rec.recordId} className="hover:bg-slate-50 border-b border-slate-100">
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDateTime(rec.createdAt)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">#REC-{rec.recordId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="font-medium text-slate-800">{rec.patientName}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="text-slate-800 font-medium">{rec.diagnosis}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Stethoscope size={12} className="text-blue-500" />
                  <span className="text-xs text-slate-500">{rec.doctorName}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <StatusBadge status={rec.status} />
              </TableCell>
              <TableCell className="px-6 py-4">
                <ViewButton onClick={() => onViewDetail(rec.recordId)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}