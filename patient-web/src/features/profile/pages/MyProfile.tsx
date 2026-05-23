// src/features/profile/pages/MyProfile.tsx
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, User, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionContainer } from '@/components/common';
import { ProfileInfoForm } from '../components/ProfileInfoForm';
import { PasswordChangeForm } from '../components/PasswordChangeForm';
import { profileApi } from '../api/profileApi';
import type { PatientProfile } from '../types/profile';

export const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile>(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      id: 1,
      accountId: 101,
      email: user?.email || 'benhnhan@gmail.com',
      fullName: user?.fullName || 'Nguyễn Văn Bệnh Nhân',
      phone: user?.phone || '0901234567',
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      address: '71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    };
  });

  const fetchProfile = async () => {
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const initials = profile.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <main className="w-full min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-6xl">
        <h1 className="text-2xl font-black text-brand-dark mb-6">Quản lý hồ sơ</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR PANEL: Clean and modern, matching your theme specifications */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky top-24">
            <Card className="rounded-3xl border-border-default shadow-sm overflow-hidden bg-white">
              <CardContent className="p-8 flex flex-col items-center text-center">
                
                {/* Profile Avatar Shell */}
                <div className="w-24 h-24 bg-primary-50 border-[6px] border-white outline outline-1 outline-border-default rounded-full flex items-center justify-center shadow-sm mb-4">
                  <span className="text-2xl font-black text-primary-500">{initials}</span>
                </div>
                
                {/* Profile Identity Details */}
                <h2 className="text-xl font-black text-brand-dark mb-2">{profile.fullName}</h2>
                <span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-primary-500 text-white mb-6 uppercase tracking-wider">
                  Bệnh nhân
                </span>

                <div className="w-full h-px bg-border-default mb-6"></div>

                {/* Profile Contact/Demographic Matrix */}
                <div className="flex flex-col gap-5 w-full text-left text-[14px] text-slate-600 font-medium">
                  {/* Phone Block */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase">Số điện thoại</span>
                      <span className="text-brand-dark">{profile.phone || 'Chưa cập nhật'}</span>
                    </div>
                  </div>

                  {/* Email Block */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-primary-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase">Email</span>
                      <span className="text-brand-dark break-all">{profile.email}</span>
                    </div>
                  </div>

                  {/* Address Block */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase">Địa chỉ</span>
                      <span className="text-brand-dark leading-relaxed">{profile.address || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* RIGHT VIEWPORT PANEL: Integrated Card Container featuring stunning Pill Style Tabs layout */}
          <div className="lg:col-span-8 flex flex-col">
            <Tabs defaultValue="personal" className="w-full flex flex-col">
              
              {/* Premium Pill Tabs Segmented Header Control Container */}
              <div className="bg-white border border-border-default p-1.5 rounded-2xl mb-6 shadow-sm flex items-center w-full md:w-fit">
                <TabsList className="bg-transparent h-11 w-full md:w-auto p-0 gap-1 flex justify-start rounded-none">
                  <TabsTrigger 
                    value="personal" 
                    className="rounded-xl flex-1 md:flex-none px-6 h-full font-bold text-slate-600 transition-all duration-200 gap-2 whitespace-nowrap data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-none hover:text-primary-500 hover:bg-primary-50 data-[state=active]:hover:bg-primary-500 data-[state=active]:hover:text-white"
                  >
                    <User className="w-4 h-4" /> Thông tin cá nhân
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="security" 
                    className="rounded-xl flex-1 md:flex-none px-6 h-full font-bold text-slate-600 transition-all duration-200 gap-2 whitespace-nowrap data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-none hover:text-primary-500 hover:bg-primary-50 data-[state=active]:hover:bg-primary-500 data-[state=active]:hover:text-white"
                  >
                    <ShieldCheck className="w-4 h-4" /> Đổi mật khẩu
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Integrated Forms Render Board wrapper */}
              <Card className="rounded-3xl border-border-default shadow-sm bg-white overflow-hidden">
                {/* TAB CONTENT 1: PERSONAL INFORMATION */}
                <TabsContent value="personal" className="outline-none mt-0">
                  <div className="p-8">
                    <h3 className="text-[18px] font-black text-brand-dark mb-6">Cập nhật hồ sơ bệnh nhân</h3>
                    <ProfileInfoForm initialData={profile} onSuccess={fetchProfile} />
                  </div>
                </TabsContent>

                {/* TAB CONTENT 2: ACCOUNT SECURITY */}
                <TabsContent value="security" className="outline-none mt-0">
                  <div className="p-8">
                    <h3 className="text-[18px] font-black text-brand-dark mb-6">Thiết lập bảo mật</h3>
                    <PasswordChangeForm />
                  </div>
                </TabsContent>
              </Card>

            </Tabs>
          </div>

        </div>
      </SectionContainer>
    </main>
  );
};