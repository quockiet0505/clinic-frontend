import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Star, Loader2, EyeOff, Hospital, Stethoscope } from 'lucide-react';
import { reviewApi } from '@/features/profile/api/reviewApi';
import { formatDoctorName } from '@/utils/generatePdf';
import { toast } from 'sonner';

interface ReviewModalProps {
  appointment?: any;
  existingReview?: any;
  defaultTab?: 'doctor' | 'clinic';
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ appointment, existingReview, defaultTab, onSuccess }) => {
  const [tab, setTab] = useState<'doctor' | 'clinic'>(defaultTab || 'doctor');
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isAnonymous, setIsAnonymous] = useState(existingReview?.isAnonymous || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      if (tab === 'doctor') {
        const payload = {
          doctorId: existingReview ? existingReview.doctorId : (appointment?.mainDoctorId || appointment?.mainDoctor?.staffId),
          appointmentId: appointment?.appointmentId || appointment?.id || 0,
          rating,
          comment,
          isAnonymous
        };
        if (existingReview) {
          await reviewApi.updateDoctorReview(existingReview.reviewId, payload);
        } else {
          await reviewApi.submitDoctorReview(payload);
        }
      } else {
        const payload = {
          recordId: appointment?.recordId || 0,
          rating,
          comment,
          isAnonymous
        };
        if (existingReview) {
          await reviewApi.updateClinicReview(existingReview.feedbackId, payload);
        } else {
          if (!payload.recordId && !existingReview) {
            toast.error('Không tìm thấy hồ sơ y tế để đánh giá phòng khám');
            setIsSubmitting(false);
            return;
          }
          await reviewApi.submitClinicReview(payload);
        }
      }
      onSuccess();
    } catch {
      /* toast: axios interceptor */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden bg-white border-0 shadow-2xl">
      <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <DialogTitle className="text-xl font-black text-brand-dark flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          {existingReview ? 'Sửa Đánh giá Dịch vụ' : 'Đánh giá Dịch vụ'}
        </DialogTitle>
      </DialogHeader>

      <div className="p-6">
        {/* Tabs */}
        {!existingReview && (
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              onClick={() => { setTab('doctor'); setRating(0); setComment(''); }}
              className={`cursor-pointer flex-1 py-2.5 rounded-xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
                tab === 'doctor' ? 'bg-white text-primary-600 shadow-sm hover:bg-slate-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Stethoscope className="w-4 h-4" /> Bác sĩ
            </button>
            <button
              onClick={() => { setTab('clinic'); setRating(0); setComment(''); }}
              className={`cursor-pointer flex-1 py-2.5 rounded-xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
                tab === 'clinic' ? 'bg-white text-primary-600 shadow-sm hover:bg-slate-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Hospital className="w-4 h-4" /> Phòng khám
            </button>
          </div>
        )}

        <div className="mb-6 text-center">
          <h3 className="font-bold text-slate-800 text-[16px] mb-2">
            {tab === 'doctor' ? `Bạn đánh giá thế nào về ${formatDoctorName(existingReview?.doctorName || appointment?.doctorName || appointment?.mainDoctor?.fullName)}?` : 'Bạn cảm thấy hài lòng với dịch vụ phòng khám chứ?'}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-3 font-medium h-5">
            {rating === 1 && 'Rất không hài lòng'}
            {rating === 2 && 'Không hài lòng'}
            {rating === 3 && 'Bình thường'}
            {rating === 4 && 'Hài lòng'}
            {rating === 5 && 'Tuyệt vời!'}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-[13px] font-bold text-slate-700 mb-2">
            Chia sẻ trải nghiệm của bạn (Tuỳ chọn)
          </label>
          <textarea
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-[14px] resize-none"
            rows={4}
            placeholder="Những điều bạn ấn tượng hoặc góp ý giúp chúng tôi cải thiện..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="flex items-center gap-3 mb-8 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer" onClick={() => setIsAnonymous(!isAnonymous)}>
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isAnonymous ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300 bg-white'}`}>
             {isAnonymous && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div className="flex items-center gap-2 select-none">
             {/* eslint-disable-next-line react/jsx-no-undef */}
             <EyeOff className="w-4 h-4 text-slate-500" />
             <span className="text-[13px] font-semibold text-slate-700">Đánh giá ẩn danh</span>
          </div>
        </div>

        <div className="flex gap-3">
          <DialogClose asChild>
            <button className="cursor-pointer flex-1 px-5 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              Để sau
            </button>
          </DialogClose>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="cursor-pointer flex-1 px-5 py-3 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-200"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (existingReview ? 'Cập nhật' : 'Gửi đánh giá')}
          </button>
        </div>
      </div>
    </DialogContent>
  );
};
