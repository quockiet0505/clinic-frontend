import React from 'react';
import { Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Service } from '../types/settings';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';

interface Props {
  data: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

const formatCurrency = (value?: number) => {
  if (!value) return '0₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Màu sắc dịch vụ (không dùng tím)
const serviceTypeMap: Record<string, { label: string; color: string }> = {
  EXAM: { label: 'Khám bệnh', color: 'bg-blue-100 text-blue-700' },
  LAB_TEST: { label: 'Xét nghiệm', color: 'bg-emerald-100 text-emerald-700' },
  IMAGING: { label: 'Chẩn đoán hình ảnh', color: 'bg-orange-100 text-orange-700' },
};

export default function ServiceCatalogTable({ data = [], onEdit, onDelete }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có dịch vụ nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[40%]">Tên dịch vụ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Danh mục</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Giá gốc</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Giá giảm</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[10%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const hasDiscount = item.discountPrice && item.discountPrice > 0;
            const typeInfo = serviceTypeMap[item.serviceType] || { label: item.serviceType, color: 'bg-gray-100 text-gray-700' };
            return (
              <TableRow key={item.serviceId} className="hover:bg-slate-50 border-b border-slate-100">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-blue-500 shrink-0" />
                    <span 
                      className="font-medium text-slate-800 truncate block max-w-[300px]" 
                      title={item.serviceName}
                    >
                      {item.serviceName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-500">
                  {hasDiscount ? (
                    <span className="line-through text-slate-400">{formatCurrency(item.originalPrice)}</span>
                  ) : (
                    <span className="font-medium">{formatCurrency(item.originalPrice)}</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {hasDiscount ? (
                    <span className="text-emerald-600 font-medium">{formatCurrency(item.discountPrice)}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex gap-2">
                    <EditButton onClick={() => onEdit(item)} />
                    <DeleteButton onClick={() => onDelete(item)} />
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