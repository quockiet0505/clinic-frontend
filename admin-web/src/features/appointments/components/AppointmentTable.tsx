import React from 'react';
import { Clock, Globe, UserRound, CheckCircle2, XCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { Appointment } from '../types/appointment';

interface Props {
  data: Appointment[];
  onCheckIn: (id: number) => void;
  onCancel: (apt: Appointment) => void;
}

export default function AppointmentTable({ data, onCheckIn, onCancel }: Props) {
  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Nguồn</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Bệnh nhân</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Lịch khám & Bác sĩ</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(apt => (
            <TableRow key={apt.appointmentId} className="hover:bg-slate-50/50 border-slate-100">
              <TableCell className="px-8 py-4">
                {apt.appointmentType === 'ONLINE' ? <Globe size={20} className="text-indigo-600" /> : <UserRound size={20} className="text-slate-400" />}
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-900">{apt.patientName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: PAT-{apt.patientId}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-500" /> {apt.appointmentDate} • {apt.timeStart.substring(0, 5)}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{apt.doctorName}</p>
              </TableCell>
              <TableCell className="text-center">
                <StatusBadge status={apt.status} />
                {apt.status === 'CANCELLED' && apt.cancelReason && (
                  <p className="text-[10px] text-rose-500 mt-1 truncate max-w-[120px] mx-auto" title={apt.cancelReason}>{apt.cancelReason}</p>
                )}
              </TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-1.5">
                  {['PENDING', 'CONFIRMED'].includes(apt.status) && (
                    <Button onClick={() => onCheckIn(apt.appointmentId)} variant="outline" size="sm" className="flex items-center gap-1.5 text-blue-600 font-semibold rounded-[10px] border-blue-200 hover:bg-blue-50 transition-all cursor-pointer px-3 h-8">
                      <LogIn size={14} /><span>Check-in</span>
                    </Button>
                  )}
                  {!['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(apt.status) && (
                    <Button onClick={() => onCancel(apt)} variant="outline" size="sm" className="flex items-center gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 transition-all cursor-pointer font-semibold rounded-[10px] px-3 h-8">
                      <XCircle size={14} /><span>Huỷ</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}