import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  className?: string;
  children?: React.ReactNode;
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  [key: string]: any;
}

export default function CustomSelect({ className = '', children, value, onChange, ...props }: Props) {
  
  // Extract options from children (flattening any mapped arrays)
  const options = React.Children.toArray(children).map((child: any) => {
    if (child && child.type === 'option') {
      return { value: child.props.value, label: child.props.children };
    }
    return null;
  }).filter(Boolean);

  const handleValueChange = (val: string) => {
    if (onChange) {
      onChange({ target: { value: val, name: props.name } });
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className={`h-11 rounded-[16px] px-4 font-medium text-slate-700 bg-white border-slate-200 shadow-sm hover:border-primary-300 transition-all focus:ring-4 focus:ring-primary-100 focus:border-primary-400 w-full ${className}`}>
        <SelectValue placeholder="Chọn..." />
      </SelectTrigger>
      <SelectContent position="popper" side="bottom" className="rounded-[16px] border-slate-200 shadow-lg p-1 min-w-[200px]">
        {options.map((opt: any) => (
          <SelectItem 
            key={opt.value} 
            value={opt.value} 
            className="cursor-pointer font-medium hover:bg-slate-50 focus:bg-primary-50 focus:text-primary-700 transition-colors rounded-xl px-3 py-2.5 text-sm my-0.5"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
