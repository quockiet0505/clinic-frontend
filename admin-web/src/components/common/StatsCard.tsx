// components/common/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bgColor?: string;
  iconColor?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  bgColor = 'bg-indigo-50',
  iconColor = 'text-indigo-600',
  className = '',
}) => {
  return (
    <div className={`bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3 ${className}`}>
      <div className={`w-8 h-8 ${bgColor} ${iconColor} rounded-lg flex items-center justify-center font-bold shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</p>
        <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{value}</p>
      </div>
    </div>
  );
};