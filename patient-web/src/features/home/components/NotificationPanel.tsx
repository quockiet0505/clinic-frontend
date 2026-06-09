import React, { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, CheckCircle, Info } from 'lucide-react';

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      title: 'Nhắc nhở lịch hẹn',
      message: 'Bạn có lịch hẹn khám với Dr. Nguyễn Văn A vào lúc 09:00 sáng mai.',
      time: '2 giờ trước',
      type: 'appointment',
      isRead: false,
    },
    {
      id: 2,
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả xét nghiệm máu tổng quát của bạn đã có.',
      time: '1 ngày trước',
      type: 'result',
      isRead: true,
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Thông báo</h3>
            <button className="text-xs font-bold text-primary-600 hover:text-primary-700">Đánh dấu đã đọc</button>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`flex gap-4 p-3 rounded-2xl transition-colors cursor-pointer ${notif.isRead ? 'hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
              >
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'appointment' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {notif.type === 'appointment' ? <Calendar className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${notif.isRead ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>{notif.title}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">{notif.time}</span>
                  </div>
                  <p className={`text-[13px] leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100">
            <button className="w-full py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              Xem tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
