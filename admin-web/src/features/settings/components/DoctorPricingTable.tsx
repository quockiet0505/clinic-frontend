import React from 'react';
import { UserCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DoctorPricing } from '../types/settings';
import { getImageUrl } from '@/utils/image';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';

interface PricingTableProps {
  doctors: DoctorPricing[];
  onEdit: (doctor: DoctorPricing) => void;
  onDelete: (doctor: DoctorPricing) => void;
}

const formatCurrency = (value?: number) => {
  if (!value || value === 0) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function PricingTable({ doctors = [], onEdit, onDelete }: PricingTableProps) {
  if (doctors.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có dữ liệu phí khám.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[28%]">Bác sĩ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[27%]">Dịch vụ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Giá gốc</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Giá giảm</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doc) => {
            const hasDiscount = doc.discountPrice && doc.discountPrice > 0 && doc.discountPrice < (doc.originalPrice ?? doc.price);
            const original = doc.originalPrice ?? doc.price ?? 0;
            const discount = doc.discountPrice;

            return (
              <TableRow key={doc.id} className="hover:bg-slate-50 border-b border-slate-100">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {doc.imageUrl ? (
                      <img src={getImageUrl(doc.imageUrl)} className="w-8 h-8 rounded-full object-cover border" alt="" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <UserCircle size={18} className="text-slate-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-800">{doc.doctorName}</p>
                      <p className="text-xs text-slate-400">ID: {doc.staffId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600">{doc.serviceName}</TableCell>
                <TableCell className="px-6 py-4 text-slate-500">{formatCurrency(original)}</TableCell>
                <TableCell className="px-6 py-4">
                  {hasDiscount ? (
                    <span className="text-emerald-600 font-medium">{formatCurrency(discount)}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex gap-2">
                    <EditButton onClick={() => onEdit(doc)} />
                    <DeleteButton onClick={() => onDelete(doc)} />
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