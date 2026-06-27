// features/appointments/components/AppointmentFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption, TabOption } from '@/components/common/FilterBar';
import type { AppointmentStatus } from '../types/appointment';

interface AppointmentFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: AppointmentStatus | 'ALL';
  onStatusChange: (value: AppointmentStatus | 'ALL') => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
  serviceAdvanced: string;
  onServiceAdvancedChange: (value: string) => void;
}

export const AppointmentFilterBar: React.FC<AppointmentFilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  activeTab,
  onTabChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  source,
  onSourceChange,
  serviceAdvanced,
  onServiceAdvancedChange,
}) => {
  const statusOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'CHECKED_IN', label: 'Đã check-in' },
    { value: 'IN_PROGRESS', label: 'Đang khám' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  const serviceOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả dịch vụ' },
    { value: 'EXAM', label: 'Khám bệnh' },
    { value: 'LAB_TEST', label: 'Xét nghiệm' },
    { value: 'X_RAY', label: 'Chụp X-Quang' },
    { value: 'ULTRASOUND', label: 'Siêu âm' },
    { value: 'CT_SCAN', label: 'Chụp CT' },
    { value: 'MRI', label: 'Chụp MRI' },
    { value: 'ENDOSCOPY', label: 'Nội soi' },
    { value: 'OTHER', label: 'Khác' },
  ];

  const sourceOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả nguồn' },
    { value: 'WALK_IN', label: 'Đặt trực tiếp' },
    { value: 'ONLINE', label: 'Đặt online' },
  ];

  const tabs: TabOption[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'queue', label: 'Hàng đợi STT' },
    { value: 'upcoming', label: 'Sắp tới' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm bệnh nhân..."
      tabs={{
        options: tabs,
        value: activeTab,
        onChange: onTabChange,
      }}
      filters={[
        {
          key: 'status',
          label: 'Trạng thái',
          options: statusOptions,
          value: status,
          onChange: (val) => onStatusChange(val as any),
          placeholder: 'Trạng thái',
        },
      ]}
      advancedFilters={{
        filters: [
          {
            key: 'source',
            label: 'Nguồn',
            options: sourceOptions,
            value: source,
            onChange: onSourceChange,
            placeholder: 'Nguồn',
          },
          {
            key: 'serviceAdvanced',
            label: 'Dịch vụ',
            options: serviceOptions,
            value: serviceAdvanced,
            onChange: onServiceAdvancedChange,
            placeholder: 'Dịch vụ',
          },
        ],
        dateRange: {
          from: fromDate,
          to: toDate,
          onFromChange: onFromDateChange,
          onToChange: onToDateChange,
        },
      }}
    />
  );
};