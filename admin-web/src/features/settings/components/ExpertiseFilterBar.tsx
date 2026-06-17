// features/settings/components/ExpertiseFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';

interface ExpertiseFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export const ExpertiseFilterBar: React.FC<ExpertiseFilterBarProps> = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
}) => {
  const sortOptions: FilterOption[] = [
    { value: 'name_asc', label: 'Tên A → Z' },
    { value: 'name_desc', label: 'Tên Z → A' },
    { value: 'doctor_asc', label: 'Số bác sĩ tăng dần' },
    { value: 'doctor_desc', label: 'Số bác sĩ giảm dần' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm tên chuyên khoa..."
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