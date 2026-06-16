// features/appointments/components/AppointmentFilterBar.tsx
import React from 'react';
import { FilterBar } from '@/components/common/FilterBar';
import type { AppointmentStatus } from '../types/appointment';

interface AppointmentFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: AppointmentStatus | 'ALL';
  onStatusChange: (value: AppointmentStatus | 'ALL') => void;
  serviceType: 'ALL' | 'CONSULTATION' | 'TEST';
  onServiceTypeChange: (value: 'ALL' | 'CONSULTATION' | 'TEST') => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const AppointmentFilterBar: React.FC<AppointmentFilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  serviceType,
  onServiceTypeChange,
  activeTab,
  onTabChange,
}) => {
  const statusOptions = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'CHECKED_IN', label: 'Đã đến viện' },
    { value: 'IN_PROGRESS', label: 'Đang khám' },
    { value: 'WAITING_RESULT', label: 'Chờ kết quả' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  const serviceOptions = [
    { value: 'ALL', label: 'Tất cả dịch vụ' },
    { value: 'CONSULTATION', label: 'Khám bệnh' },
    { value: 'TEST', label: 'Xét nghiệm' },
  ];

  const tabOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'upcoming', label: 'Sắp tới' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên bác sĩ..."
      tabs={{
        options: tabOptions,
        value: activeTab,
        onChange: onTabChange,
      }}
      filters={[
        {
          key: 'serviceType',
          label: 'Loại dịch vụ',
          options: serviceOptions,
          value: serviceType,
          onChange: (val) => onServiceTypeChange(val as any),
          placeholder: 'Loại dịch vụ',
        },
        {
          key: 'status',
          label: 'Trạng thái',
          options: statusOptions,
          value: status,
          onChange: (val) => onStatusChange(val as any),
          placeholder: 'Trạng thái',
        },
      ]}
    />
  );
};