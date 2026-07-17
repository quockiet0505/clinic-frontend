import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export default function ActionMenu({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hasChildren = React.Children.toArray(children).some(child => !!child);
  if (!hasChildren) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-[10px] border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-semibold text-xs shadow-sm cursor-pointer"
        title="Tùy chọn"
      >
        <span>Tùy chọn</span>
        {isOpen ? <ChevronUp size={14} className="opacity-70" /> : <ChevronDown size={14} className="opacity-70" />}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 z-50 min-w-[180px] flex flex-col gap-1.5 p-2 bg-white rounded-xl border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          {children}
        </div>
      )}
    </div>
  );
}
