import React, { useEffect, useState } from 'react';
import { Users, CalendarDays, DollarSign, Stethoscope } from 'lucide-react';
import StatCard from '../components/StatCard';
import AppointmentStatisticsChart from '../components/AppointmentStatisticsChart';
import RecentAppointmentsList from '../components/RecentAppointmentsList';
import { patientApi } from '@/features/patients/api/patientApi';
import { appointmentApi } from '@/features/appointments/api/appointmentApi';
import { staffApi } from '@/features/staffs/api/staffApi';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    totalStaff: 0,
    appointmentsTotal: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patients, appointments, staffs] = await Promise.all([
          patientApi.getAll(),
          appointmentApi.getAll(),
          staffApi.getAll()
        ]);
        
        const today = new Date().toISOString().split('T')[0];
        const todayApts = appointments.filter(a => a.appointmentDate === today).length;

        setStatsData({
          totalPatients: patients.length,
          appointmentsToday: todayApts,
          totalStaff: staffs.length,
          appointmentsTotal: appointments.length
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: 'Tổng bệnh nhân', value: statsData.totalPatients.toString(), trend: '+5%', isUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Lịch hẹn hôm nay', value: statsData.appointmentsToday.toString(), trend: '+12%', isUp: true, icon: CalendarDays, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Tổng lịch hẹn', value: statsData.appointmentsTotal.toString(), trend: '+2%', isUp: true, icon: CalendarDays, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Nhân viên', value: statsData.totalStaff.toString(), trend: '+0%', isUp: true, icon: Stethoscope, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Bảng điều khiển</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Thống kê Lịch hẹn</h2>
          <AppointmentStatisticsChart />
        </div>

        {/* Right Column: List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Lịch hẹn gần đây</h2>
          <RecentAppointmentsList />
        </div>

      </div>
      
    </div>
  );
}