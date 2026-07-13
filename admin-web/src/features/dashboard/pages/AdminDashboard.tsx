// features/dashboard/pages/AdminDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Stethoscope, Package, Users, DollarSign, FileText, Search, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { DashboardPdfLayout } from '../components/common/DashboardPdfLayout';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardStats, MonthlyStat, RecentAppointment, ReportFilter, RevenueStatsSummary, RevenueMonthlyTrend, ServiceStat } from '../types/dashboard';

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(new Set(['overview']));
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([]);
  const [recentApts, setRecentApts] = useState<RecentAppointment[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueMonthlyTrend[]>([]);
  const [topServices, setTopServices] = useState<ServiceStat[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [reportData, setReportData] = useState<{ filter: ReportFilter, stats: DashboardStats, revenue: RevenueStatsSummary } | null>(null);
  const [reportAction, setReportAction] = useState<'pdf' | 'print' | null>(null);

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
      const currentMonth = new Date().getMonth() + 1;
      const [statsData, monthlyStats, recent, revenueData, serviceData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getMonthlyStats(year),
        dashboardApi.getRecentAppointments(8),
        dashboardApi.getRevenueStatsPaged({ year, month: currentMonth, page: 0, size: 12 }),
        dashboardApi.getServiceStatsPaged({ year, month: currentMonth, page: 0, size: 5, sortBy: 'totalOrders', sortDir: 'DESC' }),
      ]);
      setStats(statsData);
      setMonthlyData(monthlyStats);
      setRecentApts(recent);
      setRevenueTrend(revenueData.monthlyTrend || []);
      setTopServices(serviceData.content || []);
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

  const fetchReportData = async (filter: ReportFilter) => {
    try {
      setGenerating(true);
      const currentStats = await dashboardApi.getStats();
      const targetMonth = filter.period === 'month' ? filter.month : (filter.quarter ? filter.quarter * 3 : new Date().getMonth() + 1);

      const revenueData = await dashboardApi.getRevenueStatsPaged({
        month: targetMonth,
        year: filter.year,
        page: 0,
        size: 100
      });

      const data = { filter, stats: currentStats, revenue: revenueData as RevenueStatsSummary };
      setReportData(data);
      return data;
    } catch (error) {
      console.error('Error fetching report data:', error);
      alert('Không thể lấy dữ liệu báo cáo');
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const handleExportExcel = async (filter: ReportFilter) => {
    const data = await fetchReportData(filter);
    if (!data) return;
    const { exportDashboardToExcel } = await import('@/utils/excelExport');
    await exportDashboardToExcel(data.filter, data.stats, data.revenue);
    setIsReportOpen(false);
  };

  const handleExportPdf = async (filter: ReportFilter) => {
    const data = await fetchReportData(filter);
    if (data) setReportAction('pdf');
  };

  const handlePrint = async (filter: ReportFilter) => {
    const data = await fetchReportData(filter);
    if (data) setReportAction('print');
  };

  useEffect(() => {
    if (reportAction && reportData) {
      const executeAction = async () => {
        await new Promise(r => setTimeout(r, 100)); // Wait for DOM render

        if (reportAction === 'pdf') {
          const { generatePdf } = await import('@/utils/generatePdf');
          const periodLabel = reportData.filter.period === 'month' ? `T${reportData.filter.month}` : `Q${reportData.filter.quarter}`;
          await generatePdf('dashboard-pdf-layout', `BaoCao_${reportData.filter.type}_${periodLabel}_${reportData.filter.year}.pdf`);
        } else if (reportAction === 'print') {
          const { printPdfLayout } = await import('@/utils/generatePdf');
          await printPdfLayout('dashboard-pdf-layout', 'Báo cáo thống kê');
        }

        setReportAction(null);
        setIsReportOpen(false);
      };
      executeAction();
    }
  }, [reportAction, reportData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Bảng điều khiển"
          breadcrumbs={[
            { label: 'Trang chủ', path: '/dashboard' },
            { label: 'Tổng quan' },
            { label: 'Bảng điều khiển' }
          ]}
        />
        <div className="flex flex-wrap items-center gap-3">
          {activeTab !== 'overview' && (
            <DashboardFilterBar month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
          )}
          <button
            onClick={() => navigate('/dashboard/ai-evaluation')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            <Brain size={18} />
            Tiến trình AI
          </button>
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
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
        <OverviewTab
          stats={stats}
          monthlyData={monthlyData}
          recentApts={recentApts}
          revenueTrend={revenueTrend}
          topServices={topServices}
        />
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
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
        loading={generating}
      />

      {reportData && (
        <DashboardPdfLayout
          id="dashboard-pdf-layout"
          filter={reportData.filter}
          stats={reportData.stats}
          revenue={reportData.revenue}
        />
      )}
    </div>
  );
}
