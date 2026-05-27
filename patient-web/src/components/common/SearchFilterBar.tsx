import React from 'react';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

import { FormSelect } from './FormSelect';

interface SearchFilterBarProps {
  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  showFilter?: boolean;

  priceFilter?: 'all' | 'low' | 'high';

  onPriceFilterChange?: (
    value: 'all' | 'low' | 'high'
  ) => void;
}

export const SearchFilterBar: React.FC<
  SearchFilterBarProps
> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  showFilter = true,
  priceFilter = 'all',
  onPriceFilterChange,
}) => {
  return (
    <div className="w-full max-w-2xl flex items-center gap-3">

      <div
        className="
          flex-1
          bg-white/95
          backdrop-blur-xl
          rounded-2xl
          shadow-[0_10px_35px_rgba(15,23,42,0.08)]
          flex
          items-center
          px-5
          h-[56px]
          border
          border-white
          hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)]
          transition-all
        "
      >
        <Search className="w-5 h-5 text-primary-500 shrink-0" />

        <Input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="
            border-0
            shadow-none
            focus-visible:ring-0
            bg-transparent
            text-[15px]
          "
        />
      </div>

      {showFilter && (
        <div className="w-[190px] shrink-0 ">
          <FormSelect
            compact
            label=""
            value={priceFilter}
            onChange={(value) =>
              onPriceFilterChange?.(
                value as 'all' | 'low' | 'high'
              )
            }
            options={[
              {
                label: 'Tất cả',
                value: 'all',
              },
              {
                label: 'Dưới 500k',
                value: 'low',
              },
              {
                label: 'Trên 500k',
                value: 'high',
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};