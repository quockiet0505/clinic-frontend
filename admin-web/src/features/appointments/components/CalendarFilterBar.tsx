// features/appointments/pages/AppointmentCalendar.tsx
import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';
import WeeklyCalendarGrid from '../components/WeeklyCalendarGrid';
import { Appointment } from '../types/appointment';
import { appointmentApi } from '../api/appointmentApi';
import { staffApi } from '@/features/staffs/api/staffApi';

export default function AppointmentCalendar() {
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const appData = await appointmentApi.getAll();
        console.log('📊 Appointments data:', appData);
        setAppointments(appData);

        // Lấy danh sách bác sĩ từ staffApi
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
          // Fallback: lấy từ appointments
          const doctorNames = Array.from(new Set(appData.map(a => a.doctorName).filter(Boolean)));
          const fallback = doctorNames.map((name, idx) => ({ id: `doc-${idx}`, name }));
          setProviders(fallback);
        }
      } catch (e) {
        console.error('❌ Lỗi tải dữ liệu:', e);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc dữ liệu
  const baseFiltered = appointments.filter((app) => {
    const matchDoctor = doctorFilter === 'ALL' || app.doctorName === doctorFilter;
    const matchSearch = app.patientName.toLowerCase().includes(search.toLowerCase());
    const matchFrom = !fromDate || app.appointmentDate >= fromDate;
    const matchTo = !toDate || app.appointmentDate <= toDate;
    return matchDoctor && matchSearch && matchFrom && matchTo;
  });

  // Stats tính từ baseFiltered (không bị ảnh hưởng bởi statusFilter)
  const total = baseFiltered.length;
  const pending = baseFiltered.filter(a => a.status === 'PENDING').length;
  const confirmed = baseFiltered.filter(a => a.status === 'CONFIRMED').length;
  const completed = baseFiltered.filter(a => a.status === 'COMPLETED').length;
  const cancelled = baseFiltered.filter(a => a.status === 'CANCELLED').length;

  // Dữ liệu hiển thị trên lịch: áp dụng thêm statusFilter
  const filteredAppointments = baseFiltered.filter((app) => {
    return statusFilter === 'ALL' || app.status === statusFilter;
  });

  const statusOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'CHECKED_IN', label: 'Đã đến' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  const doctorOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả bác sĩ' },
    ...providers.map(p => ({ value: p.name, label: p.name })),
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Lịch theo tháng" description="Quản lý lịch làm việc hàng tuần và các khối lịch hẹn." />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<CalendarDays size={16} />} label="Tổng" value={total} />
          <StatsCard icon={<Clock size={16} />} label="Chờ" value={pending} bgColor="bg-amber-50" iconColor="text-amber-600" />
          <StatsCard icon={<Users size={16} />} label="Xác nhận" value={confirmed} bgColor="bg-blue-50" iconColor="text-blue-600" />
          <StatsCard icon={<CheckCircle size={16} />} label="Hoàn thành" value={completed} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
          <StatsCard icon={<XCircle size={16} />} label="Đã hủy" value={cancelled} bgColor="bg-rose-50" iconColor="text-rose-600" />
        </div>
      </div>

      {/* FILTER BAR DUY NHẤT */}
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
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải dữ liệu...</div>
      ) : (
        <div className="flex-1 overflow-hidden min-h-0 rounded-[32px] shadow-sm">
          <WeeklyCalendarGrid
            currentWeekStart={new Date()}
            appointments={filteredAppointments}
            onAppointmentClick={(app) => console.log('Clicked:', app)}
          />
        </div>
      )}
    </div>
  );
}