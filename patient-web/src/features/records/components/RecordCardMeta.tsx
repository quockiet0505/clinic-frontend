import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface RecordCardMetaProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export const RecordCardMeta: React.FC<RecordCardMetaProps> = ({
  icon: Icon,
  label,
  value,
  className = '',
}) => (
  <div className={`flex items-start gap-2.5 min-w-0 ${className}`}>
    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
    <div className="min-w-0 flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-[13px] font-bold text-slate-700 truncate" title={value}>
        {value}
      </span>
    </div>
  </div>
);

interface RecordStatusBadgeProps {
  label: string;
  className: string;
  icon?: React.ReactNode;
}

export const RecordStatusBadge: React.FC<RecordStatusBadgeProps> = ({ label, className, icon }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-bold shrink-0 ${className}`}
  >
    {icon}
    {label}
  </span>
);
