import React, { useState } from 'react';
import { Calendar, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface DateFilterProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onClear: () => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ fromDate, toDate, onFromDateChange, onToDateChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasFilter = fromDate || toDate;
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
  };

  const displayText = hasFilter ? (
    (fromDate && toDate) ? `${new Date(fromDate).toLocaleDateString('vi-VN')} - ${new Date(toDate).toLocaleDateString('vi-VN')}`
    : fromDate ? `Từ ${new Date(fromDate).toLocaleDateString('vi-VN')}`
    : `Đến ${new Date(toDate).toLocaleDateString('vi-VN')}`
  ) : 'Lọc theo ngày';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className={`flex items-center gap-2 px-4 h-11 rounded-xl font-bold text-[13px] border shadow-sm transition-all cursor-pointer ${
          hasFilter 
            ? 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100' 
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}>
          <Calendar className={`w-4 h-4 shrink-0 ${hasFilter ? 'text-primary-600' : 'text-slate-400'}`} />
          
          <span className="whitespace-nowrap">{displayText}</span>

          {hasFilter ? (
            <div 
              onClick={handleClear}
              className="ml-1 -mr-1 p-1 hover:bg-primary-200/50 rounded-lg text-primary-500 hover:text-primary-700 transition-colors"
              title="Xoá bộ lọc"
            >
              <X className="w-3.5 h-3.5" />
            </div>
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-[300px] p-5 rounded-3xl border border-primary-200 ring-0 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] bg-white outline-none">
        <h3 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-500" /> Chọn khoảng thời gian
        </h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600">Từ ngày:</label>
            <Input 
              type="date" 
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="h-10 text-[13px] font-medium bg-slate-50 border-slate-200 hover:border-slate-300 focus:border-primary-400 focus:ring-primary-100 rounded-xl cursor-pointer transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600">Đến ngày:</label>
            <Input 
              type="date" 
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="h-10 text-[13px] font-medium bg-slate-50 border-slate-200 hover:border-slate-300 focus:border-primary-400 focus:ring-primary-100 rounded-xl cursor-pointer transition-colors"
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-slate-100">
            {hasFilter && (
              <Button 
                variant="outline" 
                onClick={() => { onClear(); setIsOpen(false); }}
                className="h-9 px-4 text-[13px] font-bold rounded-xl text-rose-500 border-rose-200 bg-white hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm"
              >
                Xoá lọc
              </Button>
            )}
            <Button 
              onClick={() => setIsOpen(false)}
              className="h-9 px-6 text-[13px] font-bold bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-sm"
            >
              Hoàn tất
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
