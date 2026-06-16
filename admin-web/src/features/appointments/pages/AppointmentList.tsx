import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import { AppointmentFilterBar } from '../components/AppointmentFilterBar';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentFormDialog from '../components/AppointmentFormDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types/appointment';
import { appointmentApi } from '../api/appointmentApi';

const TODAY = new Date().toISOString().split('T')[0];

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [serviceType, setServiceType] = useState<'ALL' | 'CONSULTATION' | 'TEST'>('ALL');
  const [activeTab, setActiveTab] = useState('all'); // all, today, upcoming
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

  // Lọc dữ liệu
  const filtered = appointments.filter(a => {
    // Search
    const matchesSearch = a.patientName.toLowerCase().includes(search.toLowerCase());
    // Status
    const matchesStatus = status === 'ALL' || a.status === status;
    // Service type (giả sử appointment có field serviceType hoặc dựa vào appointmentType)
    const matchesService = serviceType === 'ALL' || a.appointmentType === serviceType;
    // Date range
    const matchesFrom = !fromDate || a.appointmentDate >= fromDate;
    const matchesTo = !toDate || a.appointmentDate <= toDate;
    // Tab filter
    let matchesTab = true;
    if (activeTab === 'today') {
      matchesTab = a.appointmentDate === TODAY;
    } else if (activeTab === 'upcoming') {
      matchesTab = a.appointmentDate > TODAY;
    }
    return matchesSearch && matchesStatus && matchesService && matchesFrom && matchesTo && matchesTab;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lịch Hẹn</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý đặt lịch khám và khách vãng lai.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => setIsBookOpen(true)} className="h-11 rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-5 w-full sm:w-auto cursor-pointer transition-all duration-200">
            <Plus size={18} className="mr-2" /> Đăng ký khám mới
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Filter bar */}
        <AppointmentFilterBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          serviceType={serviceType}
          onServiceTypeChange={setServiceType}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Date range filter */}
        <div className="flex flex-wrap items-center gap-3">
          <DateRangeFilter
            from={fromDate}
            to={toDate}
            onChangeFrom={setFromDate}
            onChangeTo={setToDate}
          />
        </div>
      </div>

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

      <AppointmentFormDialog
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        onBook={(data: any) => {
          setAppointments([{
            ...data,
            appointmentId: Date.now(),
            patientName: 'New Patient',
            doctorName: 'Assigned Doctor',
            appointmentType: 'WALK_IN',
            status: 'PENDING',
            createdBy: 'STAFF'
          }, ...appointments]);
          setIsBookOpen(false);
        }}
      />

      <ActionReasonDialog
        isOpen={!!cancelApt}
        onClose={() => setCancelApt(null)}
        onConfirm={async (actor, reason) => {
          if (cancelApt) {
            await appointmentApi.cancel(cancelApt.appointmentId, reason);
            setAppointments(appointments.map(a =>
              a.appointmentId === cancelApt.appointmentId ? { ...a, status: 'CANCELLED', cancelReason: reason, cancelledBy: 'CLINIC' } : a
            ));
          }
          setCancelApt(null);
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