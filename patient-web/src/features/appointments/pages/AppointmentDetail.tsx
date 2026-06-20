import React from 'react';
import { CalendarDays, Clock3, MapPin, Stethoscope, User, ArrowLeft, FileText, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export const AppointmentDetail: React.FC = () => {
  return (
    <main className="w-full min-h-screen bg-[#f0f9ff]">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-4xl relative z-10">
          <Link to="/appointments/my" className="flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors mb-4 w-fit text-[13px]">
            <ArrowLeft className="w-4 h-4" /> Quay lại Lịch khám của tôi
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Chi Tiết Lịch Hẹn</h1>
              <p className="text-white/90 text-sm drop-shadow-sm">Mã lịch khám: <span className="font-bold text-white">APT-2026-0522</span></p>
            </div>
          </div>
        </SectionContainer>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
          {/* Header Card */}
          <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[16px] font-black text-brand-dark">Thông tin lịch hẹn</h2>
              <p className="text-slate-500 text-[13px] mt-0.5">Kiểm tra lại thông tin chi tiết</p>
            </div>
            <span className="px-4 py-1.5 rounded-lg text-[12px] font-black tracking-wider bg-primary-50 text-primary-600 border border-primary-200 w-fit">
              ĐÃ XÁC NHẬN
            </span>
          </div>

          <CardContent className="p-8 flex flex-col gap-8">
            
            {/* Box 1: Bác sĩ & Chuyên khoa */}
            <div className="flex items-center gap-5 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-primary-500" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-black text-[18px] text-brand-dark">BS. Trần Thị Mây</span>
                <span className="text-[15px] font-medium text-slate-500 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-primary-500" /> Khoa Nội Tổng Quát
                </span>
              </div>
            </div>

            {/* Box 2: Thời gian & Địa điểm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[12px] font-bold text-slate-400 uppercase">Thời gian khám</span>
                <div className="flex items-center gap-2 text-[16px] font-bold text-brand-dark mt-2">
                  <CalendarDays className="w-5 h-5 text-primary-500" />
                  25/05/2026
                </div>
                <div className="flex items-center gap-2 text-[16px] font-bold text-warning mt-2">
                  <Clock3 className="w-5 h-5 text-warning" />
                  08:00 - 08:30
                </div>
              </div>

              <div className="flex flex-col gap-1 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[12px] font-bold text-slate-400 uppercase">Cơ sở y tế</span>
                <div className="flex items-start gap-2 text-[15px] font-medium text-brand-dark mt-2 leading-relaxed">
                  <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
                  <span>Phòng khám Đa khoa ClinicPro<br/><span className="text-slate-500 text-[14px]">71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM</span></span>
                </div>
              </div>
            </div>

            {/* Box 3: Thông tin y tế */}
            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-primary-500" />
                <span className="text-[14px] font-bold text-brand-dark uppercase">Triệu chứng / Lý do khám</span>
              </div>
              <p className="text-[15px] text-slate-600 font-medium leading-relaxed pl-7">
                Khám sức khỏe định kỳ. Thường xuyên bị chóng mặt khi đứng lên ngồi xuống.
              </p>
            </div>

          </CardContent>
        </Card>

      </div>
    </main>
  );
};