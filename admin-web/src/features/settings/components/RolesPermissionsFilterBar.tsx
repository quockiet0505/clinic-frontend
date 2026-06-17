// features/settings/components/RolesPermissionsFilterBar.tsx
import React from 'react';
import { FilterBar } from '@/components/common/FilterBar';

interface RolesPermissionsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const RolesPermissionsFilterBar: React.FC<RolesPermissionsFilterBarProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm vai trò..."
    />
  );
};