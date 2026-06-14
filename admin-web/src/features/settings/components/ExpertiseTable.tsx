import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Expertise } from '../types/settings';
import { getImageUrl } from '@/utils/image';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';

interface Props {
  data: Expertise[];
  onDelete: (id: number) => void;
  onEdit: (item: Expertise) => void;
}

export default function ExpertiseTable({ data, onDelete, onEdit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[650px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[35%]">Tên chuyên khoa</TableHead>
            <TableHead className="px-4 py-3 text-left font-semibold text-slate-700 w-[20%]">Biểu tượng</TableHead>
            <TableHead className="px-4 py-3 text-left font-semibold text-slate-700 w-[25%]">Ngày tạo</TableHead>
            <TableHead className="px-4 py-3 text-left font-semibold text-slate-700 w-[20%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.expertiseId} className="hover:bg-slate-50 border-b border-slate-100">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {item.expertiseName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{item.expertiseName}</p>
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                Không tìm thấy chuyên khoa nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}