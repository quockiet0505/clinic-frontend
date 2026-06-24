import React from 'react';
import CustomSelect from './CustomSelect';
import { BLOOD_TYPE_OPTIONS } from '@/constants/bloodTypes';

interface BloodTypeSelectProps {
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  compact?: boolean;
  placeholder?: string;
  className?: string;
}

export default function BloodTypeSelect({
  value = '',
  onChange,
  name,
  compact = false,
  placeholder = 'Chọn nhóm máu',
  className,
}: BloodTypeSelectProps) {
  return (
    <CustomSelect
      value={value}
      name={name}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      compact={compact}
      className={className}
    >
      {BLOOD_TYPE_OPTIONS.map((opt) => (
        <option key={opt.value || '__unknown__'} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </CustomSelect>
  );
}
