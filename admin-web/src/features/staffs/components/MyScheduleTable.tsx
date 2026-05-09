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
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Leave Type & Period</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Reason</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Status</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((leave) => (
            <TableRow key={leave.leave_id} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">{leave.leave_type} LEAVE</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{leave.from_date} <span className="text-slate-400">to</span> {leave.to_date}</p>
              </TableCell>
              <TableCell className="max-w-xs"><p className="text-sm text-slate-600 truncate">{leave.reason}</p></TableCell>
              <TableCell className="text-center"><StatusBadge status={leave.status} /></TableCell>
              <TableCell className="text-right pr-8">
                {leave.status === 'PENDING' && (
                  <Button onClick={() => onCancelRequest(leave.leave_id)} variant="outline" size="sm" className="w-9 h-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50"><Trash2 size={16} /></Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}