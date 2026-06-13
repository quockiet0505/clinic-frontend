import React from 'react';
import SearchInput from '@/components/common/SearchInput';

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export default function PatientFilterBar({ searchTerm, setSearchTerm }: Props) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0 w-full sm:w-[400px]">
      <SearchInput 
        value={searchTerm} 
        onChange={setSearchTerm} 
        placeholder="Tìm kiếm patient by name, ID, or phone..." 
      />
    </div>
  );
}