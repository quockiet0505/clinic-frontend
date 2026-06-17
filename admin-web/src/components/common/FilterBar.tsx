import React, { useState, useRef, useEffect, ReactNode } from 'react';
import SearchInput from './SearchInput';
import DateRangeFilter from './DateRangeFilter';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import GradientButton from './GradientButton';
import { CancelButton } from './ActionButtons';

export interface TabOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterWithValue {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface AdvancedFiltersConfig {
  filters?: FilterWithValue[];
  dateRange?: {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
  };
}

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  tabs?: {
    options: TabOption[];
    value: string;
    onChange: (value: string) => void;
  };

  filters?: FilterWithValue[];
  advancedFilters?: AdvancedFiltersConfig;
  children?: ReactNode;
  className?: string;
  noBorder?: boolean;
}

const FilterBarComponent: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  tabs,
  filters = [],
  advancedFilters,
  children,
  className = '',
  noBorder = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const [tempFilters, setTempFilters] = useState<Record<string, string>>({});
  const [tempDateFrom, setTempDateFrom] = useState('');
  const [tempDateTo, setTempDateTo] = useState('');

  useEffect(() => {
    if (showAdvanced && advancedFilters) {
      const initial: Record<string, string> = {};
      if (advancedFilters.filters) {
        advancedFilters.filters.forEach((f) => {
          initial[f.key] = f.value;
        });
      }
      setTempFilters(initial);
      if (advancedFilters.dateRange) {
        setTempDateFrom(advancedFilters.dateRange.from);
        setTempDateTo(advancedFilters.dateRange.to);
      }
    }
  }, [showAdvanced, advancedFilters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowAdvanced(false);
      }
    };
    if (showAdvanced) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAdvanced]);

  const handleApply = () => {
    if (advancedFilters) {
      if (advancedFilters.filters) {
        advancedFilters.filters.forEach((f) => {
          f.onChange(tempFilters[f.key] || 'ALL');
        });
      }
      if (advancedFilters.dateRange) {
        advancedFilters.dateRange.onFromChange(tempDateFrom);
        advancedFilters.dateRange.onToChange(tempDateTo);
      }
    }
    setShowAdvanced(false);
  };

  const handleCancel = () => {
    if (advancedFilters) {
      const resetFilters: Record<string, string> = {};
      advancedFilters.filters?.forEach((f) => {
        resetFilters[f.key] = 'ALL';
        f.onChange('ALL');
      });
      setTempFilters(resetFilters);
      if (advancedFilters.dateRange) {
        setTempDateFrom('');
        setTempDateTo('');
        advancedFilters.dateRange.onFromChange('');
        advancedFilters.dateRange.onToChange('');
      }
    }
    setShowAdvanced(false);
  };

  const wrapperClass = noBorder
    ? 'flex flex-col gap-3 w-full'
    : 'flex flex-col gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm w-full';

  return (
    <div className={`${wrapperClass} ${className}`}>
      <div className="flex flex-wrap items-center gap-3 w-full">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
          {tabs ? (
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
              {tabs.options.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => tabs?.onChange(tab.value)}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    tabs.value === tab.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            searchValue !== undefined &&
            onSearchChange && (
              <div className="w-full sm:w-72">
                <SearchInput
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                />
              </div>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 ml-auto">
          {tabs && searchValue !== undefined && onSearchChange && (
            <div className="w-full sm:w-72">
              <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
              />
            </div>
          )}

          {filters.map((filter) => (
            <FilterDropdown
              key={filter.key}
              label={filter.label}
              options={filter.options}
              value={filter.value}
              onChange={filter.onChange}
              placeholder={filter.placeholder}
            />
          ))}

          {advancedFilters && (
            <div className="relative z-40" ref={popupRef}>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`h-11 w-11 rounded-full flex items-center justify-center border shadow-sm transition-colors cursor-pointer hover:border-blue-300 hover:text-blue-500 ${
                  showAdvanced
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
                title="Bộ lọc nâng cao"
              >
                <Filter size={18} />
              </button>

              {showAdvanced && (
                <div className="absolute right-0 top-full mt-2 w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 transition-none">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                      <SlidersHorizontal size={16} className="text-blue-500" />
                      Bộ lọc nâng cao
                    </h3>
                    <button
                      onClick={handleCancel}
                      className="p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X size={20} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {advancedFilters.filters &&
                      advancedFilters.filters.length > 0 &&
                      advancedFilters.filters.map((filter) => (
                        <div key={filter.key}>
                          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                            {filter.label}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {filter.options.map((opt) => {
                              const isActive =
                                (tempFilters[filter.key] || filter.value) === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() =>
                                    setTempFilters((prev) => ({
                                      ...prev,
                                      [filter.key]: opt.value,
                                    }))
                                  }
                                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-none cursor-pointer ${
                                    isActive
                                      ? 'border-2 border-blue-500 text-blue-600 bg-blue-50'
                                      : 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                    {advancedFilters.dateRange && (
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                          Khoảng thời gian
                        </label>
                        <DateRangeFilter
                          from={tempDateFrom}
                          to={tempDateTo}
                          onChangeFrom={setTempDateFrom}
                          onChangeTo={setTempDateTo}
                          className="w-full"
                          compact={true}
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                      <CancelButton
                        onClick={handleCancel}
                        label="Hủy"
                        className="h-9 px-4 text-sm font-semibold rounded-xl"
                      />
                      <GradientButton
                        onClick={handleApply}
                        className="h-9 px-4 text-sm font-semibold rounded-xl"
                      >
                        Áp dụng
                      </GradientButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

// Component FilterDropdown
function FilterDropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder || label;

  return (
    <div className="relative z-30 w-full sm:w-44 shrink-0" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 flex items-center justify-between px-4 rounded-full bg-white border shadow-sm font-medium text-slate-700 cursor-pointer transition-colors hover:border-blue-300"
      >
        <span className="text-[14px] truncate">{selectedLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full pt-2 z-50">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-1.5 flex flex-col gap-0.5 max-h-64 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left cursor-pointer py-2 px-3 text-[13.5px] font-medium rounded-xl transition-all ${
                  value === opt.value
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export named
export const FilterBar = FilterBarComponent;