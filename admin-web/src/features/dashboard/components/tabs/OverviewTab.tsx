// features/dashboard/components/tabs/OverviewTab.tsx
import React, { useMemo } from 'react';
import {
  Users, CalendarCheck, TrendingUp, Star,
  Calendar, CalendarDays, BarChart2, Activity,
} from 'lucide-react';
import AppointmentRevenueTrendChart from '../charts/AppointmentRevenueTrendChart';
import AppointmentStatusDonutChart from '../charts/AppointmentStatusDonutChart';
import TopServicesBarChart from '../charts/TopServicesBarChart';
import RecentAppointmentsList from '../RecentAppointmentsList';
import {
  DashboardStats, MonthlyStat, RecentAppointment,
  RevenueMonthlyTrend, ServiceStat,
} from '../../types/dashboard';

interface Props {
  stats: DashboardStats;
  monthlyData: MonthlyStat[];
  recentApts: RecentAppointment[];
  revenueTrend: RevenueMonthlyTrend[];
  topServices: ServiceStat[];
}

/* ── Inline SVG Sparkline ─────────────────────────────────── */
function Sparkline({ data, color = '#0284c7' }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 80, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline
        points={pts}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.8}
      />
    </svg>
  );
}

/* ── KPI Card ─────────────────────────────────────────────── */
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
  shadow: string;
  sparkData?: number[];
  sparkColor?: string;
  badge?: string;
  badgeColor?: string;
}

function KpiCard({ icon, label, value, gradient, shadow, sparkData, sparkColor, badge, badgeColor }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${shadow}`}>
          {icon}
        </div>
        {badge && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
      </div>
      {sparkData && sparkData.length >= 2 && (
        <Sparkline data={sparkData} color={sparkColor} />
      )}
    </div>
  );
}

/* ── OverviewTab ──────────────────────────────────────────── */
export default function OverviewTab({ stats, monthlyData, recentApts, revenueTrend, topServices }: Props) {
  // Sparkline data từ monthlyData
  const completedSparkData = useMemo(
    () => monthlyData.map(m => m.completed),
    [monthlyData]
  );
  const revenueSparkData = useMemo(
    () => revenueTrend.slice(-8).map(r => r.revenue),
    [revenueTrend]
  );

  // Tính trend badge: tháng này vs tháng trước
  const currentMonthCompleted = monthlyData[monthlyData.length - 1]?.completed ?? 0;
  const prevMonthCompleted = monthlyData[monthlyData.length - 2]?.completed ?? 0;
  const aptTrend = prevMonthCompleted > 0
    ? Math.round(((currentMonthCompleted - prevMonthCompleted) / prevMonthCompleted) * 100)
    : null;

  const currentRevenue = revenueTrend[revenueTrend.length - 1]?.revenue ?? 0;
  const prevRevenue = revenueTrend[revenueTrend.length - 2]?.revenue ?? 0;
  const revTrend = prevRevenue > 0
    ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100)
    : null;

  const formatRevenue = (v: number) => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000) return Math.round(v / 1_000) + 'K';
    return v.toLocaleString();
  };

  return (
    <div className="space-y-6">

      {/* ── [A] 4 KPI Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Users size={20} />}
          label="Tổng bệnh nhân"
          value={stats.totalPatients.toLocaleString()}
          gradient="from-sky-400 to-sky-600"
          shadow="shadow-sky-200"
          sparkData={completedSparkData}
          sparkColor="#0284c7"
        />
        <KpiCard
          icon={<CalendarCheck size={20} />}
          label="Lịch hẹn hôm nay"
          value={stats.appointmentsToday}
          gradient="from-orange-400 to-orange-600"
          shadow="shadow-orange-200"
          badge={aptTrend !== null ? (aptTrend >= 0 ? `↗ ${aptTrend}%` : `↘ ${Math.abs(aptTrend)}%`) : undefined}
          badgeColor={aptTrend !== null && aptTrend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
        />
        <KpiCard
          icon={<TrendingUp size={20} />}
          label="Doanh thu tháng"
          value={formatRevenue(stats.monthlyRevenue) + 'đ'}
          gradient="from-indigo-400 to-indigo-600"
          shadow="shadow-indigo-200"
          sparkData={revenueSparkData}
          sparkColor="#818cf8"
          badge={revTrend !== null ? (revTrend >= 0 ? `↗ ${revTrend}%` : `↘ ${Math.abs(revTrend)}%`) : undefined}
          badgeColor={revTrend !== null && revTrend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
        />
        <KpiCard
          icon={<Star size={20} />}
          label="Đánh giá trung bình"
          value={`${stats.avgRating.toFixed(1)} ★`}
          gradient="from-amber-400 to-amber-600"
          shadow="shadow-amber-200"
          badge={`${stats.totalFeedbacks} đánh giá`}
          badgeColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* ── [B] + [C] ComposedChart + Donut ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* [B] ComposedChart – 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
              <Activity size={15} className="text-sky-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Xu hướng lịch hẹn & Doanh thu</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 ml-9">Thống kê 12 tháng trong năm</p>
          <AppointmentRevenueTrendChart monthlyData={monthlyData} revenueTrend={revenueTrend} />
        </div>

        {/* [C] Donut – 1/3 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-1 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <CalendarCheck size={15} className="text-amber-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Trạng thái hôm nay</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 ml-9">Phân bổ theo trạng thái ca khám</p>
          <div className="flex-1 min-h-0">
            <AppointmentStatusDonutChart stats={stats} />
          </div>
        </div>
      </div>

      {/* ── [D] + [E] Top Services + Recent Appointments ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Top dịch vụ được đặt nhiều nhất – 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <BarChart2 size={15} className="text-violet-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">Top dịch vụ được đặt nhiều nhất</h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Tháng này</span>
          </div>
          <p className="text-xs text-slate-400 mb-5 ml-9 shrink-0">Phản ánh hoạt động khám chữa bệnh</p>
          <div className="flex-1 min-h-0">
            <TopServicesBarChart data={topServices} />
          </div>
        </div>

        {/* Lịch hẹn gần đây – 1/3 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                <CalendarDays size={15} className="text-sky-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">Lịch hẹn gần đây</h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
              {Math.min(recentApts.length, 5)} ca
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <RecentAppointmentsList appointments={recentApts.slice(0, 5)} />
          </div>
        </div>
      </div>

    </div>
  );
}