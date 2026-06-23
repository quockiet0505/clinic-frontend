import React from 'react';
import { ChevronLeft } from 'lucide-react';

type Tone = 'default' | 'primary' | 'sky' | 'emerald' | 'violet' | 'amber' | 'rose';

const ICON_TONES: Record<Tone, string> = {
  default:
    'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900',
  primary:
    'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-sm shadow-blue-600/15',
  sky:
    'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300 hover:text-sky-800',
  emerald:
    'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800',
  violet:
    'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300 hover:text-violet-800',
  amber:
    'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800',
  rose:
    'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-800',
};

const BUTTON_TONES: Record<Tone, string> = {
  default:
    'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900',
  primary:
    'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-sm shadow-blue-600/15',
  sky:
    'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300 hover:text-sky-800',
  emerald:
    'bg-emerald-600 text-white border-transparent hover:bg-emerald-700 shadow-sm shadow-emerald-600/15',
  violet:
    'bg-violet-600 text-white border-transparent hover:bg-violet-700 shadow-sm shadow-violet-600/15',
  amber:
    'bg-amber-500 text-white border-transparent hover:bg-amber-600 shadow-sm shadow-amber-500/15',
  rose:
    'bg-white text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300',
};

interface DetailPageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  code?: string;
  onBack?: () => void;
  backLabel?: string;
  statusBadge?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function DetailPageHeader({
  title,
  subtitle,
  code,
  onBack,
  backLabel = 'Quay lại',
  statusBadge,
  actions,
}: DetailPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 shrink-0">
      {onBack && (
        <button
          onClick={onBack}
          className="self-start inline-flex items-center gap-1 text-[13px] font-semibold text-slate-500 hover:text-blue-600 transition-colors -ml-1 px-1.5 py-1 rounded-md hover:bg-blue-50 cursor-pointer"
        >
          <ChevronLeft size={16} />
          {backLabel}
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            {code && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-blue-50 text-blue-700 tabular-nums border border-blue-100">
                {code}
              </span>
            )}
            {statusBadge}
          </div>
          {subtitle && (
            <p className="text-[13px] text-slate-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}

interface IconActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  tone?: Tone;
  disabled?: boolean;
}

export function IconAction({
  icon,
  label,
  onClick,
  tone = 'default',
  disabled,
}: IconActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${ICON_TONES[tone]}`}
    >
      {icon}
    </button>
  );
}

interface ActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  tone?: Tone;
  disabled?: boolean;
}

export function ActionButton({
  icon,
  label,
  onClick,
  tone = 'default',
  disabled,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${BUTTON_TONES[tone]}`}
    >
      {icon}
      {label}
    </button>
  );
}
