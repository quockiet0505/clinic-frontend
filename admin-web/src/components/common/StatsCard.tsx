// components/common/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bgColor?: string; // act as gradient class, e.g. "from-sky-400 to-sky-600" or solid color for compact
  iconColor?: string; // Left for compatibility or solid icon color
  className?: string;
  compact?: boolean; // true for small layout, false/default for big dashboard layout
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  bgColor = 'from-indigo-400 to-indigo-600',
  iconColor = 'text-white',
  className = '',
  compact = false,
}) => {
  if (compact) {
    // Chuẩn hóa màu sắc từ gradient về dạng flat màu nhạt cho compact layout
    let finalBg = bgColor;
    let finalIconColor = iconColor;

    if (bgColor.startsWith('from-') || bgColor.includes('gradient')) {
      // Fallback cho compact if they pass gradient
      if (bgColor.includes('sky')) {
        finalBg = 'bg-blue-50';
        finalIconColor = 'text-blue-600';
      } else if (bgColor.includes('emerald') || bgColor.includes('green')) {
        finalBg = 'bg-emerald-50';
        finalIconColor = 'text-emerald-600';
      } else if (bgColor.includes('purple') || bgColor.includes('violet')) {
        finalBg = 'bg-purple-50';
        finalIconColor = 'text-purple-600';
      } else if (bgColor.includes('amber') || bgColor.includes('orange')) {
        finalBg = 'bg-amber-50';
        finalIconColor = 'text-amber-600';
      } else if (bgColor.includes('rose') || bgColor.includes('pink') || bgColor.includes('red')) {
        finalBg = 'bg-pink-50';
        finalIconColor = 'text-pink-600';
      } else {
        finalBg = 'bg-indigo-50';
        finalIconColor = 'text-indigo-600';
      }
    } else {
      // Xử lý các class màu flat
      if (bgColor === 'bg-blue-100') finalBg = 'bg-blue-50';
      if (bgColor === 'bg-indigo-100') finalBg = 'bg-indigo-50';
      if (bgColor === 'bg-emerald-100') finalBg = 'bg-emerald-50';
      if (bgColor === 'bg-purple-100') finalBg = 'bg-purple-50';
      if (bgColor === 'bg-orange-100') finalBg = 'bg-orange-50';
      if (bgColor === 'bg-slate-100' || bgColor === 'bg-slate-200') finalBg = 'bg-slate-50';
    }

    if (finalIconColor === 'text-white') {
      if (finalBg === 'bg-blue-50') finalIconColor = 'text-blue-600';
      else if (finalBg === 'bg-indigo-50') finalIconColor = 'text-indigo-600';
      else if (finalBg === 'bg-emerald-50') finalIconColor = 'text-emerald-600';
      else if (finalBg === 'bg-purple-50') finalIconColor = 'text-purple-600';
      else if (finalBg === 'bg-orange-50') finalIconColor = 'text-orange-600';
      else finalIconColor = 'text-slate-600';
    }

    return (
      <div className={`bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3 shrink-0 ${className}`}>
        <div className={`w-8 h-8 ${finalBg} ${finalIconColor} rounded-lg flex items-center justify-center font-bold shrink-0`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 16 }) : icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate max-w-[150px]" title={label}>
            {label}
          </p>
          <p className="text-sm font-black text-slate-900 leading-none mt-0.5">
            {value}
          </p>
        </div>
      </div>
    );
  }

  // Dashboard layout mặc định (to, rực rỡ, gradient)
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