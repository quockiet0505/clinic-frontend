import React from 'react';
import { Undo2, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function RefundLogTable({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Refund Date & ID</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Original Bill</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Lý do</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Processed By</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Refund Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((log) => (
            <TableRow key={log.refundId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">{log.refundedAt.split('T')[0]}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">REF-{log.refundId}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 font-bold text-blue-600">
                  <FileText size={14} /> BILL-{log.billId}
                </div>
              </TableCell>
              <TableCell><span className="text-sm font-medium text-slate-700">{log.reason}</span></TableCell>
              <TableCell><span className="text-xs font-bold text-slate-500">Staff: {log.processed_by_name}</span></TableCell>
              <TableCell className="">
                <span className="text-lg font-black text-rose-600 flex items-center justify-end gap-1">
                  <Undo2 size={16} /> ${log.refundAmount.toFixed(2)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}