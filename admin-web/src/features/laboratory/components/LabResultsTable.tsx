import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ServiceResult } from '../types/laboratory';
import { formatDateTime } from '@/utils/formatters';
import { ViewResultButton } from '@/components/common/ActionButtons';

interface Props {
  data: ServiceResult[];
  onViewResult: (result: ServiceResult) => void;
}

export default function LabResultsTable({ data, onViewResult }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có kết quả xét nghiệm nào.</p>
      </div>
    );
  }

  // Helper để hiển thị tên bác sĩ không bị trùng "BS."
  const formatDoctorName = (name: string) => {
    if (!name) return '';
    return name.startsWith('BS.') ? name : `${name}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[18%]">Kết quả ID & Ngày</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[22%]">Bệnh nhân / Bác sĩ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[45%]">Xét nghiệm & Kết luận</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((res) => (
            <TableRow key={res.resultId} className="hover:bg-slate-50 border-b border-slate-100">
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDateTime(res.enteredAt)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">#RES-{res.resultId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="font-medium text-slate-800">{res.patientName}</p>
                <p className="text-xs text-slate-500">{formatDoctorName(res.doctorName)}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-slate-400 shrink-0" />
                  <span className="text-slate-700 truncate" title={res.serviceName}>{res.serviceName}</span>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className={`border-0 px-2 py-0.5 text-xs font-semibold ${
                    res.conclusion.toLowerCase().includes('bất thường') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {res.conclusion}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <ViewResultButton onClick={() => onViewResult(res)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}