import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Calendar, PhoneCall,
  Users, Stethoscope, History, TestTube, Archive, BookOpen,
  Pill, ClipboardPlus, FileText, BriefcaseMedical, CalendarClock,
  Settings, CircleDollarSign, Award, Building2, ChevronLeft,
  UserCircle, ReceiptText, CalendarOff, MessageSquareHeart, Bell,
  Truck, Bot, ShieldCheck, Layers,
  TrendingDown, Tags, Undo2
} from 'lucide-react';

// 1. ĐỊNH NGHĨA PROPS CHO SIDEBAR
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  logoUrl?: string;
}

export default function Sidebar({ isCollapsed, onToggle, logoUrl = "http://localhost:8080/images/logo.png" }: SidebarProps) {
  const location = useLocation();
  const currentUserRole = 'ADMIN';

  const menuGroups = [
    {
      title: 'TỔNG QUAN',
      allowedRoles: ['ADMIN', 'MANAGER'],
      items: [
        { name: 'Bảng điều khiển', icon: LayoutDashboard, path: '/dashboard' }
      ]
    },
    {
      title: 'CÁ NHÂN',
      allowedRoles: ['ADMIN', 'DOCTOR', 'STAFF', 'LAB_TECH'],
      items: [
        { name: 'Lịch làm việc', icon: CalendarClock, path: '/my-schedule' }
      ]
    },
    {
      title: 'TIẾP TÂN',
      allowedRoles: ['ADMIN', 'STAFF'],
      items: [
        { name: 'Lịch hẹn', icon: CalendarDays, path: '/appointments', exact: true },
        { name: 'Lịch theo tháng', icon: Calendar, path: '/appointments/calendar' },
        { name: 'Nhắc nhở tái khám', icon: PhoneCall, path: '/appointments/follow-ups' },
        { name: 'Bệnh nhân', icon: Users, path: '/patients' }
      ]
    },
    {
      title: 'KHÁM BỆNH',
      allowedRoles: ['ADMIN', 'DOCTOR', 'STAFF'],
      items: [
        { name: 'Chuẩn bị khám', icon: ClipboardPlus, path: '/medical/triage' },
        { name: 'Đang khám', icon: Stethoscope, path: '/medical/active-visits' },
        { name: 'Hồ sơ bệnh án', icon: History, path: '/medical/records' }
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
        { name: 'Phát thuốc', icon: ClipboardPlus, path: '/pharmacy/prescriptions' }
      ]
    },
    /*
    { 
      title: 'INVOICE & FINANCE', 
      allowedRoles: ['ADMIN', 'STAFF'], 
      items: [
        { name: 'Invoices', icon: FileText, path: '/billing/invoices' },
        { name: 'Expenses', icon: ReceiptText, path: '/finance/expenses' },
        { name: 'Categories', icon: Tags, path: '/finance/categories' },
        { name: 'Refunds', icon: Undo2, path: '/finance/refunds' }
      ] 
    },
    */
    {
      title: 'QUẢN TRỊ',
      allowedRoles: ['ADMIN'],
      items: [
        { name: 'Nhân viên', icon: BriefcaseMedical, path: '/staffs', exact: true },
        // { name: 'Leave Requests', icon: CalendarOff, path: '/staffs/leave-requests' }
      ]
    },
    {
      title: 'GIAO TIẾP',
      allowedRoles: ['ADMIN', 'MANAGER'],
      items: [
        { name: 'Thông báo', icon: Bell, path: '/system/notifications' },
        { name: 'Phản hồi', icon: MessageSquareHeart, path: '/system/feedback' },
        // { name: 'AI Chat Logs', icon: Bot, path: '/system/ai-chat' } 
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
        { name: 'Chuyên khoa', icon: Award, path: '/settings/expertise' }
      ]
    },
  ];

  const filteredMenuGroups = menuGroups.filter(group => group.allowedRoles.includes(currentUserRole));

  return (
    <aside
      className={`${isCollapsed ? 'w-[88px]' : 'w-[260px]'} transition-all duration-300 ease-in-out bg-white border-r border-slate-200 h-screen flex-col hidden md:flex sticky top-0 overflow-hidden z-20`}
    >

      <div className={`flex items-center border-b border-slate-100 shrink-0 transition-all duration-300 ${isCollapsed ? 'h-14 justify-center px-2' : 'h-24 justify-between px-4'
        }`}>
        <div className={`flex items-center gap-4 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className={`object-contain shrink-0 transition-all duration-300 ${isCollapsed ? 'w-18 h-18' : 'w-24 h-24'
                }`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = `flex items-center justify-center font-bold rounded-xl bg-blue-100 text-blue-700 ${isCollapsed ? 'w-8 h-8 text-sm' : 'w-20 h-20 text-3xl'
                    }`;
                  fallback.innerText = 'TC';
                  parent.insertBefore(fallback, e.currentTarget);
                  e.currentTarget.remove();
                }
              }}
            />
          ) : (
            <div className={`flex items-center justify-center font-bold rounded-xl bg-blue-100 text-blue-700 ${isCollapsed ? 'w-8 h-8 text-sm' : 'w-20 h-20 text-3xl'
              }`}>
              TC
            </div>
          )}
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-md font-black text-slate-800 leading-tight truncate">
                TrustCare 
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-500 truncate">Admin Portal</span>
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className={`flex-1 overflow-y-auto pb-4 space-y-6 custom-scrollbar ${isCollapsed ? 'px-3 mt-4' : 'px-4 mt-0'}`}>
        {filteredMenuGroups.map((group, idx) => (
          <div key={idx}>
            {/* Đổi tiêu đề thành dấu gạch ngang khi thu gọn */}
            {!isCollapsed ? (
              <p className="text-[10px] font-bold text-slate-400 mb-2 px-2 uppercase tracking-widest whitespace-nowrap">{group.title}</p>
            ) : (
              <div className="w-6 h-px bg-slate-200 mx-auto mb-3 mt-1"></div>
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
                    {/* Icon size cố định, không đổi khi active */}
                    <item.icon 
                      size={isCollapsed ? 20 : 18} 
                      className={`shrink-0 transition-colors duration-150 ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`} 
                    />
                    {!isCollapsed && <span className="text-sm tracking-wide whitespace-nowrap">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile / Bottom Actions */}
      <div className={`p-4 border-t border-slate-100 shrink-0 bg-slate-50 transition-all ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Link
          to="/profile"
          title={isCollapsed ? "Admin User" : undefined}
          className={`flex items-center hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-slate-700 rounded-xl ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2'
            }`}
        >
          <UserCircle size={isCollapsed ? 26 : 24} className="text-slate-400 shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Quản trị viên</p>
              <p className="text-xs text-slate-500 truncate">Hồ sơ & Cài đặt</p>
            </div>
          )}
        </Link>
      </div>

    </aside>
  );
}