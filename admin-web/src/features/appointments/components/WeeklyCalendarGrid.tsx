import React from 'react';
import { Clock, Globe, UserRound } from 'lucide-react';
import { Appointment } from '../types/appointment';

interface WeeklyCalendarGridProps {
  currentWeekStart: Date;
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

// Generate an array of 7 days starting from the given start date
const generateWeekDays = (startDate: Date) => {
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });
};

// Generate time slots from 08:00 to 17:00
const TIME_SLOTS = Array.from({ length: 10 }).map((_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function WeeklyCalendarGrid({ currentWeekStart, appointments, onAppointmentClick }: WeeklyCalendarGridProps) {
  const weekDays = generateWeekDays(currentWeekStart);

  // Helper to get appointments for a specific day and time slot
  const getAppointmentsForSlot = (dateString: string, timeSlot: string) => {
    return appointments.filter(app => {
      // time_start comes from DB usually as "HH:MM:SS" or "HH:MM"
      const appHour = app.time_start.substring(0, 2);
      const slotHour = timeSlot.substring(0, 2);
      return app.appointment_date === dateString && appHour === slotHour;
    });
  };

  // Map DB ENUM statuses to UI Colors
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
    <div className="flex flex-col h-full bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
      
      {/* CALENDAR HEADER (Days of the week) */}
      <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="p-3 text-center border-r border-slate-200 flex items-center justify-center text-slate-400">
          <Clock size={16} />
        </div>
        {weekDays.map((date, idx) => {
          const isToday = new Date().toDateString() === date.toDateString();
          return (
            <div key={idx} className={`p-3 text-center border-r border-slate-200 last:border-0 ${isToday ? 'bg-blue-50/50' : ''}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className={`text-xl font-black mt-0.5 ${isToday ? 'text-blue-600' : 'text-slate-900'}`}>
                {date.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* CALENDAR BODY (Time slots grid) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {TIME_SLOTS.map((time, timeIdx) => (
          <div key={timeIdx} className="grid grid-cols-8 border-b border-slate-100 min-h-[100px]">
            
            {/* Time Column */}
            <div className="p-3 text-center border-r border-slate-100 bg-slate-50/50 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500">{time}</span>
            </div>

            {/* Days Columns */}
            {weekDays.map((date, dateIdx) => {
              const dateString = date.toISOString().split('T')[0];
              const slotAppointments = getAppointmentsForSlot(dateString, time);
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <div key={dateIdx} className={`p-1.5 border-r border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${isToday ? 'bg-blue-50/10' : ''}`}>
                  <div className="flex flex-col gap-1.5">
                    {slotAppointments.map(app => (
                      <button
                        key={app.appointment_id}
                        onClick={() => onAppointmentClick && onAppointmentClick(app)}
                        className={`w-full text-left p-2 rounded-xl border text-xs transition-all ${getStatusColor(app.status)}`}
                      >
                        <div className="font-bold truncate">{app.patient_name}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-medium opacity-80">{app.time_start.substring(0,5)}</span>
                          {/* Indicate if it's Online or Walk-in */}
                          {app.appointment_type === 'ONLINE' ? (
                            <span title="Online Booking">
                              <Globe size={12} className="opacity-70" />
                            </span>
                          ) : (
                            <span title="Walk-In">
                              <UserRound size={12} className="opacity-70" />
                            </span>
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