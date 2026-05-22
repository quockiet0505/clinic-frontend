import React, { useMemo, useState } from 'react';

import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentFilterBar } from '../components/AppointmentFilterBar';

import { appointmentApi } from '../api/appointmentApi';

export const MyAppointments: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  const appointments = appointmentApi.getAppointmentHistory();

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchedSearch =
        item.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        item.expertiseName.toLowerCase().includes(search.toLowerCase());

      const matchedStatus =
        status === 'ALL' || item.status === status;

      return matchedSearch && matchedStatus;
    });
  }, [appointments, search, status]);

  return (
    <main className="min-h-screen bg-[#f5f7f9] py-10">

      <div className="container mx-auto px-4 max-w-6xl space-y-6">

        <div>
          <h1 className="text-3xl font-black text-[#003B5C]">
            Lịch khám của tôi
          </h1>

          <p className="text-slate-500 mt-2">
            Theo dõi trạng thái và lịch sử đặt khám.
          </p>
        </div>

        <AppointmentFilterBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />

        <div className="space-y-5">
          {filteredAppointments.map((item) => (
            <AppointmentCard
              key={item.id}
              data={item}
            />
          ))}
        </div>

      </div>

    </main>
  );
};