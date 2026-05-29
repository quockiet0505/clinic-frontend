import React, { useState } from 'react';
import { format } from 'date-fns';

import { CalendarDays, Clock3, MapPin, Stethoscope, User, XCircle } from 'lucide-react';
import { CancelAppointmentDialog } from './CancelAppointmentDialog';
import type { AppointmentHistoryItem } from '../types/appointment';

interface AppointmentCardProps {
  appointment: AppointmentHistoryItem;
  onCancelSuccess: () => void;
}

const getStatusBadge = (status: AppointmentHistoryItem['status']) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CHECKED_IN: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-purple-100 text-purple-700',
    WAITING_RESULT: 'bg-orange-100 text-orange-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-600',
  };
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    CHECKED_IN: 'Checked In',
    IN_PROGRESS: 'In Progress',
    WAITING_RESULT: 'Waiting Result',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>{labels[status] || status}</span>;
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancelSuccess }) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border-default p-5 hover:shadow-md transition">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="w-4 h-4" />
            {format(new Date(appointment.appointmentDate), 'dd/MM/yyyy')}
            <Clock3 className="w-4 h-4 ml-2" />
            {appointment.timeStart} - {appointment.timeEnd}
          </div>
          <h3 className="font-bold text-brand-dark text-lg mt-1">{appointment.doctorName}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
            <div className="flex items-center gap-1"><Stethoscope className="w-4 h-4 text-primary-500" />{appointment.specialty}</div>
            <div className="flex items-center gap-1"><User className="w-4 h-4 text-primary-500" />{appointment.symptoms}</div>
            <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary-500" />{appointment.facility}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(appointment.status)}
          {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
            <button onClick={() => setCancelDialogOpen(true)} className="text-red-500 hover:text-red-700 transition">
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <CancelAppointmentDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        appointmentId={appointment.id}
        onSuccess={onCancelSuccess}
      />
    </div>
  );
};