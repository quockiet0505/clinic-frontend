import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
}: Props) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSearch = () => {
    onChange(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={handleSearch}
        title="Tìm kiếm (Enter)"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
      >
        <Search size={18} className="text-slate-400 hover:text-blue-500" />
      </button>
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10 pr-10 h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-colors"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
          type="button"
          title="Xóa tìm kiếm"
        >
          <X size={16} className="text-slate-400 hover:text-slate-600" />
        </button>
      )}
    </div>
  );
}