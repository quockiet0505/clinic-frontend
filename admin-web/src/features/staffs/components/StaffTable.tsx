import React from 'react';
import { Edit2, Trash2, Mail, Phone, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Staff } from '../types/staff';
import { getRoleIcon } from './StaffFilterBar';
import { getImageUrl } from '@/utils/image';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';

interface Props {
  data: Staff[];
  onEdit: (s: Staff) => void;
  onDelete: (s: Staff) => void;
}

export default function StaffTable({ data, onEdit, onDelete }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có nhân viên nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      {/* Thêm table-fixed để ép độ rộng cột theo width khai báo */}
      <Table className="min-w-[900px] table-fixed">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[35%]">Nhân viên</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Liên hệ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Vai trò & Chuyên môn</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[10%]">Đánh giá</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((staff) => (
            <TableRow key={staff.staffId} className="hover:bg-slate-50 border-b border-slate-100">
              {/* Cột Nhân viên - dùng flex-1 + truncate để vừa với 35% */}
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  {staff.imageUrl ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img
                        src={getImageUrl(staff.imageUrl)}
                        alt="avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = staff.fullName.charAt(0).toUpperCase();
                            parent.classList.add('bg-slate-100', 'text-slate-600', 'flex', 'items-center', 'justify-center', 'font-bold');
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                      staff.staffType === 'DOCTOR' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {staff.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 text-sm truncate" title={staff.fullName}>
                      {staff.fullName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">ID: {staff.staffId}</p>
                  </div>
                </div>
              </TableCell>

              {/* Cột Liên hệ - xử lý truncate và icon màu xanh dương */}
              <TableCell className="px-6 py-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <Mail size={14} className={'shrink-0 text-blue-500'} />
                    <span className="text-slate-700 truncate" title={staff.email || ''}>
                      {staff.email || 'Chưa có email'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <Phone size={14} className={'shrink-0 text-blue-500'} />
                    <span className="text-slate-700 truncate" title={staff.phone || ''}>
                      {staff.phone || 'Chưa có số điện thoại'}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Cột Vai trò & Chuyên môn */}
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-1.5">
                  <Badge variant="secondary" className={`w-fit font-semibold rounded-lg text-[11px] px-2 py-0.5 uppercase ${
                    staff.staffType === 'DOCTOR' ? 'bg-blue-100 text-blue-700' :
                    staff.staffType === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    staff.staffType === 'LAB_TECH' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {getRoleIcon(staff.staffType)}
                    {staff.staffType === 'DOCTOR' ? 'Bác sĩ' : staff.staffType === 'STAFF' ? 'Nhân viên' : staff.staffType === 'LAB_TECH' ? 'Kỹ thuật viên' : 'Quản trị viên'}
                  </Badge>
                  {staff.staffType === 'DOCTOR' && staff.expertiseName && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate max-w-[160px]" title={staff.expertiseName}>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                      {staff.expertiseName}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Cột Đánh giá */}
              <TableCell className="px-6 py-4">
                {staff.staffType === 'DOCTOR' ? (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-medium text-slate-700">{staff.rating ? staff.rating.toFixed(1) : '—'}</span>
                  </div>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </TableCell>

              {/* Cột Thao tác */}
              <TableCell className="px-6 py-4">
                <div className="flex gap-2">
                  <EditButton onClick={() => onEdit(staff)} />
                  <DeleteButton onClick={() => onDelete(staff)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}