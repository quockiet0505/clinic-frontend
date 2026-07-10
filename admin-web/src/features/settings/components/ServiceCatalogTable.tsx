import React from 'react';
import Table, { Column } from '@/components/tables/Table';
import EntityAvatar from '@/components/common/EntityAvatar';
import { Service } from '../types/settings';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';
import { toNumber } from '@/utils/pagedApi';
import { Badge } from '@/components/ui/badge';

interface Props {
  data: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

const formatCurrency = (value?: number | unknown) => {
  const num = toNumber(value);
  if (!num) return '0₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

const serviceTypeMap: Record<string, { label: string; color: string }> = {
  EXAM: { label: 'Khám bệnh', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  LAB_TEST: { label: 'Xét nghiệm', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  X_RAY: { label: 'Chụp X-Quang', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  ULTRASOUND: { label: 'Siêu âm', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  CT_SCAN: { label: 'Chụp CT', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  MRI: { label: 'Chụp MRI', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  ENDOSCOPY: { label: 'Nội soi', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  OTHER: { label: 'Khác', color: 'bg-gray-50 text-gray-700 border-gray-200' },
};


export default function ServiceCatalogTable({ data = [], onEdit, onDelete, loading = false, pagination }: Props) {
  const columns: Column<Service>[] = [
    {
      key: 'serviceName',
      label: 'Tên dịch vụ',
      className: 'w-[35%] text-left',
      noTruncate: true,
      render: (item) => (
        <div className="flex items-center gap-3 min-w-0">
          <EntityAvatar name={item.serviceName} imageUrl={item.imageUrl} size="md" className="rounded-lg" />
          <span className="font-medium text-slate-800 truncate block max-w-[260px]" title={item.serviceName}>
            {item.serviceName}
          </span>
        </div>
      ),    },
    {
      key: 'serviceType',
      label: 'Danh mục',
      className: 'w-[15%]',
      render: (item) => {
        const typeInfo = serviceTypeMap[item.serviceType] || { label: item.serviceType, color: 'bg-gray-50 text-gray-700 border-gray-200' };
        return (
          <Badge
            variant="outline"
            className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-md border text-[11px] whitespace-nowrap ${typeInfo.color}`}
          >
            {typeInfo.label}
          </Badge>
        );
      },
    },

    {
      key: 'estimatedDuration',
      label: 'Thời gian',
      className: 'w-[10%]',
      render: (item) => (
        <span className="text-slate-600 font-medium">{item.estimatedDuration ? `${item.estimatedDuration} phút` : '15 phút'}</span>
      ),
    },
    {
      key: 'originalPrice',
      label: 'Giá gốc',
      className: 'w-[15%]',
      render: (item) => {
        const hasDiscount = item.discountAmount && toNumber(item.discountAmount) > 0;
        return hasDiscount ? (
          <span className="line-through text-slate-400">{formatCurrency(item.originalPrice)}</span>
        ) : (
          <span className="font-medium text-slate-500">{formatCurrency(item.originalPrice)}</span>
        );
      },
    },
    {
      key: 'discountAmount',
      label: 'Giá giảm',
      className: 'w-[15%]',
      render: (item) => {
        const hasDiscount = item.discountAmount && toNumber(item.discountAmount) > 0;
        return hasDiscount ? (
          <span className="text-emerald-600 font-medium">{formatCurrency(item.discountAmount)}</span>
        ) : (
          <span className="text-slate-300">—</span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[20%]',
      render: (item) => (
        <div className="flex gap-2">
          <EditButton onClick={() => onEdit(item)} />
          <DeleteButton onClick={() => onDelete(item)} />
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có dịch vụ nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
