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
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
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
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-bold text-[#003B5C]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          /* Ensure icon is positioned correctly and does not block clicks */
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Icon className="w-5 h-5 text-[#00b5f1]" />
          </div>
        )}

        {/* Prevent Shadcn crash by mapping empty string to 'none' if undefined */}
        <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            className={`w-full h-[48px] rounded-2xl border-slate-200 bg-white text-left text-[14.5px] font-medium text-[#003B5C] shadow-none focus:ring-2 focus:ring-[#00b5f1]/20 ${
              Icon ? 'pl-12' : 'px-4'
            }`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          {/* ADDED: bg-white and z-50 to fix the transparent background overlap issue */}
          <SelectContent className="rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
            {options.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value || 'none'}
                className="cursor-pointer py-2.5 text-[14.5px] font-medium hover:bg-[#eaf7fd] hover:text-[#00b5f1]"
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