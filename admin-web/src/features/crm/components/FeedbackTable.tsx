import React from 'react';
import { Star, MessageSquareQuote, Calendar, Reply } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Feedback } from '../types/crm';
import { formatDateTime } from '@/utils/formatters';

interface Props {
  data: Feedback[];
  onReply: (feedback: Feedback) => void;
}

export default function FeedbackTable({ data, onReply }: Props) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
    ));
  };

  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium text-sm">Không có đánh giá nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-auto custom-scrollbar">
      <Table className="min-w-[1000px]">
        <TableHeader className="bg-slate-100/80 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%] text-sm">Ngày & Hồ sơ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%] text-sm">Bệnh nhân / Bác sĩ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%] text-sm">Đánh giá</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%] text-sm">Bình luận</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%] text-sm">Phản hồi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((fb) => (
            <TableRow key={fb.feedbackId} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" /> {formatDateTime(fb.createdAt)}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">#REC-{fb.recordId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="font-semibold text-slate-800 text-sm">{fb.patientName}</p>
                {fb.doctorName && (
                  <p className="text-xs font-medium text-slate-500 mt-0.5">BS. {fb.doctorName}</p>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1">{renderStars(fb.rating)}</div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-md">
                  <MessageSquareQuote size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-slate-700 italic">"{fb.comment}"</p>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                {fb.reply ? (
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                    <p className="text-sm font-medium text-emerald-800">{fb.reply}</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Phản hồi lúc {fb.repliedAt ? formatDateTime(fb.repliedAt) : ''} {fb.repliedBy && `bởi ${fb.repliedBy}`}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => onReply(fb)}
                    variant="outline"
                    className="h-8 px-4 rounded-xl text-xs font-semibold border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Reply size={14} className="mr-1.5" /> Phản hồi
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}