/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, User as UserIcon, ShieldCheck, Key, CalendarDays } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionContainer } from '@/components/common';
import { ProfileInfoForm } from '../components/ProfileInfoForm';
import { PasswordChangeForm } from '../components/PasswordChangeForm';
import { profileApi } from '../api/profileApi';
import type { PatientProfile } from '../types/profile';

export const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');

  const fetchProfile = async () => {
    setLoading(true); setError(null);
    try { setProfile(await profileApi.getMyProfile()); }
    catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Không thể tải thông tin');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f9ff] py-10">
        <SectionContainer className="max-w-5xl">
          <div className="flex h-[60vh] items-center justify-center">
            <div className="text-slate-400">Đang tải thông tin...</div>
          </div>
        </SectionContainer>
      </main>
    );
  }

  if (error || !profile) {
    const isForbidden = error === 'Forbidden' || error?.includes('403');
    return (
      <main className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <div className="p-10 text-center max-w-md bg-white rounded-3xl shadow-sm border border-slate-200">
          <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <UserIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">
            {isForbidden ? 'Không có quyền truy cập' : 'Chưa có dữ liệu hồ sơ'}
          </h2>
          <p className="text-slate-500 font-medium mb-8 text-[15px]">
            {isForbidden
              ? 'Phiên đăng nhập đã hết hạn hoặc bạn không có quyền truy cập trang này.'
              : 'Chúng tôi không tìm thấy thông tin hồ sơ của bạn. Vui lòng thử lại.'}
          </p>
          <button
            onClick={() => window.location.href = isForbidden ? '/auth/login' : '/'}
            className="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl w-full cursor-pointer transition-colors shadow-sm"
          >
            {isForbidden ? 'Đăng nhập lại' : 'Quay về trang chủ'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      <Tabs defaultValue="personal" className="block w-full">
        {/* ── Hero Banner with tabs ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <SectionContainer className="max-w-5xl relative z-10">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-3">
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => window.location.href = '/'}>Trang chủ</span>
              <span className="text-white/40">/</span>
              <span className="text-white">Hồ sơ cá nhân</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Hồ Sơ Cá Nhân</h1>
                  <p className="text-white/90 text-sm drop-shadow-sm">{profile.fullName}</p>
                </div>
              </div>
              <TabsList className="bg-white/20 p-1 rounded-xl flex gap-1 h-11 border border-white/30 shadow-sm">
                <TabsTrigger value="personal" className="rounded-lg px-5 h-full text-[13px] font-bold text-white gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm cursor-pointer">
                  <UserIcon className="w-4 h-4" /> Thông tin
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg px-5 h-full text-[13px] font-bold text-white gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm cursor-pointer">
                  <ShieldCheck className="w-4 h-4" /> Bảo mật
                </TabsTrigger>
              </TabsList>
            </div>
          </SectionContainer>
        </div>

        <SectionContainer className="max-w-5xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ── Profile Card Sidebar ── */}
            <div className="lg:col-span-4 lg:sticky top-24">
              <div className="rounded-2xl border border-slate-200 shadow-sm bg-white p-6 flex flex-col items-center shrink-0">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-4xl shadow-inner mb-4">
                  {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 className="text-xl font-bold text-slate-800 text-center">{profile.fullName}</h2>
                <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                  <ShieldCheck size={14} /> Bệnh nhân
                </div>

                <div className="w-full h-px bg-slate-100 my-6"></div>

                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Mail size={14} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-semibold text-slate-500">Email</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{profile.email || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Phone size={14} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-semibold text-slate-500">Số điện thoại</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{profile.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-semibold text-slate-500">Địa chỉ</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{profile.address || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <CalendarDays size={14} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-semibold text-slate-500">Ngày tham gia</p>
                      <p className="text-sm font-medium text-slate-700 truncate">
                        Chưa cập nhật
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Form Content ── */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col">
                <TabsContent value="personal" className="outline-none mt-0">
                  <div className="p-6 md:p-7">
                    <ProfileInfoForm initialData={profile} onSuccess={fetchProfile} />
                  </div>
                </TabsContent>
                <TabsContent value="security" className="outline-none mt-0">
                  <div className="p-6 md:p-7">
                    <PasswordChangeForm />
                  </div>
                </TabsContent>
              </div>
            </div>

          </div>
        </SectionContainer>
      </Tabs>
    </main>
  );
};
