// features/dashboard/pages/AdminDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Stethoscope, Package, Users, DollarSign, FileText, Search } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import GradientButton from '@/components/common/GradientButton';
import OverviewTab from '../components/tabs/OverviewTab';
import DoctorsTab from '../components/tabs/DoctorsTab';
import ServicesTab from '../components/tabs/ServicesTab';
import PatientsTab from '../components/tabs/PatientsTab';
import RevenueTab from '../components/tabs/RevenueTab';
import StaffTab from '../components/tabs/StaffTab';
import ReportDialog from '../components/common/ReportDialog';
import DashboardFilterBar from '../components/common/DashboardFilterBar';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardStats, MonthlyStat, RecentAppointment, ReportFilter } from '../types/dashboard';

type TabType = 'overview' | 'doctors' | 'services' | 'patients' | 'revenue' | 'staff';

const EMPTY_STATS: DashboardStats = {
  totalPatients: 0,
  appointmentsToday: 0,
  appointmentsThisWeek: 0,
  completedAppointments: 0,
  cancelledAppointments: 0,
  noShowAppointments: 0,
  pendingAppointments: 0,
  totalAppointments: 0,
  totalStaff: 0,
  totalDoctors: 0,
  totalFeedbacks: 0,
  avgRating: 0,
  monthlyRevenue: 0,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(new Set(['overview']));
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([]);
  const [recentApts, setRecentApts] = useState<RecentAppointment[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Tổng quan', icon: Activity },
    { key: 'doctors', label: 'Bác sĩ', icon: Stethoscope },
    { key: 'services', label: 'Dịch vụ', icon: Package },
    { key: 'patients', label: 'Bệnh nhân', icon: Users },
    { key: 'revenue', label: 'Doanh thu', icon: DollarSign },
    { key: 'staff', label: 'Nhân viên', icon: Users },
  ];

  const fetchOverviewData = useCallback(async () => {
    try {
      const [statsData, monthlyStats, recent] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getMonthlyStats(year),
        dashboardApi.getRecentAppointments(8),
      ]);
      setStats(statsData);
      setMonthlyData(monthlyStats);
      setRecentApts(recent);
    } catch (error) {
      console.error('Error loading overview:', error);
    }
  }, [year]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  useEffect(() => {
    setVisitedTabs((prev) => new Set(prev).add(activeTab));
  }, [activeTab]);

  const handleGenerateReport = async (filter: ReportFilter) => {
    try {
      setGenerating(true);
      const blob = await dashboardApi.generateReport(filter);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const periodLabel = filter.period === 'month' ? `Thang${filter.month}` : `Quy${filter.quarter}`;
      link.download = `BaoCao_${filter.type}_${periodLabel}_${filter.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsReportOpen(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Không thể tạo báo cáo. Vui lòng thử lại.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = async (filter: ReportFilter): Promise<string> => {
    try {
      return await dashboardApi.previewReport(filter);
    } catch (error) {
      console.error('Preview error:', error);
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="Bảng điều khiển" description="Tổng quan hoạt động phòng khám" />
        <div className="flex flex-wrap items-center gap-3">
          {activeTab !== 'overview' && (
            <DashboardFilterBar month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
          )}
          <GradientButton onClick={() => setIsReportOpen(true)} disabled={generating}>
            <FileText size={18} className="mr-2" />
            {generating ? 'Đang tạo...' : 'Xuất báo cáo'}
          </GradientButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0 px-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all w-48 sm:w-56"
          />
        </div>
      </div>

      <div className={activeTab === 'overview' ? '' : 'hidden'}>
        <OverviewTab stats={stats} monthlyData={monthlyData} recentApts={recentApts} />
      </div>
      {visitedTabs.has('doctors') && (
        <div className={activeTab === 'doctors' ? '' : 'hidden'}>
          <DoctorsTab month={month} year={year} searchTerm={searchTerm} />
        </div>
      )}
      {visitedTabs.has('services') && (
        <div className={activeTab === 'services' ? '' : 'hidden'}>
          <ServicesTab month={month} year={year} searchTerm={searchTerm} />
        </div>
      )}
      {visitedTabs.has('patients') && (
        <div className={activeTab === 'patients' ? '' : 'hidden'}>
          <PatientsTab month={month} year={year} searchTerm={searchTerm} />
        </div>
      )}
      {visitedTabs.has('revenue') && (
        <div className={activeTab === 'revenue' ? '' : 'hidden'}>
          <RevenueTab month={month} year={year} searchTerm={searchTerm} />
        </div>
      )}
      {visitedTabs.has('staff') && (
        <div className={activeTab === 'staff' ? '' : 'hidden'}>
          <StaffTab searchTerm={searchTerm} />
        </div>
      )}

      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onGenerate={handleGenerateReport}
        onPreview={handlePreview}
        loading={generating}
      />
    </div>
  );
}
