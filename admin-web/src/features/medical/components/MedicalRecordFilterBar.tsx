// features/medical/components/MedicalRecordFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';

interface MedicalRecordFilterBarProps {
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
}

export const MedicalRecordFilterBar: React.FC<MedicalRecordFilterBarProps> = ({
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
}) => {
  const statusOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'DONE', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  const defaultDoctorOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả bác sĩ' },
    ...doctorOptions,
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm bệnh án..."
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