import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import GeneralSettingsForm from '../components/GeneralSettingsFormDialog';

import { settingsApi } from '../api/settingsApi';

export default function GeneralSettings() {
  const [formData, setFormData] = useState<any>({
    clinicName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    operatingHours: ''
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await settingsApi.getGeneralSettings();
      // data là Map: {"clinicName": "...", "address": "..."}
      if (data && Object.keys(data).length > 0) {
        setFormData((prev: any) => ({ ...prev, ...data }));
      } else {
        setFormData({
          clinicName: 'Trustcare Clinic',
          address: '123 Healthcare Ave, Dong Thap, VN',
          phone: '+84 123 456 789',
          email: 'contact@trustcare.vn',
          website: 'www.trustcare.vn',
          operatingHours: '08:00 AM - 05:00 PM'
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    await settingsApi.updateGeneralSettings(formData);
    alert('Đã lưu cấu hình chung thành công!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Cài đặt chung" description="Quản lý các thông tin cốt lõi của phòng khám dùng trong hóa đơn và báo cáo." />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải cấu hình...</div>
      ) : (
        <GeneralSettingsForm formData={formData} onChange={(e: any) => setFormData({...formData, [e.target.name]: e.target.value})} onSave={handleSave} />
      )}
    </div>
  );
}