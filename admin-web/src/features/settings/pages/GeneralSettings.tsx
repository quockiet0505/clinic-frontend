import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import GeneralSettingsForm from '../components/GeneralSettingsFormDialog';

export default function GeneralSettings() {
  const [formData, setFormData] = useState({
    clinicName: 'Trustcare Clinic',
    address: '123 Healthcare Ave, Dong Thap, VN',
    phone: '+84 123 456 789',
    email: 'contact@trustcare.vn',
    website: 'www.trustcare.vn',
    operatingHours: '08:00 AM - 05:00 PM'
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="General Settings" description="Manage core clinic information used in invoices and reports." />
      <GeneralSettingsForm formData={formData} onChange={(e: any) => setFormData({...formData, [e.target.name]: e.target.value})} onSave={() => console.log(formData)} />
    </div>
  );
}