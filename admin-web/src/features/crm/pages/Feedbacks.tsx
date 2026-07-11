import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { FeedbackFilterBar } from '../components/FeedbackFilterBar';
import FeedbackTable from '../components/FeedbackTable';
import ReplyDialog from '../components/ReplyDialog';
import { Feedback } from '../types/crm';
import { crmApi } from '../api/crmApi';
import { settingsApi } from '@/features/settings/api/settingsApi';

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [replyTarget, setReplyTarget] = useState<Feedback | null>(null);
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    const loadAiSettings = async () => {
      try {
        const settings = await settingsApi.getGeneralSettings();
        setAiEnabled(settings['AI_MODERATION_ENABLED'] === 'true');
      } catch (e) {
        console.error('Lỗi tải cấu hình AI:', e);
      }
    };
    loadAiSettings();
  }, []);

  const handleToggleAi = async () => {
    const newValue = !aiEnabled;
    try {
      await settingsApi.updateGeneralSettings({
        'AI_MODERATION_ENABLED': newValue ? 'true' : 'false'
      });
      setAiEnabled(newValue);
    } catch (e) {
      console.error('Lỗi cập nhật cấu hình AI:', e);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = {
      search: search || undefined,
      rating: rating === 'ALL' ? undefined : rating,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page: currentPage - 1,
      size: pageSize,
      sortBy: 'createdAt',
      sortDir: 'DESC' as const,
    };

    try {
      if (activeTab === 'CLINIC') {
        const res = await crmApi.getClinicFeedbacksPaged(params);
        setFeedbacks(res.content);
        setTotalElements(res.totalElements);
      } else if (activeTab === 'DOCTOR') {
        const res = await crmApi.getDoctorFeedbacksPaged(params);
        setFeedbacks(res.content);
        setTotalElements(res.totalElements);
      } else {
        const [clinicRes, doctorRes] = await Promise.all([
          crmApi.getClinicFeedbacksPaged({ ...params, page: currentPage - 1 }),
          crmApi.getDoctorFeedbacksPaged({ ...params, page: currentPage - 1 }),
        ]);
        setFeedbacks([...clinicRes.content, ...doctorRes.content]);
        setTotalElements(clinicRes.totalElements + doctorRes.totalElements);
      }
    } catch {
      setFeedbacks([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, rating, activeTab, fromDate, toDate, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rating, activeTab, fromDate, toDate]);

  const avgRating =
    feedbacks.length > 0
      ? Math.round((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length) * 10) / 10
      : 0;
  const replied = feedbacks.filter((f) => f.reply).length;

  const handleReply = async (feedbackId: number, reply: string) => {
    const target = feedbacks.find((f) => f.feedbackId === feedbackId);
    if (target) {
      if (target.type === 'CLINIC') await crmApi.replyClinicFeedback(feedbackId, reply);
      else await crmApi.replyDoctorFeedback(feedbackId, reply);
      await fetchData();
    }
  };

  const handleUpdateAiStatus = async (feedback: Feedback, status: string) => {
    try {
      if (feedback.type === 'CLINIC') {
        await crmApi.updateClinicFeedbackAiStatus(feedback.feedbackId, status);
      } else {
        await crmApi.updateDoctorFeedbackAiStatus(feedback.feedbackId, status);
      }
      await fetchData();
    } catch {
      /* toast: axios interceptor */
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <PageHeader title="Đánh giá bệnh nhân" description="Theo dõi phản hồi và mức độ hài lòng của bệnh nhân." />
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 md:ml-4 shadow-sm w-fit">
            <span className="text-xs font-semibold text-slate-600">Duyệt AI tự động:</span>
            <button
              onClick={handleToggleAi}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                aiEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  aiEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<MessageSquare size={16} />} label="Tổng đánh giá" value={totalElements} compact />
          <StatsCard icon={<Star size={16} />} label="Điểm TB (trang)" value={avgRating} bgColor="bg-amber-50" iconColor="text-amber-600" compact />
          <StatsCard icon={<ThumbsUp size={16} />} label="Đã phản hồi (trang)" value={replied} bgColor="bg-emerald-50" iconColor="text-emerald-600" compact />

        </div>
      </div>

      <FeedbackFilterBar
        search={search}
        onSearchChange={setSearch}
        rating={rating}
        onRatingChange={setRating}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <FeedbackTable
          data={feedbacks}
          onReply={(fb) => setReplyTarget(fb)}
          onUpdateAiStatus={handleUpdateAiStatus}
          loading={loading}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>


      <ReplyDialog isOpen={!!replyTarget} onClose={() => setReplyTarget(null)} feedback={replyTarget} onReply={handleReply} />
    </div>
  );
}
