import React, { useState } from 'react';
import WeeklyCalendarGrid from '../components/WeeklyCalendarGrid';
import CalendarFilterBar from '../components/CalendarFilterBar';
import { Appointment } from '../types/appointment';

const TODAY = new Date().toISOString().split('T')[0];

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [doctorFilter, setDoctorFilter] = useState('ALL');

  // MOCK DATA mapped exactly to schema3.sql Appointment table
  const MOCK_APPOINTMENTS: Appointment[] = [
    { appointment_id: 100, patient_id: 101, patient_name: 'Liam Anderson', main_doctor_id: 1, doctor_name: 'Dr. Sarah Smith', appointment_date: TODAY, time_start: '09:00:00', status: 'CONFIRMED', appointment_type: 'ONLINE', created_by: 'PATIENT' },
    { appointment_id: 101, patient_id: 102, patient_name: 'Emma Watson', main_doctor_id: 2, doctor_name: 'Dr. Robert Davis', appointment_date: TODAY, time_start: '10:30:00', status: 'PENDING', appointment_type: 'WALK_IN', created_by: 'STAFF' },
    { appointment_id: 102, patient_id: 103, patient_name: 'William Garcia', main_doctor_id: 1, doctor_name: 'Dr. Sarah Smith', appointment_date: TODAY, time_start: '14:00:00', status: 'CHECKED_IN', appointment_type: 'ONLINE', created_by: 'PATIENT' },
  ];

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

  // Filter logic based on the DB field doctor_name
  const filteredAppointments = MOCK_APPOINTMENTS.filter(app => {
    return doctorFilter === 'ALL' || app.doctor_name === doctorFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      
      {/* HEADER */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Calendar View</h1>
        <p className="text-sm text-slate-500 mt-1">Manage weekly schedules and visual appointment blocks.</p>
      </div>

      {/* FILTER BAR */}
      <CalendarFilterBar 
        doctorFilter={doctorFilter} 
        setDoctorFilter={setDoctorFilter}
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate}
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