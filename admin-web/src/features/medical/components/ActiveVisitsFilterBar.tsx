// features/medical/components/ActiveVisitsFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';

interface ActiveVisitsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  doctor: string;
  onDoctorChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  doctorOptions?: FilterOption[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const ActiveVisitsFilterBar: React.FC<ActiveVisitsFilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  doctor,
  onDoctorChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  doctorOptions = [],
  activeTab = 'all',
  onTabChange,
}) => {
  const statusOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'PENDING', label: 'Chờ khám' },
    { value: 'IN_PROGRESS', label: 'Đang khám' },
    { value: 'WAITING_RESULT', label: 'Chờ kết quả' },
    { value: 'DONE', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  const defaultDoctorOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả bác sĩ' },
    ...doctorOptions,
  ];

  const tabs = [
    { value: 'all', label: 'Tất cả' },
    { value: 'today', label: 'Hôm nay' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm bệnh nhân..."
      tabs={onTabChange ? {
        options: tabs,
        value: activeTab,
        onChange: onTabChange,
      } : undefined}
      filters={[
        {
          key: 'status',
          label: 'Trạng thái',
          options: statusOptions,
          value: status,
          onChange: onStatusChange,
          placeholder: 'Trạng thái',
        },
        {
          key: 'doctor',
          label: 'Bác sĩ',
          options: doctorOptions.length > 0 ? defaultDoctorOptions : [],
          value: doctor,
          onChange: onDoctorChange,
          placeholder: 'Bác sĩ',
        },
      ]}
      advancedFilters={{
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