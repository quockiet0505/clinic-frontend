/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { CalendarOff, CalendarDays, Plus, History, ClipboardList } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentFilterBar } from '../components/AppointmentFilterBar';
import { appointmentApi } from '../api/appointmentApi';
import type { AppointmentHistoryItem, Doctor } from '../types/appointment';
import { useToast } from '@/hooks/useToast';

const upcomingStatuses = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'WAITING_RESULT'];
const pastStatuses = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];

export const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('ALL');
  const [serviceType, setServiceType] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');
  const { toast } = useToast();

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
        
        return {
          ...appt,
          doctorImageUrl: imageUrl,
        };
      });
      
      // Sort by date descending
      mappedAppts.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
      
      setAppointments(mappedAppts);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(item => {
      const matchSearch = item.doctorName.toLowerCase().includes(search.toLowerCase()) ||
                          item.specialty.toLowerCase().includes(search.toLowerCase()) ||
                          item.id.includes(search);
      const matchStatus = status === 'ALL' || item.status === status;
      // Note: Backend might not return exact ENUM strings for serviceName, adjust based on your API
      // If serviceName is 'Khám chuyên khoa', it's CONSULTATION, otherwise TEST
      const isConsultation = item.serviceName === 'Khám chuyên khoa' || !item.serviceName;
      const matchService = serviceType === 'ALL' || 
                           (serviceType === 'CONSULTATION' && isConsultation) ||
                           (serviceType === 'TEST' && !isConsultation);

      return matchSearch && matchStatus && matchService;
    });
  }, [appointments, search, status, serviceType]);

  const upcomingAppointments = useMemo(() => {
    return filteredAppointments.filter(item => upcomingStatuses.includes(item.status));
  }, [filteredAppointments]);

  const pastAppointments = useMemo(() => {
    return filteredAppointments.filter(item => pastStatuses.includes(item.status));
  }, [filteredAppointments]);

  const activeAppointments = useMemo(() => {
    if (activeTab === 'UPCOMING') return upcomingAppointments;
    if (activeTab === 'PAST') return pastAppointments;
    return filteredAppointments;
  }, [activeTab, filteredAppointments, upcomingAppointments, pastAppointments]);

  const renderEmptyState = (type: 'UPCOMING' | 'PAST' | 'ALL') => (
    <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
        {type === 'UPCOMING' ? <CalendarOff className="w-8 h-8 text-slate-300" /> : <ClipboardList className="w-8 h-8 text-slate-300" />}
      </div>
      <h3 className="text-[15px] font-bold text-slate-700 mb-1">Không có lịch hẹn nào</h3>
      <p className="text-slate-500 text-[13px] font-medium max-w-sm">
        {type === 'UPCOMING' ? 'Bạn hiện không có lịch khám nào đang chờ. Hãy đặt lịch mới nếu cần thiết.' : 'Không tìm thấy lịch khám nào khớp với bộ lọc của bạn.'}
      </p>
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <SectionContainer className="max-w-4xl space-y-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="h-40 bg-slate-200 rounded-3xl w-full mb-4"></div>
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
          </div>
        </SectionContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page Header Banner */}
      <div className="bg-white border-b border-slate-100 shadow-sm relative z-20">
        <SectionContainer className="max-w-6xl py-5">
          <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-6">
            <div className="shrink-0">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-400 mb-1">
                <span>Trang chủ</span>
                <span>/</span>
                <span className="text-primary-600">Lịch sử đặt khám</span>
              </div>
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary-600" />
                Lịch sử đặt khám
              </h1>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full 2xl:w-auto">
              <div className="w-full lg:w-auto flex-1">
                <AppointmentFilterBar 
                  search={search} onSearchChange={setSearch} 
                  status={status} onStatusChange={setStatus} 
                  serviceType={serviceType} onServiceTypeChange={setServiceType}
                />
              </div>
              <a
                href="/appointments/book"
                className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-[13px] px-5 h-11 rounded-full shadow-sm transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                Đặt lịch mới
              </a>
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-4xl py-8 flex flex-col">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full">
            {[
              { id: 'ALL', label: `Tất cả (${filteredAppointments.length})` },
              { id: 'UPCOMING', label: `Lịch sắp tới (${upcomingAppointments.length})` },
              { id: 'PAST', label: `Lịch đã khám (${pastAppointments.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'ALL' | 'UPCOMING' | 'PAST')}
                className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-0 mt-2">
          {activeAppointments.length > 0 
            ? activeAppointments.map(item => <AppointmentCard key={item.id} appointment={item} onCancelSuccess={fetchData} isUpcoming={upcomingStatuses.includes(item.status)} />)
            : renderEmptyState(activeTab)
          }
        </div>
      </SectionContainer>
    </main>
  );
};
