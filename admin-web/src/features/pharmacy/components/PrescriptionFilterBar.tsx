// features/pharmacy/components/PrescriptionFilterBar.tsx
import React from 'react';
import { FilterBar } from '@/components/common/FilterBar';

interface PrescriptionFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export const PrescriptionFilterBar: React.FC<PrescriptionFilterBarProps> = ({
  search,
  onSearchChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên bệnh nhân, mã đơn..."
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