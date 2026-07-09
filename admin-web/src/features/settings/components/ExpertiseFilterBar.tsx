// features/settings/components/ExpertiseFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';

interface ExpertiseFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ExpertiseFilterBar: React.FC<ExpertiseFilterBarProps> = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  activeTab,
  onTabChange,
}) => {
  const sortOptions: FilterOption[] = [
    { value: 'name_asc', label: 'Tên A → Z' },
    { value: 'name_desc', label: 'Tên Z → A' },
    activeTab === 'CLINICAL' 
      ? { value: 'doctor_asc', label: 'Số bác sĩ tăng dần' }
      : { value: 'doctor_asc', label: 'Số kỹ thuật viên tăng dần' },
    activeTab === 'CLINICAL' 
      ? { value: 'doctor_desc', label: 'Số bác sĩ giảm dần' }
      : { value: 'doctor_desc', label: 'Số kỹ thuật viên giảm dần' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm tên chuyên khoa..."
      tabs={{
        options: [
          { value: 'CLINICAL', label: 'Chuyên khoa' },
          { value: 'TECHNICIAN', label: 'Kỹ thuật viên' },
        ],
        value: activeTab,
        onChange: onTabChange,
      }}
      advancedFilters={{
        filters: [
          {
            key: 'sort',
            label: 'Sắp xếp theo',
            options: sortOptions,
            value: sort,
            onChange: onSortChange,
            placeholder: 'Sắp xếp',
          },
        ],
      }}
    />
  );
};