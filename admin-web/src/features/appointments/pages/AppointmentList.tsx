import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import AppointmentFilterBar from '../components/AppointmentFilterBar';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentFormDialog from '../components/AppointmentFormDialog';
import { Appointment } from '../types/appointment';

const TODAY = new Date().toISOString().split('T')[0];

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([
     { appointment_id: 1, patient_id: 101, patient_name: 'Liam Anderson', main_doctor_id: 1, doctor_name: 'Dr. Sarah Smith', appointment_date: '2026-04-11', time_start: '08:30:00', appointment_type: 'ONLINE', status: 'PENDING', created_by: 'PATIENT' },
     { appointment_id: 2, patient_id: 102, patient_name: 'Emma Watson', main_doctor_id: 2, doctor_name: 'Dr. Robert Davis', appointment_date: '2026-04-11', time_start: '10:00:00', appointment_type: 'WALK_IN', status: 'CHECKED_IN', created_by: 'STAFF' },
     { appointment_id: 3, patient_id: 103, patient_name: 'William Garcia', main_doctor_id: 1, doctor_name: 'Dr. Sarah Smith', appointment_date: '2026-04-12', time_start: '14:00:00', appointment_type: 'ONLINE', status: 'CONFIRMED', created_by: 'PATIENT' }, ]);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // Tab State
  const [typeFilter, setTypeFilter] = useState('ALL');     // Dropdown State
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);
  
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);

  // Logic lọc kết hợp
  const filtered = appointments.filter(a => 
    a.patient_name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'ALL' || a.status === statusFilter) &&
    (typeFilter === 'ALL' || a.appointment_type === typeFilter) &&
    (a.appointment_date >= fromDate && a.appointment_date <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Appointments" description="Manage clinical bookings and walk-ins." actionText="Walk-in Booking" onAction={() => setIsBookOpen(true)} />

      <AppointmentFilterBar 
        search={search} setSearch={setSearch} 
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter} 
        fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} 
      />

      <AppointmentTable 
        data={filtered} 
        onCheckIn={(id) => setAppointments(appointments.map(a => a.appointment_id === id ? { ...a, status: 'CHECKED_IN' } : a))} 
        onCancel={setCancelApt} 
      />

      <AppointmentFormDialog isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} onBook={(data: any) => { setAppointments([{...data, appointment_id: Date.now(), patient_name: 'New Patient', doctor_name: 'Assigned Doctor', appointment_type: 'WALK_IN', status: 'PENDING', created_by: 'STAFF'}, ...appointments]); setIsBookOpen(false); }} />
      
      <ActionReasonDialog isOpen={!!cancelApt} onClose={() => setCancelApt(null)} onConfirm={(actor, reason) => { setAppointments(appointments.map(a => a.appointment_id === cancelApt?.appointment_id ? { ...a, status: 'CANCELLED', cancel_reason: reason, cancelled_by: 'CLINIC' } : a)); setCancelApt(null); }} title="Cancel Appointment" description={`Reason for cancelling ${cancelApt?.patient_name}'s appointment?`} reasonLabel="Cancellation Reason" confirmText="Cancel Appointment" confirmColor="rose" />
    </div>
  );
}