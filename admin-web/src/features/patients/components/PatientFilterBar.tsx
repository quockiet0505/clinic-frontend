// features/patients/components/PatientFilterBar.tsx
import React from 'react';
import { FilterBar, TabOption } from '@/components/common/FilterBar';

interface PatientFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  genderTab: string;
  onGenderTabChange: (value: string) => void;
}

export const PatientFilterBar: React.FC<PatientFilterBarProps> = ({
  search,
  onSearchChange,
  genderTab,
  onGenderTabChange,
}) => {
  const genderOptions: TabOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm bệnh nhân..."
      tabs={{
        options: genderOptions,
        value: genderTab,
        onChange: onGenderTabChange,
      }}
      // Không cần filters hay advancedFilters
    />
  );
};