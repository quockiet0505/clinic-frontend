import React from 'react';
import { FilterBar, TabOption, FilterWithValue } from '@/components/common/FilterBar';

interface Props {
  activeView: string;
  setActiveView: (v: string) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  filterDate: string;
  setFilterDate: (v: string) => void;
}

export default function LeaveRequestsFilterBar({
  activeView,
  setActiveView,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  filterDate,
  setFilterDate
}: Props) {
  const tabs: TabOption[] = [
    { value: 'TODAY', label: 'Hôm nay' },
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'PROCESSED', label: 'Đã xử lý' }
  ];

  const roleOptions: FilterWithValue[] = [
    {
      key: 'role',
      label: 'Vai trò',
      options: [
        { value: 'ALL', label: 'Tất cả vai trò' },
        { value: 'DOCTOR', label: 'Bác sĩ' },
        { value: 'RECEPTIONIST', label: 'Tiếp tân' },
        { value: 'NURSE', label: 'Y tá' },
        { value: 'LAB_TECH', label: 'Kỹ thuật viên' },
      ],
      value: roleFilter,
      onChange: setRoleFilter,
      placeholder: 'Chọn vai trò',
    },
  ];

  return (
    <FilterBar
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Tìm kiếm tên nhân viên..."
      tabs={{
        options: tabs,
        value: activeView,
        onChange: setActiveView,
      }}
      filters={roleOptions}
      advancedFilters={activeView !== 'TODAY' ? {
        dateRange: {
          from: filterDate,
          to: '',
          onFromChange: setFilterDate,
          onToChange: () => {}, // We only use one date for now
        }
      } : undefined}
    />
  );
}