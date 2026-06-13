import React from 'react';
import { Phone, History, CalendarClock, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { FollowUp } from '../types/appointment';

interface Props {
  data: FollowUp[];
  onLogCall: (fu: FollowUp) => void;
  onSendReminder: (fu: FollowUp) => void; // Prop mới
}

export default function FollowUpTable({ data, onLogCall, onSendReminder }: Props) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Patient Info</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Follow-up Detail</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Status</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.follow_up_id} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200 font-black uppercase">{item.patient_name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-slate-900">{item.patient_name}</p>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Phone size={10} /> {item.phone}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm font-bold text-slate-700">{item.note.split('|')[0]}</p>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1.5"><History size={12}/> Due: {item.scheduled_datetime}</span>
              </TableCell>
              <TableCell className="text-center">
                <StatusBadge status={item.status} />
                {item.note.includes('| Log:') && <p className="text-[10px] text-slate-400 mt-1.5 font-medium truncate max-w-[150px] mx-auto">{item.note.split('| Log:')[1]}</p>}
              </TableCell>
              <TableCell className="text-right pr-8">
                {item.status === 'PENDING' && (
                  <div className="flex justify-end gap-2">
                    {/* NÚT GỬI THÔNG BÁO */}
                    <Button onClick={() => onSendReminder(item)} variant="outline" size="sm" className="h-9 font-bold rounded-xl px-3 border-amber-200 text-amber-600 hover:bg-amber-50 shadow-sm" title="Send System Notification">
                      <BellRing size={16}/>
                    </Button>
                    {/* NÚT GHI NHẬN CUỘC GỌI */}
                    <Button onClick={() => onLogCall(item)} size="sm" className="h-9 font-bold rounded-xl px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white shadow-sm">
                      <Phone size={14} className="mr-1.5"/> Log Call
                    </Button>
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