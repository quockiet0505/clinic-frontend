import React, { useEffect, useState, useCallback } from 'react';
import { Heart, Weight, Ruler, Droplets, AlertTriangle, BookOpen, Activity, ArrowRight, Stethoscope, TrendingUp, Pencil } from 'lucide-react';
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
    if (bmi < 18.5) return { label: 'Thiếu cân', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' };
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => <div key={i} className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
          </div>
        </SectionContainer>
      </main>
    );
  }

  const EMPTY_LABEL = 'Chưa có';

  const STAT_CARDS = [
    {
      icon: <Ruler className="w-7 h-7 text-indigo-500" />,
      bg: 'from-indigo-500 to-indigo-600',
      light: 'bg-indigo-50 border-indigo-100',
      label: 'Chiều cao',
      value: profile?.height ? `${profile.height} cm` : EMPTY_LABEL,
      isEmpty: !profile?.height,
      sub: 'Tự khai báo',
    },
    {
      icon: <Weight className="w-7 h-7 text-emerald-500" />,
      bg: 'from-emerald-500 to-teal-500',
      light: 'bg-emerald-50 border-emerald-100',
      label: 'Cân nặng',
      value: profile?.weight ? `${profile.weight} kg` : EMPTY_LABEL,
      isEmpty: !profile?.weight,
      sub: 'Tự khai báo',
    },
    {
      icon: <Heart className="w-7 h-7 text-rose-500" />,
      bg: 'from-rose-500 to-pink-500',
      light: 'bg-rose-50 border-rose-100',
      label: 'Huyết áp',
      value: profile?.bloodPressure || EMPTY_LABEL,
      isEmpty: !profile?.bloodPressure,
      sub: 'mmHg • Tự khai báo',
    },
    {
      icon: <Activity className="w-7 h-7 text-amber-500" />,
      bg: 'from-amber-500 to-orange-500',
      light: 'bg-amber-50 border-amber-100',
      label: 'Nhịp tim',
      value: profile?.pulse ? `${profile.pulse} bpm` : EMPTY_LABEL,
      isEmpty: !profile?.pulse,
      sub: 'Tự khai báo',
    },
  ];

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
                <p className="text-white/90 text-sm drop-shadow-sm mt-0.5">Chỉ số thể chất, nhóm máu và tiền sử bệnh lý</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50 font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-md transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Cập nhật hồ sơ
              </button>
              <button
                onClick={() => navigate('/records/prescriptions')}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl border border-white/30 transition-colors"
              >
                <Stethoscope className="w-4 h-4" />
                Xem đơn thuốc
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-5xl py-8 flex flex-col gap-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setEditOpen(true)}
              className={`rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md transition-all text-left ${card.light} flex flex-col gap-3 cursor-pointer group`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.bg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                {React.cloneElement(card.icon, { className: 'w-6 h-6 text-white' })}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className={`leading-tight mt-0.5 ${card.isEmpty ? 'text-[15px] font-semibold text-slate-400' : 'text-[22px] font-black text-slate-800'}`}>
                  {card.value}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{card.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* BMI + Blood Type row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <h3 className="font-black text-slate-800 text-[16px]">Chỉ số BMI</h3>
            </div>
            {bmi ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-slate-50 border-4 border-primary-100 shrink-0">
                  <span className="text-4xl font-black text-primary-600">{bmi}</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">BMI</span>
                </div>
                <div className="flex-1">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-bold mb-3 ${bmiStatus?.bg} ${bmiStatus?.color}`}>
                    {bmiStatus?.label}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    {[
                      { range: '< 18.5', label: 'Thiếu cân', active: Number(bmi) < 18.5 },
                      { range: '18.5 – 22.9', label: 'Bình thường', active: Number(bmi) >= 18.5 && Number(bmi) < 23 },
                      { range: '23 – 24.9', label: 'Thừa cân', active: Number(bmi) >= 23 && Number(bmi) < 25 },
                      { range: '≥ 25', label: 'Béo phì', active: Number(bmi) >= 25 },
                    ].map((row, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${row.active ? 'bg-primary-50 border-primary-200 font-bold' : 'bg-slate-50 border-slate-100'}`}>
                        <span className={`text-[12px] font-bold ${row.active ? 'text-primary-600' : 'text-slate-500'}`}>{row.range}</span>
                        <span className="text-slate-600">{row.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <TrendingUp className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-slate-500 font-medium text-[14px]">Cần cập nhật chiều cao và cân nặng để tính BMI</p>
                <button onClick={() => setEditOpen(true)} className="mt-3 text-primary-500 font-bold text-[13px] hover:underline">Cập nhật ngay →</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <Droplets className="w-5 h-5 text-rose-500" />
              <h3 className="font-black text-slate-800 text-[16px]">Nhóm máu</h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
              {profile?.bloodType ? (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
                  <span className="text-4xl font-black text-white">{profile.bloodType}</span>
                </div>
              ) : (
                <div className="text-center">
                  <Droplets className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-[13px] font-medium">Chưa cập nhật</p>
                  <button onClick={() => setEditOpen(true)} className="mt-2 text-primary-500 font-bold text-[12px] hover:underline">Cập nhật →</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Allergies + Medical History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-800 text-[16px]">Dị ứng</h3>
              </div>
              <button onClick={() => setEditOpen(true)} className="text-primary-500 text-[12px] font-bold hover:underline">Sửa</button>
            </div>
            {profile?.allergies ? (
              <p className="text-[14px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{profile.allergies}</p>
            ) : (
              <p className="text-[14px] font-medium italic text-slate-400">Không có thông tin dị ứng nào được ghi nhận.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <h3 className="font-black text-slate-800 text-[16px]">Tiền sử bệnh lý</h3>
              </div>
              <button onClick={() => setEditOpen(true)} className="text-primary-500 text-[12px] font-bold hover:underline">Sửa</button>
            </div>
            {profile?.medicalHistory ? (
              <p className="text-[14px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{profile.medicalHistory}</p>
            ) : (
              <p className="text-[14px] font-medium italic text-slate-400">Không có tiền sử bệnh lý đặc biệt.</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Đơn thuốc', icon: <Stethoscope className="w-5 h-5" />, to: '/records/prescriptions', color: 'from-emerald-500 to-teal-500' },
            { label: 'Kết quả xét nghiệm', icon: <Activity className="w-5 h-5" />, to: '/records/lab-results', color: 'from-cyan-500 to-blue-500' },
            { label: 'Lịch hẹn của tôi', icon: <Heart className="w-5 h-5" />, to: '/appointments/my', color: 'from-rose-500 to-pink-500' },
          ].map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.to)}
              className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br ${link.color} text-white shadow-md hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span className="font-bold text-[14px]">{link.label}</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          ))}
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
