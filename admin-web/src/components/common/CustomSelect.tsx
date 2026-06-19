// components/common/CustomSelect.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const NONE_SELECT_VALUE = '__none__';

interface Props {
  className?: string;
  children?: React.ReactNode;
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  compact?: boolean; // thêm prop
  [key: string]: any;
}

export default function CustomSelect({ 
  className = '', 
  children, 
  value, 
  name,
  onChange, 
  placeholder = 'Chọn...',
  compact = false,
  ...props 
}: Props) {
  
  const options = React.Children.toArray(children)
    .map((child: any) => {
      if (child && child.type === 'option') {
        const raw = child.props.value;
        const val = raw === '' || raw == null ? NONE_SELECT_VALUE : String(raw);
        return { value: val, label: child.props.children, rawValue: raw };
      }
      return null;
    })
    .filter(Boolean);

  const handleValueChange = (val: string) => {
    if (onChange) {
      const out = val === NONE_SELECT_VALUE ? '' : val;
      const event = {
        target: { value: out, name: name || '' },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  };

  const selectValue = value === '' || value == null ? NONE_SELECT_VALUE : String(value);

  const triggerHeight = compact ? 'h-9' : 'h-11';
  const triggerRadius = compact ? 'rounded-xl' : 'rounded-[16px]';
  const triggerPadding = 'px-3';
  const fontSize = 'text-sm';
  const itemPadding = compact ? 'px-3 py-2' : 'px-3 py-2.5';
  const contentPadding = compact ? 'p-0.5' : 'p-1';

  return (
    <div className="w-full min-w-0">
      <Select value={selectValue} onValueChange={handleValueChange}>
        <SelectTrigger
          size={compact ? 'sm' : 'default'}
          className={`${triggerHeight} ${triggerRadius} ${triggerPadding} ${fontSize} font-medium text-slate-700 bg-white border-slate-200 shadow-sm hover:border-primary-300 transition-all focus:ring-4 focus:ring-primary-100 focus:border-primary-400 w-full min-w-0 ${className}`}
          {...props}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          className={`${triggerRadius} border-slate-200 shadow-lg ${contentPadding} ${fontSize} w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]`}
        >
          {options.map((opt: any) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className={`cursor-pointer font-medium hover:bg-slate-50 focus:bg-primary-50 focus:text-primary-700 transition-colors rounded-xl ${itemPadding} ${fontSize} my-0.5`}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}