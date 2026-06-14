import React from 'react';
import { FileText, TestTube2, Edit3, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { ServiceOrder } from '../types/laboratory';

interface Props {
  data: ServiceOrder[];
  onInputResult: (order: ServiceOrder) => void;
  onReject: (order: ServiceOrder) => void;
}

export default function ServiceOrdersTable({ data, onInputResult, onReject }: Props) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Order ID & Date</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Bệnh nhân</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Requested Test</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(order => (
            <TableRow key={order.orderId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">{order.createdAt.split('T')[0]}</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">ORD-{order.orderId}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-900">{order.patientName}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Dr. {order.doctorName}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-blue-600 flex items-center gap-1.5"><TestTube2 size={14}/> {order.serviceName}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Rec: {order.recordId}</p>
              </TableCell>
              <TableCell className="text-center"><StatusBadge status={order.status} /></TableCell>
              <TableCell className="">
                {order.status === 'ORDERED' ? (
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => onInputResult(order)} variant="outline" size="sm" className="h-9 font-bold rounded-xl px-4 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                      <Edit3 size={14} className="mr-1.5"/> Input Result
                    </Button>
                    <Button onClick={() => onReject(order)} variant="outline" size="icon" className="h-9 w-9 p-0 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50" title="Reject Sample">
                      <XCircle size={16} />
                    </Button>
                  </div>
                ) : order.status === 'DONE' ? (
                  <Button variant="ghost" size="sm" className="h-9 font-bold text-slate-400 cursor-default cursor-pointer">
                    <FileText size={14} className="mr-1.5"/> Logged
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}