// components/common/DateRangeFilter.tsx
import React from 'react';

interface Props {
  from: string;
  to: string;
  onChangeFrom: (val: string) => void;
  onChangeTo: (val: string) => void;
  className?: string;
  compact?: boolean; // thêm prop để điều chỉnh kích thước
}

export default function DateRangeFilter({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  className = '',
  compact = false,
}: Props) {
  // Style cho chế độ compact (dùng trong popup)
  const inputHeight = compact ? 'h-9' : 'h-11';
  const rounded = compact ? 'rounded-xl' : 'rounded-[16px]';
  const fontSize = compact ? 'text-xs' : 'text-sm';
  const paddingX = compact ? 'px-2' : 'px-3';
  const gap = compact ? 'gap-2' : 'gap-3';
  const labelMargin = compact ? 'mr-1' : 'mr-2';

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-3 w-full ${className}`}>
      <div
        className={`flex items-center bg-white border border-slate-200 ${rounded} ${paddingX} ${inputHeight} w-full sm:w-auto flex-1 min-w-0`}
      >
        <span className={`${fontSize} font-medium text-slate-700 ${labelMargin} shrink-0`}>Từ</span>
        <input
          type="date"
          value={from}
          max={to || undefined}
          onChange={(e) => {
            const val = e.target.value;
            if (to && val > to) onChangeTo(val);
            onChangeFrom(val);
          }}
          className={`h-full border-0 bg-transparent px-0 w-full min-w-[80px] ${fontSize} font-medium text-primary-600 outline-none cursor-pointer`}
        />
      </div>

      <div
        className={`flex items-center bg-white border border-slate-200 ${rounded} ${paddingX} ${inputHeight} w-full sm:w-auto flex-1 min-w-0`}
      >
        <span className={`${fontSize} font-medium text-slate-700 ${labelMargin} shrink-0`}>Đến</span>
        <input
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => {
            const val = e.target.value;
            if (from && val < from) onChangeFrom(val);
            onChangeTo(val);
          }}
          className={`h-full border-0 bg-transparent px-0 w-full min-w-[80px] ${fontSize} font-medium text-primary-600 outline-none cursor-pointer`}
        />
      </div>
    </div>
  );
}