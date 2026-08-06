import React, { useEffect, useState, useCallback } from 'react';
import { Heart, Ruler, AlertTriangle, BookOpen, Activity, ArrowRight, Stethoscope, TrendingUp, Pencil, CalendarDays } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { profileApi } from '@/features/profile/api/profileApi';
import { EditHealthProfileModal } from '../components/EditHealthProfileModal';
import type { PatientProfile } from '@/features/profile/types/profile';
import { useNavigate } from 'react-router-dom';

export const HealthProfile: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await profileApi.getMyProfile();
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const getBMI = () => {
    if (!profile?.height || !profile?.weight) return null;
    const h = profile.height / 100;
    return (Number(profile.weight) / (h * h)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Thiếu cân', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (bmi < 23) return { label: 'Bình thường', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (bmi < 25) return { label: 'Thừa cân', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'Béo phì', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  };

  const bmi = getBMI();
  const bmiStatus = bmi ? getBMIStatus(Number(bmi)) : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f9ff]">
        <div className="bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-12 px-4">
          <SectionContainer className="max-w-5xl">
            <div className="h-5 bg-white/10 rounded w-32 mb-3 animate-pulse" />
            <div className="h-8 bg-white/10 rounded w-52 animate-pulse" />
          </SectionContainer>
        </div>
        <SectionContainer className="max-w-5xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="h-80 bg-white rounded-3xl border border-slate-200 animate-pulse" />
              <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
            </div>
            <div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          </div>
        </SectionContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <SectionContainer className="max-w-5xl relative z-10">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-3">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/')}>Trang chủ</span>
            <span className="text-white/40">/</span>
            <span className="text-white">Hồ sơ sức khoẻ</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Hồ Sơ Sức Khoẻ</h1>
                <p className="text-white/90 text-sm drop-shadow-sm mt-0.5">Quản lý các chỉ số thể chất, nhóm máu và tiền sử bệnh lý</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50 font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Cập nhật hồ sơ
              </button>
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-5xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Physical Metrics Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-black text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Chỉ số cơ thể & Thể chất
                </h2>
                <button onClick={() => setEditOpen(true)} className="text-primary-500 text-[13px] font-bold hover:underline cursor-pointer">
                  Chỉnh sửa
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* BMI Section */}
                <div className="md:w-1/2 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  {bmi ? (
                    <>
                      <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-white shadow-sm border-4 border-primary-100 mb-4">
                        <span className="text-3xl font-black text-primary-600">{bmi}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">BMI</span>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[13px] font-bold ${bmiStatus?.bg} ${bmiStatus?.color}`}>
                        {bmiStatus?.label}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <TrendingUp className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-slate-500 font-medium text-[13px] mb-3">Cần cập nhật chiều cao và cân nặng để tính BMI</p>
                      <button onClick={() => setEditOpen(true)} className="text-primary-500 font-bold text-[13px] hover:underline cursor-pointer">Cập nhật ngay →</button>
                    </div>
                  )}
                </div>

                {/* Other Metrics Grid */}
                <div className="md:w-1/2 grid grid-cols-2 gap-4">
                  {/* Height */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2 text-indigo-500 mb-1">
                      <Ruler className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Chiều cao</span>
                    </div>
                    <span className="text-[20px] font-black text-slate-800">{profile?.height ? `${profile.height} cm` : 'Chưa có'}</span>
                  </div>
                  
                  {/* Weight */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2 text-emerald-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.46A2 2 0 0 0 17.5 8Z"/></svg>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cân nặng</span>
                    </div>
                    <span className="text-[20px] font-black text-slate-800">{profile?.weight ? `${profile.weight} kg` : 'Chưa có'}</span>
                  </div>

                  {/* Blood Type */}
                  <div className="col-span-2 bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-rose-500 mb-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600/70">Nhóm máu</span>
                      </div>
                      <span className="text-[13px] font-medium text-rose-800">
                        {profile?.bloodType ? 'Đã được ghi nhận' : 'Chưa có thông tin'}
                      </span>
                    </div>
                    {profile?.bloodType ? (
                      <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center shadow-md shadow-rose-200 text-white font-black text-xl">
                        {profile.bloodType}
                      </div>
                    ) : (
                      <button onClick={() => setEditOpen(true)} className="text-rose-500 text-[12px] font-bold hover:underline cursor-pointer">Cập nhật</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-black text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  Thông tin Y tế & Tiền sử bệnh
                </h2>
                <button onClick={() => setEditOpen(true)} className="text-primary-500 text-[13px] font-bold hover:underline cursor-pointer">
                  Chỉnh sửa
                </button>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-rose-500">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Huyết áp</p>
                    <p className="text-[15px] font-black text-slate-800">{profile?.bloodPressure || 'Chưa có'}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-amber-500">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Nhịp tim</p>
                    <p className="text-[15px] font-black text-slate-800">{profile?.pulse ? `${profile.pulse} bpm` : 'Chưa có'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {/* Allergies */}
                <div>
                  <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Thông tin dị ứng
                  </h3>
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 text-[14px] text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                    {profile?.allergies ? (
                      profile.allergies
                    ) : (
                      <span className="italic text-slate-400 font-normal">Không có thông tin dị ứng nào được ghi nhận.</span>
                    )}
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" /> Tiền sử bệnh lý
                  </h3>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-[14px] text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                    {profile?.medicalHistory ? (
                      profile.medicalHistory
                    ) : (
                      <span className="italic text-slate-400 font-normal">Không có tiền sử bệnh lý đặc biệt.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Sidebar (Quick Links) */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-[16px] font-black text-slate-800 mb-4 flex items-center gap-2">
                Truy cập nhanh
              </h2>
              
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Đơn thuốc của tôi', icon: <Stethoscope className="w-5 h-5" />, to: '/records/prescriptions', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', hover: 'hover:bg-emerald-100 hover:border-emerald-200' },
                  { label: 'Kết quả xét nghiệm', icon: <Activity className="w-5 h-5" />, to: '/records/lab-results', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100', hover: 'hover:bg-cyan-100 hover:border-cyan-200' },
                  { label: 'Lịch hẹn sắp tới', icon: <CalendarDays className="w-5 h-5" />, to: '/appointments/my', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100', hover: 'hover:bg-rose-100 hover:border-rose-200' },
                ].map((link, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(link.to)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${link.bg} ${link.hover}`}
                  >
                    <div className={`flex items-center gap-3 ${link.color}`}>
                      <div className="bg-white p-1.5 rounded-lg shadow-sm">
                        {link.icon}
                      </div>
                      <span className="font-bold text-[14px] text-slate-700 group-hover:text-slate-900">{link.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </SectionContainer>

      <EditHealthProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onSuccess={fetchProfile}
      />
    </main>
  );
};

