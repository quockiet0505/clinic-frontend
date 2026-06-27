import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, CalendarClock, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { BookingForm } from '../components/BookingForm';
const STEPS = [
  { label: 'Dịch vụ & Bác sĩ', icon: '01' },
  { label: 'Ngày & Giờ', icon: '02' },
  { label: 'Xác nhận', icon: '03' },
];

const RULES = [
  { icon: <CalendarClock className="w-4 h-4" />, text: 'Đặt trước tối đa <strong>7 ngày</strong>' },
  { icon: <Clock className="w-4 h-4" />, text: 'Cần đặt trước ít nhất <strong>24 giờ</strong>' },
  { icon: <AlertCircle className="w-4 h-4" />, text: 'Huỷ miễn phí trước <strong>3 tiếng</strong>' },
];

const GUARANTEES = [
  'Bảo mật thông tin tuyệt đối',
  'Xác nhận lịch trong 30 phút',
  'Hủy lịch không mất phí',
];

export const BookAppointment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctorId = Number(searchParams.get('doctorId')) || undefined;
  const expertiseId = Number(searchParams.get('expertiseId')) || undefined;
  const serviceId = Number(searchParams.get('serviceId')) || undefined;
  const suggestedExpertiseId = Number(searchParams.get('suggestedExpertiseId')) || undefined;
  const isAiSuggested = searchParams.get('isAiSuggested') === '1';
  const mode = searchParams.get('mode');

  const isDoctorBooking = !!doctorId;
  const isServiceBooking = !!serviceId || mode === 'service';
  const bookingMode = mode === 'service' ? 'service' : 'doctor';

  const handleSubmit = () => {
    navigate('/appointments/my');
  };

  return (
    <main className="w-full min-h-screen bg-[#f0f9ff]">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <SectionContainer className="max-w-6xl relative z-10">
          {/* breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-4">
            <span
              className="hover:text-white cursor-pointer transition-colors"
              onClick={() => navigate('/')}
            >Trang chủ</span>
            <span className="text-white/40">/</span>
            <span className="text-white">Đặt lịch khám</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  Đặt Lịch Khám Trực Tuyến
                </h1>
              </div>
              <p className="text-white/90 text-sm ml-[52px] drop-shadow-sm">Đặt lịch nhanh, xác nhận ngay — không cần chờ đợi.</p>
            </div>

            {/* Step progress */}
            <div className="hidden md:flex items-center gap-0 shrink-0">
              {STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold transition-all ${i === 0 ? 'bg-white text-primary-600 shadow-md' : 'bg-white/10 text-white/80 border border-white/20'
                    }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-primary-100 text-primary-600' : 'bg-white/20'
                      }`}>{step.icon}</span>
                    {step.label}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-5 h-0.5 ${i === 0 ? 'bg-white/50' : 'bg-white/20'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </SectionContainer>
      </div>

      {/* ── Body ── */}
      <SectionContainer className="max-w-6xl py-8 flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Sidebar ── */}
        <div className="w-full lg:w-[280px] flex flex-col gap-4 shrink-0 lg:sticky top-24">
          {/* Clinic photo card */}
          <div className="rounded-2xl overflow-hidden border border-primary-100 shadow-sm">
            <div className="relative h-36 w-full">
              <img
                src="/images/clinic.jpg"
                onError={e => e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop'}
                alt="Phòng khám"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest mb-0.5">Cơ sở Y tế</p>
                <h2 className="text-[14px] font-black text-white leading-tight">Phòng khám Đa khoa CLINIQA</h2>
              </div>
            </div>
            <div className="bg-white px-4 py-3 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary-400 mt-0.5 shrink-0" />
              <p className="text-[12px] text-slate-500 leading-relaxed">71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM</p>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white border border-amber-200/70 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h4 className="text-[11px] font-black text-amber-700 uppercase tracking-widest">Quy định đặt khám</h4>
            </div>
            <div className="flex flex-col gap-2.5">
              {RULES.map((rule, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-amber-500 mt-0.5 shrink-0">{rule.icon}</span>
                  <span
                    className="text-[13px] text-amber-900/80 font-medium leading-snug"
                    dangerouslySetInnerHTML={{ __html: rule.text }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-amber-100 flex items-start gap-2 bg-red-50/50 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-[12px] text-red-600 font-bold leading-snug">Cảnh báo: Nếu huỷ hoặc không đến khám quá 3 lần, tài khoản của bạn sẽ bị khoá tự động.</p>
            </div>
          </div>

          {/* Guarantees */}
          <div className="bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
            <h4 className="text-[11px] font-black text-primary-400 uppercase tracking-widest mb-3">Cam kết của chúng tôi</h4>
            <div className="flex flex-col gap-2.5">
              {GUARANTEES.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-[13px] text-slate-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotline */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-4 shadow-md">
            <p className="text-[10px] font-black text-primary-100 uppercase tracking-widest mb-1">Cần hỗ trợ?</p>
            <p className="text-white font-black text-xl tracking-tight">1900 2115</p>
            <p className="text-primary-200 text-[12px] mt-0.5">Hotline 24/7 — Miễn phí</p>
          </div>
        </div>

        {/* ── Main Form Area ── */}
        <div className="flex-1 w-full">
          <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
            {/* Form header */}
            <div className="px-7 py-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center shadow-sm shadow-primary-200">
                <CalendarClock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-black text-brand-dark text-[16px]">Thông tin đặt khám</h2>
                <p className="text-[12px] text-slate-500 font-medium">Điền đầy đủ để đặt lịch thành công</p>
              </div>
            </div>

            {/* Mobile steps */}
            <div className="md:hidden px-7 pt-4 flex items-center gap-1.5 overflow-x-auto">
              {STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${i === 0 ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                    <span>{step.icon}</span>
                    {step.label}
                  </div>
                  {i < STEPS.length - 1 && <div className="w-4 h-0.5 bg-slate-200 shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            <div className="p-6 md:p-8">
              <BookingForm
                preselectedExpertiseId={expertiseId}
                preselectedDoctorId={doctorId}
                preselectedServiceId={serviceId}
                preselectedSuggestedExpertiseId={suggestedExpertiseId}
                isAiSuggested={isAiSuggested}
                isDoctorBooking={isDoctorBooking}
                isServiceBooking={isServiceBooking}
                mode={bookingMode}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3">
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-primary-500" />, text: 'Bảo mật SSL' },
              { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, text: 'Đặt lịch miễn phí' },
              { icon: <Clock className="w-4 h-4 text-primary-400" />, text: 'Xác nhận trong 30 phút' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </main>
  );
};