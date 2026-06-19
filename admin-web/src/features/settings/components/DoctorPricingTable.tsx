import React from 'react';
import EntityAvatar from '@/components/common/EntityAvatar';
import Table, { Column } from '@/components/tables/Table';
import { DoctorPricing } from '../types/settings';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';

interface PricingTableProps {
  doctors: DoctorPricing[];
  onEdit: (doctor: DoctorPricing) => void;
  onDelete: (doctor: DoctorPricing) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

const formatCurrency = (value?: number) => {
  if (!value || value === 0) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function PricingTable({ doctors = [], onEdit, onDelete, loading = false, pagination }: PricingTableProps) {
  const columns: Column<DoctorPricing>[] = [
    {
      key: 'doctorName',
      label: 'Bác sĩ',
      className: 'w-[28%] text-left',
      noTruncate: true,
      render: (doc) => (
        <div className="flex items-center gap-3">
          <EntityAvatar name={doc.doctorName} imageUrl={doc.imageUrl} size="sm" />
          <div>
            <p className="font-medium text-slate-800">{doc.doctorName}</p>
            <p className="text-xs text-slate-400">ID: {doc.staffId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'serviceName',
      label: 'Dịch vụ',
      className: 'w-[27%]',
      render: (doc) => <span className="text-slate-600">{doc.serviceName}</span>,
    },
    {
      key: 'originalPrice',
      label: 'Giá gốc',
      className: 'w-[15%]',
      render: (doc) => <span className="text-slate-500">{formatCurrency(doc.originalPrice ?? doc.price ?? 0)}</span>,
    },
    {
      key: 'discountPrice',
      label: 'Giá giảm',
      className: 'w-[15%]',
      render: (doc) => {
        const hasDiscount = doc.discountPrice && doc.discountPrice > 0 && doc.discountPrice < (doc.originalPrice ?? doc.price ?? 0);
        return hasDiscount ? (
          <span className="text-emerald-600 font-medium">{formatCurrency(doc.discountPrice)}</span>
        ) : (
          <span className="text-slate-300">—</span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[15%]',
      render: (doc) => (
        <div className="flex gap-2">
          <EditButton onClick={() => onEdit(doc)} />
          <DeleteButton onClick={() => onDelete(doc)} />
        </div>
      ),
    },
  ];

  return (
    <Table
      data={doctors}
      columns={columns}
      loading={loading}
      emptyMessage="Không có dữ liệu phí khám."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
