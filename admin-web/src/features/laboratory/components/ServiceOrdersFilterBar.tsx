// features/laboratory/components/ServiceOrdersFilterBar.tsx
import React from 'react';
import { FilterBar, TabOption } from '@/components/common/FilterBar';

interface ServiceOrdersFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export const ServiceOrdersFilterBar: React.FC<ServiceOrdersFilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const tabs: TabOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'ORDERED', label: 'Chờ lấy mẫu' },
    { value: 'DONE', label: 'Đã có kết quả' },
    { value: 'REJECTED', label: 'Từ chối mẫu' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm bệnh nhân hoặc xét nghiệm..."
      tabs={{
        options: tabs,
        value: status,
        onChange: onStatusChange,
      }}
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