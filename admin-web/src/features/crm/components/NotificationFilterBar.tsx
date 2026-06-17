import React from 'react';
import { FilterBar, TabOption } from '@/components/common/FilterBar';

interface NotificationFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const tabs: TabOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'SYSTEM', label: 'Hệ thống' },
    { value: 'EMAIL', label: 'Email' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm người nhận hoặc nội dung..."
      tabs={{
        options: tabs,
        value: type,
        onChange: onTypeChange,
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