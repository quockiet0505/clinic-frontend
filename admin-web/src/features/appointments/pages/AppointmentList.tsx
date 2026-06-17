// features/appointments/pages/AppointmentList.tsx
import React, { useState, useMemo } from 'react';
import { Clock, Activity } from 'lucide-react';
import { AppointmentFilterBar } from '../components/AppointmentFilterBar';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentFormDialog from '../components/AppointmentFormDialog';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import GradientButton from '@/components/common/GradientButton';
import { Plus } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types/appointment';
import { appointmentApi } from '../api/appointmentApi';
import PageHeader from '@/components/common/PageHeader';

const TODAY = new Date().toISOString().split('T')[0];

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [source, setSource] = useState('ALL');
  const [serviceAdvanced, setServiceAdvanced] = useState('ALL');

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);

  React.useEffect(() => {
    appointmentApi.getAll().then((data) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'PENDING').length;
    const inProgress = appointments.filter(a => a.status === 'IN_PROGRESS').length;
    return { total, pending, inProgress };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesSearch = a.patientName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'ALL' || a.status === status;
      const matchesFrom = !fromDate || a.appointmentDate >= fromDate;
      const matchesTo = !toDate || a.appointmentDate <= toDate;
      const matchesSource = source === 'ALL' || a.source === source;
      const matchesServiceAdv = serviceAdvanced === 'ALL' || a.appointmentType === serviceAdvanced;

      let matchesTab = true;
      if (activeTab === 'today') matchesTab = a.appointmentDate === TODAY;
      else if (activeTab === 'upcoming') matchesTab = a.appointmentDate > TODAY;

      return matchesSearch && matchesStatus && matchesFrom && matchesTo && matchesSource && matchesServiceAdv && matchesTab;
    });
  }, [appointments, search, status, activeTab, fromDate, toDate, source, serviceAdvanced]);

  const handleCheckIn = async (id: number) => {
    await appointmentApi.checkIn(id);
    setAppointments((prev) =>
      prev.map((a) => (a.appointmentId === id ? { ...a, status: 'CHECKED_IN' } : a))
    );
  };

  const handleCancel = async (id: number, reason: string) => {
    await appointmentApi.cancel(id, reason);
    setAppointments((prev) =>
      prev.map((a) =>
        a.appointmentId === id ? { ...a, status: 'CANCELLED', cancelReason: reason } : a
      )
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <PageHeader title="Lịch hẹn" description="Quản lý đặt lịch khám."></PageHeader>
                
        
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chờ xác nhận</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center font-bold">
              <Activity size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đang khám</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{stats.inProgress}</p>
            </div>
          </div>
          <GradientButton onClick={() => setIsBookOpen(true)} className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" /> Đăng ký khám mới
          </GradientButton>
        </div>
      </div>

      <AppointmentFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        source={source}
        onSourceChange={setSource}
        serviceAdvanced={serviceAdvanced}
        onServiceAdvancedChange={setServiceAdvanced}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải lịch hẹn...</div>
      ) : (
        <div className="flex-1 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <AppointmentTable
            data={filteredAppointments}
            onCheckIn={handleCheckIn}
            onCancel={(apt) => setCancelApt(apt)}
          />
        </div>
      )}

      <AppointmentFormDialog
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        onBook={(data) => {
          const newApt: Appointment = {
            ...data,
            appointmentId: Date.now(),
            patientName: data.patientName || 'New Patient',
            doctorName: data.doctorName || 'Assigned Doctor',
            appointmentType: data.appointmentType || 'WALK_IN',
            status: 'PENDING',
            createdBy: 'STAFF',
            appointmentDate: data.appointmentDate || TODAY,
            source: data.source || 'WALK_IN',
          };
          setAppointments((prev) => [newApt, ...prev]);
          setIsBookOpen(false);
        }}
      />

      <ActionReasonDialog
        isOpen={!!cancelApt}
        onClose={() => setCancelApt(null)}
        onConfirm={async (actor, reason) => {
          if (cancelApt) {
            await handleCancel(cancelApt.appointmentId, reason);
            setCancelApt(null);
          }
        }}
        title="Hủy lịch hẹn"
        description={`Vui lòng nhập lý do hủy lịch hẹn của ${cancelApt?.patientName}?`}
        reasonLabel="Lý do hủy"
        confirmText="Xác nhận hủy"
        confirmColor="rose"
      />
    </div>
  );
}