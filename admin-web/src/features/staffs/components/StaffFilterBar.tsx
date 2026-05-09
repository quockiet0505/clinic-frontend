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
  { label: 'All', value: 'ALL' },
  { label: 'Doctor', value: 'DOCTOR' },
  { label: 'Clinic Staff', value: 'STAFF' },
  { label: 'Lab Technician', value: 'LAB_TECH' },
  { label: 'Administrator', value: 'ADMIN' },
];

export default function StaffFilterBar({ activeTab, setActiveTab, searchTerm, setSearchTerm }: Props) {
  return (
    <div className="flex flex-col xl:flex-row justify-between gap-4 items-center bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl w-full xl:w-auto overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 xl:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              activeTab === tab.value ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
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
          placeholder="Search name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
        />
      </div>
    </div>
  );
}