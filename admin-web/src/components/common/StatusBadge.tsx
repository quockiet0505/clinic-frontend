import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  XCircle,
  LogIn,
  Stethoscope,
  FlaskConical,
  CalendarCheck,
  UserX,
  SkipForward,
} from 'lucide-react';

interface Props {
  status: string;
}

type StatusStyle = {
  color: string;
  label: string;
  Icon?: React.ElementType;
};

const STATUS_MAP: Record<string, StatusStyle> = {
  PENDING: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Chờ xác nhận',
    Icon: Clock,
  },
  ORDERED: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Chờ xử lý',
    Icon: Clock,
  },
  UNPAID: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Chưa thanh toán',
    Icon: Clock,
  },
  CONFIRMED: {
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    label: 'Đã xác nhận',
    Icon: CalendarCheck,
  },
  CHECKED_IN: {
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    label: 'Đã Check-in',
    Icon: LogIn,
  },
  IN_PROGRESS: {
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Đang khám',
    Icon: Stethoscope,
  },
  PROCESSING: {
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Đang xử lý',
    Icon: Stethoscope,
  },
  WAITING_RESULT: {
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    label: 'Chờ kết quả',
    Icon: FlaskConical,
  },
  DONE: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Hoàn thành',
    Icon: CheckCircle2,
  },
  COMPLETED: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Hoàn thành',
    Icon: CheckCircle2,
  },
  RECEIVED: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Đã nhận',
    Icon: CheckCircle2,
  },
  ACTIVE: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Đang hoạt động',
    Icon: CheckCircle2,
  },
  APPROVED: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Đã duyệt',
    Icon: CheckCircle2,
  },
  PAID: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Đã thanh toán',
    Icon: CheckCircle2,
  },
  CANCELLED: {
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Đã huỷ',
    Icon: XCircle,
  },
  REJECTED: {
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Từ chối',
    Icon: XCircle,
  },
  REFUNDED: {
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Hoàn tiền',
    Icon: XCircle,
  },
  NO_SHOW: {
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    label: 'Vắng mặt',
    Icon: UserX,
  },
  MISSED: {
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    label: 'Quá hạn',
    Icon: UserX,
  },
  SKIPPED: {
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    label: 'Bị bỏ qua',
    Icon: SkipForward,
  },
};

const DEFAULT_STYLE: StatusStyle = {
  color: 'bg-slate-100 text-slate-600 border-slate-200',
  label: '',
};

export default function StatusBadge({ status }: Props) {
  const s = status.toUpperCase();
  const style = STATUS_MAP[s] ?? { ...DEFAULT_STYLE, label: status };
  const Icon = style.Icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-md border text-[11px] whitespace-nowrap ${style.color}`}
    >
      {Icon && <Icon size={11} className="mr-1 shrink-0" />}
      {style.label || s}
    </Badge>
  );
}
