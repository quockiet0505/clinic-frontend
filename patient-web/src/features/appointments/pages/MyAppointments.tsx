/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { CalendarOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionContainer } from '@/components/common';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentFilterBar } from '../components/AppointmentFilterBar';
import { appointmentApi } from '../api/appointmentApi';
import type { AppointmentHistoryItem, AppointmentStatus } from '../types/appointment';
import { useToast } from '@/hooks/useToast';

export const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentHistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const data = await appointmentApi.getMyAppointments();
      setAppointments(data);
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(item => {
      const matchSearch = item.doctorName.toLowerCase().includes(search.toLowerCase()) ||
                          item.specialty.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'ALL' || item.status === status;
      return matchSearch && matchStatus;
    });
  }, [appointments, search, status]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background-light py-10">
        <SectionContainer className="max-w-5xl space-y-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="h-12 bg-slate-200 rounded-xl w-full mb-4"></div>
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
          </div>
        </SectionContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-brand-dark mb-2">Lịch sử đặt khám</h1>
            <p className="text-[14.5px] text-slate-500 font-medium">Theo dõi lịch sử và trạng thái các lịch hẹn của bạn.</p>
          </div>
          <AppointmentFilterBar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
        </div>
        <div className="flex flex-col gap-4 mt-2">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(item => (
              <AppointmentCard key={item.id} appointment={item} onCancelSuccess={fetchAppointments} />
            ))
          ) : (
            <Card className="rounded-3xl border-border-default shadow-sm p-12 text-center flex flex-col items-center justify-center bg-white">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <CalendarOff className="w-10 h-10 text-primary-500" />
              </div>
              <h2 className="text-xl font-black text-brand-dark mb-2">Chưa có lịch hẹn nào</h2>
              <p className="text-slate-500 text-[15px] font-medium max-w-md">
                Bạn chưa có lịch đặt khám nào hoặc không có lịch hẹn nào khớp với bộ lọc.
              </p>
            </Card>
          )}
        </div>
      </SectionContainer>
    </main>
  );
};