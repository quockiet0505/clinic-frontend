// features/profile/pages/MyProfile.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Key, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import ProfileCard from '../components/ProfileCard';
import ProfileInfoForm from '../components/ProfileInfoForm';
import ProfileSecurityForm from '../components/ProfileSecurityForm';
import { UserProfile } from '../types/profile';
import { profileApi } from '../api/profileApi';

// Dữ liệu mặc định để hiển thị khi không tải được
const defaultUserData: UserProfile = {
  staffId: 0,
  accountId: 0,
  fullName: '',
  gender: 'MALE',
  date_of_birth: '',
  phone: '',
  email: '',
  address: '',
  roleName: '',
  createdAt: '',
};

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [userData, setUserData] = useState<UserProfile>(defaultUserData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toastShown = useRef(false); // ngăn toast hiển thị 2 lần

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.getMyProfile();
        setUserData(data);
      } catch (error) {
        // Chỉ hiển thị toast 1 lần
        if (!toastShown.current) {
          toast.error('Không thể tải thông tin profile');
          toastShown.current = true;
        }
        // Vẫn giữ dữ liệu mặc định để hiển thị form rỗng
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      const updated = await profileApi.updateProfile(userData);
      setUserData(updated);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (passwordData.new.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    setSaving(true);
    try {
      await profileApi.changePassword(passwordData.current, passwordData.new);
      toast.success('Đổi mật khẩu thành công');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-400">Đang tải thông tin...</div>
      </div>
    );
  }

  // Luôn hiển thị form, dù userData có thể là default hoặc từ API
  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col pb-8">
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Quản lý thông tin cá nhân và bảo mật tài khoản."
      />

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        <ProfileCard user={userData} />

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex border-b border-slate-100 px-6 pt-2 shrink-0">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm cursor-pointer transition-all border-b-2 ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <UserIcon size={16} /> Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm cursor-pointer transition-all border-b-2 ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Key size={16} /> Bảo mật & mật khẩu
            </button>
          </div>

          {activeTab === 'info' ? (
            <ProfileInfoForm
              formData={userData}
              onChange={handleInfoChange}
              onSave={handleSaveInfo}
              saving={saving}
            />
          ) : (
            <ProfileSecurityForm
              passwordData={passwordData}
              onChange={handlePasswordChange}
              onSave={handleUpdatePassword}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
}