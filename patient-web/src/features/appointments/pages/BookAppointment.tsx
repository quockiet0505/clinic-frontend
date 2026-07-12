import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, CalendarClock, Clock, AlertCircle, Phone, ShieldCheck } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { BookingForm } from '../components/BookingForm';

const STEPS = [
  { label: 'Dịch vụ & Bác sĩ', icon: '01' },
  { label: 'Ngày & Giờ', icon: '02' },
  { label: 'Xác nhận', icon: '03' },
];

const RULES = [
  { icon: <CalendarClock className="w-3.5 h-3.5" />, text: 'Đặt trước tối đa <strong>7 ngày</strong>' },
  { icon: <Clock className="w-3.5 h-3.5" />, text: 'Cần đặt trước ít nhất <strong>24 giờ</strong>' },
  { icon: <AlertCircle className="w-3.5 h-3.5" />, text: 'Huỷ miễn phí trước <strong>3 tiếng</strong>' },
];

export const BookAppointment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/auth/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search), { replace: true });
    }
  }, [navigate]);

  // ── Kết nối banner steps với form ──
  const [activeStep, setActiveStep] = useState(0);

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
    <main className="w-full min-h-[100dvh] bg-[#f0f9ff]">

      {/* ── Banner ── giữ nguyên gradient, steps track theo form */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <SectionContainer className="max-w-6xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-4">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/')}>
              Trang chủ
            </span>
            <span className="text-white/40">/</span>
            <span className="text-white">Đặt lịch khám</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  Đặt Lịch Khám Trực Tuyến
                </h1>
              </div>
              <p className="text-white/90 text-sm ml-[52px] drop-shadow-sm">
                Đặt lịch nhanh, xác nhận ngay — không cần chờ đợi.
              </p>
            </div>

            {/* Steps - desktop: track theo form */}
            <div className="hidden md:flex items-center gap-0 shrink-0">
              {STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 ${
                    i === activeStep
                      ? 'bg-white text-primary-600 shadow-md'
                      : i < activeStep
                      ? 'bg-white/25 text-white border border-white/30'
                      : 'bg-white/10 text-white/60 border border-white/15'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                      i < activeStep
                        ? 'bg-white text-primary-600'
                        : i === activeStep
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-white/20'
                    }`}>
                      {i < activeStep ? '✓' : step.icon}
                    </span>
                    {step.label}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-5 h-0.5 transition-all duration-300 ${
                      i < activeStep ? 'bg-white/60' : 'bg-white/20'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </SectionContainer>
      </div>

      {/* ── Body ── */}
      <SectionContainer className="max-w-6xl py-8 flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Sidebar: 2 card ── */}
        <aside className="w-full lg:w-[264px] flex flex-col gap-4 shrink-0 lg:sticky top-24">

          {/* Card 1: Phòng khám */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="relative h-36 w-full">
              <img
                src="/images/clinic.jpg"
                onError={e => e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop'}
                alt="Phòng khám Cliniqa"
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
              <p className="text-[12px] text-slate-500 leading-relaxed">
                71-73 Ngô Thời Nhiệm, P. Võ Thị Sáu, Q.3, TP.HCM
              </p>
            </div>
          </div>

          {/* Card 2: Quy định + Hotline gộp, màu trung tính */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Quy định đặt khám</h4>
              <div className="flex flex-col gap-2.5">
                {RULES.map((rule, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-primary-400 mt-0.5 shrink-0">{rule.icon}</span>
                    <span
                      className="text-[12.5px] text-slate-600 font-medium leading-snug"
                      dangerouslySetInnerHTML={{ __html: rule.text }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-start gap-1.5 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11.5px] text-slate-500 leading-snug">
                  Hủy hoặc vắng quá 3 lần sẽ bị khóa tài khoản tự động.
                </p>
              </div>
            </div>

            {/* Hotline tích hợp ngay vào card */}
            <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">Cần hỗ trợ?</p>
                <p className="text-[16px] font-black text-primary-600 tracking-tight">1900 2115</p>
                <p className="text-[11px] text-slate-400">Hotline 24/7 — Miễn phí</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary-500" />
              </div>
            </div>
          </div>

          {/* Cam kết nhỏ gọn — không cần card riêng */}
          <div className="flex flex-col gap-2 px-1">
            {[
              { icon: <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />, text: 'Bảo mật thông tin' },
              { icon: <CalendarClock className="w-3.5 h-3.5 text-primary-500" />, text: 'Xác nhận trong 30 phút' },
              { icon: <Clock className="w-3.5 h-3.5 text-primary-500" />, text: 'Hủy lịch miễn phí' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.icon}
                <span className="text-[12px] text-slate-500">{item.text}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Form ── */}
        <div className="flex-1 w-full min-w-0">

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Form header */}
            <div className="px-7 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-black text-brand-dark text-[15px]">Thông tin đặt khám</h2>
                <p className="text-[12px] text-slate-400 font-medium">Điền đầy đủ để đặt lịch thành công</p>
              </div>
              {/* Mobile steps indicator */}
              <div className="md:hidden ml-auto flex items-center gap-1">
                {STEPS.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < activeStep ? 'bg-primary-400' :
                    i === activeStep ? 'bg-primary-500 w-4' : 'bg-slate-200'
                  }`} />
                ))}
              </div>
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
                onStepProgress={setActiveStep}
              />
            </div>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
};