// features/crm/pages/Feedbacks.tsx
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { FeedbackFilterBar } from '../components/FeedbackFilterBar';
import FeedbackTable from '../components/FeedbackTable';
import ReplyDialog from '../components/ReplyDialog';
import { Feedback } from '../types/crm';
import { crmApi } from '../api/crmApi';

export default function Feedbacks() {
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [replyTarget, setReplyTarget] = useState<Feedback | null>(null);

  // Lấy dữ liệu từ API (không gửi fromDate/toDate)
  const fetchData = async () => {
    setLoading(true);
    let data: Feedback[] = [];
    const params = { search, rating: rating === 'ALL' ? undefined : rating };
    if (activeTab === 'ALL') {
      const [clinicData, doctorData] = await Promise.all([
        crmApi.getClinicFeedbacks(params),
        crmApi.getDoctorFeedbacks(params),
      ]);
      data = [...clinicData, ...doctorData];
    } else if (activeTab === 'CLINIC') {
      data = await crmApi.getClinicFeedbacks(params);
    } else {
      data = await crmApi.getDoctorFeedbacks(params);
    }
    setAllFeedbacks(data);
    setLoading(false);
  };

  // Lọc dữ liệu khi search, rating, fromDate, toDate thay đổi
  useEffect(() => {
    const filtered = allFeedbacks.filter(fb => {
      // Lọc theo từ khóa (search)
      const matchSearch = fb.patientName.toLowerCase().includes(search.toLowerCase()) ||
                          (fb.doctorName && fb.doctorName.toLowerCase().includes(search.toLowerCase()));
      
      // Lọc theo rating
      const matchRating = rating === 'ALL' || fb.rating === parseInt(rating);

      // Lọc theo khoảng ngày (client-side)
      let matchDate = true;
      if (fromDate) {
        matchDate = matchDate && fb.createdAt >= fromDate;
      }
      if (toDate) {
        matchDate = matchDate && fb.createdAt <= `${toDate}T23:59:59`;
      }

      return matchSearch && matchRating && matchDate;
    });
    setFilteredFeedbacks(filtered);
  }, [allFeedbacks, search, rating, fromDate, toDate]);

  // Lấy dữ liệu khi tab thay đổi
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Log để kiểm tra
  useEffect(() => {
    console.log('fromDate:', fromDate, 'toDate:', toDate);
  }, [fromDate, toDate]);

  const total = filteredFeedbacks.length;
  const avgRating = total > 0
    ? Math.round(filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) / total * 10) / 10
    : 0;
  const replied = filteredFeedbacks.filter(f => f.reply).length;

  const handleReply = async (feedbackId: number, reply: string) => {
    const target = filteredFeedbacks.find(f => f.feedbackId === feedbackId);
    if (target) {
      if (target.type === 'CLINIC') {
        await crmApi.replyClinicFeedback(feedbackId, reply);
      } else {
        await crmApi.replyDoctorFeedback(feedbackId, reply);
      }
      await fetchData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader
          title="Đánh giá bệnh nhân"
          description="Theo dõi phản hồi và mức độ hài lòng của bệnh nhân."
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<MessageSquare size={16} />} label="Tổng đánh giá" value={total} />
          <StatsCard
            icon={<Star size={16} />}
            label="Điểm trung bình"
            value={avgRating}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatsCard
            icon={<ThumbsUp size={16} />}
            label="Đã phản hồi"
            value={replied}
            bgColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải đánh giá...</div>
      ) : (
        <FeedbackTable
          data={filteredFeedbacks}
          onReply={(fb) => setReplyTarget(fb)}
        />
      )}

      <ReplyDialog
        isOpen={!!replyTarget}
        onClose={() => setReplyTarget(null)}
        feedback={replyTarget}
        onReply={handleReply}
      />
    </div>
  );
}