import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { LeaveRequest } from '../types/staff';
import LeaveApplicationDialog from '../components/LeaveApplicationDialog';

const TODAY = new Date().toISOString().split('T')[0];

export default function MySchedule() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { leave_id: 1, staff_id: 1, leave_type: 'ANNUAL', from_date: '2026-04-15', to_date: '2026-04-17', reason: 'Family vacation.', status: 'APPROVED', applied_at: '2026-04-01', approved_by: 'Admin' },
    { leave_id: 2, staff_id: 1, leave_type: 'SICK', from_date: TODAY, to_date: TODAY, reason: 'Dental extraction.', status: 'PENDING', applied_at: TODAY },
  ]);
  
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().split('T')[0]);

  const filteredLeaves = leaves.filter(l => 
    (statusFilter === 'ALL' || l.status === statusFilter) &&
    (l.from_date >= fromDate && l.to_date <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="My Time Off" description="Manage your leave applications and view absence history." actionText="Submit Leave Request" onAction={() => setIsApplyOpen(true)} />
      
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-600 focus:ring-2 focus:ring-blue-600 outline-none w-full sm:w-40">
          <option value="ALL">All Statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option>
        </select>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>

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
            {filteredLeaves.map((leave) => (
              <TableRow key={leave.leave_id} className="hover:bg-slate-50/50">
                <TableCell className="px-8 py-4">
                  <p className="font-bold text-slate-900">{leave.leave_type} LEAVE</p>
                  <p className="text-xs font-bold text-slate-500">{leave.from_date} to {leave.to_date}</p>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-600 max-w-xs truncate">{leave.reason}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`font-bold px-2.5 py-1 border-0 ${leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : leave.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {leave.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-8">
                  {leave.status === 'PENDING' && (
                    <Button onClick={() => setCancelId(leave.leave_id)} variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50"><Trash2 size={16}/></Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LeaveApplicationDialog isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} onSubmit={() => setIsApplyOpen(false)} />
      <ConfirmDialog isOpen={!!cancelId} onClose={() => setCancelId(null)} onConfirm={() => { setLeaves(leaves.filter(l => l.leave_id !== cancelId)); setCancelId(null); }} title="Cancel Request" description="Are you sure you want to cancel this leave request?" confirmText="Yes, Cancel It" />
    </div>
  );
}