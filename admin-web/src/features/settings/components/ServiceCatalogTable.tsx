import React from 'react';
import { Edit, Trash2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { Service } from '../types/settings';

interface Props {
  data: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export default function ServiceCatalogTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  const formatPrice = (price?: number) => {
    if (!price) return '0đ';
    return `${Number(price).toLocaleString('vi-VN')}đ`;
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table className="table-fixed w-full">
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14 border-b border-slate-200 hover:bg-transparent">
            <TableHead className="px-8 font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Tên dịch vụ
            </TableHead>

            <TableHead className="w-[180px] font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Danh mục
            </TableHead>

            <TableHead className="w-[180px] text-right pr-8 font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Giá ưu đãi
            </TableHead>

            <TableHead className="w-[180px] text-right pr-8 font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Giá gốc
            </TableHead>

            <TableHead className="w-[220px] text-right pr-8 font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.serviceId}
              className="hover:bg-slate-50/50 transition-colors border-slate-100"
            >
              <TableCell className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <Activity
                    size={18}
                    className="text-blue-500 shrink-0"
                  />

                  <span
                    className="font-bold text-slate-900 truncate block"
                    title={item.serviceName}
                  >
                    {item.serviceName}
                  </span>
                </div>
              </TableCell>

              <TableCell className="w-[180px]">
                <StatusBadge status={item.serviceType} />
              </TableCell>

              <TableCell className="w-[180px] text-right pr-8">
                {item.discountPrice ? (
                  <span className="font-black text-emerald-600 text-[15px]">
                    {formatPrice(item.discountPrice)}
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">—</span>
                )}
              </TableCell>

              <TableCell className="w-[180px] text-right pr-8">
                <span
                  className={
                    item.discountPrice
                      ? 'line-through text-slate-400 font-bold text-[15px]'
                      : 'font-black text-blue-600 text-[15px]'
                  }
                >
                  {formatPrice(item.originalPrice)}
                </span>
              </TableCell>

              <TableCell className="w-[220px] text-right pr-8">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => onEdit(item)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 h-9 px-4 rounded-xl border-primary-200 text-primary-600 hover:bg-primary-50"
                  >
                    <Edit size={14} />
                    <span>Sửa</span>
                  </Button>

                  <Button
                    onClick={() => onDelete(item)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 h-9 px-4 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    <span>Xóa</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}