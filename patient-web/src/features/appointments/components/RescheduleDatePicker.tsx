import React, { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import type { AvailableDate } from '../types/appointment';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export function buildRescheduleDates(maxDaysAhead = 7): AvailableDate[] {
  const dates: AvailableDate[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDaysAhead);

  for (let cursor = new Date(today); cursor <= maxDate; cursor.setDate(cursor.getDate() + 1)) {
    if (cursor.getTime() <= today.getTime()) continue;
    if (cursor.getDay() === 0 || cursor.getDay() === 6) continue;

    const yyyy = cursor.getFullYear();
    const mm = String(cursor.getMonth() + 1).padStart(2, '0');
    const dd = String(cursor.getDate()).padStart(2, '0');

    dates.push({
      dateString: `${yyyy}-${mm}-${dd}`,
      displayDate: `${dd}/${mm}`,
      dayOfWeek: WEEKDAY_NAMES[cursor.getDay()],
    });
  }
  return dates;
}

function isWithinRescheduleWindow(date: Date, maxDaysAhead: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDaysAhead);
  return date > today && date <= maxDate && date.getDay() !== 0 && date.getDay() !== 6;
}

interface RescheduleDatePickerProps {
  value: string;
  onChange: (dateString: string) => void;
  maxDaysAhead?: number;
  label?: string;
}

export const RescheduleDatePicker: React.FC<RescheduleDatePickerProps> = ({
  value,
  onChange,
  maxDaysAhead = 7,
  label = 'Ngày khám mới',
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const availableDates = useMemo(() => buildRescheduleDates(maxDaysAhead), [maxDaysAhead]);
  const quickDates = availableDates.slice(0, 3);
  const isCustomSelected = value && !quickDates.some((d) => d.dateString === value);

  const selectableSet = useMemo(
    () => new Set(availableDates.map((d) => d.dateString)),
    [availableDates]
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = (getDay(monthStart) - 1 + 7) % 7;

  const prevMonthDays: Date[] = [];
  for (let i = startOffset; i > 0; i--) {
    const d = new Date(monthStart);
    d.setDate(monthStart.getDate() - i);
    prevMonthDays.push(d);
  }

  const nextMonthDays: Date[] = [];
  const remaining = 42 - (prevMonthDays.length + daysInMonth.length);
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(monthEnd);
    d.setDate(monthEnd.getDate() + i);
    nextMonthDays.push(d);
  }

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  const handleSelect = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    if (!selectableSet.has(key)) return;
    onChange(key);
    setCalendarOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-[14px] font-bold text-[#003B5C]">
          {label} <span className="text-red-500">*</span>
        </label>
        <p className="text-[12px] text-slate-500 mt-1">Chỉ chọn trong vòng {maxDaysAhead} ngày tới (trừ cuối tuần)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickDates.map((item) => (
          <button
            key={item.dateString}
            type="button"
            onClick={() => onChange(item.dateString)}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 h-[72px] transition-all cursor-pointer ${
              value === item.dateString
                ? 'border-[#00b5f1] bg-[#eaf7fd]'
                : 'border-slate-200 bg-white hover:border-[#00b5f1] hover:bg-[#eaf7fd]'
            }`}
          >
            <span className={`text-[15px] font-black ${value === item.dateString ? 'text-[#00b5f1]' : 'text-[#003B5C]'}`}>
              {item.displayDate}
            </span>
            <span className={`text-[13px] font-medium mt-0.5 ${value === item.dateString ? 'text-[#00b5f1]' : 'text-slate-500'}`}>
              {item.dayOfWeek}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 h-[72px] transition-all cursor-pointer ${
            isCustomSelected
              ? 'border-[#00b5f1] bg-[#eaf7fd]'
              : 'border-slate-200 bg-white hover:border-[#00b5f1] hover:bg-[#eaf7fd]'
          }`}
        >
          <CalendarIcon className="w-5 h-5 mb-1 text-[#00b5f1]" />
          <span className={`text-[13px] font-bold ${isCustomSelected ? 'text-[#00b5f1]' : 'text-[#003B5C]'}`}>
            {isCustomSelected && value ? format(new Date(value), 'dd/MM/yyyy') : 'Ngày khác'}
          </span>
        </button>
      </div>

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[700px] w-[90vw] rounded-2xl p-0 gap-0 overflow-hidden bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <DialogTitle className="text-[18px] font-black text-[#003B5C]">Chọn ngày dời lịch</DialogTitle>
            <DialogClose className="rounded-full p-1.5 hover:bg-slate-100 transition">
              <X className="h-5 w-5 text-slate-500" />
            </DialogClose>
          </div>

          <div className="p-5">
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between bg-[#00b5f1] text-white px-4 py-2">
                <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="hover:bg-white/20 rounded-full p-1">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-[15px] font-bold">
                  Tháng {currentMonth.getMonth() + 1} - {currentMonth.getFullYear()}
                </span>
                <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="hover:bg-white/20 rounded-full p-1">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="py-2 text-center text-[13px] font-semibold text-slate-500">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {allDays.map((date, idx) => {
                  const key = format(date, 'yyyy-MM-dd');
                  const inWindow = isWithinRescheduleWindow(date, maxDaysAhead);
                  const selectable = selectableSet.has(key);
                  const selected = value === key;
                  const inMonth = isSameMonth(date, currentMonth);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(date)}
                      disabled={!selectable}
                      className={`h-12 flex items-center justify-center text-[14px] font-medium transition-all ${
                        selected
                          ? 'bg-[#00b5f1] text-white'
                          : selectable
                            ? 'bg-[#eaf7fd] text-[#003B5C] hover:bg-[#00b5f1]/20'
                            : inMonth
                              ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                              : 'text-slate-300 bg-white cursor-not-allowed'
                      }`}
                    >
                      {format(date, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
