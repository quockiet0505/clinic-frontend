// features/staff/components/StaffFilterBar.tsx
import React from 'react';
import { FilterBar, TabOption, FilterWithValue } from '@/components/common/FilterBar';

interface StaffFilterBarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  ratingFilter: string;
  onRatingChange: (value: string) => void;
  fromDate?: string;
  toDate?: string;
  onFromDateChange?: (value: string) => void;
  onToDateChange?: (value: string) => void;
}

export const StaffFilterBar: React.FC<StaffFilterBarProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  ratingFilter,
  onRatingChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const tabs: TabOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'DOCTOR', label: 'Bác sĩ' },
    { value: 'STAFF', label: 'Nhân viên' },
    { value: 'LAB_TECH', label: 'Kỹ thuật viên' },
    { value: 'ADMIN', label: 'Quản trị viên' },
  ];

  const ratingOptions: FilterWithValue[] = [
    {
      key: 'rating',
      label: 'Đánh giá',
      options: [
        { value: 'ALL', label: 'Tất cả' },
        { value: '3', label: '⭐⭐⭐' },
        { value: '4', label: '⭐⭐⭐⭐' },
        { value: '5', label: '⭐⭐⭐⭐⭐' },
      ],
      value: ratingFilter,
      onChange: onRatingChange,
      placeholder: 'Chọn số sao',
    },
  ];

  return (
    <FilterBar
      searchValue={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm tên hoặc email..."
      tabs={{
        options: tabs,
        value: activeTab,
        onChange: onTabChange,
      }}
      advancedFilters={{
        filters: ratingOptions,
        dateRange: fromDate !== undefined && onFromDateChange ? {
          from: fromDate,
          to: toDate || '',
          onFromChange: onFromDateChange,
          onToChange: onToDateChange || (() => {}),
        } : undefined,
      }}
    />
  );
};