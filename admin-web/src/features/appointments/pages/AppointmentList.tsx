import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import AppointmentFilterBar from '../components/AppointmentFilterBar';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentFormDialog from '../components/AppointmentFormDialog';
import CustomSelect from '@/components/common/CustomSelect';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lịch Hẹn</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý đặt lịch khám và khách vãng lai.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <CustomSelect 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="h-11"
          >
            <option value="ALL">Tất cả Trạng thái</option>
            <option value="PENDING">Chờ khám</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="CHECKED_IN">Đã đến</option>
            <option value="IN_PROGRESS">Đang khám</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </CustomSelect>
          <Button onClick={() => setIsBookOpen(true)} className="h-11 rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-5 w-full sm:w-auto cursor-pointer transition-all duration-200">
            <Plus size={18} className="mr-2" /> Đăng ký khám mới
          </Button>
        </div>
      </div>

      <AppointmentFilterBar 
        search={search} setSearch={setSearch} 
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
      }} title="Hủy lịch hẹn" description={`Vui lòng nhập lý do hủy lịch hẹn của ${cancelApt?.patientName}?`} reasonLabel="Lý do hủy" confirmText="Xác nhận hủy" confirmColor="rose" />
    </div>
  );
}