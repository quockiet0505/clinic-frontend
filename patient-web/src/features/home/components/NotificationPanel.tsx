import React, { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, CheckCircle, Info, Loader2 } from 'lucide-react';
import { notificationApi } from '../api/notificationApi';
import type { NotificationItem } from '../api/notificationApi';

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.length; // assuming all are unread for now

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
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getTitle = (type: string, content: string) => {
    if (content.toLowerCase().includes('lịch hẹn') || content.toLowerCase().includes('appointment')) return 'Thông báo lịch hẹn';
    if (content.toLowerCase().includes('xét nghiệm') || content.toLowerCase().includes('result')) return 'Kết quả xét nghiệm';
    return 'Thông báo hệ thống';
  };

  const getIcon = (title: string) => {
    if (title === 'Thông báo lịch hẹn') return <Calendar className="w-5 h-5" />;
    if (title === 'Kết quả xét nghiệm') return <CheckCircle className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  const getIconBg = (title: string) => {
    if (title === 'Thông báo lịch hẹn') return 'bg-amber-100 text-amber-600';
    if (title === 'Kết quả xét nghiệm') return 'bg-emerald-100 text-emerald-600';
    return 'bg-blue-100 text-blue-600';
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={handleToggle}
        className={`relative p-2.5 rounded-full transition-colors ${isOpen ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Thông báo của bạn</h3>
            <button className="text-[13px] font-bold text-primary-600 hover:text-primary-700 transition-colors">Đánh dấu đã đọc</button>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                <span className="text-sm font-medium">Đang tải thông báo...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-slate-300" />
                </div>
                <span className="text-sm font-medium">Bạn chưa có thông báo nào</span>
              </div>
            ) : (
              notifications.map((notif) => {
                const title = getTitle(notif.type, notif.content);
                return (
                  <div 
                    key={notif.id}
                    className="flex gap-4 p-3 rounded-2xl transition-colors cursor-pointer bg-blue-50/40 hover:bg-blue-50/80 mb-1"
                  >
                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconBg(title)}`}>
                      {getIcon(title)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-[14px] font-bold text-slate-900">{title}</h4>
                        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap ml-2">{formatTimeAgo(notif.sentAt)}</span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-slate-600 font-medium line-clamp-2">{notif.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="p-3 border-t border-slate-100 bg-white">
            <button className="w-full py-2.5 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
