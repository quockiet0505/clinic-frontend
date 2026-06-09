/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, User, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
      <main className="min-h-screen bg-background-light py-10">
        <SectionContainer className="max-w-6xl">
          <div className="h-8 bg-slate-200 rounded animate-pulse w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <div className="h-80 bg-slate-200 rounded-3xl animate-pulse w-full"></div>
            </div>
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
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <Card className="p-8 text-center max-w-sm rounded-3xl shadow-sm border-0">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-brand-dark mb-2">
            {isForbidden ? 'Không có quyền truy cập' : 'Chưa có dữ liệu hồ sơ'}
          </h2>
          <p className="text-slate-500 font-medium mb-6 text-sm">
            {isForbidden 
              ? 'Phiên đăng nhập đã hết hạn hoặc bạn không có quyền truy cập trang này.' 
              : 'Chúng tôi không tìm thấy thông tin hồ sơ của bạn. Vui lòng thử lại.'}
          </p>
          <button onClick={() => window.location.href = isForbidden ? '/auth/login' : '/'} className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl w-full cursor-pointer transition-colors shadow-sm">
            {isForbidden ? 'Đăng nhập lại' : 'Quay về trang chủ'}
          </button>
        </Card>
      </div>
    );
  }

  const fullName = profile.full_name || '';
  return (
    <main className="min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-6xl">
        <Tabs defaultValue="personal" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar trái: Tiêu đề + Thông tin */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky top-24">
              <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center w-full">
                <TabsList className="bg-transparent h-11 w-full p-0 flex gap-1 rounded-none">
                  <TabsTrigger 
                    value="personal" 
                    className="rounded-xl flex-1 px-2 h-full text-[14px] font-bold text-slate-500 transition-all gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm cursor-pointer"
                  >
                    <User className="w-4 h-4" /> Thông tin
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="rounded-xl flex-1 px-2 h-full text-[14px] font-bold text-slate-500 transition-all gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" /> Bảo mật
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-primary-50 border-[6px] border-white outline outline-1 outline-slate-100 rounded-full flex items-center justify-center shadow-sm mb-4">
                    <span className="text-3xl font-black text-primary-500">
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-brand-dark">{profile?.full_name}</h2>
                  <p className="text-primary-600 font-medium text-[14px] bg-primary-50 px-3 py-1 rounded-full mt-2">Bệnh nhân</p>

                  <div className="w-full border-t border-slate-100 my-6"></div>

                  <div className="w-full flex flex-col gap-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary-500 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Điện thoại</p>
                        <p className="font-medium text-slate-700 text-[14.5px]">{profile?.phone || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary-500 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Email</p>
                        <p className="font-medium text-slate-700 text-[14.5px] break-all">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary-500 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Địa chỉ</p>
                        <p className="font-medium text-slate-700 text-[14.5px] leading-tight">{profile?.address || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Phần bên phải: Nội dung Form */}
            <div className="lg:col-span-8 flex flex-col">
              <Card className="rounded-3xl border-slate-200 shadow-sm bg-white overflow-hidden">
                <TabsContent value="personal" className="outline-none mt-0">
                  <div className="p-8">
                    <h3 className="text-[18px] font-black text-brand-dark mb-6">Cập nhật hồ sơ bệnh nhân</h3>
                    <ProfileInfoForm initialData={profile} onSuccess={fetchProfile} />
                  </div>
                </TabsContent>
                <TabsContent value="security" className="outline-none mt-0">
                  <div className="p-8">
                    <h3 className="text-[18px] font-black text-brand-dark mb-6">Thiết lập bảo mật</h3>
                    <PasswordChangeForm />
                  </div>
                </TabsContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </SectionContainer>
    </main>
  );
};