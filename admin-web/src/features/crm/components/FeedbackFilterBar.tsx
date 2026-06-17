// features/crm/components/FeedbackFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption, TabOption } from '@/components/common/FilterBar';

interface FeedbackFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  rating: string;
  onRatingChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export const FeedbackFilterBar: React.FC<FeedbackFilterBarProps> = ({
  search,
  onSearchChange,
  rating,
  onRatingChange,
  activeTab,
  onTabChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const ratingOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả đánh giá' },
    { value: '5', label: '⭐⭐⭐⭐⭐' },
    { value: '4', label: '⭐⭐⭐⭐' },
    { value: '3', label: '⭐⭐⭐' },
    { value: '2', label: '⭐⭐' },
    { value: '1', label: '⭐' },
  ];

  const tabs: TabOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'CLINIC', label: 'Phòng khám' },
    { value: 'DOCTOR', label: 'Bác sĩ' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm bệnh nhân hoặc bác sĩ..."
      tabs={{
        options: tabs,
        value: activeTab,
        onChange: onTabChange,
      }}
      filters={[
        {
          key: 'rating',
          label: 'Số sao',
          options: ratingOptions,
          value: rating,
          onChange: onRatingChange,
          placeholder: 'Số sao',
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