import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import AppointmentFilterBar from '../components/AppointmentFilterBar';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentFormDialog from '../components/AppointmentFormDialog';
import { Appointment } from '../types/appointment';
import { appointmentApi } from '../api/appointmentApi';

const TODAY = new Date().toISOString().split('T')[0];

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // Tab State
  const [typeFilter, setTypeFilter] = useState('ALL');     // Dropdown State
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);

  React.useEffect(() => {
    appointmentApi.getAll().then(data => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  // Logic lọc kết hợp
  const filtered = appointments.filter(a => 
    a.patientName.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'ALL' || a.status === statusFilter) &&
    (typeFilter === 'ALL' || a.appointmentType === typeFilter) &&
    (!fromDate || a.appointmentDate >= fromDate) &&
    (!toDate || a.appointmentDate <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Lịch Hẹn" description="Manage clinical bookings and walk-ins." actionText="Walk-in Booking" onAction={() => setIsBookOpen(true)} />

      <AppointmentFilterBar 
        search={search} setSearch={setSearch} 
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter} 
        fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} 
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải lịch hẹn...</div>
      ) : (
        <AppointmentTable 
          data={filtered} 
          onCheckIn={async (id) => {
            await appointmentApi.checkIn(id);
            setAppointments(appointments.map(a => a.appointmentId === id ? { ...a, status: 'CHECKED_IN' } : a));
          }} 
          onCancel={setCancelApt} 
        />
      )}

      <AppointmentFormDialog isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} onBook={(data: any) => { setAppointments([{...data, appointmentId: Date.now(), patientName: 'New Patient', doctorName: 'Assigned Doctor', appointmentType: 'WALK_IN', status: 'PENDING', createdBy: 'STAFF'}, ...appointments]); setIsBookOpen(false); }} />
      
      <ActionReasonDialog isOpen={!!cancelApt} onClose={() => setCancelApt(null)} onConfirm={async (actor, reason) => { 
        if (cancelApt) {
          await appointmentApi.cancel(cancelApt.appointmentId, reason);
          setAppointments(appointments.map(a => a.appointmentId === cancelApt.appointmentId ? { ...a, status: 'CANCELLED', cancelReason: reason, cancelledBy: 'CLINIC' } : a)); 
        }
        setCancelApt(null); 
      }} title="Cancel Appointment" description={`Reason for cancelling ${cancelApt?.patientName}'s appointment?`} reasonLabel="Cancellation Reason" confirmText="Cancel Appointment" confirmColor="rose" />
    </div>
  );
}