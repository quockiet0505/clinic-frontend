import React from 'react';
import { Star, MessageSquareQuote, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Feedback } from '../types/crm';
import { formatDateTime } from '@/utils/formatters';

export default function FeedbackTable({ data }: { data: Feedback[] }) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
    ));
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14 border-b border-slate-200 hover:bg-transparent">
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] px-8 w-[20%]">Ngày & Hồ sơ</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[25%]">Bệnh nhân & Bác sĩ</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[20%]">Đánh giá</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[35%]">Bình luận</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(fb => (
            <TableRow key={fb.feedbackId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5"><Calendar size={13} className="text-slate-400" /> {formatDateTime(fb.createdAt)}</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-widest mt-0.5">#REC-{fb.recordId}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-900 text-[14px]">{fb.patientName}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">BS. {fb.doctorName}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">{renderStars(fb.rating)}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-md">
                  <MessageSquareQuote size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-slate-700 italic">"{fb.comment}"</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}