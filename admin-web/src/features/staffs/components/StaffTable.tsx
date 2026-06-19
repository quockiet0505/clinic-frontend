// features/staffs/components/StaffTable.tsx
import React from 'react';
import { Mail, Phone, Star } from 'lucide-react';
import Table, { Column } from '@/components/tables/Table';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';
import EntityAvatar from '@/components/common/EntityAvatar';
import { RoleDisplay } from '../utils/roleDisplay';
import { Staff } from '../types/staff';

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={14} className="fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && <Star size={14} className="fill-amber-400 text-amber-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
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
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

export default function StaffTable({ data, onEdit, onDelete, loading = false, pagination }: StaffTableProps) {
  const columns: Column<Staff>[] = [
    {
      key: 'fullName',
      label: 'Họ tên',
      className: 'w-[28%]',
      render: (staff) => (
        <div className="flex items-center gap-3 min-w-0">
          <EntityAvatar name={staff.fullName} imageUrl={staff.imageUrl} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-800 text-sm truncate">{staff.fullName}</p>
            {staff.expertiseName && <p className="text-xs text-slate-500 mt-0.5 truncate">{staff.expertiseName}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      className: 'w-[16%]',
      render: (staff) => (
        <div className="flex items-center gap-1.5 min-w-0">
          <Mail size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700 truncate">{staff.email || '—'}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'SĐT',
      className: 'w-[12%]',
      render: (staff) => (
        <div className="flex items-center gap-1.5">
          <Phone size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700">{staff.phone || '—'}</span>
        </div>
      ),
    },
    {
      key: 'staffType',
      label: 'Chức vụ',
      className: 'w-[14%]',
      noTruncate: true,
      render: (staff) => <RoleDisplay role={staff.staffType} />,
    },
    {
      key: 'rating',
      label: 'Đánh giá',
      className: 'w-[15%]',
      render: (staff) =>
        staff.staffType === 'DOCTOR' && staff.rating ? renderStars(staff.rating) : <span className="text-sm text-slate-400">—</span>,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[15%]',
      render: (staff) => (
        <div className="flex gap-2">
          <EditButton onClick={() => onEdit(staff)} label="Sửa" />
          <DeleteButton onClick={() => onDelete(staff)} label="Xóa" />
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có nhân viên nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
