import React from 'react';
import { HoverDropdown } from './HoverDropdown';
import { SearchInput } from './SearchInput';

interface SearchFilterBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  priceFilter?: 'all' | 'low' | 'high';
  onPriceFilterChange?: (value: 'all' | 'low' | 'high') => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  value: externalValue,
  onChange,
  placeholder = 'Tìm kiếm...',
  showFilter = true,
  priceFilter = 'all',
  onPriceFilterChange,
}) => {
  const priceOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Dưới 500k', value: 'low' },
    { label: 'Trên 500k', value: 'high' },
  ];

  const handleSearch = (keyword: string) => {
    onChange(keyword);
  };

  return (
    <div className="w-full max-w-2xl flex items-center gap-3">
      <div className="flex-1">
        <SearchInput
          value={externalValue}
          onSearch={handleSearch}
          placeholder={placeholder}
          className="shadow-[0_10px_35px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] transition-all"
        />
      </div>
      {showFilter && (
        <div className="w-[190px] shrink-0">
          <HoverDropdown
            value={priceFilter}
            items={priceOptions}
            onChange={(val) => onPriceFilterChange?.(val as 'all' | 'low' | 'high')}
          />
        </div>
      )}
    </div>
  );
};