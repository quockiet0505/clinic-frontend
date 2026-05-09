import React from 'react';
import { Users, CalendarDays, DollarSign, Stethoscope } from 'lucide-react';
import StatCard from '../components/StatCard';
import AppointmentStatisticsChart from '../components/AppointmentStatisticsChart';
import RecentAppointmentsList from '../components/RecentAppointmentsList';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Doctors', value: '247', trend: '+5%', isUp: true, icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Patients', value: '4,178', trend: '+12%', isUp: true, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Appointments', value: '12,178', trend: '-2%', isUp: false, icon: CalendarDays, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Revenue', value: '$55,124', trend: '+8%', isUp: true, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
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
          <h2 className="text-lg font-bold text-slate-800 mb-6">Appointment Statistics</h2>
          <AppointmentStatisticsChart />
        </div>

        {/* Right Column: List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Appointments</h2>
          <RecentAppointmentsList />
        </div>

      </div>
      
    </div>
  );
}