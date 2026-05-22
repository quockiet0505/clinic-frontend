// src/components/common/FormSearchModal.tsx
import React, { useState } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface SearchOption {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface FormSearchModalProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchOption[];
  triggerIcon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  modalTitle?: string;
}

export const FormSearchModal: React.FC<FormSearchModalProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  triggerIcon: TriggerIcon,
  required,
  disabled,
  modalTitle = 'Chọn thông tin',
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.description && opt.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearchQuery(''); // Reset search khi đóng
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-bold text-[#003B5C]">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            disabled={disabled}
            className={`relative flex w-full items-center justify-between h-[52px] rounded-2xl border border-slate-200 bg-white px-4 text-left shadow-none transition-all focus:ring-2 focus:ring-[#00b5f1]/20 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              TriggerIcon ? 'pl-12' : ''
            }`}
          >
            {TriggerIcon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00b5f1]">
                <TriggerIcon className="h-5 w-5" />
              </div>
            )}
            <span className={`truncate text-[14.5px] font-medium ${selectedOption ? 'text-[#003B5C]' : 'text-slate-500'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden bg-[#f5f7f9]">
          <DialogHeader className="bg-white p-4 border-b border-slate-100">
            <DialogTitle className="text-center text-[18px] font-black text-[#003B5C]">
              {modalTitle}
            </DialogTitle>
          </DialogHeader>

          {/* Search Bar */}
          <div className="bg-white p-4 pt-2">
            <div className="relative flex items-center w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Options List */}
          <ScrollArea className="h-[400px] p-4 pt-0">
            <div className="flex flex-col gap-3 pb-4">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-[14px]">Không tìm thấy kết quả phù hợp.</div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = value === opt.value;
                  const Icon = opt.icon;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-[#00b5f1] bg-[#eaf7fd] shadow-sm'
                          : 'border-slate-200 bg-white hover:border-[#00b5f1]/50'
                      }`}
                    >
                      {Icon && (
                        <div className={`mt-1 shrink-0 ${isSelected ? 'text-[#00b5f1]' : 'text-slate-400'}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-1">
                        <span className={`text-[15px] font-bold ${isSelected ? 'text-[#00b5f1]' : 'text-[#003B5C]'}`}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-[13px] leading-relaxed text-slate-500">
                            {opt.description}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-[#00b5f1] shrink-0 mt-1" />}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};