import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { formatDoctorName } from '@/utils/generatePdf';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, doctorName }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="relative px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800">Đánh giá dịch vụ</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary-500 fill-primary-500" />
            </div>
            <h3 className="text-slate-800 font-bold mb-1">Bạn cảm thấy thế nào về buổi khám?</h3>
            <p className="text-sm text-slate-500 font-medium">Bác sĩ: {formatDoctorName(doctorName)}</p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-10 h-10 transition-colors duration-200 ${
                    star <= (hoveredRating || rating) 
                      ? 'text-amber-400 fill-amber-400 drop-shadow-sm' 
                      : 'text-slate-200'
                  }`} 
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Góp ý thêm (Không bắt buộc)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>

          <button 
            disabled={rating === 0}
            onClick={() => {
              // Submit feedback logic
              onClose();
            }}
            className="w-full h-12 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center shadow-lg shadow-primary-500/20"
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};
