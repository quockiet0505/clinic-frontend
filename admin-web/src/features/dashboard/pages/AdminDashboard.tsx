// features/dashboard/pages/AdminDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Stethoscope, Package, Users, DollarSign, FileText } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import GradientButton from '@/components/common/GradientButton';
import OverviewTab from '../components/tabs/OverviewTab';
import DoctorsTab from '../components/tabs/DoctorsTab';
import ServicesTab from '../components/tabs/ServicesTab';
import PatientsTab from '../components/tabs/PatientsTab';
import RevenueTab from '../components/tabs/RevenueTab';
import ReportDialog from '../components/common/ReportDialog';
import DashboardFilterBar from '../components/common/DashboardFilterBar';
import { dashboardApi } from '../api/dashboardApi';
import { 
  DashboardStats, 
  MonthlyStat, 
  RecentAppointment, 
  DoctorStat, 
  ServiceStat, 
  PatientStatsSummary, 
  RevenueStatsSummary,
  ReportFilter
} from '../types/dashboard';

type TabType = 'overview' | 'doctors' | 'services' | 'patients' | 'revenue';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([]);
  const [recentApts, setRecentApts] = useState<RecentAppointment[]>([]);
  const [doctorStats, setDoctorStats] = useState<DoctorStat[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStat[]>([]);
  const [patientStats, setPatientStats] = useState<PatientStatsSummary | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Tổng quan', icon: Activity },
    { key: 'doctors', label: 'Bác sĩ', icon: Stethoscope },
    { key: 'services', label: 'Dịch vụ', icon: Package },
    { key: 'patients', label: 'Bệnh nhân', icon: Users },
    { key: 'revenue', label: 'Doanh thu', icon: DollarSign },
  ];

  const fetchOverviewData = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [year]);

  const fetchTabData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === 'doctors') {
        const data = await dashboardApi.getDoctorStats(month, year);
        setDoctorStats(data);
      } else if (activeTab === 'services') {
        const data = await dashboardApi.getServiceStats(month, year);
        setServiceStats(data);
      } else if (activeTab === 'patients') {
        const data = await dashboardApi.getPatientStats(month, year);
        setPatientStats(data);
      } else if (activeTab === 'revenue') {
        const data = await dashboardApi.getRevenueStats(month, year);
        setRevenueStats(data);
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, month, year]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData();
    } else {
      fetchTabData();
    }
  }, [activeTab, fetchOverviewData, fetchTabData]);

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
      const content = await dashboardApi.previewReport(filter);
      return content;
    } catch (error) {
      console.error('Preview error:', error);
      return '';
    }
  };

  if (loading && activeTab === 'overview') {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center text-rose-500">
        Không thể tải dữ liệu
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="Bảng điều khiển" description="Tổng quan hoạt động phòng khám" />
        <div className="flex flex-wrap items-center gap-3">
          {activeTab !== 'overview' && (
            <DashboardFilterBar
              month={month}
              year={year}
              onMonthChange={setMonth}
              onYearChange={setYear}
            />
          )}
          <GradientButton onClick={() => setIsReportOpen(true)} disabled={generating}>
            <FileText size={18} className="mr-2" />
            {generating ? 'Đang tạo...' : 'Xuất báo cáo'}
          </GradientButton>
        </div>
      </div>

      {/* Tabs đẹp, mượt, có cursor */}
      <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200/60' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              <Icon size={16} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <OverviewTab stats={stats!} monthlyData={monthlyData} recentApts={recentApts} />
      )}
      {activeTab === 'doctors' && <DoctorsTab data={doctorStats} loading={loading} />}
      {activeTab === 'services' && <ServicesTab data={serviceStats} loading={loading} />}
      {activeTab === 'patients' && <PatientsTab data={patientStats} loading={loading} />}
      {activeTab === 'revenue' && <RevenueTab data={revenueStats} loading={loading} />}

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