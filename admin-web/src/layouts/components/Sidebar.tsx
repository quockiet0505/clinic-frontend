import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Calendar, PhoneCall,
  Users, Stethoscope, History, TestTube, Archive, BookOpen,
  Pill, ClipboardPlus, FileText, BriefcaseMedical, CalendarClock,
  Settings, CircleDollarSign, Award, Building2, ChevronLeft,
  UserCircle, ReceiptText, CalendarOff, MessageSquareHeart, Bell,
  Truck, Bot, ShieldCheck, Layers,
  TrendingDown, Tags, Undo2, HeartPulse,
} from 'lucide-react';

// 1. ĐỊNH NGHĨA PROPS CHO SIDEBAR
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  logoUrl?: string;
}

export default function Sidebar({ isCollapsed, onToggle, logoUrl = `${import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:8080'}/images/logo.png` }: SidebarProps) {
  const location = useLocation();
  const currentUserRole = 'ADMIN';

  const menuGroups = [
    {
      title: 'TỔNG QUAN',
      allowedRoles: ['ADMIN', 'MANAGER'],
      items: [
        { name: 'Bảng điều khiển', icon: LayoutDashboard, path: '/dashboard' },
      ]
    },
    {
      title: 'CÁ NHÂN',
      allowedRoles: ['ADMIN', 'DOCTOR', 'STAFF', 'LAB_TECH'],
      items: [
        { name: 'Lịch làm việc', icon: CalendarClock, path: '/my-schedule' },
      ]
    },
    {
      title: 'TIẾP TÂN',
      allowedRoles: ['ADMIN', 'STAFF'],
      items: [
        { name: 'Lịch hẹn', icon: CalendarDays, path: '/appointments', exact: true },
        { name: 'Lịch theo tháng', icon: Calendar, path: '/appointments/calendar' },
        { name: 'Nhắc nhở tái khám', icon: PhoneCall, path: '/appointments/follow-ups' },
        { name: 'Bệnh nhân', icon: Users, path: '/patients' },
      ]
    },
    {
      title: 'KHÁM BỆNH',
      allowedRoles: ['ADMIN', 'DOCTOR'],
      items: [
        { name: 'Chuẩn bị khám', icon: HeartPulse, path: '/medical/triage' },
        { name: 'Đang khám', icon: Stethoscope, path: '/medical/active-visits' },
        { name: 'Hồ sơ bệnh án', icon: History, path: '/medical/records' },
      ]
    },
    {
      title: 'XÉT NGHIỆM',
      allowedRoles: ['ADMIN', 'DOCTOR', 'LAB_TECH', 'STAFF'],
      items: [
        { name: 'Chỉ định XN', icon: TestTube, path: '/laboratory/orders' },
        { name: 'Kết quả XN', icon: Archive, path: '/laboratory/results' },
      ]
    },
    {
      title: 'NHÀ THUỐC',
      allowedRoles: ['ADMIN', 'DOCTOR', 'STAFF'],
      items: [
        { name: 'Danh mục thuốc', icon: Pill, path: '/pharmacy/inventory' },
        { name: 'Đơn thuốc', icon: ClipboardPlus, path: '/pharmacy/prescriptions' },
      ]
    },
    {
      title: 'QUẢN TRỊ',
      allowedRoles: ['ADMIN'],
      items: [
        { name: 'Nhân viên', icon: BriefcaseMedical, path: '/staffs', exact: true },
        { name: 'Duyệt đơn nghỉ phép', icon: CalendarOff, path: '/staffs/leave-requests' },
      ]
    },
    {
      title: 'GIAO TIẾP',
      allowedRoles: ['ADMIN', 'MANAGER'],
      items: [
        { name: 'Thông báo', icon: Bell, path: '/system/notifications' },
        { name: 'Phản hồi', icon: MessageSquareHeart, path: '/system/feedback' },
      ]
    },
    {
      title: 'CÀI ĐẶT',
      allowedRoles: ['ADMIN'],
      items: [
        { name: 'Cài đặt chung', icon: Settings, path: '/settings/general' },
        { name: 'Phân quyền', icon: ShieldCheck, path: '/settings/roles' },
        { name: 'Danh mục Dịch vụ', icon: Layers, path: '/settings/services' },
        { name: 'Phí khám bệnh', icon: CircleDollarSign, path: '/settings/doctor_pricing' },
        { name: 'Chuyên khoa', icon: Award, path: '/settings/expertise' },
      ]
    },
  ];

  const filteredMenuGroups = menuGroups.filter(group => group.allowedRoles.includes(currentUserRole));


  return (
    <aside
      className={`${isCollapsed ? 'w-[72px]' : 'w-[252px]'} transition-all duration-300 ease-in-out bg-white border-r border-slate-200 h-screen flex-col hidden md:flex sticky top-0 overflow-hidden z-20`}
    >

      {/* ── Header / Logo ── compact h-16 */}
      <div className={`flex items-center border-b border-slate-100 shrink-0 transition-all duration-300 ${
        isCollapsed ? 'h-14 justify-center px-2' : 'h-16 justify-between px-4'
      }`}>
        <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className={`object-contain shrink-0 transition-all duration-300 ${isCollapsed ? 'w-14 h-14' : 'h-9'}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = `flex items-center justify-center font-bold rounded-xl bg-blue-600 text-white ${isCollapsed ? 'w-8 h-8 text-xs' : 'w-8 h-8 text-sm'}`;
                  fallback.innerText = 'TC';
                  parent.insertBefore(fallback, e.currentTarget);
                  e.currentTarget.remove();
                }
              }}
            />
          ) : (
            <div className={`flex items-center justify-center font-bold rounded-xl bg-blue-600 text-white ${isCollapsed ? 'w-8 h-8 text-xs' : 'w-8 h-8 text-sm'}`}>
              TC
            </div>
          )}
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-black text-slate-800 leading-tight truncate">TrustCare</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-slate-400 truncate">Admin Portal</span>
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* ── Navigation Links ── */}
      <div className={`flex-1 overflow-y-auto pb-4 space-y-5 custom-scrollbar ${isCollapsed ? 'px-3 mt-4' : 'px-4 mt-2'}`}>
        {filteredMenuGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {!isCollapsed ? (
              <p className="text-[10px] font-bold text-slate-400 mb-2 px-2 uppercase tracking-widest whitespace-nowrap">
                {group.title}
              </p>
            ) : (
              <div className="w-6 h-px bg-slate-200 mx-auto mb-3 mt-1" />
            )}

            <div className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    title={isCollapsed ? item.name : undefined}
                    className={`
                      flex items-center transition-all duration-150 rounded-xl group
                      ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'}
                      ${isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-200/50'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
                      }
                    `}
                  >
                    <item.icon
                      size={isCollapsed ? 20 : 18}
                      className={`shrink-0 transition-colors duration-150 ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="text-sm tracking-wide whitespace-nowrap">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>


      {/* ── User Profile Footer ── */}
      <div className={`border-t border-slate-100 shrink-0 transition-all ${isCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}>
        <Link
          to="/profile"
          title={isCollapsed ? 'Hồ sơ' : undefined}
          className={`flex items-center hover:bg-slate-100 transition-all text-slate-700 rounded-xl ${
            isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'
          }`}
        >
          {/* Gradient avatar */}
          <div className={`shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold ${
            isCollapsed ? 'w-8 h-8 text-xs' : 'w-8 h-8 text-xs'
          }`}>
            QT
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="text-[13px] font-bold text-slate-800 truncate">Quản trị viên</p>
              <p className="text-[11px] text-slate-400 truncate">Hồ sơ &amp; Cài đặt</p>
            </div>
          )}
        </Link>
      </div>

    </aside>
  );
}