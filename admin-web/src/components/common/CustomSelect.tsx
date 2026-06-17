// components/common/CustomSelect.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  
  const options = React.Children.toArray(children).map((child: any) => {
    if (child && child.type === 'option') {
      return { value: child.props.value, label: child.props.children };
    }
    return null;
  }).filter(Boolean);

  const handleValueChange = (val: string) => {
    if (onChange) {
      const event = {
        target: { value: val, name: name || '' }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  };

  const triggerHeight = compact ? 'h-9' : 'h-11';
  const triggerPadding = compact ? 'px-3' : 'px-4';
  const triggerFontSize = compact ? 'text-xs' : 'text-sm';
  const itemPadding = compact ? 'px-3 py-1.5' : 'px-3 py-2.5';
  const itemFontSize = compact ? 'text-xs' : 'text-sm';
  const contentPadding = compact ? 'p-0.5' : 'p-1';

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger 
        className={`${triggerHeight} ${triggerPadding} ${triggerFontSize} rounded-[16px] font-medium text-slate-700 bg-white border-slate-200 shadow-sm hover:border-primary-300 transition-all focus:ring-4 focus:ring-primary-100 focus:border-primary-400 w-full ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" side="bottom" className={`rounded-[16px] border-slate-200 shadow-lg ${contentPadding} min-w-[200px]`}>
        {options.map((opt: any) => (
          <SelectItem 
            key={opt.value} 
            value={opt.value} 
            className={`cursor-pointer font-medium hover:bg-slate-50 focus:bg-primary-50 focus:text-primary-700 transition-colors rounded-xl ${itemPadding} ${itemFontSize} my-0.5`}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}