import React from 'react';
import { Search, Users, Stethoscope, ShieldCheck, TestTube, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StaffType } from '../types/staff';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const getRoleIcon = (role: string) => {
  switch (role) {
    case 'DOCTOR': return <Stethoscope size={14} className="mr-1.5" />;
    case 'ADMIN': return <ShieldCheck size={14} className="mr-1.5" />;
    case 'LAB_TECH': return <TestTube size={14} className="mr-1.5" />;
    case 'STAFF': return <Briefcase size={14} className="mr-1.5" />;
    default: return <Users size={16} className="mr-1.5" />;
  }
};

const TABS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Bác sĩ', value: 'DOCTOR' },
  { label: 'Nhân viên', value: 'STAFF' },
  { label: 'Kỹ thuật viên', value: 'LAB_TECH' },
  { label: 'Quản trị viên', value: 'ADMIN' },
];

export default function StaffFilterBar({ activeTab, setActiveTab, searchTerm, setSearchTerm }: Props) {
  return (
    <div className="flex flex-col xl:flex-row justify-between gap-4 items-center bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm">
      <div className="flex flex-wrap bg-slate-50 p-1 rounded-2xl w-full xl:w-auto overflow-x-auto border border-slate-100">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 xl:flex-none px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ease-out whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === tab.value ? 'bg-white text-primary-600 shadow-sm border border-slate-100/50' : 'text-slate-500 hover:text-primary-600 hover:bg-slate-100/50 border border-transparent'
            }`}
          >
            {tab.value === 'ALL' ? <Users size={16} /> : getRoleIcon(tab.value)}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative w-full xl:w-80 px-2 xl:px-0 pr-2">
        <Search className="absolute left-5 xl:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          placeholder="Tìm kiếm tên hoặc email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-[16px] border-input bg-slate-50 text-sm font-medium hover:border-primary-300 focus-visible:border-primary-400 focus-visible:ring-4 focus-visible:ring-primary-100 transition-all duration-200 ease-out shadow-sm"
        />
      </div>
    </div>
  );
}