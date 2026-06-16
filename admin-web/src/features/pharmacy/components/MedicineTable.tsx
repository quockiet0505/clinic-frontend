import React from 'react';
import { Edit2, Trash2, Pill, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Medicine } from '../types/pharmacy';

interface Props {
  data: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicine: Medicine) => void;
}

export default function MedicineTable({ data, onEdit, onDelete }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium">Không có dữ liệu thuốc nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto custom-scrollbar">
      <Table className="min-w-[900px]">
        <TableHeader className="bg-slate-100/80 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[30%]">Tên thuốc & Hoạt chất</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Quy cách đóng gói</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[30%]">Cách dùng / Ghi chú</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((medicine) => (
            <TableRow key={medicine.medicineId} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                    <Pill size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[15px]">{medicine.name}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{medicine.activeElement || '—'}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <Package size={14} className="text-slate-400" />
                  {medicine.packingStandard || '—'}
                </div>
                <div className="text-xs text-slate-500 mt-1 pl-5">
                  Đơn vị: <span className="font-semibold text-slate-700">{medicine.unit || '—'}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="text-sm text-slate-600 line-clamp-2" title={medicine.usageNote}>
                  {medicine.usageNote || '—'}
                </p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex gap-2">
                  <Button onClick={() => onEdit(medicine)} variant="outline" className="h-8 px-3 rounded-xl text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                    <Edit2 size={14} className="mr-1.5" /> Sửa
                  </Button>
                  <Button onClick={() => onDelete(medicine)} variant="outline" className="h-8 px-3 rounded-xl text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50 transition-all shadow-sm">
                    <Trash2 size={14} className="mr-1.5" /> Xóa
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}