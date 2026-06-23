// components/common/FormDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomSelect from './CustomSelect';
import SelectReact from 'react-select';

export type FieldType = 'text' | 'number' | 'date' | 'time' | 'textarea' | 'select' | 'combobox' | 'password';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  colSpan?: 1 | 2;
}

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
  fields: FieldConfig[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>, isEdit: boolean) => void;
  submitLabel?: string;
  cancelLabel?: string;
  validate?: (data: Record<string, any>) => boolean;
  compact?: boolean;
  columns?: 1 | 2;
  wide?: boolean;
  renderBeforeFields?: (ctx: {
    formData: Record<string, any>;
    onChange: (name: string, value: any, setTouchedFlag?: boolean) => void;
  }) => React.ReactNode;
  renderFooter?: (formData: Record<string, any>) => React.ReactNode;
}

export default function FormDialog({
  open,
  onClose,
  title,
  description,
  icon,
  fields,
  initialData,
  onSubmit,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
  validate,
  compact = false,
  columns = 1,
  wide = false,
  renderBeforeFields,
  renderFooter,
}: FormDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        const initial = { ...initialData };
        fields.forEach(field => {
          if (field.type === 'number' && initial[field.name] !== undefined) {
            initial[field.name] = Number(initial[field.name]);
          }
        });
        setFormData(initial);
      } else {
        const empty: Record<string, any> = {};
        fields.forEach(field => {
          empty[field.name] = field.type === 'number' ? '' : '';
        });
        setFormData(empty);
      }
      setTouched({});
    }
  }, [open, initialData]);

  const handleChange = (name: string, value: any, setTouchedFlag: boolean = true) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (setTouchedFlag) {
      setTouched(prev => ({ ...prev, [name]: true }));
    } else {
      setTouched(prev => ({ ...prev, [name]: false }));
    }
  };

  const isRequiredMissing = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        return true;
      }
    }
    return false;
  };

  const isValid = validate ? validate(formData) : !isRequiredMissing();

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(formData, !!initialData);
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name] ?? '';
    const isInvalid = field.required && touched[field.name] && !value;

    // ✅ TĂNG FONT CHO INPUT
    const inputClassName = compact
      ? `h-9 rounded-xl font-medium text-sm ${isInvalid ? 'border-red-500' : ''}` // text-sm = 14px
      : `h-11 rounded-[16px] font-medium ${isInvalid ? 'border-red-500' : ''}`;

    // ✅ TĂNG FONT CHO TEXTAREA
    const textareaClassName = compact
      ? `w-full rounded-xl border border-input bg-white p-2 text-sm font-medium outline-none resize-none hover:border-primary-300 focus-visible:border-primary-400 focus-visible:ring-4 focus-visible:ring-primary-100 transition-all duration-200 ${isInvalid ? 'border-red-500' : ''}`
      : `flex w-full rounded-[16px] border border-input bg-white p-3 font-medium outline-none resize-none hover:border-primary-300 focus-visible:border-primary-400 focus-visible:ring-4 focus-visible:ring-primary-100 transition-all duration-200 ${isInvalid ? 'border-red-500' : ''}`;

    // ✅ TĂNG FONT CHO LABEL
    const labelClassName = compact ? 'text-sm font-semibold' : 'text-sm font-medium';

    switch (field.type) {
      case 'select':
        return (
          <CustomSelect
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full"
            compact={compact}
          >
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </CustomSelect>
        );
      case 'combobox':
        return (
          <SelectReact
            options={field.options}
            value={field.options?.find(o => o.value === value) || null}
            onChange={(selectedOption: any) => handleChange(field.name, selectedOption ? selectedOption.value : '')}
            isSearchable
            placeholder={field.placeholder || "Chọn hoặc gõ tìm kiếm..."}
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                height: compact ? '36px' : '44px',
                minHeight: compact ? '36px' : '44px',
                borderRadius: compact ? '0.75rem' : '1rem',
                border: isInvalid ? '1px solid #ef4444' : '1px solid #e2e8f0',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#93c5fd'
                }
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999
              })
            }}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={field.rows || (compact ? 2 : 3)}
            className={textareaClassName}
            placeholder={field.placeholder}
          />
        );
      case 'date':
      case 'time':
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${inputClassName} cursor-pointer ${compact ? 'w-full' : ''}`}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value === '' ? '' : Number(e.target.value))}
            className={inputClassName}
            placeholder={field.placeholder}
          />
        );
      case 'password':
        return (
          <Input
            type="password"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={inputClassName}
            placeholder={field.placeholder}
          />
        );
      default: // text
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={inputClassName}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${wide ? 'sm:max-w-[672px]' : 'sm:max-w-[500px]'} p-0 border-0 rounded-[24px] shadow-2xl ${compact ? 'max-w-[480px]' : ''}`}>
        {/* ✅ TĂNG FONT CHO HEADER */}
        <div className={`${compact ? 'p-5' : 'p-6'} bg-primary-50 border-b border-primary-100 rounded-t-[24px]`}>
          {icon && <div className={`flex items-center gap-2 mb-2 text-primary-600 ${compact ? 'text-sm' : ''}`}>{icon}</div>}
          <DialogTitle className={`${compact ? 'text-2xl' : 'text-2xl'} font-semibold`}>{title}</DialogTitle>
          <DialogDescription className={`text-sm text-primary-600/80 font-medium mt-1 ${compact ? 'text-sm' : ''}`}>
            {description}
          </DialogDescription>
        </div>

        <div className={`${compact ? 'p-5' : 'p-6'} bg-white custom-scrollbar ${fields.length > 5 ? 'max-h-[60vh] overflow-y-auto' : 'overflow-visible'}`}>
          <div className={`grid ${gridCols} gap-4`}>
            {renderBeforeFields?.({ formData, onChange: handleChange })}
            {fields.map(field => {
              const colSpan = field.colSpan === 2 ? 'col-span-2' : 'col-span-1';
              return (
                <div key={field.name} className={`space-y-1.5 ${colSpan}`}>
                  <label className={`block ${compact ? 'text-sm font-semibold' : 'text-sm font-medium'} text-slate-700`}>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderField(field)}
                  {field.required && touched[field.name] && !formData[field.name] && (
                    <p className={`text-red-500 mt-1 ${compact ? 'text-xs' : 'text-xs'}`}>
                      Vui lòng nhập {field.label.toLowerCase()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {renderFooter ? (
          renderFooter(formData)
        ) : (
          <DialogFooter className={`${compact ? 'p-5 pb-7' : 'p-6 pb-8'} bg-slate-50 border-t border-slate-100 flex gap-4 justify-end rounded-b-[24px]`}>
            <Button
              variant="outline"
              onClick={onClose}
              className={`${compact ? 'h-9 px-6 rounded-xl text-sm font-bold' : 'h-11 px-6 rounded-[14px] font-bold'} border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300`}
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`${compact ? 'h-9 px-6 rounded-xl text-sm font-bold' : 'h-11 px-6 rounded-[14px] font-bold'} bg-primary hover:bg-primary-600 shadow-sm text-white`}
            >
              {submitLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}