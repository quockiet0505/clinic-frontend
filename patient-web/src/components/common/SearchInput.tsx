/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: externalValue = '',
  onSearch,
  placeholder = 'Tìm kiếm...',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(externalValue);

  useEffect(() => {
    setInputValue(externalValue);
  }, [externalValue]);

  const handleSubmit = () => {
    onSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className={`relative flex items-center w-full bg-white rounded-full p-1 shadow-lg border border-slate-100 ${className}`}>
      <button
        type="button"
        onClick={handleSubmit}
        className="pl-4 pr-2 cursor-pointer hover:opacity-80 transition"
        aria-label="Search"
      >
        <Search className="h-5 w-5 text-slate-400 hover:text-primary-500" />
      </button>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base rounded-full h-12 bg-transparent"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="pr-4 pl-2 cursor-pointer hover:opacity-80 transition"
          aria-label="Clear"
        >
          <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
        </button>
      )}
    </div>
  );
};