import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
}

interface HoverDropdownProps {
  value: string;
  items: DropdownItem[];
  onChange: (value: string) => void;
}

export const HoverDropdown: React.FC<HoverDropdownProps> = ({
  value,
  items,
  onChange,
}) => {
  const activeItem = items.find((item) => item.value === value);

  return (
    <div className="relative group">
      {/* Trigger */}
      <button
        className="flex items-center gap-2 h-[42px] px-3 rounded-xl border border-primary-200 bg-gradient-to-b from-gradient-white-blue to-gradient-blue-light hover:shadow-md transition-all cursor-pointer"
      >
        {activeItem?.icon && (
          <img
            src={activeItem.icon}
            alt={activeItem.label}
            className="w-6 h-4 rounded-sm object-cover"
          />
        )}
        <span className="font-semibold text-sm text-primary-500">
          {activeItem?.label}
        </span>
        <ChevronDown className="w-4 h-4 text-primary-500 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      {/* Dropdown */}
      <div
        className="absolute top-[48px] left-0 min-w-[100px] w-max overflow-hidden rounded-xl border border-primary-100 bg-white shadow-lg opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50"
      >
        {items.map((item) => {
          const isActive = item.value === value;
          return (
            <button
              key={item.value}
              onClick={() => onChange(item.value)}
              className={`relative w-full flex items-center gap-3 px-4 py-2.5 text-left whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-50 text-primary-500'
                  : 'text-brand-dark hover:bg-white hover:text-primary-500'
              }`}
            >
              {/* Blue line left */}
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-[3px] bg-primary-500" />
              )}
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-6 h-4 rounded-sm object-cover"
                />
              )}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};