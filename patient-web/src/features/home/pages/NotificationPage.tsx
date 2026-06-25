import React, { useEffect, useState } from 'react';
import { Bell, Calendar, CheckCircle, Info, Loader2, ArrowLeft, Clock, Inbox, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { notificationApi } from '../api/notificationApi';
import type { NotificationItem } from '../api/notificationApi';
import { followUpApi, type PatientFollowUp } from '../api/followUpApi';
import { SectionContainer } from '@/components/common';

export const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [followUps, setFollowUps] = useState<PatientFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [notifs, fus] = await Promise.all([
        notificationApi.getMyNotifications(),
        followUpApi.getMyFollowUps(),
      ]);
      setNotifications(notifs);
      setFollowUps(fus);
      if (notifs.length > 0) setSelected(notifs[0]);
    } catch {
      toast.error('Không tải được thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingFollowUps = followUps.filter((f) => f.status === 'PENDING');

  const handleConfirmFollowUp = async (followUpId: number) => {
    setActionLoading(followUpId);
    try {
      await followUpApi.confirm(followUpId);
      await loadData();
    } catch {
      /* toast: axios interceptor */
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineFollowUp = async (followUpId: number) => {
    setActionLoading(followUpId);
    try {
      await followUpApi.decline(followUpId, 'Bệnh nhân từ chối trên web');
      await loadData();
    } catch {
      /* toast: axios interceptor */
    } finally {
      setActionLoading(null);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Vừa xong';
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

  const getMeta = (type: string, content: string) => {
    const lc = content.toLowerCase();
    if (lc.includes('tái khám'))
      return { label: 'Tái khám', icon: <CalendarClock className="w-4 h-4" />, bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', badgeBg: 'bg-violet-100 text-violet-700', dot: 'bg-violet-400', headerBg: 'from-violet-50 to-primary-50', headerBorder: 'border-violet-100' };
    if (lc.includes('lịch hẹn') || lc.includes('appointment'))
      return { label: 'Lịch hẹn', icon: <Calendar className="w-4 h-4" />, bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', badgeBg: 'bg-sky-100 text-sky-700', dot: 'bg-sky-400', headerBg: 'from-sky-50 to-primary-50', headerBorder: 'border-sky-100' };
    if (lc.includes('xét nghiệm') || lc.includes('result') || lc.includes('kết quả'))
      return { label: 'Xét nghiệm', icon: <CheckCircle className="w-4 h-4" />, bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', badgeBg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400', headerBg: 'from-emerald-50 to-green-50', headerBorder: 'border-emerald-100' };
    return { label: 'Hệ thống', icon: <Info className="w-4 h-4" />, bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-200', badgeBg: 'bg-primary-100 text-primary-700', dot: 'bg-primary-400', headerBg: 'from-primary-50 to-sky-50', headerBorder: 'border-primary-100' };
  };

  const selectedMeta = selected ? getMeta(selected.type, selected.content) : null;
  const showFollowUpActions =
    selected &&
    selectedMeta?.label === 'Tái khám' &&
    pendingFollowUps.length > 0;

  return (
    <main className="w-full min-h-screen bg-[#f0f9ff]">
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-12 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-5xl relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 cursor-pointer transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Thông báo của bạn</h1>
              <p className="text-white/90 text-sm mt-0.5 drop-shadow-sm">
                {loading ? 'Đang tải...' : notifications.length > 0 ? `${notifications.length} thông báo` : 'Chưa có thông báo nào'}
              </p>
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-5xl py-8">
        {pendingFollowUps.length > 0 && (
          <div className="mb-6 rounded-2xl border border-violet-200 bg-violet-50/80 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarClock className="w-5 h-5 text-violet-600" />
              <h2 className="font-bold text-violet-900">Lịch tái khám cần xác nhận</h2>
            </div>
            <div className="space-y-3">
              {pendingFollowUps.map((fu) => (
                <div key={fu.followUpId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-violet-100">
                  <div>
                    <p className="font-semibold text-slate-800">{fu.doctorName}</p>
                    <p className="text-sm text-slate-600">{formatDateTime(fu.scheduledDatetime)}</p>
                    {fu.note && <p className="text-xs text-slate-500 mt-1">{fu.note}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={actionLoading === fu.followUpId}
                      onClick={() => handleDeclineFollowUp(fu.followUpId)}
                      className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                    >
                      Từ chối
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === fu.followUpId}
                      onClick={() => handleConfirmFollowUp(fu.followUpId)}
                      className="px-4 py-2 text-sm font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading === fu.followUpId ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-28 gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-primary-500" />
            <span className="font-medium">Đang tải thông báo...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-5">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-sky-100 rounded-full flex items-center justify-center">
              <Inbox className="w-12 h-12 text-primary-300" />
            </div>
            <div className="text-center">
              <p className="font-black text-slate-700 text-xl">Chưa có thông báo</p>
              <p className="text-slate-400 text-sm mt-2 max-w-xs">Các cập nhật về lịch hẹn, kết quả xét nghiệm sẽ xuất hiện tại đây.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-2 flex flex-col gap-2">
              {notifications.map((notif) => {
                const meta = getMeta(notif.type, notif.content);
                const isSelected = selected?.id === notif.id;
                return (
                  <button
                    key={notif.id}
                    onClick={() => setSelected(notif)}
                    className={`w-full text-left flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? `border-primary-300 bg-white shadow-md`
                        : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-primary-50/40 hover:shadow-sm'
                    }`}
                  >
                    <div className="relative mt-1.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.bg} ${meta.text} shrink-0`}>
                        {meta.icon}
                      </div>
                      {isSelected && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary-500 border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${meta.badgeBg}`}>{meta.label}</span>
                        <span className="text-[11px] text-slate-400 shrink-0">{formatTimeAgo(notif.sentAt)}</span>
                      </div>
                      <p className="text-[13px] text-slate-700 font-medium line-clamp-2 leading-snug">{notif.content}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-3">
              {selected && selectedMeta ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
                  <div className={`p-6 border-b ${selectedMeta.headerBorder} bg-gradient-to-br ${selectedMeta.headerBg}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMeta.bg} ${selectedMeta.text}`}>
                        {selectedMeta.icon}
                      </div>
                      <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${selectedMeta.badgeBg}`}>{selectedMeta.label}</span>
                    </div>
                    <h2 className="text-[17px] font-black text-brand-dark">{selected.subject || selectedMeta.label}</h2>
                    <div className="flex items-center gap-2 mt-2 text-slate-500 text-[13px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDateTime(selected.sentAt)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[15px] text-slate-700 leading-relaxed">{selected.content}</p>
                  </div>
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex flex-wrap gap-3">
                    {showFollowUpActions && pendingFollowUps[0] && (
                      <>
                        <button
                          type="button"
                          disabled={actionLoading !== null}
                          onClick={() => handleConfirmFollowUp(pendingFollowUps[0].followUpId)}
                          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Xác nhận tái khám
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading !== null}
                          onClick={() => handleDeclineFollowUp(pendingFollowUps[0].followUpId)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                        >
                          Từ chối
                        </button>
                        <a href="/appointments/book" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer">
                          Đặt lịch khám
                        </a>
                      </>
                    )}
                    {selectedMeta.label === 'Lịch hẹn' && (
                      <a href="/appointments/my" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer">
                        Xem lịch hẹn
                      </a>
                    )}
                    {selectedMeta.label === 'Xét nghiệm' && (
                      <a href="/records/lab-results" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer">
                        Xem kết quả
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                  <Bell className="w-10 h-10 text-slate-200" />
                  <p className="text-sm font-medium">Chọn một thông báo để xem chi tiết</p>
                </div>
              )}
            </div>
          </div>
        )}
      </SectionContainer>
    </main>
  );
};
