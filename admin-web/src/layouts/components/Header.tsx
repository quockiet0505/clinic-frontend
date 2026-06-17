import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
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
            className={`relative ${iconButton}`}
            title="Thông báo"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown thông báo */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Thông báo</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {loadingNotif ? (
                  <div className="p-4 text-center text-sm text-slate-400">Đang tải...</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.notificationId}
                      className="px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {notif.type === 'EMAIL' ? (
                            <Mail size={14} className="text-amber-500" />
                          ) : (
                            <Bell size={14} className="text-indigo-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {notif.content}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatDateTime(notif.sentAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400">Không có thông báo nào</div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <a
                  href="/system/notifications"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Xem tất cả
                </a>
              </div>
            </div>
          )}
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