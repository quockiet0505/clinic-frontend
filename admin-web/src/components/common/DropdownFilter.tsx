import React, { useState, useRef } from 'react';

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
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder || label;

  return (
    <div
      className={`w-full sm:w-44 shrink-0 relative z-50 ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`w-full h-11 flex items-center justify-between px-4 rounded-full bg-white border shadow-sm font-medium text-slate-700 cursor-pointer transition-colors ${
          isOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200'
        }`}
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
          className={`transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div
        className={`absolute left-0 right-0 top-full pt-2 transition-all duration-200 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
        }`}
      >
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
    </div>
  );
}