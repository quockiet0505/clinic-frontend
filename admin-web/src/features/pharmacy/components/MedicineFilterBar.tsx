import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/common/SearchInput';

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onAdd: () => void;
}

export default function MedicineFilterBar({ search, setSearch, onAdd }: Props) {
  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm shrink-0">
      <div className="w-full sm:w-[320px]">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Tìm tên thuốc, hoạt chất..." 
        />
      </div>
      <Button 
        onClick={onAdd}
        className="w-full sm:w-auto h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all"
      >
        <Plus size={18} className="mr-2" /> Thêm thuốc mới
      </Button>
    </div>
  );
}