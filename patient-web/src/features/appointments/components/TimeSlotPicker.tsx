import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import type { BookingFormState, AvailableDate, TimeSlot } from '../types/appointment';

interface TimeSlotPickerProps {
  formData: BookingFormState;
  updateForm: (data: Partial<BookingFormState>) => void;
  dates: AvailableDate[];
  timeSlots: TimeSlot[];
}

const holidayDates = ['2026-05-01', '2026-05-02', '2026-04-30'];

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ formData, updateForm, dates, timeSlots }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const quickDates = dates.slice(0, 3);
  const isCustomDateSelected = formData.appointmentDate && !quickDates.find(d => d.dateString === formData.appointmentDate);
  const availableDates = dates.map(d => new Date(d.dateString));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateAvailable = (date: Date) => availableDates.some(ad => format(ad, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  const isHoliday = (date: Date) => holidayDates.includes(format(date, 'yyyy-MM-dd'));
  const isToday = (date: Date) => format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  const isSelected = (date: Date) => formData.appointmentDate === format(date, 'yyyy-MM-dd');
  const isPastDate = (date: Date) => date < today;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = (getDay(monthStart) - 1 + 7) % 7;
  const prevMonthDays = [];
  for (let i = startOffset; i > 0; i--) {
    const prevDate = new Date(monthStart);
    prevDate.setDate(monthStart.getDate() - i);
    prevMonthDays.push(prevDate);
  }
  const nextMonthDays = [];
  const totalCells = 42;
  const remaining = totalCells - (prevMonthDays.length + daysInMonth.length);
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(monthEnd);
    nextDate.setDate(monthEnd.getDate() + i);
    nextMonthDays.push(nextDate);
  }
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;
    updateForm({ appointmentDate: format(date, 'yyyy-MM-dd'), timeStart: '', timeEnd: '' });
    setIsCalendarOpen(false);
  };

  const morningSlots = timeSlots.filter(slot => slot.period === 'morning');
  const afternoonSlots = timeSlots.filter(slot => slot.period === 'afternoon');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-brand-dark">Date <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickDates.map(item => (
            <button
              key={item.dateString}
              onClick={() => updateForm({ appointmentDate: item.dateString, timeStart: '', timeEnd: '' })}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 h-[72px] transition-all cursor-pointer ${
                formData.appointmentDate === item.dateString ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white hover:border-primary-500 hover:bg-primary-50'
              }`}
            >
              <span className={`text-[15px] font-black ${formData.appointmentDate === item.dateString ? 'text-primary-500' : 'text-brand-dark'}`}>({item.displayDate})</span>
              <span className="text-[13px] font-medium mt-0.5 text-slate-500">{item.dayOfWeek}</span>
            </button>
          ))}
          <button
            onClick={() => setIsCalendarOpen(true)}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 h-[72px] transition-all cursor-pointer ${
              isCustomDateSelected ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white hover:border-primary-500 hover:bg-primary-50'
            }`}
          >
            <CalendarIcon className="w-5 h-5 mb-1 text-primary-500" />
            <span className="text-[13px] font-bold text-brand-dark">
              {isCustomDateSelected && formData.appointmentDate ? format(new Date(formData.appointmentDate), 'dd/MM/yyyy') : 'Other date'}
            </span>
          </button>
        </div>
      </div>

      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent showCloseButton={false} className="!ring-0 border-0 max-w-[700px] w-[90vw] rounded-2xl p-0 gap-0 overflow-hidden bg-white shadow-2xl">
          <DialogHeader className="border-b p-4 flex flex-row justify-between">
            <DialogTitle className="text-lg font-black text-brand-dark">Select date</DialogTitle>
            <DialogClose className="rounded-full p-1 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></DialogClose>
          </DialogHeader>
          <div className="p-4">
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex justify-between bg-primary-500 text-white px-4 py-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-5 w-5" /></button>
                <span className="font-bold">Tháng {currentMonth.getMonth() + 1} - {currentMonth.getFullYear()}</span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-7 border-b bg-slate-50">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => <div key={day} className="py-2 text-center text-sm font-semibold text-slate-500">{day}</div>)}
              </div>
              <div className="grid grid-cols-7">
                {allDays.map((date, idx) => {
                  const isCurrent = isSameMonth(date, currentMonth);
                  const available = isDateAvailable(date);
                  const selected = isSelected(date);
                  const todayFlag = isToday(date);
                  const holiday = isHoliday(date);
                  const disabled = isPastDate(date);
                  let bg = 'bg-white', text = 'text-brand-dark', border = '';
                  if (selected) { bg = 'bg-primary-500'; text = 'text-white'; }
                  else if (holiday && !selected) { bg = 'bg-[#fed7aa]'; }
                  else if (todayFlag) { border = 'border-2 border-primary-500'; }
                  else if (available && !disabled && isCurrent) { bg = 'bg-primary-50'; }
                  else if (!available && !disabled && isCurrent) { bg = 'bg-slate-50'; text = 'text-slate-400'; }
                  if (!isCurrent) { text = 'text-slate-300'; bg = 'bg-white'; }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(date)}
                      disabled={disabled}
                      className={`h-12 flex items-center justify-center text-sm font-medium transition-all ${bg} ${text} ${border} ${!disabled && !selected ? 'hover:bg-primary-50 hover:text-primary-500' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      {format(date, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-slate-50 p-3 mt-4 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-slate-600">
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full border border-primary-500 bg-white"></div>Today</div>
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-primary-50"></div>Available</div>
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-slate-100 border"></div>Not available</div>
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-primary-500"></div>Selected</div>
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#fed7aa]"></div>Holiday</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-brand-dark">Time <span className="text-red-500">*</span></label>
        {!formData.appointmentDate ? (
          <div className="rounded-2xl border-2 border-dashed p-5 text-center text-slate-500">Please select a date first</div>
        ) : (
          <div className="flex flex-col gap-5">
            {morningSlots.length > 0 && (
              <div>
                <span className="text-sm font-bold text-primary-500 uppercase tracking-wide">Morning</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                  {morningSlots.map(slot => (
                    <button
                      key={slot.timeStart}
                      disabled={!slot.isAvailable}
                      onClick={() => updateForm({ timeStart: slot.timeStart, timeEnd: slot.timeEnd })}
                      className={`rounded-xl border-2 py-3 px-2 text-sm font-semibold transition-all ${!slot.isAvailable ? 'border-slate-100 bg-slate-50 text-slate-300 line-through cursor-not-allowed' : formData.timeStart === slot.timeStart ? 'border-primary-500 bg-primary-500 text-white shadow-md' : 'border-slate-200 bg-white text-brand-dark hover:border-primary-500 hover:bg-primary-50'}`}
                    >
                      {slot.displayTime}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {afternoonSlots.length > 0 && (
              <div>
                <span className="text-sm font-bold text-primary-500 uppercase tracking-wide">Afternoon</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                  {afternoonSlots.map(slot => (
                    <button
                      key={slot.timeStart}
                      disabled={!slot.isAvailable}
                      onClick={() => updateForm({ timeStart: slot.timeStart, timeEnd: slot.timeEnd })}
                      className={`rounded-xl border-2 py-3 px-2 text-sm font-semibold transition-all ${!slot.isAvailable ? 'border-slate-100 bg-slate-50 text-slate-300 line-through' : formData.timeStart === slot.timeStart ? 'border-primary-500 bg-primary-500 text-white shadow-md' : 'border-slate-200 bg-white text-brand-dark hover:border-primary-500 hover:bg-primary-50'}`}
                    >
                      {slot.displayTime}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};