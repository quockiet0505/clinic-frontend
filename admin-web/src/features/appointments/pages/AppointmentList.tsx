import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Activity } from 'lucide-react';
import { AppointmentFilterBar } from '../components/AppointmentFilterBar';
import AppointmentFormDialog from '../components/AppointmentFormDialog';
import TransferDoctorDialog from '../components/TransferDoctorDialog';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import AppointmentRescheduleDialog from '../components/AppointmentRescheduleDialog';
import FormDialog from '@/components/common/FormDialog';
import GradientButton from '@/components/common/GradientButton';
import { Plus } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types/appointment';
import { appointmentApi } from '../api/appointmentApi';
import AppointmentTable from '../components/AppointmentTable';
import PageHeader from '@/components/common/PageHeader';

export default function AppointmentList() {
  // ---- Data & Pagination ----
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // ---- Filters ----
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [source, setSource] = useState('ALL');
  const [serviceAdvanced, setServiceAdvanced] = useState('ALL');

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);
  const [transferApt, setTransferApt] = useState<Appointment | null>(null);
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [checkInAptId, setCheckInAptId] = useState<number | null>(null);

  // ---- Fetch data ----
  const fetchData = useCallback(async () => {
    try {
      const res = await appointmentApi.getAllPaged({
        search: search || undefined,
        status: status === 'ALL' ? undefined : status,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        tab: activeTab === 'all' ? undefined : activeTab,
        source: source === 'ALL' ? undefined : source,
        serviceType: serviceAdvanced === 'ALL' ? undefined : serviceAdvanced,
        page: currentPage - 1,
        size: pageSize,
        ...(activeTab === 'queue'
          ? { sortBy: 'queueNumber', sortDir: 'ASC' as const }
          : {}),
      });
      setAppointments(Array.isArray(res.content) ? res.content : []);
      setTotalElements(res.totalElements ?? 0);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      setTotalElements(0);
    }
  }, [search, status, activeTab, fromDate, toDate, source, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page về 1 khi filter thay đổi
  const resetPage = useCallback(() => setCurrentPage(1), []);
  useEffect(() => {
    resetPage();
  }, [search, status, activeTab, fromDate, toDate, source]);

  // ---- Stats (chỉ tính trên trang hiện tại – cần endpoint riêng sau) ----
  const pendingCount = (appointments || []).filter(a => a.status === 'PENDING').length;
  const inProgressCount = (appointments || []).filter(a => a.status === 'IN_PROGRESS').length;

  // ---- Handlers ----
  const handleCheckIn = async (data: any) => {
    if (!checkInAptId) return;
    try {
      const isPriority = data.isPriority === true;
      await appointmentApi.checkIn(checkInAptId, isPriority);
      fetchData();
      setCheckInAptId(null);
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      await appointmentApi.confirm(id);
      fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleCancel = async (id: number, reason: string) => {
    try {
      await appointmentApi.cancel(id, reason);
      fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleBookWalkIn = async (data: any) => {
    try {
      await appointmentApi.createWalkIn(data);
      fetchData();
      setIsBookOpen(false);
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleTransfer = async (data: any) => {
    if (!transferApt || !data.newDoctorId) return;
    try {
      await appointmentApi.transfer(transferApt.appointmentId, Number(data.newDoctorId));
      fetchData();
      setTransferApt(null);
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleCallPatient = async (id: number) => {
    try {
      await appointmentApi.callPatient(id);
      fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleSkipPatient = async (id: number) => {
    try {
      await appointmentApi.skipPatient(id);
      fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleReturnToQueue = async (id: number) => {
    try {
      await appointmentApi.returnToQueue(id);
      fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleSendToLab = async (id: number) => {
    try {
      await appointmentApi.sendToLab(id);
      fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleReturnFromLab = async (id: number) => {
    try {
      await appointmentApi.returnFromLab(id);
      fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await appointmentApi.complete(id);
      fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };

  // ---- Render ----
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      {/* Header + Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Lịch hẹn" description="Quản lý đặt lịch khám." />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chờ xác nhận</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center font-bold">
              <Activity size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đang khám</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{inProgressCount}</p>
            </div>
          </div>
          <GradientButton onClick={() => setIsBookOpen(true)} className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" /> Đăng ký khám mới
          </GradientButton>
        </div>
      </div>

      {/* Filter Bar */}
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

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <AppointmentTable
          data={appointments}
          onCheckIn={setCheckInAptId}
          onConfirm={handleConfirm}
          onCancel={setCancelApt}
          onTransfer={setTransferApt}
          onReschedule={setRescheduleApt}
          onCall={handleCallPatient}
          onSkip={handleSkipPatient}
          onReturnToQueue={handleReturnToQueue}
          onSendToLab={handleSendToLab}
          onReturnFromLab={handleReturnFromLab}
          onComplete={handleComplete}
          loading={false}
          pagination={{
            page: currentPage,
            size: pageSize,
            total: totalElements,
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      {/* Dialogs */}
      <AppointmentFormDialog
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        onBook={handleBookWalkIn}
      />

      <TransferDoctorDialog
        isOpen={!!transferApt}
        onClose={() => setTransferApt(null)}
        onTransfer={handleTransfer}
        appointment={transferApt}
      />

      <AppointmentRescheduleDialog
        isOpen={!!rescheduleApt}
        onClose={() => setRescheduleApt(null)}
        appointment={rescheduleApt}
        onRescheduled={() => fetchData()}
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

      <FormDialog
        open={!!checkInAptId}
        onClose={() => setCheckInAptId(null)}
        title="Check-in Bệnh nhân"
        description="Xác nhận bệnh nhân đã đến phòng khám."
        fields={[
          {
            name: 'isPriority',
            label: 'Khách ưu tiên (Cấp cứu / Người già / VIP)',
            type: 'checkbox'
          }
        ]}
        onSubmit={handleCheckIn}
        submitLabel="Xác nhận Check-in"
        compact
      />
    </div>
  );
}