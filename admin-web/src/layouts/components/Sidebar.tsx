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
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const currentUserRole = 'ADMIN'; 

  const menuGroups = [
    { 
      title: 'OVERVIEW', 
      allowedRoles: ['ADMIN', 'MANAGER'], 
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }
      ] 
    },
    { 
      title: 'MY PORTAL', 
      allowedRoles: ['ADMIN', 'DOCTOR', 'STAFF', 'LAB_TECH'], 
      items: [
        { name: 'My Schedule', icon: CalendarClock, path: '/my-schedule' } 
      ] 
    },
    { 
      title: 'FRONT DESK', 
      allowedRoles: ['ADMIN', 'STAFF'], 
      items: [
        { name: 'Appointments', icon: CalendarDays, path: '/appointments', exact: true },
        { name: 'Calendar View', icon: Calendar, path: '/appointments/calendar' },
        { name: 'Follow-ups', icon: PhoneCall, path: '/appointments/follow-ups' },
        { name: 'Patients', icon: Users, path: '/patients' }
      ]
    },
    { 
      title: 'CLINICAL', 
      allowedRoles: ['ADMIN', 'DOCTOR'], 
      items: [
        { name: 'Active Visits', icon: Stethoscope, path: '/medical/active-visits' },
        { name: 'Medical Records', icon: History, path: '/medical/records' }
      ]
    },
    { 
      title: 'LABORATORY', 
      allowedRoles: ['ADMIN', 'DOCTOR', 'LAB_TECH', 'STAFF'], 
      items: [
        { name: 'Lab Orders', icon: TestTube, path: '/laboratory/orders' },
        { name: 'Lab Results', icon: Archive, path: '/laboratory/results' },
      ]
    },
    { 
      title: 'PHARMACY', 
      allowedRoles: ['ADMIN', 'DOCTOR', 'STAFF'], 
      items: [
        { name: 'Medicine Inventory', icon: Pill, path: '/pharmacy/inventory' }, 
        // { name: 'Purchase Orders', icon: ClipboardPlus, path: '/pharmacy/purchase-orders' },
        // { name: 'Suppliers', icon: Truck, path: '/pharmacy/suppliers' }, 
        { name: 'Dispense Rx', icon: ClipboardPlus, path: '/pharmacy/prescriptions' }
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
      title: 'ADMINISTRATION', 
      allowedRoles: ['ADMIN'], 
      items: [
        { name: 'Staff List', icon: BriefcaseMedical, path: '/staffs', exact: true },
        // { name: 'Leave Requests', icon: CalendarOff, path: '/staffs/leave-requests' }
      ]
    },
    { 
      title: 'COMMUNICATIONS', 
      allowedRoles: ['ADMIN', 'MANAGER'], 
      items: [
        { name: 'Notifications', icon: Bell, path: '/system/notifications' },
        { name: 'Patient Feedback', icon: MessageSquareHeart, path: '/system/feedback' },
        // { name: 'AI Chat Logs', icon: Bot, path: '/system/ai-chat' } 
      ]
    },
    { 
      title: 'SETTINGS', 
      allowedRoles: ['ADMIN'], 
      items: [
        { name: 'General Settings', icon: Settings, path: '/settings/general' },
        { name: 'Roles & Permissions', icon: ShieldCheck, path: '/settings/roles' }, 
        { name: 'Service Lab Catalog', icon: Layers, path: '/settings/services' }, 
        { name: 'Consultation Fees', icon: CircleDollarSign, path: '/settings/doctor_pricing' },
        { name: 'Medical Specialties', icon: Award, path: '/settings/expertise' }
      ]
    },
  ];

  const filteredMenuGroups = menuGroups.filter(group => group.allowedRoles.includes(currentUserRole));

  return (
    <aside 
      className={`${isCollapsed ? 'w-[88px]' : 'w-[260px]'} transition-all duration-300 ease-in-out bg-white border-r border-slate-200 h-screen flex-col hidden md:flex sticky top-0 overflow-hidden z-20`}
    >
      
      {/* Brand Header */}
      <div className={`flex items-center border-b border-slate-100 shrink-0 transition-all duration-300 ${isCollapsed ? 'h-16 justify-center px-2' : 'h-20 justify-between px-4'}`}>
        <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
          <img 
            src="http://localhost:8080/images/logo.png" 
            alt="Logo" 
            className={`object-contain shrink-0 transition-all duration-300 ${isCollapsed ? 'w-11 h-11' : 'w-14 h-14'}`} 
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-[13px] font-black text-slate-900 leading-tight truncate">Health Clinic</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Admin Portal</p>
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
                    title={isCollapsed ? item.name : undefined} // Tooltip khi thu gọn
                    className={`flex items-center transition-all duration-200 rounded-xl ${
                      isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                    } ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 font-bold shadow-sm border border-blue-100/50' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <item.icon size={isCollapsed ? 22 : 18} className={`${isActive ? 'text-blue-600' : 'text-slate-400'} shrink-0`} />
                    {/* Ẩn text khi thu gọn */}
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
          className={`flex items-center hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-slate-700 rounded-xl ${
            isCollapsed ? 'justify-center p-2' : 'gap-3 p-2'
          }`}
        >
          <UserCircle size={isCollapsed ? 26 : 24} className="text-slate-400 shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">My Profile & Settings</p>
            </div>
          )}
        </Link>
      </div>

    </aside>
  );
}