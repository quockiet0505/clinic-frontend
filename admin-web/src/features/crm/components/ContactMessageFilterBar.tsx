import React from 'react';
import { FilterBar, TabOption } from '@/components/common/FilterBar';

interface Props {
  status: string;
  setStatus: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function ContactMessageFilterBar({ status, setStatus, search, onSearchChange }: Props) {
  const tabs: TabOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Đang chờ' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'RESOLVED', label: 'Đã giải quyết' },
    { value: 'REJECTED', label: 'Từ chối' },
  ];

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm người gửi hoặc chủ đề..."
      tabs={{
        options: tabs,
        value: status,
        onChange: setStatus,
      }}
    />
  );
}
