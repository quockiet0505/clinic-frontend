import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { FormModal, type FormFieldConfig } from '@/components/common/FormModal';
import { profileApi } from '@/features/profile/api/profileApi';
import { toast } from 'sonner';
import type { PatientProfile } from '@/features/profile/types/profile';

interface EditHealthProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: PatientProfile | null;
  onSuccess: () => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const HEALTH_FIELDS: FormFieldConfig[] = [
  { name: 'height', label: 'Chiều cao (cm)', type: 'number', placeholder: 'Ví dụ: 170' },
  { name: 'weight', label: 'Cân nặng (kg)', type: 'number', placeholder: 'Ví dụ: 65' },
  { name: 'bloodType', label: 'Nhóm máu', type: 'select', placeholder: 'Chọn nhóm máu', options: BLOOD_TYPES.map((v) => ({ label: v, value: v })) },
  { name: 'bloodPressure', label: 'Huyết áp (mmHg)', type: 'text', placeholder: 'Ví dụ: 120/80' },
  { name: 'pulse', label: 'Nhịp tim (bpm)', type: 'number', placeholder: 'Ví dụ: 72' },
  { name: 'allergies', label: 'Tiền sử dị ứng', type: 'textarea', colSpan: 2, placeholder: 'Thuốc, thức ăn hoặc tác nhân gây dị ứng...' },
  { name: 'medicalHistory', label: 'Tiền sử bệnh lý', type: 'textarea', colSpan: 2, placeholder: 'Bệnh lý nền, phẫu thuật trước đây...' },
];

export const EditHealthProfileModal: React.FC<EditHealthProfileModalProps> = ({
  open,
  onOpenChange,
  profile,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile && open) {
      setFormData({
        height: profile.height != null ? String(profile.height) : '',
        weight: profile.weight != null ? String(profile.weight) : '',
        bloodType: profile.bloodType || '',
        bloodPressure: profile.bloodPressure || '',
        pulse: profile.pulse != null ? String(profile.pulse) : '',
        allergies: profile.allergies || '',
        medicalHistory: profile.medicalHistory || '',
      });
    }
  }, [profile, open]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!profile) return;
    setIsSubmitting(true);
    try {
      await profileApi.updateMyProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        address: profile.address,
        height: formData.height ? parseInt(formData.height, 10) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        bloodType: formData.bloodType || null,
        bloodPressure: formData.bloodPressure?.trim() || null,
        pulse: formData.pulse ? parseInt(formData.pulse, 10) : null,
        allergies: formData.allergies?.trim() || null,
        medicalHistory: formData.medicalHistory?.trim() || null,
      });
      toast.success('Cập nhật hồ sơ sức khoẻ thành công');
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error('Không thể cập nhật hồ sơ sức khoẻ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Cập nhật hồ sơ sức khoẻ"
      description="Chỉ số thể chất, nhóm máu và tiền sử bệnh lý"
      icon={<Activity className="w-6 h-6 text-primary-500" />}
      fields={HEALTH_FIELDS}
      values={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      columns={2}
      maxWidth="lg"
    />
  );
};
