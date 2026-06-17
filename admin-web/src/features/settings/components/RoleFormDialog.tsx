// components/settings/RoleFormDialog.tsx
import React from 'react';
import { Shield } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const getFields = (isEditing: boolean): FieldConfig[] => [
  {
    name: 'roleName',
    label: 'Tên Vai trò',
    type: 'text',
    required: true,
    placeholder: 'VD: Bác sĩ trưởng',
  },
  {
    name: 'roleCode',
    label: 'Mã Vai trò (Viết hoa)',
    type: 'text',
    required: true,
    placeholder: 'VD: SR_DOCTOR',
  },
];

interface RoleFormDialogProps {
  role: any; // { roleId, roleName, roleCode }
  onClose: () => void;
  onSave: (id: number, data: any) => void;
}

export default function RoleFormDialog({ role, onClose, onSave }: RoleFormDialogProps) {
  const isOpen = !!role;
  const isEditing = role?.roleId !== 0;

  const initialData = role
    ? {
        roleName: role.roleName || '',
        roleCode: role.roleCode || '',
      }
    : undefined;

  const handleSubmit = (data: any) => {
    // Đảm bảo roleCode viết hoa (nếu không bị disabled)
    const processed = {
      ...data,
      roleCode: data.roleCode?.toUpperCase(),
    };
    onSave(role.roleId, processed);
  };

  if (!isOpen) return null;

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa Vai trò' : 'Tạo Vai trò mới'}
      description="Cấu hình mức độ truy cập hệ thống và mã vai trò."
      icon={<Shield size={16} />}
      fields={getFields(isEditing)}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel="Lưu Vai trò"
      compact={true}
      columns={2}
    />
  );
}