import React from 'react';
import { Star, MessageSquareQuote, Calendar, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Table, { Column } from '@/components/tables/Table';
import { Feedback } from '../types/crm';
import { formatDateTime } from '@/utils/formatters';

interface Props {
  data?: Feedback[];
  onReply: (feedback: Feedback) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function FeedbackTable({
  data = [],
  onReply,
  loading = false,
  pagination,
}: Props) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
    ));
  };

  const columns: Column<Feedback>[] = [
    {
      key: 'createdAt',
      label: 'Ngày & Hồ sơ',
      className: 'w-[15%]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" /> {formatDateTime(item.createdAt)}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">#REC-{item.recordId}</p>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân / Bác sĩ',
      className: 'w-[20%]',
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800 text-sm">{item.patientName}</p>
          {item.doctorName && (
            <p className="text-xs font-medium text-slate-500 mt-0.5">BS. {item.doctorName}</p>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Đánh giá',
      className: 'w-[15%]',
      render: (item) => <div className="flex items-center gap-1">{renderStars(item.rating)}</div>,
    },
    {
      key: 'comment',
      label: 'Bình luận',
      className: 'w-[35%]',
      render: (item) => (
        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-md">
          <MessageSquareQuote size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-slate-700 italic truncate" title={item.comment}>
            "{item.comment}"
          </p>
        </div>
      ),
    },
    {
      key: 'reply',
      label: 'Phản hồi',
      className: 'w-[15%]',
      render: (item) =>
        item.reply ? (
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
            <p className="text-sm font-medium text-emerald-800 truncate" title={item.reply}>
              {item.reply}
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              Phản hồi lúc {item.repliedAt ? formatDateTime(item.repliedAt) : ''}{' '}
              {item.repliedBy && `bởi ${item.repliedBy}`}
            </p>
          </div>
        ) : (
          <Button
            onClick={() => onReply(item)}
            variant="outline"
            className="h-8 px-4 rounded-xl text-xs font-semibold border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Reply size={14} className="mr-1.5" /> Phản hồi
          </Button>
        ),
    },
  ];

  return (
    <div className="h-full w-full">
      <Table
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="Không có đánh giá nào."
        pagination={pagination}
        rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
      />
    </div>
  );
}