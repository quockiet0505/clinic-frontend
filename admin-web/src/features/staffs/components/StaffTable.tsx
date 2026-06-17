// features/staff/components/StaffTable.tsx
import React from 'react';
import { Stethoscope, ShieldCheck, TestTube, Briefcase, UserCog, Mail, Phone, Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';
import { Staff } from '../types/staff';

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'DOCTOR': return <Stethoscope size={16} className="text-blue-500" />;
    case 'ADMIN': return <ShieldCheck size={16} className="text-purple-500" />;
    case 'LAB_TECH': return <TestTube size={16} className="text-emerald-500" />;
    case 'STAFF': return <Briefcase size={16} className="text-slate-500" />;
    default: return <UserCog size={16} className="text-slate-400" />;
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'DOCTOR': return 'Bác sĩ';
    case 'ADMIN': return 'Quản trị viên';
    case 'LAB_TECH': return 'Kỹ thuật viên';
    case 'STAFF': return 'Nhân viên';
    default: return role;
  }
};

// Helper hiển thị số sao
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={14} className="fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && (
        <Star size={14} className="fill-amber-400 text-amber-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={14} className="text-slate-200" />
      ))}
      <span className="text-xs font-semibold text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

interface StaffTableProps {
  data: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

export default function StaffTable({ data, onEdit, onDelete }: StaffTableProps) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium text-sm">Không có nhân viên nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto custom-scrollbar">
      <Table className="min-w-[1100px]">
        <TableHeader className="bg-slate-100/80 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[28%] text-sm">Họ tên</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[18%] text-sm">Email</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[12%] text-sm">SĐT</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[12%] text-sm">Chức vụ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%] text-sm">Đánh giá</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%] text-sm">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((staff) => (
            <TableRow key={staff.staffId} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
              <TableCell className="px-6 py-4 max-w-[200px]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {staff.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 text-sm truncate" title={staff.fullName}>
                      {staff.fullName}
                    </p>
                    {staff.expertiseName && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate" title={staff.expertiseName}>
                        {staff.expertiseName}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[140px]" title={staff.email || 'Chưa có email'}>
                    {staff.email || '—'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-700">
                    {staff.phone || '—'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {getRoleIcon(staff.staffType)}
                  <span className="text-sm font-medium text-slate-700">{getRoleLabel(staff.staffType)}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                {staff.staffType === 'DOCTOR' && staff.rating ? (
                  renderStars(staff.rating)
                ) : (
                  <span className="text-sm text-slate-400">—</span>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex gap-2">
                  <EditButton onClick={() => onEdit(staff)} label="Sửa" />
                  <DeleteButton onClick={() => onDelete(staff)} label="Xóa" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}