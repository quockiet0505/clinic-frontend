import React from 'react';
import { Star, MessageSquareQuote, Calendar, Reply, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Table, { Column } from '@/components/tables/Table';
import { Feedback } from '../types/crm';
import { formatDateTime } from '@/utils/formatters';


interface Props {
  data?: Feedback[];
  onReply: (feedback: Feedback) => void;
  onUpdateAiStatus: (feedback: Feedback, status: string) => void;
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
  onUpdateAiStatus,
  loading = false,
  pagination,
}: Props) {
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <p className="text-[13px] font-medium text-slate-700 flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" /> {formatDateTime(item.createdAt)}
          </p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">#REC-{item.recordId}</p>
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
      key: 'aiStatus',
      label: 'AI Kiểm duyệt',
      className: 'w-[12%] text-center',
      noTruncate: true,
      render: (item) => {
        const status = item.aiStatus || 'PENDING';
        let badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
        let iconColor = 'text-amber-500';
        let label = 'Đang duyệt';
        let Icon = Clock;
        
        if (status === 'APPROVED') {
          badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          iconColor = 'text-emerald-500';
          Icon = CheckCircle2;
          label = 'Đã duyệt';
        } else if (status === 'REJECTED') {
          badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
          iconColor = 'text-rose-500';
          Icon = XCircle;
          label = 'Từ chối';
        }

        const dropdownKey = `${item.type}-${item.feedbackId}`;
        const isOpen = openDropdownId === dropdownKey;

        return (
          <div className="relative inline-block text-left">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdownId(isOpen ? null : dropdownKey);
              }}
              className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-md border text-[11px] whitespace-nowrap transition-all hover:brightness-95 active:scale-95 cursor-pointer ${badgeClass}`}
              title={item.aiModerationNote || 'Click để sửa trạng thái kiểm duyệt'}
            >
              <Icon size={11} className="mr-1 shrink-0" />
              {label}
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-1/2 -translate-x-1/2 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <button
                  onClick={() => {
                    onUpdateAiStatus(item, 'PENDING');
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-50/50 hover:text-amber-700 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                >
                  <Clock size={11} className="text-amber-500" />
                  Đang duyệt
                </button>
                <button
                  onClick={() => {
                    onUpdateAiStatus(item, 'APPROVED');
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-700 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                >
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  Đã duyệt
                </button>
                <button
                  onClick={() => {
                    onUpdateAiStatus(item, 'REJECTED');
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-rose-50/50 hover:text-rose-700 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                >
                  <XCircle size={11} className="text-rose-500" />
                  Từ chối
                </button>
              </div>
            )}
          </div>
        );
      },


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