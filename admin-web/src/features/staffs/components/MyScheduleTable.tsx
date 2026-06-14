import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';

interface MyScheduleTableProps {
  data: any[];
  onCancelRequest: (id: number) => void;
}

export default function MyScheduleTable({ data, onCancelRequest }: MyScheduleTableProps) {
  const getLeaveTypeLabel = (type: string) => {
    if (type === 'SICK') return 'Nghỉ ốm';
    if (type === 'ANNUAL') return 'Nghỉ phép năm';
    return 'Nghỉ khác';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[18%]">Loại nghỉ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Thời gian nghỉ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[32%]">Lý do</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Trạng thái</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="px-6 py-12 text-center text-slate-400">
                Không có đơn xin nghỉ nào.
              </TableCell>
            </TableRow>
          ) : (
            data.map((leave) => (
              <TableRow key={leave.leaveId} className="hover:bg-slate-50 border-b border-slate-100">
                <TableCell className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                    {getLeaveTypeLabel(leave.leaveType)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-800">{leave.fromDate}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Đến: {leave.toDate}</p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm text-slate-600 truncate max-w-[280px]" title={leave.reason}>
                    {leave.reason || '—'}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <StatusBadge status={leave.status} />
                </TableCell>
                <TableCell className="px-6 py-4">
                  {leave.status === 'PENDING' && (
                    <Button
                      onClick={() => onCancelRequest(leave.leaveId)}
                      variant="outline"
                      className="h-8 px-3 rounded-lg text-xs font-medium border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                    >
                      <Trash2 size={14} className="mr-1.5" /> Hủy đơn
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}