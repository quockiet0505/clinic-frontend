/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { CalendarOff, CalendarDays, Plus, ClipboardList, HelpCircle, User, Activity, FlaskConical, Clock3, FileSignature, XCircle, ChevronDown, Info } from 'lucide-react';
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
  const [showGuide, setShowGuide] = useState(false);

  const STATUS_GUIDE = [
    { status: 'PENDING', label: 'Chờ xác nhận', desc: 'Đang đợi phòng khám xác nhận lịch hẹn.', icon: <HelpCircle className="w-4 h-4 text-amber-600"/>, color: 'bg-amber-100 text-amber-700' },
    { status: 'CONFIRMED', label: 'Đã xác nhận', desc: 'Lịch đã được xác nhận. Hãy đến đúng giờ.', icon: <CalendarDays className="w-4 h-4 text-emerald-600"/>, color: 'bg-emerald-100 text-emerald-700' },
    { status: 'CHECKED_IN', label: 'Đã check-in', desc: 'Đã lấy số và chờ gọi tên.', icon: <User className="w-4 h-4 text-blue-600"/>, color: 'bg-blue-100 text-blue-700' },
    { status: 'IN_PROGRESS', label: 'Đang khám', desc: 'Đang trong phòng khám với bác sĩ.', icon: <Activity className="w-4 h-4 text-indigo-600"/>, color: 'bg-indigo-100 text-indigo-700' },
    { status: 'WAITING_RESULT', label: 'Chờ kết quả', desc: 'Đang chờ kết quả cận lâm sàng.', icon: <FlaskConical className="w-4 h-4 text-purple-600"/>, color: 'bg-purple-100 text-purple-700' },
    { status: 'SKIPPED', label: 'Bị qua lượt', desc: 'Đã gọi tên nhưng bạn vắng mặt.', icon: <Clock3 className="w-4 h-4 text-orange-600"/>, color: 'bg-orange-100 text-orange-700' },
    { status: 'COMPLETED', label: 'Hoàn thành', desc: 'Quá trình khám đã kết thúc.', icon: <FileSignature className="w-4 h-4 text-slate-600"/>, color: 'bg-slate-100 text-slate-700' },
    { status: 'CANCELLED', label: 'Đã huỷ', desc: 'Lịch hẹn đã bị huỷ.', icon: <XCircle className="w-4 h-4 text-rose-600"/>, color: 'bg-rose-100 text-rose-700' },
    { status: 'NO_SHOW', label: 'Không đến', desc: 'Bạn đã không đến khám theo lịch.', icon: <CalendarOff className="w-4 h-4 text-red-600"/>, color: 'bg-red-100 text-red-700' },
  ];

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
        <div className="bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-12 px-4">
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
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-5xl relative z-10">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-3">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => window.location.href = '/'}>Trang chủ</span>
            <span className="text-white/40">/</span>
            <span className="text-white">Lịch sử đặt khám</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Lịch Sử Đặt Khám</h1>
                <p className="text-white/90 text-sm drop-shadow-sm">Quản lý và theo dõi các lịch hẹn của bạn</p>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="w-full sm:w-64">
                <SearchInput value={search} onSearch={setSearch} placeholder="Tìm theo bác sĩ, chuyên khoa..." className="h-11 shadow-md border-transparent bg-white text-slate-700 placeholder:text-slate-400 focus-within:ring-4 focus-within:ring-white/20" />
              </div>
              <a
                href="/appointments/book"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary-600 hover:bg-primary-50 font-bold text-[13px] px-6 h-11 rounded-xl shadow-sm transition-colors cursor-pointer active:scale-[0.98]"
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

        {/* Global Warning Banner for Missed Appointments */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <CalendarOff className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-[14px] font-black text-red-800">Cảnh báo quy định đặt khám</h4>
            <p className="text-[13px] font-medium text-red-700/90 mt-0.5 leading-snug">
              Hệ thống sẽ tự động <span className="font-bold underline">khóa tài khoản</span> nếu bạn có quá <span className="font-bold">3 lần</span> không đến khám (hoặc huỷ lịch đột xuất) mà không thông báo trước.
            </p>
          </div>
        </div>

        {/* Status Guide Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-500" />
              <span className="font-bold text-[14px] text-slate-700">Hướng dẫn ý nghĩa các trạng thái lịch khám</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showGuide ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`transition-all duration-300 overflow-hidden ${showGuide ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {STATUS_GUIDE.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-800 leading-none mb-1">{item.label}</h4>
                      <p className="text-[12px] font-medium text-slate-500 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
