import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface RecordFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const RecordFilterBar: React.FC<RecordFilterBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <Input 
        placeholder="Tìm theo bác sĩ, chẩn đoán..." 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-12 pl-12 rounded-2xl bg-white border-border-default focus-visible:border-primary-500 focus-visible:ring-primary-500/20 shadow-sm w-full"
      />
    </div>
  );
};