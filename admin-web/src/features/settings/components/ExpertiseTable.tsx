import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Expertise } from '../types/settings';
import { getImageUrl } from '@/utils/image';

interface Props {
  data: Expertise[];
  onDelete: (id: number) => void;
  onEdit: (item: Expertise) => void;
}

export default function ExpertiseTable({
  data,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14 border-b border-slate-200 hover:bg-transparent">
            <TableHead className="w-[40%] px-8 font-bold text-slate-600 uppercase tracking-widest text-[10px]">
              Tên chuyên khoa
            </TableHead>
            <TableHead className="w-[20%] font-bold text-slate-600 uppercase tracking-widest text-[10px]">
              Biểu tượng
            </TableHead>
            <TableHead className="w-[20%] font-bold text-slate-600 uppercase tracking-widest text-[10px]">
              Ngày tạo
            </TableHead>
            <TableHead className="w-[20%] text-center font-bold text-slate-600 uppercase tracking-widest text-[10px]">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow
                key={item.expertiseId}
                className="hover:bg-slate-50/50 transition-colors border-slate-100"
              >
                <TableCell className="px-8 py-5 align-middle">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shrink-0">
                      {item.expertiseName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 text-[15px] truncate" title={item.expertiseName}>
                        {item.expertiseName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        EXP-{item.expertiseId}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="align-middle">
                  <div className="flex items-center">
                    {item.iconUrl ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                        <img src={getImageUrl(item.iconUrl)} alt="icon" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-400 italic truncate block max-w-[100px]">
                        Chưa có icon
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="align-middle">
                  <span className="text-sm font-bold text-slate-600 whitespace-nowrap">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </TableCell>

                <TableCell className="text-center align-middle">
                  <div className="flex justify-center items-center gap-2">
                    <Button onClick={() => onEdit(item)} variant="outline" size="sm" className="flex items-center gap-1.5 h-9 px-4 rounded-xl border-primary-200 text-primary-600 hover:bg-primary-50">
                      <Edit size={14} /><span>Sửa</span>
                    </Button>
                    <Button onClick={() => onDelete(item.expertiseId)} variant="outline" size="sm" className="flex items-center gap-1.5 h-9 px-4 rounded-xl border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 size={14} /><span>Xóa</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium align-middle">
                Không tìm thấy chuyên khoa nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}