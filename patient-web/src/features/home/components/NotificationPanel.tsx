import React, { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, CheckCircle, Info, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../api/notificationApi';
import type { NotificationItem } from '../api/notificationApi';

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationApi.getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) fetchNotifications();
    setIsOpen(!isOpen);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Vừa xong';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày`;
  };

  const getTitle = (type: string, content: string) => {
    if (content.toLowerCase().includes('lịch hẹn') || content.toLowerCase().includes('appointment')) return 'Lịch hẹn';
    if (content.toLowerCase().includes('xét nghiệm') || content.toLowerCase().includes('result')) return 'Xét nghiệm';
    return 'Hệ thống';
  };

  const getIcon = (title: string) => {
    if (title === 'Lịch hẹn') return <Calendar className="w-4 h-4" />;
    if (title === 'Xét nghiệm') return <CheckCircle className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  const getColors = (title: string) => {
    if (title === 'Lịch hẹn') return 'bg-amber-50 text-amber-600 border-amber-100';
    if (title === 'Xét nghiệm') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleToggle}
        className={`relative p-2.5 rounded-full transition-colors cursor-pointer ${
          isOpen ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-slate-800 text-[14px]">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="bg-rose-100 text-rose-600 text-[11px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </div>
            <button
              onClick={handleViewAll}
              className="text-[12px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[320px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-sm">Đang tải...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-[13px] font-medium">Chưa có thông báo nào</p>
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-1">
                {notifications.slice(0, 5).map((notif) => {
                  const title = getTitle(notif.type, notif.content);
                  return (
                    <button
                      key={notif.id}
                      onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                      className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${getColors(title)}`}>
                        {getIcon(title)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[11px] font-bold text-slate-500">{title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{formatTimeAgo(notif.sentAt)} trước</span>
                        </div>
                        <p className="text-[12px] leading-snug text-slate-700 font-medium line-clamp-2">{notif.content}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60">
              <button
                onClick={handleViewAll}
                className="w-full py-2 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-white hover:text-blue-700 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                Xem lịch sử đầy đủ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
