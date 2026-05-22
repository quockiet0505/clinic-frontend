import React from 'react';

import { CalendarDays, Clock3, MapPin, Stethoscope, User } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export const AppointmentDetail: React.FC = () => {
  return (
    <main className="w-full min-h-screen bg-[#f5f7f9] py-8">
      <div className="container mx-auto max-w-4xl px-4">

        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-8">

            <h1 className="text-2xl font-bold text-[#003B5C] mb-8">
              Chi tiết lịch khám
            </h1>

            <div className="space-y-5 text-[15px]">

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <span>BS. Nguyễn Văn A</span>
              </div>

              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-slate-400" />
                <span>Tim mạch</span>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-slate-400" />
                <span>21/05/2026</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock3 className="w-5 h-5 text-slate-400" />
                <span>08:00 - 08:30</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span>Bệnh viện Nhân Dân 115</span>
              </div>

            </div>

          </CardContent>
        </Card>

      </div>
    </main>
  );
};