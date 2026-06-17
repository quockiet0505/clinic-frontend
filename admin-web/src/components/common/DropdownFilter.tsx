// components/common/DropdownFilter.tsx
import React, { useState, useRef, useEffect } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

interface DropdownFilterProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DropdownFilter({
  label,
  options,
  value,
  onChange,
  placeholder,
  className = '',
}: DropdownFilterProps) {
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
    <div className={`w-full sm:w-44 shrink-0 relative z-30 ${className}`} ref={ref}>
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