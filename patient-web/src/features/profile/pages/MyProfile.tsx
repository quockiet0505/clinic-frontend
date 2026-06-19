/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, User, ShieldCheck, Camera, CalendarHeart } from 'lucide-react';
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
      <main className="min-h-screen bg-[#f0f9ff]">
        <div className="bg-brand-dark py-12 px-4">
          <SectionContainer className="max-w-5xl">
            <div className="h-5 bg-white/10 rounded w-32 mb-3 animate-pulse" />
            <div className="h-8 bg-white/10 rounded w-52 animate-pulse" />
          </SectionContainer>
        </div>
        <SectionContainer className="max-w-5xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-96 bg-white rounded-2xl animate-pulse border border-slate-200" />
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="h-14 bg-white rounded-2xl animate-pulse border border-slate-200" />
              <div className="h-80 bg-white rounded-2xl animate-pulse border border-slate-200" />
            </div>
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
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-brand-dark mb-3">
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
        {/* ── Hero Header ── */}
        <div className="relative overflow-hidden bg-brand-dark py-10 px-4">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
          <SectionContainer className="max-w-5xl relative z-10">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-primary-400 mb-3">
              <span>Trang chủ</span><span className="text-white/20">/</span>
              <span className="text-primary-200">Hồ sơ cá nhân</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-2xl flex items-center justify-center border border-primary-400/30">
                  <User className="w-5 h-5 text-primary-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Hồ Sơ Cá Nhân</h1>
                  <p className="text-primary-300 text-sm">{profile.full_name}</p>
                </div>
              </div>
              <TabsList className="bg-white/10 p-1 rounded-xl flex gap-1 h-11 border border-white/10">
                <TabsTrigger value="personal" className="rounded-lg px-5 h-full text-[13px] font-bold text-primary-300 gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm cursor-pointer">
                  <User className="w-4 h-4" /> Thông tin
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg px-5 h-full text-[13px] font-bold text-primary-300 gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm cursor-pointer">
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
              <div className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary-500 to-sky-400 w-full" />
                <div className="px-6 pb-6 flex flex-col items-center text-center -mt-12 relative z-10">
                  <div className="w-24 h-24 bg-white p-1.5 rounded-full shadow-lg mb-3 relative group cursor-pointer">
                    <div className="w-full h-full rounded-full bg-primary-50 flex items-center justify-center border-2 border-primary-100">
                      <span className="text-3xl font-black text-primary-500">
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-[17px] font-black text-brand-dark">{profile.full_name}</h2>
                  <div className="flex items-center gap-2 mt-2 mb-5">
                    <span className="text-primary-600 font-bold text-[12px] bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">Bệnh nhân</span>
                    <span className="flex items-center gap-1 text-slate-500 font-medium text-[12px] bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                      <CalendarHeart className="w-3 h-3" /> Thành viên
                    </span>
                  </div>
                  <div className="w-full border-t border-slate-100 mb-5" />
                  <div className="w-full flex flex-col gap-4 text-left">
                    {[
                      { icon: <Phone className="w-4 h-4" />, label: 'Điện thoại', value: profile.phone || 'Chưa cập nhật' },
                      { icon: <Mail className="w-4 h-4" />, label: 'Email', value: profile.email, truncate: true },
                      { icon: <MapPin className="w-4 h-4" />, label: 'Địa chỉ', value: profile.address || 'Chưa cập nhật' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 group-hover:text-primary-500 flex items-center justify-center text-slate-400 transition-colors shrink-0">
                          {row.icon}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{row.label}</p>
                          <p className={`font-semibold text-slate-700 text-[14px] mt-0.5 ${row.truncate ? 'truncate' : 'leading-tight'}`}>{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Form Content ── */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                <TabsContent value="personal" className="outline-none mt-0">
                  <div className="px-7 py-5 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-[16px] font-black text-brand-dark">Cập nhật hồ sơ bệnh nhân</h3>
                    <p className="text-slate-500 text-[12px] mt-0.5">Thông tin cá nhân và hồ sơ bệnh lý</p>
                  </div>
                  <div className="p-6 md:p-7">
                    <ProfileInfoForm initialData={profile} onSuccess={fetchProfile} />
                  </div>
                </TabsContent>
                <TabsContent value="security" className="outline-none mt-0">
                  <div className="px-7 py-5 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-[16px] font-black text-brand-dark">Thiết lập bảo mật</h3>
                    <p className="text-slate-500 text-[12px] mt-0.5">Đổi mật khẩu và bảo vệ tài khoản</p>
                  </div>
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