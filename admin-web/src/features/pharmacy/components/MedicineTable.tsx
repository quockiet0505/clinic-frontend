import React from 'react';
import { Edit2, Trash2, Pill, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Table, { Column } from '@/components/tables/Table';
import { Medicine } from '../types/pharmacy';

interface Props {
  data: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicine: Medicine) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

export default function MedicineTable({ data, onEdit, onDelete, loading = false, pagination }: Props) {
  const columns: Column<Medicine>[] = [
    {
      key: 'name',
      label: 'Tên thuốc & Hoạt chất',
      className: 'w-[30%]',
      render: (medicine) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
            <Pill size={18} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{medicine.name}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{medicine.activeElement || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'packingStandard',
      label: 'Quy cách đóng gói',
      className: 'w-[20%]',
      render: (medicine) => (
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Package size={14} className="text-slate-400" />
            {medicine.packingStandard || '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1 pl-5">
            Đơn vị: <span className="font-semibold text-slate-700">{medicine.baseUnit || medicine.unit || '—'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'usageNote',
      label: 'Cách dùng / Ghi chú',
      className: 'w-[30%]',
      render: (medicine) => (
        <p className="text-sm font-medium text-slate-600 line-clamp-2" title={medicine.usageNote}>
          {medicine.usageNote || '—'}
        </p>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[20%]',
      render: (medicine) => (
        <div className="flex gap-2">
          <Button onClick={() => onEdit(medicine)} variant="outline" className="h-8 px-3 rounded-xl text-xs font-semibold border-blue-200 text-blue-600 hover:bg-blue-50">
            <Edit2 size={14} className="mr-1.5" /> Sửa
          </Button>
          <Button onClick={() => onDelete(medicine)} variant="outline" className="h-8 px-3 rounded-xl text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50">
            <Trash2 size={14} className="mr-1.5" /> Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có dữ liệu thuốc nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
