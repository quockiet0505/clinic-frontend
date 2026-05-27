import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  icon: Icon,
  required,
  disabled,
  compact = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-bold text-brand-dark">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Icon className="w-5 h-5 text-primary-500" />
          </div>
        )}
        <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            className={`w-full cursor-pointer ${
              compact ? 'h-[56px]' : 'h-[52px]'
            } rounded-2xl border border-slate-200 bg-white text-left text-sm font-semibold text-brand-dark shadow-sm transition-all hover:shadow-md focus:ring-4 focus:ring-primary-500/10 ${
              Icon ? 'pl-12 pr-4' : 'px-4'
            }`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className="min-w-[var(--radix-select-trigger-width)] !border-0 ring-0 outline-none shadow-xl rounded-2xl bg-white p-2"
          >
            {options.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value || 'none'}
                className="cursor-pointer rounded-xl py-3 px-3 text-sm font-semibold text-slate-700 transition-all hover:bg-primary-50 hover:text-primary-500 focus:bg-primary-50 focus:text-primary-500"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};