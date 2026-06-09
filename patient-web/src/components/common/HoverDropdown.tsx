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
        className="flex items-center justify-center gap-1.5 h-10 px-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer bg-transparent"
      >
        {activeItem?.icon && (
          <img
            src={activeItem.icon}
            alt={activeItem.label}
            className="w-[28px] h-[20px] rounded-[2px] object-cover shadow-sm"
          />
        )}
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </button>

      {/* Dropdown */}
      <div
        className="absolute top-full right-0 mt-2 p-1.5 w-max min-w-[140px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50 flex flex-col gap-1"
      >
        {items.map((item) => {
          const isActive = item.value === value;
          return (
            <button
              key={item.value}
              onClick={() => onChange(item.value)}
              className={`flex items-center gap-3 w-full h-10 px-3 rounded-lg transition-all cursor-pointer ${
                isActive ? 'bg-primary-50 text-primary-600 font-semibold' : 'hover:bg-slate-50 text-slate-700 font-medium'
              }`}
            >
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-[28px] h-[20px] rounded-[2px] object-cover shadow-sm"
                />
              )}
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};