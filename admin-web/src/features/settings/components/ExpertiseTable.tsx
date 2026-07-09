import React from 'react';
import Table, { Column } from '@/components/tables/Table';
import { Expertise } from '../types/settings';
import { getImageUrl } from '@/utils/image';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';

const colorPalette = ['bg-emerald-100 text-emerald-700'];

interface Props {
  data: Expertise[];
  onDelete: (id: number) => void;
  onEdit: (item: Expertise) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
  isTechnicianTab?: boolean;
}

export default function ExpertiseTable({ data, onDelete, onEdit, loading = false, pagination, isTechnicianTab = false }: Props) {
  const columns: Column<Expertise>[] = [
    {
      key: 'expertiseName',
      label: 'Tên chuyên khoa',
      className: 'w-[25%]',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${colorPalette[0]} flex items-center justify-center font-bold text-sm shrink-0`}>
            {item.expertiseName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm">{item.expertiseName}</p>
            <p className="text-xs text-slate-400">#{item.expertiseId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'iconUrl',
      label: 'Biểu tượng',
      className: 'w-[15%]',
      render: (item) =>
        item.iconUrl ? (
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
            <img src={getImageUrl(item.iconUrl)} alt="icon" className="w-full h-full object-cover" />
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: 'doctorCount',
      label: isTechnicianTab ? 'Số Kỹ thuật viên' : 'Số bác sĩ',
      className: 'w-[15%]',
      render: (item) => (
        <span className="text-sm font-medium text-slate-700">
          {isTechnicianTab ? (item.technicianCount ?? 0) : (item.doctorCount ?? 0)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      className: 'w-[20%]',
      render: (item) => (
        <span className="text-sm text-slate-500">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[25%]',
      render: (item) => (
        <div className="flex gap-2">
          <EditButton onClick={() => onEdit(item)} />
          <DeleteButton onClick={() => onDelete(item.expertiseId)} />
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không tìm thấy chuyên khoa nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
