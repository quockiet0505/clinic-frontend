import React, { useEffect, useState, useMemo } from 'react';
import { Star, MessageSquare, Hospital, Stethoscope, ChevronRight, MessageCircle, Edit, LayoutList } from 'lucide-react';
import { reviewApi } from '../api/reviewApi';
import type { DoctorFeedbackResponse, ClinicFeedbackResponse } from '../api/reviewApi';
import { toast } from 'sonner';
import { SectionContainer, DateFilter } from '@/components/common';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';
import { ReviewModal } from '../../appointments/components/ReviewModal';

export const MyReviews: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'doctor' | 'clinic'>('all');
  const [doctorReviews, setDoctorReviews] = useState<DoctorFeedbackResponse[]>([]);
  const [clinicReviews, setClinicReviews] = useState<ClinicFeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const allReviews = useMemo(() => {
    const combined = [
      ...doctorReviews.map(r => ({ ...r, type: 'doctor' as const, id: `doc-${r.reviewId}` })),
      ...clinicReviews.map(r => ({ ...r, type: 'clinic' as const, id: `cli-${r.feedbackId}` }))
    ];
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [doctorReviews, clinicReviews]);

  const filteredReviews = useMemo(() => {
    let result = allReviews;
    if (tab !== 'all') {
      result = result.filter(r => r.type === tab);
    }
    if (fromDate) {
      result = result.filter(r => new Date(r.createdAt) >= new Date(fromDate));
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(r => new Date(r.createdAt) <= end);
    }
    return result;
  }, [allReviews, tab, fromDate, toDate]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [doctors, clinics] = await Promise.all([
        reviewApi.getMyDoctorReviews(),
        reviewApi.getMyClinicReviews()
      ]);
      setDoctorReviews(doctors);
      setClinicReviews(clinics);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-100'}`}
          />
        ))}
      </div>
    );
  };

  const isWithin24Hours = (dateString: string) => {
    const reviewDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    return (now - reviewDate) / (1000 * 60 * 60) < 24;
  };

  const EmptyState = () => (
    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
      <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-700">Chưa có đánh giá nào</h3>
      <p className="text-slate-500 mt-2 text-sm">
        {tab === 'all' ? 'Bạn chưa gửi đánh giá nào.' : (tab === 'doctor' ? 'Bạn chưa gửi đánh giá nào cho bác sĩ.' : 'Bạn chưa gửi đánh giá nào cho phòng khám.')}
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <SectionContainer className="max-w-5xl relative z-10">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-3">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')}>Trang chủ</span>
            <span className="text-white/40">/</span>
            <span className="text-white">Lịch sử đánh giá</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  Lịch sử đánh giá
                </h1>
                <p className="text-white/90 text-sm drop-shadow-sm">
                  Quản lý các đánh giá về chất lượng dịch vụ của bạn
                </p>
              </div>
            </div>
            {/* Tab switcher in hero */}
            <div className="bg-white/20 p-1 rounded-xl flex gap-1 h-11 border border-white/30 shadow-sm overflow-x-auto">
              <button
                onClick={() => setTab('all')}
                className={`cursor-pointer flex items-center gap-2 px-4 h-full rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${
                  tab === 'all'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <LayoutList className="w-4 h-4" /> Tất cả
              </button>
              <button
                onClick={() => setTab('doctor')}
                className={`cursor-pointer flex items-center gap-2 px-4 h-full rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${
                  tab === 'doctor'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Stethoscope className="w-4 h-4" /> Bác sĩ
              </button>
              <button
                onClick={() => setTab('clinic')}
                className={`cursor-pointer flex items-center gap-2 px-4 h-full rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${
                  tab === 'clinic'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Hospital className="w-4 h-4" /> Phòng khám
              </button>
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-5xl py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[16px] font-bold text-slate-700">
              {filteredReviews.length} đánh giá {tab !== 'all' ? (tab === 'doctor' ? 'bác sĩ' : 'phòng khám') : ''}
            </h2>
            <DateFilter 
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onClear={() => { setFromDate(''); setToDate(''); }}
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="h-40 bg-slate-100 animate-pulse rounded-3xl"></div>
              <div className="h-40 bg-slate-100 animate-pulse rounded-3xl"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {review.type === 'doctor' ? (
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[11px] font-bold uppercase tracking-wider">
                            Bác sĩ
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-bold uppercase tracking-wider">
                            Phòng khám
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-lg text-brand-dark flex items-center gap-2">
                        {review.type === 'doctor' ? `BS. ${(review as DoctorFeedbackResponse).doctorName}` : 'Phòng khám Đa Khoa CLINIQA'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 font-medium">{new Date(review.createdAt).toLocaleString('vi-VN')} {review.isAnonymous ? '• (Ẩn danh)' : ''}</p>
                      {isWithin24Hours(review.createdAt) && (
                        <button
                          onClick={() => { setEditingReview(review); setIsModalOpen(true); }}
                          className="text-[13px] font-bold text-primary-600 hover:text-primary-700 mt-2 flex items-center gap-1.5 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" /> Sửa đánh giá
                        </button>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.comment && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 text-[14px]">
                      "{review.comment}"
                    </div>
                  )}
                  {review.reply && (
                    <div className="mt-2 flex gap-3 items-start bg-primary-50/50 p-4 rounded-2xl border border-primary-100">
                      <MessageCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">
                          Phòng khám phản hồi
                        </p>
                        <p className="text-slate-700 text-[14px] leading-relaxed">
                          {review.reply}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                          {review.repliedBy || 'Ban Quản Trị'} • {new Date(review.repliedAt!).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {isModalOpen && editingReview && (
          <ReviewModal
            existingReview={editingReview}
            defaultTab={editingReview.type === 'clinic' ? 'clinic' : 'doctor'}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditingReview(null);
              fetchReviews();
            }}
          />
        )}
      </Dialog>
    </main>
  );
};
