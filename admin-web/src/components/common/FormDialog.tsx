// components/common/FormDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomSelect from './CustomSelect'; // Import CustomSelect mới (shadcn style)

export type FieldType = 'text' | 'number' | 'date' | 'time' | 'textarea' | 'select';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // cho select
  rows?: number;
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
}: FormDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form khi mở dialog hoặc initialData thay đổi
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
  }, [open, initialData, fields]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
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

    switch (field.type) {
      case 'select':
        return (
          <CustomSelect
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full"
          >
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </CustomSelect>
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={field.rows || 3}
            className={`flex w-full rounded-[16px] border border-input bg-white p-3 font-medium outline-none resize-none hover:border-primary-300 focus-visible:border-primary-400 focus-visible:ring-4 focus-visible:ring-primary-100 transition-all duration-200 ${isInvalid ? 'border-red-500' : ''}`}
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
            className={`h-11 rounded-[16px] font-medium cursor-pointer ${isInvalid ? 'border-red-500' : ''}`}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value === '' ? '' : Number(e.target.value))}
            className={`h-11 rounded-[16px] font-medium ${isInvalid ? 'border-red-500' : ''}`}
            placeholder={field.placeholder}
          />
        );
      default: // text
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`h-11 rounded-[16px] font-medium ${isInvalid ? 'border-red-500' : ''}`}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[24px] shadow-2xl">
        <div className="bg-primary-50 p-6 border-b border-primary-100 rounded-t-[24px]">
          {icon && <div className="flex items-center gap-2 mb-2 text-primary-600">{icon}</div>}
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-primary-600/80 font-medium mt-1">
            {description}
          </DialogDescription>
        </div>

        <div className="p-6 bg-white max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {renderField(field)}
                {field.required && touched[field.name] && !formData[field.name] && (
                  <p className="text-xs text-red-500 mt-1">Vui lòng nhập {field.label.toLowerCase()}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 pb-8 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end rounded-b-[24px]">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-11 px-6 rounded-[14px] font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="h-11 px-6 rounded-[14px] bg-primary hover:bg-primary-600 shadow-sm text-white font-bold"
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}