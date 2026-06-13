import React, { useState, useEffect } from 'react';
import WeeklyCalendarGrid from '../components/WeeklyCalendarGrid';
import CalendarFilterBar from '../components/CalendarFilterBar';
import { Appointment } from '../types/appointment';
import { appointmentApi } from '../api/appointmentApi';

const TODAY = new Date().toISOString().split('T')[0];

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await appointmentApi.getAll();
      setAppointments(data);
    };
    const fetchProviders = async () => {
      const { staffApi } = await import('../../staffs/api/staffApi');
      const data = await staffApi.getAll();
      const docs = data.filter((s: any) => s.staffType === 'DOCTOR' || s.staffType === 'NURSE' || s.staffType === 'STAFF').map((s: any) => ({
        id: s.staffId.toString(),
        name: s.fullName
      }));
      setProviders(docs);
    };
    fetchAppointments();
    fetchProviders();
  }, []);

  // Calculate the 'Monday' of the week containing selectedDate
  const getStartOfWeek = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date(); 
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const weekStart = getStartOfWeek(selectedDate);

  const handleAppointmentClick = (app: Appointment) => {
    console.log("Clicked appointment:", app);
    // You can implement an ActionReasonDialog or modal trigger here later
  };

  // Filter logic based on the DB field doctorName
  const filteredAppointments = appointments.filter(app => {
    return doctorFilter === 'ALL' || app.doctorName === doctorFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      
      {/* HEADER */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lịch theo tháng</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý lịch làm việc hàng tuần và các khối lịch hẹn.</p>
      </div>

      {/* FILTER BAR */}
      <CalendarFilterBar 
        doctorFilter={doctorFilter} 
        setDoctorFilter={setDoctorFilter}
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate}
        providers={providers}
      />

      {/* CALENDAR GRID */}
      <div className="flex-1 overflow-hidden min-h-0 rounded-[32px] shadow-sm">
        <WeeklyCalendarGrid 
          currentWeekStart={weekStart} 
          appointments={filteredAppointments} 
          onAppointmentClick={handleAppointmentClick}
        />
      </div>

    </div>
  );
}