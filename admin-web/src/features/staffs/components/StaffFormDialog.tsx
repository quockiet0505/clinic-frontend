import React, { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import AvatarPicker from '@/components/common/AvatarPicker';
import { Staff } from '../types/staff';
import { settingsApi } from '@/features/settings/api/settingsApi';
import { Expertise } from '@/features/settings/types/settings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>, isEdit: boolean) => void;
  initialData?: Staff | null;
}

const STAFF_TYPE_OPTIONS = [
  { value: 'DOCTOR', label: 'Bác sĩ' },
  { value: 'STAFF', label: 'Nhân viên' },
  { value: 'LAB_TECH', label: 'Kỹ thuật viên' },
  { value: 'ADMIN', label: 'Quản trị viên' },
];

const GENDER_OPTIONS = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' },
];

function buildInitialData(data?: Staff | null): Record<string, unknown> {
  if (!data) {
    return {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      gender: 'Nam',
      dateOfBirth: '',
      staffType: 'STAFF',
      expertiseId: '',
      experience: '',
      specialtyTreatment: '',
      imageUrl: '',
      isFeatured: 'false',
      featuredPriority: 0,
    };
  }
  return {
    fullName: data.fullName || '',
    email: data.email || '',
    password: '',
    phone: data.phone || '',
    address: data.address || '',
    gender: data.gender || 'Nam',
    dateOfBirth: data.dateOfBirth ? String(data.dateOfBirth).slice(0, 10) : '',
    staffType: data.staffType || 'STAFF',
    expertiseId: data.expertiseId ? String(data.expertiseId) : '',
    experience: data.experience || '',
    specialtyTreatment: data.specialtyTreatment || '',
    imageUrl: data.imageUrl || '',
    isFeatured: data.isFeatured ? 'true' : 'false',
    featuredPriority: data.featuredPriority ?? 0,
  };
}

export default function StaffFormDialog({ isOpen, onClose, onSubmit, initialData }: Props) {
  const isEdit = !!initialData?.staffId;
  const [expertises, setExpertises] = useState<Expertise[]>([]);

  useEffect(() => {
    settingsApi
      .getExpertisesPaged({ page: 0, size: 200, sortBy: 'expertiseName', sortDir: 'ASC' })
      .then((res) => setExpertises(res.content))
      .catch(() => setExpertises([]));
  }, []);

  const expertiseOptions = useMemo(
    () => [
      { value: '', label: '— Chọn chuyên khoa —' },
      ...expertises.map((e) => ({
        value: String(e.expertiseId),
        label: e.expertiseName,
      })),
    ],
    [expertises],
  );

  const fields: FieldConfig[] = useMemo(() => {
    const list: FieldConfig[] = [
      { name: 'fullName', label: 'Họ và tên', type: 'text', required: true, placeholder: 'Ví dụ: Nguyễn Văn A' },
      { name: 'staffType', label: 'Vai trò', type: 'select', required: true, options: STAFF_TYPE_OPTIONS },
      { name: 'email', label: isEdit ? 'Email' : 'Email', type: 'text', required: !isEdit, placeholder: 'email@phongkham.vn' },
      { name: 'phone', label: 'Số điện thoại', type: 'text', placeholder: '0901234567' },
      { name: 'gender', label: 'Giới tính', type: 'select', options: GENDER_OPTIONS },
      { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
      { name: 'expertiseId', label: 'Chuyên khoa', type: 'select', options: expertiseOptions },
      { name: 'address', label: 'Địa chỉ', type: 'text', colSpan: 2, placeholder: 'Địa chỉ liên hệ' },
      { name: 'experience', label: 'Kinh nghiệm', type: 'text', colSpan: 2, placeholder: 'Ví dụ: 10 năm kinh nghiệm' },
      {
        name: 'specialtyTreatment',
        label: 'Chuyên trị / Phạm vi khám',
        type: 'textarea',
        colSpan: 2,
        rows: 3,
        placeholder: 'Mô tả lĩnh vực điều trị (bác sĩ)',
      },
      {
        name: 'isFeatured',
        label: 'Nổi bật',
        type: 'select',
        options: [
          { value: 'false', label: 'Không' },
          { value: 'true', label: 'Có' },
        ],
      },
      { name: 'featuredPriority', label: 'Thứ tự ưu tiên', type: 'number', placeholder: '0' },
    ];

    if (!isEdit) {
      list.splice(3, 0, {
        name: 'password',
        label: 'Mật khẩu',
        type: 'password',
        required: true,
        placeholder: 'Mật khẩu đăng nhập',
      });
    }

    return list;
  }, [isEdit, expertiseOptions]);

  const formInitialData = useMemo(() => buildInitialData(initialData), [initialData]);

  const handleSubmit = (data: Record<string, unknown>, editMode: boolean) => {
    onSubmit(
      {
        fullName: String(data.fullName || '').trim(),
        email: String(data.email || '').trim() || undefined,
        password: data.password ? String(data.password) : undefined,
        phone: String(data.phone || '').trim() || undefined,
        address: String(data.address || '').trim() || undefined,
        gender: data.gender || 'Nam',
        dateOfBirth: data.dateOfBirth || undefined,
        staffType: data.staffType || 'STAFF',
        expertiseId: data.expertiseId ? Number(data.expertiseId) : undefined,
        experience: String(data.experience || '').trim() || undefined,
        specialtyTreatment: String(data.specialtyTreatment || '').trim() || undefined,
        imageUrl: String(data.imageUrl || '').trim() || undefined,
        isFeatured: data.isFeatured === 'true',
        featuredPriority: Number(data.featuredPriority) || 0,
      },
      editMode,
    );
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={isEdit ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên Mới'}
      description="Thông tin nhân viên theo bảng staff trong hệ thống."
      icon={<Users size={16} />}
      fields={fields}
      initialData={formInitialData}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Cập nhật' : 'Tạo mới'}
      compact
      columns={2}
      wide
      validate={(data) => {
        if (!String(data.fullName || '').trim()) return false;
        if (!isEdit && (!data.email || !data.password)) return false;
        return true;
      }}
      renderBeforeFields={({ formData, onChange }) => (
        <AvatarPicker
          name={String(formData.fullName || 'N')}
          imageUrl={String(formData.imageUrl || '')}
          onImageUrlChange={(url) => onChange('imageUrl', url)}
        />
      )}
    />
  );
}
