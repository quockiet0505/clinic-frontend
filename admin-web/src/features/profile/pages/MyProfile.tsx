import React, { useState } from 'react';
import { Key, User as UserIcon } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

import ProfileCard from '../components/ProfileCard';
import ProfileInfoForm from '../components/ProfileInfoForm';
import ProfileSecurityForm from '../components/ProfileSecurityForm';
import { UserProfile } from '../types/profile';

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');

  const [userData, setUserData] = useState<UserProfile>({
    staffId: 1,
    accountId: 101,
    fullName: 'Admin User',
    gender: 'MALE',
    date_of_birth: '1990-01-01',
    phone: '+84 987 654 321',
    email: 'admin@trustcare.vn',
    address: 'Lai Vung, Dong Thap, Viet Nam',
    roleName: 'System Administrator',
    createdAt: '2025-01-15T00:00:00'
  });

  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = () => {
    console.log('Saved Profile Info:', userData);
    // Call API to update staff table
  };

  const handleUpdatePassword = () => {
    console.log('Password Updated successfully.');
    // Call API to update account table
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col pb-8">
      
      <PageHeader title="My Profile" description="Manage your personal information and account security." />

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* CỘT TRÁI: PROFILE CARD */}
        <ProfileCard user={userData} />

        {/* CỘT PHẢI: TABS & FORMS */}
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          
          {/* TABS */}
          <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50 shrink-0">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'info' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserIcon size={16}/> Thông tin Cá nhân
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'security' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Key size={16} /> Security & Password
            </button>
          </div>

          {/* RENDERING */}
          {activeTab === 'info' ? (
            <ProfileInfoForm formData={userData} onChange={handleInfoChange} onSave={handleSaveInfo} />
          ) : (
            <ProfileSecurityForm passwordData={passwordData} onChange={handlePasswordChange} onSave={handleUpdatePassword} />
          )}

        </div>
      </div>
    </div>
  );
}