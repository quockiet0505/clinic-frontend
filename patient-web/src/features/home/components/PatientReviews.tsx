// src/features/home/components/PatientReviews.tsx
import React, { useState } from 'react';
import { Star, Building2, Stethoscope, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { SectionContainer } from '@/components/common';

interface Review {
  id: number;
  type: 'CLINIC' | 'DOCTOR';
  patientName: string;
  isAnonymous: boolean;
  rating: number;
  comment: string;
  createdAt: string;
  doctorName?: string;
  doctorExpertise?: string;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

interface Props {
  data: ReviewSummary | null;
  isLoading?: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${star <= rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-slate-200 fill-slate-200'}`}
      />
    ))}
  </div>
);

const ReviewCard: React.FC<{ review: Review; featured?: boolean }> = ({ review, featured }) => {
  const isDoctor = review.type === 'DOCTOR';
  const date = new Date(review.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]
        flex flex-col gap-3 transition-all duration-300
        hover:shadow-[0_8px_28px_rgba(0,181,241,0.12)] hover:-translate-y-0.5
        ${featured ? 'p-7 md:col-span-1' : 'p-5'}
      `}
    >
      {/* Header: nhãn loại + số sao */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full
            ${isDoctor
              ? 'bg-[#e0f2fe] text-[#0369a1]'
              : 'bg-[#dcfce7] text-[#166534]'
            }`}
        >
          {isDoctor ? (
            <><Stethoscope className="w-3.5 h-3.5" /> Đánh giá Bác sĩ</>
          ) : (
            <><Building2 className="w-3.5 h-3.5" /> Đánh giá Phòng khám</>
          )}
        </span>
        <StarRating rating={review.rating} />
      </div>

      {/* Tên bác sĩ (chỉ khi type = DOCTOR) */}
      {isDoctor && review.doctorName && (
        <p className="text-[13px] font-medium text-[#0369a1]">
          {review.doctorName}
          {review.doctorExpertise && (
            <span className="text-slate-400 font-normal"> — {review.doctorExpertise}</span>
          )}
        </p>
      )}

      {/* Nội dung bình luận */}
      <div className="relative flex-1">
        <Quote className="absolute -top-1 -left-1 w-5 h-5 text-slate-100 fill-slate-100" />
        <p className={`text-slate-600 leading-relaxed pl-5 ${featured ? 'text-[15px]' : 'text-[14px] line-clamp-4'}`}>
          {review.comment}
        </p>
      </div>

      {/* Footer: tên bệnh nhân + ngày */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bae6fd] to-[#7dd3fc] flex items-center justify-center text-[#0369a1] text-[13px] font-bold select-none">
            {review.isAnonymous ? '?' : (review.patientName?.[0] || 'B')}
          </div>
          <span className="text-[13px] font-medium text-slate-700">{review.patientName}</span>
        </div>
        <span className="text-[12px] text-slate-400">{date}</span>
      </div>
    </div>
  );
};

export const PatientReviews: React.FC<Props> = ({ data, isLoading }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  if (isLoading) {
    return (
      <section className="py-14 bg-gradient-to-b from-white to-[#f0f9ff]">
        <SectionContainer className="max-w-[1200px]">
          <div className="h-8 w-64 bg-slate-200 rounded mx-auto mb-10 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-52 animate-pulse border border-slate-100">
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-5/6 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-4/6" />
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>
    );
  }

  if (!data || !data.reviews || data.reviews.length === 0) return null;

  const { averageRating, totalReviews, reviews } = data;
  const visibleReviews = reviews.slice(0, visibleCount);
  const totalAvailable = reviews.length;
  const remainingReviews = totalAvailable - visibleCount;

  // Tính số lượng tăng thêm và nhãn hiển thị cho click tiếp theo
  let nextStepAdd = 10;
  let buttonLabel = '';

  if (visibleCount < 16) {
    nextStepAdd = 10;
    if (remainingReviews <= 10) {
      buttonLabel = `Xem thêm đánh giá (${remainingReviews})`;
    } else {
      buttonLabel = `Xem thêm đánh giá (10)`;
    }
  } else {
    nextStepAdd = 50;
    if (remainingReviews <= 50) {
      buttonLabel = `Xem thêm đánh giá (${remainingReviews})`;
    } else {
      buttonLabel = `Xem thêm 50 đánh giá`;
    }
  }

  const handleExpand = () => {
    if (remainingReviews <= nextStepAdd) {
      setVisibleCount(totalAvailable);
    } else {
      setVisibleCount(visibleCount + nextStepAdd);
    }
  };

  const handleCollapse = () => {
    setVisibleCount(6);
  };

  return (
    <section id="patient-reviews-section" className="py-14 bg-gradient-to-b from-[#e0f2fe] to-white">
      <SectionContainer className="max-w-[1200px]">
        {/* Tiêu đề section */}
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0F3B63] text-center mb-3 uppercase">
          Ý KIẾN KHÁCH HÀNG TIÊU BIỂU
        </h2>
        <p className="text-center text-slate-500 text-[15px] mb-8">
          Những chia sẻ chân thực từ các bệnh nhân đã trải nghiệm dịch vụ
        </p>

        {/* Aggregate Score — kiểu Highlight */}
        {totalReviews > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-3 bg-white border border-[#bae6fd] rounded-2xl px-6 py-3.5 shadow-[0_2px_12px_rgba(0,181,241,0.1)]">
              <span className="text-[36px] font-extrabold text-[#0F3B63] leading-none">
                {averageRating?.toFixed(1)}
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-slate-200 fill-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-[13px] text-slate-500 font-medium">
                  Dựa trên <strong className="text-[#0F3B63]">{totalReviews}+</strong> đánh giá
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Grid đánh giá */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleReviews.map((review, index) => (
            <ReviewCard key={`${review.type}-${review.id}`} review={review} featured={index === 0} />
          ))}
        </div>

        {/* Nút Xem thêm / Thu gọn đa giai đoạn */}
        <div className="flex justify-center gap-4 mt-8">
          {remainingReviews > 0 ? (
            <button
              onClick={handleExpand}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#00b5f1] bg-white text-[#00b5f1] font-semibold text-[14px] hover:bg-[#00b5f1] hover:text-white transition-all duration-300 cursor-pointer shadow-sm animate-in fade-in"
            >
              <ChevronDown className="w-4 h-4" />
              {buttonLabel}
            </button>
          ) : null}

          {visibleCount > 6 && (
            <button
              onClick={handleCollapse}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#00b5f1] bg-white text-[#00b5f1] font-semibold text-[14px] hover:bg-[#00b5f1] hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
            >
              <ChevronUp className="w-4 h-4" /> Thu gọn
            </button>
          )}
        </div>
      </SectionContainer>
    </section>
  );
};


