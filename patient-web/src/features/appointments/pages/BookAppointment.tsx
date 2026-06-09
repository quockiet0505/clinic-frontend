import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { BookingForm } from '../components/BookingForm';
import { useToast } from '@/hooks/useToast';

export const BookAppointment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const doctorId = Number(searchParams.get('doctorId')) || undefined;
  const expertiseId = Number(searchParams.get('expertiseId')) || undefined;
  const serviceId = Number(searchParams.get('serviceId')) || undefined;

  const mode = searchParams.get('mode');

  const isDoctorBooking = !!doctorId;
  const isExpertiseBooking = !!expertiseId;
  const isServiceBooking = !!serviceId;

  const bookingMode =
    mode === 'service'
      ? 'service'
      : 'doctor';

  const handleSubmit = () => {
    toast({
      title: 'Success',
      description: 'Appointment request submitted',
    });

    navigate('/appointments/my');
  };

  console.log({
    doctorId,
    expertiseId,
    serviceId,
  });

  return (
    
    <main className="w-full min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-6xl flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0 lg:sticky top-24">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="relative h-40 w-full bg-slate-100">
              <img src="/images/clinic.jpg" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop'} alt="CLINIQA Clinic" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5">
                <h3 className="text-[11px] font-black text-white/90 uppercase tracking-widest mb-1 shadow-sm">Cơ sở Y tế</h3>
                <h2 className="text-xl font-black text-white leading-tight drop-shadow-md">Phòng khám Đa khoa CLINIQA</h2>
              </div>
            </div>

            <div className="p-6 pb-2 flex flex-col gap-5">
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-500 transition-colors">
                  <MapPin className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-brand-dark mb-0.5">Địa chỉ</h4>
                  <p className="text-[14px] text-slate-600 font-medium leading-snug">71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 flex flex-col gap-3">
                <h4 className="text-[13px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Quy định đặt khám
                </h4>
                <ul className="flex flex-col gap-2.5 text-[13px] text-amber-900/80 font-medium">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></div>
                    <span>Cho phép đặt trước tối đa <strong>14 ngày</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></div>
                    <span>Vui lòng đặt lịch trước ít nhất <strong>12 tiếng</strong> để hệ thống sắp xếp.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></div>
                    <span>Có thể huỷ lịch miễn phí trước <strong>3 tiếng</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-10">
          <BookingForm
            preselectedExpertiseId={expertiseId}
            preselectedDoctorId={doctorId}
            preselectedServiceId={serviceId}
            isDoctorBooking={isDoctorBooking}
            isExpertiseBooking={isExpertiseBooking}
            isServiceBooking={isServiceBooking}
            mode={bookingMode}
            onSubmit={handleSubmit}
          />
        </div>
      </SectionContainer>
    </main>
  );
};