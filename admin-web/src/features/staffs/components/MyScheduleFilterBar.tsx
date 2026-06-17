// features/staff/components/MyScheduleFilterBar.tsx
import React from 'react';
import { FilterBar, FilterOption, TabOption } from '@/components/common/FilterBar';

interface MyScheduleFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  leaveTypeFilter: string;
  onLeaveTypeChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export const MyScheduleFilterBar: React.FC<MyScheduleFilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  leaveTypeFilter,
  onLeaveTypeChange,
  activeTab,
  onTabChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const statusOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Từ chối' },
  ];

  const leaveTypeOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả loại' },
    { value: 'ANNUAL', label: 'Nghỉ phép năm' },
    { value: 'SICK', label: 'Nghỉ ốm' },
    { value: 'UNPAID', label: 'Nghỉ không lương' },
    { value: 'OTHER', label: 'Loại khác' },
  ];

  const tabs: TabOption[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'tomorrow', label: 'Ngày mai' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo lý do hoặc ngày..."
      tabs={{
        options: tabs,
        value: activeTab,
        onChange: onTabChange,
      }}
      filters={[
        {
          key: 'status',
          label: 'Trạng thái',
          options: statusOptions,
          value: statusFilter,
          onChange: onStatusChange,
          placeholder: 'Trạng thái',
        },
      ]}
      advancedFilters={{
        filters: [
          {
            key: 'leaveType',
            label: 'Loại nghỉ phép',
            options: leaveTypeOptions,
            value: leaveTypeFilter,
            onChange: onLeaveTypeChange,
            placeholder: 'Loại nghỉ phép',
          },
        ],
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