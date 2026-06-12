import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, CheckCircle, CalendarClock } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { BookingForm } from '../components/BookingForm';
import { useToast } from '@/hooks/useToast';

const STEPS = [
  { label: 'Chọn dịch vụ & bác sĩ' },
  { label: 'Chọn ngày & giờ' },
  { label: 'Xác nhận thông tin' },
];

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
  const bookingMode = mode === 'service' ? 'service' : 'doctor';

  const handleSubmit = () => {
    toast({ title: 'Thành công', description: 'Lịch khám đã được đặt thành công!' });
    navigate('/appointments/my');
  };

  return (
    <main className="w-full min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <SectionContainer className="max-w-6xl py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-400 mb-1">
                <span>Trang chủ</span>
                <span>/</span>
                <span className="text-blue-600">Đặt lịch khám</span>
              </div>
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-600" />
                Đặt Lịch Khám Trực Tuyến
              </h1>
            </div>
            {/* Step indicators */}
            <div className="hidden md:flex items-center gap-0">
              {STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${i === 0 ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {i + 1}
                    </span>
                    {step.label}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-6 h-0.5 ${i === 0 ? 'bg-blue-300' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-6xl py-8 flex flex-col lg:flex-row gap-7 items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-[300px] flex flex-col gap-4 shrink-0 lg:sticky top-24">
          {/* Clinic card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="relative h-36 w-full">
              <img
                src="/images/clinic.jpg"
                onError={e => e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop'}
                alt="CLINIQA Clinic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-0.5">Cơ sở Y tế</p>
                <h2 className="text-[15px] font-black text-white leading-tight">Phòng khám Đa khoa CLINIQA</h2>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4">
            <h4 className="text-[12px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Quy định đặt khám
            </h4>
            <ul className="flex flex-col gap-2.5 text-[13px] text-amber-900/80 font-medium">
              {[
                'Đặt trước tối đa <strong>14 ngày</strong>',
                'Cần đặt trước ít nhất <strong>12 tiếng</strong>',
                'Huỷ miễn phí trước <strong>3 tiếng</strong>',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantee */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-wider mb-3">Cam kết của chúng tôi</h4>
            <div className="flex flex-col gap-2.5">
              {['Bảo mật thông tin tuyệt đối', 'Xác nhận lịch trong 30 phút', 'Hủy lịch không mất phí'].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Booking Form */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-[16px]">Thông tin đặt khám</h2>
              <p className="text-[12px] text-slate-500 font-medium">Điền đầy đủ thông tin để đặt lịch thành công</p>
            </div>
          </div>
          <div className="p-6 md:p-8">
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
        </div>
      </SectionContainer>
    </main>
  );
};