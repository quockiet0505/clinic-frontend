// features/dashboard/components/tabs/OverviewTab.tsx
import React from 'react';
import { Users, CalendarDays, Clock, CheckCircle, Stethoscope, MessageSquare, Calendar } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import AppointmentStatisticsChart from '../charts/AppointmentStatisticsChart';
import RecentAppointmentsList from '../RecentAppointmentsList';
import { DashboardStats, MonthlyStat, RecentAppointment } from '../../types/dashboard';

interface Props {
  stats: DashboardStats;
  monthlyData: MonthlyStat[];
  recentApts: RecentAppointment[];
}

export default function OverviewTab({ stats, monthlyData, recentApts }: Props) {
  const statItems = [
    { icon: <Users size={16} />, label: 'Tổng bệnh nhân', value: stats.totalPatients, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: <CalendarDays size={16} />, label: 'Lịch hẹn hôm nay', value: stats.appointmentsToday, bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: <Clock size={16} />, label: 'Chờ xác nhận', value: stats.pendingAppointments, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
    { icon: <CheckCircle size={16} />, label: 'Hoàn thành', value: stats.completedAppointments, bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: <Stethoscope size={16} />, label: 'Bác sĩ', value: stats.totalDoctors, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: <MessageSquare size={16} />, label: 'Phản hồi', value: `${stats.totalFeedbacks} (${stats.avgRating}★)`, bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statItems.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Chart & Recent Appointments - equal height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Chart - chiếm 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <Calendar size={18} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-600">Thống kê lịch hẹn theo tháng</h3>
          </div>
          <div className="flex-1 min-h-0">
            <AppointmentStatisticsChart data={monthlyData} />
          </div>
        </div>

        {/* Recent Appointments - chiếm 1/3 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <CalendarDays size={18} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-600">Lịch hẹn gần đây</h3>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <RecentAppointmentsList appointments={recentApts} />
          </div>
        </div>
      </div>
    </div>
  );
}