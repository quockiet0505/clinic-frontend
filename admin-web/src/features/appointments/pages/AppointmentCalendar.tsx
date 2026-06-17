// features/appointments/pages/AppointmentCalendar.tsx
import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle, Users, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';
import WeeklyCalendarGrid from '../components/WeeklyCalendarGrid';
import { Appointment } from '../types/appointment';
import { appointmentApi } from '../api/appointmentApi';
import { staffApi } from '@/features/staffs/api/staffApi';

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatMonth = (date: Date): string => {
  return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
};

export default function AppointmentCalendar() {
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getStartOfWeek(new Date()));

  useEffect(() => {
    if (fromDate) {
      const date = new Date(fromDate);
      if (!isNaN(date.getTime())) {
        setCurrentWeekStart(getStartOfWeek(date));
      }
    } else {
      if (appointments.length > 0) {
        const firstAppDate = new Date(appointments[0].appointmentDate);
        if (!isNaN(firstAppDate.getTime())) {
          setCurrentWeekStart(getStartOfWeek(firstAppDate));
          return;
        }
      }
      setCurrentWeekStart(getStartOfWeek(new Date()));
    }
  }, [fromDate, appointments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const appData = await appointmentApi.getAll();
        setAppointments(appData || []);

        if (appData && appData.length > 0 && !fromDate) {
          const firstAppDate = new Date(appData[0].appointmentDate);
          if (!isNaN(firstAppDate.getTime())) {
            setCurrentWeekStart(getStartOfWeek(firstAppDate));
          }
        }

        try {
          const staffData = await staffApi.getAll();
          const docs = staffData
            .filter((s: any) => s.staffType === 'DOCTOR' || s.staffType === 'NURSE' || s.staffType === 'STAFF')
            .map((s: any) => ({
              id: s.staffId.toString(),
              name: s.fullName,
            }));
          setProviders(docs);
        } catch (e) {
          const doctorNames = Array.from(new Set(appData.map(a => a.doctorName).filter(Boolean)));
          const fallback = doctorNames.map((name, idx) => ({ id: `doc-${idx}`, name }));
          setProviders(fallback);
        }
      } catch (error) {
        console.error('❌ Lỗi tải dữ liệu:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc dữ liệu theo các filter (doctor, search, date range)
  const baseFiltered = appointments.filter((app) => {
    const matchDoctor = doctorFilter === 'ALL' || app.doctorName === doctorFilter;
    const matchSearch = app.patientName.toLowerCase().includes(search.toLowerCase());
    const matchFrom = !fromDate || app.appointmentDate >= fromDate;
    const matchTo = !toDate || app.appointmentDate <= toDate;
    return matchDoctor && matchSearch && matchFrom && matchTo;
  });

  // Stats chỉ hiển thị các trạng thái quan trọng
  const total = baseFiltered.length;
  const pending = baseFiltered.filter(a => a.status === 'PENDING').length;
  const inProgress = baseFiltered.filter(a => a.status === 'IN_PROGRESS').length;
  const completed = baseFiltered.filter(a => a.status === 'COMPLETED').length;
  // Không hiển thị CONFIRMED, CHECKED_IN, NO_SHOW, CANCELLED

  const filteredAppointments = baseFiltered.filter((app) => {
    return statusFilter === 'ALL' || app.status === statusFilter;
  });

  const statusOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'CHECKED_IN', label: 'Đã đến' },
    { value: 'IN_PROGRESS', label: 'Đang khám' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'NO_SHOW', label: 'Không đến' },
  ];

  const doctorOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả bác sĩ' },
    ...providers.map(p => ({ value: p.name, label: p.name })),
  ];

  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(getStartOfWeek(newDate));
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(getStartOfWeek(newDate));
  };

  const goToToday = () => {
    setCurrentWeekStart(getStartOfWeek(new Date()));
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Lịch theo tháng" description="Quản lý lịch làm việc hàng tuần và các khối lịch hẹn." />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<CalendarDays size={16} />} label="Tổng" value={total} />
          <StatsCard icon={<Clock size={16} />} label="Chờ" value={pending} bgColor="bg-amber-50" iconColor="text-amber-600" />
          <StatsCard icon={<AlertCircle size={16} />} label="Đang khám" value={inProgress} bgColor="bg-pink-50" iconColor="text-pink-600" />
          <StatsCard icon={<CheckCircle size={16} />} label="Hoàn thành" value={completed} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
        </div>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm kiếm bệnh nhân..."
        filters={[
          {
            key: 'doctor',
            label: 'Bác sĩ',
            options: doctorOptions,
            value: doctorFilter,
            onChange: setDoctorFilter,
            placeholder: 'Chọn bác sĩ',
          },
          {
            key: 'status',
            label: 'Trạng thái',
            options: statusOptions,
            value: statusFilter,
            onChange: setStatusFilter,
            placeholder: 'Trạng thái',
          },
        ]}
        advancedFilters={{
          dateRange: {
            from: fromDate,
            to: toDate,
            onFromChange: setFromDate,
            onToChange: setToDate,
          },
        }}
      >
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200 shrink-0 ml-auto">
          <button
            onClick={goToPreviousWeek}
            className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center min-w-[180px]">
            <span className="text-sm font-semibold text-slate-700">
              {formatDate(currentWeekStart)} – {formatDate(weekEnd)}
            </span>
            {/* <span className="text-xs text-slate-400 ml-1">
              ({formatMonth(currentWeekStart)})
            </span> */}
          </div>
          <button
            onClick={goToNextWeek}
            className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={goToToday}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 ml-1 whitespace-nowrap"
          >
            Hôm nay
          </button>
        </div>
      </FilterBar>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải dữ liệu...</div>
      ) : (
        <div className="flex-1 overflow-hidden min-h-0 rounded-[32px] shadow-sm">
          {filteredAppointments.length === 0 ? (
            <div className="flex items-center justify-center h-full bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 font-medium">
                {fromDate || toDate ? 'Không có lịch hẹn trong khoảng ngày đã chọn' : 'Không có lịch hẹn nào'}
              </p>
            </div>
          ) : (
            <WeeklyCalendarGrid
              currentWeekStart={currentWeekStart}
              appointments={filteredAppointments}
              onAppointmentClick={(app) => console.log('Clicked:', app)}
            />
          )}
        </div>
      )}
    </div>
  );
}