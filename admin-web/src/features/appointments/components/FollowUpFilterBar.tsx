// features/follow-ups/components/FollowUpFilterBar.tsx
import React from 'react';
import { FilterBar, TabOption } from '@/components/common/FilterBar';

interface FollowUpFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export const FollowUpFilterBar: React.FC<FollowUpFilterBarProps> = ({
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const tabOptions: TabOption[] = [
    { value: 'PENDING', label: 'Chờ xử lý' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm bệnh nhân..."
      tabs={{
        options: tabOptions,
        value: activeTab,
        onChange: onTabChange,
      }}
      advancedFilters={{
        // Không có filter dropdown nào ngoài date range
        dateRange: {
          from: fromDate,
          to: toDate,
          onFromChange: onFromDateChange,
          onToChange: onToDateChange,
        },
        // filters: [] // không cần vì đã optional
      }}
    />
  );
};