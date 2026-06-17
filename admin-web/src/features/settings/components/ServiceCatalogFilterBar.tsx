// features/settings/components/ServiceCatalogFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';

interface ServiceCatalogFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export const ServiceCatalogFilterBar: React.FC<ServiceCatalogFilterBarProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
}) => {
  const typeOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả loại' },
    { value: 'EXAM', label: 'Khám bệnh' },
    { value: 'LAB_TEST', label: 'Xét nghiệm' },
    { value: 'IMAGING', label: 'Chẩn đoán hình ảnh' },
  ];

  const sortOptions: FilterOption[] = [
    { value: 'name_asc', label: 'Tên A → Z' },
    { value: 'name_desc', label: 'Tên Z → A' },
    { value: 'price_asc', label: 'Giá thấp → cao' },
    { value: 'price_desc', label: 'Giá cao → thấp' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm dịch vụ..."
      filters={[
        {
          key: 'type',
          label: 'Loại dịch vụ',
          options: typeOptions,
          value: type,
          onChange: onTypeChange,
          placeholder: 'Loại dịch vụ',
        },
      ]}
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