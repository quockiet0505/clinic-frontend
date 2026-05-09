import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export default function StatCard({ title, value, trend, isUp, icon: Icon, color, bg }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
        <p className={`text-xs mt-1 font-medium ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend} from last month
        </p>
      </div>
    </div>
  );
}