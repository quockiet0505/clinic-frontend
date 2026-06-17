// features/laboratory/components/LabResultsFilterBar.tsx
import React from 'react';
import { FilterBar } from '@/components/common/FilterBar';

interface LabResultsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export const LabResultsFilterBar: React.FC<LabResultsFilterBarProps> = ({
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
      searchPlaceholder="Tìm kiếm bệnh nhân, xét nghiệm hoặc mã..."
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