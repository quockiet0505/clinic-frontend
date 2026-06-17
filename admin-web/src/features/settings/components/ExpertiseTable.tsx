// features/settings/components/ExpertiseTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Expertise } from '../types/settings';
import { getImageUrl } from '@/utils/image';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';

// Danh sách màu nền đẹp cho icon
const colorPalette = [
  // 'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  // 'bg-purple-100 text-purple-700',
  // 'bg-rose-100 text-rose-700',
  // 'bg-amber-100 text-amber-700',
  // 'bg-indigo-100 text-indigo-700',
  // 'bg-teal-100 text-teal-700',
  // 'bg-pink-100 text-pink-700',
  // 'bg-cyan-100 text-cyan-700',
  // 'bg-lime-100 text-lime-700',
];

const getColor = (index: number) => {
  return colorPalette[index % colorPalette.length];
};

interface Props {
  data: Expertise[];
  onDelete: (id: number) => void;
  onEdit: (item: Expertise) => void;
}

export default function ExpertiseTable({ data, onDelete, onEdit }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium text-sm">Không tìm thấy chuyên khoa nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[700px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%] text-sm">Tên chuyên khoa</TableHead>
            <TableHead className="px-4 py-3 text-left font-semibold text-slate-700 w-[15%] text-sm">Biểu tượng</TableHead>
            <TableHead className="px-4 py-3 text-left font-semibold text-slate-700 w-[15%] text-sm">Số bác sĩ</TableHead>
            <TableHead className="px-4 py-3 text-left font-semibold text-slate-700 w-[20%] text-sm">Ngày tạo</TableHead>
            <TableHead className="px-4 py-3 text-left font-semibold text-slate-700 w-[25%] text-sm">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const colorClass = getColor(index);
            return (
              <TableRow key={item.expertiseId} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center font-bold text-sm shrink-0`}>
                      {item.expertiseName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{item.expertiseName}</p>
                      <p className="text-xs text-slate-400">#{item.expertiseId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {item.iconUrl ? (
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
                      <img src={getImageUrl(item.iconUrl)} alt="icon" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm font-medium text-slate-700">
                  {item.doctorCount ?? 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-slate-500">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex gap-2">
                    <EditButton onClick={() => onEdit(item)} />
                    <DeleteButton onClick={() => onDelete(item.expertiseId)} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}