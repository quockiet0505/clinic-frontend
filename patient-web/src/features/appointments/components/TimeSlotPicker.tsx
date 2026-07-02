import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { BookingFormState, AvailableDate, TimeSlot } from '../types/appointment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

interface TimeSlotPickerProps {
  formData: BookingFormState;
  updateForm: (data: Partial<BookingFormState>) => void;
  dates: AvailableDate[];
  timeSlots: TimeSlot[];
  onSlotSelect?: (slot: TimeSlot) => void;
}

// Giả sử bạn có danh sách ngày nghỉ lễ (có thể lấy từ API, ở đây tôi tạo mẫu)
const holidayDates = ['2026-05-01', '2026-05-02', '2026-04-30']; // ví dụ

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ formData, updateForm, dates, timeSlots, onSlotSelect }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const quickDates = dates.slice(0, 3);
  const isCustomDateSelected = formData.appointmentDate && !quickDates.find(d => d.dateString === formData.appointmentDate);

  const availableDates = dates.map(d => new Date(d.dateString));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate =>
      format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isHoliday = (date: Date) => {
    return holidayDates.includes(format(date, 'yyyy-MM-dd'));
  };

  const isToday = (date: Date) => format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  const isSelected = (date: Date) => formData.appointmentDate === format(date, 'yyyy-MM-dd');
  const isPastDate = (date: Date) => date < today;

  // Tạo lưới ngày
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = 1; // 1 = Thứ 2
  const startOffset = (getDay(monthStart) - firstDayOfWeek + 7) % 7;

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

  return (
    <div className="flex flex-col gap-6">
      {/* Ngày khám */}
      <div className="flex flex-col gap-3">
        <label className="text-[14px] font-bold text-[#003B5C]">Ngày khám <span className="text-red-500">*</span></label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickDates.map((item) => (
            <button
              key={item.dateString}
              onClick={() => updateForm({ appointmentDate: item.dateString, timeStart: '', timeEnd: '' })}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 h-[72px] transition-all cursor-pointer ${
                formData.appointmentDate === item.dateString
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
              }`}
            >
              <span className={`text-[15px] font-black ${
                formData.appointmentDate === item.dateString ? 'text-primary-500' : 'text-[#003B5C]'
              }`}>
                {item.displayDate}
              </span>
              <span className={`text-[13px] font-medium mt-0.5 ${
                formData.appointmentDate === item.dateString ? 'text-primary-400' : 'text-slate-500'
              }`}>
                {item.dayOfWeek}
              </span>
            </button>
          ))}

          <button
            onClick={() => setIsCalendarOpen(true)}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 h-[72px] transition-all cursor-pointer ${
              isCustomDateSelected
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
            }`}
          >
            <CalendarIcon className={`w-5 h-5 mb-1 ${
              isCustomDateSelected ? 'text-primary-500' : 'text-primary-400'
            }`} />
            <span className={`text-[13px] font-bold ${
              isCustomDateSelected ? 'text-primary-500' : 'text-[#003B5C]'
            }`}>
              {isCustomDateSelected && formData.appointmentDate
                ? format(new Date(formData.appointmentDate), 'dd/MM/yyyy')
                : 'Ngày khác'}
            </span>
          </button>
        </div>
      </div>

      {/* Modal lịch chính */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="max-w-[700px] w-[90vw] rounded-2xl p-0 gap-0 overflow-hidden bg-white shadow-2xl">
          <DialogHeader className="border-b border-slate-100 p-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-[18px] font-black text-[#003B5C]">Chọn ngày khám</DialogTitle>
            <DialogClose className="rounded-full p-1 hover:bg-slate-100 transition">
              <X className="h-5 w-5 text-slate-500" />
            </DialogClose>
          </DialogHeader>

          <div className="p-4 pt-2">
            {/* Lịch tháng */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between bg-[#00b5f1] text-white px-4 py-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="hover:bg-white/20 rounded-full p-1">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-[15px] font-bold">
                  Tháng {currentMonth.getMonth() + 1} - {currentMonth.getFullYear()}
                </span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="hover:bg-white/20 rounded-full p-1">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <div key={day} className="py-2 text-center text-[13px] font-semibold text-slate-500">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {allDays.map((date, idx) => {
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const available = isDateAvailable(date);
                  const selected = isSelected(date);
                  const todayFlag = isToday(date);
                  const holiday = isHoliday(date);
                  const disabled = isPastDate(date);

                  let bgColor = 'bg-white';
                  let textColor = 'text-[#003B5C]';
                  let borderClass = '';

                  if (selected) {
                    bgColor = 'bg-[#00b5f1]';
                    textColor = 'text-white';
                  } else if (holiday && !selected) {
                    bgColor = 'bg-[#fed7aa]'; // màu cam nhạt nghỉ lễ
                    textColor = 'text-[#003B5C]';
                  } else if (todayFlag) {
                    borderClass = 'border-2 border-[#00b5f1]';
                    bgColor = 'bg-white';
                  } else if (available && !disabled && isCurrentMonth) {
                    bgColor = 'bg-[#eaf7fd]';
                  } else if (!available && !disabled && isCurrentMonth) {
                    bgColor = 'bg-slate-50';
                    textColor = 'text-slate-400';
                  }

                  if (!isCurrentMonth) {
                    textColor = 'text-slate-300';
                    bgColor = 'bg-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(date)}
                      disabled={disabled}
                      className={`h-12 flex items-center justify-center text-[14px] font-medium transition-all ${bgColor} ${textColor} ${borderClass} ${!disabled && !selected ? 'hover:bg-[#eaf7fd] hover:text-[#00b5f1]' : ''
                        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      {format(date, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend – 5 mục */}
            <div className="bg-slate-50 p-3 mt-4 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-y-2 gap-x-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-[#00b5f1] bg-white"></div><span>Ngày hiện tại</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#eaf7fd]"></div><span>Ngày có lịch</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div><span>Ngày không có lịch</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00b5f1]"></div><span>Ngày đã chọn</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#fed7aa]"></div><span>Nghỉ lễ</span></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Giờ khám */}
      <div className="flex flex-col gap-3">
        <label className="text-[14px] font-bold text-brand-dark flex items-center gap-1">Giờ khám <span className="text-red-500">*</span></label>
        {!formData.appointmentDate ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center gap-2">
            <CalendarIcon className="w-7 h-7 text-slate-300" />
            <span className="text-[13px] font-medium text-slate-400">Chọn ngày khám để xem giờ trống</span>
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center gap-2">
            <span className="text-[14px] font-bold text-slate-500">Không có giờ khám trống</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {timeSlots.filter(t => t.period === 'morning').length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-[12px] font-bold text-primary-500 uppercase tracking-widest pl-1">Buổi sáng</span>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                  {timeSlots.filter(t => t.period === 'morning').map(slot => (
                    <button
                      key={slot.timeStart}
                      disabled={!slot.isAvailable}
                      onClick={() => {
                        if (onSlotSelect) onSlotSelect(slot);
                        else updateForm({ timeStart: slot.timeStart, timeEnd: slot.timeEnd });
                      }}
                      className={`rounded-2xl border py-3 px-1 text-[14px] font-bold transition-all duration-200 cursor-pointer ${
                        !slot.isAvailable
                          ? 'border-slate-100 bg-slate-50/50 text-slate-300 line-through cursor-not-allowed'
                          : formData.timeStart === slot.timeStart
                            ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-500/20'
                            : 'border-slate-200 bg-white text-brand-dark hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      {slot.displayTime}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {timeSlots.filter(t => t.period === 'afternoon').length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-[12px] font-bold text-primary-500 uppercase tracking-widest pl-1">Buổi chiều</span>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                  {timeSlots.filter(t => t.period === 'afternoon').map(slot => (
                    <button
                      key={slot.timeStart}
                      disabled={!slot.isAvailable}
                      onClick={() => {
                        if (onSlotSelect) onSlotSelect(slot);
                        else updateForm({ timeStart: slot.timeStart, timeEnd: slot.timeEnd });
                      }}
                      className={`rounded-2xl border py-3 px-1 text-[14px] font-bold transition-all duration-200 cursor-pointer ${
                        !slot.isAvailable
                          ? 'border-slate-100 bg-slate-50/50 text-slate-300 line-through cursor-not-allowed'
                          : formData.timeStart === slot.timeStart
                            ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-500/20'
                            : 'border-slate-200 bg-white text-brand-dark hover:border-primary-300 hover:bg-primary-50'
                      }`}
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