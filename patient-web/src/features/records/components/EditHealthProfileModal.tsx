import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { FormModal, type FormFieldConfig } from '@/components/common/FormModal';
import { profileApi } from '@/features/profile/api/profileApi';
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    if (!profile) return;
    
    // Validation
    const errs: Record<string, string> = {};
    if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) <= 0 || Number(formData.height) > 300)) {
      errs.height = 'Chiều cao không hợp lệ';
    }
    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0 || Number(formData.weight) > 500)) {
      errs.weight = 'Cân nặng không hợp lệ';
    }
    if (formData.pulse && (isNaN(Number(formData.pulse)) || Number(formData.pulse) <= 0)) {
      errs.pulse = 'Nhịp tim không hợp lệ';
    }
    if (formData.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(formData.bloodPressure.trim())) {
      errs.bloodPressure = 'Huyết áp không hợp lệ (ví dụ: 120/80)';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

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
      onOpenChange(false);
      onSuccess();
    } catch {
      /* toast: axios interceptor */
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
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      columns={2}
      maxWidth="lg"
    />
  );
};
