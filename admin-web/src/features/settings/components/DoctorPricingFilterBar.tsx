// features/settings/components/DoctorPricingFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';

interface DoctorPricingFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export const DoctorPricingFilterBar: React.FC<DoctorPricingFilterBarProps> = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
}) => {
  const sortOptions: FilterOption[] = [
    { value: 'doctor_asc', label: 'Tên bác sĩ A → Z' },
    { value: 'doctor_desc', label: 'Tên bác sĩ Z → A' },
    { value: 'price_asc', label: 'Giá thấp → cao' },
    { value: 'price_desc', label: 'Giá cao → thấp' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo tên bác sĩ..."
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