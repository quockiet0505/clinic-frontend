import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';

export default function MyScheduleTable({ data, onCancelRequest }: { data: any[], onCancelRequest: (id: number) => void }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8 w-[20%]">Loại nghỉ</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] w-[20%]">Thời gian nghỉ</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] w-[25%]">Lý do</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center w-[15%]">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-left w-[20%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((leave) => (
            <TableRow key={leave.leaveId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-[10px] text-[11px] uppercase tracking-wider">{leave.leaveType}</span>
              </TableCell>
              <TableCell className="align-middle">
                <p className="font-bold text-slate-800">{leave.fromDate}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Tới: {leave.toDate}</p>
              </TableCell>
              <TableCell className="max-w-xs"><p className="text-sm text-slate-600 truncate">{leave.reason}</p></TableCell>
              <TableCell className="text-center"><StatusBadge status={leave.status} /></TableCell>
              <TableCell className="text-left align-middle">
                {leave.status === 'PENDING' && (
                  <div className="flex justify-start items-center">
                    <Button onClick={() => onCancelRequest(leave.leaveId)} variant="outline" size="sm" className="w-9 h-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50"><Trash2 size={16} /></Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}