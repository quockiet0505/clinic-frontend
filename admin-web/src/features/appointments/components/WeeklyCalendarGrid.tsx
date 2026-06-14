import React from 'react';
import { Clock, Globe, UserRound } from 'lucide-react';
import { Appointment } from '../types/appointment';

interface WeeklyCalendarGridProps {
  currentWeekStart: Date;
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

const generateWeekDays = (startDate: Date) => {
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });
};

const TIME_SLOTS = Array.from({ length: 10 }).map((_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function WeeklyCalendarGrid({ currentWeekStart, appointments, onAppointmentClick }: WeeklyCalendarGridProps) {
  const weekDays = generateWeekDays(currentWeekStart);

  const getAppointmentsForSlot = (dateString: string, timeSlot: string) => {
    return appointments.filter(app => {
      const appHour = app.timeStart.substring(0, 2);
      const slotHour = timeSlot.substring(0, 2);
      return app.appointmentDate === dateString && appHour === slotHour;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200';
      case 'PENDING': return 'bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-200';
      case 'CHECKED_IN':
      case 'IN_PROGRESS':
      case 'COMPLETED': return 'bg-emerald-100 border-emerald-200 text-emerald-700 hover:bg-emerald-200';
      case 'CANCELLED':
      case 'NO_SHOW': return 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 line-through';
      default: return 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header days - thu nhỏ chữ và padding */}
      <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-100 shrink-0">
        <div className="py-2 px-1 text-center border-r border-slate-200 flex items-center justify-center text-slate-500">
          <Clock size={16} />
        </div>
        {weekDays.map((date, idx) => {
          const isToday = new Date().toDateString() === date.toDateString();
          return (
            <div key={idx} className={`py-2 px-1 text-center border-r border-slate-200 last:border-0 ${isToday ? 'bg-blue-50' : ''}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
                {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
              </p>
              <p className={`text-base font-bold mt-0.5 ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>
                {date.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Body - giảm nhẹ padding time column */}
      <div className="flex-1 overflow-y-auto">
        {TIME_SLOTS.map((time, timeIdx) => (
          <div key={timeIdx} className="grid grid-cols-8 border-b border-slate-100 min-h-[90px]">
            <div className="py-2 text-center border-r border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-slate-600">{time}</span>
            </div>
            {weekDays.map((date, dateIdx) => {
              const dateString = date.toISOString().split('T')[0];
              const slotAppointments = getAppointmentsForSlot(dateString, time);
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <div key={dateIdx} className={`p-1 border-r border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${isToday ? 'bg-blue-50/10' : ''}`}>
                  <div className="flex flex-col gap-1">
                    {slotAppointments.map(app => (
                      <button
                        key={app.appointmentId}
                        onClick={() => onAppointmentClick && onAppointmentClick(app)}
                        className={`w-full text-left p-1.5 rounded-lg border text-xs transition-all ${getStatusColor(app.status)}`}
                      >
                        <div className="font-bold truncate text-[11px]">{app.patientName}</div>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className="font-medium opacity-80 text-[10px]">{app.timeStart.substring(0,5)}</span>
                          {app.appointmentType === 'ONLINE' ? (
                            <Globe size={10} className="opacity-70" title="Khám trực tuyến" />
                          ) : (
                            <UserRound size={10} className="opacity-70" title="Khách vãng lai" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}