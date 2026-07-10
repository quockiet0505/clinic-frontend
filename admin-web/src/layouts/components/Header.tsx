import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  ArrowRight,
  CheckCheck,
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
  const [lastReadId, setLastReadId] = useState<number>(() => {
    return Number(localStorage.getItem('admin_last_read_notif_id') || 0);
  });
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
            className={`relative h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${showNotifications
                ? 'bg-blue-50 text-blue-600 shadow-[0_2px_12px_rgba(59,130,246,0.15)] border-blue-200 ring-2 ring-blue-100/50'
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600 border border-slate-200'
              }`}
            title="Thông báo"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} className={showNotifications ? 'animate-wiggle' : ''} />
            {notifications.filter(n => n.notificationId > lastReadId).length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-rose-500 text-white text-[9px] font-extrabold items-center justify-center border-2 border-white shadow-sm">
                  {notifications.filter(n => n.notificationId > lastReadId).length > 9 
                    ? '9+' 
                    : notifications.filter(n => n.notificationId > lastReadId).length}
                </span>
              </span>
            )}
          </button>

          {showNotifications && (() => {
            const unreadItemsCount = notifications.filter(n => n.notificationId > lastReadId).length;
            const todayStr = new Date().toDateString();
            const todayItems = notifications.filter(n => new Date(n.sentAt).toDateString() === todayStr);
            const earlierItems = notifications.filter(n => new Date(n.sentAt).toDateString() !== todayStr);

            return (
              <div className="absolute right-0 top-full mt-2.5 w-[360px] bg-white/98 backdrop-blur-md rounded-2xl shadow-[0_12px_36px_-4px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] border border-slate-200/60 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1.5 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-slate-800">Thông báo của bạn</span>
                    {unreadItemsCount > 0 && (
                      <span className="text-[10px] font-bold bg-rose-50 text-rose-500 rounded-full px-2 py-0.5 border border-rose-100">
                        {unreadItemsCount} mới
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadItemsCount > 0 && (
                      <button
                        onClick={() => {
                          if (notifications.length > 0) {
                            const maxId = Math.max(...notifications.map(n => n.notificationId));
                            localStorage.setItem('admin_last_read_notif_id', String(maxId));
                            setLastReadId(maxId);
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-200/50 shadow-sm active:scale-95 cursor-pointer"
                        title="Đánh dấu đã đọc tất cả"
                      >
                        <CheckCheck size={12} />
                        Đã xem
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-slate-100/60">
                  {loadingNotif ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">Đang tải thông báo...</span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Bell size={22} className="text-slate-300" />
                      </div>
                      <p className="text-xs font-medium text-slate-500">Tuyệt vời! Bạn không có thông báo nào.</p>
                    </div>
                  ) : (
                    <>
                      {/* TODAY */}
                      {todayItems.length > 0 && (
                        <div>
                          <p className="px-5 pt-3.5 pb-1.5 text-[9px] font-bold text-slate-400/80 uppercase tracking-wider">Hôm nay</p>
                          {todayItems.map(notif => {
                            const isUnread = notif.notificationId > lastReadId;
                            return (
                              <a
                                key={notif.notificationId}
                                href="/system/notifications"
                                onClick={() => setShowNotifications(false)}
                                className={`flex items-start gap-3.5 px-5 py-3.5 transition-all group cursor-pointer border-l-2 border-b border-slate-100/30 last:border-b-0 ${
                                  isUnread 
                                    ? 'border-blue-500 bg-blue-50/10 hover:bg-blue-50/20' 
                                    : 'border-transparent hover:bg-slate-50/60'
                                }`}
                              >
                                <div className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${
                                  isUnread 
                                    ? 'bg-blue-50 text-blue-600 border-blue-100/50 group-hover:bg-blue-100/50' 
                                    : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-slate-100'
                                }`}>
                                  {notif.type === 'EMAIL'
                                    ? <Mail size={15} className={isUnread ? "text-amber-500" : "text-slate-400"} />
                                    : <Bell size={15} className={isUnread ? "text-blue-500" : "text-slate-400"} />
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[13px] line-clamp-2 leading-snug transition-colors ${
                                    isUnread ? 'font-semibold text-slate-800 group-hover:text-blue-600' : 'font-medium text-slate-500 group-hover:text-slate-800'
                                  }`}>
                                    {notif.content}
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1">
                                    {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />}
                                    {new Date(notif.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      )}
                      {/* EARLIER */}
                      {earlierItems.length > 0 && (
                        <div>
                          <p className="px-5 pt-3.5 pb-1.5 text-[9px] font-bold text-slate-400/80 uppercase tracking-wider">Trước đó</p>
                          {earlierItems.map(notif => {
                            const isUnread = notif.notificationId > lastReadId;
                            return (
                              <a
                                key={notif.notificationId}
                                href="/system/notifications"
                                onClick={() => setShowNotifications(false)}
                                className={`flex items-start gap-3.5 px-5 py-3.5 transition-all group cursor-pointer border-l-2 border-b border-slate-100/30 last:border-b-0 ${
                                  isUnread 
                                    ? 'border-blue-500 bg-blue-50/10 hover:bg-blue-50/20' 
                                    : 'border-transparent hover:bg-slate-50/60'
                                }`}
                              >
                                <div className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${
                                  isUnread 
                                    ? 'bg-blue-50 text-blue-600 border-blue-100/50 group-hover:bg-blue-100/50' 
                                    : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-slate-100'
                                }`}>
                                  {notif.type === 'EMAIL'
                                    ? <Mail size={15} className={isUnread ? "text-amber-500" : "text-slate-400"} />
                                    : <Bell size={15} className={isUnread ? "text-blue-500" : "text-slate-400"} />
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[13px] line-clamp-2 leading-snug transition-colors ${
                                    isUnread ? 'font-semibold text-slate-800 group-hover:text-blue-600' : 'font-medium text-slate-500 group-hover:text-slate-800'
                                  }`}>
                                    {notif.content}
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1">
                                    {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />}
                                    {new Date(notif.sentAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} • {new Date(notif.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 bg-slate-50/30 px-5 py-3">
                  <a
                    href="/system/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl border border-blue-100 hover:border-blue-600 transition-all duration-300 shadow-sm"
                  >
                    Xem tất cả thông báo <ArrowRight size={12} />
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