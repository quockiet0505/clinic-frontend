/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, User, ShieldCheck, Loader2, Camera, CalendarHeart } from 'lucide-react';
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
    setLoading(true);
    setError(null);
    try {
      const data = await profileApi.getMyProfile();
      setProfile(data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Không thể tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <SectionContainer className="max-w-5xl">
          <div className="h-8 bg-slate-200 rounded animate-pulse w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="h-14 bg-slate-200 rounded-2xl animate-pulse w-full md:w-64"></div>
              <div className="h-96 bg-slate-200 rounded-3xl animate-pulse w-full"></div>
            </div>
          </div>
        </SectionContainer>
      </main>
    );
  }

  if (error || !profile) {
    const isForbidden = error === 'Forbidden' || error?.includes('403');
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="p-10 text-center max-w-md bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">
            {isForbidden ? 'Không có quyền truy cập' : 'Chưa có dữ liệu hồ sơ'}
          </h2>
          <p className="text-slate-500 font-medium mb-8 text-[15px]">
            {isForbidden
              ? 'Phiên đăng nhập đã hết hạn hoặc bạn không có quyền truy cập trang này.'
              : 'Chúng tôi không tìm thấy thông tin hồ sơ của bạn. Vui lòng thử lại.'}
          </p>
          <button onClick={() => window.location.href = isForbidden ? '/auth/login' : '/'} className="px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl w-full cursor-pointer transition-colors shadow-sm">
            {isForbidden ? 'Đăng nhập lại' : 'Quay về trang chủ'}
          </button>
        </div>
      </div>
    );
  }

  const joinDate = new Date().toLocaleDateString('vi-VN'); // Thay bằng ngày tham gia thật nếu có

  return (
    <main className="min-h-screen bg-slate-50">
      <Tabs defaultValue="personal" className="block w-full">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-100 shadow-sm">
          <SectionContainer className="max-w-5xl py-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-400 mb-1">
                  <span>Trang chủ</span>
                  <span>/</span>
                  <span className="text-primary-600">Hồ sơ cá nhân</span>
                </div>
                <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  Hồ Sơ Cá Nhân
                </h1>
              </div>
              
              <TabsList className="bg-slate-100/50 p-1.5 rounded-xl flex gap-1.5 h-12 w-full md:w-auto">
                <TabsTrigger
                  value="personal"
                  className="rounded-lg px-5 h-full text-[13.5px] font-bold text-slate-500 transition-all gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm cursor-pointer"
                >
                  <User className="w-4 h-4" /> Thông tin
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="rounded-lg px-5 h-full text-[13.5px] font-bold text-slate-500 transition-all gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> Bảo mật
                </TabsTrigger>
              </TabsList>
            </div>
          </SectionContainer>
        </div>

        <SectionContainer className="max-w-5xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar trái: Profile Card */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky top-24">
              <div className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden relative">
                {/* Background Banner */}
                <div className="h-28 bg-gradient-to-r from-primary-500 to-primary-600 w-full absolute top-0 left-0" />

                <div className="pt-16 px-6 pb-6 flex flex-col items-center text-center relative z-10">
                  <div className="w-24 h-24 bg-white p-1.5 rounded-full shadow-lg mb-3 relative group cursor-pointer">
                    <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-indigo-100">
                      <span className="text-3xl font-black text-indigo-500">
                        {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-[17px] font-black text-slate-800">{profile?.full_name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-1.5 mb-5">
                    <span className="text-primary-600 font-bold text-[12px] bg-primary-50 px-2.5 py-1 rounded-full">Bệnh nhân</span>
                    <span className="flex items-center gap-1 text-slate-500 font-medium text-[12px] bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                      <CalendarHeart className="w-3 h-3" /> Thành viên
                    </span>
                  </div>

                  <div className="w-full border-t border-slate-100 mb-6"></div>

                  <div className="w-full flex flex-col gap-5 text-left">
                    <div className="flex items-center gap-4 group">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 group-hover:bg-primary-50 group-hover:text-primary-600 flex items-center justify-center text-slate-400 transition-colors shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Điện thoại</p>
                        <p className="font-semibold text-slate-700 text-[14.5px] mt-0.5">{profile?.phone || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 group">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 group-hover:bg-primary-50 group-hover:text-primary-600 flex items-center justify-center text-slate-400 transition-colors shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                        <p className="font-semibold text-slate-700 text-[14.5px] mt-0.5 truncate">{profile?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 group">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 group-hover:bg-primary-50 group-hover:text-primary-600 flex items-center justify-center text-slate-400 transition-colors shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Địa chỉ</p>
                        <p className="font-semibold text-slate-700 text-[14.5px] mt-0.5 leading-tight">{profile?.address || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần bên phải: Nội dung Form */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden">
                <TabsContent value="personal" className="outline-none mt-0">
                  <div className="p-6 md:p-7">
                    <h3 className="text-[17px] font-black text-slate-800 mb-5">Cập nhật hồ sơ bệnh nhân</h3>
                    <ProfileInfoForm initialData={profile} onSuccess={fetchProfile} />
                  </div>
                </TabsContent>
                <TabsContent value="security" className="outline-none mt-0">
                  <div className="p-6 md:p-7">
                    <h3 className="text-[17px] font-black text-slate-800 mb-5">Thiết lập bảo mật</h3>
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