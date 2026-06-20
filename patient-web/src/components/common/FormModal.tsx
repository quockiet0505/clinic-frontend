import React from 'react';
import { Loader2, Save } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export type FormFieldType = 'text' | 'number' | 'textarea' | 'select';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  /** colSpan: 2 = full width in 2-column grid */
  colSpan?: 1 | 2;
}

export interface FormModalAction {
  label: string;
  onClick?: () => void;
  type?: 'submit' | 'cancel' | 'custom';
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  fields: FormFieldConfig[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: () => void | Promise<void>;
  isSubmitting?: boolean;
  /** Number of columns in the field grid (default 2) */
  columns?: 1 | 2;
  submitLabel?: string;
  /** Modal width preset */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  /** Allow body to scroll when content is tall (default true) */
  scrollable?: boolean;
  /** Extra actions in the footer (replaces default Cancel + Submit) */
  footerActions?: FormModalAction[];
  /** Custom slot rendered below the field grid, inside the scrollable body */
  renderExtra?: React.ReactNode;
}

const inputBase =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-sm font-medium outline-none';

const maxWidthClass: Record<string, string> = {
  sm: 'sm:max-w-[440px]',
  md: 'sm:max-w-[560px]',
  lg: 'sm:max-w-[672px]',
  xl: 'sm:max-w-[800px]',
};

const variantClass: Record<string, string> = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm shadow-primary-200',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-600',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200',
};

export const FormModal: React.FC<FormModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  icon,
  fields,
  values,
  onChange,
  onSubmit,
  isSubmitting = false,
  columns = 2,
  submitLabel = 'Lưu thông tin',
  maxWidth = 'md',
  scrollable = true,
  footerActions,
  renderExtra,
}) => {
  const gridClass =
    columns === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-4';

  const renderField = (field: FormFieldConfig) => {
    const value = values[field.name] ?? '';
    const spanClass = field.colSpan === 2 ? 'sm:col-span-2' : '';

    const label = (
      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    );

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className={spanClass}>
          {label}
          <textarea
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`${inputBase} resize-none`}
          />
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.name} className={spanClass}>
          {label}
          <select
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={inputBase}
          >
            <option value="">{field.placeholder || 'Chọn...'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={field.name} className={spanClass}>
        {label}
        <Input
          type={field.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-primary-100 focus-visible:border-primary-500 text-sm font-medium shadow-none"
        />
      </div>
    );
  };

  const defaultActions: FormModalAction[] = [
    { label: 'Hủy', type: 'cancel', variant: 'secondary' },
    { label: submitLabel, type: 'submit', variant: 'primary', icon: <Save className="w-4 h-4" /> },
  ];

  const actions = footerActions ?? defaultActions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${maxWidthClass[maxWidth]} z-[100] rounded-3xl p-0 flex flex-col bg-white border-0 shadow-2xl max-h-[90vh]`}
      >
        {/* ── Sticky header ── */}
        <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0 rounded-t-3xl">
          <DialogTitle className="text-xl font-black text-brand-dark flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          {description && (
            <p className="text-[13px] text-slate-500 font-medium mt-1">{description}</p>
          )}
        </DialogHeader>

        {/* ── Scrollable body ── */}
        <div className={`px-6 py-6 flex-1 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          <div className={gridClass}>{fields.map(renderField)}</div>
          {renderExtra && <div className="mt-4">{renderExtra}</div>}
        </div>

        {/* ── Sticky footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 rounded-b-3xl flex gap-3">
          {actions.map((action, i) => {
            if (action.type === 'cancel') {
              return (
                <DialogClose key={i} asChild>
                  <button
                    type="button"
                    className={`flex-1 px-5 py-3 rounded-xl font-bold transition-colors ${variantClass[action.variant ?? 'secondary']}`}
                  >
                    {action.label}
                  </button>
                </DialogClose>
              );
            }
            if (action.type === 'submit') {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting || action.disabled}
                  className={`flex-1 px-5 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${variantClass[action.variant ?? 'primary']}`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {action.icon}
                      {action.label}
                    </>
                  )}
                </button>
              );
            }
            return (
              <button
                key={i}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className={`flex-1 px-5 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${variantClass[action.variant ?? 'secondary']}`}
              >
                {action.icon}
                {action.label}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
