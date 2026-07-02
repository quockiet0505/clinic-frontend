import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { crmApi } from '@/features/crm/api/crmApi';
import { AppNotification } from '@/features/crm/types/crm';
import { formatDateTime } from '@/utils/formatters';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userEmail = user?.email || 'Unknown User';
  const displayRole = user?.roles?.[0] || 'GUEST';
  const avatarLetter = userEmail.charAt(0).toUpperCase();

  // Lấy thông báo khi component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotif(true);
      try {
        const data = await crmApi.getNotifications({});
        const sorted = data
          .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
          .slice(0, 5);
        setNotifications(sorted);
      } catch (error) {
        console.error('Lỗi lấy thông báo:', error);
      } finally {
        setLoadingNotif(false);
      }
    };
    fetchNotifications();
  }, []);

  // Click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const iconButton =
    'h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer';

  return (
    <header
      className="
        h-16
        bg-white/95
        backdrop-blur-sm
        border-b
        border-slate-200
        px-6
        sticky
        top-0
        z-20
        flex
        items-center
        justify-between
        shadow-sm
        shrink-0
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 min-w-0">
        <button onClick={onMenuClick} className={iconButton}>
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-800 truncate">Dashboard</h1>
          <p className="text-xs text-slate-500 truncate">Hệ thống quản lý phòng khám</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <button
          className={iconButton}
          title="Cài đặt"
          onClick={() => (window.location.href = '/settings/general')}
        >
          <Settings size={18} />
        </button>

        {/* Thông báo */}
        <div className="relative" ref={dropdownRef}>
          <button
            className={`relative h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${showNotifications
                ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-200/50'
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600 border border-slate-200'
              }`}
            title="Thông báo"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (() => {
            const todayStr = new Date().toDateString();
            const todayItems = notifications.filter(n => new Date(n.sentAt).toDateString() === todayStr);
            const earlierItems = notifications.filter(n => new Date(n.sentAt).toDateString() !== todayStr);

            return (
              <div className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">Thông báo</span>
                    {notifications.length > 0 && (
                      <span className="text-[10px] font-bold bg-red-50 text-red-500 rounded-full px-2 py-0.5">
                        {notifications.length} mới
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Body */}
                <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                  {loadingNotif ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Đang tải...</span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
                      <Bell size={28} className="text-slate-200" />
                      <p className="text-sm">Không có thông báo mới</p>
                    </div>
                  ) : (
                    <>
                      {/* TODAY */}
                      {todayItems.length > 0 && (
                        <div>
                          <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hôm nay</p>
                          {todayItems.map(notif => (
                            <a
                              key={notif.notificationId}
                              href="/system/notifications"
                              onClick={() => setShowNotifications(false)}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50/50 transition-colors group cursor-pointer border-b border-slate-50 last:border-0"
                            >
                              <div className="shrink-0 mt-0.5 h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                {notif.type === 'EMAIL'
                                  ? <Mail size={13} className="text-amber-500" />
                                  : <Bell size={13} className="text-blue-500" />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-slate-700 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                                  {notif.content}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {new Date(notif.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <div className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-blue-500" />
                            </a>
                          ))}
                        </div>
                      )}
                      {/* EARLIER */}
                      {earlierItems.length > 0 && (
                        <div>
                          <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trước đó</p>
                          {earlierItems.map(notif => (
                            <a
                              key={notif.notificationId}
                              href="/system/notifications"
                              onClick={() => setShowNotifications(false)}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 last:border-0"
                            >
                              <div className="shrink-0 mt-0.5 h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                {notif.type === 'EMAIL'
                                  ? <Mail size={13} className="text-slate-400" />
                                  : <Bell size={13} className="text-slate-400" />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-slate-500 line-clamp-2 leading-snug group-hover:text-slate-700 transition-colors">
                                  {notif.content}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {new Date(notif.sentAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 px-4 py-2">
                  <a
                    href="/system/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Xem tất cả <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="mx-2 h-8 w-px bg-slate-200" />

        {/* USER CARD */}
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-3
            py-2
            hover:shadow-sm
            transition-all
          "
        >
          {/* Avatar */}
          <div
            className="
              h-10
              w-10
              rounded-xl
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-sm
              shrink-0
            "
          >
            {avatarLetter}
          </div>

          {/* User info */}
          <div className="hidden md:flex flex-col min-w-0">
            <span
              className="
                text-sm
                font-semibold
                text-slate-800
                truncate
                max-w-[180px]
              "
              title={userEmail}
            >
              {userEmail}
            </span>

            <span
              className="
                mt-1
                w-fit
                rounded-full
                bg-blue-50
                px-2
                py-0.5
                text-[10px]
                font-semibold
                text-blue-700
              "
            >
              {displayRole}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            title="Đăng xuất"
            className="
              h-9
              w-9
              flex
              items-center
              justify-center
              rounded-xl
              text-slate-400
              hover:text-red-600
              hover:bg-red-50
              transition-all
              cursor-pointer
            "
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}