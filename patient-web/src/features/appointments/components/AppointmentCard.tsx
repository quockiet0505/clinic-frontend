import React from 'react';

import { CalendarDays, Clock3, MapPin, Stethoscope, User } from 'lucide-react';

import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { StatusBadge } from '@/components/common';

import type { AppointmentHistory } from '../types/appointment';

interface Props {
  data: AppointmentHistory;
}

export const AppointmentCard: React.FC<Props> = ({ data }) => {
  return (
    <Card className="rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        <div className="flex-1 space-y-4">

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={data.status} />

            <div className="flex items-center gap-1 text-[#00b5f1] text-sm font-semibold">
              <CalendarDays className="w-4 h-4" />
              {data.appointmentDate}
            </div>

            <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold">
              <Clock3 className="w-4 h-4" />
              {data.timeStart} - {data.timeEnd}
            </div>
          </div>

          <div className="space-y-2 text-[15px]">

            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-[#003B5C]">
                {data.doctorName}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Stethoscope className="w-4 h-4 text-slate-400" />
              {data.expertiseName}
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400" />
              {data.clinicName}
            </div>

          </div>
        </div>

        <Link to={`/appointments/detail/${data.id}`}>
          <Button
            variant="outline"
            className="border-[#00b5f1] text-[#00b5f1] hover:bg-[#f0f9ff] rounded-xl"
          >
            Xem chi tiết
          </Button>
        </Link>

      </CardContent>
    </Card>
  );
};