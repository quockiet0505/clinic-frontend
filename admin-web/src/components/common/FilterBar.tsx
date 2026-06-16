import React, { ReactNode } from 'react';
import SearchInput  from './SearchInput';
import DateRangeFilter  from './DateRangeFilter';
import { DropdownFilter, FilterOption } from './DropdownFilter';

export interface TabOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  // Search
  searchValue: string;
  onSearchChange: (value: string) => void; // renamed from onSearchChange
  searchPlaceholder?: string;

  // Tabs
  tabs?: {
    options: TabOption[];
    value: string;
    onChange: (value: string) => void;
  };

  // Filters (dropdown)
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }[];

  // Date range
  dateRange?: {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
  };

  // Custom children
  children?: ReactNode;

  // Style
  className?: string;
  noBorder?: boolean;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  tabs,
  filters = [],
  dateRange,
  children,
  className = '',
  noBorder = false,
}: FilterBarProps) {
  const wrapperClass = noBorder
    ? 'flex flex-col gap-3 w-full'
    : 'flex flex-col gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm w-full';

  return (
    <div className={`${wrapperClass} ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {tabs && (
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
            {tabs.options.map((tab) => (
              <button
                key={tab.value}
                onClick={() => tabs?.onChange(tab.value)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  tabs.value === tab.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto ml-auto">
          <div className="w-full sm:w-56">
            <SearchInput
              value={searchValue}
              onChange={onSearchChange}  // sửa: onSearch -> onChange
              placeholder={searchPlaceholder}
              className="h-11"
            />
          </div>

          {filters.map((filter) => (
            <DropdownFilter
              key={filter.key}
              label={filter.label}
              options={filter.options}
              value={filter.value}
              onChange={filter.onChange}
              placeholder={filter.placeholder}
            />
          ))}

          {dateRange && (
            <DateRangeFilter
              from={dateRange.from}
              to={dateRange.to}
              onChangeFrom={dateRange.onFromChange}
              onChangeTo={dateRange.onToChange}
            />
          )}

          {children}
        </div>
      </div>
    </div>
  );
}