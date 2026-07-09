// components/common/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bgColor?: string; // Will act as gradient class, e.g. "from-sky-400 to-sky-600"
  iconColor?: string; // Left for compatibility
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  bgColor = 'from-indigo-400 to-indigo-600',
  iconColor = 'text-white',
  className = '',
}) => {
  // Convert old bg-classes to modern gradients for fallback
  let gradientClass = bgColor;
  if (bgColor === 'bg-blue-50' || bgColor === 'bg-blue-100') {
    gradientClass = 'from-sky-400 to-sky-600';
  } else if (bgColor === 'bg-indigo-50' || bgColor === 'bg-indigo-100') {
    gradientClass = 'from-indigo-400 to-indigo-600';
  } else if (bgColor === 'bg-emerald-50' || bgColor === 'bg-emerald-100') {
    gradientClass = 'from-emerald-400 to-emerald-600';
  } else if (bgColor === 'bg-purple-50' || bgColor === 'bg-purple-100') {
    gradientClass = 'from-purple-400 to-purple-600';
  } else if (bgColor === 'bg-orange-50' || bgColor === 'bg-orange-100') {
    gradientClass = 'from-orange-400 to-orange-600';
  } else if (bgColor === 'bg-slate-50' || bgColor === 'bg-slate-100' || bgColor === 'bg-slate-200') {
    gradientClass = 'from-slate-400 to-slate-600';
  }

  return (
    <div className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-md shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate" title={label}>
          {label}
        </p>
        <p className="text-xl font-black text-slate-800 leading-none">
          {value}
        </p>
      </div>
    </div>
  );
};