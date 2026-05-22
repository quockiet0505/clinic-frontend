import React from 'react';

import { Textarea } from '@/components/ui/textarea';

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-bold text-[#003B5C]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[110px] rounded-2xl border-slate-200 p-4 text-[14px] shadow-none focus-visible:ring-2 focus-visible:ring-[#00b5f1]/20"
      />
    </div>
  );
};