import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { LeaveRequest } from '../types/staff';

interface Props {
  data: LeaveRequest[];
  onAction: (req: LeaveRequest) => void;
}

export default function LeaveRequestsTable({ data, onAction }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-6 h-12">Staff Details</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Leave Period</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Reason</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Status</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((req) => (
            <TableRow key={req.leave_id} className="hover:bg-slate-50/50">
              <TableCell className="px-6 py-4">
                <p className="font-bold text-slate-900">{req.full_name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{req.staff_type} • {req.leave_type} LEAVE</p>
              </TableCell>
              <TableCell className="font-medium text-slate-600 text-sm">
                {req.from_date} <br/> <span className="text-slate-400">to</span> {req.to_date}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-slate-500 text-sm">{req.reason}</TableCell>
              <TableCell className="text-center"><StatusBadge status={req.status} /></TableCell>
              <TableCell className="text-right pr-6">
                {req.status === 'PENDING' ? (
                  <Button onClick={() => onAction(req)} variant="outline" size="sm" className="h-8 font-bold rounded-lg border-slate-200 text-blue-600">Review</Button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Processed by {req.approved_by}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}