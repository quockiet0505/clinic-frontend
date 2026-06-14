import React from 'react';
import { Activity, Stethoscope, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { MedicalRecord } from '../types/medical';
import { formatDateTime } from '@/utils/formatters';

interface Props {
  data: MedicalRecord[];
  onConsult: (id: number) => void;
}

export default function ActiveVisitsTable({ data, onConsult }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có lượt khám đang chờ.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[10%]">Số thứ tự</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[18%]">Ngày & Mã HSBA</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Bệnh nhân</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Bác sĩ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[12%]">Sinh hiệu</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[12%]">Trạng thái</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[13%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((visit) => (
            <TableRow key={visit.recordId} className="hover:bg-slate-50 border-b border-slate-100">
              <TableCell className="px-6 py-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
                  {visit.queueNumber?.toString().padStart(2, '0') || '--'}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDateTime(visit.createdAt)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">#REC-{visit.recordId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="font-medium text-slate-800">{visit.patientName}</p>
                <p className="text-xs text-slate-500">Vào lúc: {visit.checkinTime || '—'}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Stethoscope size={14} className="text-blue-500" />
                  <span className="text-slate-700">{visit.doctorName}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                {visit.vitalsTaken ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 px-2 py-0.5 text-xs font-medium">
                    <Activity size={12} className="inline mr-1" /> Đã ghi
                  </Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-700 border-0 px-2 py-0.5 text-xs font-medium">
                    Chưa ghi
                  </Badge>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <StatusBadge status={visit.status} />
              </TableCell>
              <TableCell className="px-6 py-4">
                <Button
                  onClick={() => onConsult(visit.recordId)}
                  size="sm"
                  className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
                >
                  Khám <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}