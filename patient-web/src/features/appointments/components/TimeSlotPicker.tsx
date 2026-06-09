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
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-brand-dark">Chọn Ngày <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickDates.map(item => (
            <button
              key={item.dateString}
              onClick={() => updateForm({ appointmentDate: item.dateString, timeStart: '', timeEnd: '' })}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 h-[72px] transition-all cursor-pointer ${
                formData.appointmentDate === item.dateString ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-200 bg-white hover:border-primary-500 hover:bg-primary-50'
              }`}
            >
              <span className={`text-[15px] font-black ${formData.appointmentDate === item.dateString ? 'text-primary-500' : 'text-brand-dark'}`}>({item.displayDate})</span>
              <span className={`text-[13px] font-medium mt-0.5 ${formData.appointmentDate === item.dateString ? 'text-primary-600' : 'text-slate-500'}`}>
                {item.dayOfWeek.replace('Mon', 'T2').replace('Tue', 'T3').replace('Wed', 'T4').replace('Thu', 'T5').replace('Fri', 'T6').replace('Sat', 'T7').replace('Sun', 'CN')}
              </span>
            </button>
          ))}
          <button
            onClick={() => setIsCalendarOpen(true)}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 h-[72px] transition-all cursor-pointer ${
              isCustomDateSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-200 bg-white hover:border-primary-500 hover:bg-primary-50'
            }`}
          >
            <CalendarIcon className={`w-5 h-5 mb-1 ${isCustomDateSelected ? 'text-primary-500' : 'text-slate-400'}`} />
            <span className={`text-[13px] font-bold ${isCustomDateSelected ? 'text-primary-600' : 'text-slate-500'}`}>
              {isCustomDateSelected && formData.appointmentDate ? format(new Date(formData.appointmentDate), 'dd/MM/yyyy') : 'Ngày khác'}
            </span>
          </button>
        </div>
      </div>

      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent showCloseButton={false} className="!ring-0 border-0 max-w-[700px] w-[90vw] rounded-2xl p-0 gap-0 overflow-hidden bg-white shadow-2xl">
          <DialogHeader className="border-b p-4 flex flex-row items-center justify-between bg-slate-50">
            <DialogTitle className="text-lg font-black text-brand-dark">Chọn ngày khám</DialogTitle>
            <DialogClose className="rounded-full p-1.5 bg-white hover:bg-slate-200 shadow-sm transition-colors cursor-pointer"><X className="h-4 w-4 text-slate-500" /></DialogClose>
          </DialogHeader>
          <div className="p-4 bg-white">
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex justify-between items-center bg-primary-500 text-white px-4 py-3">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="hover:bg-primary-600 p-1 rounded-lg transition-colors cursor-pointer"><ChevronLeft className="h-5 w-5" /></button>
                <span className="font-bold text-[15px]">Tháng {currentMonth.getMonth() + 1} - {currentMonth.getFullYear()}</span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="hover:bg-primary-600 p-1 rounded-lg transition-colors cursor-pointer"><ChevronRight className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => <div key={day} className="py-2.5 text-center text-[13px] font-bold text-slate-500">{day}</div>)}
              </div>
              <div className="grid grid-cols-7 bg-white">
                {allDays.map((date, idx) => {
                  const isCurrent = isSameMonth(date, currentMonth);
                  const available = isDateAvailable(date);
                  const selected = isSelected(date);
                  const todayFlag = isToday(date);
                  const holiday = isHoliday(date);
                  const disabled = isPastDate(date);
                  let bg = 'bg-white', text = 'text-brand-dark', border = '';
                  
                  if (selected) { bg = 'bg-primary-500'; text = 'text-white font-bold'; }
                  else if (holiday && !selected) { bg = 'bg-orange-100'; text = 'text-orange-800'; }
                  else if (todayFlag) { border = 'border-2 border-primary-500 z-10'; text = 'text-primary-600 font-bold'; }
                  else if (available && !disabled && isCurrent) { bg = 'bg-primary-50/50 hover:bg-primary-100'; }
                  else if (!available && !disabled && isCurrent) { bg = 'bg-slate-50/50'; text = 'text-slate-400'; }
                  
                  if (!isCurrent) { text = 'text-slate-300'; bg = 'bg-slate-50/30'; }
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(date)}
                      disabled={disabled}
                      className={`relative h-12 flex items-center justify-center text-sm transition-all border-r border-b border-slate-50 last:border-r-0 ${bg} ${text} ${border} ${disabled ? 'cursor-not-allowed opacity-40 bg-slate-50' : 'cursor-pointer'}`}
                    >
                      {format(date, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-slate-50 p-3 mt-4 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-2 text-[12.5px] font-medium text-slate-600 border border-slate-100">
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border-2 border-primary-500 bg-white shadow-sm"></div>Hôm nay</div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-primary-100 border border-primary-200 shadow-sm"></div>Còn trống</div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-slate-100 border border-slate-200 shadow-sm"></div>Không có lịch</div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-primary-500 shadow-sm shadow-primary-500/40"></div>Đã chọn</div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-orange-100 border border-orange-200 shadow-sm"></div>Ngày lễ</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-brand-dark">Chọn Giờ <span className="text-red-500">*</span></label>
        {!formData.appointmentDate ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-[14px] font-medium text-slate-500 bg-slate-50/50">
            Vui lòng chọn ngày khám ở trên để xem các khung giờ còn trống
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {morningSlots.length > 0 && (
              <div>
                <span className="flex items-center gap-2 text-[13px] font-black text-primary-500 uppercase tracking-wider bg-primary-50 w-fit px-3 py-1 rounded-lg mb-3">
                  Buổi sáng
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {morningSlots.map(slot => (
                    <button
                      key={slot.timeStart}
                      disabled={!slot.isAvailable}
                      onClick={() => updateForm({ timeStart: slot.timeStart, timeEnd: slot.timeEnd })}
                      className={`rounded-xl border-2 py-3 px-2 text-[14px] font-bold transition-all ${!slot.isAvailable ? 'border-slate-100 bg-slate-50 text-slate-300 line-through cursor-not-allowed' : formData.timeStart === slot.timeStart ? 'border-primary-500 bg-primary-500 text-white shadow-[0_4px_12px_rgba(0,181,241,0.25)]' : 'border-slate-200 bg-white text-brand-dark hover:border-primary-500 hover:bg-primary-50 cursor-pointer'}`}
                    >
                      {slot.displayTime}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {afternoonSlots.length > 0 && (
              <div>
                <span className="flex items-center gap-2 text-[13px] font-black text-primary-500 uppercase tracking-wider bg-primary-50 w-fit px-3 py-1 rounded-lg mb-3">
                  Buổi chiều
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {afternoonSlots.map(slot => (
                    <button
                      key={slot.timeStart}
                      disabled={!slot.isAvailable}
                      onClick={() => updateForm({ timeStart: slot.timeStart, timeEnd: slot.timeEnd })}
                      className={`rounded-xl border-2 py-3 px-2 text-[14px] font-bold transition-all ${!slot.isAvailable ? 'border-slate-100 bg-slate-50 text-slate-300 line-through cursor-not-allowed' : formData.timeStart === slot.timeStart ? 'border-primary-500 bg-primary-500 text-white shadow-[0_4px_12px_rgba(0,181,241,0.25)]' : 'border-slate-200 bg-white text-brand-dark hover:border-primary-500 hover:bg-primary-50 cursor-pointer'}`}
                    >
                      {slot.displayTime}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {morningSlots.length === 0 && afternoonSlots.length === 0 && (
              <div className="rounded-2xl border border-slate-200 p-6 text-center text-[14px] font-medium text-slate-500 bg-slate-50">
                Không có khung giờ trống nào trong ngày này. Vui lòng chọn ngày khác.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};