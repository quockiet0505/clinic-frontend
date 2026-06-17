import React from 'react';
import { Eye, FileText, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PrescriptionUI } from '../types/pharmacy';
import { formatDateTime } from '@/utils/formatters'; // Import hàm định dạng thời gian

interface Props {
  data: PrescriptionUI[];
  onViewDetails: (id: number) => void;
}

export default function PrescriptionTable({ data, onViewDetails }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium text-sm">Không có đơn thuốc nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto custom-scrollbar">
      <Table className="min-w-[900px]">
        <TableHeader className="bg-slate-100/80 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%] text-sm">Mã Đơn</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%] text-sm">Bệnh nhân</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%] text-sm">Bác sĩ kê đơn</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%] text-sm">Trạng thái</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%] text-sm">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((rx) => (
            <TableRow key={rx.prescriptionId} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
              <TableCell className="px-6 py-4">
                {/* Ngày ở trên, mã ở dưới */}
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDateTime(rx.createdAt)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">#RX-{rx.prescriptionId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {rx.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{rx.patientName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">BA: #{rx.recordId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="font-medium text-slate-700 text-sm">BS. {rx.doctorName}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                {rx.status === 'PENDING' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                    <Clock size={12} /> Chờ phát thuốc
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 size={12} /> Đã phát
                  </span>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <Button onClick={() => onViewDetails(rx.prescriptionId)} variant="outline" className="h-8 px-4 rounded-xl text-xs font-semibold border-blue-200 text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                  <Eye size={14} className="mr-1.5" /> Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}