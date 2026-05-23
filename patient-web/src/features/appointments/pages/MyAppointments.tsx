import React, { useEffect, useState, useMemo } from 'react';
import { CalendarOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionContainer } from '@/components/common';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentFilterBar } from '../components/AppointmentFilterBar';
import { appointmentApi } from '../api/appointmentApi';
import type { AppointmentHistoryItem, AppointmentStatus } from '../types/appointment';

export const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentHistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | 'ALL'>('ALL');

  const fetchAppointments = async () => {
    try {
      // FIX 1: Gọi đúng tên hàm getMyAppointments
      const data = await appointmentApi.getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  // FIX 2: Bỏ gọi API vào useEffect
  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      // FIX 3: Sửa expertiseName thành specialty
      const matchedSearch =
        item.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        item.specialty.toLowerCase().includes(search.toLowerCase());

      const matchedStatus =
        status === 'ALL' || 
        (status === 'CONFIRMED' && (item.status === 'CONFIRMED' || item.status === 'PENDING')) ||
        item.status === status;

      return matchedSearch && matchedStatus;
    });
  }, [appointments, search, status]);

  return (
    <main className="min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-5xl space-y-6">
        
        <div>
          <h1 className="text-2xl font-black text-brand-dark mb-2">Lịch khám của tôi</h1>
          <p className="text-[14.5px] text-slate-500 font-medium">Theo dõi trạng thái và lịch sử đặt khám.</p>
        </div>

        {/* Thanh Filter & Search gộp chung */}
        <AppointmentFilterBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />

        <div className="flex flex-col gap-4 mt-2">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((item) => (
              <AppointmentCard
                key={item.id}
                appointment={item}
                onCancelSuccess={fetchAppointments}
              />
            ))
          ) : (
            <Card className="rounded-3xl border-border-default shadow-sm p-16 text-center flex flex-col items-center justify-center bg-white mt-4">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <CalendarOff className="w-10 h-10 text-primary-500" />
              </div>
              <h2 className="text-xl font-black text-brand-dark mb-2">Không tìm thấy lịch khám</h2>
              <p className="text-slate-500 text-[15px] font-medium max-w-md">
                Bạn chưa có lịch hẹn nào phù hợp với bộ lọc hiện tại.
              </p>
            </Card>
          )}
        </div>

      </SectionContainer>
    </main>
  );
};