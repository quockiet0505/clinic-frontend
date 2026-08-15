import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, Phone, Mail, User, Info } from 'lucide-react';
import Table, { Column } from '@/components/tables/Table';
import { ContactMessage } from '../types/crm';
import { formatDateTime } from '@/utils/formatters';

interface Props {
  data?: ContactMessage[];
  onUpdateStatus: (message: ContactMessage, status: string) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function ContactMessageTable({
  data = [],
  onUpdateStatus,
  loading = false,
  pagination,
}: Props) {
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
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

  const columns: Column<ContactMessage>[] = [
    {
      key: 'createdAt',
      label: 'Thời gian & ID',
      className: 'w-[15%]',
      render: (item) => (
        <div>
          <p className="text-[13px] font-medium text-slate-700 flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" /> {formatDateTime(item.createdAt)}
          </p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">#MSG-{item.messageId}</p>
        </div>
      ),
    },
    {
      key: 'fullName',
      label: 'Người gửi',
      className: 'w-[20%]',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
            <User size={13} className="text-slate-400" /> {item.fullName}
          </p>
          <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
            <Phone size={11} className="text-slate-400" /> {item.phone}
          </p>
          {item.email && (
            <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
              <Mail size={11} className="text-slate-400" /> {item.email}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'content',
      label: 'Nội dung',
      className: 'w-[40%]',
      render: (item) => (
        <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase">
            <Info size={12} className="text-blue-400" /> Chủ đề: {item.subject}
          </p>
          <p className="text-sm font-medium text-slate-700 italic break-words line-clamp-3">
            "{item.content}"
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[15%] text-center',
      noTruncate: true,
      render: (item) => {
        let badgeClass = 'bg-slate-50 text-slate-700 border-slate-200';
        let iconColor = 'text-slate-500';
        let label = 'Không xác định';
        let Icon = Info;
        
        if (item.status === 'PENDING') {
          badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
          iconColor = 'text-amber-500';
          Icon = Clock;
          label = 'Đang chờ';
        } else if (item.status === 'PROCESSING') {
          badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
          iconColor = 'text-blue-500';
          Icon = Info;
          label = 'Đang xử lý';
        } else if (item.status === 'RESOLVED') {
          badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          iconColor = 'text-emerald-500';
          Icon = CheckCircle2;
          label = 'Đã giải quyết';
        } else if (item.status === 'REJECTED') {
          badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
          iconColor = 'text-rose-500';
          Icon = XCircle;
          label = 'Từ chối';
        }

        const isOpen = openDropdownId === item.messageId;

        return (
          <div className="relative inline-block text-left">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdownId(isOpen ? null : item.messageId);
              }}
              className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-md border text-[11px] whitespace-nowrap transition-all hover:brightness-95 active:scale-95 cursor-pointer ${badgeClass}`}
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
                    onUpdateStatus(item, 'PENDING');
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-50/50 hover:text-amber-700 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                >
                  <Clock size={11} className="text-amber-500" /> Đang chờ
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(item, 'PROCESSING');
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50/50 hover:text-blue-700 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                >
                  <Info size={11} className="text-blue-500" /> Đang xử lý
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(item, 'RESOLVED');
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-700 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                >
                  <CheckCircle2 size={11} className="text-emerald-500" /> Đã giải quyết
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(item, 'REJECTED');
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-rose-50/50 hover:text-rose-700 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                >
                  <XCircle size={11} className="text-rose-500" /> Từ chối
                </button>
              </div>
            )}
          </div>
        );
      },
    }
  ];

  return (
    <div className="h-full w-full">
      <Table
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="Không có tin nhắn liên hệ nào."
        pagination={pagination}
        rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
      />
    </div>
  );
}
