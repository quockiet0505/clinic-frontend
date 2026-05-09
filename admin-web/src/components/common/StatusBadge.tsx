import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Props { status: string; }

export default function StatusBadge({ status }: Props) {
  let color = 'bg-slate-100 text-slate-600 border-slate-200';
  let Icon = null;

  const s = status.toUpperCase();
  if (['COMPLETED', 'RECEIVED', 'DONE', 'ACTIVE', 'APPROVED', 'PAID'].includes(s)) {
    color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    Icon = CheckCircle2;
  } else if (['PENDING', 'ORDERED', 'UNPAID'].includes(s)) {
    color = 'bg-amber-100 text-amber-700 border-amber-200';
    Icon = Clock;
  } else if (['IN_PROGRESS', 'PROCESSING', 'CHECKED_IN'].includes(s)) {
    color = 'bg-blue-100 text-blue-700 border-blue-200';
  } else if (['CANCELLED', 'REJECTED', 'NO_SHOW', 'MISSED', 'REFUNDED'].includes(s)) {
    color = 'bg-rose-100 text-rose-700 border-rose-200';
    Icon = XCircle;
  }

  return (
    <Badge variant="outline" className={`font-bold px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap ${color}`}>
      {Icon && <Icon size={12} className="mr-1.5 inline" />}
      {status}
    </Badge>
  );
}