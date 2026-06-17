// features/pharmacy/components/PrescriptionFilterBar.tsx
import React from 'react';
import { FilterBar, TabOption } from '@/components/common/FilterBar';

interface PrescriptionFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export const PrescriptionFilterBar: React.FC<PrescriptionFilterBarProps> = ({
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
    { value: 'PENDING', label: 'Chờ phát' },
    { value: 'DISPENSED', label: 'Đã phát' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên bệnh nhân, mã đơn..."
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