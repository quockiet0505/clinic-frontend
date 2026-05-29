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
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load appointments', variant: 'destructive' });
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
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-brand-dark mb-2">My Appointments</h1>
          <p className="text-sm text-slate-500">Track your appointment history and status.</p>
        </div>
        <AppointmentFilterBar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
        <div className="flex flex-col gap-4 mt-2">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(item => (
              <AppointmentCard key={item.id} appointment={item} onCancelSuccess={fetchAppointments} />
            ))
          ) : (
            <Card className="rounded-3xl p-16 text-center">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarOff className="w-10 h-10 text-primary-500" />
              </div>
              <h2 className="text-xl font-black text-brand-dark mb-2">No appointments found</h2>
              <p className="text-slate-500 text-sm">You have no appointments matching your filters.</p>
            </Card>
          )}
        </div>
      </SectionContainer>
    </main>
  );
};