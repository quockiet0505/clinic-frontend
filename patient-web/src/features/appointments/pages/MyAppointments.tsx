/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { CalendarOff, CalendarDays, Plus, ClipboardList } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { SearchInput } from '@/components/common/SearchInput';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentFilterBar } from '../components/AppointmentFilterBar';
import { appointmentApi } from '../api/appointmentApi';
import type { AppointmentHistoryItem } from '../types/appointment';

const upcomingStatuses = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'WAITING_RESULT'];
const pastStatuses = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];

export const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('ALL');
  const [serviceType, setServiceType] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptData, doctorsData] = await Promise.all([
        appointmentApi.getMyAppointments(),
        appointmentApi.getDoctors().catch(() => []),
      ]);
      
      const doctorsMap = new Map(doctorsData.map(d => [d.staffId, d.imageUrl]));
      
      const mappedAppts = apptData.map(appt => {
        let imageUrl = appt.mainDoctorId ? doctorsMap.get(appt.mainDoctorId) : undefined;
        if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = `http://localhost:8080${imageUrl}`;
        }
        return { ...appt, doctorImageUrl: imageUrl };
      });
      
      mappedAppts.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
      setAppointments(mappedAppts);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(item => {
      const matchSearch = item.doctorName.toLowerCase().includes(search.toLowerCase()) ||
                          item.specialty.toLowerCase().includes(search.toLowerCase()) ||
                          item.id.includes(search);
      const matchStatus = status === 'ALL' || item.status === status;
      const matchService = serviceType === 'ALL' || item.serviceType === serviceType;

      return matchSearch && matchStatus && matchService;
    });
  }, [appointments, search, status, serviceType]);

  const upcomingAppointments = useMemo(() => filteredAppointments.filter(item => upcomingStatuses.includes(item.status)), [filteredAppointments]);
  const pastAppointments = useMemo(() => filteredAppointments.filter(item => pastStatuses.includes(item.status)), [filteredAppointments]);

  const activeAppointments = useMemo(() => {
    if (activeTab === 'UPCOMING') return upcomingAppointments;
    if (activeTab === 'PAST') return pastAppointments;
    return filteredAppointments;
  }, [activeTab, filteredAppointments, upcomingAppointments, pastAppointments]);

  const renderEmptyState = (type: 'UPCOMING' | 'PAST' | 'ALL') => (
    <div className="rounded-2xl border border-dashed border-slate-200 p-14 text-center flex flex-col items-center justify-center bg-white mt-2 shadow-sm">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        {type === 'UPCOMING' ? <CalendarOff className="w-10 h-10 text-slate-300" /> : <ClipboardList className="w-10 h-10 text-slate-300" />}
      </div>
      <h3 className="text-[17px] font-black text-brand-dark mb-1">Không có lịch hẹn nào</h3>
      <p className="text-slate-500 text-[14px] font-medium max-w-sm mt-1">
        {type === 'UPCOMING' ? 'Bạn hiện không có lịch khám nào đang chờ. Hãy đặt lịch mới nếu cần thiết.' : 'Không tìm thấy lịch khám nào khớp với bộ lọc của bạn.'}
      </p>
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f9ff]">
        <div className="bg-brand-dark py-12 px-4">
          <SectionContainer className="max-w-5xl">
            <div className="h-5 bg-white/10 rounded w-32 mb-3 animate-pulse" />
            <div className="h-8 bg-white/10 rounded w-52 animate-pulse" />
          </SectionContainer>
        </div>
        <SectionContainer className="max-w-5xl py-8 flex flex-col gap-5">
          <div className="h-12 bg-white rounded-xl w-full border border-slate-200 animate-pulse" />
          <div className="h-40 bg-white rounded-3xl w-full border border-slate-200 animate-pulse" />
          <div className="h-40 bg-white rounded-3xl w-full border border-slate-200 animate-pulse" />
        </SectionContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-brand-dark py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-5xl relative z-10">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-primary-400 mb-3">
            <span>Trang chủ</span><span className="text-white/20">/</span>
            <span className="text-primary-200">Lịch sử đặt khám</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-2xl flex items-center justify-center border border-primary-400/30">
                <CalendarDays className="w-5 h-5 text-primary-300" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Lịch Sử Đặt Khám</h1>
                <p className="text-primary-300 text-sm">Quản lý và theo dõi các lịch hẹn của bạn</p>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="w-full sm:w-64">
                <SearchInput value={search} onSearch={setSearch} placeholder="Tìm theo bác sĩ, chuyên khoa..." className="h-11 shadow-sm" />
              </div>
              <a
                href="/appointments/book"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-[13px] px-6 h-11 rounded-xl shadow-sm transition-colors cursor-pointer active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Đặt lịch mới
              </a>
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-5xl py-8 flex flex-col gap-6">
        {/* Toolbar: Tabs & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Tabs - Modern Segmented Control */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100/80 border border-slate-200/60 rounded-[14px] hide-scrollbar w-full lg:w-auto shrink-0">
            {[
              { id: 'ALL', label: `Tất cả (${filteredAppointments.length})` },
              { id: 'UPCOMING', label: `Sắp tới (${upcomingAppointments.length})` },
              { id: 'PAST', label: `Đã khám (${pastAppointments.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'ALL' | 'UPCOMING' | 'PAST')}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-white text-primary-600 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-slate-200/50' 
                    : 'bg-transparent text-slate-500 border border-transparent hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex-1 w-full lg:w-auto flex justify-end">
            <AppointmentFilterBar 
              status={status as any} onStatusChange={setStatus} 
              serviceType={serviceType as any} onServiceTypeChange={setServiceType}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {activeAppointments.length > 0 
            ? activeAppointments.map(item => <AppointmentCard key={item.id} appointment={item} onCancelSuccess={fetchData} isUpcoming={upcomingStatuses.includes(item.status)} />)
            : renderEmptyState(activeTab)
          }
        </div>
      </SectionContainer>
    </main>
  );
};
