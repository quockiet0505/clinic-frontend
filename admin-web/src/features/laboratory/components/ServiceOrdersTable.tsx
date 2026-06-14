import React from 'react';

import { Calendar, TestTube2, FileText  } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { ServiceOrder } from '../types/laboratory';
import { formatDateTime } from '@/utils/formatters';
import { InputResultButton, CancelButton } from '@/components/common/ActionButtons';

interface Props {
  data: ServiceOrder[];
  onInputResult: (order: ServiceOrder) => void;
  onReject: (order: ServiceOrder) => void;
}

export default function ServiceOrdersTable({ data, onInputResult, onReject }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có đơn xét nghiệm nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[18%]">Order ID & Ngày</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Bệnh nhân / Bác sĩ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[32%]">Xét nghiệm</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Trạng thái</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order) => (
            <TableRow key={order.orderId} className="hover:bg-slate-50 border-b border-slate-100">
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDateTime(order.createdAt)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">#ORD-{order.orderId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="font-medium text-slate-800">{order.patientName}</p>
                <p className="text-xs text-slate-500">
                  {order.doctorName?.startsWith('BS.') ? order.doctorName : `${order.doctorName}`}
                </p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <TestTube2 size={14} className="text-slate-400 shrink-0" />
                  <span className="text-slate-700 truncate max-w-[280px]" title={order.serviceName}>
                    {order.serviceName}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-medium mt-1">HSBA: #{order.recordId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="px-6 py-4">
              {order.status === 'ORDERED' ? (
                <div className="flex gap-2">
                  <InputResultButton onClick={() => onInputResult(order)} />
                  <CancelButton onClick={() => onReject(order)} label="Từ chối" />
                </div>
              ) : order.status === 'DONE' ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                <FileText size={12} className="text-slate-500" />
                Đã nhập kết quả
              </span>
            ) : null}
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}