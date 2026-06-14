import React from 'react';
import { Clock, Globe, UserRound, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { Appointment } from '../types/appointment';
import { formatDateTime } from '@/utils/formatters';
import { CheckInButton, CancelButton } from '@/components/common/ActionButtons';

interface Props {
  data: Appointment[];
  onCheckIn: (id: number) => void;
  onCancel: (apt: Appointment) => void;
}

export default function AppointmentTable({ data, onCheckIn, onCancel }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có lịch hẹn nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[8%]">Nguồn</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[18%]">Ngày & ID</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%]">Bệnh nhân</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%]">Lịch khám & Bác sĩ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[12%]">Trạng thái</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[17%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((apt) => (
            <TableRow key={apt.appointmentId} className="hover:bg-slate-50 border-b border-slate-100">
              <TableCell className="px-6 py-4">
                {apt.appointmentType === 'ONLINE' ? (
                  <Globe size={20} className="text-indigo-600" />
                ) : (
                  <UserRound size={20} className="text-slate-400" />
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDateTime(apt.appointmentDate)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">#APT-{apt.appointmentId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="font-medium text-slate-800">{apt.patientName}</p>
                <p className="text-xs text-slate-500 mt-0.5">ID: PAT-{apt.patientId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1 text-sm text-slate-700">
                  <Clock size={14} className="text-blue-500" />
                  <span>{apt.appointmentDate} • {apt.timeStart.substring(0, 5)}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{apt.doctorName}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <StatusBadge status={apt.status} />
                {apt.status === 'CANCELLED' && apt.cancelReason && (
                  <p className="text-xs text-rose-500 mt-1 truncate max-w-[150px]" title={apt.cancelReason}>
                    {apt.cancelReason}
                  </p>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex gap-2">
                  {['PENDING', 'CONFIRMED'].includes(apt.status) && (
                    <CheckInButton onClick={() => onCheckIn(apt.appointmentId)} />
                  )}
                  {!['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(apt.status) && (
                    <CancelButton onClick={() => onCancel(apt)} />
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